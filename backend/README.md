# LOGOS Mathematical Translation Framework

## Overview

The LOGOS Mathematical Translation Framework is a comprehensive system for analyzing, comparing, and understanding translation style through rigorous mathematical modeling.

**Core Insight**: Translation is not a simple mapping from Source → Target. Instead:

```
Source → Meaning Space → Style Transform → Target
   S    →      M       →    σ ∈ Σ      →    T
```

Where meaning (M) is language-independent, and style (σ) determines HOW that meaning is expressed.

## Features

### 1. 20-Dimensional Style Vectors

Each translator's style is captured as a point in 20-dimensional space:

| Dimension | Scale | Description |
|-----------|-------|-------------|
| FORMALITY | casual ←→ formal | Level of formal language |
| ARCHAISM | modern ←→ archaic | Use of archaic vocabulary |
| SENTENCE_LENGTH | terse ←→ elaborate | Average sentence length |
| CLAUSE_COMPLEXITY | simple ←→ nested | Subordinate clause depth |
| WORD_ORDER_FREEDOM | English ←→ source | Word order adherence |
| ANGLO_SAXON_PREF | Latinate ←→ Germanic | Vocabulary origin |
| FIGURATIVE_PRES | literal ←→ metaphoric | Figure preservation |
| RHYTHMIC_REG | prose ←→ poetic | Rhythmic regularity |
| SOURCE_FIDELITY | free ←→ literal | Closeness to source |
| ADDITION_TOLERANCE | minimal ←→ expansive | Added content |
| OMISSION_TOLERANCE | complete ←→ selective | Omitted content |
| REGISTER_CONSISTENCY | varied ←→ uniform | Register uniformity |
| LEXICAL_DENSITY | sparse ←→ dense | Information density |
| SYNTACTIC_MIRROR | English ←→ source | Syntax following |
| PARTICLE_RENDERING | omit ←→ explicit | Particle translation |
| PROPER_NAME_HANDLING | Anglicize ←→ preserve | Name handling |
| DIALECT_FIDELITY | standardize ←→ preserve | Dialect preservation |
| SEMANTIC_DRIFT | strict ←→ interpretive | Interpretive freedom |
| INTERTEXT_PRES | ignore ←→ highlight | Intertextual attention |
| ERA_BIAS | contemporary ←→ period | Temporal idiom |

### 2. Translator Profiles (44+ Translators)

Complete profiles for major translators across categories:

- **Homer** (12): Pope, Lattimore, Fagles, Wilson, Fitzgerald, Chapman, Lombardo, Butler, Rieu, Alexander, Green, Murray
- **Greek Tragedy** (10): Carson, Grene, Bagg, Hamilton, Heaney, Doerries, Johnston, Lloyd-Jones, Taplin, Sommerstein
- **Virgil** (8): Dryden, Mandelbaum, Ruden, Ahl, Bartsch, Ferry, Day Lewis, Jackson Knight
- **Greek Prose** (8): Jowett, Grube, Waterfield, Rouse, de Sélincourt, Warner, Holland, Reeve
- **Latin Prose** (6): Walsh, Graves, Grant, Radice, Hammond, Woodman

### 3. LTQI (Translation Quality Index)

Multi-dimensional quality scoring:

```
LTQI = w₁·SF + w₂·SC + w₃·FL + w₄·CA

Where:
  SF = Semantic Fidelity (0.35 weight)
  SC = Stylistic Consistency (0.20 weight)
  FL = Fluency (0.30 weight)
  CA = Cultural Accuracy (0.15 weight)
```

Returns overall score (0-1) and letter grade (A-F).

### 4. Advanced Mathematics

#### Riemannian Manifolds for Meaning Space
- Semantic content exists on a curved manifold
- Geodesics represent optimal translation paths
- Curvature encodes semantic difficulty

#### Lie Groups for Style Transformations
- Style changes form a mathematical group
- Composition: Apply Pope's style, then modernize
- Inverse: "Undo" a style transformation
- Geodesic interpolation between styles

#### Fiber Bundles
- Base space: Meaning manifold M
- Fiber: Style space Σ at each point
- Translation = section of the bundle

### 5. Style Operations

#### Blending
```python
# 30% Pope + 70% Wilson
blended = pope_style.blend(wilson_style, alpha=0.3)
```

#### Extrapolation
```python
# "More Fagles than Fagles" relative to Lattimore
ultra_fagles = fagles_style.extrapolate(lattimore_style, beta=1.5)
```

#### Adjustment
```python
# Take Fagles, increase formality
formal_fagles = fagles_style.adjust(FORMALITY, delta=+0.2)
```

## Installation

