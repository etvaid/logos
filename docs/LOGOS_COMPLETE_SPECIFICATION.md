# LOGOS ULTIMATE SCIENTIFIC PLATFORM v2.0

## Complete Technical Specification

---

## 1. OVERVIEW

LOGOS is a computational philology platform for analyzing classical texts using modern ML/NLP techniques. It provides:

- **Style Residual Analysis** - Separate meaning from translator style
- **4-Gate Calibration** - Validate all analytical methods
- **Authorship Attribution** - Identify authors and detect interpolations
- **Hypothesis Factory** - Automated research hypothesis generation
- **Q Reconstruction** - Synoptic gospel source analysis
- **Latent Factor Analysis** - Track ideological evolution over time

---

## 2. CORE PRINCIPLES

### 2.1 Embedding Dimension
```python
EMBED_DIM = 768  # CRITICAL: All embeddings use this dimension
```

All vector columns use `VECTOR(768)` via pgvector extension.

### 2.2 Calibration Before Claims
No analytical result is valid until it passes all 4 calibration gates.

### 2.3 Negative Controls
Every significant finding must beat:
- `shuffle_sentences` - Preserves word frequencies, breaks discourse
- `shuffle_paragraphs` - Preserves topics, breaks flow
- `topic_matched_impostor` - Same genre/time, different author

### 2.4 Confidence Intervals
All metrics report bootstrap 95% CIs. Use `n_bootstrap=1000` minimum.

---

## 3. ARCHITECTURE

### 3.1 Directory Structure
```
logos/
├── apps/
│   ├── api/                    # FastAPI backend
│   │   ├── config/
│   │   │   └── constants.py    # EMBED_DIM, thresholds
│   │   ├── db/
│   │   │   └── schema.py       # 50+ tables with pgvector
│   │   ├── engines/            # Core computation engines
│   │   │   ├── calibration.py
│   │   │   ├── style_residual.py
│   │   │   ├── authorship.py
│   │   │   ├── hypothesis_factory.py
│   │   │   ├── latent_factors.py
│   │   │   ├── q_reconstruction.py
│   │   │   └── discovery.py
│   │   ├── routers/            # API endpoints
│   │   ├── scripts/            # CLI tools
│   │   └── jobs/               # Nightly jobs
│   └── web/                    # Next.js frontend
└── docs/
```

### 3.2 Database Schema (Key Tables)

```sql
-- Core
passages (id, embedding VECTOR(768), style_vector VECTOR(20), ...)
translations (id, embedding VECTOR(768), style_residual VECTOR(768), ...)

-- Style
meaning_anchors (id, anchor_embedding VECTOR(768), ...)
style_residuals (id, residual_vector VECTOR(768), ...)
translator_centroids (id, centroid_embedding VECTOR(768), ...)

-- Calibration
calibration_runs (run_id, gate_1_passed, gate_2_passed, ...)
calibration_gate1 (nmi, top1_accuracy, top3_accuracy, ece)

-- Authorship
authorship_fingerprints (author_id, function_word_freqs, hapax_ratio, ...)
authorship_segments (work_id, start_position, predicted_author, ...)

-- Hypothesis
hypotheses (hypothesis_id, novelty_score, evidence_score, composite_score, ...)
hypothesis_tests (test_type, passed, p_value, effect_size)

-- Q Reconstruction
pericopes (name, tradition_type, matthew_ref, mark_ref, luke_ref, ...)
synoptic_alignments (matthew_text, mark_text, luke_text, similarities, ...)
q_reconstructions (reconstructed_text, confidence_score, doctrinal_scores, ...)

-- Latent Factors
latent_axes (axis_name, positive_pole, negative_pole, axis_vector VECTOR(768))
regime_shifts (axis_id, changepoint_date, magnitude, ...)
```

---

## 4. STYLE RESIDUAL ENGINE

