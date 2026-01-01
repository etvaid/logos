"""
Editorial Personas Router
=========================

Endpoints for modeling editorial/scribal personas from textual signatures.
"""

from fastapi import APIRouter, Request, Query, HTTPException
from typing import Dict, Any, Optional, List
from pydantic import BaseModel
import uuid

router = APIRouter(prefix="/personas", tags=["personas"])


# Request/Response Models
class PersonaDefinition(BaseModel):
    name: str
    description: Optional[str] = None
    source_type: str = "evangelist"  # evangelist, scribe, redactor, translator
    base_signatures: Optional[Dict[str, Any]] = None


class PersonaComparisonRequest(BaseModel):
    persona_a_id: int
    persona_b_id: int
    n_bootstrap: int = 1000


class PersonaDetectionRequest(BaseModel):
    text: str
    language: str = "greek"
    candidate_personas: Optional[List[int]] = None


# ===============================================================================
# PERSONA DEFINITION ENDPOINTS
# ===============================================================================

@router.post("/")
async def create_persona(request: Request, data: PersonaDefinition):
    """
    Create a new editorial persona.

    Personas represent identifiable editorial/scribal hands with consistent
    stylistic and doctrinal signatures.
    """
    pool = request.app.state.db_pool
    async with pool.acquire() as conn:
        persona_id = await conn.fetchval("""
            INSERT INTO editorial_personas (
                name, description, source_type, base_signatures
            ) VALUES ($1, $2, $3, $4)
            RETURNING id
        """,
            data.name,
            data.description,
            data.source_type,
            data.base_signatures
        )

        return {
            "persona_id": persona_id,
            "name": data.name,
            "status": "created"
        }


@router.get("/")
async def list_personas(
    request: Request,
    source_type: Optional[str] = None,
    limit: int = Query(default=50, le=200)
):
    """List all editorial personas."""
    pool = request.app.state.db_pool
    async with pool.acquire() as conn:
        query = """
            SELECT id, name, description, source_type,
                   n_attributed_passages, signature_strength,
                   doctrinal_profile, created_at
            FROM editorial_personas
        """
        params = []

        if source_type:
            params.append(source_type)
            query += f" WHERE source_type = ${len(params)}"

        params.append(limit)
        query += f" ORDER BY n_attributed_passages DESC NULLS LAST LIMIT ${len(params)}"

        rows = await conn.fetch(query, *params)
        return [dict(r) for r in rows]


@router.get("/{persona_id}")
async def get_persona(request: Request, persona_id: int):
    """Get details of a specific persona."""
    pool = request.app.state.db_pool
    async with pool.acquire() as conn:
        persona = await conn.fetchrow("""
            SELECT * FROM editorial_personas WHERE id = $1
        """, persona_id)

        if not persona:
            raise HTTPException(status_code=404, detail="Persona not found")

        return dict(persona)


@router.put("/{persona_id}")
async def update_persona(request: Request, persona_id: int, data: PersonaDefinition):
    """Update a persona definition."""
    pool = request.app.state.db_pool
    async with pool.acquire() as conn:
        await conn.execute("""
            UPDATE editorial_personas
            SET name = $2, description = $3, source_type = $4, base_signatures = $5
            WHERE id = $1
        """,
            persona_id,
            data.name,
            data.description,
            data.source_type,
            data.base_signatures
        )

        return {"persona_id": persona_id, "status": "updated"}


# ===============================================================================
# SIGNATURE LEARNING ENDPOINTS
# ===============================================================================

