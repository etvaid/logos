"""
Full-Text Search API - Comprehensive search across the LOGOS corpus
Searches authors, works, genres, and provides sample passages
"""

from fastapi import APIRouter, Query
from pydantic import BaseModel
from typing import List, Optional
import re

router = APIRouter()

# ═══════════════════════════════════════════════════════════════════════════════
# SAMPLE PASSAGES DATABASE - Famous quotes and openings from classical texts
# ═══════════════════════════════════════════════════════════════════════════════

SAMPLE_PASSAGES = {
    # Greek Epic
    "Homer": {
        "Iliad": [
            {"text": "μῆνιν ἄειδε θεὰ Πηληϊάδεω Ἀχιλῆος οὐλομένην", "reference": "Iliad 1.1", "translation": "Sing, goddess, the wrath of Achilles son of Peleus, the destructive wrath"},
            {"text": "ἄνδρα μοι ἔννεπε, μοῦσα, πολύτροπον", "reference": "Iliad 1.1 (variant)", "translation": "Tell me, Muse, of the man of many ways"},
            {"text": "οἳ δὲ θεοὶ πὰρ Ζηνὶ καθήμενοι ἠγορόωντο", "reference": "Iliad 4.1", "translation": "The gods, sitting beside Zeus, were holding assembly"},
        ],
        "Odyssey": [
            {"text": "ἄνδρα μοι ἔννεπε, μοῦσα, πολύτροπον, ὃς μάλα πολλὰ πλάγχθη", "reference": "Odyssey 1.1", "translation": "Tell me, Muse, of the man of many ways, who wandered far and wide"},
            {"text": "τὸν δ᾽ ἀπαμειβόμενος προσέφη πολύμητις Ὀδυσσεύς", "reference": "Odyssey 9.1", "translation": "Then resourceful Odysseus answered him"},
            {"text": "ἠῶθεν δ᾽ Ἰθάκης ἐπιβήσομαι", "reference": "Odyssey 13.344", "translation": "At dawn I shall set foot on Ithaca"},
        ],
    },
    "Hesiod": {
        "Theogony": [
            {"text": "Μουσάων Ἑλικωνιάδων ἀρχώμεθ᾽ ἀείδειν", "reference": "Theogony 1", "translation": "Let us begin to sing from the Heliconian Muses"},
            {"text": "Χάος γένετ᾽", "reference": "Theogony 116", "translation": "Chaos came into being"},
        ],
        "Works and Days": [
            {"text": "Μοῦσαι Πιερίηθεν ἀοιδῇσι κλείουσαι", "reference": "Works and Days 1", "translation": "Muses of Pieria who give glory through song"},
        ],
    },

    # Greek Tragedy
    "Sophocles": {
        "Oedipus Rex": [
            {"text": "ὦ τέκνα, Κάδμου τοῦ πάλαι νέα τροφή", "reference": "Oedipus Rex 1", "translation": "O children, latest born to Cadmus who was of old"},
            {"text": "οὐκ ἔστιν οὐδὲν δεινὸν ὧδ᾽ εἰπεῖν ἔπος", "reference": "Oedipus Rex 1171", "translation": "There is no word so terrible to speak"},
        ],
        "Antigone": [
            {"text": "ὦ κοινὸν αὐτάδελφον Ἰσμήνης κάρα", "reference": "Antigone 1", "translation": "O common sisterly head of Ismene"},
            {"text": "πολλὰ τὰ δεινὰ κοὐδὲν ἀνθρώπου δεινότερον πέλει", "reference": "Antigone 332", "translation": "Many are the wonders, and nothing is more wondrous than man"},
        ],
    },
    "Euripides": {
        "Medea": [
            {"text": "εἴθ᾽ ὤφελ᾽ Ἀργοῦς μὴ διαπτάσθαι σκάφος", "reference": "Medea 1", "translation": "Would that the Argo had never flown through"},
        ],
        "Bacchae": [
            {"text": "ἥκω Διὸς παῖς τήνδε Θηβαίων χθόνα Διόνυσος", "reference": "Bacchae 1", "translation": "I have come, the son of Zeus, to this land of Thebes, Dionysus"},
        ],
    },
    "Aeschylus": {
        "Agamemnon": [
            {"text": "θεοὺς μὲν αἰτῶ τῶνδ᾽ ἀπαλλαγὴν πόνων", "reference": "Agamemnon 1", "translation": "I pray the gods for release from these toils"},
        ],
        "Prometheus Bound": [
            {"text": "Χθονὸς μὲν εἰς τηλουρὸν ἥκομεν πέδον", "reference": "Prometheus Bound 1", "translation": "We have come to the far-distant plain of earth"},
        ],
    },

    # Greek Philosophy
    "Plato": {
        "Republic": [
            {"text": "κατέβην χθὲς εἰς Πειραιᾶ μετὰ Γλαύκωνος", "reference": "Republic 327a", "translation": "I went down yesterday to the Piraeus with Glaucon"},
            {"text": "δικαιοσύνη ἐστὶν ἡ μεγίστη ἀρετή", "reference": "Republic 433a", "translation": "Justice is the greatest virtue"},
            {"text": "τὸ ἀγαθὸν ἰδέα", "reference": "Republic 508e", "translation": "The Form of the Good"},
        ],
        "Symposium": [
            {"text": "ἔρως ἐστὶ θεός μέγας", "reference": "Symposium 202d", "translation": "Love is a great god"},
            {"text": "τὸ καλὸν αὐτὸ καθ᾽ αὑτό", "reference": "Symposium 211d", "translation": "Beauty itself by itself"},
        ],
        "Apology": [
            {"text": "ὁ δὲ ἀνεξέταστος βίος οὐ βιωτὸς ἀνθρώπῳ", "reference": "Apology 38a", "translation": "The unexamined life is not worth living"},
        ],
        "Phaedo": [
            {"text": "ψυχὴ ἀθάνατος", "reference": "Phaedo 105e", "translation": "The soul is immortal"},
        ],
    },
    "Aristotle": {
        "Nicomachean Ethics": [
            {"text": "πᾶσα τέχνη καὶ πᾶσα μέθοδος, ὁμοίως δὲ πρᾶξίς τε καὶ προαίρεσις, ἀγαθοῦ τινὸς ἐφίεσθαι δοκεῖ", "reference": "NE 1094a", "translation": "Every art and every inquiry, and similarly every action and pursuit, is thought to aim at some good"},
            {"text": "ἡ εὐδαιμονία ἐστὶ ψυχῆς ἐνέργεια κατ᾽ ἀρετήν", "reference": "NE 1098a", "translation": "Happiness is an activity of the soul in accordance with virtue"},
        ],
        "Metaphysics": [
            {"text": "πάντες ἄνθρωποι τοῦ εἰδέναι ὀρέγονται φύσει", "reference": "Metaphysics 980a", "translation": "All men by nature desire to know"},
        ],
        "Poetics": [
            {"text": "ἡ τραγῳδία μίμησις πράξεως σπουδαίας", "reference": "Poetics 1449b", "translation": "Tragedy is an imitation of a serious action"},
        ],
    },

    # Latin Epic
    "Virgil": {
        "Aeneid": [
            {"text": "Arma virumque cano, Troiae qui primus ab oris Italiam fato profugus Laviniaque venit litora", "reference": "Aeneid 1.1", "translation": "I sing of arms and the man, who first from the shores of Troy, exiled by fate, came to Italy and the Lavinian shores"},
            {"text": "Sunt lacrimae rerum et mentem mortalia tangunt", "reference": "Aeneid 1.462", "translation": "There are tears for things, and mortal affairs touch the mind"},
            {"text": "Forsan et haec olim meminisse iuvabit", "reference": "Aeneid 1.203", "translation": "Perhaps one day it will please us to remember even these things"},
            {"text": "Tu regere imperio populos, Romane, memento", "reference": "Aeneid 6.851", "translation": "Remember, Roman, to rule the peoples with your power"},
        ],
        "Georgics": [
            {"text": "Quid faciat laetas segetes", "reference": "Georgics 1.1", "translation": "What makes the crops joyful"},
            {"text": "Labor omnia vincit", "reference": "Georgics 1.145", "translation": "Work conquers all things"},
        ],
        "Eclogues": [
            {"text": "Tityre, tu patulae recubans sub tegmine fagi", "reference": "Eclogues 1.1", "translation": "Tityrus, you lying under the cover of a spreading beech"},
        ],
    },
    "Ovid": {
        "Metamorphoses": [
            {"text": "In nova fert animus mutatas dicere formas corpora", "reference": "Metamorphoses 1.1", "translation": "My mind leads me to speak of forms changed into new bodies"},
            {"text": "Omnia mutantur, nihil interit", "reference": "Metamorphoses 15.165", "translation": "All things change, nothing perishes"},
        ],
        "Ars Amatoria": [
            {"text": "Si quis in hoc artem populo non novit amandi", "reference": "Ars Amatoria 1.1", "translation": "If anyone among this people does not know the art of love"},
        ],
    },
    "Horace": {
        "Odes": [
            {"text": "Carpe diem, quam minimum credula postero", "reference": "Odes 1.11", "translation": "Seize the day, trusting as little as possible in tomorrow"},
            {"text": "Dulce et decorum est pro patria mori", "reference": "Odes 3.2", "translation": "It is sweet and fitting to die for one's country"},
            {"text": "Nunc est bibendum", "reference": "Odes 1.37", "translation": "Now is the time for drinking"},
        ],
        "Ars Poetica": [
            {"text": "Ut pictura poesis", "reference": "Ars Poetica 361", "translation": "As is painting so is poetry"},
        ],
    },

    # Latin Prose
    "Cicero": {
        "De Oratore": [
            {"text": "Nihil est tam incredibile quod non dicendo fiat probabile", "reference": "De Oratore 1.61", "translation": "Nothing is so incredible that it cannot be made believable by speaking"},
        ],
        "De Republica": [
            {"text": "Res publica res populi", "reference": "De Republica 1.39", "translation": "The republic is the affair of the people"},
        ],
        "In Catilinam": [
            {"text": "Quo usque tandem abutere, Catilina, patientia nostra?", "reference": "In Catilinam 1.1", "translation": "How long, Catiline, will you abuse our patience?"},
            {"text": "O tempora, o mores!", "reference": "In Catilinam 1.2", "translation": "O the times, O the customs!"},
        ],
        "De Officiis": [
            {"text": "Omnium autem rerum, ex quibus aliquid adquiritur, nihil est agri cultura melius", "reference": "De Officiis 1.151", "translation": "Of all the occupations by which gain is secured, none is better than agriculture"},
        ],
    },
    "Seneca the Younger": {
        "Epistulae Morales": [
            {"text": "Non scholae sed vitae discimus", "reference": "Epistulae 106.12", "translation": "We learn not for school but for life"},
            {"text": "Dum inter homines sumus, colamus humanitatem", "reference": "Epistulae 95.53", "translation": "While we are among humans, let us cultivate humanity"},
        ],
    },
    "Julius Caesar": {
        "De Bello Gallico": [
            {"text": "Gallia est omnis divisa in partes tres", "reference": "De Bello Gallico 1.1", "translation": "All Gaul is divided into three parts"},
            {"text": "Veni, vidi, vici", "reference": "De Bello Gallico (attrib.)", "translation": "I came, I saw, I conquered"},
        ],
    },
    "Tacitus": {
        "Annals": [
            {"text": "Urbem Romam a principio reges habuere", "reference": "Annals 1.1", "translation": "From the beginning, kings held the city of Rome"},
        ],
        "Germania": [
            {"text": "Germania omnis a Gallis Raetisque et Pannoniis Rheno et Danuvio fluminibus", "reference": "Germania 1", "translation": "All Germany is separated from Gaul, Raetia, and Pannonia by the Rhine and Danube rivers"},
        ],
    },

    # Church Fathers
    "Augustine": {
        "Confessions": [
            {"text": "Fecisti nos ad te et inquietum est cor nostrum donec requiescat in te", "reference": "Confessions 1.1", "translation": "You have made us for yourself, and our heart is restless until it rests in you"},
            {"text": "Da mihi castitatem et continentiam, sed noli modo", "reference": "Confessions 8.7", "translation": "Give me chastity and continence, but not yet"},
            {"text": "Tolle lege, tolle lege", "reference": "Confessions 8.12", "translation": "Take up and read, take up and read"},
        ],
        "City of God": [
            {"text": "Gloriosissimam civitatem Dei", "reference": "City of God 1.1", "translation": "The most glorious city of God"},
        ],
    },

    # Hebrew Scripture
    "Torah (Pentateuch)": {
        "Genesis (Bereshit)": [
            {"text": "בְּרֵאשִׁית בָּרָא אֱלֹהִים אֵת הַשָּׁמַיִם וְאֵת הָאָרֶץ", "reference": "Genesis 1:1", "translation": "In the beginning God created the heavens and the earth"},
        ],
    },
    "Prophets (Nevi'im)": {
        "Isaiah": [
            {"text": "קוֹל קוֹרֵא בַּמִּדְבָּר", "reference": "Isaiah 40:3", "translation": "A voice cries out in the wilderness"},
        ],
    },
}