### 4.1 Concept
Given multiple translations of the same source text:
```
meaning_anchor = centroid(all_translation_embeddings)
style_residual = translation_embedding - meaning_anchor
```

### 4.2 Implementation
```python
class StyleResidualEngine:
    async def compute_meaning_anchor(self, source_text_id, method="centroid"):
        """Compute centroid of all translations."""

    async def compute_residual(self, translation_id):
        """Subtract meaning anchor from translation embedding."""

    async def compute_translator_centroid(self, translator_id):
        """Average all style residuals for a translator."""
```

### 4.3 Style Arithmetic
```python
# Interpolate between two translator styles
new_style = (1 - alpha) * style_A + alpha * style_B

# Find similar translators
similar = find_nearest_neighbors(translator_centroid, k=10)
```

---

## 5. CALIBRATION SYSTEM

### 5.1 Four Gates

**Gate 1: Style Separability**
- Train LogisticRegression classifier on translator ID
- Use GroupKFold by `meaning_anchor_id` to prevent leakage
- Thresholds: NMI > 0.6, Top-1 > 70%, Top-3 > 85%, ECE < 0.05

**Gate 2: Stability Across Windows**
- Compute F-ratio at 500, 1000, 2000 token windows
- Threshold: F-ratio > 3.0

**Gate 3: Cross-Era Separation**
- Test easy (same author), medium (same era), hard (cross-era) cases
- Thresholds: Easy > 90%, Medium > 80%, Hard > 70%

**Gate 4: External Validity**
- Validate against known disputed works (Prometheus Bound, Rhesus, etc.)
- Threshold: Neighbor validity > 80%

### 5.2 API
```python
POST /calibration/run           # Full calibration
POST /calibration/gate/1        # Individual gates
GET  /calibration/latest        # Latest results
GET  /calibration/thresholds    # Current thresholds
```

---

## 6. AUTHORSHIP SEGMENTER

### 6.1 Author Fingerprints
Each author gets a stylometric profile:
- Embedding centroid (768-dim)
- Function word frequencies (50 words)
- Sentence length statistics
- Hapax legomena ratio
- Internal consistency score

### 6.2 Segmentation Methods
- **HMM**: Hidden Markov Model with author states
- **Changepoint**: Bayesian changepoint detection (ruptures library)

### 6.3 Interpolation Detection
```python
async def detect_interpolations(work_id, threshold=2.0):
    """Find passages that deviate > threshold stdevs from work baseline."""
```

---

## 7. HYPOTHESIS FACTORY

### 7.1 Hypothesis Scoring
```python
composite_score = (
    0.3 * novelty_score +      # How new is this claim?
    0.3 * evidence_score +      # How strong is the evidence?
    0.4 * confound_resistance   # Does it survive controls?
)
```

### 7.2 Validation Tests
- Window stability (500/1000/2000 tokens)
- Subsample stability (bootstrap)
- Negative control comparison
- Confound resistance (genre, length, time)

### 7.3 Categories
```python
HYPOTHESIS_CATEGORIES = [
    "stylometric_anomaly",
    "intertext_bridge",
    "semantic_shift",
    "concept_migration",
    "interpolation_hotspot",
    "canon_hinge",
    "lost_source",
    "regime_shift",
]
```

---

## 8. Q RECONSTRUCTION

### 8.1 Method
1. Learn Matthew's and Luke's redaction signatures from triple tradition
2. Apply inverse signatures to double tradition (Q material)
3. Generate confidence intervals via bootstrap

### 8.2 Doctrinal Axes
```python
DOCTRINAL_AXES = {
    "christology": {
        "high": ["κύριος", "θεός", "υἱὸς θεοῦ", "λόγος"],
        "low": ["διδάσκαλος", "ῥαββί", "προφήτης"]
    },
    "cosmology": {
        "gnostic": ["πλήρωμα", "αἰών", "ἀρχών"],
        "proto_orthodox": ["κόσμος", "κτίσις"]
    },
    # ... asceticism, law_ritual, anti_temple
}
```