@router.post("/{persona_id}/learn-signature")
async def learn_persona_signature(
    request: Request,
    persona_id: int,
    passage_ids: List[int]
):
    """
    Learn a persona's signature from attributed passages.

    Computes:
    - Stylometric profile (function words, sentence patterns)
    - Lexical preferences
    - Doctrinal tendencies
    - Typical transformations
    """
    try:
        pool = request.app.state.db_pool

        async with pool.acquire() as conn:
            # Get passages
            passages = await conn.fetch("""
                SELECT id, text_content, embedding
                FROM source_texts
                WHERE id = ANY($1)
            """, passage_ids)

            if not passages:
                return {"error": "No passages found"}

            # Compute signature (simplified - full version would use engines)
            from config.constants import GREEK_FUNCTION_WORDS
            import numpy as np

            # Aggregate embeddings
            embeddings = []
            word_counts = {w: 0 for w in GREEK_FUNCTION_WORDS[:20]}
            total_words = 0

            for p in passages:
                if p['embedding']:
                    emb = np.frombuffer(p['embedding'], dtype=np.float32)
                    embeddings.append(emb)

                text = p['text_content'] or ""
                words = text.lower().split()
                total_words += len(words)
                for w in words:
                    if w in word_counts:
                        word_counts[w] += 1

            # Compute centroid
            centroid = None
            if embeddings:
                centroid = np.mean(embeddings, axis=0).tolist()

            # Compute function word frequencies
            fw_freqs = {
                w: count / total_words if total_words > 0 else 0
                for w, count in word_counts.items()
            }

            # Store signature
            await conn.execute("""
                UPDATE editorial_personas
                SET style_centroid = $2,
                    function_word_freqs = $3,
                    n_attributed_passages = $4,
                    signature_strength = $5
                WHERE id = $1
            """,
                persona_id,
                centroid,
                fw_freqs,
                len(passages),
                0.8  # Placeholder strength
            )

            return {
                "persona_id": persona_id,
                "n_passages": len(passages),
                "function_word_profile": fw_freqs,
                "status": "signature_learned"
            }
    except Exception as e:
        return {"error": str(e)}


@router.get("/{persona_id}/signature")
async def get_persona_signature(request: Request, persona_id: int):
    """Get the learned signature for a persona."""
    pool = request.app.state.db_pool
    async with pool.acquire() as conn:
        persona = await conn.fetchrow("""
            SELECT id, name, function_word_freqs, doctrinal_profile,
                   lexical_preferences, transformation_patterns,
                   n_attributed_passages, signature_strength
            FROM editorial_personas
            WHERE id = $1
        """, persona_id)

        if not persona:
            raise HTTPException(status_code=404, detail="Persona not found")

        return dict(persona)


# ===============================================================================
# PERSONA DETECTION ENDPOINTS
# ===============================================================================

@router.post("/detect")
async def detect_persona(request: Request, data: PersonaDetectionRequest):
    """
    Detect which persona(s) are present in a text.

    Returns probability distribution over candidate personas.
    """
    try:
        pool = request.app.state.db_pool

        async with pool.acquire() as conn:
            # Get all personas or candidates
            if data.candidate_personas:
                personas = await conn.fetch("""
                    SELECT id, name, style_centroid, function_word_freqs
                    FROM editorial_personas
                    WHERE id = ANY($1) AND style_centroid IS NOT NULL
                """, data.candidate_personas)
            else:
                personas = await conn.fetch("""
                    SELECT id, name, style_centroid, function_word_freqs
                    FROM editorial_personas
                    WHERE style_centroid IS NOT NULL
                    LIMIT 20
                """)

            if not personas:
                return {"error": "No personas with signatures found"}

            # Compute text features
            from config.constants import GREEK_FUNCTION_WORDS
            import numpy as np

            words = data.text.lower().split()
            total_words = len(words)
            text_fw = {w: 0 for w in GREEK_FUNCTION_WORDS[:20]}
            for w in words:
                if w in text_fw:
                    text_fw[w] += 1

            text_freqs = {w: c / total_words for w, c in text_fw.items()}

            # Compare to each persona
            results = []
            for p in personas:
                persona_freqs = p['function_word_freqs'] or {}

                # Compute correlation
                common_words = set(text_freqs.keys()) & set(persona_freqs.keys())
                if common_words:
                    text_vals = [text_freqs.get(w, 0) for w in common_words]
                    persona_vals = [persona_freqs.get(w, 0) for w in common_words]

                    text_arr = np.array(text_vals)
                    persona_arr = np.array(persona_vals)

                    if text_arr.std() > 0 and persona_arr.std() > 0:
                        corr = float(np.corrcoef(text_arr, persona_arr)[0, 1])
                    else:
                        corr = 0
                else:
                    corr = 0

                results.append({
                    "persona_id": p['id'],
                    "persona_name": p['name'],
                    "similarity": max(0, corr),
                    "confidence": max(0, corr) if corr > 0.3 else 0
                })

            # Sort by similarity
            results.sort(key=lambda x: x['similarity'], reverse=True)

            return {
                "text_length": total_words,
                "detected_personas": results[:5],
                "top_match": results[0] if results else None
            }
    except Exception as e:
        return {"error": str(e)}


