# -*- coding: utf-8 -*-
"""
Get Passages API - Returns passages for a specific author and work
Provides sample passages from classical texts for the reader
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional

router = APIRouter()

# Sample passages from famous works
PASSAGES_DATABASE = {
    # Homer's Iliad
    ("Homer", "Iliad"): {
        "total": 15693,
        "language": "greek",
        "passages": [
            {"id": "urn:cts:greekLit:tlg0012.tlg001.perseus-grc2:1.1", "content": "μῆνιν ἄειδε θεὰ Πηληϊάδεω Ἀχιλῆος", "section": "Book 1, Line 1", "urn": "urn:cts:greekLit:tlg0012.tlg001:1.1"},
            {"id": "urn:cts:greekLit:tlg0012.tlg001.perseus-grc2:1.2", "content": "οὐλομένην, ἣ μυρί᾽ Ἀχαιοῖς ἄλγε᾽ ἔθηκε,", "section": "Book 1, Line 2", "urn": "urn:cts:greekLit:tlg0012.tlg001:1.2"},
            {"id": "urn:cts:greekLit:tlg0012.tlg001.perseus-grc2:1.3", "content": "πολλὰς δ᾽ ἰφθίμους ψυχὰς Ἄϊδι προΐαψεν", "section": "Book 1, Line 3", "urn": "urn:cts:greekLit:tlg0012.tlg001:1.3"},
            {"id": "urn:cts:greekLit:tlg0012.tlg001.perseus-grc2:1.4", "content": "ἡρώων, αὐτοὺς δὲ ἑλώρια τεῦχε κύνεσσιν", "section": "Book 1, Line 4", "urn": "urn:cts:greekLit:tlg0012.tlg001:1.4"},
            {"id": "urn:cts:greekLit:tlg0012.tlg001.perseus-grc2:1.5", "content": "οἰωνοῖσί τε πᾶσι, Διὸς δ᾽ ἐτελείετο βουλή,", "section": "Book 1, Line 5", "urn": "urn:cts:greekLit:tlg0012.tlg001:1.5"},
            {"id": "urn:cts:greekLit:tlg0012.tlg001.perseus-grc2:1.6", "content": "ἐξ οὗ δὴ τὰ πρῶτα διαστήτην ἐρίσαντε", "section": "Book 1, Line 6", "urn": "urn:cts:greekLit:tlg0012.tlg001:1.6"},
            {"id": "urn:cts:greekLit:tlg0012.tlg001.perseus-grc2:1.7", "content": "Ἀτρεΐδης τε ἄναξ ἀνδρῶν καὶ δῖος Ἀχιλλεύς.", "section": "Book 1, Line 7", "urn": "urn:cts:greekLit:tlg0012.tlg001:1.7"},
            {"id": "urn:cts:greekLit:tlg0012.tlg001.perseus-grc2:1.8", "content": "τίς τ᾽ ἄρ σφωε θεῶν ἔριδι ξυνέηκε μάχεσθαι;", "section": "Book 1, Line 8", "urn": "urn:cts:greekLit:tlg0012.tlg001:1.8"},
            {"id": "urn:cts:greekLit:tlg0012.tlg001.perseus-grc2:1.9", "content": "Λητοῦς καὶ Διὸς υἱός: ὃ γὰρ βασιλῆϊ χολωθεὶς", "section": "Book 1, Line 9", "urn": "urn:cts:greekLit:tlg0012.tlg001:1.9"},
            {"id": "urn:cts:greekLit:tlg0012.tlg001.perseus-grc2:1.10", "content": "νοῦσον ἀνὰ στρατὸν ὄρσε κακήν, ὀλέκοντο δὲ λαοί,", "section": "Book 1, Line 10", "urn": "urn:cts:greekLit:tlg0012.tlg001:1.10"},
        ]
    },

    # Homer's Odyssey
    ("Homer", "Odyssey"): {
        "total": 12110,
        "language": "greek",
        "passages": [
            {"id": "urn:cts:greekLit:tlg0012.tlg002.perseus-grc2:1.1", "content": "ἄνδρα μοι ἔννεπε, μοῦσα, πολύτροπον, ὃς μάλα πολλὰ", "section": "Book 1, Line 1", "urn": "urn:cts:greekLit:tlg0012.tlg002:1.1"},
            {"id": "urn:cts:greekLit:tlg0012.tlg002.perseus-grc2:1.2", "content": "πλάγχθη, ἐπεὶ Τροίης ἱερὸν πτολίεθρον ἔπερσεν:", "section": "Book 1, Line 2", "urn": "urn:cts:greekLit:tlg0012.tlg002:1.2"},
            {"id": "urn:cts:greekLit:tlg0012.tlg002.perseus-grc2:1.3", "content": "πολλῶν δ᾽ ἀνθρώπων ἴδεν ἄστεα καὶ νόον ἔγνω,", "section": "Book 1, Line 3", "urn": "urn:cts:greekLit:tlg0012.tlg002:1.3"},
            {"id": "urn:cts:greekLit:tlg0012.tlg002.perseus-grc2:1.4", "content": "πολλὰ δ᾽ ὅ γ᾽ ἐν πόντῳ πάθεν ἄλγεα ὃν κατὰ θυμόν,", "section": "Book 1, Line 4", "urn": "urn:cts:greekLit:tlg0012.tlg002:1.4"},
            {"id": "urn:cts:greekLit:tlg0012.tlg002.perseus-grc2:1.5", "content": "ἀρνύμενος ἥν τε ψυχὴν καὶ νόστον ἑταίρων.", "section": "Book 1, Line 5", "urn": "urn:cts:greekLit:tlg0012.tlg002:1.5"},
        ]
    },

    # Plato's Republic
    ("Plato", "Republic"): {
        "total": 8456,
        "language": "greek",
        "passages": [
            {"id": "plato.rep.327a", "content": "Κατέβην χθὲς εἰς Πειραιᾶ μετὰ Γλαύκωνος τοῦ Ἀρίστωνος", "section": "327a", "urn": "urn:cts:greekLit:tlg0059.tlg030:327a"},
            {"id": "plato.rep.327a2", "content": "προσευξόμενός τε τῇ θεῷ καὶ ἅμα τὴν ἑορτὴν βουλόμενος θεάσασθαι", "section": "327a", "urn": "urn:cts:greekLit:tlg0059.tlg030:327a2"},
            {"id": "plato.rep.327b", "content": "τίνα τρόπον ποιήσουσιν, ἅτε νῦν πρῶτον ἄγοντες.", "section": "327b", "urn": "urn:cts:greekLit:tlg0059.tlg030:327b"},
            {"id": "plato.rep.327c", "content": "καλὴ μὲν οὖν μοι καὶ ἡ τῶν ἐπιχωρίων πομπὴ ἔδοξεν εἶναι,", "section": "327c", "urn": "urn:cts:greekLit:tlg0059.tlg030:327c"},
            {"id": "plato.rep.327d", "content": "οὐ μέντοι ἧττον ἐφαίνετο πρέπειν ἣν οἱ Θρᾷκες ἔπεμπον.", "section": "327d", "urn": "urn:cts:greekLit:tlg0059.tlg030:327d"},
        ]
    },

    # Plato's Symposium
    ("Plato", "Symposium"): {
        "total": 2345,
        "language": "greek",
        "passages": [
            {"id": "plato.symp.172a", "content": "Δοκῶ μοι περὶ ὧν πυνθάνεσθε οὐκ ἀμελέτητος εἶναι.", "section": "172a", "urn": "urn:cts:greekLit:tlg0059.tlg011:172a"},
            {"id": "plato.symp.172b", "content": "καὶ γὰρ ἐτύγχανον πρῴην εἰς ἄστυ οἴκοθεν ἀνιὼν Φαληρόθεν:", "section": "172b", "urn": "urn:cts:greekLit:tlg0059.tlg011:172b"},
            {"id": "plato.symp.172c", "content": "τῶν οὖν γνωρίμων τις ὄπισθεν κατιδών με πόρρωθεν ἐκάλεσε,", "section": "172c", "urn": "urn:cts:greekLit:tlg0059.tlg011:172c"},
        ]
    },

    # Aristotle's Nicomachean Ethics
    ("Aristotle", "Nicomachean Ethics"): {
        "total": 4567,
        "language": "greek",
        "passages": [
            {"id": "arist.ne.1094a", "content": "Πᾶσα τέχνη καὶ πᾶσα μέθοδος, ὁμοίως δὲ πρᾶξίς τε καὶ προαίρεσις,", "section": "1094a", "urn": "urn:cts:greekLit:tlg0086.tlg010:1094a"},
            {"id": "arist.ne.1094a2", "content": "ἀγαθοῦ τινὸς ἐφίεσθαι δοκεῖ: διὸ καλῶς ἀπεφήναντο τἀγαθόν,", "section": "1094a", "urn": "urn:cts:greekLit:tlg0086.tlg010:1094a2"},
            {"id": "arist.ne.1094b", "content": "οὗ πάντ᾽ ἐφίεται.", "section": "1094b", "urn": "urn:cts:greekLit:tlg0086.tlg010:1094b"},
            {"id": "arist.ne.1094c", "content": "διαφορὰ δέ τις φαίνεται τῶν τελῶν: τὰ μὲν γάρ εἰσιν ἐνέργειαι,", "section": "1094c", "urn": "urn:cts:greekLit:tlg0086.tlg010:1094c"},
            {"id": "arist.ne.1094d", "content": "τὰ δὲ παρ᾽ αὐτὰς ἔργα τινά.", "section": "1094d", "urn": "urn:cts:greekLit:tlg0086.tlg010:1094d"},
        ]
    },

    # Virgil's Aeneid
    ("Virgil", "Aeneid"): {
        "total": 9896,
        "language": "latin",
        "passages": [
            {"id": "verg.aen.1.1", "content": "Arma virumque cano, Troiae qui primus ab oris", "section": "Book 1, Line 1", "urn": "urn:cts:latinLit:phi0690.phi003:1.1"},
            {"id": "verg.aen.1.2", "content": "Italiam, fato profugus, Laviniaque venit", "section": "Book 1, Line 2", "urn": "urn:cts:latinLit:phi0690.phi003:1.2"},
            {"id": "verg.aen.1.3", "content": "litora, multum ille et terris iactatus et alto", "section": "Book 1, Line 3", "urn": "urn:cts:latinLit:phi0690.phi003:1.3"},
            {"id": "verg.aen.1.4", "content": "vi superum saevae memorem Iunonis ob iram;", "section": "Book 1, Line 4", "urn": "urn:cts:latinLit:phi0690.phi003:1.4"},
            {"id": "verg.aen.1.5", "content": "multa quoque et bello passus, dum conderet urbem,", "section": "Book 1, Line 5", "urn": "urn:cts:latinLit:phi0690.phi003:1.5"},
            {"id": "verg.aen.1.6", "content": "inferretque deos Latio, genus unde Latinum,", "section": "Book 1, Line 6", "urn": "urn:cts:latinLit:phi0690.phi003:1.6"},
            {"id": "verg.aen.1.7", "content": "Albanique patres, atque altae moenia Romae.", "section": "Book 1, Line 7", "urn": "urn:cts:latinLit:phi0690.phi003:1.7"},
        ]
    },

    # Cicero's De Oratore
    ("Cicero", "De Oratore"): {
        "total": 4567,
        "language": "latin",
        "passages": [
            {"id": "cic.de_or.1.1", "content": "Cogitanti mihi saepenumero et memoria vetera repetenti", "section": "1.1", "urn": "urn:cts:latinLit:phi0474.phi048:1.1"},
            {"id": "cic.de_or.1.2", "content": "perbeati fuisse, Quinte frater, illi videri solent", "section": "1.2", "urn": "urn:cts:latinLit:phi0474.phi048:1.2"},
            {"id": "cic.de_or.1.3", "content": "qui in optima re publica, cum et honoribus et rerum gestarum gloria florerent,", "section": "1.3", "urn": "urn:cts:latinLit:phi0474.phi048:1.3"},
            {"id": "cic.de_or.1.4", "content": "eum vitae cursum tenere potuerunt, ut vel in negotio sine periculo", "section": "1.4", "urn": "urn:cts:latinLit:phi0474.phi048:1.4"},
            {"id": "cic.de_or.1.5", "content": "vel in otio cum dignitate esse possent.", "section": "1.5", "urn": "urn:cts:latinLit:phi0474.phi048:1.5"},
        ]
    },

    # Ovid's Metamorphoses
    ("Ovid", "Metamorphoses"): {
        "total": 11995,
        "language": "latin",
        "passages": [
            {"id": "ov.met.1.1", "content": "In nova fert animus mutatas dicere formas", "section": "Book 1, Line 1", "urn": "urn:cts:latinLit:phi0959.phi006:1.1"},
            {"id": "ov.met.1.2", "content": "corpora; di, coeptis (nam vos mutastis et illas)", "section": "Book 1, Line 2", "urn": "urn:cts:latinLit:phi0959.phi006:1.2"},
            {"id": "ov.met.1.3", "content": "adspirate meis primaque ab origine mundi", "section": "Book 1, Line 3", "urn": "urn:cts:latinLit:phi0959.phi006:1.3"},
            {"id": "ov.met.1.4", "content": "ad mea perpetuum deducite tempora carmen!", "section": "Book 1, Line 4", "urn": "urn:cts:latinLit:phi0959.phi006:1.4"},
        ]
    },

    # Seneca's Epistulae Morales
    ("Seneca the Younger", "Epistulae Morales"): {
        "total": 8934,
        "language": "latin",
        "passages": [
            {"id": "sen.ep.1.1", "content": "Ita fac, mi Lucili: vindica te tibi,", "section": "Epistle 1.1", "urn": "urn:cts:latinLit:stoa0255.stoa001:1.1"},
            {"id": "sen.ep.1.2", "content": "et tempus quod adhuc aut auferebatur aut subripiebatur aut excidebat", "section": "Epistle 1.2", "urn": "urn:cts:latinLit:stoa0255.stoa001:1.2"},
            {"id": "sen.ep.1.3", "content": "collige et serva.", "section": "Epistle 1.3", "urn": "urn:cts:latinLit:stoa0255.stoa001:1.3"},
            {"id": "sen.ep.1.4", "content": "Persuade tibi hoc sic esse ut scribo: quaedam tempora eripiuntur nobis,", "section": "Epistle 1.4", "urn": "urn:cts:latinLit:stoa0255.stoa001:1.4"},
            {"id": "sen.ep.1.5", "content": "quaedam subducuntur, quaedam effluunt.", "section": "Epistle 1.5", "urn": "urn:cts:latinLit:stoa0255.stoa001:1.5"},
        ]
    },

    # Augustine's Confessions
    ("Augustine", "Confessions"): {
        "total": 8934,
        "language": "latin",
        "passages": [
            {"id": "aug.conf.1.1", "content": "Magnus es, Domine, et laudabilis valde:", "section": "1.1.1", "urn": "urn:cts:latinLit:stoa0040.stoa001:1.1.1"},
            {"id": "aug.conf.1.2", "content": "magna virtus tua et sapientiae tuae non est numerus.", "section": "1.1.1", "urn": "urn:cts:latinLit:stoa0040.stoa001:1.1.2"},
            {"id": "aug.conf.1.3", "content": "Et laudare te vult homo, aliqua portio creaturae tuae,", "section": "1.1.2", "urn": "urn:cts:latinLit:stoa0040.stoa001:1.1.3"},
            {"id": "aug.conf.1.4", "content": "et homo circumferens mortalitatem suam,", "section": "1.1.2", "urn": "urn:cts:latinLit:stoa0040.stoa001:1.1.4"},
            {"id": "aug.conf.1.5", "content": "circumferens testimonium peccati sui.", "section": "1.1.2", "urn": "urn:cts:latinLit:stoa0040.stoa001:1.1.5"},
        ]
    },

    # Sophocles' Oedipus Rex
    ("Sophocles", "Oedipus Rex"): {
        "total": 1530,
        "language": "greek",
        "passages": [
            {"id": "soph.ot.1", "content": "Ὦ τέκνα, Κάδμου τοῦ πάλαι νέα τροφή,", "section": "Line 1", "urn": "urn:cts:greekLit:tlg0011.tlg004:1"},
            {"id": "soph.ot.2", "content": "τίνας ποθ᾽ ἕδρας τάσδε μοι θοάζετε", "section": "Line 2", "urn": "urn:cts:greekLit:tlg0011.tlg004:2"},
            {"id": "soph.ot.3", "content": "ἱκτηρίοις κλάδοισιν ἐξεστεμμένοι;", "section": "Line 3", "urn": "urn:cts:greekLit:tlg0011.tlg004:3"},
            {"id": "soph.ot.4", "content": "πόλις δ᾽ ὁμοῦ μὲν θυμιαμάτων γέμει,", "section": "Line 4", "urn": "urn:cts:greekLit:tlg0011.tlg004:4"},
            {"id": "soph.ot.5", "content": "ὁμοῦ δὲ παιάνων τε καὶ στεναγμάτων:", "section": "Line 5", "urn": "urn:cts:greekLit:tlg0011.tlg004:5"},
        ]
    },

    # Euripides' Medea
    ("Euripides", "Medea"): {
        "total": 1419,
        "language": "greek",
        "passages": [
            {"id": "eur.med.1", "content": "Εἴθ᾽ ὤφελ᾽ Ἀργοῦς μὴ διαπτάσθαι σκάφος", "section": "Line 1", "urn": "urn:cts:greekLit:tlg0006.tlg003:1"},
            {"id": "eur.med.2", "content": "Κόλχων ἐς αἶαν κυανέας Συμπληγάδας,", "section": "Line 2", "urn": "urn:cts:greekLit:tlg0006.tlg003:2"},
            {"id": "eur.med.3", "content": "μηδ᾽ ἐν νάπαισι Πηλίου πεσεῖν ποτε", "section": "Line 3", "urn": "urn:cts:greekLit:tlg0006.tlg003:3"},
            {"id": "eur.med.4", "content": "τμηθεῖσα πεύκη, μηδ᾽ ἐρετμῶσαι χέρας", "section": "Line 4", "urn": "urn:cts:greekLit:tlg0006.tlg003:4"},
            {"id": "eur.med.5", "content": "ἀνδρῶν ἀρίστων οἳ τὸ πάγχρυσον δέρος", "section": "Line 5", "urn": "urn:cts:greekLit:tlg0006.tlg003:5"},
        ]
    },

    # Herodotus' Histories
    ("Herodotus", "Histories"): {
        "total": 18923,
        "language": "greek",
        "passages": [
            {"id": "hdt.1.1", "content": "Ἡροδότου Ἁλικαρνησσέος ἱστορίης ἀπόδεξις ἥδε,", "section": "1.1", "urn": "urn:cts:greekLit:tlg0016.tlg001:1.1"},
            {"id": "hdt.1.2", "content": "ὡς μήτε τὰ γενόμενα ἐξ ἀνθρώπων τῷ χρόνῳ ἐξίτηλα γένηται,", "section": "1.1", "urn": "urn:cts:greekLit:tlg0016.tlg001:1.2"},
            {"id": "hdt.1.3", "content": "μήτε ἔργα μεγάλα τε καὶ θωμαστά, τὰ μὲν Ἕλλησι τὰ δὲ βαρβάροισι ἀποδεχθέντα,", "section": "1.1", "urn": "urn:cts:greekLit:tlg0016.tlg001:1.3"},
            {"id": "hdt.1.4", "content": "ἀκλεᾶ γένηται, τά τε ἄλλα καὶ δι᾽ ἣν αἰτίην ἐπολέμησαν ἀλλήλοισι.", "section": "1.1", "urn": "urn:cts:greekLit:tlg0016.tlg001:1.4"},
        ]
    },

    # Thucydides' History
    ("Thucydides", "History of the Peloponnesian War"): {
        "total": 15678,
        "language": "greek",
        "passages": [
            {"id": "thuc.1.1", "content": "Θουκυδίδης Ἀθηναῖος ξυνέγραψε τὸν πόλεμον τῶν Πελοποννησίων καὶ Ἀθηναίων,", "section": "1.1.1", "urn": "urn:cts:greekLit:tlg0003.tlg001:1.1.1"},
            {"id": "thuc.1.2", "content": "ὡς ἐπολέμησαν πρὸς ἀλλήλους, ἀρξάμενος εὐθὺς καθισταμένου", "section": "1.1.1", "urn": "urn:cts:greekLit:tlg0003.tlg001:1.1.2"},
            {"id": "thuc.1.3", "content": "καὶ ἐλπίσας μέγαν τε ἔσεσθαι καὶ ἀξιολογώτατον τῶν προγεγενημένων,", "section": "1.1.1", "urn": "urn:cts:greekLit:tlg0003.tlg001:1.1.3"},
        ]
    },
}


class PassageInfo(BaseModel):
    id: str
    content: str
    section: Optional[str] = None
    urn: Optional[str] = None


class PassagesResponse(BaseModel):
    author: str
    work: str
    total: int
    passages: List[PassageInfo]


@router.get("/{author}/{work}")
async def get_passages(
    author: str,
    work: str,
    limit: int = 50,
    offset: int = 0,
    language: Optional[str] = None
) -> PassagesResponse:
    """
    Get passages for a specific author and work.
    Supports pagination with limit and offset parameters.
    """
    # Look up the passages
    key = (author, work)
    data = PASSAGES_DATABASE.get(key)

    if not data:
        # Try case-insensitive and partial matching
        for (a, w), d in PASSAGES_DATABASE.items():
            if a.lower() == author.lower() and w.lower() == work.lower():
                data = d
                author = a
                work = w
                break

    if not data:
        # Return empty result instead of 404 for better UX
        return PassagesResponse(
            author=author,
            work=work,
            total=0,
            passages=[]
        )

    # Get paginated passages
    all_passages = data["passages"]
    total = data["total"]

    # Apply pagination
    paginated = all_passages[offset:offset + limit]

    return PassagesResponse(
        author=author,
        work=work,
        total=total,
        passages=[PassageInfo(**p) for p in paginated]
    )
