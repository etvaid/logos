#!/usr/bin/env python3
"""
Error Detection & Review Queue - Job 4

Identifies translations with issues and creates a prioritized review queue.

Issue Types:
1. Meaning drift: Translation embedding too far from meaning anchor
2. Style outlier: Style residual magnitude unusually high
3. Length anomaly: Word count ratio outside acceptable range
4. Low fluency: Sentence structure problems
5. Missing data: No embedding, no anchor, no residual

Each translation gets a priority score (0-100) with higher = more urgent.
"""

import asyncio
import asyncpg
import numpy as np
from datetime import datetime
from typing import Any, Dict, List, Optional, Set, Tuple
from dataclasses import dataclass, field
import json
import logging
from pathlib import Path
from collections import defaultdict

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

DB_URL = "postgresql://postgres:voqQePIH4adopQUa-1UUaFKnOT-mtsod@maglev.proxy.rlwy.net:49514/railway"
PAPERS_DIR = Path('/Users/royvaid/Downloads/logos/papers')

# Issue severity weights
ISSUE_WEIGHTS = {
    'meaning_drift': 30,        # Most serious
    'style_outlier': 15,        # Important but less critical
    'length_anomaly': 20,       # Can indicate truncation/padding
    'low_fluency': 10,          # Style issue
    'missing_anchor': 5,        # Data quality
    'missing_embedding': 5,     # Data quality
    'missing_residual': 3,      # Data quality
}

# Thresholds for issue detection
THRESHOLDS = {
    'meaning_similarity_critical': 0.40,  # Below this = meaning_drift
    'meaning_similarity_warning': 0.60,   # Below this = warning
    'style_residual_critical': 3.0,       # Above this = style_outlier
    'style_residual_warning': 2.0,        # Above this = warning
    'length_ratio_min': 0.4,              # Below this = length_anomaly
    'length_ratio_max': 2.5,              # Above this = length_anomaly
    'fluency_critical': 0.60,             # Below this = low_fluency
    'overall_score_critical': 0.45,       # Below this = critical review
}


@dataclass
class TranslationIssue:
    """A detected issue with a translation"""
    issue_type: str
    severity: str  # 'critical', 'warning', 'info'
    description: str
    value: Optional[float] = None
    threshold: Optional[float] = None

    def to_dict(self) -> Dict[str, Any]:
        return {
            'issue_type': self.issue_type,
            'severity': self.severity,
            'description': self.description,
            'value': self.value,
            'threshold': self.threshold
        }


@dataclass
class ReviewQueueItem:
    """An item in the review queue"""
    translation_id: int
    translator_id: int
    translator_name: str
    source_text_id: int
    source_author: str
    source_work: str

    priority_score: int  # 0-100, higher = more urgent
    issues: List[TranslationIssue]
    issue_summary: str

    # Quality scores if available
    meaning_score: Optional[float]
    style_score: Optional[float]
    fluency_score: Optional[float]
    overall_score: Optional[float]

    # Text snippets for context
    source_snippet: str
    translation_snippet: str

    def to_dict(self) -> Dict[str, Any]:
        return {
            'translation_id': self.translation_id,
            'translator_id': self.translator_id,
            'translator_name': self.translator_name,
            'source_text_id': self.source_text_id,
            'source_author': self.source_author,
            'source_work': self.source_work,
            'priority_score': self.priority_score,
            'issues': [i.to_dict() for i in self.issues],
            'issue_summary': self.issue_summary,
            'meaning_score': self.meaning_score,
            'style_score': self.style_score,
            'fluency_score': self.fluency_score,
            'overall_score': self.overall_score,
            'source_snippet': self.source_snippet,
            'translation_snippet': self.translation_snippet
        }