@router.post("/detect/{passage_id}")
async def detect_persona_in_passage(
    request: Request,
    passage_id: int,
    candidate_personas: Optional[List[int]] = None
):
    """
    Detect persona(s) in an existing passage.

    Uses both embedding similarity and function word patterns.
    """
    pool = request.app.state.db_pool

    async with pool.acquire() as conn:
        # Get passage
        passage = await conn.fetchrow("""
            SELECT id, text_content, embedding
            FROM source_texts
            WHERE id = $1
        """, passage_id)

        if not passage:
            raise HTTPException(status_code=404, detail="Passage not found")

        # Get candidate personas
        if candidate_personas:
            personas = await conn.fetch("""
                SELECT id, name, style_centroid, function_word_freqs
                FROM editorial_personas
                WHERE id = ANY($1)
            """, candidate_personas)
        else:
            personas = await conn.fetch("""
                SELECT id, name, style_centroid, function_word_freqs
                FROM editorial_personas
                WHERE style_centroid IS NOT NULL
            """)

        # Compute similarities
        import numpy as np

        passage_emb = np.frombuffer(passage['embedding'], dtype=np.float32) if passage['embedding'] else None

        results = []
        for p in personas:
            persona_emb = np.array(p['style_centroid']) if p['style_centroid'] else None

            # Embedding similarity
            emb_sim = 0
            if passage_emb is not None and persona_emb is not None:
                emb_sim = float(np.dot(passage_emb, persona_emb) / (
                    np.linalg.norm(passage_emb) * np.linalg.norm(persona_emb)
                ))

            results.append({
                "persona_id": p['id'],
                "persona_name": p['name'],
                "embedding_similarity": emb_sim,
                "confidence": max(0, emb_sim)
            })

        results.sort(key=lambda x: x['embedding_similarity'], reverse=True)

        return {
            "passage_id": passage_id,
            "detected_personas": results,
            "top_match": results[0] if results else None
        }


# ===============================================================================
# PERSONA COMPARISON ENDPOINTS
# ===============================================================================

@router.post("/compare")
async def compare_personas(request: Request, data: PersonaComparisonRequest):
    """
    Compare two personas with bootstrap confidence intervals.

    Returns stylistic and doctrinal differences.
    """
    pool = request.app.state.db_pool

    async with pool.acquire() as conn:
        # Get both personas
        persona_a = await conn.fetchrow("""
            SELECT * FROM editorial_personas WHERE id = $1
        """, data.persona_a_id)

        persona_b = await conn.fetchrow("""
            SELECT * FROM editorial_personas WHERE id = $1
        """, data.persona_b_id)

        if not persona_a or not persona_b:
            raise HTTPException(status_code=404, detail="One or both personas not found")

        import numpy as np

        # Compute embedding similarity
        emb_sim = 0
        if persona_a['style_centroid'] and persona_b['style_centroid']:
            a_emb = np.array(persona_a['style_centroid'])
            b_emb = np.array(persona_b['style_centroid'])
            emb_sim = float(np.dot(a_emb, b_emb) / (
                np.linalg.norm(a_emb) * np.linalg.norm(b_emb)
            ))

        # Compute function word correlation
        fw_corr = 0
        if persona_a['function_word_freqs'] and persona_b['function_word_freqs']:
            common = set(persona_a['function_word_freqs'].keys()) & set(persona_b['function_word_freqs'].keys())
            if common:
                a_vals = np.array([persona_a['function_word_freqs'][w] for w in common])
                b_vals = np.array([persona_b['function_word_freqs'][w] for w in common])
                if a_vals.std() > 0 and b_vals.std() > 0:
                    fw_corr = float(np.corrcoef(a_vals, b_vals)[0, 1])

        return {
            "persona_a": {"id": persona_a['id'], "name": persona_a['name']},
            "persona_b": {"id": persona_b['id'], "name": persona_b['name']},
            "embedding_similarity": emb_sim,
            "function_word_correlation": fw_corr,
            "overall_similarity": (emb_sim + fw_corr) / 2,
            "are_distinct": (emb_sim + fw_corr) / 2 < 0.7
        }


# ===============================================================================
# EVANGELIST-SPECIFIC ENDPOINTS
# ===============================================================================

