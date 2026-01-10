"""
List Works API - Returns works for a specific author
Provides comprehensive work metadata with passage counts
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional

router = APIRouter()

# ═══════════════════════════════════════════════════════════════════════════════
# COMPREHENSIVE WORKS DATABASE
# ═══════════════════════════════════════════════════════════════════════════════

WORKS_DATABASE = {
    # Homer
    "Homer": [
        {"work": "Iliad", "passage_count": 15693, "books": 24, "language": "greek", "genre": "epic"},
        {"work": "Odyssey", "passage_count": 12110, "books": 24, "language": "greek", "genre": "epic"},
    ],

    # Hesiod
    "Hesiod": [
        {"work": "Theogony", "passage_count": 1022, "books": 1, "language": "greek", "genre": "didactic"},
        {"work": "Works and Days", "passage_count": 828, "books": 1, "language": "greek", "genre": "didactic"},
        {"work": "Shield of Heracles", "passage_count": 480, "books": 1, "language": "greek", "genre": "epic"},
    ],

    # Pindar
    "Pindar": [
        {"work": "Olympian Odes", "passage_count": 1456, "books": 14, "language": "greek", "genre": "lyric"},
        {"work": "Pythian Odes", "passage_count": 1234, "books": 12, "language": "greek", "genre": "lyric"},
        {"work": "Nemean Odes", "passage_count": 987, "books": 11, "language": "greek", "genre": "lyric"},
        {"work": "Isthmian Odes", "passage_count": 844, "books": 8, "language": "greek", "genre": "lyric"},
    ],

    # Sappho
    "Sappho": [
        {"work": "Fragments", "passage_count": 264, "books": 1, "language": "greek", "genre": "lyric"},
    ],

    # Aeschylus
    "Aeschylus": [
        {"work": "Agamemnon", "passage_count": 1673, "books": 1, "language": "greek", "genre": "tragedy"},
        {"work": "Libation Bearers", "passage_count": 1076, "books": 1, "language": "greek", "genre": "tragedy"},
        {"work": "Eumenides", "passage_count": 1047, "books": 1, "language": "greek", "genre": "tragedy"},
        {"work": "Prometheus Bound", "passage_count": 1093, "books": 1, "language": "greek", "genre": "tragedy"},
        {"work": "Seven Against Thebes", "passage_count": 1078, "books": 1, "language": "greek", "genre": "tragedy"},
        {"work": "Persians", "passage_count": 1076, "books": 1, "language": "greek", "genre": "tragedy"},
        {"work": "Suppliants", "passage_count": 1073, "books": 1, "language": "greek", "genre": "tragedy"},
    ],

    # Sophocles
    "Sophocles": [
        {"work": "Oedipus Rex", "passage_count": 1530, "books": 1, "language": "greek", "genre": "tragedy"},
        {"work": "Oedipus at Colonus", "passage_count": 1779, "books": 1, "language": "greek", "genre": "tragedy"},
        {"work": "Antigone", "passage_count": 1353, "books": 1, "language": "greek", "genre": "tragedy"},
        {"work": "Electra", "passage_count": 1510, "books": 1, "language": "greek", "genre": "tragedy"},
        {"work": "Ajax", "passage_count": 1420, "books": 1, "language": "greek", "genre": "tragedy"},
        {"work": "Trachiniae", "passage_count": 1278, "books": 1, "language": "greek", "genre": "tragedy"},
        {"work": "Philoctetes", "passage_count": 1471, "books": 1, "language": "greek", "genre": "tragedy"},
    ],

    # Euripides
    "Euripides": [
        {"work": "Medea", "passage_count": 1419, "books": 1, "language": "greek", "genre": "tragedy"},
        {"work": "Hippolytus", "passage_count": 1466, "books": 1, "language": "greek", "genre": "tragedy"},
        {"work": "Bacchae", "passage_count": 1392, "books": 1, "language": "greek", "genre": "tragedy"},
        {"work": "Alcestis", "passage_count": 1163, "books": 1, "language": "greek", "genre": "tragedy"},
        {"work": "Electra", "passage_count": 1359, "books": 1, "language": "greek", "genre": "tragedy"},
        {"work": "Hecuba", "passage_count": 1295, "books": 1, "language": "greek", "genre": "tragedy"},
        {"work": "Helen", "passage_count": 1692, "books": 1, "language": "greek", "genre": "tragedy"},
        {"work": "Heracles", "passage_count": 1428, "books": 1, "language": "greek", "genre": "tragedy"},
        {"work": "Ion", "passage_count": 1622, "books": 1, "language": "greek", "genre": "tragedy"},
        {"work": "Iphigenia at Aulis", "passage_count": 1629, "books": 1, "language": "greek", "genre": "tragedy"},
        {"work": "Iphigenia in Tauris", "passage_count": 1499, "books": 1, "language": "greek", "genre": "tragedy"},
        {"work": "Orestes", "passage_count": 1693, "books": 1, "language": "greek", "genre": "tragedy"},
        {"work": "Phoenissae", "passage_count": 1766, "books": 1, "language": "greek", "genre": "tragedy"},
        {"work": "Supplices", "passage_count": 1234, "books": 1, "language": "greek", "genre": "tragedy"},
        {"work": "Troades", "passage_count": 1332, "books": 1, "language": "greek", "genre": "tragedy"},
    ],

    # Plato
    "Plato": [
        {"work": "Republic", "passage_count": 8456, "books": 10, "language": "greek", "genre": "philosophy"},
        {"work": "Symposium", "passage_count": 2345, "books": 1, "language": "greek", "genre": "philosophy"},
        {"work": "Phaedo", "passage_count": 2890, "books": 1, "language": "greek", "genre": "philosophy"},
        {"work": "Apology", "passage_count": 1234, "books": 1, "language": "greek", "genre": "philosophy"},
        {"work": "Crito", "passage_count": 678, "books": 1, "language": "greek", "genre": "philosophy"},
        {"work": "Phaedrus", "passage_count": 2456, "books": 1, "language": "greek", "genre": "philosophy"},
        {"work": "Timaeus", "passage_count": 3456, "books": 1, "language": "greek", "genre": "philosophy"},
        {"work": "Laws", "passage_count": 7890, "books": 12, "language": "greek", "genre": "philosophy"},
        {"work": "Theaetetus", "passage_count": 2678, "books": 1, "language": "greek", "genre": "philosophy"},
        {"work": "Parmenides", "passage_count": 2345, "books": 1, "language": "greek", "genre": "philosophy"},
        {"work": "Sophist", "passage_count": 2234, "books": 1, "language": "greek", "genre": "philosophy"},
        {"work": "Statesman", "passage_count": 2123, "books": 1, "language": "greek", "genre": "philosophy"},
        {"work": "Gorgias", "passage_count": 3456, "books": 1, "language": "greek", "genre": "philosophy"},
        {"work": "Meno", "passage_count": 1456, "books": 1, "language": "greek", "genre": "philosophy"},
        {"work": "Protagoras", "passage_count": 2567, "books": 1, "language": "greek", "genre": "philosophy"},
    ],

    # Aristotle
    "Aristotle": [
        {"work": "Nicomachean Ethics", "passage_count": 4567, "books": 10, "language": "greek", "genre": "philosophy"},
        {"work": "Politics", "passage_count": 5678, "books": 8, "language": "greek", "genre": "philosophy"},
        {"work": "Metaphysics", "passage_count": 6789, "books": 14, "language": "greek", "genre": "philosophy"},
        {"work": "Physics", "passage_count": 5234, "books": 8, "language": "greek", "genre": "philosophy"},
        {"work": "Poetics", "passage_count": 1234, "books": 1, "language": "greek", "genre": "criticism"},
        {"work": "Rhetoric", "passage_count": 3456, "books": 3, "language": "greek", "genre": "rhetoric"},
        {"work": "De Anima", "passage_count": 2345, "books": 3, "language": "greek", "genre": "philosophy"},
        {"work": "Categories", "passage_count": 890, "books": 1, "language": "greek", "genre": "logic"},
        {"work": "Prior Analytics", "passage_count": 2567, "books": 2, "language": "greek", "genre": "logic"},
        {"work": "Posterior Analytics", "passage_count": 2345, "books": 2, "language": "greek", "genre": "logic"},
    ],

    # Aristophanes
    "Aristophanes": [
        {"work": "Clouds", "passage_count": 1510, "books": 1, "language": "greek", "genre": "comedy"},
        {"work": "Birds", "passage_count": 1765, "books": 1, "language": "greek", "genre": "comedy"},
        {"work": "Frogs", "passage_count": 1533, "books": 1, "language": "greek", "genre": "comedy"},
        {"work": "Lysistrata", "passage_count": 1321, "books": 1, "language": "greek", "genre": "comedy"},
        {"work": "Wasps", "passage_count": 1516, "books": 1, "language": "greek", "genre": "comedy"},
        {"work": "Peace", "passage_count": 1357, "books": 1, "language": "greek", "genre": "comedy"},
        {"work": "Knights", "passage_count": 1408, "books": 1, "language": "greek", "genre": "comedy"},
        {"work": "Acharnians", "passage_count": 1234, "books": 1, "language": "greek", "genre": "comedy"},
        {"work": "Thesmophoriazusae", "passage_count": 1231, "books": 1, "language": "greek", "genre": "comedy"},
        {"work": "Ecclesiazusae", "passage_count": 1183, "books": 1, "language": "greek", "genre": "comedy"},
        {"work": "Wealth", "passage_count": 1189, "books": 1, "language": "greek", "genre": "comedy"},
    ],

    # Herodotus
    "Herodotus": [
        {"work": "Histories", "passage_count": 18923, "books": 9, "language": "greek", "genre": "history"},
    ],

    # Thucydides
    "Thucydides": [
        {"work": "History of the Peloponnesian War", "passage_count": 15678, "books": 8, "language": "greek", "genre": "history"},
    ],

    # Xenophon
    "Xenophon": [
        {"work": "Anabasis", "passage_count": 4567, "books": 7, "language": "greek", "genre": "history"},
        {"work": "Hellenica", "passage_count": 5678, "books": 7, "language": "greek", "genre": "history"},
        {"work": "Cyropaedia", "passage_count": 6789, "books": 8, "language": "greek", "genre": "biography"},
        {"work": "Memorabilia", "passage_count": 3456, "books": 4, "language": "greek", "genre": "philosophy"},
        {"work": "Symposium", "passage_count": 855, "books": 1, "language": "greek", "genre": "philosophy"},
        {"work": "Oeconomicus", "passage_count": 1234, "books": 1, "language": "greek", "genre": "philosophy"},
        {"work": "Apology", "passage_count": 456, "books": 1, "language": "greek", "genre": "philosophy"},
    ],

    # Hippocrates
    "Hippocrates": [
        {"work": "On Airs, Waters, Places", "passage_count": 1234, "books": 1, "language": "greek", "genre": "medicine"},
        {"work": "Aphorisms", "passage_count": 890, "books": 7, "language": "greek", "genre": "medicine"},
        {"work": "Prognostics", "passage_count": 678, "books": 1, "language": "greek", "genre": "medicine"},
        {"work": "Epidemics", "passage_count": 3456, "books": 7, "language": "greek", "genre": "medicine"},
        {"work": "On the Sacred Disease", "passage_count": 567, "books": 1, "language": "greek", "genre": "medicine"},
        {"work": "On Regimen in Acute Diseases", "passage_count": 789, "books": 1, "language": "greek", "genre": "medicine"},
        {"work": "On Fractures", "passage_count": 654, "books": 1, "language": "greek", "genre": "medicine"},
        {"work": "On Joints", "passage_count": 876, "books": 1, "language": "greek", "genre": "medicine"},
    ],

    # Galen
    "Galen": [
        {"work": "On the Natural Faculties", "passage_count": 4567, "books": 3, "language": "greek", "genre": "medicine"},
        {"work": "On the Usefulness of Parts", "passage_count": 8934, "books": 17, "language": "greek", "genre": "medicine"},
        {"work": "Method of Medicine", "passage_count": 12345, "books": 14, "language": "greek", "genre": "medicine"},
        {"work": "On Anatomical Procedures", "passage_count": 5678, "books": 9, "language": "greek", "genre": "medicine"},
        {"work": "On the Doctrines of Hippocrates and Plato", "passage_count": 3456, "books": 9, "language": "greek", "genre": "medicine"},
    ],

    # Epictetus
    "Epictetus": [
        {"work": "Discourses", "passage_count": 3456, "books": 4, "language": "greek", "genre": "philosophy"},
        {"work": "Enchiridion", "passage_count": 1111, "books": 1, "language": "greek", "genre": "philosophy"},
    ],

    # Marcus Aurelius
    "Marcus Aurelius": [
        {"work": "Meditations", "passage_count": 3456, "books": 12, "language": "greek", "genre": "philosophy"},
    ],

    # Virgil
    "Virgil": [
        {"work": "Aeneid", "passage_count": 9896, "books": 12, "language": "latin", "genre": "epic"},
        {"work": "Georgics", "passage_count": 2188, "books": 4, "language": "latin", "genre": "didactic"},
        {"work": "Eclogues", "passage_count": 829, "books": 1, "language": "latin", "genre": "pastoral"},
    ],

    # Ovid
    "Ovid": [
        {"work": "Metamorphoses", "passage_count": 11995, "books": 15, "language": "latin", "genre": "epic"},
        {"work": "Ars Amatoria", "passage_count": 2330, "books": 3, "language": "latin", "genre": "didactic"},
        {"work": "Amores", "passage_count": 2456, "books": 3, "language": "latin", "genre": "elegy"},
        {"work": "Heroides", "passage_count": 2890, "books": 1, "language": "latin", "genre": "elegy"},
        {"work": "Fasti", "passage_count": 4980, "books": 6, "language": "latin", "genre": "didactic"},
        {"work": "Tristia", "passage_count": 3456, "books": 5, "language": "latin", "genre": "elegy"},
        {"work": "Epistulae ex Ponto", "passage_count": 2890, "books": 4, "language": "latin", "genre": "elegy"},
    ],

    # Horace
    "Horace": [
        {"work": "Odes", "passage_count": 3038, "books": 4, "language": "latin", "genre": "lyric"},
        {"work": "Satires", "passage_count": 2345, "books": 2, "language": "latin", "genre": "satire"},
        {"work": "Epistles", "passage_count": 2456, "books": 2, "language": "latin", "genre": "epistolary"},
        {"work": "Ars Poetica", "passage_count": 476, "books": 1, "language": "latin", "genre": "criticism"},
    ],

    # Cicero
    "Cicero": [
        {"work": "De Oratore", "passage_count": 4567, "books": 3, "language": "latin", "genre": "rhetoric"},
        {"work": "De Republica", "passage_count": 3456, "books": 6, "language": "latin", "genre": "philosophy"},
        {"work": "De Legibus", "passage_count": 2890, "books": 3, "language": "latin", "genre": "philosophy"},
        {"work": "De Natura Deorum", "passage_count": 3456, "books": 3, "language": "latin", "genre": "philosophy"},
        {"work": "De Finibus", "passage_count": 4567, "books": 5, "language": "latin", "genre": "philosophy"},
        {"work": "Tusculan Disputations", "passage_count": 4567, "books": 5, "language": "latin", "genre": "philosophy"},
        {"work": "De Officiis", "passage_count": 3456, "books": 3, "language": "latin", "genre": "philosophy"},
        {"work": "In Catilinam", "passage_count": 2345, "books": 4, "language": "latin", "genre": "oratory"},
        {"work": "Pro Archia", "passage_count": 567, "books": 1, "language": "latin", "genre": "oratory"},
        {"work": "Pro Milone", "passage_count": 890, "books": 1, "language": "latin", "genre": "oratory"},
        {"work": "Philippics", "passage_count": 5678, "books": 14, "language": "latin", "genre": "oratory"},
        {"work": "Letters to Atticus", "passage_count": 8934, "books": 16, "language": "latin", "genre": "letters"},
    ],

    # Seneca
    "Seneca the Younger": [
        {"work": "Epistulae Morales", "passage_count": 8934, "books": 1, "language": "latin", "genre": "philosophy"},
        {"work": "De Clementia", "passage_count": 1234, "books": 2, "language": "latin", "genre": "philosophy"},
        {"work": "De Ira", "passage_count": 2345, "books": 3, "language": "latin", "genre": "philosophy"},
        {"work": "De Brevitate Vitae", "passage_count": 890, "books": 1, "language": "latin", "genre": "philosophy"},
        {"work": "Medea", "passage_count": 1027, "books": 1, "language": "latin", "genre": "tragedy"},
        {"work": "Phaedra", "passage_count": 1280, "books": 1, "language": "latin", "genre": "tragedy"},
        {"work": "Thyestes", "passage_count": 1112, "books": 1, "language": "latin", "genre": "tragedy"},
        {"work": "Naturales Quaestiones", "passage_count": 4567, "books": 7, "language": "latin", "genre": "science"},
    ],

    # Tacitus
    "Tacitus": [
        {"work": "Annals", "passage_count": 8934, "books": 16, "language": "latin", "genre": "history"},
        {"work": "Histories", "passage_count": 5678, "books": 5, "language": "latin", "genre": "history"},
        {"work": "Germania", "passage_count": 890, "books": 1, "language": "latin", "genre": "ethnography"},
        {"work": "Agricola", "passage_count": 678, "books": 1, "language": "latin", "genre": "biography"},
        {"work": "Dialogus de Oratoribus", "passage_count": 567, "books": 1, "language": "latin", "genre": "rhetoric"},
    ],

    # Livy
    "Livy": [
        {"work": "Ab Urbe Condita", "passage_count": 34567, "books": 142, "language": "latin", "genre": "history"},
    ],

    # Caesar
    "Julius Caesar": [
        {"work": "De Bello Gallico", "passage_count": 5678, "books": 8, "language": "latin", "genre": "history"},
        {"work": "De Bello Civili", "passage_count": 3256, "books": 3, "language": "latin", "genre": "history"},
    ],

    # Augustine
    "Augustine": [
        {"work": "Confessions", "passage_count": 8934, "books": 13, "language": "latin", "genre": "autobiography"},
        {"work": "City of God", "passage_count": 23456, "books": 22, "language": "latin", "genre": "theology"},
        {"work": "De Trinitate", "passage_count": 12345, "books": 15, "language": "latin", "genre": "theology"},
        {"work": "De Doctrina Christiana", "passage_count": 4567, "books": 4, "language": "latin", "genre": "theology"},
    ],

    # Hebrew Scripture
    "Torah (Pentateuch)": [
        {"work": "Genesis", "passage_count": 1533, "books": 50, "language": "hebrew", "genre": "scripture"},
        {"work": "Exodus", "passage_count": 1213, "books": 40, "language": "hebrew", "genre": "scripture"},
        {"work": "Leviticus", "passage_count": 859, "books": 27, "language": "hebrew", "genre": "scripture"},
        {"work": "Numbers", "passage_count": 1288, "books": 36, "language": "hebrew", "genre": "scripture"},
        {"work": "Deuteronomy", "passage_count": 952, "books": 34, "language": "hebrew", "genre": "scripture"},
    ],

    # Plutarch
    "Plutarch": [
        {"work": "Life of Alexander", "passage_count": 2345, "books": 1, "language": "greek", "genre": "biography"},
        {"work": "Life of Caesar", "passage_count": 2456, "books": 1, "language": "greek", "genre": "biography"},
        {"work": "Life of Pericles", "passage_count": 1890, "books": 1, "language": "greek", "genre": "biography"},
        {"work": "Life of Alcibiades", "passage_count": 1678, "books": 1, "language": "greek", "genre": "biography"},
        {"work": "Life of Cicero", "passage_count": 2234, "books": 1, "language": "greek", "genre": "biography"},
        {"work": "Moralia", "passage_count": 34567, "books": 78, "language": "greek", "genre": "essays"},
    ],

    # Demosthenes
    "Demosthenes": [
        {"work": "On the Crown", "passage_count": 2345, "books": 1, "language": "greek", "genre": "oratory"},
        {"work": "Philippics", "passage_count": 3456, "books": 4, "language": "greek", "genre": "oratory"},
        {"work": "Olynthiacs", "passage_count": 2890, "books": 3, "language": "greek", "genre": "oratory"},
        {"work": "Against Meidias", "passage_count": 1234, "books": 1, "language": "greek", "genre": "oratory"},
    ],
}


class WorkInfo(BaseModel):
    work: str
    passage_count: int
    books: int
    language: str
    genre: str


class WorksResponse(BaseModel):
    author: str
    count: int
    works: List[WorkInfo]


@router.get("/{author}", response_model=WorksResponse)
async def list_works(author: str, language: Optional[str] = None):
    """
    List all works by a specific author.
    Returns comprehensive work metadata with passage counts.
    """
    # Find works for this author
    works = WORKS_DATABASE.get(author, [])

    if not works:
        # Try case-insensitive search
        for key in WORKS_DATABASE.keys():
            if key.lower() == author.lower():
                works = WORKS_DATABASE[key]
                author = key
                break

    if not works:
        raise HTTPException(status_code=404, detail=f"Author '{author}' not found")

    # Filter by language if specified
    if language:
        works = [w for w in works if w["language"].lower() == language.lower()]

    return WorksResponse(
        author=author,
        count=len(works),
        works=[WorkInfo(**w) for w in works]
    )
