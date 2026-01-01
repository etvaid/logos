"""
Latent Factor Engine
====================

Discovers and tracks latent factors (political, economic, institutional)
in classical texts over time.

Key features:
- Define semantic axes from marker terms
- Project texts onto axes
- Detect regime shifts via Bayesian changepoint detection
- Track concept trajectories over centuries
"""

import numpy as np
from typing import List, Dict, Optional, Tuple, Any
from dataclasses import dataclass
from collections import defaultdict
import asyncpg
from scipy.spatial.distance import cosine

from config.constants import EMBED_DIM, PERIODS

# Try to import changepoint detection
try:
    import ruptures as rpt
    HAS_RUPTURES = True
except ImportError:
    HAS_RUPTURES = False


@dataclass
class LatentAxis:
    """A semantic axis defined by opposing poles."""
    axis_id: int
    axis_name: str
    positive_pole: str
    negative_pole: str
    positive_markers: List[str]
    negative_markers: List[str]
    axis_vector: np.ndarray
    discriminative_power: float


@dataclass
class RegimeShift:
    """A detected changepoint in a latent factor."""
    axis_name: str
    changepoint_date: int
    changepoint_type: str
    pre_mean: float
    post_mean: float
    magnitude: float
    confidence_lower: int
    confidence_upper: int
    known_event: Optional[str]