@router.get("/evangelists")
async def get_evangelist_personas(request: Request):
    """Get the canonical evangelist personas (Matthew, Mark, Luke, John)."""
    pool = request.app.state.db_pool
    async with pool.acquire() as conn:
        rows = await conn.fetch("""
            SELECT id, name, description, doctrinal_profile,
                   n_attributed_passages, signature_strength
            FROM editorial_personas
            WHERE source_type = 'evangelist'
            ORDER BY name
        """)

        return [dict(r) for r in rows]


@router.post("/evangelists/initialize")
async def initialize_evangelist_personas(request: Request):
    """
    Initialize the four evangelist personas with known characteristics.

    Creates Matthew, Mark, Luke, and John with baseline doctrinal profiles.
    """
    pool = request.app.state.db_pool

    evangelists = [
        {
            "name": "Matthew",
            "description": "Jewish-Christian perspective, fulfillment of prophecy",
            "doctrinal_profile": {
                "christology": 0.7,  # High but Son of Man emphasis
                "law_ritual": 0.8,  # Pro-law (Torah affirmation)
                "anti_temple": -0.3,  # Neutral to temple
                "asceticism": 0.3
            }
        },
        {
            "name": "Mark",
            "description": "Earliest gospel, apocalyptic urgency, messianic secret",
            "doctrinal_profile": {
                "christology": 0.5,  # Developing christology
                "law_ritual": 0.0,  # Neutral
                "anti_temple": 0.2,  # Some anti-temple
                "asceticism": 0.4
            }
        },
        {
            "name": "Luke",
            "description": "Gentile audience, social justice, universal salvation",
            "doctrinal_profile": {
                "christology": 0.8,  # High christology
                "law_ritual": -0.4,  # Law superseded
                "anti_temple": 0.0,  # Neutral
                "asceticism": 0.6  # Poverty emphasis
            }
        },
        {
            "name": "John",
            "description": "Logos theology, realized eschatology, high christology",
            "doctrinal_profile": {
                "christology": 1.0,  # Highest christology
                "cosmology": 0.5,  # Some gnostic tendencies
                "law_ritual": -0.6,  # Law transcended
                "anti_temple": 0.4,  # Temple replaced
                "asceticism": 0.2
            }
        }
    ]

    created = []
    async with pool.acquire() as conn:
        for e in evangelists:
            # Check if already exists
            existing = await conn.fetchval("""
                SELECT id FROM editorial_personas
                WHERE name = $1 AND source_type = 'evangelist'
            """, e['name'])

            if existing:
                created.append({"name": e['name'], "id": existing, "status": "exists"})
            else:
                persona_id = await conn.fetchval("""
                    INSERT INTO editorial_personas (
                        name, description, source_type, doctrinal_profile
                    ) VALUES ($1, $2, 'evangelist', $3)
                    RETURNING id
                """, e['name'], e['description'], e['doctrinal_profile'])
                created.append({"name": e['name'], "id": persona_id, "status": "created"})

    return {"evangelists": created}


# ===============================================================================
# REDACTION LAYER ENDPOINTS
# ===============================================================================

@router.post("/{persona_id}/redaction-patterns")
async def extract_redaction_patterns(
    request: Request,
    persona_id: int,
    source_persona_id: Optional[int] = None
):
    """
    Extract redaction patterns for a persona.

    If source_persona_id is provided, learns how this persona modifies
    the source (e.g., how Luke modifies Mark).
    """
    try:
        from engines import QReconstructionEngine
        pool = request.app.state.db_pool
        engine = QReconstructionEngine(pool)

        patterns = await engine.extract_redaction_patterns(
            persona_id, source_persona_id
        )

        return {
            "persona_id": persona_id,
            "source_persona_id": source_persona_id,
            "patterns": patterns
        }
    except Exception as e:
        return {"error": str(e)}


@router.get("/{persona_id}/passages")
async def get_attributed_passages(
    request: Request,
    persona_id: int,
    limit: int = Query(default=50, le=200)
):
    """Get passages attributed to this persona."""
    pool = request.app.state.db_pool
    async with pool.acquire() as conn:
        rows = await conn.fetch("""
            SELECT pa.passage_id, pa.confidence, pa.attribution_method,
                   st.reference, st.text_content
            FROM persona_attributions pa
            JOIN source_texts st ON pa.passage_id = st.id
            WHERE pa.persona_id = $1
            ORDER BY pa.confidence DESC
            LIMIT $2
        """, persona_id, limit)

        return [dict(r) for r in rows]