### 8.3 Tradition Types
- `triple` - Matthew, Mark, Luke
- `double_mt_lk` - Matthew and Luke (Q material)
- `sondergut` - Unique to one gospel

---

## 9. LATENT FACTOR ENGINE

### 9.1 Axis Definition
```python
axis_vector = centroid(positive_markers) - centroid(negative_markers)
```

### 9.2 Regime Shift Detection
Uses Bayesian changepoint detection (PELT, BinSeg) to find ideological shifts over time.

### 9.3 Concept Trajectories
Track how term meanings evolve:
```python
async def track_concept_trajectory(term, language, time_resolution=50):
    """Return embedding trajectory and drift metrics."""
```

---

## 10. DISCOVERY ENGINE

### 10.1 Five Programs

1. **Interpolation Detection**
   - Scan disputed works for style anomalies
   - Validate against negative controls

2. **Q Reconstruction**
   - Learn redaction signatures
   - Reconstruct Q from double tradition

3. **Concept Drift**
   - Track key terms over time
   - Detect semantic shifts

4. **Influence Mapping**
   - Build author influence network
   - Identify likely transmission paths

5. **Hypothesis Mining**
   - Aggregate all anomalies
   - Generate and validate hypotheses

### 10.2 Nightly Job
```python
# Cron: 0 2 * * *
async def run_nightly_discovery():
    for program in [1, 2, 3, 4, 5]:
        await run_discovery_program(program)
```

---

## 11. API ENDPOINTS

### 11.1 Calibration
```
POST /calibration/run
GET  /calibration/latest
GET  /calibration/history
POST /calibration/gate/{1,2,3,4}
GET  /calibration/thresholds
```

### 11.2 Style
```
POST /style/anchors/compute/{source_text_id}
POST /style/residuals/compute/{translation_id}
POST /style/centroids/compute/{translator_id}
POST /style/interpolate
POST /style/compare
GET  /style/similar/{translator_id}
```

### 11.3 Authorship
```
POST /authorship/fingerprints/compute/{author_id}
POST /authorship/segment/{work_id}
POST /authorship/interpolations/{work_id}
POST /authorship/compare
GET  /authorship/disputed/priority
```

### 11.4 Hypothesis
```
POST /hypothesis/generate/from-anomalies
POST /hypothesis/submit
POST /hypothesis/validate/{hypothesis_id}
POST /hypothesis/falsify/{hypothesis_id}
GET  /hypothesis/top
GET  /hypothesis/{hypothesis_id}
```

### 11.5 Synoptic
```
POST /synoptic/alignments
POST /synoptic/signatures/learn
POST /synoptic/q/reconstruct/{alignment_id}
GET  /synoptic/q/doctrinal-profile
POST /synoptic/q/validate
```

### 11.6 Latent
```
POST /latent/axes
POST /latent/scores/passage/{passage_id}
POST /latent/regime-shifts/{axis_name}
POST /latent/concept-trajectory
GET  /latent/time-series/{axis_name}
```

### 11.7 Discovery
```
POST /discovery/programs/interpolation
POST /discovery/programs/q-reconstruction
POST /discovery/programs/concept-drift
POST /discovery/programs/influence-mapping
POST /discovery/programs/hypothesis-mining
POST /discovery/programs/run-all
GET  /discovery/programs/summary
```

### 11.8 Uncertainty
```
POST /uncertainty/bootstrap
GET  /uncertainty/calibration-curve/{analysis_type}
GET  /uncertainty/ece
POST /uncertainty/stability/window-test/{entity_id}
POST /uncertainty/negative-controls/{entity_id}
```

### 11.9 Personas
```
POST /personas
POST /personas/{persona_id}/learn-signature
POST /personas/detect
POST /personas/compare
GET  /personas/evangelists
POST /personas/evangelists/initialize
```