class LatentFactorEngine:
    """
    Engine for discovering and tracking latent factors in texts.

    Pipeline:
    1. Define semantic axes from marker term embeddings
    2. Project passages onto axes to get factor scores
    3. Aggregate by time period
    4. Detect changepoints (regime shifts)
    5. Correlate with historical events
    """

    def __init__(self, pool: asyncpg.Pool, model=None):
        self.pool = pool
        self.model = model  # Sentence transformer for embeddings
        self.axes: Dict[str, LatentAxis] = {}
        self._known_events = self._load_known_events()

    def _load_known_events(self) -> Dict[int, str]:
        """Load known historical events for correlation."""
        return {
            -490: "Battle of Marathon",
            -480: "Battle of Salamis",
            -431: "Start of Peloponnesian War",
            -404: "Fall of Athens",
            -338: "Battle of Chaeronea",
            -323: "Death of Alexander",
            -146: "Destruction of Corinth",
            -44: "Assassination of Caesar",
            -31: "Battle of Actium",
            14: "Death of Augustus",
            64: "Great Fire of Rome",
            70: "Destruction of Jerusalem",
            117: "Death of Trajan",
            180: "Death of Marcus Aurelius",
            284: "Reign of Diocletian",
            313: "Edict of Milan",
            325: "Council of Nicaea",
            410: "Sack of Rome",
            476: "Fall of Western Empire",
        }

    # ═══════════════════════════════════════════════════════════════════════════════
    # AXIS DEFINITION
    # ═══════════════════════════════════════════════════════════════════════════════

    async def define_axis(
        self,
        axis_name: str,
        positive_pole: str,
        negative_pole: str,
        positive_markers: List[str],
        negative_markers: List[str]
    ) -> Dict[str, Any]:
        """
        Define a semantic axis from marker terms.

        The axis vector is computed as:
        axis = centroid(positive_markers) - centroid(negative_markers)

        Args:
            axis_name: Name of axis (e.g., "democracy_autocracy")
            positive_pole: Label for positive end (e.g., "democracy")
            negative_pole: Label for negative end (e.g., "autocracy")
            positive_markers: Terms associated with positive pole
            negative_markers: Terms associated with negative pole

        Returns:
            Axis definition details
        """
        if not self.model:
            return {"error": "Embedding model not loaded"}

        # Compute marker embeddings
        pos_embeddings = self.model.encode(positive_markers, convert_to_numpy=True)
        neg_embeddings = self.model.encode(negative_markers, convert_to_numpy=True)

        pos_centroid = np.mean(pos_embeddings, axis=0)
        neg_centroid = np.mean(neg_embeddings, axis=0)

        # Axis vector points from negative to positive
        axis_vector = pos_centroid - neg_centroid
        axis_vector = axis_vector / np.linalg.norm(axis_vector)  # Normalize

        # Compute discriminative power (separation between poles)
        within_pos = np.mean([cosine(e, pos_centroid) for e in pos_embeddings])
        within_neg = np.mean([cosine(e, neg_centroid) for e in neg_embeddings])
        between = cosine(pos_centroid, neg_centroid)

        # F-ratio style metric
        within_var = (within_pos + within_neg) / 2
        discriminative_power = between / (within_var + 0.01)

        async with self.pool.acquire() as conn:
            result = await conn.fetchrow("""
                INSERT INTO latent_axes (
                    axis_name, description, positive_pole, negative_pole,
                    positive_markers, negative_markers, axis_vector,
                    discriminative_power
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                ON CONFLICT (axis_name) DO UPDATE SET
                    positive_pole = EXCLUDED.positive_pole,
                    negative_pole = EXCLUDED.negative_pole,
                    positive_markers = EXCLUDED.positive_markers,
                    negative_markers = EXCLUDED.negative_markers,
                    axis_vector = EXCLUDED.axis_vector,
                    discriminative_power = EXCLUDED.discriminative_power,
                    updated_at = NOW()
                RETURNING id
            """,
                axis_name,
                f"{positive_pole} vs {negative_pole}",
                positive_pole,
                negative_pole,
                positive_markers,
                negative_markers,
                axis_vector.tobytes(),
                float(discriminative_power)
            )

            self.axes[axis_name] = LatentAxis(
                axis_id=result['id'],
                axis_name=axis_name,
                positive_pole=positive_pole,
                negative_pole=negative_pole,
                positive_markers=positive_markers,
                negative_markers=negative_markers,
                axis_vector=axis_vector,
                discriminative_power=discriminative_power
            )

            return {
                "axis_name": axis_name,
                "positive_pole": positive_pole,
                "negative_pole": negative_pole,
                "discriminative_power": float(discriminative_power),
                "n_positive_markers": len(positive_markers),
                "n_negative_markers": len(negative_markers)
            }

    async def load_axes(self) -> Dict[str, Any]:
        """Load all defined axes from database."""
        async with self.pool.acquire() as conn:
            rows = await conn.fetch("""
                SELECT * FROM latent_axes
            """)

            for row in rows:
                self.axes[row['axis_name']] = LatentAxis(
                    axis_id=row['id'],
                    axis_name=row['axis_name'],
                    positive_pole=row['positive_pole'],
                    negative_pole=row['negative_pole'],
                    positive_markers=row['positive_markers'] or [],
                    negative_markers=row['negative_markers'] or [],
                    axis_vector=np.frombuffer(row['axis_vector'], dtype=np.float32) if row['axis_vector'] else np.zeros(EMBED_DIM),
                    discriminative_power=row['discriminative_power'] or 0.0
                )

            return {"loaded": len(self.axes), "axes": list(self.axes.keys())}

    # ═══════════════════════════════════════════════════════════════════════════════
    # FACTOR SCORING
    # ═══════════════════════════════════════════════════════════════════════════════

    async def score_passage(
        self,
        passage_id: int
    ) -> Dict[str, float]:
        """
        Project a passage onto all defined axes.

        Score = dot(passage_embedding, axis_vector)
        Positive = towards positive pole, negative = towards negative pole

        Args:
            passage_id: Passage to score

        Returns:
            Dict of axis_name -> score
        """
        if not self.axes:
            await self.load_axes()

        async with self.pool.acquire() as conn:
            passage = await conn.fetchrow("""
                SELECT embedding, work_id, author_id
                FROM passages WHERE id = $1
            """, passage_id)

            if not passage or not passage['embedding']:
                return {}

            embedding = np.frombuffer(passage['embedding'], dtype=np.float32)

            scores = {}
            for axis_name, axis in self.axes.items():
                score = float(np.dot(embedding, axis.axis_vector))
                scores[axis_name] = score

            # Estimate date from work
            work = await conn.fetchrow("""
                SELECT date_composed_start, date_composed_end
                FROM works WHERE id = $1
            """, passage['work_id'])

            estimated_date = None
            if work and work['date_composed_start']:
                estimated_date = (
                    work['date_composed_start'] +
                    (work['date_composed_end'] or work['date_composed_start'])
                ) // 2

            # Store scores
            await conn.execute("""
                INSERT INTO latent_factor_scores (
                    passage_id, work_id, author_id, axis_scores, estimated_date
                ) VALUES ($1, $2, $3, $4, $5)
                ON CONFLICT DO NOTHING
            """,
                passage_id,
                passage['work_id'],
                passage['author_id'],
                scores,
                estimated_date
            )

            return scores

    async def score_all_passages(self, batch_size: int = 1000) -> Dict[str, Any]:
        """Score all passages on all axes."""
        async with self.pool.acquire() as conn:
            passage_ids = await conn.fetch("""
                SELECT id FROM passages
                WHERE embedding IS NOT NULL
            """)

            scored = 0
            errors = 0

            for row in passage_ids:
                try:
                    await self.score_passage(row['id'])
                    scored += 1
                except Exception:
                    errors += 1

            return {"scored": scored, "errors": errors}

    # ═══════════════════════════════════════════════════════════════════════════════
    # REGIME SHIFT DETECTION
    # ═══════════════════════════════════════════════════════════════════════════════

    async def detect_regime_shifts(
        self,
        axis_name: str,
        method: str = "pelt",
        min_size: int = 10,
        penalty: float = 10.0
    ) -> List[Dict[str, Any]]:
        """
        Detect regime shifts (changepoints) in a latent factor over time.

        Args:
            axis_name: Axis to analyze
            method: Detection method ('pelt', 'binseg', 'window')
            min_size: Minimum segment size
            penalty: Penalty for adding changepoints

        Returns:
            List of detected regime shifts
        """
        if not HAS_RUPTURES:
            return [{"error": "ruptures library not installed"}]

        async with self.pool.acquire() as conn:
            # Get time series of factor scores
            scores = await conn.fetch("""
                SELECT estimated_date, (axis_scores->>$1)::float as score
                FROM latent_factor_scores
                WHERE axis_scores ? $1
                  AND estimated_date IS NOT NULL
                ORDER BY estimated_date
            """, axis_name)

            if len(scores) < 20:
                return [{"error": "Insufficient data points"}]

            # Group by decade for smoothing
            decade_scores = defaultdict(list)
            for s in scores:
                decade = (s['estimated_date'] // 10) * 10
                decade_scores[decade].append(s['score'])

            sorted_decades = sorted(decade_scores.keys())
            time_series = [np.mean(decade_scores[d]) for d in sorted_decades]
            signal = np.array(time_series).reshape(-1, 1)

            # Detect changepoints
            if method == "pelt":
                algo = rpt.Pelt(model="rbf", min_size=min_size)
            elif method == "binseg":
                algo = rpt.Binseg(model="rbf", min_size=min_size)
            else:
                algo = rpt.Window(width=min_size, model="rbf")

            algo.fit(signal)
            changepoints = algo.predict(pen=penalty)

            shifts = []
            prev_idx = 0

            for cp_idx in changepoints:
                if cp_idx >= len(sorted_decades):
                    cp_idx = len(sorted_decades) - 1

                cp_date = sorted_decades[cp_idx] if cp_idx < len(sorted_decades) else sorted_decades[-1]

                pre_mean = np.mean(time_series[prev_idx:cp_idx])
                post_mean = np.mean(time_series[cp_idx:cp_idx + 10]) if cp_idx + 10 < len(time_series) else np.mean(time_series[cp_idx:])

                magnitude = post_mean - pre_mean

                # Determine shift type
                if abs(magnitude) > 0.5:
                    shift_type = "level_shift"
                else:
                    shift_type = "trend_change"

                # Find nearest known event
                nearest_event = None
                min_dist = float('inf')
                for event_year, event_name in self._known_events.items():
                    dist = abs(event_year - cp_date)
                    if dist < min_dist and dist < 50:
                        min_dist = dist
                        nearest_event = event_name

                shifts.append({
                    "axis_name": axis_name,
                    "changepoint_date": int(cp_date),
                    "changepoint_type": shift_type,
                    "pre_mean": float(pre_mean),
                    "post_mean": float(post_mean),
                    "magnitude": float(magnitude),
                    "known_event": nearest_event
                })

                prev_idx = cp_idx

            # Store shifts
            axis = self.axes.get(axis_name)
            axis_id = axis.axis_id if axis else None

            for shift in shifts:
                await conn.execute("""
                    INSERT INTO regime_shifts (
                        axis_id, changepoint_date, changepoint_type,
                        detection_method, pre_mean, post_mean, magnitude,
                        known_event
                    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                """,
                    axis_id,
                    shift['changepoint_date'],
                    shift['changepoint_type'],
                    method,
                    shift['pre_mean'],
                    shift['post_mean'],
                    shift['magnitude'],
                    shift['known_event']
                )

            return shifts

    # ═══════════════════════════════════════════════════════════════════════════════
    # CONCEPT TRAJECTORIES
    # ═══════════════════════════════════════════════════════════════════════════════

    async def track_concept_trajectory(
        self,
        term: str,
        language: str = "greek",
        time_resolution: int = 50  # Years
    ) -> Dict[str, Any]:
        """
        Track how a concept's meaning evolves over time.

        Args:
            term: Concept/term to track
            language: Language of term
            time_resolution: Resolution in years

        Returns:
            Trajectory with semantic shifts
        """
        async with self.pool.acquire() as conn:
            # Find passages containing the term
            passages = await conn.fetch("""
                SELECT
                    p.embedding,
                    p.text_content,
                    w.date_composed_start,
                    w.date_composed_end
                FROM passages p
                JOIN works w ON p.work_id = w.id
                WHERE p.language = $1
                  AND p.text_content ILIKE $2
                  AND p.embedding IS NOT NULL
                  AND w.date_composed_start IS NOT NULL
                ORDER BY w.date_composed_start
            """, language, f"%{term}%")

            if len(passages) < 5:
                return {"error": "Insufficient occurrences", "n_found": len(passages)}

            # Group by time period
            period_embeddings = defaultdict(list)
            for p in passages:
                date = (p['date_composed_start'] + (p['date_composed_end'] or p['date_composed_start'])) // 2
                period = (date // time_resolution) * time_resolution
                embedding = np.frombuffer(p['embedding'], dtype=np.float32)
                period_embeddings[period].append(embedding)

            # Compute centroid per period
            sorted_periods = sorted(period_embeddings.keys())
            period_centroids = {}
            for period in sorted_periods:
                embeddings = np.array(period_embeddings[period])
                period_centroids[period] = np.mean(embeddings, axis=0)

            # Compute drift between consecutive periods
            drifts = []
            total_drift = 0.0
            for i in range(len(sorted_periods) - 1):
                p1 = sorted_periods[i]
                p2 = sorted_periods[i + 1]
                drift = cosine(period_centroids[p1], period_centroids[p2])
                drifts.append({
                    "from": p1,
                    "to": p2,
                    "drift": float(drift)
                })
                total_drift += drift

            # Detect significant semantic shifts
            if drifts:
                mean_drift = np.mean([d['drift'] for d in drifts])
                std_drift = np.std([d['drift'] for d in drifts])
                shifts = [
                    d for d in drifts
                    if d['drift'] > mean_drift + 2 * std_drift
                ]
            else:
                shifts = []

            # Time span
            time_span = sorted_periods[-1] - sorted_periods[0] if sorted_periods else 0
            drift_rate = total_drift / (time_span / 100) if time_span > 0 else 0

            # Store trajectory
            await conn.execute("""
                INSERT INTO concept_trajectories (
                    concept_term, language, time_points,
                    total_drift, drift_rate, semantic_shifts
                ) VALUES ($1, $2, $3, $4, $5, $6)
                ON CONFLICT DO NOTHING
            """,
                term,
                language,
                sorted_periods,
                float(total_drift),
                float(drift_rate),
                shifts
            )

            return {
                "term": term,
                "language": language,
                "n_periods": len(sorted_periods),
                "time_span": f"{sorted_periods[0]} to {sorted_periods[-1]}" if sorted_periods else "N/A",
                "total_drift": float(total_drift),
                "drift_rate_per_century": float(drift_rate),
                "significant_shifts": shifts,
                "period_sample_sizes": {
                    p: len(period_embeddings[p]) for p in sorted_periods
                }
            }

    # ═══════════════════════════════════════════════════════════════════════════════
    # ANALYSIS
    # ═══════════════════════════════════════════════════════════════════════════════

    async def get_factor_time_series(
        self,
        axis_name: str,
        start_year: Optional[int] = None,
        end_year: Optional[int] = None,
        resolution: int = 25
    ) -> Dict[str, Any]:
        """
        Get time series of a latent factor.

        Args:
            axis_name: Axis to get
            start_year: Start of range
            end_year: End of range
            resolution: Time resolution in years

        Returns:
            Time series data
        """
        async with self.pool.acquire() as conn:
            query = """
                SELECT estimated_date, (axis_scores->>$1)::float as score
                FROM latent_factor_scores
                WHERE axis_scores ? $1
                  AND estimated_date IS NOT NULL
            """
            params = [axis_name]

            if start_year is not None:
                query += f" AND estimated_date >= ${len(params) + 1}"
                params.append(start_year)
            if end_year is not None:
                query += f" AND estimated_date <= ${len(params) + 1}"
                params.append(end_year)

            query += " ORDER BY estimated_date"

            scores = await conn.fetch(query, *params)

            if not scores:
                return {"error": "No data for this axis"}

            # Aggregate by resolution
            period_scores = defaultdict(list)
            for s in scores:
                period = (s['estimated_date'] // resolution) * resolution
                period_scores[period].append(s['score'])

            time_series = []
            for period in sorted(period_scores.keys()):
                values = period_scores[period]
                time_series.append({
                    "year": period,
                    "mean": float(np.mean(values)),
                    "std": float(np.std(values)),
                    "n": len(values),
                    "ci_lower": float(np.percentile(values, 2.5)) if len(values) > 1 else float(np.mean(values)),
                    "ci_upper": float(np.percentile(values, 97.5)) if len(values) > 1 else float(np.mean(values))
                })

            return {
                "axis_name": axis_name,
                "resolution": resolution,
                "time_series": time_series
            }

    async def correlate_axes(self) -> Dict[str, Any]:
        """
        Compute correlations between all latent axes.

        Returns:
            Correlation matrix
        """
        if not self.axes:
            await self.load_axes()

        if len(self.axes) < 2:
            return {"error": "Need at least 2 axes"}

        async with self.pool.acquire() as conn:
            # Get all factor scores
            scores = await conn.fetch("""
                SELECT axis_scores
                FROM latent_factor_scores
                WHERE axis_scores IS NOT NULL
                LIMIT 10000
            """)

            if not scores:
                return {"error": "No factor scores available"}

            # Build matrix
            axis_names = list(self.axes.keys())
            data = {name: [] for name in axis_names}

            for s in scores:
                axis_scores = s['axis_scores']
                for name in axis_names:
                    if name in axis_scores:
                        data[name].append(axis_scores[name])
                    else:
                        data[name].append(np.nan)

            # Compute correlations
            correlations = {}
            for i, name1 in enumerate(axis_names):
                correlations[name1] = {}
                for j, name2 in enumerate(axis_names):
                    arr1 = np.array(data[name1])
                    arr2 = np.array(data[name2])
                    # Remove NaNs
                    mask = ~(np.isnan(arr1) | np.isnan(arr2))
                    if mask.sum() > 10:
                        corr = np.corrcoef(arr1[mask], arr2[mask])[0, 1]
                        correlations[name1][name2] = float(corr)
                    else:
                        correlations[name1][name2] = None

            return {
                "axes": axis_names,
                "correlations": correlations
            }