# Author metadata for search context
AUTHOR_METADATA = {
    "Homer": {"period": "Archaic Greek", "dates": "c. 8th century BCE", "genre": "Epic Poetry", "language": "greek", "description": "Legendary poet credited with the Iliad and Odyssey, foundational works of Western literature"},
    "Hesiod": {"period": "Archaic Greek", "dates": "c. 700 BCE", "genre": "Didactic Poetry", "language": "greek", "description": "Early Greek poet known for Theogony and Works and Days"},
    "Pindar": {"period": "Classical Greek", "dates": "518-438 BCE", "genre": "Lyric Poetry", "language": "greek", "description": "Greatest of the Greek lyric poets, famous for victory odes"},
    "Sappho": {"period": "Archaic Greek", "dates": "c. 630-570 BCE", "genre": "Lyric Poetry", "language": "greek", "description": "Lyric poet from Lesbos, celebrated for love poetry"},
    "Aeschylus": {"period": "Classical Greek", "dates": "525-456 BCE", "genre": "Tragedy", "language": "greek", "description": "Father of tragedy, author of the Oresteia"},
    "Sophocles": {"period": "Classical Greek", "dates": "496-406 BCE", "genre": "Tragedy", "language": "greek", "description": "Master tragedian, author of Oedipus Rex and Antigone"},
    "Euripides": {"period": "Classical Greek", "dates": "480-406 BCE", "genre": "Tragedy", "language": "greek", "description": "Innovative tragedian known for psychological depth"},
    "Aristophanes": {"period": "Classical Greek", "dates": "446-386 BCE", "genre": "Comedy", "language": "greek", "description": "Master of Old Comedy, political satirist"},
    "Herodotus": {"period": "Classical Greek", "dates": "484-425 BCE", "genre": "History", "language": "greek", "description": "Father of History, author of the Histories"},
    "Thucydides": {"period": "Classical Greek", "dates": "460-400 BCE", "genre": "History", "language": "greek", "description": "Historian of the Peloponnesian War, pioneer of critical history"},
    "Xenophon": {"period": "Classical Greek", "dates": "430-354 BCE", "genre": "History", "language": "greek", "description": "Historian and philosopher, student of Socrates"},
    "Plato": {"period": "Classical Greek", "dates": "428-348 BCE", "genre": "Philosophy", "language": "greek", "description": "Founder of the Academy, author of the Republic and Symposium"},
    "Aristotle": {"period": "Classical Greek", "dates": "384-322 BCE", "genre": "Philosophy", "language": "greek", "description": "Polymath philosopher, tutor of Alexander the Great"},
    "Demosthenes": {"period": "Classical Greek", "dates": "384-322 BCE", "genre": "Oratory", "language": "greek", "description": "Greatest Athenian orator, famous for Philippics"},
    "Plutarch": {"period": "Roman Greek", "dates": "46-120 CE", "genre": "Biography", "language": "greek", "description": "Author of Parallel Lives and Moralia"},
    "Epictetus": {"period": "Roman Greek", "dates": "50-135 CE", "genre": "Philosophy", "language": "greek", "description": "Stoic philosopher, author of the Discourses"},
    "Marcus Aurelius": {"period": "Roman Greek", "dates": "121-180 CE", "genre": "Philosophy", "language": "greek", "description": "Roman Emperor and Stoic philosopher, author of Meditations"},
    "Virgil": {"period": "Augustan Latin", "dates": "70-19 BCE", "genre": "Epic Poetry", "language": "latin", "description": "Rome's greatest poet, author of the Aeneid"},
    "Horace": {"period": "Augustan Latin", "dates": "65-8 BCE", "genre": "Lyric Poetry", "language": "latin", "description": "Master lyric poet, author of Odes and Satires"},
    "Ovid": {"period": "Augustan Latin", "dates": "43 BCE-17 CE", "genre": "Poetry", "language": "latin", "description": "Prolific poet, author of Metamorphoses"},
    "Cicero": {"period": "Republican Latin", "dates": "106-43 BCE", "genre": "Oratory", "language": "latin", "description": "Rome's greatest orator and statesman"},
    "Julius Caesar": {"period": "Republican Latin", "dates": "100-44 BCE", "genre": "History", "language": "latin", "description": "General and dictator, author of the Gallic Wars"},
    "Livy": {"period": "Augustan Latin", "dates": "59 BCE-17 CE", "genre": "History", "language": "latin", "description": "Historian of Rome from its founding"},
    "Tacitus": {"period": "Imperial Latin", "dates": "56-120 CE", "genre": "History", "language": "latin", "description": "Historian of the Roman Empire"},
    "Seneca the Younger": {"period": "Imperial Latin", "dates": "4 BCE-65 CE", "genre": "Philosophy", "language": "latin", "description": "Stoic philosopher and tragedian"},
    "Augustine": {"period": "Late Latin", "dates": "354-430 CE", "genre": "Theology", "language": "latin", "description": "Church Father, author of Confessions and City of God"},
    "Jerome": {"period": "Late Latin", "dates": "347-420 CE", "genre": "Theology", "language": "latin", "description": "Church Father, translator of the Vulgate Bible"},
    "Boethius": {"period": "Late Latin", "dates": "480-524 CE", "genre": "Philosophy", "language": "latin", "description": "Last of the Romans, author of Consolation of Philosophy"},
}


