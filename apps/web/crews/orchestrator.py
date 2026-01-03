"""
LOGOS ORCHESTRATOR v3
Deterministic-first, LLM only for explanations
"""

import asyncio
import logging
from typing import Optional, Dict, Any
import os

logger = logging.getLogger("orchestrator")


class LogosOrchestrator:
    """
    Simplified orchestrator:
    - Deterministic compute for all measurements
    - LLM only for explanations
    - Proper job queue
    - On-demand caching
    """

    def __init__(self, db_url: str = None):
        self.db_url = db_url or os.getenv("DATABASE_URL")
        self.pool = None
        self.queue = None

        # Pipelines (initialized after DB)
        self.morph_pipeline = None
        self.evidence_pipeline = None

        # Corpus frequency (precomputed)
        self.freq_table = None

    async def initialize(self):
        """Initialize all components"""
        try:
            import asyncpg
            self.pool = await asyncpg.create_pool(self.db_url, min_size=2, max_size=10)

            from crews.queue import JobQueue
            self.queue = JobQueue(self.pool)
            await self.queue.initialize()
        except ImportError:
            logger.warning("asyncpg not available, running without database")
        except Exception as e:
            logger.error(f"Database initialization failed: {e}")

        # Load frequency table (precomputed)
        from crews.compute import CorpusFrequency
        self.freq_table = CorpusFrequency()
        self.freq_table.load()

        # Initialize pipelines
        from crews.pipelines import MorphologyPipeline, EvidencePipeline
        self.morph_pipeline = MorphologyPipeline()
        self.evidence_pipeline = EvidencePipeline()

        logger.info("Orchestrator initialized")

    async def process_morphology_on_demand(
        self,
        passage_urn: str,
        force: bool = False
    ) -> Dict[str, Any]:
        """
        ON-DEMAND morphology: compute only when requested, cache forever.
        """
        if not self.pool:
            return {"error": "Database not available"}

        async with self.pool.acquire() as conn:
            # Check cache first
            if not force:
                cached = await conn.fetch("""
                    SELECT token_index, surface_form, lemma, pos, gloss, confidence
                    FROM token_annotations
                    WHERE urn = $1
                    ORDER BY token_index
                """, passage_urn)

                if cached:
                    return {
                        "tokens": [dict(t) for t in cached],
                        "cached": True,
                        "urn": passage_urn
                    }

            # Get passage text
            row = await conn.fetchrow("""
                SELECT content, language FROM source_texts WHERE urn = $1
            """, passage_urn)

            if not row:
                return {"error": "Passage not found", "urn": passage_urn}

        # Compute morphology (deterministic-first)
        language = row['language'] or 'greek'
        tokens = self.morph_pipeline.analyze_sync(row['content'], language)

        # Cache results
        async with self.pool.acquire() as conn:
            for i, token in enumerate(tokens):
                await conn.execute("""
                    INSERT INTO token_annotations
                    (urn, token_index, surface_form, lemma, pos, gloss, confidence, source)
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                    ON CONFLICT (urn, token_index) DO UPDATE SET
                    lemma = EXCLUDED.lemma, pos = EXCLUDED.pos,
                    gloss = EXCLUDED.gloss, confidence = EXCLUDED.confidence
                """, passage_urn, i, token.surface, token.lemma, token.pos,
                token.gloss, token.confidence, token.source)

        return {
            "tokens": [
                {
                    "token_index": i,
                    "surface_form": t.surface,
                    "lemma": t.lemma,
                    "pos": t.pos,
                    "gloss": t.gloss,
                    "confidence": t.confidence,
                    "source": t.source
                }
                for i, t in enumerate(tokens)
            ],
            "cached": False,
            "urn": passage_urn,
            "llm_fallback_count": sum(1 for t in tokens if t.source == "llm_fallback")
        }

    async def process_evidence_on_demand(
        self,
        source_urn: str,
        target_urn: str,
        force: bool = False
    ) -> Dict[str, Any]:
        """
        ON-DEMAND evidence: compute only when requested, cache forever.
        """
        if not self.pool:
            return {"error": "Database not available"}

        async with self.pool.acquire() as conn:
            # Check cache
            if not force:
                cached = await conn.fetchrow("""
                    SELECT * FROM intertext_evidence
                    WHERE source_urn = $1 AND target_urn = $2
                """, source_urn, target_urn)

                if cached:
                    return {"evidence": dict(cached), "cached": True}

            # Get texts
            source = await conn.fetchrow(
                "SELECT content, work FROM source_texts WHERE urn = $1", source_urn
            )
            target = await conn.fetchrow(
                "SELECT content, work FROM source_texts WHERE urn = $1", target_urn
            )

        if not source or not target:
            return {"error": "Passage not found"}

        # Compute evidence (DETERMINISTIC)
        evidence = self.evidence_pipeline.compute_evidence(
            source['content'],
            target['content'],
            source_urn=source_urn,
            target_urn=target_urn
        )

        # Generate explanation (template - no LLM by default)
        explanation = self.evidence_pipeline._template_explanation(evidence)
        evidence.explanation = explanation

        # Cache
        async with self.pool.acquire() as conn:
            await conn.execute("""
                INSERT INTO intertext_evidence
                (source_urn, target_urn, confidence_score, connection_type,
                 lexical_overlap, semantic_similarity, pipeline_version)
                VALUES ($1, $2, $3, $4, $5, $6, $7)
                ON CONFLICT (source_urn, target_urn) DO UPDATE SET
                confidence_score = EXCLUDED.confidence_score,
                connection_type = EXCLUDED.connection_type,
                lexical_overlap = EXCLUDED.lexical_overlap
            """, source_urn, target_urn,
            evidence.overall_confidence,
            evidence.connection_type,
            evidence.word_overlap,
            evidence.embedding_similarity,
            "v3")

        return {
            "evidence": self.evidence_pipeline.to_dict(evidence),
            "cached": False
        }

    async def precompute_hot_passages(
        self,
        limit: int = 10000,
        workers: int = 10
    ):
        """
        Precompute morphology for most-accessed passages only.
        Not full corpus - just the hottest content.
        """
        if not self.pool:
            logger.error("Database not available")
            return

        logger.info(f"Precomputing top {limit} passages...")

        async with self.pool.acquire() as conn:
            # Get uncached passages (prioritize by some metric)
            passages = await conn.fetch("""
                SELECT urn FROM source_texts
                WHERE urn NOT IN (
                    SELECT DISTINCT urn FROM token_annotations
                )
                ORDER BY RANDOM()
                LIMIT $1
            """, limit)

        semaphore = asyncio.Semaphore(workers)
        completed = 0

        async def process(urn: str):
            nonlocal completed
            async with semaphore:
                await self.process_morphology_on_demand(urn)
                completed += 1
                if completed % 100 == 0:
                    logger.info(f"  {completed}/{len(passages)}")

        await asyncio.gather(*[process(p['urn']) for p in passages])
        logger.info(f"Precomputed {completed} passages")

    async def close(self):
        """Clean up resources"""
        if self.pool:
            await self.pool.close()


async def main():
    import argparse
    parser = argparse.ArgumentParser(description="LOGOS Orchestrator")
    parser.add_argument("--precompute", type=int, help="Precompute N hot passages")
    parser.add_argument("--workers", type=int, default=10)
    args = parser.parse_args()

    orchestrator = LogosOrchestrator()
    await orchestrator.initialize()

    if args.precompute:
        await orchestrator.precompute_hot_passages(args.precompute, args.workers)

    await orchestrator.close()


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    asyncio.run(main())