```bash
# Clone LOGOS repository
git clone https://github.com/etvaid/logos.git
cd logos

# Install Python dependencies
pip install numpy scipy fastapi uvicorn pydantic

# Optional: Install PostgreSQL with pgvector
brew install postgresql@15
# Then: CREATE EXTENSION vector;
```

## Quick Start

### 1. Run the API

```bash
cd logos_math
python -m uvicorn main_complete:app --host 0.0.0.0 --port 8003 --reload
```

### 2. Access Documentation

Open http://localhost:8003/docs for interactive API documentation.

### 3. Example API Calls

**List translators:**
```bash
curl http://localhost:8003/api/style/translators
```

**Compare two translators:**
```bash
curl -X POST http://localhost:8003/api/style/compare \
  -H "Content-Type: application/json" \
  -d '{"translator1": "Alexander Pope", "translator2": "Emily Wilson"}'
```

**Blend styles:**
```bash
curl -X POST http://localhost:8003/api/style/blend \
  -H "Content-Type: application/json" \
  -d '{"translators": ["Robert Fagles", "Emily Wilson"], "weights": [0.6, 0.4]}'
```

**Style arithmetic:**
```bash
curl -X POST http://localhost:8003/api/style/arithmetic \
  -H "Content-Type: application/json" \
  -d '{"operation": "extrapolate", "style1": "Robert Fagles", "style2": "Richmond Lattimore", "parameter": 1.5}'
```

## File Structure

```
logos_math/
├── translation_math.py          # Core math: StyleVector, MeaningVector, LTQI
├── translator_profiles.py       # Basic translator profiles (12)
├── translator_profiles_complete.py  # Full profiles (44+)
├── translation_api.py           # FastAPI endpoints (separate router)
├── main_complete.py             # Integrated FastAPI app
├── advanced_math.py             # Riemannian manifolds, Lie groups
├── loeb_converter.py            # Convert Loeb DSL to text
├── translation_schema.sql       # PostgreSQL schema
├── StyleConstellation.jsx       # React visualization
├── setup_translation_framework.sh  # Deployment script
└── README.md                    # This file
```

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/style/translators` | GET | List all translators |
| `/api/style/translator/{name}` | GET | Get translator profile |
| `/api/style/compare` | POST | Compare two translators |
| `/api/style/blend` | POST | Blend multiple styles |
| `/api/style/arithmetic` | POST | Style vector operations |
| `/api/style/dimensions` | GET | List 20 dimensions |
| `/api/style/ltqi` | POST | Calculate quality score |

## Database Setup

```bash
# Create database
createdb logos

# Run schema
psql logos < translation_schema.sql

# Verify
psql logos -c "SELECT * FROM translator_profiles LIMIT 5;"
```

## Visualization

The `StyleConstellation.jsx` component provides:

1. **Constellation Map**: 2D projection of all translators
2. **Radar Chart**: Single translator's style profile
3. **Comparison Chart**: Side-by-side dimension comparison

## Mathematical Background

### Translation as Three-Space Transformation

```
T(s, σ) = D_T(E_M(s) ⊕ σ)

Where:
  s ∈ S: Source text
  E_M: Encoder to meaning space
  σ ∈ Σ: Style vector
  ⊕: Style application operator  
  D_T: Decoder to target language
```

### Geodesic Style Interpolation

Unlike linear interpolation:
```
σ_linear(t) = (1-t)σ₁ + tσ₂  # Crosses through "invalid" styles
```

Geodesic interpolation respects the manifold structure:
```
σ_geodesic(t) = exp_G(t · log_G(σ₁⁻¹σ₂)) · σ₁
```

This stays on the "surface" of valid translation styles.

### Semantic Curvature

- **Positive curvature**: Constrained meaning, one clear translation
- **Zero curvature**: Standard translation, multiple valid options  
- **Negative curvature**: Ambiguous, many divergent interpretations

## Research Applications

1. **Translation Studies**: Quantify stylistic differences between translations
2. **Pedagogy**: Show students the space of possible translations
3. **Literary Criticism**: Track historical evolution of translation norms
4. **AI Translation**: Guide neural models toward specific styles
5. **Publishing**: Match translator style to project requirements

## Citation

If you use this framework in research, please cite:

```bibtex
@software{logos_translation_framework,
  title = {LOGOS Mathematical Translation Framework},
  author = {LOGOS Project},
  year = {2025},
  url = {https://github.com/etvaid/logos}
}
```

## License

MIT License - See LICENSE file for details.

## Contributing

Contributions welcome! Areas of interest:

- Additional translator profiles
- Improved style extraction from text
- Better geodesic algorithms
- Visualization enhancements
- Integration with neural translation models

## Support

- GitHub Issues: https://github.com/etvaid/logos/issues
- Documentation: https://logos.tau.edu/docs
- Email: logos@tau.edu