class SearchResult(BaseModel):
    author: str
    work: str
    passage: str
    reference: str
    translation: Optional[str] = None
    language: str
    genre: str
    relevance_score: float


class SearchResponse(BaseModel):
    query: str
    total: int
    count: int
    results: List[SearchResult]
    suggestions: List[str] = []


def calculate_relevance(query: str, text: str, author: str, work: str, is_translation: bool = False) -> float:
    """Calculate relevance score based on match quality"""
    query_lower = query.lower()
    text_lower = text.lower()
    author_lower = author.lower()
    work_lower = work.lower()

    score = 0.0

    # Exact match in text
    if query_lower in text_lower:
        score += 0.5
        # Bonus for match at start
        if text_lower.startswith(query_lower):
            score += 0.2

    # Match in author name
    if query_lower in author_lower:
        score += 0.3

    # Match in work title
    if query_lower in work_lower:
        score += 0.25

    # Match in translation
    if is_translation:
        score += 0.1

    # Word boundary matches get bonus
    words = query_lower.split()
    for word in words:
        if f" {word} " in f" {text_lower} ":
            score += 0.1

    return min(score, 1.0)


@router.get("/")
async def search_text(
    q: str = Query(..., description="Search query"),
    language: Optional[str] = Query(None, description="Filter by language (greek, latin, hebrew)"),
    author: Optional[str] = Query(None, description="Filter by author name"),
    genre: Optional[str] = Query(None, description="Filter by genre"),
    limit: int = Query(25, ge=1, le=100, description="Maximum results"),
    offset: int = Query(0, ge=0, description="Result offset for pagination"),
    sortBy: Optional[str] = Query("relevance", description="Sort by relevance, author, or work"),
) -> SearchResponse:
    """
    Full-text search across the LOGOS corpus.
    Searches author names, work titles, and passage content.
    """
    results = []
    query_lower = q.lower()

    # Search through sample passages
    for author_name, works in SAMPLE_PASSAGES.items():
        # Skip if author filter doesn't match
        if author and author.lower() not in author_name.lower():
            continue

        author_meta = AUTHOR_METADATA.get(author_name, {})
        author_lang = author_meta.get("language", "greek")
        author_genre = author_meta.get("genre", "unknown")

        # Skip if language filter doesn't match
        if language and language.lower() != author_lang:
            continue

        # Skip if genre filter doesn't match
        if genre and genre.lower() not in author_genre.lower():
            continue

        for work_title, passages in works.items():
            for passage in passages:
                text = passage["text"]
                translation = passage.get("translation", "")
                reference = passage["reference"]

                # Check if query matches
                matches_text = query_lower in text.lower()
                matches_translation = query_lower in translation.lower()
                matches_author = query_lower in author_name.lower()
                matches_work = query_lower in work_title.lower()
                matches_genre = query_lower in author_genre.lower()

                if matches_text or matches_translation or matches_author or matches_work or matches_genre:
                    relevance = calculate_relevance(
                        q,
                        f"{text} {translation} {author_name} {work_title}",
                        author_name,
                        work_title,
                        matches_translation
                    )

                    results.append(SearchResult(
                        author=author_name,
                        work=work_title,
                        passage=text,
                        reference=reference,
                        translation=translation,
                        language=author_lang,
                        genre=author_genre,
                        relevance_score=relevance
                    ))

    # Also search author metadata for conceptual matches
    for author_name, meta in AUTHOR_METADATA.items():
        if author and author.lower() not in author_name.lower():
            continue
        if language and language.lower() != meta.get("language", ""):
            continue
        if genre and genre.lower() not in meta.get("genre", "").lower():
            continue

        # Check if query matches author description or metadata
        description = meta.get("description", "")
        if query_lower in description.lower() or query_lower in author_name.lower():
            # Add a representative result if we don't already have passages
            if author_name in SAMPLE_PASSAGES:
                works = SAMPLE_PASSAGES[author_name]
                first_work = list(works.keys())[0]
                first_passage = works[first_work][0]

                # Check if we already added this
                already_added = any(
                    r.author == author_name and r.work == first_work
                    for r in results
                )

                if not already_added:
                    results.append(SearchResult(
                        author=author_name,
                        work=first_work,
                        passage=first_passage["text"],
                        reference=first_passage["reference"],
                        translation=first_passage.get("translation"),
                        language=meta.get("language", "greek"),
                        genre=meta.get("genre", "unknown"),
                        relevance_score=0.3  # Lower relevance for description matches
                    ))

    # Sort results
    if sortBy == "relevance":
        results.sort(key=lambda x: x.relevance_score, reverse=True)
    elif sortBy == "author":
        results.sort(key=lambda x: x.author)
    elif sortBy == "work":
        results.sort(key=lambda x: (x.author, x.work))

    # Generate suggestions
    suggestions = []
    if len(results) < 5:
        # Suggest related searches
        common_terms = ["logos", "virtue", "love", "war", "fate", "god", "soul", "justice", "beauty", "truth"]
        suggestions = [term for term in common_terms if term != query_lower][:5]

    total = len(results)
    paginated = results[offset:offset + limit]

    return SearchResponse(
        query=q,
        total=total,
        count=len(paginated),
        results=paginated,
        suggestions=suggestions
    )