### 11.10 Forensic
```
POST /forensic/analyze
GET  /forensic/anomalies/{work_id}
POST /forensic/fingerprint/{passage_id}
POST /forensic/anachronism/{work_id}
GET  /forensic/report/{work_id}
GET  /forensic/disputed-queue
```

---

## 12. CONSTANTS

```python
# config/constants.py

EMBED_DIM = 768
STYLE_DIM = 20

CALIBRATION_THRESHOLDS = {
    "gate_1": {"nmi": 0.6, "top1_accuracy": 0.70, "top3_accuracy": 0.85, "ece": 0.05},
    "gate_2": {"f_ratio": 3.0},
    "gate_3": {"easy_accuracy": 0.90, "medium_accuracy": 0.80, "hard_accuracy": 0.70},
    "gate_4": {"neighbor_validity": 0.80}
}

GREEK_FUNCTION_WORDS = [
    "καί", "δέ", "τε", "γάρ", "μέν", "ἀλλά", "οὖν", "εἰ", "ὡς", "ἄν",
    "ὅτι", "ἤ", "οὐ", "οὐκ", "οὐχ", "μή", "πρός", "ἐν", "εἰς", "ἐκ",
    # ... 50 total
]

DISPUTED_WORKS_PRIORITY = [
    {"urn": "...", "title": "Iliad Book 10 (Doloneia)", "traditional": "Homer"},
    {"urn": "...", "title": "Prometheus Bound", "traditional": "Aeschylus"},
    {"urn": "...", "title": "Rhesus", "traditional": "Euripides"},
    # ...
]

NEGATIVE_CONTROLS = {
    "shuffle_sentences": "Preserves word frequencies, breaks discourse",
    "shuffle_paragraphs": "Preserves paragraph topics, breaks flow",
    "topic_matched_impostor": "Same genre/time, different author",
}
```

---

## 13. IMPLEMENTATION DIRECTIVES

### 13.1 Critical Rules
1. **ALWAYS use EMBED_DIM from constants** - Never hardcode 768
2. **ALWAYS use GroupKFold in Gate 1** - Prevents data leakage
3. **ALWAYS report 95% CIs** - No point estimates without uncertainty
4. **ALWAYS beat negative controls** - No claim is valid otherwise
5. **ALWAYS check calibration status** - Block analysis if gates fail

### 13.2 Code Patterns
```python
# Correct: Use constants
from config.constants import EMBED_DIM
embedding = np.zeros(EMBED_DIM)

# Wrong: Hardcoded
embedding = np.zeros(768)  # DON'T DO THIS
```

```python
# Correct: GroupKFold
from sklearn.model_selection import GroupKFold
gkf = GroupKFold(n_splits=5)
for train_idx, test_idx in gkf.split(X, y, groups=meaning_anchor_ids):
    ...

# Wrong: KFold (allows leakage)
from sklearn.model_selection import KFold  # DON'T USE
```

### 13.3 Error Handling
```python
try:
    result = await engine.compute(...)
except CalibrationNotPassedError:
    return {"error": "Calibration required before analysis"}
except InsufficientDataError:
    return {"error": "Not enough data for reliable analysis"}
```

---

## 14. VERSION HISTORY

- **v2.0** (2026-01-01): Complete scientific platform
  - 4-gate calibration system
  - Style residual engine
  - Authorship segmenter with HMM
  - Hypothesis factory
  - Q reconstruction
  - Latent factor analysis
  - 5 discovery programs
  - 50+ database tables

- **v1.0** (2024-12-28): Initial corpus API
  - Basic search and retrieval
  - Connectome graph
  - Translation framework

---

## 15. ACKNOWLEDGMENTS

Built on:
- pgvector for embedding storage
- sentence-transformers for embeddings
- scikit-learn for ML
- ruptures for changepoint detection
- FastAPI for API
- Next.js for frontend