class ErrorDetector:
    """Detects translation issues and builds review queue"""

    def __init__(self):
        self.thresholds = THRESHOLDS
        self.weights = ISSUE_WEIGHTS

    def detect_issues(
        self,
        translation_id: int,
        meaning_score: Optional[float],
        style_score: Optional[float],
        fluency_score: Optional[float],
        overall_score: Optional[float],
        style_residual_mag: Optional[float],
        length_ratio: Optional[float],
        has_anchor: bool,
        has_embedding: bool,
        has_residual: bool
    ) -> List[TranslationIssue]:
        """Detect all issues for a translation"""

        issues = []

        # Meaning drift
        if meaning_score is not None:
            if meaning_score < self.thresholds['meaning_similarity_critical']:
                issues.append(TranslationIssue(
                    issue_type='meaning_drift',
                    severity='critical',
                    description=f'Meaning score critically low ({meaning_score:.2f})',
                    value=meaning_score,
                    threshold=self.thresholds['meaning_similarity_critical']
                ))
            elif meaning_score < self.thresholds['meaning_similarity_warning']:
                issues.append(TranslationIssue(
                    issue_type='meaning_drift',
                    severity='warning',
                    description=f'Meaning score below acceptable ({meaning_score:.2f})',
                    value=meaning_score,
                    threshold=self.thresholds['meaning_similarity_warning']
                ))

        # Style outlier
        if style_residual_mag is not None:
            if style_residual_mag > self.thresholds['style_residual_critical']:
                issues.append(TranslationIssue(
                    issue_type='style_outlier',
                    severity='critical',
                    description=f'Style residual critically high ({style_residual_mag:.2f})',
                    value=style_residual_mag,
                    threshold=self.thresholds['style_residual_critical']
                ))
            elif style_residual_mag > self.thresholds['style_residual_warning']:
                issues.append(TranslationIssue(
                    issue_type='style_outlier',
                    severity='warning',
                    description=f'Style residual above typical ({style_residual_mag:.2f})',
                    value=style_residual_mag,
                    threshold=self.thresholds['style_residual_warning']
                ))

        # Length anomaly
        if length_ratio is not None:
            if length_ratio < self.thresholds['length_ratio_min']:
                issues.append(TranslationIssue(
                    issue_type='length_anomaly',
                    severity='warning',
                    description=f'Translation too short (ratio: {length_ratio:.2f})',
                    value=length_ratio,
                    threshold=self.thresholds['length_ratio_min']
                ))
            elif length_ratio > self.thresholds['length_ratio_max']:
                issues.append(TranslationIssue(
                    issue_type='length_anomaly',
                    severity='warning',
                    description=f'Translation too long (ratio: {length_ratio:.2f})',
                    value=length_ratio,
                    threshold=self.thresholds['length_ratio_max']
                ))

        # Low fluency
        if fluency_score is not None and fluency_score < self.thresholds['fluency_critical']:
            issues.append(TranslationIssue(
                issue_type='low_fluency',
                severity='warning',
                description=f'Fluency score low ({fluency_score:.2f})',
                value=fluency_score,
                threshold=self.thresholds['fluency_critical']
            ))

        # Missing data issues
        if not has_anchor:
            issues.append(TranslationIssue(
                issue_type='missing_anchor',
                severity='info',
                description='No meaning anchor available for source text'
            ))

        if not has_embedding:
            issues.append(TranslationIssue(
                issue_type='missing_embedding',
                severity='info',
                description='Translation has no embedding vector'
            ))

        if not has_residual:
            issues.append(TranslationIssue(
                issue_type='missing_residual',
                severity='info',
                description='No style residual computed'
            ))

        return issues

    def compute_priority(self, issues: List[TranslationIssue]) -> int:
        """Compute priority score from issues"""
        priority = 0

        for issue in issues:
            base_weight = self.weights.get(issue.issue_type, 5)

            if issue.severity == 'critical':
                priority += base_weight * 2
            elif issue.severity == 'warning':
                priority += base_weight
            else:  # info
                priority += base_weight * 0.5

        return min(100, int(priority))

    def summarize_issues(self, issues: List[TranslationIssue]) -> str:
        """Create a brief summary of issues"""
        if not issues:
            return "No issues detected"

        critical = [i for i in issues if i.severity == 'critical']
        warnings = [i for i in issues if i.severity == 'warning']

        parts = []
        if critical:
            parts.append(f"{len(critical)} critical")
        if warnings:
            parts.append(f"{len(warnings)} warning")

        issue_types = set(i.issue_type for i in critical + warnings)
        return f"{', '.join(parts)}: {', '.join(issue_types)}"