@router.get("/authors")
async def search_authors(
    q: str = Query(..., description="Search query"),
    language: Optional[str] = Query(None, description="Filter by language"),
) -> dict:
    """
    Search for authors by name, period, or description.
    """
    results = []
    query_lower = q.lower()

    for author_name, meta in AUTHOR_METADATA.items():
        if language and language.lower() != meta.get("language", ""):
            continue

        # Check if query matches
        if (query_lower in author_name.lower() or
            query_lower in meta.get("description", "").lower() or
            query_lower in meta.get("period", "").lower() or
            query_lower in meta.get("genre", "").lower()):

            results.append({
                "name": author_name,
                "period": meta.get("period"),
                "dates": meta.get("dates"),
                "genre": meta.get("genre"),
                "language": meta.get("language"),
                "description": meta.get("description"),
            })

    return {
        "query": q,
        "count": len(results),
        "authors": results
    }


@router.get("/works")
async def search_works(
    q: str = Query(..., description="Search query"),
    language: Optional[str] = Query(None, description="Filter by language"),
    author: Optional[str] = Query(None, description="Filter by author"),
) -> dict:
    """
    Search for works by title.
    """
    results = []
    query_lower = q.lower()

    for author_name, works in SAMPLE_PASSAGES.items():
        if author and author.lower() not in author_name.lower():
            continue

        author_meta = AUTHOR_METADATA.get(author_name, {})
        if language and language.lower() != author_meta.get("language", ""):
            continue

        for work_title in works.keys():
            if query_lower in work_title.lower() or query_lower in author_name.lower():
                results.append({
                    "author": author_name,
                    "work": work_title,
                    "language": author_meta.get("language"),
                    "genre": author_meta.get("genre"),
                })

    return {
        "query": q,
        "count": len(results),
        "works": results
    }