async def build_review_queue(
    sample_size: int = 500,
    priority_threshold: int = 10
) -> Dict[str, Any]:
    """Build the review queue by detecting issues in translations"""

    logger.info("=" * 70)
    logger.info("ERROR DETECTION & REVIEW QUEUE")
    logger.info("=" * 70)

    detector = ErrorDetector()
    conn = await asyncpg.connect(DB_URL)

    try:
        # Get translations with their quality scores and metadata
        translations = await conn.fetch("""
            SELECT
                t.id as translation_id,
                t.translator_id,
                tr.name as translator_name,
                t.text_id as source_text_id,
                s.author as source_author,
                s.work as source_work,
                t.translation,
                t.embedding,
                s.content as source_content,
                q.meaning_score,
                q.style_score,
                q.fluency_score,
                q.overall_score,
                q.details as quality_details
            FROM translations t
            JOIN translators tr ON t.translator_id = tr.id
            JOIN source_texts s ON t.text_id = s.id
            LEFT JOIN translation_quality_scores q ON t.id = q.translation_id
            WHERE t.translation IS NOT NULL
              AND LENGTH(t.translation) > 50
            ORDER BY RANDOM()
            LIMIT $1
        """, sample_size)

        logger.info(f"Analyzing {len(translations)} translations for issues...")

        # Get sets of IDs with anchors and residuals
        anchor_ids = set(r['source_text_id'] for r in await conn.fetch(
            "SELECT DISTINCT source_text_id FROM meaning_anchors"
        ))
        residual_ids = set(r['translation_id'] for r in await conn.fetch(
            "SELECT DISTINCT translation_id FROM style_residuals"
        ))

        # Get style residual magnitudes
        residual_mags = {}
        residuals = await conn.fetch("""
            SELECT translation_id, residual FROM style_residuals
        """)
        for r in residuals:
            if r['residual']:
                try:
                    residual_val = r['residual']
                    if isinstance(residual_val, str):
                        residual_val = residual_val.strip('[]')
                        vec = np.array([float(x) for x in residual_val.split(',')])
                    else:
                        vec = np.array(residual_val)
                    residual_mags[r['translation_id']] = float(np.linalg.norm(vec))
                except:
                    pass

        # Build review queue
        review_queue = []
        issue_counts = defaultdict(int)

        for i, t in enumerate(translations):
            if i % 100 == 0:
                logger.info(f"Progress: {i+1}/{len(translations)}")

            # Extract quality scores
            meaning_score = t['meaning_score']
            style_score = t['style_score']
            fluency_score = t['fluency_score']
            overall_score = t['overall_score']

            # Get style residual magnitude
            style_residual_mag = residual_mags.get(t['translation_id'])

            # Compute length ratio
            source_words = len((t['source_content'] or '').split())
            trans_words = len((t['translation'] or '').split())
            length_ratio = trans_words / max(1, source_words)

            # Check data availability
            has_anchor = t['source_text_id'] in anchor_ids
            has_embedding = t['embedding'] is not None
            has_residual = t['translation_id'] in residual_ids

            # Detect issues
            issues = detector.detect_issues(
                translation_id=t['translation_id'],
                meaning_score=meaning_score,
                style_score=style_score,
                fluency_score=fluency_score,
                overall_score=overall_score,
                style_residual_mag=style_residual_mag,
                length_ratio=length_ratio,
                has_anchor=has_anchor,
                has_embedding=has_embedding,
                has_residual=has_residual
            )

            # Count issues
            for issue in issues:
                issue_counts[issue.issue_type] += 1

            # Compute priority
            priority = detector.compute_priority(issues)

            # Only add to queue if priority above threshold
            if priority >= priority_threshold:
                item = ReviewQueueItem(
                    translation_id=t['translation_id'],
                    translator_id=t['translator_id'],
                    translator_name=t['translator_name'],
                    source_text_id=t['source_text_id'],
                    source_author=t['source_author'] or 'Unknown',
                    source_work=t['source_work'] or 'Unknown',
                    priority_score=priority,
                    issues=issues,
                    issue_summary=detector.summarize_issues(issues),
                    meaning_score=meaning_score,
                    style_score=style_score,
                    fluency_score=fluency_score,
                    overall_score=overall_score,
                    source_snippet=(t['source_content'] or '')[:200],
                    translation_snippet=(t['translation'] or '')[:200]
                )
                review_queue.append(item)

        # Sort by priority (highest first)
        review_queue.sort(key=lambda x: x.priority_score, reverse=True)

        logger.info(f"\nFound {len(review_queue)} items needing review")
        logger.info(f"Issue counts: {dict(issue_counts)}")

        # Store review queue in database
        logger.info("Storing review queue...")

        # Create review queue table if needed
        await conn.execute("""
            CREATE TABLE IF NOT EXISTS translation_review_queue (
                id SERIAL PRIMARY KEY,
                translation_id INTEGER UNIQUE REFERENCES translations(id) ON DELETE CASCADE,
                priority_score INTEGER,
                issue_summary TEXT,
                issues JSONB,
                status VARCHAR(20) DEFAULT 'pending',
                reviewer TEXT,
                reviewed_at TIMESTAMP,
                created_at TIMESTAMP DEFAULT NOW()
            )
        """)

        for item in review_queue:
            await conn.execute("""
                INSERT INTO translation_review_queue
                (translation_id, priority_score, issue_summary, issues, status)
                VALUES ($1, $2, $3, $4, 'pending')
                ON CONFLICT (translation_id) DO UPDATE SET
                    priority_score = $2,
                    issue_summary = $3,
                    issues = $4,
                    status = 'pending'
            """,
                item.translation_id,
                item.priority_score,
                item.issue_summary,
                json.dumps([i.to_dict() for i in item.issues])
            )

        # Generate report
        summary = {
            'timestamp': datetime.now().isoformat(),
            'translations_analyzed': len(translations),
            'items_in_queue': len(review_queue),
            'priority_threshold': priority_threshold,
            'issue_counts': dict(issue_counts),
            'top_10_items': [item.to_dict() for item in review_queue[:10]]
        }

        report = generate_review_report(review_queue, summary, issue_counts)

        PAPERS_DIR.mkdir(parents=True, exist_ok=True)
        report_path = PAPERS_DIR / 'REVIEW_QUEUE_REPORT.md'
        with open(report_path, 'w') as f:
            f.write(report)

        json_path = PAPERS_DIR / 'REVIEW_QUEUE_REPORT.json'
        with open(json_path, 'w') as f:
            json.dump(summary, f, indent=2)

        logger.info(f"Reports saved to {PAPERS_DIR}")

        return summary

    finally:
        await conn.close()


def generate_review_report(
    review_queue: List[ReviewQueueItem],
    summary: Dict[str, Any],
    issue_counts: Dict[str, int]
) -> str:
    """Generate markdown report for review queue"""

    report = f"""# Translation Review Queue Report

**Generated:** {datetime.now().isoformat()}

## Summary

| Metric | Value |
|:-------|------:|
| Translations analyzed | {summary['translations_analyzed']} |
| Items in review queue | {summary['items_in_queue']} |
| Priority threshold | {summary['priority_threshold']} |

## Issue Distribution

| Issue Type | Count | Description |
|:-----------|------:|:------------|
| meaning_drift | {issue_counts.get('meaning_drift', 0)} | Translation semantics diverge from source |
| style_outlier | {issue_counts.get('style_outlier', 0)} | Style inconsistent with translator's norm |
| length_anomaly | {issue_counts.get('length_anomaly', 0)} | Translation too short or too long |
| low_fluency | {issue_counts.get('low_fluency', 0)} | Sentence structure problems |
| missing_anchor | {issue_counts.get('missing_anchor', 0)} | No meaning anchor for source |
| missing_embedding | {issue_counts.get('missing_embedding', 0)} | Translation has no embedding |
| missing_residual | {issue_counts.get('missing_residual', 0)} | No style residual computed |

## Priority Score Distribution
"""

    if review_queue:
        priorities = [item.priority_score for item in review_queue]
        report += f"""
| Range | Count |
|:------|------:|
| 80-100 (Critical) | {sum(1 for p in priorities if p >= 80)} |
| 60-79 (High) | {sum(1 for p in priorities if 60 <= p < 80)} |
| 40-59 (Medium) | {sum(1 for p in priorities if 40 <= p < 60)} |
| 20-39 (Low) | {sum(1 for p in priorities if 20 <= p < 40)} |
| 10-19 (Info) | {sum(1 for p in priorities if 10 <= p < 20)} |
"""

    report += """
## Top 10 Priority Items

| Priority | Translator | Work | Issues |
|---------:|:-----------|:-----|:-------|
"""

    for item in review_queue[:10]:
        issues_str = "; ".join(f"{i.issue_type} ({i.severity})" for i in item.issues[:3])
        if len(item.issues) > 3:
            issues_str += f"; +{len(item.issues) - 3} more"
        report += f"| {item.priority_score} | {item.translator_name} | {item.source_work} | {issues_str} |\n"

    report += """

## Issue Severity Weights

| Issue Type | Base Weight | Notes |
|:-----------|------------:|:------|
| meaning_drift | 30 | Most critical - semantic errors |
| length_anomaly | 20 | May indicate truncation/padding |
| style_outlier | 15 | Important but less critical |
| low_fluency | 10 | Style/grammar issues |
| missing_anchor | 5 | Data quality |
| missing_embedding | 5 | Data quality |
| missing_residual | 3 | Data quality |

Critical issues get 2x weight, warnings get 1x, info gets 0.5x.

## Usage

The review queue enables:
1. **Prioritized review**: Focus on highest-priority issues first
2. **Issue tracking**: Track which translations have been reviewed
3. **Quality improvement**: Systematically improve translation corpus
4. **Error patterns**: Identify systematic issues by translator/work

---

*Generated by error_detection.py*
"""

    return report


if __name__ == "__main__":
    result = asyncio.run(build_review_queue(sample_size=500, priority_threshold=10))
    print(f"\nAnalyzed {result['translations_analyzed']} translations")
    print(f"Review queue: {result['items_in_queue']} items")
    print(f"Issue counts: {result['issue_counts']}")
