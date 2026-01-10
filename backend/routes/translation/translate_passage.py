"""
LOGOS Translation Engine - Passage Translation API
Fast, accurate Greek/Latin translation with morphological analysis and translation memory.

POST /api/translation/translate_passage
- Input: { text: string, source_language?: string, style?: string, include_parsing?: bool }
- Output: { translation, tokens[], morphology[], provenance, latencyMs }
- p95 latency target: ≤200ms for cache hit, ≤500ms for full analysis
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import asyncpg
import os
import time
import re
import unicodedata
import logging

logger = logging.getLogger(__name__)

router = APIRouter()

DATABASE_URL = os.getenv('DATABASE_URL',
    'postgresql://postgres:voqQePIH4adopQUa-1UUaFKnOT-mtsod@maglev.proxy.rlwy.net:49514/railway')

_pool = None

VALID_STYLES = ['scholarly', 'literary', 'accessible', 'literal']

# Greek and Latin character patterns for language detection
GREEK_PATTERN = re.compile(r'[\u0370-\u03FF\u1F00-\u1FFF]')
LATIN_PATTERN = re.compile(r'[a-zA-ZāēīōūȳĀĒĪŌŪȲàèìòùÀÈÌÒÙ]')

# ============================================================================
# COMPREHENSIVE GREEK/LATIN LEXICON (EMBEDDED FALLBACK)
# These are used when database lookup fails
# ============================================================================

GREEK_LEXICON = {
    # ============================================================================
    # VERB: εἰμί (to be) - ALL FORMS
    # ============================================================================
    "εἰμί": {"translation": "I am", "pos": "verb", "domain": "general"},
    "εἶ": {"translation": "you are", "pos": "verb", "domain": "general"},
    "ἐστί": {"translation": "is", "pos": "verb", "domain": "general"},
    "ἐστι": {"translation": "is", "pos": "verb", "domain": "general"},
    "ἐστιν": {"translation": "is", "pos": "verb", "domain": "general"},
    "ἐσμέν": {"translation": "we are", "pos": "verb", "domain": "general"},
    "ἐστέ": {"translation": "you (pl.) are", "pos": "verb", "domain": "general"},
    "εἰσί": {"translation": "they are", "pos": "verb", "domain": "general"},
    "εἰσίν": {"translation": "they are", "pos": "verb", "domain": "general"},
    # Imperfect
    "ἦν": {"translation": "was", "pos": "verb", "domain": "general"},
    "ἦσθα": {"translation": "you were", "pos": "verb", "domain": "general"},
    "ἦμεν": {"translation": "we were", "pos": "verb", "domain": "general"},
    "ἦτε": {"translation": "you (pl.) were", "pos": "verb", "domain": "general"},
    "ἦσαν": {"translation": "they were", "pos": "verb", "domain": "general"},
    # Future
    "ἔσομαι": {"translation": "I will be", "pos": "verb", "domain": "general"},
    "ἔσῃ": {"translation": "you will be", "pos": "verb", "domain": "general"},
    "ἔσται": {"translation": "will be", "pos": "verb", "domain": "general"},
    "ἐσόμεθα": {"translation": "we will be", "pos": "verb", "domain": "general"},
    "ἔσεσθε": {"translation": "you (pl.) will be", "pos": "verb", "domain": "general"},
    "ἔσονται": {"translation": "they will be", "pos": "verb", "domain": "general"},
    # Infinitive/Participle
    "εἶναι": {"translation": "to be", "pos": "verb", "domain": "general"},
    "ὤν": {"translation": "being (masc.)", "pos": "participle", "domain": "general"},
    "οὖσα": {"translation": "being (fem.)", "pos": "participle", "domain": "general"},
    "ὄν": {"translation": "being (neut.)", "pos": "participle", "domain": "general"},
    "ὄντος": {"translation": "of being", "pos": "participle", "domain": "general"},
    "ὄντα": {"translation": "being/beings", "pos": "participle", "domain": "general"},

    # ============================================================================
    # ESSENTIAL NOUNS WITH INFLECTED FORMS
    # ============================================================================
    # ἀρχή (beginning, rule, principle)
    "ἀρχή": {"translation": "beginning/rule/principle", "pos": "noun", "domain": "philosophical"},
    "ἀρχῆς": {"translation": "of the beginning", "pos": "noun", "domain": "philosophical"},
    "ἀρχῇ": {"translation": "in the beginning", "pos": "noun", "domain": "philosophical"},
    "ἀρχήν": {"translation": "beginning (acc.)", "pos": "noun", "domain": "philosophical"},
    "ἀρχαί": {"translation": "beginnings/principles", "pos": "noun", "domain": "philosophical"},
    "ἀρχῶν": {"translation": "of beginnings", "pos": "noun", "domain": "philosophical"},

    # λόγος (word, reason, account)
    "λόγος": {"translation": "word/reason/account", "pos": "noun", "domain": "philosophical"},
    "λόγου": {"translation": "of the word/reason", "pos": "noun", "domain": "philosophical"},
    "λόγῳ": {"translation": "by word/reason", "pos": "noun", "domain": "philosophical"},
    "λόγον": {"translation": "word/reason (acc.)", "pos": "noun", "domain": "philosophical"},
    "λόγοι": {"translation": "words/reasons", "pos": "noun", "domain": "philosophical"},
    "λόγων": {"translation": "of words/reasons", "pos": "noun", "domain": "philosophical"},
    "λόγους": {"translation": "words/reasons (acc.)", "pos": "noun", "domain": "philosophical"},

    # θεός (god)
    "θεός": {"translation": "god", "pos": "noun", "domain": "religious"},
    "θεοῦ": {"translation": "of god", "pos": "noun", "domain": "religious"},
    "θεῷ": {"translation": "to god", "pos": "noun", "domain": "religious"},
    "θεόν": {"translation": "god (acc.)", "pos": "noun", "domain": "religious"},
    "θεοί": {"translation": "gods", "pos": "noun", "domain": "religious"},
    "θεῶν": {"translation": "of gods", "pos": "noun", "domain": "religious"},
    "θεούς": {"translation": "gods (acc.)", "pos": "noun", "domain": "religious"},

    # ἄνθρωπος (human being)
    "ἄνθρωπος": {"translation": "human being/person", "pos": "noun", "domain": "general"},
    "ἀνθρώπου": {"translation": "of a person", "pos": "noun", "domain": "general"},
    "ἀνθρώπῳ": {"translation": "to a person", "pos": "noun", "domain": "general"},
    "ἄνθρωπον": {"translation": "person (acc.)", "pos": "noun", "domain": "general"},
    "ἄνθρωποι": {"translation": "people/humans", "pos": "noun", "domain": "general"},
    "ἀνθρώπων": {"translation": "of people", "pos": "noun", "domain": "general"},
    "ἀνθρώποις": {"translation": "to people", "pos": "noun", "domain": "general"},
    "ἀνθρώπους": {"translation": "people (acc.)", "pos": "noun", "domain": "general"},

    # ψυχή (soul)
    "ψυχή": {"translation": "soul/life", "pos": "noun", "domain": "philosophical"},
    "ψυχῆς": {"translation": "of the soul", "pos": "noun", "domain": "philosophical"},
    "ψυχῇ": {"translation": "to the soul", "pos": "noun", "domain": "philosophical"},
    "ψυχήν": {"translation": "soul (acc.)", "pos": "noun", "domain": "philosophical"},
    "ψυχαί": {"translation": "souls", "pos": "noun", "domain": "philosophical"},
    "ψυχῶν": {"translation": "of souls", "pos": "noun", "domain": "philosophical"},
    "ψυχάς": {"translation": "souls (acc.)", "pos": "noun", "domain": "philosophical"},

    # σῶμα (body)
    "σῶμα": {"translation": "body", "pos": "noun", "domain": "general"},
    "σώματος": {"translation": "of the body", "pos": "noun", "domain": "general"},
    "σώματι": {"translation": "to the body", "pos": "noun", "domain": "general"},
    "σώματα": {"translation": "bodies", "pos": "noun", "domain": "general"},
    "σωμάτων": {"translation": "of bodies", "pos": "noun", "domain": "general"},

    # κόσμος (world, order)
    "κόσμος": {"translation": "world/order/cosmos", "pos": "noun", "domain": "philosophical"},
    "κόσμου": {"translation": "of the world", "pos": "noun", "domain": "philosophical"},
    "κόσμῳ": {"translation": "in the world", "pos": "noun", "domain": "philosophical"},
    "κόσμον": {"translation": "world (acc.)", "pos": "noun", "domain": "philosophical"},

    # φύσις (nature)
    "φύσις": {"translation": "nature", "pos": "noun", "domain": "philosophical"},
    "φύσεως": {"translation": "of nature", "pos": "noun", "domain": "philosophical"},
    "φύσει": {"translation": "by nature", "pos": "noun", "domain": "philosophical"},
    "φύσιν": {"translation": "nature (acc.)", "pos": "noun", "domain": "philosophical"},

    # νοῦς (mind)
    "νοῦς": {"translation": "mind/intellect", "pos": "noun", "domain": "philosophical"},
    "νοῦ": {"translation": "of the mind", "pos": "noun", "domain": "philosophical"},
    "νῷ": {"translation": "by mind", "pos": "noun", "domain": "philosophical"},
    "νοῦν": {"translation": "mind (acc.)", "pos": "noun", "domain": "philosophical"},

    # ἀλήθεια (truth)
    "ἀλήθεια": {"translation": "truth", "pos": "noun", "domain": "philosophical"},
    "ἀληθείας": {"translation": "of truth", "pos": "noun", "domain": "philosophical"},
    "ἀληθείᾳ": {"translation": "in truth", "pos": "noun", "domain": "philosophical"},
    "ἀλήθειαν": {"translation": "truth (acc.)", "pos": "noun", "domain": "philosophical"},

    # ζωή (life)
    "ζωή": {"translation": "life", "pos": "noun", "domain": "biological"},
    "ζωῆς": {"translation": "of life", "pos": "noun", "domain": "biological"},
    "ζωῇ": {"translation": "in life", "pos": "noun", "domain": "biological"},
    "ζωήν": {"translation": "life (acc.)", "pos": "noun", "domain": "biological"},

    # φῶς (light)
    "φῶς": {"translation": "light", "pos": "noun", "domain": "physical"},
    "φωτός": {"translation": "of light", "pos": "noun", "domain": "physical"},
    "φωτί": {"translation": "by light", "pos": "noun", "domain": "physical"},

    # σκοτία/σκότος (darkness)
    "σκοτία": {"translation": "darkness", "pos": "noun", "domain": "physical"},
    "σκοτίας": {"translation": "of darkness", "pos": "noun", "domain": "physical"},
    "σκότος": {"translation": "darkness", "pos": "noun", "domain": "physical"},
    "σκότους": {"translation": "of darkness", "pos": "noun", "domain": "physical"},

    # More essential nouns
    "ἀρετή": {"translation": "virtue/excellence", "pos": "noun", "domain": "ethical"},
    "ἀρετῆς": {"translation": "of virtue", "pos": "noun", "domain": "ethical"},
    "σοφία": {"translation": "wisdom", "pos": "noun", "domain": "philosophical"},
    "σοφίας": {"translation": "of wisdom", "pos": "noun", "domain": "philosophical"},
    "φρόνησις": {"translation": "practical wisdom", "pos": "noun", "domain": "ethical"},
    "δίκη": {"translation": "justice", "pos": "noun", "domain": "ethical"},
    "πόλις": {"translation": "city/city-state", "pos": "noun", "domain": "political"},
    "πόλεως": {"translation": "of the city", "pos": "noun", "domain": "political"},
    "πόλει": {"translation": "in the city", "pos": "noun", "domain": "political"},
    "πόλιν": {"translation": "city (acc.)", "pos": "noun", "domain": "political"},
    "βασιλεύς": {"translation": "king", "pos": "noun", "domain": "political"},
    "βασιλέως": {"translation": "of the king", "pos": "noun", "domain": "political"},
    "ἡμέρα": {"translation": "day", "pos": "noun", "domain": "temporal"},
    "ἡμέρας": {"translation": "of day", "pos": "noun", "domain": "temporal"},
    "ἡμέρᾳ": {"translation": "on a day", "pos": "noun", "domain": "temporal"},
    "νύξ": {"translation": "night", "pos": "noun", "domain": "temporal"},
    "νυκτός": {"translation": "of night", "pos": "noun", "domain": "temporal"},
    "γῆ": {"translation": "earth/land", "pos": "noun", "domain": "physical"},
    "γῆς": {"translation": "of earth", "pos": "noun", "domain": "physical"},
    "οὐρανός": {"translation": "heaven/sky", "pos": "noun", "domain": "cosmological"},
    "οὐρανοῦ": {"translation": "of heaven", "pos": "noun", "domain": "cosmological"},
    "ὕδωρ": {"translation": "water", "pos": "noun", "domain": "physical"},
    "ὕδατος": {"translation": "of water", "pos": "noun", "domain": "physical"},
    "πῦρ": {"translation": "fire", "pos": "noun", "domain": "physical"},
    "πυρός": {"translation": "of fire", "pos": "noun", "domain": "physical"},
    "ἀήρ": {"translation": "air", "pos": "noun", "domain": "physical"},
    "θάνατος": {"translation": "death", "pos": "noun", "domain": "biological"},
    "θανάτου": {"translation": "of death", "pos": "noun", "domain": "biological"},
    "ἔργον": {"translation": "work/deed", "pos": "noun", "domain": "general"},
    "ἔργου": {"translation": "of work", "pos": "noun", "domain": "general"},
    "ἔργα": {"translation": "works/deeds", "pos": "noun", "domain": "general"},
    "ἔργων": {"translation": "of works", "pos": "noun", "domain": "general"},
    "ὄνομα": {"translation": "name", "pos": "noun", "domain": "general"},
    "ὀνόματος": {"translation": "of a name", "pos": "noun", "domain": "general"},
    "χρόνος": {"translation": "time", "pos": "noun", "domain": "temporal"},
    "χρόνου": {"translation": "of time", "pos": "noun", "domain": "temporal"},
    "τόπος": {"translation": "place", "pos": "noun", "domain": "spatial"},
    "ὁδός": {"translation": "way/road/path", "pos": "noun", "domain": "spatial"},
    "ὁδοῦ": {"translation": "of the way", "pos": "noun", "domain": "spatial"},
    "οἶκος": {"translation": "house/household", "pos": "noun", "domain": "domestic"},
    "οἴκου": {"translation": "of the house", "pos": "noun", "domain": "domestic"},
    "πατήρ": {"translation": "father", "pos": "noun", "domain": "familial"},
    "πατρός": {"translation": "of the father", "pos": "noun", "domain": "familial"},
    "πατέρα": {"translation": "father (acc.)", "pos": "noun", "domain": "familial"},
    "μήτηρ": {"translation": "mother", "pos": "noun", "domain": "familial"},
    "μητρός": {"translation": "of the mother", "pos": "noun", "domain": "familial"},
    "υἱός": {"translation": "son", "pos": "noun", "domain": "familial"},
    "υἱοῦ": {"translation": "of the son", "pos": "noun", "domain": "familial"},
    "υἱόν": {"translation": "son (acc.)", "pos": "noun", "domain": "familial"},
    "ἀδελφός": {"translation": "brother", "pos": "noun", "domain": "familial"},
    "ἀδελφοῦ": {"translation": "of the brother", "pos": "noun", "domain": "familial"},
    "εἶδος": {"translation": "form/idea", "pos": "noun", "domain": "metaphysical"},
    "εἴδους": {"translation": "of form", "pos": "noun", "domain": "metaphysical"},
    "ἰδέα": {"translation": "form/idea", "pos": "noun", "domain": "metaphysical"},
    "οὐσία": {"translation": "being/essence/substance", "pos": "noun", "domain": "metaphysical"},
    "οὐσίας": {"translation": "of being/essence", "pos": "noun", "domain": "metaphysical"},
    "δύναμις": {"translation": "power/potentiality", "pos": "noun", "domain": "metaphysical"},
    "δυνάμεως": {"translation": "of power", "pos": "noun", "domain": "metaphysical"},
    "ἐνέργεια": {"translation": "actuality/activity", "pos": "noun", "domain": "metaphysical"},
    "ἐνεργείας": {"translation": "of actuality", "pos": "noun", "domain": "metaphysical"},
    "κακόν": {"translation": "evil/bad thing", "pos": "noun", "domain": "ethical"},
    "κακοῦ": {"translation": "of evil", "pos": "noun", "domain": "ethical"},
    "ἀγαθόν": {"translation": "good/good thing", "pos": "noun", "domain": "ethical"},
    "ἀγαθοῦ": {"translation": "of the good", "pos": "noun", "domain": "ethical"},
    "καλόν": {"translation": "beautiful/noble", "pos": "noun", "domain": "aesthetic"},

    # χάρις (grace)
    "χάρις": {"translation": "grace/favor", "pos": "noun", "domain": "religious"},
    "χάριτος": {"translation": "of grace", "pos": "noun", "domain": "religious"},
    "χάριν": {"translation": "grace (acc.)", "pos": "noun", "domain": "religious"},

    # πνεῦμα (spirit)
    "πνεῦμα": {"translation": "spirit/breath/wind", "pos": "noun", "domain": "religious"},
    "πνεύματος": {"translation": "of spirit", "pos": "noun", "domain": "religious"},
    "πνεύματι": {"translation": "in spirit", "pos": "noun", "domain": "religious"},

    # σάρξ (flesh)
    "σάρξ": {"translation": "flesh", "pos": "noun", "domain": "biological"},
    "σαρκός": {"translation": "of flesh", "pos": "noun", "domain": "biological"},
    "σαρκί": {"translation": "in flesh", "pos": "noun", "domain": "biological"},

    # δόξα (glory)
    "δόξα": {"translation": "glory/opinion", "pos": "noun", "domain": "religious"},
    "δόξης": {"translation": "of glory", "pos": "noun", "domain": "religious"},
    "δόξαν": {"translation": "glory (acc.)", "pos": "noun", "domain": "religious"},

    # ============================================================================
    # COMMON VERBS WITH INFLECTED FORMS
    # ============================================================================
    # γίγνομαι/γίνομαι (to become)
    "γίγνομαι": {"translation": "I become", "pos": "verb", "domain": "general"},
    "γίνομαι": {"translation": "I become", "pos": "verb", "domain": "general"},
    "γίνεται": {"translation": "becomes/happens", "pos": "verb", "domain": "general"},
    "γίγνεται": {"translation": "becomes/happens", "pos": "verb", "domain": "general"},
    "ἐγένετο": {"translation": "became/happened", "pos": "verb", "domain": "general"},
    "γέγονε": {"translation": "has become", "pos": "verb", "domain": "general"},
    "γέγονεν": {"translation": "has become", "pos": "verb", "domain": "general"},
    "γενέσθαι": {"translation": "to become", "pos": "verb", "domain": "general"},
    "γενηθήτω": {"translation": "let there be/let it become", "pos": "verb", "domain": "general"},
    "γένηται": {"translation": "may become", "pos": "verb", "domain": "general"},
    "γένωνται": {"translation": "may become (pl.)", "pos": "verb", "domain": "general"},

    # λέγω (to say)
    "λέγω": {"translation": "I say/speak", "pos": "verb", "domain": "general"},
    "λέγεις": {"translation": "you say", "pos": "verb", "domain": "general"},
    "λέγει": {"translation": "says/speaks", "pos": "verb", "domain": "general"},
    "λέγομεν": {"translation": "we say", "pos": "verb", "domain": "general"},
    "λέγουσι": {"translation": "they say", "pos": "verb", "domain": "general"},
    "λέγουσιν": {"translation": "they say", "pos": "verb", "domain": "general"},
    "ἔλεγε": {"translation": "was saying", "pos": "verb", "domain": "general"},
    "ἔλεγεν": {"translation": "was saying", "pos": "verb", "domain": "general"},
    "εἶπε": {"translation": "said", "pos": "verb", "domain": "general"},
    "εἶπεν": {"translation": "said", "pos": "verb", "domain": "general"},
    "λέγειν": {"translation": "to say", "pos": "verb", "domain": "general"},

    # ἔχω (to have)
    "ἔχω": {"translation": "I have/hold", "pos": "verb", "domain": "general"},
    "ἔχεις": {"translation": "you have", "pos": "verb", "domain": "general"},
    "ἔχει": {"translation": "has/holds", "pos": "verb", "domain": "general"},
    "ἔχομεν": {"translation": "we have", "pos": "verb", "domain": "general"},
    "ἔχουσι": {"translation": "they have", "pos": "verb", "domain": "general"},
    "ἔχουσιν": {"translation": "they have", "pos": "verb", "domain": "general"},
    "εἶχε": {"translation": "had", "pos": "verb", "domain": "general"},
    "εἶχεν": {"translation": "had", "pos": "verb", "domain": "general"},
    "ἔχειν": {"translation": "to have", "pos": "verb", "domain": "general"},

    # ποιέω (to make/do)
    "ποιέω": {"translation": "I make/do", "pos": "verb", "domain": "general"},
    "ποιεῖ": {"translation": "makes/does", "pos": "verb", "domain": "general"},
    "ποιεῖν": {"translation": "to make/do", "pos": "verb", "domain": "general"},
    "ἐποίησε": {"translation": "made/did", "pos": "verb", "domain": "general"},
    "ἐποίησεν": {"translation": "made/did", "pos": "verb", "domain": "general"},

    # οἶδα (to know - perfect form)
    "οἶδα": {"translation": "I know", "pos": "verb", "domain": "epistemological"},
    "οἶδας": {"translation": "you know", "pos": "verb", "domain": "epistemological"},
    "οἶδε": {"translation": "knows", "pos": "verb", "domain": "epistemological"},
    "οἶδεν": {"translation": "knows", "pos": "verb", "domain": "epistemological"},
    "ἴσμεν": {"translation": "we know", "pos": "verb", "domain": "epistemological"},
    "ἴσασι": {"translation": "they know", "pos": "verb", "domain": "epistemological"},
    "εἰδέναι": {"translation": "to know", "pos": "verb", "domain": "epistemological"},

    # γιγνώσκω (to know/perceive)
    "γιγνώσκω": {"translation": "I know/perceive", "pos": "verb", "domain": "epistemological"},
    "γινώσκω": {"translation": "I know/perceive", "pos": "verb", "domain": "epistemological"},
    "γινώσκει": {"translation": "knows/perceives", "pos": "verb", "domain": "epistemological"},
    "ἔγνω": {"translation": "knew/recognized", "pos": "verb", "domain": "epistemological"},

    # ὁράω (to see)
    "ὁράω": {"translation": "I see", "pos": "verb", "domain": "sensory"},
    "ὁρᾷ": {"translation": "sees", "pos": "verb", "domain": "sensory"},
    "ὁρᾶν": {"translation": "to see", "pos": "verb", "domain": "sensory"},
    "εἶδε": {"translation": "saw", "pos": "verb", "domain": "sensory"},
    "εἶδεν": {"translation": "saw", "pos": "verb", "domain": "sensory"},
    "ἑώρακε": {"translation": "has seen", "pos": "verb", "domain": "sensory"},
    "ἑώρακεν": {"translation": "has seen", "pos": "verb", "domain": "sensory"},

    # ἀκούω (to hear)
    "ἀκούω": {"translation": "I hear", "pos": "verb", "domain": "sensory"},
    "ἀκούει": {"translation": "hears", "pos": "verb", "domain": "sensory"},
    "ἤκουσε": {"translation": "heard", "pos": "verb", "domain": "sensory"},
    "ἤκουσεν": {"translation": "heard", "pos": "verb", "domain": "sensory"},

    # πιστεύω (to believe)
    "πιστεύω": {"translation": "I believe", "pos": "verb", "domain": "religious"},
    "πιστεύει": {"translation": "believes", "pos": "verb", "domain": "religious"},
    "πιστεύειν": {"translation": "to believe", "pos": "verb", "domain": "religious"},
    "ἐπίστευσε": {"translation": "believed", "pos": "verb", "domain": "religious"},
    "ἐπίστευσεν": {"translation": "believed", "pos": "verb", "domain": "religious"},

    # λαμβάνω (to take/receive)
    "λαμβάνω": {"translation": "I take/receive", "pos": "verb", "domain": "general"},
    "λαμβάνει": {"translation": "takes/receives", "pos": "verb", "domain": "general"},
    "ἔλαβε": {"translation": "took/received", "pos": "verb", "domain": "general"},
    "ἔλαβεν": {"translation": "took/received", "pos": "verb", "domain": "general"},
    "λαβεῖν": {"translation": "to take/receive", "pos": "verb", "domain": "general"},

    # δίδωμι (to give)
    "δίδωμι": {"translation": "I give", "pos": "verb", "domain": "general"},
    "δίδωσι": {"translation": "gives", "pos": "verb", "domain": "general"},
    "δίδωσιν": {"translation": "gives", "pos": "verb", "domain": "general"},
    "ἔδωκε": {"translation": "gave", "pos": "verb", "domain": "general"},
    "ἔδωκεν": {"translation": "gave", "pos": "verb", "domain": "general"},
    "δοῦναι": {"translation": "to give", "pos": "verb", "domain": "general"},

    # ἔρχομαι (to come/go)
    "ἔρχομαι": {"translation": "I come/go", "pos": "verb", "domain": "motion"},
    "ἔρχεται": {"translation": "comes/goes", "pos": "verb", "domain": "motion"},
    "ἦλθε": {"translation": "came", "pos": "verb", "domain": "motion"},
    "ἦλθεν": {"translation": "came", "pos": "verb", "domain": "motion"},
    "ἐλθεῖν": {"translation": "to come", "pos": "verb", "domain": "motion"},

    # θέλω/ἐθέλω (to want/wish)
    "θέλω": {"translation": "I want/wish", "pos": "verb", "domain": "psychological"},
    "ἐθέλω": {"translation": "I want/wish", "pos": "verb", "domain": "psychological"},
    "θέλει": {"translation": "wants/wishes", "pos": "verb", "domain": "psychological"},
    "ἤθελε": {"translation": "wanted", "pos": "verb", "domain": "psychological"},
    "ἤθελεν": {"translation": "wanted", "pos": "verb", "domain": "psychological"},

    # φημί (to say/assert)
    "φημί": {"translation": "I say/assert", "pos": "verb", "domain": "general"},
    "φησί": {"translation": "says/asserts", "pos": "verb", "domain": "general"},
    "φησίν": {"translation": "says/asserts", "pos": "verb", "domain": "general"},
    "ἔφη": {"translation": "said", "pos": "verb", "domain": "general"},

    # βούλομαι (to wish)
    "βούλομαι": {"translation": "I wish/want", "pos": "verb", "domain": "psychological"},
    "βούλεται": {"translation": "wishes/wants", "pos": "verb", "domain": "psychological"},

    # δοκέω (to seem/think)
    "δοκέω": {"translation": "I seem/think", "pos": "verb", "domain": "epistemological"},
    "δοκεῖ": {"translation": "seems/thinks", "pos": "verb", "domain": "epistemological"},
    "ἔδοξε": {"translation": "seemed", "pos": "verb", "domain": "epistemological"},
    "ἔδοξεν": {"translation": "seemed", "pos": "verb", "domain": "epistemological"},

    # καταλαμβάνω (to comprehend/seize)
    "καταλαμβάνω": {"translation": "I comprehend/seize", "pos": "verb", "domain": "epistemological"},
    "κατέλαβε": {"translation": "comprehended/seized", "pos": "verb", "domain": "epistemological"},
    "κατέλαβεν": {"translation": "comprehended/seized", "pos": "verb", "domain": "epistemological"},

    # φαίνω (to show/appear)
    "φαίνω": {"translation": "I show/appear", "pos": "verb", "domain": "general"},
    "φαίνει": {"translation": "shows/appears", "pos": "verb", "domain": "general"},
    "φαίνεται": {"translation": "appears/seems", "pos": "verb", "domain": "general"},

    # μαρτυρέω (to witness/testify)
    "μαρτυρέω": {"translation": "I witness/testify", "pos": "verb", "domain": "legal"},
    "μαρτυρεῖ": {"translation": "witnesses/testifies", "pos": "verb", "domain": "legal"},
    "ἐμαρτύρησε": {"translation": "witnessed/testified", "pos": "verb", "domain": "legal"},
    "ἐμαρτύρησεν": {"translation": "witnessed/testified", "pos": "verb", "domain": "legal"},

    # ============================================================================
    # ADJECTIVES/ADVERBS
    # ============================================================================
    "ἀγαθός": {"translation": "good", "pos": "adjective", "domain": "ethical"},
    "ἀγαθή": {"translation": "good (fem.)", "pos": "adjective", "domain": "ethical"},
    "ἀγαθόν": {"translation": "good (neut.)", "pos": "adjective", "domain": "ethical"},
    "κακός": {"translation": "bad/evil", "pos": "adjective", "domain": "ethical"},
    "κακή": {"translation": "bad/evil (fem.)", "pos": "adjective", "domain": "ethical"},
    "κακόν": {"translation": "bad/evil (neut.)", "pos": "adjective", "domain": "ethical"},
    "καλός": {"translation": "beautiful/noble", "pos": "adjective", "domain": "aesthetic"},
    "καλή": {"translation": "beautiful/noble (fem.)", "pos": "adjective", "domain": "aesthetic"},
    "καλόν": {"translation": "beautiful/noble (neut.)", "pos": "adjective", "domain": "aesthetic"},
    "μέγας": {"translation": "great/large", "pos": "adjective", "domain": "general"},
    "μεγάλη": {"translation": "great/large (fem.)", "pos": "adjective", "domain": "general"},
    "μέγα": {"translation": "great/large (neut.)", "pos": "adjective", "domain": "general"},
    "πολύς": {"translation": "much/many", "pos": "adjective", "domain": "general"},
    "πολλή": {"translation": "much (fem.)", "pos": "adjective", "domain": "general"},
    "πολύ": {"translation": "much (neut.)", "pos": "adjective", "domain": "general"},
    "πολλά": {"translation": "many things", "pos": "adjective", "domain": "general"},
    "πολλοί": {"translation": "many (masc. pl.)", "pos": "adjective", "domain": "general"},
    "πᾶς": {"translation": "all/every", "pos": "adjective", "domain": "general"},
    "πᾶσα": {"translation": "all/every (fem.)", "pos": "adjective", "domain": "general"},
    "πᾶν": {"translation": "all/every (neut.)", "pos": "adjective", "domain": "general"},
    "πάντα": {"translation": "all things", "pos": "adjective", "domain": "general"},
    "πάντες": {"translation": "all/everyone", "pos": "adjective", "domain": "general"},
    "πάντων": {"translation": "of all", "pos": "adjective", "domain": "general"},
    "ἄλλος": {"translation": "other/another", "pos": "adjective", "domain": "general"},
    "ἄλλη": {"translation": "other (fem.)", "pos": "adjective", "domain": "general"},
    "ἄλλο": {"translation": "other (neut.)", "pos": "adjective", "domain": "general"},
    "ἕκαστος": {"translation": "each/every", "pos": "adjective", "domain": "general"},
    "ἴδιος": {"translation": "one's own/private", "pos": "adjective", "domain": "general"},
    "ἴδια": {"translation": "one's own things", "pos": "adjective", "domain": "general"},
    "ἀληθής": {"translation": "true", "pos": "adjective", "domain": "epistemological"},
    "ἀληθές": {"translation": "true (neut.)", "pos": "adjective", "domain": "epistemological"},
    "πρῶτος": {"translation": "first", "pos": "adjective", "domain": "ordinal"},
    "πρῶτον": {"translation": "first/firstly", "pos": "adverb", "domain": "ordinal"},
    "δεύτερος": {"translation": "second", "pos": "adjective", "domain": "ordinal"},
    "τρίτος": {"translation": "third", "pos": "adjective", "domain": "ordinal"},
    "μόνος": {"translation": "alone/only", "pos": "adjective", "domain": "general"},
    "μόνον": {"translation": "only", "pos": "adverb", "domain": "general"},

    # ============================================================================
    # PRONOUNS
    # ============================================================================
    "ἐγώ": {"translation": "I", "pos": "pronoun", "domain": "personal"},
    "ἐμοῦ": {"translation": "of me/my", "pos": "pronoun", "domain": "personal"},
    "μου": {"translation": "of me/my", "pos": "pronoun", "domain": "personal"},
    "ἐμοί": {"translation": "to me", "pos": "pronoun", "domain": "personal"},
    "μοι": {"translation": "to me", "pos": "pronoun", "domain": "personal"},
    "ἐμέ": {"translation": "me", "pos": "pronoun", "domain": "personal"},
    "με": {"translation": "me", "pos": "pronoun", "domain": "personal"},
    "σύ": {"translation": "you", "pos": "pronoun", "domain": "personal"},
    "σοῦ": {"translation": "of you/your", "pos": "pronoun", "domain": "personal"},
    "σου": {"translation": "of you/your", "pos": "pronoun", "domain": "personal"},
    "σοί": {"translation": "to you", "pos": "pronoun", "domain": "personal"},
    "σοι": {"translation": "to you", "pos": "pronoun", "domain": "personal"},
    "σέ": {"translation": "you (acc.)", "pos": "pronoun", "domain": "personal"},
    "σε": {"translation": "you (acc.)", "pos": "pronoun", "domain": "personal"},
    "ἡμεῖς": {"translation": "we", "pos": "pronoun", "domain": "personal"},
    "ἡμῶν": {"translation": "of us/our", "pos": "pronoun", "domain": "personal"},
    "ἡμῖν": {"translation": "to us", "pos": "pronoun", "domain": "personal"},
    "ἡμᾶς": {"translation": "us", "pos": "pronoun", "domain": "personal"},
    "ὑμεῖς": {"translation": "you (pl.)", "pos": "pronoun", "domain": "personal"},
    "ὑμῶν": {"translation": "of you (pl.)/your", "pos": "pronoun", "domain": "personal"},
    "ὑμῖν": {"translation": "to you (pl.)", "pos": "pronoun", "domain": "personal"},
    "ὑμᾶς": {"translation": "you (pl., acc.)", "pos": "pronoun", "domain": "personal"},
    "αὐτός": {"translation": "he/self/same", "pos": "pronoun", "domain": "demonstrative"},
    "αὐτή": {"translation": "she/self/same", "pos": "pronoun", "domain": "demonstrative"},
    "αὐτό": {"translation": "it/self/same", "pos": "pronoun", "domain": "demonstrative"},
    "αὐτοῦ": {"translation": "of him/his/its", "pos": "pronoun", "domain": "demonstrative"},
    "αὐτῆς": {"translation": "of her/hers", "pos": "pronoun", "domain": "demonstrative"},
    "αὐτῷ": {"translation": "to him/it", "pos": "pronoun", "domain": "demonstrative"},
    "αὐτῇ": {"translation": "to her", "pos": "pronoun", "domain": "demonstrative"},
    "αὐτόν": {"translation": "him/it", "pos": "pronoun", "domain": "demonstrative"},
    "αὐτήν": {"translation": "her", "pos": "pronoun", "domain": "demonstrative"},
    "αὐτοί": {"translation": "they (masc.)", "pos": "pronoun", "domain": "demonstrative"},
    "αὐταί": {"translation": "they (fem.)", "pos": "pronoun", "domain": "demonstrative"},
    "αὐτά": {"translation": "they (neut.)", "pos": "pronoun", "domain": "demonstrative"},
    "αὐτῶν": {"translation": "of them/their", "pos": "pronoun", "domain": "demonstrative"},
    "αὐτοῖς": {"translation": "to them", "pos": "pronoun", "domain": "demonstrative"},
    "αὐτούς": {"translation": "them (masc.)", "pos": "pronoun", "domain": "demonstrative"},
    "οὗτος": {"translation": "this", "pos": "pronoun", "domain": "demonstrative"},
    "αὕτη": {"translation": "this (fem.)", "pos": "pronoun", "domain": "demonstrative"},
    "τοῦτο": {"translation": "this (neut.)", "pos": "pronoun", "domain": "demonstrative"},
    "τούτου": {"translation": "of this", "pos": "pronoun", "domain": "demonstrative"},
    "τούτῳ": {"translation": "to this", "pos": "pronoun", "domain": "demonstrative"},
    "τοῦτον": {"translation": "this (acc.)", "pos": "pronoun", "domain": "demonstrative"},
    "ταῦτα": {"translation": "these things", "pos": "pronoun", "domain": "demonstrative"},
    "ἐκεῖνος": {"translation": "that", "pos": "pronoun", "domain": "demonstrative"},
    "ἐκείνη": {"translation": "that (fem.)", "pos": "pronoun", "domain": "demonstrative"},
    "ἐκεῖνο": {"translation": "that (neut.)", "pos": "pronoun", "domain": "demonstrative"},
    "ὅς": {"translation": "who/which", "pos": "pronoun", "domain": "relative"},
    "ἥ": {"translation": "who/which (fem.)", "pos": "pronoun", "domain": "relative"},
    "ὅ": {"translation": "which (neut.)", "pos": "pronoun", "domain": "relative"},
    "οὗ": {"translation": "of whom/which", "pos": "pronoun", "domain": "relative"},
    "ᾧ": {"translation": "to whom/which", "pos": "pronoun", "domain": "relative"},
    "ὅν": {"translation": "whom/which", "pos": "pronoun", "domain": "relative"},
    "ἥν": {"translation": "whom/which (fem.)", "pos": "pronoun", "domain": "relative"},
    "οἵ": {"translation": "who/which (pl.)", "pos": "pronoun", "domain": "relative"},
    "ὧν": {"translation": "of whom/which (pl.)", "pos": "pronoun", "domain": "relative"},
    "οἷς": {"translation": "to whom/which (pl.)", "pos": "pronoun", "domain": "relative"},
    "οὕς": {"translation": "whom/which (pl. acc.)", "pos": "pronoun", "domain": "relative"},
    "ἅ": {"translation": "which things", "pos": "pronoun", "domain": "relative"},
    "τίς": {"translation": "who?/what?", "pos": "pronoun", "domain": "interrogative"},
    "τί": {"translation": "what?", "pos": "pronoun", "domain": "interrogative"},
    "τίνος": {"translation": "of whom?/whose?", "pos": "pronoun", "domain": "interrogative"},
    "τίνι": {"translation": "to whom?", "pos": "pronoun", "domain": "interrogative"},
    "τίνα": {"translation": "whom?/what?", "pos": "pronoun", "domain": "interrogative"},
    "τις": {"translation": "someone/anyone", "pos": "pronoun", "domain": "indefinite"},
    "τι": {"translation": "something/anything", "pos": "pronoun", "domain": "indefinite"},
    "οὐδείς": {"translation": "no one/nothing", "pos": "pronoun", "domain": "negation"},
    "οὐδέν": {"translation": "nothing", "pos": "pronoun", "domain": "negation"},

    # ============================================================================
    # PARTICLES AND CONNECTIVES
    # ============================================================================
    "καί": {"translation": "and/also/even", "pos": "conjunction", "domain": "connective"},
    "δέ": {"translation": "but/and", "pos": "particle", "domain": "connective"},
    "γάρ": {"translation": "for", "pos": "particle", "domain": "connective"},
    "οὖν": {"translation": "therefore/then", "pos": "particle", "domain": "connective"},
    "ἄρα": {"translation": "then/therefore", "pos": "particle", "domain": "connective"},
    "μέν": {"translation": "(on the one hand)", "pos": "particle", "domain": "connective"},
    "τε": {"translation": "and/both", "pos": "particle", "domain": "connective"},
    "ἤ": {"translation": "or", "pos": "conjunction", "domain": "connective"},
    "ἀλλά": {"translation": "but", "pos": "conjunction", "domain": "connective"},
    "ἀλλ'": {"translation": "but", "pos": "conjunction", "domain": "connective"},
    "εἰ": {"translation": "if", "pos": "conjunction", "domain": "conditional"},
    "ὅτι": {"translation": "that/because", "pos": "conjunction", "domain": "connective"},
    "ὡς": {"translation": "as/that/how", "pos": "conjunction", "domain": "connective"},
    "ὥστε": {"translation": "so that/therefore", "pos": "conjunction", "domain": "connective"},
    "ἐάν": {"translation": "if (with subj.)", "pos": "conjunction", "domain": "conditional"},
    "ἄν": {"translation": "(modal particle)", "pos": "particle", "domain": "modal"},
    "ἵνα": {"translation": "in order that/so that", "pos": "conjunction", "domain": "purpose"},
    "ὅπως": {"translation": "how/in order that", "pos": "conjunction", "domain": "purpose"},
    "ὅτε": {"translation": "when", "pos": "conjunction", "domain": "temporal"},
    "ἕως": {"translation": "until/while", "pos": "conjunction", "domain": "temporal"},
    "πρίν": {"translation": "before", "pos": "conjunction", "domain": "temporal"},
    "διότι": {"translation": "because", "pos": "conjunction", "domain": "causal"},
    "οὔτε": {"translation": "and not/neither", "pos": "conjunction", "domain": "negation"},
    "μήτε": {"translation": "and not/neither", "pos": "conjunction", "domain": "negation"},

    # ============================================================================
    # NEGATIONS
    # ============================================================================
    "οὐ": {"translation": "not", "pos": "adverb", "domain": "negation"},
    "οὐκ": {"translation": "not", "pos": "adverb", "domain": "negation"},
    "οὐχ": {"translation": "not", "pos": "adverb", "domain": "negation"},
    "οὐχί": {"translation": "not", "pos": "adverb", "domain": "negation"},
    "μή": {"translation": "not", "pos": "adverb", "domain": "negation"},
    "οὐδέ": {"translation": "and not/not even", "pos": "adverb", "domain": "negation"},
    "μηδέ": {"translation": "and not/not even", "pos": "adverb", "domain": "negation"},

    # ============================================================================
    # QUESTION WORDS AND ADVERBS
    # ============================================================================
    "πῶς": {"translation": "how?", "pos": "adverb", "domain": "interrogative"},
    "ποῦ": {"translation": "where?", "pos": "adverb", "domain": "interrogative"},
    "πόθεν": {"translation": "from where?", "pos": "adverb", "domain": "interrogative"},
    "ποῖ": {"translation": "to where?", "pos": "adverb", "domain": "interrogative"},
    "πότε": {"translation": "when?", "pos": "adverb", "domain": "interrogative"},
    "διὰ τί": {"translation": "why?", "pos": "adverb", "domain": "interrogative"},
    "οὕτω": {"translation": "thus/so", "pos": "adverb", "domain": "manner"},
    "οὕτως": {"translation": "thus/so", "pos": "adverb", "domain": "manner"},
    "ὧδε": {"translation": "here/thus", "pos": "adverb", "domain": "manner"},
    "ἐκεῖ": {"translation": "there", "pos": "adverb", "domain": "spatial"},
    "ἐνταῦθα": {"translation": "here/there", "pos": "adverb", "domain": "spatial"},
    "νῦν": {"translation": "now", "pos": "adverb", "domain": "temporal"},
    "τότε": {"translation": "then", "pos": "adverb", "domain": "temporal"},
    "ἤδη": {"translation": "already/now", "pos": "adverb", "domain": "temporal"},
    "ἔτι": {"translation": "still/yet", "pos": "adverb", "domain": "temporal"},
    "ἀεί": {"translation": "always", "pos": "adverb", "domain": "temporal"},
    "οὔπω": {"translation": "not yet", "pos": "adverb", "domain": "temporal"},
    "πάλιν": {"translation": "again", "pos": "adverb", "domain": "temporal"},
    "μάλιστα": {"translation": "most/especially", "pos": "adverb", "domain": "degree"},
    "μᾶλλον": {"translation": "more/rather", "pos": "adverb", "domain": "degree"},
    "ἧττον": {"translation": "less", "pos": "adverb", "domain": "degree"},
    "εὖ": {"translation": "well", "pos": "adverb", "domain": "manner"},
    "κακῶς": {"translation": "badly", "pos": "adverb", "domain": "manner"},
    "καλῶς": {"translation": "well/nobly", "pos": "adverb", "domain": "manner"},

    # Additional philosophical vocabulary
    "βίος": {"translation": "life/livelihood", "pos": "noun", "domain": "biological"},
    "βίου": {"translation": "of life", "pos": "noun", "domain": "biological"},
    "βίῳ": {"translation": "in life", "pos": "noun", "domain": "biological"},
    "βίον": {"translation": "life (acc.)", "pos": "noun", "domain": "biological"},
    "ἀθάνατος": {"translation": "immortal", "pos": "adjective", "domain": "philosophical"},
    "ἀθάνατον": {"translation": "immortal (acc./neut.)", "pos": "adjective", "domain": "philosophical"},
    "ἀθανάτου": {"translation": "of immortal", "pos": "adjective", "domain": "philosophical"},
    "θνητός": {"translation": "mortal", "pos": "adjective", "domain": "philosophical"},
    "θνητόν": {"translation": "mortal (acc./neut.)", "pos": "adjective", "domain": "philosophical"},
    "ἀνεξέταστος": {"translation": "unexamined", "pos": "adjective", "domain": "philosophical"},
    "βιωτός": {"translation": "worth living", "pos": "adjective", "domain": "philosophical"},
    "βιωτὸς": {"translation": "worth living", "pos": "adjective", "domain": "philosophical"},
    "ἀβίωτος": {"translation": "not worth living", "pos": "adjective", "domain": "philosophical"},

    # οὐρανός (heaven) - 2nd declension
    "οὐρανός": {"translation": "heaven/sky", "pos": "noun", "domain": "cosmological"},
    "οὐρανοῦ": {"translation": "of heaven", "pos": "noun", "domain": "cosmological"},
    "οὐρανῷ": {"translation": "in heaven", "pos": "noun", "domain": "cosmological"},
    "οὐρανόν": {"translation": "heaven (acc.)", "pos": "noun", "domain": "cosmological"},
    "οὐρανὸν": {"translation": "heaven (acc.)", "pos": "noun", "domain": "cosmological"},
    "οὐρανοί": {"translation": "heavens", "pos": "noun", "domain": "cosmological"},
    "οὐρανῶν": {"translation": "of heavens", "pos": "noun", "domain": "cosmological"},

    # γῆ (earth) - 1st declension
    "γῆ": {"translation": "earth/land", "pos": "noun", "domain": "physical"},
    "γῆς": {"translation": "of earth", "pos": "noun", "domain": "physical"},
    "γῇ": {"translation": "on/in earth", "pos": "noun", "domain": "physical"},
    "γῆν": {"translation": "earth (acc.)", "pos": "noun", "domain": "physical"},

    # ἐλευθερόω (to set free) - future/aorist forms
    "ἐλευθερόω": {"translation": "I set free", "pos": "verb", "domain": "political"},
    "ἐλευθεροῖ": {"translation": "sets free", "pos": "verb", "domain": "political"},
    "ἐλευθερώσει": {"translation": "will set free", "pos": "verb", "domain": "political"},
    "ἐλευθερώσω": {"translation": "I will set free", "pos": "verb", "domain": "political"},
    "ἠλευθέρωσεν": {"translation": "set free", "pos": "verb", "domain": "political"},
    "ἐλευθεροῦν": {"translation": "to set free", "pos": "verb", "domain": "political"},

    # ============================================================================
    # ARTICLES (ALL FORMS)
    # ============================================================================
    "ὁ": {"translation": "the", "pos": "article", "domain": "grammatical"},
    "ἡ": {"translation": "the", "pos": "article", "domain": "grammatical"},
    "τό": {"translation": "the", "pos": "article", "domain": "grammatical"},
    "τοῦ": {"translation": "of the", "pos": "article", "domain": "grammatical"},
    "τῆς": {"translation": "of the", "pos": "article", "domain": "grammatical"},
    "τῷ": {"translation": "to the", "pos": "article", "domain": "grammatical"},
    "τῇ": {"translation": "to the", "pos": "article", "domain": "grammatical"},
    "τόν": {"translation": "the (acc. m.)", "pos": "article", "domain": "grammatical"},
    "τήν": {"translation": "the (acc. f.)", "pos": "article", "domain": "grammatical"},
    "τά": {"translation": "the (neut. pl.)", "pos": "article", "domain": "grammatical"},
    "τῶν": {"translation": "of the (gen. pl.)", "pos": "article", "domain": "grammatical"},
    "τοῖς": {"translation": "to the (dat. m./n. pl.)", "pos": "article", "domain": "grammatical"},
    "ταῖς": {"translation": "to the (dat. f. pl.)", "pos": "article", "domain": "grammatical"},
    "τούς": {"translation": "the (acc. m. pl.)", "pos": "article", "domain": "grammatical"},
    "τάς": {"translation": "the (acc. f. pl.)", "pos": "article", "domain": "grammatical"},
    "οἱ": {"translation": "the (nom. m. pl.)", "pos": "article", "domain": "grammatical"},
    "αἱ": {"translation": "the (nom. f. pl.)", "pos": "article", "domain": "grammatical"},

    # ============================================================================
    # PREPOSITIONS
    # ============================================================================
    "ἐν": {"translation": "in", "pos": "preposition", "domain": "spatial"},
    "εἰς": {"translation": "into/to", "pos": "preposition", "domain": "spatial"},
    "ἐκ": {"translation": "out of/from", "pos": "preposition", "domain": "spatial"},
    "ἐξ": {"translation": "out of/from", "pos": "preposition", "domain": "spatial"},
    "ἀπό": {"translation": "from", "pos": "preposition", "domain": "spatial"},
    "ἀπ'": {"translation": "from", "pos": "preposition", "domain": "spatial"},
    "ἀφ'": {"translation": "from", "pos": "preposition", "domain": "spatial"},
    "πρός": {"translation": "to/toward/with", "pos": "preposition", "domain": "spatial"},
    "κατά": {"translation": "down/according to", "pos": "preposition", "domain": "spatial"},
    "κατ'": {"translation": "down/according to", "pos": "preposition", "domain": "spatial"},
    "μετά": {"translation": "with/after", "pos": "preposition", "domain": "spatial"},
    "μετ'": {"translation": "with/after", "pos": "preposition", "domain": "spatial"},
    "μεθ'": {"translation": "with/after", "pos": "preposition", "domain": "spatial"},
    "ὑπό": {"translation": "under/by", "pos": "preposition", "domain": "spatial"},
    "ὑπ'": {"translation": "under/by", "pos": "preposition", "domain": "spatial"},
    "ὑφ'": {"translation": "under/by", "pos": "preposition", "domain": "spatial"},
    "περί": {"translation": "about/concerning", "pos": "preposition", "domain": "topical"},
    "παρά": {"translation": "beside/from/contrary to", "pos": "preposition", "domain": "spatial"},
    "παρ'": {"translation": "beside/from", "pos": "preposition", "domain": "spatial"},
    "ἐπί": {"translation": "on/upon/against", "pos": "preposition", "domain": "spatial"},
    "ἐπ'": {"translation": "on/upon", "pos": "preposition", "domain": "spatial"},
    "ἐφ'": {"translation": "on/upon", "pos": "preposition", "domain": "spatial"},
    "πρό": {"translation": "before", "pos": "preposition", "domain": "temporal"},
    "διά": {"translation": "through/because of", "pos": "preposition", "domain": "causal"},
    "δι'": {"translation": "through/because of", "pos": "preposition", "domain": "causal"},
    "δι᾽": {"translation": "through", "pos": "preposition", "domain": "causal"},
    "χωρίς": {"translation": "without/apart from", "pos": "preposition", "domain": "absence"},
    "χωρὶς": {"translation": "without/apart from", "pos": "preposition", "domain": "absence"},
    "ἀντί": {"translation": "instead of/against", "pos": "preposition", "domain": "opposition"},
    "ἀνά": {"translation": "up/throughout", "pos": "preposition", "domain": "spatial"},
    "σύν": {"translation": "with", "pos": "preposition", "domain": "accompaniment"},
    "ὑπέρ": {"translation": "over/on behalf of", "pos": "preposition", "domain": "spatial"},

    # ============================================================================
    # NUMBERS
    # ============================================================================
    "εἷς": {"translation": "one", "pos": "numeral", "domain": "numerical"},
    "μία": {"translation": "one (fem.)", "pos": "numeral", "domain": "numerical"},
    "ἕν": {"translation": "one (neut.)", "pos": "numeral", "domain": "numerical"},
    "δύο": {"translation": "two", "pos": "numeral", "domain": "numerical"},
    "τρεῖς": {"translation": "three", "pos": "numeral", "domain": "numerical"},
    "τρία": {"translation": "three (neut.)", "pos": "numeral", "domain": "numerical"},
    "τέσσαρες": {"translation": "four", "pos": "numeral", "domain": "numerical"},
    "πέντε": {"translation": "five", "pos": "numeral", "domain": "numerical"},
    "ἕξ": {"translation": "six", "pos": "numeral", "domain": "numerical"},
    "ἑπτά": {"translation": "seven", "pos": "numeral", "domain": "numerical"},
    "ὀκτώ": {"translation": "eight", "pos": "numeral", "domain": "numerical"},
    "ἐννέα": {"translation": "nine", "pos": "numeral", "domain": "numerical"},
    "δέκα": {"translation": "ten", "pos": "numeral", "domain": "numerical"},
    "ἑκατόν": {"translation": "hundred", "pos": "numeral", "domain": "numerical"},
    "χίλιοι": {"translation": "thousand", "pos": "numeral", "domain": "numerical"},
}

LATIN_LEXICON = {
    # ============================================================================
    # VERB: sum/esse (to be) - ALL FORMS
    # ============================================================================
    # Present Indicative
    "sum": {"translation": "I am", "pos": "verb", "domain": "general"},
    "es": {"translation": "you are", "pos": "verb", "domain": "general"},
    "est": {"translation": "is", "pos": "verb", "domain": "general"},
    "sumus": {"translation": "we are", "pos": "verb", "domain": "general"},
    "estis": {"translation": "you (pl.) are", "pos": "verb", "domain": "general"},
    "sunt": {"translation": "they are", "pos": "verb", "domain": "general"},
    # Imperfect Indicative
    "eram": {"translation": "I was", "pos": "verb", "domain": "general"},
    "eras": {"translation": "you were", "pos": "verb", "domain": "general"},
    "erat": {"translation": "was", "pos": "verb", "domain": "general"},
    "eramus": {"translation": "we were", "pos": "verb", "domain": "general"},
    "eratis": {"translation": "you (pl.) were", "pos": "verb", "domain": "general"},
    "erant": {"translation": "they were", "pos": "verb", "domain": "general"},
    # Future Indicative
    "ero": {"translation": "I will be", "pos": "verb", "domain": "general"},
    "eris": {"translation": "you will be", "pos": "verb", "domain": "general"},
    "erit": {"translation": "will be", "pos": "verb", "domain": "general"},
    "erimus": {"translation": "we will be", "pos": "verb", "domain": "general"},
    "eritis": {"translation": "you (pl.) will be", "pos": "verb", "domain": "general"},
    "erunt": {"translation": "they will be", "pos": "verb", "domain": "general"},
    # Perfect Indicative
    "fui": {"translation": "I was/have been", "pos": "verb", "domain": "general"},
    "fuisti": {"translation": "you were/have been", "pos": "verb", "domain": "general"},
    "fuit": {"translation": "was/has been", "pos": "verb", "domain": "general"},
    "fuimus": {"translation": "we were/have been", "pos": "verb", "domain": "general"},
    "fuistis": {"translation": "you (pl.) were/have been", "pos": "verb", "domain": "general"},
    "fuerunt": {"translation": "they were/have been", "pos": "verb", "domain": "general"},
    "fuere": {"translation": "they were/have been", "pos": "verb", "domain": "general"},
    # Pluperfect Indicative
    "fueram": {"translation": "I had been", "pos": "verb", "domain": "general"},
    "fueras": {"translation": "you had been", "pos": "verb", "domain": "general"},
    "fuerat": {"translation": "had been", "pos": "verb", "domain": "general"},
    "fueramus": {"translation": "we had been", "pos": "verb", "domain": "general"},
    "fueratis": {"translation": "you (pl.) had been", "pos": "verb", "domain": "general"},
    "fuerant": {"translation": "they had been", "pos": "verb", "domain": "general"},
    # Future Perfect Indicative
    "fuero": {"translation": "I will have been", "pos": "verb", "domain": "general"},
    "fueris": {"translation": "you will have been", "pos": "verb", "domain": "general"},
    "fuerit": {"translation": "will have been", "pos": "verb", "domain": "general"},
    "fuerimus": {"translation": "we will have been", "pos": "verb", "domain": "general"},
    "fueritis": {"translation": "you (pl.) will have been", "pos": "verb", "domain": "general"},
    "fuerint": {"translation": "they will have been", "pos": "verb", "domain": "general"},
    # Subjunctive Present
    "sim": {"translation": "I may be", "pos": "verb", "domain": "general"},
    "sis": {"translation": "you may be", "pos": "verb", "domain": "general"},
    "sit": {"translation": "may be", "pos": "verb", "domain": "general"},
    "simus": {"translation": "we may be", "pos": "verb", "domain": "general"},
    "sitis": {"translation": "you (pl.) may be", "pos": "verb", "domain": "general"},
    "sint": {"translation": "they may be", "pos": "verb", "domain": "general"},
    # Subjunctive Imperfect
    "essem": {"translation": "I would be", "pos": "verb", "domain": "general"},
    "esses": {"translation": "you would be", "pos": "verb", "domain": "general"},
    "esset": {"translation": "would be", "pos": "verb", "domain": "general"},
    "essemus": {"translation": "we would be", "pos": "verb", "domain": "general"},
    "essetis": {"translation": "you (pl.) would be", "pos": "verb", "domain": "general"},
    "essent": {"translation": "they would be", "pos": "verb", "domain": "general"},
    # Infinitives
    "esse": {"translation": "to be", "pos": "verb", "domain": "general"},
    "fuisse": {"translation": "to have been", "pos": "verb", "domain": "general"},
    "fore": {"translation": "to be about to be", "pos": "verb", "domain": "general"},
    "futurus": {"translation": "about to be", "pos": "participle", "domain": "general"},
    "futura": {"translation": "about to be (fem.)", "pos": "participle", "domain": "general"},
    "futurum": {"translation": "about to be (neut.)", "pos": "participle", "domain": "general"},

    # ============================================================================
    # VERB: possum (to be able) - ALL FORMS
    # ============================================================================
    "possum": {"translation": "I am able/can", "pos": "verb", "domain": "modal"},
    "potes": {"translation": "you can", "pos": "verb", "domain": "modal"},
    "potest": {"translation": "can/is able", "pos": "verb", "domain": "modal"},
    "possumus": {"translation": "we can", "pos": "verb", "domain": "modal"},
    "potestis": {"translation": "you (pl.) can", "pos": "verb", "domain": "modal"},
    "possunt": {"translation": "they can", "pos": "verb", "domain": "modal"},
    "poteram": {"translation": "I could/was able", "pos": "verb", "domain": "modal"},
    "poteras": {"translation": "you could", "pos": "verb", "domain": "modal"},
    "poterat": {"translation": "could/was able", "pos": "verb", "domain": "modal"},
    "poteramus": {"translation": "we could", "pos": "verb", "domain": "modal"},
    "poteratis": {"translation": "you (pl.) could", "pos": "verb", "domain": "modal"},
    "poterant": {"translation": "they could", "pos": "verb", "domain": "modal"},
    "potui": {"translation": "I could/was able", "pos": "verb", "domain": "modal"},
    "potuisti": {"translation": "you could", "pos": "verb", "domain": "modal"},
    "potuit": {"translation": "could/was able", "pos": "verb", "domain": "modal"},
    "potuimus": {"translation": "we could", "pos": "verb", "domain": "modal"},
    "potuistis": {"translation": "you (pl.) could", "pos": "verb", "domain": "modal"},
    "potuerunt": {"translation": "they could", "pos": "verb", "domain": "modal"},
    "posse": {"translation": "to be able", "pos": "verb", "domain": "modal"},

    # ============================================================================
    # VERB: volo, velle (to want) - ALL FORMS
    # ============================================================================
    "volo": {"translation": "I want/wish", "pos": "verb", "domain": "psychological"},
    "vis": {"translation": "you want", "pos": "verb", "domain": "psychological"},
    "vult": {"translation": "wants/wishes", "pos": "verb", "domain": "psychological"},
    "volumus": {"translation": "we want", "pos": "verb", "domain": "psychological"},
    "vultis": {"translation": "you (pl.) want", "pos": "verb", "domain": "psychological"},
    "volunt": {"translation": "they want", "pos": "verb", "domain": "psychological"},
    "volebam": {"translation": "I wanted", "pos": "verb", "domain": "psychological"},
    "volebas": {"translation": "you wanted", "pos": "verb", "domain": "psychological"},
    "volebat": {"translation": "wanted", "pos": "verb", "domain": "psychological"},
    "volebamus": {"translation": "we wanted", "pos": "verb", "domain": "psychological"},
    "volebatis": {"translation": "you (pl.) wanted", "pos": "verb", "domain": "psychological"},
    "volebant": {"translation": "they wanted", "pos": "verb", "domain": "psychological"},
    "volui": {"translation": "I wanted", "pos": "verb", "domain": "psychological"},
    "voluisti": {"translation": "you wanted", "pos": "verb", "domain": "psychological"},
    "voluit": {"translation": "wanted", "pos": "verb", "domain": "psychological"},
    "voluimus": {"translation": "we wanted", "pos": "verb", "domain": "psychological"},
    "voluistis": {"translation": "you (pl.) wanted", "pos": "verb", "domain": "psychological"},
    "voluerunt": {"translation": "they wanted", "pos": "verb", "domain": "psychological"},
    "velle": {"translation": "to want", "pos": "verb", "domain": "psychological"},
    "velim": {"translation": "I would want", "pos": "verb", "domain": "psychological"},
    "velis": {"translation": "you would want", "pos": "verb", "domain": "psychological"},
    "velit": {"translation": "would want", "pos": "verb", "domain": "psychological"},

    # ============================================================================
    # VERB: eo, ire (to go) - ALL FORMS
    # ============================================================================
    "eo": {"translation": "I go", "pos": "verb", "domain": "motion"},
    "is": {"translation": "you go", "pos": "verb", "domain": "motion"},
    "it": {"translation": "goes", "pos": "verb", "domain": "motion"},
    "imus": {"translation": "we go", "pos": "verb", "domain": "motion"},
    "itis": {"translation": "you (pl.) go", "pos": "verb", "domain": "motion"},
    "eunt": {"translation": "they go", "pos": "verb", "domain": "motion"},
    "ibam": {"translation": "I was going", "pos": "verb", "domain": "motion"},
    "ibas": {"translation": "you were going", "pos": "verb", "domain": "motion"},
    "ibat": {"translation": "was going", "pos": "verb", "domain": "motion"},
    "ibamus": {"translation": "we were going", "pos": "verb", "domain": "motion"},
    "ibatis": {"translation": "you (pl.) were going", "pos": "verb", "domain": "motion"},
    "ibant": {"translation": "they were going", "pos": "verb", "domain": "motion"},
    "ii": {"translation": "I went", "pos": "verb", "domain": "motion"},
    "isti": {"translation": "you went", "pos": "verb", "domain": "motion"},
    "iit": {"translation": "went", "pos": "verb", "domain": "motion"},
    "iimus": {"translation": "we went", "pos": "verb", "domain": "motion"},
    "istis": {"translation": "you (pl.) went", "pos": "verb", "domain": "motion"},
    "ierunt": {"translation": "they went", "pos": "verb", "domain": "motion"},
    "ire": {"translation": "to go", "pos": "verb", "domain": "motion"},
    "iens": {"translation": "going", "pos": "participle", "domain": "motion"},
    "euntes": {"translation": "going (pl.)", "pos": "participle", "domain": "motion"},

    # ============================================================================
    # VERB: fero, ferre (to carry/bear) - ALL FORMS
    # ============================================================================
    "fero": {"translation": "I carry/bear", "pos": "verb", "domain": "general"},
    "fers": {"translation": "you carry", "pos": "verb", "domain": "general"},
    "fert": {"translation": "carries/bears", "pos": "verb", "domain": "general"},
    "ferimus": {"translation": "we carry", "pos": "verb", "domain": "general"},
    "fertis": {"translation": "you (pl.) carry", "pos": "verb", "domain": "general"},
    "ferunt": {"translation": "they carry", "pos": "verb", "domain": "general"},
    "ferebam": {"translation": "I was carrying", "pos": "verb", "domain": "general"},
    "ferebat": {"translation": "was carrying", "pos": "verb", "domain": "general"},
    "ferebant": {"translation": "they were carrying", "pos": "verb", "domain": "general"},
    "tuli": {"translation": "I carried", "pos": "verb", "domain": "general"},
    "tulisti": {"translation": "you carried", "pos": "verb", "domain": "general"},
    "tulit": {"translation": "carried", "pos": "verb", "domain": "general"},
    "tulimus": {"translation": "we carried", "pos": "verb", "domain": "general"},
    "tulistis": {"translation": "you (pl.) carried", "pos": "verb", "domain": "general"},
    "tulerunt": {"translation": "they carried", "pos": "verb", "domain": "general"},
    "ferre": {"translation": "to carry/bear", "pos": "verb", "domain": "general"},
    "latus": {"translation": "carried/borne", "pos": "participle", "domain": "general"},

    # ============================================================================
    # COMMON VERBS WITH CONJUGATED FORMS
    # ============================================================================
    # dico, dicere (to say)
    "dico": {"translation": "I say/speak", "pos": "verb", "domain": "general"},
    "dicis": {"translation": "you say", "pos": "verb", "domain": "general"},
    "dicit": {"translation": "says", "pos": "verb", "domain": "general"},
    "dicimus": {"translation": "we say", "pos": "verb", "domain": "general"},
    "dicitis": {"translation": "you (pl.) say", "pos": "verb", "domain": "general"},
    "dicunt": {"translation": "they say", "pos": "verb", "domain": "general"},
    "dicebam": {"translation": "I was saying", "pos": "verb", "domain": "general"},
    "dicebat": {"translation": "was saying", "pos": "verb", "domain": "general"},
    "dicebant": {"translation": "they were saying", "pos": "verb", "domain": "general"},
    "dixi": {"translation": "I said", "pos": "verb", "domain": "general"},
    "dixisti": {"translation": "you said", "pos": "verb", "domain": "general"},
    "dixit": {"translation": "said", "pos": "verb", "domain": "general"},
    "diximus": {"translation": "we said", "pos": "verb", "domain": "general"},
    "dixistis": {"translation": "you (pl.) said", "pos": "verb", "domain": "general"},
    "dixerunt": {"translation": "they said", "pos": "verb", "domain": "general"},
    "dicere": {"translation": "to say", "pos": "verb", "domain": "general"},
    "dictus": {"translation": "said/spoken", "pos": "participle", "domain": "general"},
    "dicens": {"translation": "saying", "pos": "participle", "domain": "general"},

    # facio, facere (to do/make)
    "facio": {"translation": "I do/make", "pos": "verb", "domain": "general"},
    "facis": {"translation": "you do/make", "pos": "verb", "domain": "general"},
    "facit": {"translation": "does/makes", "pos": "verb", "domain": "general"},
    "facimus": {"translation": "we do/make", "pos": "verb", "domain": "general"},
    "facitis": {"translation": "you (pl.) do/make", "pos": "verb", "domain": "general"},
    "faciunt": {"translation": "they do/make", "pos": "verb", "domain": "general"},
    "faciebam": {"translation": "I was doing", "pos": "verb", "domain": "general"},
    "faciebat": {"translation": "was doing/making", "pos": "verb", "domain": "general"},
    "faciebant": {"translation": "they were doing", "pos": "verb", "domain": "general"},
    "feci": {"translation": "I did/made", "pos": "verb", "domain": "general"},
    "fecisti": {"translation": "you did/made", "pos": "verb", "domain": "general"},
    "fecit": {"translation": "did/made", "pos": "verb", "domain": "general"},
    "fecimus": {"translation": "we did/made", "pos": "verb", "domain": "general"},
    "fecistis": {"translation": "you (pl.) did/made", "pos": "verb", "domain": "general"},
    "fecerunt": {"translation": "they did/made", "pos": "verb", "domain": "general"},
    "facere": {"translation": "to do/make", "pos": "verb", "domain": "general"},
    "factus": {"translation": "done/made", "pos": "participle", "domain": "general"},
    "facta": {"translation": "done/made (fem./neut.pl.)", "pos": "participle", "domain": "general"},
    "factum": {"translation": "done/made (neut.)", "pos": "participle", "domain": "general"},
    "facti": {"translation": "done/made (masc.pl.)", "pos": "participle", "domain": "general"},
    "faciens": {"translation": "doing/making", "pos": "participle", "domain": "general"},
    "fio": {"translation": "I become/am made", "pos": "verb", "domain": "general"},
    "fis": {"translation": "you become", "pos": "verb", "domain": "general"},
    "fit": {"translation": "becomes/happens", "pos": "verb", "domain": "general"},
    "fimus": {"translation": "we become", "pos": "verb", "domain": "general"},
    "fitis": {"translation": "you (pl.) become", "pos": "verb", "domain": "general"},
    "fiunt": {"translation": "they become", "pos": "verb", "domain": "general"},
    "fiebat": {"translation": "was becoming", "pos": "verb", "domain": "general"},
    "fiebant": {"translation": "they were becoming", "pos": "verb", "domain": "general"},
    "fieri": {"translation": "to become/happen", "pos": "verb", "domain": "general"},
    "fiat": {"translation": "let there be/let it be made", "pos": "verb", "domain": "general"},
    "fiant": {"translation": "let them be made", "pos": "verb", "domain": "general"},

    # habeo, habere (to have)
    "habeo": {"translation": "I have", "pos": "verb", "domain": "general"},
    "habes": {"translation": "you have", "pos": "verb", "domain": "general"},
    "habet": {"translation": "has", "pos": "verb", "domain": "general"},
    "habemus": {"translation": "we have", "pos": "verb", "domain": "general"},
    "habetis": {"translation": "you (pl.) have", "pos": "verb", "domain": "general"},
    "habent": {"translation": "they have", "pos": "verb", "domain": "general"},
    "habebam": {"translation": "I had/was having", "pos": "verb", "domain": "general"},
    "habebat": {"translation": "had/was having", "pos": "verb", "domain": "general"},
    "habebant": {"translation": "they had", "pos": "verb", "domain": "general"},
    "habui": {"translation": "I had", "pos": "verb", "domain": "general"},
    "habuisti": {"translation": "you had", "pos": "verb", "domain": "general"},
    "habuit": {"translation": "had", "pos": "verb", "domain": "general"},
    "habuimus": {"translation": "we had", "pos": "verb", "domain": "general"},
    "habuistis": {"translation": "you (pl.) had", "pos": "verb", "domain": "general"},
    "habuerunt": {"translation": "they had", "pos": "verb", "domain": "general"},
    "habere": {"translation": "to have", "pos": "verb", "domain": "general"},
    "habens": {"translation": "having", "pos": "participle", "domain": "general"},

    # video, videre (to see)
    "video": {"translation": "I see", "pos": "verb", "domain": "sensory"},
    "vides": {"translation": "you see", "pos": "verb", "domain": "sensory"},
    "videt": {"translation": "sees", "pos": "verb", "domain": "sensory"},
    "videmus": {"translation": "we see", "pos": "verb", "domain": "sensory"},
    "videtis": {"translation": "you (pl.) see", "pos": "verb", "domain": "sensory"},
    "vident": {"translation": "they see", "pos": "verb", "domain": "sensory"},
    "videbam": {"translation": "I was seeing", "pos": "verb", "domain": "sensory"},
    "videbat": {"translation": "was seeing", "pos": "verb", "domain": "sensory"},
    "videbant": {"translation": "they were seeing", "pos": "verb", "domain": "sensory"},
    "vidi": {"translation": "I saw", "pos": "verb", "domain": "sensory"},
    "vidisti": {"translation": "you saw", "pos": "verb", "domain": "sensory"},
    "vidit": {"translation": "saw", "pos": "verb", "domain": "sensory"},
    "vidimus": {"translation": "we saw", "pos": "verb", "domain": "sensory"},
    "vidistis": {"translation": "you (pl.) saw", "pos": "verb", "domain": "sensory"},
    "viderunt": {"translation": "they saw", "pos": "verb", "domain": "sensory"},
    "videre": {"translation": "to see", "pos": "verb", "domain": "sensory"},
    "visus": {"translation": "seen", "pos": "participle", "domain": "sensory"},
    "videns": {"translation": "seeing", "pos": "participle", "domain": "sensory"},

    # audio, audire (to hear)
    "audio": {"translation": "I hear", "pos": "verb", "domain": "sensory"},
    "audis": {"translation": "you hear", "pos": "verb", "domain": "sensory"},
    "audit": {"translation": "hears", "pos": "verb", "domain": "sensory"},
    "audimus": {"translation": "we hear", "pos": "verb", "domain": "sensory"},
    "auditis": {"translation": "you (pl.) hear", "pos": "verb", "domain": "sensory"},
    "audiunt": {"translation": "they hear", "pos": "verb", "domain": "sensory"},
    "audiebam": {"translation": "I was hearing", "pos": "verb", "domain": "sensory"},
    "audiebat": {"translation": "was hearing", "pos": "verb", "domain": "sensory"},
    "audiebant": {"translation": "they were hearing", "pos": "verb", "domain": "sensory"},
    "audivi": {"translation": "I heard", "pos": "verb", "domain": "sensory"},
    "audivisti": {"translation": "you heard", "pos": "verb", "domain": "sensory"},
    "audivit": {"translation": "heard", "pos": "verb", "domain": "sensory"},
    "audivimus": {"translation": "we heard", "pos": "verb", "domain": "sensory"},
    "audivistis": {"translation": "you (pl.) heard", "pos": "verb", "domain": "sensory"},
    "audiverunt": {"translation": "they heard", "pos": "verb", "domain": "sensory"},
    "audire": {"translation": "to hear", "pos": "verb", "domain": "sensory"},
    "audiens": {"translation": "hearing", "pos": "participle", "domain": "sensory"},

    # scio, scire (to know)
    "scio": {"translation": "I know", "pos": "verb", "domain": "epistemological"},
    "scis": {"translation": "you know", "pos": "verb", "domain": "epistemological"},
    "scit": {"translation": "knows", "pos": "verb", "domain": "epistemological"},
    "scimus": {"translation": "we know", "pos": "verb", "domain": "epistemological"},
    "scitis": {"translation": "you (pl.) know", "pos": "verb", "domain": "epistemological"},
    "sciunt": {"translation": "they know", "pos": "verb", "domain": "epistemological"},
    "sciebam": {"translation": "I knew", "pos": "verb", "domain": "epistemological"},
    "sciebat": {"translation": "knew", "pos": "verb", "domain": "epistemological"},
    "sciebant": {"translation": "they knew", "pos": "verb", "domain": "epistemological"},
    "scivi": {"translation": "I learned/knew", "pos": "verb", "domain": "epistemological"},
    "scivisti": {"translation": "you learned", "pos": "verb", "domain": "epistemological"},
    "scivit": {"translation": "learned/knew", "pos": "verb", "domain": "epistemological"},
    "scire": {"translation": "to know", "pos": "verb", "domain": "epistemological"},
    "sciens": {"translation": "knowing", "pos": "participle", "domain": "epistemological"},

    # venio, venire (to come)
    "venio": {"translation": "I come", "pos": "verb", "domain": "motion"},
    "venis": {"translation": "you come", "pos": "verb", "domain": "motion"},
    "venit": {"translation": "comes", "pos": "verb", "domain": "motion"},
    "venimus": {"translation": "we come", "pos": "verb", "domain": "motion"},
    "venitis": {"translation": "you (pl.) come", "pos": "verb", "domain": "motion"},
    "veniunt": {"translation": "they come", "pos": "verb", "domain": "motion"},
    "veniebam": {"translation": "I was coming", "pos": "verb", "domain": "motion"},
    "veniebat": {"translation": "was coming", "pos": "verb", "domain": "motion"},
    "veniebant": {"translation": "they were coming", "pos": "verb", "domain": "motion"},
    "veni": {"translation": "I came", "pos": "verb", "domain": "motion"},
    "venisti": {"translation": "you came", "pos": "verb", "domain": "motion"},
    "venire": {"translation": "to come", "pos": "verb", "domain": "motion"},
    "veniens": {"translation": "coming", "pos": "participle", "domain": "motion"},

    # do, dare (to give)
    "do": {"translation": "I give", "pos": "verb", "domain": "general"},
    "das": {"translation": "you give", "pos": "verb", "domain": "general"},
    "dat": {"translation": "gives", "pos": "verb", "domain": "general"},
    "damus": {"translation": "we give", "pos": "verb", "domain": "general"},
    "datis": {"translation": "you (pl.) give", "pos": "verb", "domain": "general"},
    "dant": {"translation": "they give", "pos": "verb", "domain": "general"},
    "dabam": {"translation": "I was giving", "pos": "verb", "domain": "general"},
    "dabat": {"translation": "was giving", "pos": "verb", "domain": "general"},
    "dabant": {"translation": "they were giving", "pos": "verb", "domain": "general"},
    "dedi": {"translation": "I gave", "pos": "verb", "domain": "general"},
    "dedisti": {"translation": "you gave", "pos": "verb", "domain": "general"},
    "dedit": {"translation": "gave", "pos": "verb", "domain": "general"},
    "dedimus": {"translation": "we gave", "pos": "verb", "domain": "general"},
    "dedistis": {"translation": "you (pl.) gave", "pos": "verb", "domain": "general"},
    "dederunt": {"translation": "they gave", "pos": "verb", "domain": "general"},
    "dare": {"translation": "to give", "pos": "verb", "domain": "general"},
    "datus": {"translation": "given", "pos": "participle", "domain": "general"},
    "dans": {"translation": "giving", "pos": "participle", "domain": "general"},

    # credo, credere (to believe)
    "credo": {"translation": "I believe", "pos": "verb", "domain": "epistemological"},
    "credis": {"translation": "you believe", "pos": "verb", "domain": "epistemological"},
    "credit": {"translation": "believes", "pos": "verb", "domain": "epistemological"},
    "credimus": {"translation": "we believe", "pos": "verb", "domain": "epistemological"},
    "creditis": {"translation": "you (pl.) believe", "pos": "verb", "domain": "epistemological"},
    "credunt": {"translation": "they believe", "pos": "verb", "domain": "epistemological"},
    "credebam": {"translation": "I believed", "pos": "verb", "domain": "epistemological"},
    "credebat": {"translation": "believed", "pos": "verb", "domain": "epistemological"},
    "credebant": {"translation": "they believed", "pos": "verb", "domain": "epistemological"},
    "credidi": {"translation": "I believed", "pos": "verb", "domain": "epistemological"},
    "credidit": {"translation": "believed", "pos": "verb", "domain": "epistemological"},
    "crediderunt": {"translation": "they believed", "pos": "verb", "domain": "epistemological"},
    "credere": {"translation": "to believe", "pos": "verb", "domain": "epistemological"},
    "credens": {"translation": "believing", "pos": "participle", "domain": "epistemological"},

    # puto, putare (to think)
    "puto": {"translation": "I think", "pos": "verb", "domain": "epistemological"},
    "putas": {"translation": "you think", "pos": "verb", "domain": "epistemological"},
    "putat": {"translation": "thinks", "pos": "verb", "domain": "epistemological"},
    "putamus": {"translation": "we think", "pos": "verb", "domain": "epistemological"},
    "putatis": {"translation": "you (pl.) think", "pos": "verb", "domain": "epistemological"},
    "putant": {"translation": "they think", "pos": "verb", "domain": "epistemological"},
    "putabam": {"translation": "I thought", "pos": "verb", "domain": "epistemological"},
    "putabat": {"translation": "thought", "pos": "verb", "domain": "epistemological"},
    "putabant": {"translation": "they thought", "pos": "verb", "domain": "epistemological"},
    "putavi": {"translation": "I thought", "pos": "verb", "domain": "epistemological"},
    "putavit": {"translation": "thought", "pos": "verb", "domain": "epistemological"},
    "putaverunt": {"translation": "they thought", "pos": "verb", "domain": "epistemological"},
    "putare": {"translation": "to think", "pos": "verb", "domain": "epistemological"},
    "putans": {"translation": "thinking", "pos": "participle", "domain": "epistemological"},

    # amo, amare (to love)
    "amo": {"translation": "I love", "pos": "verb", "domain": "emotional"},
    "amas": {"translation": "you love", "pos": "verb", "domain": "emotional"},
    "amat": {"translation": "loves", "pos": "verb", "domain": "emotional"},
    "amamus": {"translation": "we love", "pos": "verb", "domain": "emotional"},
    "amatis": {"translation": "you (pl.) love", "pos": "verb", "domain": "emotional"},
    "amant": {"translation": "they love", "pos": "verb", "domain": "emotional"},
    "amabam": {"translation": "I loved/was loving", "pos": "verb", "domain": "emotional"},
    "amabat": {"translation": "loved/was loving", "pos": "verb", "domain": "emotional"},
    "amabant": {"translation": "they loved", "pos": "verb", "domain": "emotional"},
    "amavi": {"translation": "I loved", "pos": "verb", "domain": "emotional"},
    "amavit": {"translation": "loved", "pos": "verb", "domain": "emotional"},
    "amaverunt": {"translation": "they loved", "pos": "verb", "domain": "emotional"},
    "amare": {"translation": "to love", "pos": "verb", "domain": "emotional"},
    "amatus": {"translation": "loved", "pos": "participle", "domain": "emotional"},
    "amans": {"translation": "loving", "pos": "participle", "domain": "emotional"},

    # cogito, cogitare (to think)
    "cogito": {"translation": "I think", "pos": "verb", "domain": "epistemological"},
    "cogitas": {"translation": "you think", "pos": "verb", "domain": "epistemological"},
    "cogitat": {"translation": "thinks", "pos": "verb", "domain": "epistemological"},
    "cogitamus": {"translation": "we think", "pos": "verb", "domain": "epistemological"},
    "cogitant": {"translation": "they think", "pos": "verb", "domain": "epistemological"},
    "cogitabam": {"translation": "I was thinking", "pos": "verb", "domain": "epistemological"},
    "cogitabat": {"translation": "was thinking", "pos": "verb", "domain": "epistemological"},
    "cogitavi": {"translation": "I thought", "pos": "verb", "domain": "epistemological"},
    "cogitavit": {"translation": "thought", "pos": "verb", "domain": "epistemological"},
    "cogitare": {"translation": "to think", "pos": "verb", "domain": "epistemological"},
    "cogitans": {"translation": "thinking", "pos": "participle", "domain": "epistemological"},

    # vinco, vincere (to conquer)
    "vinco": {"translation": "I conquer", "pos": "verb", "domain": "military"},
    "vincis": {"translation": "you conquer", "pos": "verb", "domain": "military"},
    "vincit": {"translation": "conquers", "pos": "verb", "domain": "military"},
    "vincimus": {"translation": "we conquer", "pos": "verb", "domain": "military"},
    "vincunt": {"translation": "they conquer", "pos": "verb", "domain": "military"},
    "vincebam": {"translation": "I was conquering", "pos": "verb", "domain": "military"},
    "vincebat": {"translation": "was conquering", "pos": "verb", "domain": "military"},
    "vici": {"translation": "I conquered", "pos": "verb", "domain": "military"},
    "vicisti": {"translation": "you conquered", "pos": "verb", "domain": "military"},
    "vicit": {"translation": "conquered", "pos": "verb", "domain": "military"},
    "vicimus": {"translation": "we conquered", "pos": "verb", "domain": "military"},
    "vicerunt": {"translation": "they conquered", "pos": "verb", "domain": "military"},
    "vincere": {"translation": "to conquer", "pos": "verb", "domain": "military"},
    "victus": {"translation": "conquered", "pos": "participle", "domain": "military"},
    "vincens": {"translation": "conquering", "pos": "participle", "domain": "military"},

    # carpo, carpere (to seize/pluck)
    "carpo": {"translation": "I seize/pluck", "pos": "verb", "domain": "general"},
    "carpis": {"translation": "you seize", "pos": "verb", "domain": "general"},
    "carpit": {"translation": "seizes", "pos": "verb", "domain": "general"},
    "carpimus": {"translation": "we seize", "pos": "verb", "domain": "general"},
    "carpunt": {"translation": "they seize", "pos": "verb", "domain": "general"},
    "carpebam": {"translation": "I was seizing", "pos": "verb", "domain": "general"},
    "carpebat": {"translation": "was seizing", "pos": "verb", "domain": "general"},
    "carpsi": {"translation": "I seized", "pos": "verb", "domain": "general"},
    "carpsit": {"translation": "seized", "pos": "verb", "domain": "general"},
    "carpere": {"translation": "to seize", "pos": "verb", "domain": "general"},
    "carpe": {"translation": "seize!", "pos": "verb", "domain": "general"},
    "carpens": {"translation": "seizing", "pos": "participle", "domain": "general"},

    # libero, liberare (to free)
    "libero": {"translation": "I free", "pos": "verb", "domain": "political"},
    "liberas": {"translation": "you free", "pos": "verb", "domain": "political"},
    "liberat": {"translation": "frees", "pos": "verb", "domain": "political"},
    "liberamus": {"translation": "we free", "pos": "verb", "domain": "political"},
    "liberant": {"translation": "they free", "pos": "verb", "domain": "political"},
    "liberabam": {"translation": "I was freeing", "pos": "verb", "domain": "political"},
    "liberabat": {"translation": "was freeing", "pos": "verb", "domain": "political"},
    "liberabo": {"translation": "I will free", "pos": "verb", "domain": "political"},
    "liberabis": {"translation": "you will free", "pos": "verb", "domain": "political"},
    "liberabit": {"translation": "will free", "pos": "verb", "domain": "political"},
    "liberabimus": {"translation": "we will free", "pos": "verb", "domain": "political"},
    "liberabunt": {"translation": "they will free", "pos": "verb", "domain": "political"},
    "liberavi": {"translation": "I freed", "pos": "verb", "domain": "political"},
    "liberavit": {"translation": "freed", "pos": "verb", "domain": "political"},
    "liberare": {"translation": "to free", "pos": "verb", "domain": "political"},
    "liberatus": {"translation": "freed", "pos": "participle", "domain": "political"},
    "liberans": {"translation": "freeing", "pos": "participle", "domain": "political"},

    # luceo, lucere (to shine)
    "luceo": {"translation": "I shine", "pos": "verb", "domain": "physical"},
    "luces": {"translation": "you shine", "pos": "verb", "domain": "physical"},
    "lucet": {"translation": "shines", "pos": "verb", "domain": "physical"},
    "lucemus": {"translation": "we shine", "pos": "verb", "domain": "physical"},
    "lucent": {"translation": "they shine", "pos": "verb", "domain": "physical"},
    "lucebam": {"translation": "I was shining", "pos": "verb", "domain": "physical"},
    "lucebat": {"translation": "was shining", "pos": "verb", "domain": "physical"},
    "lucebant": {"translation": "they were shining", "pos": "verb", "domain": "physical"},
    "lucere": {"translation": "to shine", "pos": "verb", "domain": "physical"},
    "lucens": {"translation": "shining", "pos": "participle", "domain": "physical"},

    # comprehendo, comprehendere (to comprehend/seize)
    "comprehendo": {"translation": "I comprehend/seize", "pos": "verb", "domain": "epistemological"},
    "comprehendis": {"translation": "you comprehend", "pos": "verb", "domain": "epistemological"},
    "comprehendit": {"translation": "comprehends", "pos": "verb", "domain": "epistemological"},
    "comprehendimus": {"translation": "we comprehend", "pos": "verb", "domain": "epistemological"},
    "comprehendunt": {"translation": "they comprehend", "pos": "verb", "domain": "epistemological"},
    "comprehendebam": {"translation": "I was comprehending", "pos": "verb", "domain": "epistemological"},
    "comprehendebat": {"translation": "was comprehending", "pos": "verb", "domain": "epistemological"},
    "comprehendi": {"translation": "I comprehended", "pos": "verb", "domain": "epistemological"},
    "comprehendit": {"translation": "comprehended", "pos": "verb", "domain": "epistemological"},
    "comprehenderunt": {"translation": "they comprehended", "pos": "verb", "domain": "epistemological"},
    "conprehenderunt": {"translation": "they comprehended", "pos": "verb", "domain": "epistemological"},
    "comprehendere": {"translation": "to comprehend", "pos": "verb", "domain": "epistemological"},
    "comprehensus": {"translation": "comprehended", "pos": "participle", "domain": "epistemological"},

    # iacio, iacere (to throw/cast)
    "iacio": {"translation": "I throw/cast", "pos": "verb", "domain": "general"},
    "iacis": {"translation": "you throw", "pos": "verb", "domain": "general"},
    "iacit": {"translation": "throws", "pos": "verb", "domain": "general"},
    "iacimus": {"translation": "we throw", "pos": "verb", "domain": "general"},
    "iaciunt": {"translation": "they throw", "pos": "verb", "domain": "general"},
    "ieci": {"translation": "I threw", "pos": "verb", "domain": "general"},
    "iecit": {"translation": "threw", "pos": "verb", "domain": "general"},
    "iecerunt": {"translation": "they threw", "pos": "verb", "domain": "general"},
    "iacere": {"translation": "to throw", "pos": "verb", "domain": "general"},
    "iactus": {"translation": "thrown/cast", "pos": "participle", "domain": "general"},
    "iacta": {"translation": "thrown/cast (fem./neut.pl.)", "pos": "participle", "domain": "general"},
    "iactum": {"translation": "thrown/cast (neut.)", "pos": "participle", "domain": "general"},
    "iaciens": {"translation": "throwing", "pos": "participle", "domain": "general"},

    # morior, mori (to die)
    "morior": {"translation": "I die", "pos": "verb", "domain": "biological"},
    "moreris": {"translation": "you die", "pos": "verb", "domain": "biological"},
    "moritur": {"translation": "dies", "pos": "verb", "domain": "biological"},
    "morimur": {"translation": "we die", "pos": "verb", "domain": "biological"},
    "moriuntur": {"translation": "they die", "pos": "verb", "domain": "biological"},
    "moriebatur": {"translation": "was dying", "pos": "verb", "domain": "biological"},
    "mortuus": {"translation": "dead/died", "pos": "participle", "domain": "biological"},
    "mortua": {"translation": "dead (fem.)", "pos": "participle", "domain": "biological"},
    "mortuum": {"translation": "dead (neut.)", "pos": "participle", "domain": "biological"},
    "mori": {"translation": "to die", "pos": "verb", "domain": "biological"},
    "moriens": {"translation": "dying", "pos": "participle", "domain": "biological"},

    # memini (to remember - defective verb)
    "memini": {"translation": "I remember", "pos": "verb", "domain": "epistemological"},
    "meministi": {"translation": "you remember", "pos": "verb", "domain": "epistemological"},
    "meminit": {"translation": "remembers", "pos": "verb", "domain": "epistemological"},
    "meminimus": {"translation": "we remember", "pos": "verb", "domain": "epistemological"},
    "meminerunt": {"translation": "they remember", "pos": "verb", "domain": "epistemological"},
    "memento": {"translation": "remember!", "pos": "verb", "domain": "epistemological"},
    "mementote": {"translation": "remember! (pl.)", "pos": "verb", "domain": "epistemological"},

    # creo, creare (to create)
    "creo": {"translation": "I create", "pos": "verb", "domain": "religious"},
    "creas": {"translation": "you create", "pos": "verb", "domain": "religious"},
    "creat": {"translation": "creates", "pos": "verb", "domain": "religious"},
    "creamus": {"translation": "we create", "pos": "verb", "domain": "religious"},
    "creant": {"translation": "they create", "pos": "verb", "domain": "religious"},
    "creabam": {"translation": "I was creating", "pos": "verb", "domain": "religious"},
    "creabat": {"translation": "was creating", "pos": "verb", "domain": "religious"},
    "creavi": {"translation": "I created", "pos": "verb", "domain": "religious"},
    "creavisti": {"translation": "you created", "pos": "verb", "domain": "religious"},
    "creavit": {"translation": "created", "pos": "verb", "domain": "religious"},
    "creavimus": {"translation": "we created", "pos": "verb", "domain": "religious"},
    "creaverunt": {"translation": "they created", "pos": "verb", "domain": "religious"},
    "creare": {"translation": "to create", "pos": "verb", "domain": "religious"},
    "creatus": {"translation": "created", "pos": "participle", "domain": "religious"},
    "creata": {"translation": "created (fem./neut.pl.)", "pos": "participle", "domain": "religious"},
    "creatum": {"translation": "created (neut.)", "pos": "participle", "domain": "religious"},
    "creans": {"translation": "creating", "pos": "participle", "domain": "religious"},

    # ============================================================================
    # ESSENTIAL NOUNS WITH INFLECTED FORMS
    # ============================================================================
    # principium (beginning) - 2nd declension neuter
    "principium": {"translation": "beginning/first principle", "pos": "noun", "domain": "philosophical"},
    "principii": {"translation": "of the beginning", "pos": "noun", "domain": "philosophical"},
    "principio": {"translation": "in the beginning", "pos": "noun", "domain": "philosophical"},
    "principia": {"translation": "beginnings/principles", "pos": "noun", "domain": "philosophical"},
    "principiorum": {"translation": "of beginnings", "pos": "noun", "domain": "philosophical"},
    "principiis": {"translation": "in/to beginnings", "pos": "noun", "domain": "philosophical"},

    # verbum (word) - 2nd declension neuter
    "verbum": {"translation": "word", "pos": "noun", "domain": "linguistic"},
    "verbi": {"translation": "of the word", "pos": "noun", "domain": "linguistic"},
    "verbo": {"translation": "by/with the word", "pos": "noun", "domain": "linguistic"},
    "verba": {"translation": "words", "pos": "noun", "domain": "linguistic"},
    "verborum": {"translation": "of words", "pos": "noun", "domain": "linguistic"},
    "verbis": {"translation": "by/with words", "pos": "noun", "domain": "linguistic"},

    # deus (god) - 2nd declension masculine
    "deus": {"translation": "god", "pos": "noun", "domain": "religious"},
    "dei": {"translation": "of god", "pos": "noun", "domain": "religious"},
    "deo": {"translation": "to/for god", "pos": "noun", "domain": "religious"},
    "deum": {"translation": "god (acc.)", "pos": "noun", "domain": "religious"},
    "di": {"translation": "gods", "pos": "noun", "domain": "religious"},
    "dii": {"translation": "gods", "pos": "noun", "domain": "religious"},
    "deorum": {"translation": "of gods", "pos": "noun", "domain": "religious"},
    "deis": {"translation": "to/for gods", "pos": "noun", "domain": "religious"},
    "diis": {"translation": "to/for gods", "pos": "noun", "domain": "religious"},
    "deos": {"translation": "gods (acc.)", "pos": "noun", "domain": "religious"},

    # homo (human) - 3rd declension
    "homo": {"translation": "human being/person", "pos": "noun", "domain": "general"},
    "hominis": {"translation": "of a person", "pos": "noun", "domain": "general"},
    "homini": {"translation": "to a person", "pos": "noun", "domain": "general"},
    "hominem": {"translation": "person (acc.)", "pos": "noun", "domain": "general"},
    "homine": {"translation": "by/with a person", "pos": "noun", "domain": "general"},
    "homines": {"translation": "people/humans", "pos": "noun", "domain": "general"},
    "hominum": {"translation": "of people", "pos": "noun", "domain": "general"},
    "hominibus": {"translation": "to/for people", "pos": "noun", "domain": "general"},

    # anima (soul) - 1st declension
    "anima": {"translation": "soul/breath", "pos": "noun", "domain": "philosophical"},
    "animae": {"translation": "of the soul", "pos": "noun", "domain": "philosophical"},
    "animam": {"translation": "soul (acc.)", "pos": "noun", "domain": "philosophical"},
    "animarum": {"translation": "of souls", "pos": "noun", "domain": "philosophical"},
    "animis": {"translation": "to/for souls", "pos": "noun", "domain": "philosophical"},
    "animas": {"translation": "souls (acc.)", "pos": "noun", "domain": "philosophical"},

    # corpus (body) - 3rd declension neuter
    "corpus": {"translation": "body", "pos": "noun", "domain": "general"},
    "corporis": {"translation": "of the body", "pos": "noun", "domain": "general"},
    "corpori": {"translation": "to the body", "pos": "noun", "domain": "general"},
    "corpore": {"translation": "by/with the body", "pos": "noun", "domain": "general"},
    "corpora": {"translation": "bodies", "pos": "noun", "domain": "general"},
    "corporum": {"translation": "of bodies", "pos": "noun", "domain": "general"},
    "corporibus": {"translation": "to/for bodies", "pos": "noun", "domain": "general"},

    # lux (light) - 3rd declension
    "lux": {"translation": "light", "pos": "noun", "domain": "physical"},
    "lucis": {"translation": "of light", "pos": "noun", "domain": "physical"},
    "luci": {"translation": "to light", "pos": "noun", "domain": "physical"},
    "lucem": {"translation": "light (acc.)", "pos": "noun", "domain": "physical"},
    "luce": {"translation": "by/with light", "pos": "noun", "domain": "physical"},
    "luces": {"translation": "lights", "pos": "noun", "domain": "physical"},
    "lucum": {"translation": "of lights", "pos": "noun", "domain": "physical"},

    # tenebrae (darkness) - 1st declension plural
    "tenebrae": {"translation": "darkness", "pos": "noun", "domain": "physical"},
    "tenebrarum": {"translation": "of darkness", "pos": "noun", "domain": "physical"},
    "tenebris": {"translation": "in darkness", "pos": "noun", "domain": "physical"},
    "tenebras": {"translation": "darkness (acc.)", "pos": "noun", "domain": "physical"},

    # vita (life) - 1st declension
    "vita": {"translation": "life", "pos": "noun", "domain": "biological"},
    "vitae": {"translation": "of life", "pos": "noun", "domain": "biological"},
    "vitam": {"translation": "life (acc.)", "pos": "noun", "domain": "biological"},
    "vitas": {"translation": "lives (acc.)", "pos": "noun", "domain": "biological"},
    "vitarum": {"translation": "of lives", "pos": "noun", "domain": "biological"},
    "vitis": {"translation": "to/for lives", "pos": "noun", "domain": "biological"},

    # mors (death) - 3rd declension
    "mors": {"translation": "death", "pos": "noun", "domain": "biological"},
    "mortis": {"translation": "of death", "pos": "noun", "domain": "biological"},
    "morti": {"translation": "to death", "pos": "noun", "domain": "biological"},
    "mortem": {"translation": "death (acc.)", "pos": "noun", "domain": "biological"},
    "morte": {"translation": "by/with death", "pos": "noun", "domain": "biological"},
    "mortes": {"translation": "deaths", "pos": "noun", "domain": "biological"},
    "mortium": {"translation": "of deaths", "pos": "noun", "domain": "biological"},

    # veritas (truth) - 3rd declension
    "veritas": {"translation": "truth", "pos": "noun", "domain": "philosophical"},
    "veritatis": {"translation": "of truth", "pos": "noun", "domain": "philosophical"},
    "veritati": {"translation": "to truth", "pos": "noun", "domain": "philosophical"},
    "veritatem": {"translation": "truth (acc.)", "pos": "noun", "domain": "philosophical"},
    "veritate": {"translation": "by/with truth", "pos": "noun", "domain": "philosophical"},

    # virtus (virtue) - 3rd declension
    "virtus": {"translation": "virtue/excellence/courage", "pos": "noun", "domain": "ethical"},
    "virtutis": {"translation": "of virtue", "pos": "noun", "domain": "ethical"},
    "virtuti": {"translation": "to virtue", "pos": "noun", "domain": "ethical"},
    "virtutem": {"translation": "virtue (acc.)", "pos": "noun", "domain": "ethical"},
    "virtute": {"translation": "by/with virtue", "pos": "noun", "domain": "ethical"},
    "virtutes": {"translation": "virtues", "pos": "noun", "domain": "ethical"},
    "virtutum": {"translation": "of virtues", "pos": "noun", "domain": "ethical"},

    # sapientia (wisdom) - 1st declension
    "sapientia": {"translation": "wisdom", "pos": "noun", "domain": "philosophical"},
    "sapientiae": {"translation": "of wisdom", "pos": "noun", "domain": "philosophical"},
    "sapientiam": {"translation": "wisdom (acc.)", "pos": "noun", "domain": "philosophical"},
    "sapientiā": {"translation": "by/with wisdom", "pos": "noun", "domain": "philosophical"},

    # natura (nature) - 1st declension
    "natura": {"translation": "nature", "pos": "noun", "domain": "philosophical"},
    "naturae": {"translation": "of nature", "pos": "noun", "domain": "philosophical"},
    "naturam": {"translation": "nature (acc.)", "pos": "noun", "domain": "philosophical"},
    "naturā": {"translation": "by/with nature", "pos": "noun", "domain": "philosophical"},
    "naturas": {"translation": "natures (acc.)", "pos": "noun", "domain": "philosophical"},
    "naturarum": {"translation": "of natures", "pos": "noun", "domain": "philosophical"},

    # ratio (reason) - 3rd declension
    "ratio": {"translation": "reason/calculation", "pos": "noun", "domain": "philosophical"},
    "rationis": {"translation": "of reason", "pos": "noun", "domain": "philosophical"},
    "rationi": {"translation": "to reason", "pos": "noun", "domain": "philosophical"},
    "rationem": {"translation": "reason (acc.)", "pos": "noun", "domain": "philosophical"},
    "ratione": {"translation": "by/with reason", "pos": "noun", "domain": "philosophical"},
    "rationes": {"translation": "reasons", "pos": "noun", "domain": "philosophical"},
    "rationum": {"translation": "of reasons", "pos": "noun", "domain": "philosophical"},

    # mundus (world) - 2nd declension
    "mundus": {"translation": "world", "pos": "noun", "domain": "cosmological"},
    "mundi": {"translation": "of the world", "pos": "noun", "domain": "cosmological"},
    "mundo": {"translation": "to/in the world", "pos": "noun", "domain": "cosmological"},
    "mundum": {"translation": "world (acc.)", "pos": "noun", "domain": "cosmological"},

    # lupus (wolf) - 2nd declension masculine
    "lupus": {"translation": "wolf", "pos": "noun", "domain": "animal"},
    "lupi": {"translation": "of the wolf", "pos": "noun", "domain": "animal"},
    "lupo": {"translation": "to/for the wolf", "pos": "noun", "domain": "animal"},
    "lupum": {"translation": "wolf (acc.)", "pos": "noun", "domain": "animal"},
    "lupe": {"translation": "wolf (voc.)", "pos": "noun", "domain": "animal"},
    "lupos": {"translation": "wolves (acc.)", "pos": "noun", "domain": "animal"},
    "luporum": {"translation": "of wolves", "pos": "noun", "domain": "animal"},
    "lupis": {"translation": "to wolves", "pos": "noun", "domain": "animal"},

    # alea (die/dice) - 1st declension feminine
    "alea": {"translation": "die/dice/chance", "pos": "noun", "domain": "general"},
    "aleae": {"translation": "of the die", "pos": "noun", "domain": "general"},
    "aleam": {"translation": "die (acc.)", "pos": "noun", "domain": "general"},
    "aleā": {"translation": "by/with the die", "pos": "noun", "domain": "general"},

    # caelum (heaven/sky) - 2nd declension neuter
    "caelum": {"translation": "heaven/sky", "pos": "noun", "domain": "cosmological"},
    "caeli": {"translation": "of heaven", "pos": "noun", "domain": "cosmological"},
    "caelo": {"translation": "in heaven", "pos": "noun", "domain": "cosmological"},
    "coelum": {"translation": "heaven/sky", "pos": "noun", "domain": "cosmological"},
    "coeli": {"translation": "of heaven", "pos": "noun", "domain": "cosmological"},
    "coelo": {"translation": "in heaven", "pos": "noun", "domain": "cosmological"},

    # terra (earth) - 1st declension
    "terra": {"translation": "earth/land", "pos": "noun", "domain": "physical"},
    "terrae": {"translation": "of earth", "pos": "noun", "domain": "physical"},
    "terram": {"translation": "earth (acc.)", "pos": "noun", "domain": "physical"},
    "terrā": {"translation": "on/by earth", "pos": "noun", "domain": "physical"},
    "terras": {"translation": "lands (acc.)", "pos": "noun", "domain": "physical"},
    "terrarum": {"translation": "of lands", "pos": "noun", "domain": "physical"},

    # aqua (water) - 1st declension
    "aqua": {"translation": "water", "pos": "noun", "domain": "physical"},
    "aquae": {"translation": "of water", "pos": "noun", "domain": "physical"},
    "aquam": {"translation": "water (acc.)", "pos": "noun", "domain": "physical"},
    "aquā": {"translation": "by/with water", "pos": "noun", "domain": "physical"},
    "aquas": {"translation": "waters (acc.)", "pos": "noun", "domain": "physical"},
    "aquarum": {"translation": "of waters", "pos": "noun", "domain": "physical"},

    # ignis (fire) - 3rd declension
    "ignis": {"translation": "fire", "pos": "noun", "domain": "physical"},
    "ignem": {"translation": "fire (acc.)", "pos": "noun", "domain": "physical"},
    "igni": {"translation": "by/with fire", "pos": "noun", "domain": "physical"},
    "igne": {"translation": "by/with fire", "pos": "noun", "domain": "physical"},
    "ignes": {"translation": "fires", "pos": "noun", "domain": "physical"},
    "ignium": {"translation": "of fires", "pos": "noun", "domain": "physical"},

    # tempus (time) - 3rd declension neuter
    "tempus": {"translation": "time", "pos": "noun", "domain": "temporal"},
    "temporis": {"translation": "of time", "pos": "noun", "domain": "temporal"},
    "tempori": {"translation": "to time", "pos": "noun", "domain": "temporal"},
    "tempore": {"translation": "in/at time", "pos": "noun", "domain": "temporal"},
    "tempora": {"translation": "times", "pos": "noun", "domain": "temporal"},
    "temporum": {"translation": "of times", "pos": "noun", "domain": "temporal"},

    # dies (day) - 5th declension
    "dies": {"translation": "day", "pos": "noun", "domain": "temporal"},
    "diei": {"translation": "of the day", "pos": "noun", "domain": "temporal"},
    "diem": {"translation": "day (acc.)", "pos": "noun", "domain": "temporal"},
    "die": {"translation": "on/in the day", "pos": "noun", "domain": "temporal"},
    "dierum": {"translation": "of days", "pos": "noun", "domain": "temporal"},
    "diebus": {"translation": "on/in days", "pos": "noun", "domain": "temporal"},

    # nox (night) - 3rd declension
    "nox": {"translation": "night", "pos": "noun", "domain": "temporal"},
    "noctis": {"translation": "of night", "pos": "noun", "domain": "temporal"},
    "nocti": {"translation": "to night", "pos": "noun", "domain": "temporal"},
    "noctem": {"translation": "night (acc.)", "pos": "noun", "domain": "temporal"},
    "nocte": {"translation": "at night", "pos": "noun", "domain": "temporal"},
    "noctes": {"translation": "nights", "pos": "noun", "domain": "temporal"},
    "noctium": {"translation": "of nights", "pos": "noun", "domain": "temporal"},
    "noctibus": {"translation": "at nights", "pos": "noun", "domain": "temporal"},

    # res (thing) - 5th declension
    "res": {"translation": "thing/matter", "pos": "noun", "domain": "general"},
    "rei": {"translation": "of the thing", "pos": "noun", "domain": "general"},
    "rem": {"translation": "thing (acc.)", "pos": "noun", "domain": "general"},
    "re": {"translation": "in the thing", "pos": "noun", "domain": "general"},
    "rerum": {"translation": "of things", "pos": "noun", "domain": "general"},
    "rebus": {"translation": "to/in things", "pos": "noun", "domain": "general"},

    # via (way) - 1st declension
    "via": {"translation": "way/road", "pos": "noun", "domain": "spatial"},
    "viae": {"translation": "of the way", "pos": "noun", "domain": "spatial"},
    "viam": {"translation": "way (acc.)", "pos": "noun", "domain": "spatial"},
    "viā": {"translation": "by way", "pos": "noun", "domain": "spatial"},
    "vias": {"translation": "ways (acc.)", "pos": "noun", "domain": "spatial"},
    "viarum": {"translation": "of ways", "pos": "noun", "domain": "spatial"},

    # locus (place) - 2nd declension
    "locus": {"translation": "place", "pos": "noun", "domain": "spatial"},
    "loci": {"translation": "of the place", "pos": "noun", "domain": "spatial"},
    "loco": {"translation": "in the place", "pos": "noun", "domain": "spatial"},
    "locum": {"translation": "place (acc.)", "pos": "noun", "domain": "spatial"},
    "loca": {"translation": "places", "pos": "noun", "domain": "spatial"},
    "locorum": {"translation": "of places", "pos": "noun", "domain": "spatial"},
    "locis": {"translation": "in places", "pos": "noun", "domain": "spatial"},

    # pater (father) - 3rd declension
    "pater": {"translation": "father", "pos": "noun", "domain": "familial"},
    "patris": {"translation": "of the father", "pos": "noun", "domain": "familial"},
    "patri": {"translation": "to the father", "pos": "noun", "domain": "familial"},
    "patrem": {"translation": "father (acc.)", "pos": "noun", "domain": "familial"},
    "patre": {"translation": "by the father", "pos": "noun", "domain": "familial"},
    "patres": {"translation": "fathers", "pos": "noun", "domain": "familial"},
    "patrum": {"translation": "of fathers", "pos": "noun", "domain": "familial"},
    "patribus": {"translation": "to fathers", "pos": "noun", "domain": "familial"},

    # mater (mother) - 3rd declension
    "mater": {"translation": "mother", "pos": "noun", "domain": "familial"},
    "matris": {"translation": "of the mother", "pos": "noun", "domain": "familial"},
    "matri": {"translation": "to the mother", "pos": "noun", "domain": "familial"},
    "matrem": {"translation": "mother (acc.)", "pos": "noun", "domain": "familial"},
    "matre": {"translation": "by the mother", "pos": "noun", "domain": "familial"},
    "matres": {"translation": "mothers", "pos": "noun", "domain": "familial"},
    "matrum": {"translation": "of mothers", "pos": "noun", "domain": "familial"},

    # filius (son) - 2nd declension
    "filius": {"translation": "son", "pos": "noun", "domain": "familial"},
    "filii": {"translation": "of the son", "pos": "noun", "domain": "familial"},
    "filio": {"translation": "to the son", "pos": "noun", "domain": "familial"},
    "filium": {"translation": "son (acc.)", "pos": "noun", "domain": "familial"},
    "filiorum": {"translation": "of sons", "pos": "noun", "domain": "familial"},
    "filiis": {"translation": "to sons", "pos": "noun", "domain": "familial"},
    "filios": {"translation": "sons (acc.)", "pos": "noun", "domain": "familial"},

    # frater (brother) - 3rd declension
    "frater": {"translation": "brother", "pos": "noun", "domain": "familial"},
    "fratris": {"translation": "of the brother", "pos": "noun", "domain": "familial"},
    "fratri": {"translation": "to the brother", "pos": "noun", "domain": "familial"},
    "fratrem": {"translation": "brother (acc.)", "pos": "noun", "domain": "familial"},
    "fratre": {"translation": "by the brother", "pos": "noun", "domain": "familial"},
    "fratres": {"translation": "brothers", "pos": "noun", "domain": "familial"},
    "fratrum": {"translation": "of brothers", "pos": "noun", "domain": "familial"},

    # nomen (name) - 3rd declension neuter
    "nomen": {"translation": "name", "pos": "noun", "domain": "general"},
    "nominis": {"translation": "of the name", "pos": "noun", "domain": "general"},
    "nomini": {"translation": "to the name", "pos": "noun", "domain": "general"},
    "nomine": {"translation": "by name", "pos": "noun", "domain": "general"},
    "nomina": {"translation": "names", "pos": "noun", "domain": "general"},
    "nominum": {"translation": "of names", "pos": "noun", "domain": "general"},
    "nominibus": {"translation": "to names", "pos": "noun", "domain": "general"},

    # opus (work) - 3rd declension neuter
    "opus": {"translation": "work", "pos": "noun", "domain": "general"},
    "operis": {"translation": "of the work", "pos": "noun", "domain": "general"},
    "operi": {"translation": "to the work", "pos": "noun", "domain": "general"},
    "opere": {"translation": "by work", "pos": "noun", "domain": "general"},
    "opera": {"translation": "works", "pos": "noun", "domain": "general"},
    "operum": {"translation": "of works", "pos": "noun", "domain": "general"},
    "operibus": {"translation": "to works", "pos": "noun", "domain": "general"},

    # gloria (glory) - 1st declension
    "gloria": {"translation": "glory", "pos": "noun", "domain": "religious"},
    "gloriae": {"translation": "of glory", "pos": "noun", "domain": "religious"},
    "gloriam": {"translation": "glory (acc.)", "pos": "noun", "domain": "religious"},
    "gloriā": {"translation": "by/with glory", "pos": "noun", "domain": "religious"},

    # gratia (grace) - 1st declension
    "gratia": {"translation": "grace/favor", "pos": "noun", "domain": "religious"},
    "gratiae": {"translation": "of grace", "pos": "noun", "domain": "religious"},
    "gratiam": {"translation": "grace (acc.)", "pos": "noun", "domain": "religious"},
    "gratiā": {"translation": "by/with grace", "pos": "noun", "domain": "religious"},

    # spiritus (spirit) - 4th declension
    "spiritus": {"translation": "spirit/breath", "pos": "noun", "domain": "religious"},
    "spiritūs": {"translation": "of spirit", "pos": "noun", "domain": "religious"},
    "spiritui": {"translation": "to spirit", "pos": "noun", "domain": "religious"},
    "spiritum": {"translation": "spirit (acc.)", "pos": "noun", "domain": "religious"},
    "spiritu": {"translation": "by spirit", "pos": "noun", "domain": "religious"},

    # caro (flesh) - 3rd declension
    "caro": {"translation": "flesh/meat", "pos": "noun", "domain": "biological"},
    "carnis": {"translation": "of flesh", "pos": "noun", "domain": "biological"},
    "carni": {"translation": "to flesh", "pos": "noun", "domain": "biological"},
    "carnem": {"translation": "flesh (acc.)", "pos": "noun", "domain": "biological"},
    "carne": {"translation": "by flesh", "pos": "noun", "domain": "biological"},
    "carnes": {"translation": "flesh (pl.)", "pos": "noun", "domain": "biological"},

    # ============================================================================
    # ADDITIONAL NOUNS
    # ============================================================================
    "domus": {"translation": "house/home", "pos": "noun", "domain": "domestic"},
    "domi": {"translation": "at home", "pos": "noun", "domain": "domestic"},
    "domum": {"translation": "home (acc.)", "pos": "noun", "domain": "domestic"},
    "domo": {"translation": "from home", "pos": "noun", "domain": "domestic"},
    "civitas": {"translation": "city/citizenship", "pos": "noun", "domain": "political"},
    "civitatis": {"translation": "of the city", "pos": "noun", "domain": "political"},
    "civitatem": {"translation": "city (acc.)", "pos": "noun", "domain": "political"},
    "civitate": {"translation": "in the city", "pos": "noun", "domain": "political"},
    "rex": {"translation": "king", "pos": "noun", "domain": "political"},
    "regis": {"translation": "of the king", "pos": "noun", "domain": "political"},
    "regi": {"translation": "to the king", "pos": "noun", "domain": "political"},
    "regem": {"translation": "king (acc.)", "pos": "noun", "domain": "political"},
    "rege": {"translation": "by the king", "pos": "noun", "domain": "political"},
    "reges": {"translation": "kings", "pos": "noun", "domain": "political"},
    "regum": {"translation": "of kings", "pos": "noun", "domain": "political"},
    "bonum": {"translation": "good/good thing", "pos": "noun", "domain": "ethical"},
    "boni": {"translation": "of the good", "pos": "noun", "domain": "ethical"},
    "bono": {"translation": "for the good", "pos": "noun", "domain": "ethical"},
    "malum": {"translation": "evil/bad thing", "pos": "noun", "domain": "ethical"},
    "mali": {"translation": "of evil", "pos": "noun", "domain": "ethical"},
    "malo": {"translation": "by evil", "pos": "noun", "domain": "ethical"},
    "amor": {"translation": "love", "pos": "noun", "domain": "emotional"},
    "amoris": {"translation": "of love", "pos": "noun", "domain": "emotional"},
    "amori": {"translation": "to love", "pos": "noun", "domain": "emotional"},
    "amorem": {"translation": "love (acc.)", "pos": "noun", "domain": "emotional"},
    "amore": {"translation": "by love", "pos": "noun", "domain": "emotional"},
    "bellum": {"translation": "war", "pos": "noun", "domain": "military"},
    "belli": {"translation": "of war", "pos": "noun", "domain": "military"},
    "bello": {"translation": "in war", "pos": "noun", "domain": "military"},
    "bella": {"translation": "wars", "pos": "noun", "domain": "military"},
    "bellorum": {"translation": "of wars", "pos": "noun", "domain": "military"},
    "pax": {"translation": "peace", "pos": "noun", "domain": "political"},
    "pacis": {"translation": "of peace", "pos": "noun", "domain": "political"},
    "paci": {"translation": "to peace", "pos": "noun", "domain": "political"},
    "pacem": {"translation": "peace (acc.)", "pos": "noun", "domain": "political"},
    "pace": {"translation": "in peace", "pos": "noun", "domain": "political"},
    "lex": {"translation": "law", "pos": "noun", "domain": "legal"},
    "legis": {"translation": "of law", "pos": "noun", "domain": "legal"},
    "legi": {"translation": "to law", "pos": "noun", "domain": "legal"},
    "legem": {"translation": "law (acc.)", "pos": "noun", "domain": "legal"},
    "lege": {"translation": "by law", "pos": "noun", "domain": "legal"},
    "leges": {"translation": "laws", "pos": "noun", "domain": "legal"},
    "legum": {"translation": "of laws", "pos": "noun", "domain": "legal"},
    "iustitia": {"translation": "justice", "pos": "noun", "domain": "ethical"},
    "iustitiae": {"translation": "of justice", "pos": "noun", "domain": "ethical"},
    "iustitiam": {"translation": "justice (acc.)", "pos": "noun", "domain": "ethical"},
    "liber": {"translation": "book", "pos": "noun", "domain": "literary"},
    "libri": {"translation": "of the book", "pos": "noun", "domain": "literary"},
    "libro": {"translation": "in the book", "pos": "noun", "domain": "literary"},
    "librum": {"translation": "book (acc.)", "pos": "noun", "domain": "literary"},
    "libros": {"translation": "books (acc.)", "pos": "noun", "domain": "literary"},
    "librorum": {"translation": "of books", "pos": "noun", "domain": "literary"},
    "ars": {"translation": "art/skill", "pos": "noun", "domain": "cultural"},
    "artis": {"translation": "of art", "pos": "noun", "domain": "cultural"},
    "arti": {"translation": "to art", "pos": "noun", "domain": "cultural"},
    "artem": {"translation": "art (acc.)", "pos": "noun", "domain": "cultural"},
    "arte": {"translation": "by art", "pos": "noun", "domain": "cultural"},
    "artes": {"translation": "arts", "pos": "noun", "domain": "cultural"},
    "artium": {"translation": "of arts", "pos": "noun", "domain": "cultural"},
    "philosophia": {"translation": "philosophy", "pos": "noun", "domain": "philosophical"},
    "philosophiae": {"translation": "of philosophy", "pos": "noun", "domain": "philosophical"},
    "philosophiam": {"translation": "philosophy (acc.)", "pos": "noun", "domain": "philosophical"},

    # ============================================================================
    # ADJECTIVES WITH FORMS
    # ============================================================================
    "bonus": {"translation": "good", "pos": "adjective", "domain": "ethical"},
    "bona": {"translation": "good (fem./neut.pl.)", "pos": "adjective", "domain": "ethical"},
    "bonam": {"translation": "good (fem. acc.)", "pos": "adjective", "domain": "ethical"},
    "bonae": {"translation": "good (fem. gen./dat.)", "pos": "adjective", "domain": "ethical"},
    "bonum": {"translation": "good (neut./masc. acc.)", "pos": "adjective", "domain": "ethical"},
    "malus": {"translation": "bad/evil", "pos": "adjective", "domain": "ethical"},
    "mala": {"translation": "bad (fem./neut.pl.)", "pos": "adjective", "domain": "ethical"},
    "malum": {"translation": "bad (neut./masc. acc.)", "pos": "adjective", "domain": "ethical"},
    "magnus": {"translation": "great/large", "pos": "adjective", "domain": "general"},
    "magna": {"translation": "great (fem./neut.pl.)", "pos": "adjective", "domain": "general"},
    "magnum": {"translation": "great (neut./masc. acc.)", "pos": "adjective", "domain": "general"},
    "magni": {"translation": "great (gen./nom.pl.)", "pos": "adjective", "domain": "general"},
    "magno": {"translation": "great (dat./abl.)", "pos": "adjective", "domain": "general"},
    "magnam": {"translation": "great (fem. acc.)", "pos": "adjective", "domain": "general"},
    "parvus": {"translation": "small", "pos": "adjective", "domain": "general"},
    "parva": {"translation": "small (fem./neut.pl.)", "pos": "adjective", "domain": "general"},
    "parvum": {"translation": "small (neut./masc. acc.)", "pos": "adjective", "domain": "general"},
    "multus": {"translation": "much/many", "pos": "adjective", "domain": "general"},
    "multa": {"translation": "many (fem./neut.pl.)", "pos": "adjective", "domain": "general"},
    "multum": {"translation": "much (neut.)", "pos": "adjective", "domain": "general"},
    "multi": {"translation": "many (masc.pl.)", "pos": "adjective", "domain": "general"},
    "multae": {"translation": "many (fem.pl.)", "pos": "adjective", "domain": "general"},
    "multorum": {"translation": "of many", "pos": "adjective", "domain": "general"},
    "multos": {"translation": "many (masc. acc.)", "pos": "adjective", "domain": "general"},
    "omnis": {"translation": "all/every", "pos": "adjective", "domain": "general"},
    "omne": {"translation": "all (neut.)", "pos": "adjective", "domain": "general"},
    "omnem": {"translation": "all (acc.)", "pos": "adjective", "domain": "general"},
    "omnes": {"translation": "all (pl.)", "pos": "adjective", "domain": "general"},
    "omnia": {"translation": "all things", "pos": "adjective", "domain": "general"},
    "omnium": {"translation": "of all", "pos": "adjective", "domain": "general"},
    "omnibus": {"translation": "to all", "pos": "adjective", "domain": "general"},
    "verus": {"translation": "true", "pos": "adjective", "domain": "epistemological"},
    "vera": {"translation": "true (fem./neut.pl.)", "pos": "adjective", "domain": "epistemological"},
    "verum": {"translation": "true (neut.)/truth", "pos": "adjective", "domain": "epistemological"},
    "veri": {"translation": "of truth", "pos": "adjective", "domain": "epistemological"},
    "vero": {"translation": "truly/indeed", "pos": "adverb", "domain": "connective"},
    "primus": {"translation": "first", "pos": "adjective", "domain": "ordinal"},
    "prima": {"translation": "first (fem./neut.pl.)", "pos": "adjective", "domain": "ordinal"},
    "primum": {"translation": "first (neut.)/first of all", "pos": "adjective", "domain": "ordinal"},
    "primo": {"translation": "at first", "pos": "adverb", "domain": "ordinal"},
    "secundus": {"translation": "second", "pos": "adjective", "domain": "ordinal"},
    "secunda": {"translation": "second (fem.)", "pos": "adjective", "domain": "ordinal"},
    "secundum": {"translation": "second (neut.)/according to", "pos": "preposition", "domain": "ordinal"},
    "tertius": {"translation": "third", "pos": "adjective", "domain": "ordinal"},
    "tertia": {"translation": "third (fem.)", "pos": "adjective", "domain": "ordinal"},
    "tertium": {"translation": "third (neut.)", "pos": "adjective", "domain": "ordinal"},
    "alius": {"translation": "other/another", "pos": "adjective", "domain": "general"},
    "alia": {"translation": "other (fem.)", "pos": "adjective", "domain": "general"},
    "aliud": {"translation": "other (neut.)", "pos": "adjective", "domain": "general"},
    "alii": {"translation": "others", "pos": "adjective", "domain": "general"},
    "aliorum": {"translation": "of others", "pos": "adjective", "domain": "general"},
    "solus": {"translation": "alone/only", "pos": "adjective", "domain": "general"},
    "sola": {"translation": "alone (fem.)", "pos": "adjective", "domain": "general"},
    "solum": {"translation": "alone (neut.)/only", "pos": "adjective", "domain": "general"},
    "nullus": {"translation": "none/no", "pos": "adjective", "domain": "negation"},
    "nulla": {"translation": "no (fem.)", "pos": "adjective", "domain": "negation"},
    "nullum": {"translation": "no (neut.)", "pos": "adjective", "domain": "negation"},
    "summum": {"translation": "highest/greatest", "pos": "adjective", "domain": "superlative"},
    "summus": {"translation": "highest", "pos": "adjective", "domain": "superlative"},
    "summa": {"translation": "highest (fem.)/sum", "pos": "adjective", "domain": "superlative"},
    "novus": {"translation": "new", "pos": "adjective", "domain": "general"},
    "nova": {"translation": "new (fem./neut.pl.)", "pos": "adjective", "domain": "general"},
    "novum": {"translation": "new (neut.)", "pos": "adjective", "domain": "general"},
    "unus": {"translation": "one", "pos": "numeral", "domain": "numerical"},
    "una": {"translation": "one (fem.)", "pos": "numeral", "domain": "numerical"},
    "unum": {"translation": "one (neut.)", "pos": "numeral", "domain": "numerical"},
    "duo": {"translation": "two", "pos": "numeral", "domain": "numerical"},
    "duae": {"translation": "two (fem.)", "pos": "numeral", "domain": "numerical"},
    "tres": {"translation": "three", "pos": "numeral", "domain": "numerical"},
    "tria": {"translation": "three (neut.)", "pos": "numeral", "domain": "numerical"},

    # ============================================================================
    # PRONOUNS WITH FULL DECLENSIONS
    # ============================================================================
    # Personal pronouns
    "ego": {"translation": "I", "pos": "pronoun", "domain": "personal"},
    "mei": {"translation": "of me", "pos": "pronoun", "domain": "personal"},
    "mihi": {"translation": "to me", "pos": "pronoun", "domain": "personal"},
    "me": {"translation": "me", "pos": "pronoun", "domain": "personal"},
    "tu": {"translation": "you", "pos": "pronoun", "domain": "personal"},
    "tui": {"translation": "of you", "pos": "pronoun", "domain": "personal"},
    "tibi": {"translation": "to you", "pos": "pronoun", "domain": "personal"},
    "te": {"translation": "you (acc./abl.)", "pos": "pronoun", "domain": "personal"},
    "nos": {"translation": "we", "pos": "pronoun", "domain": "personal"},
    "nostri": {"translation": "of us", "pos": "pronoun", "domain": "personal"},
    "nostrum": {"translation": "of us (partitive)", "pos": "pronoun", "domain": "personal"},
    "nobis": {"translation": "to/for us", "pos": "pronoun", "domain": "personal"},
    "vos": {"translation": "you (pl.)", "pos": "pronoun", "domain": "personal"},
    "vestri": {"translation": "of you (pl.)", "pos": "pronoun", "domain": "personal"},
    "vestrum": {"translation": "of you (pl., partitive)", "pos": "pronoun", "domain": "personal"},
    "vobis": {"translation": "to/for you (pl.)", "pos": "pronoun", "domain": "personal"},

    # Demonstrative pronouns - is, ea, id
    "is": {"translation": "he/it/this", "pos": "pronoun", "domain": "demonstrative"},
    "ea": {"translation": "she/it/this", "pos": "pronoun", "domain": "demonstrative"},
    "id": {"translation": "it/this", "pos": "pronoun", "domain": "demonstrative"},
    "eius": {"translation": "of him/her/it/his/her/its", "pos": "pronoun", "domain": "demonstrative"},
    "ei": {"translation": "to him/her/it", "pos": "pronoun", "domain": "demonstrative"},
    "eum": {"translation": "him/it", "pos": "pronoun", "domain": "demonstrative"},
    "eam": {"translation": "her/it", "pos": "pronoun", "domain": "demonstrative"},
    "eo": {"translation": "by him/it", "pos": "pronoun", "domain": "demonstrative"},
    "eā": {"translation": "by her/it", "pos": "pronoun", "domain": "demonstrative"},
    "ii": {"translation": "they (masc.)", "pos": "pronoun", "domain": "demonstrative"},
    "eae": {"translation": "they (fem.)", "pos": "pronoun", "domain": "demonstrative"},
    "eorum": {"translation": "of them (masc./neut.)", "pos": "pronoun", "domain": "demonstrative"},
    "earum": {"translation": "of them (fem.)", "pos": "pronoun", "domain": "demonstrative"},
    "eis": {"translation": "to them", "pos": "pronoun", "domain": "demonstrative"},
    "iis": {"translation": "to them", "pos": "pronoun", "domain": "demonstrative"},
    "eos": {"translation": "them (masc.)", "pos": "pronoun", "domain": "demonstrative"},
    "eas": {"translation": "them (fem.)", "pos": "pronoun", "domain": "demonstrative"},

    # Demonstrative pronouns - hic, haec, hoc
    "hic": {"translation": "this/he", "pos": "pronoun", "domain": "demonstrative"},
    "haec": {"translation": "this/she/these", "pos": "pronoun", "domain": "demonstrative"},
    "hoc": {"translation": "this", "pos": "pronoun", "domain": "demonstrative"},
    "huius": {"translation": "of this", "pos": "pronoun", "domain": "demonstrative"},
    "huic": {"translation": "to this", "pos": "pronoun", "domain": "demonstrative"},
    "hunc": {"translation": "this (masc. acc.)", "pos": "pronoun", "domain": "demonstrative"},
    "hanc": {"translation": "this (fem. acc.)", "pos": "pronoun", "domain": "demonstrative"},
    "hi": {"translation": "these (masc.)", "pos": "pronoun", "domain": "demonstrative"},
    "hae": {"translation": "these (fem.)", "pos": "pronoun", "domain": "demonstrative"},
    "horum": {"translation": "of these (masc./neut.)", "pos": "pronoun", "domain": "demonstrative"},
    "harum": {"translation": "of these (fem.)", "pos": "pronoun", "domain": "demonstrative"},
    "his": {"translation": "to these", "pos": "pronoun", "domain": "demonstrative"},
    "hos": {"translation": "these (masc. acc.)", "pos": "pronoun", "domain": "demonstrative"},
    "has": {"translation": "these (fem. acc.)", "pos": "pronoun", "domain": "demonstrative"},

    # Demonstrative pronouns - ille, illa, illud
    "ille": {"translation": "that/he", "pos": "pronoun", "domain": "demonstrative"},
    "illa": {"translation": "that/she", "pos": "pronoun", "domain": "demonstrative"},
    "illud": {"translation": "that (neut.)", "pos": "pronoun", "domain": "demonstrative"},
    "illius": {"translation": "of that", "pos": "pronoun", "domain": "demonstrative"},
    "illi": {"translation": "to that/those", "pos": "pronoun", "domain": "demonstrative"},
    "illum": {"translation": "that (masc. acc.)", "pos": "pronoun", "domain": "demonstrative"},
    "illam": {"translation": "that (fem. acc.)", "pos": "pronoun", "domain": "demonstrative"},
    "illo": {"translation": "by that (masc./neut.)", "pos": "pronoun", "domain": "demonstrative"},
    "illā": {"translation": "by that (fem.)", "pos": "pronoun", "domain": "demonstrative"},
    "illorum": {"translation": "of those (masc./neut.)", "pos": "pronoun", "domain": "demonstrative"},
    "illarum": {"translation": "of those (fem.)", "pos": "pronoun", "domain": "demonstrative"},
    "illis": {"translation": "to those", "pos": "pronoun", "domain": "demonstrative"},
    "illos": {"translation": "those (masc. acc.)", "pos": "pronoun", "domain": "demonstrative"},
    "illas": {"translation": "those (fem. acc.)", "pos": "pronoun", "domain": "demonstrative"},

    # Relative pronouns
    "qui": {"translation": "who/which", "pos": "pronoun", "domain": "relative"},
    "quae": {"translation": "who/which (fem./neut.pl.)", "pos": "pronoun", "domain": "relative"},
    "quod": {"translation": "which/that", "pos": "pronoun", "domain": "relative"},
    "cuius": {"translation": "whose/of which", "pos": "pronoun", "domain": "relative"},
    "cui": {"translation": "to whom/which", "pos": "pronoun", "domain": "relative"},
    "quem": {"translation": "whom/which (masc. acc.)", "pos": "pronoun", "domain": "relative"},
    "quam": {"translation": "whom/which (fem. acc.)", "pos": "pronoun", "domain": "relative"},
    "quo": {"translation": "by whom/which", "pos": "pronoun", "domain": "relative"},
    "quā": {"translation": "by which (fem.)/where", "pos": "pronoun", "domain": "relative"},
    "quorum": {"translation": "whose/of which (masc./neut.pl.)", "pos": "pronoun", "domain": "relative"},
    "quarum": {"translation": "whose/of which (fem.pl.)", "pos": "pronoun", "domain": "relative"},
    "quibus": {"translation": "to whom/which (pl.)", "pos": "pronoun", "domain": "relative"},
    "quos": {"translation": "whom/which (masc. acc. pl.)", "pos": "pronoun", "domain": "relative"},
    "quas": {"translation": "whom/which (fem. acc. pl.)", "pos": "pronoun", "domain": "relative"},

    # Interrogative pronouns
    "quis": {"translation": "who?", "pos": "pronoun", "domain": "interrogative"},
    "quid": {"translation": "what?", "pos": "pronoun", "domain": "interrogative"},

    # Intensive/reflexive pronouns
    "ipse": {"translation": "himself/itself/the very", "pos": "pronoun", "domain": "intensive"},
    "ipsa": {"translation": "herself/the very (fem.)", "pos": "pronoun", "domain": "intensive"},
    "ipsum": {"translation": "itself/the very (neut.)", "pos": "pronoun", "domain": "intensive"},
    "ipsius": {"translation": "of himself/itself", "pos": "pronoun", "domain": "intensive"},
    "ipsi": {"translation": "to himself/themselves", "pos": "pronoun", "domain": "intensive"},
    "ipso": {"translation": "by himself/itself", "pos": "pronoun", "domain": "intensive"},
    "se": {"translation": "himself/herself/itself/themselves", "pos": "pronoun", "domain": "reflexive"},
    "sui": {"translation": "of himself/herself/itself/themselves", "pos": "pronoun", "domain": "reflexive"},
    "sibi": {"translation": "to himself/herself/itself/themselves", "pos": "pronoun", "domain": "reflexive"},
    "sese": {"translation": "himself/herself/themselves (emphatic)", "pos": "pronoun", "domain": "reflexive"},

    # ============================================================================
    # CONJUNCTIONS AND PARTICLES
    # ============================================================================
    "et": {"translation": "and", "pos": "conjunction", "domain": "connective"},
    "sed": {"translation": "but", "pos": "conjunction", "domain": "connective"},
    "aut": {"translation": "or", "pos": "conjunction", "domain": "connective"},
    "vel": {"translation": "or", "pos": "conjunction", "domain": "connective"},
    "nam": {"translation": "for", "pos": "conjunction", "domain": "connective"},
    "enim": {"translation": "for/indeed", "pos": "particle", "domain": "connective"},
    "ergo": {"translation": "therefore", "pos": "conjunction", "domain": "connective"},
    "igitur": {"translation": "therefore", "pos": "conjunction", "domain": "connective"},
    "autem": {"translation": "however/but", "pos": "conjunction", "domain": "connective"},
    "tamen": {"translation": "however/nevertheless", "pos": "conjunction", "domain": "connective"},
    "si": {"translation": "if", "pos": "conjunction", "domain": "conditional"},
    "nisi": {"translation": "unless/if not", "pos": "conjunction", "domain": "conditional"},
    "cum": {"translation": "when/with/since", "pos": "conjunction", "domain": "temporal"},
    "dum": {"translation": "while/until", "pos": "conjunction", "domain": "temporal"},
    "donec": {"translation": "until", "pos": "conjunction", "domain": "temporal"},
    "quod": {"translation": "because/that", "pos": "conjunction", "domain": "connective"},
    "quia": {"translation": "because", "pos": "conjunction", "domain": "causal"},
    "quoniam": {"translation": "since/because", "pos": "conjunction", "domain": "causal"},
    "ut": {"translation": "that/so that/as", "pos": "conjunction", "domain": "connective"},
    "ne": {"translation": "that...not/lest", "pos": "conjunction", "domain": "connective"},
    "atque": {"translation": "and/and also", "pos": "conjunction", "domain": "connective"},
    "ac": {"translation": "and", "pos": "conjunction", "domain": "connective"},
    "que": {"translation": "and (enclitic)", "pos": "conjunction", "domain": "connective"},
    "neque": {"translation": "and not/nor", "pos": "conjunction", "domain": "connective"},
    "nec": {"translation": "and not/nor", "pos": "conjunction", "domain": "connective"},
    "sive": {"translation": "or if/whether", "pos": "conjunction", "domain": "connective"},
    "seu": {"translation": "or if/whether", "pos": "conjunction", "domain": "connective"},
    "an": {"translation": "or (in questions)", "pos": "conjunction", "domain": "interrogative"},
    "num": {"translation": "whether (expects no)", "pos": "particle", "domain": "interrogative"},
    "nonne": {"translation": "isn't it? (expects yes)", "pos": "particle", "domain": "interrogative"},

    # ============================================================================
    # NEGATIONS
    # ============================================================================
    "non": {"translation": "not", "pos": "adverb", "domain": "negation"},
    "haud": {"translation": "not", "pos": "adverb", "domain": "negation"},
    "numquam": {"translation": "never", "pos": "adverb", "domain": "negation"},
    "nihil": {"translation": "nothing", "pos": "pronoun", "domain": "negation"},
    "nil": {"translation": "nothing", "pos": "pronoun", "domain": "negation"},
    "nemo": {"translation": "no one", "pos": "pronoun", "domain": "negation"},
    "neminis": {"translation": "of no one", "pos": "pronoun", "domain": "negation"},
    "nemini": {"translation": "to no one", "pos": "pronoun", "domain": "negation"},
    "neminem": {"translation": "no one (acc.)", "pos": "pronoun", "domain": "negation"},

    # ============================================================================
    # PREPOSITIONS
    # ============================================================================
    "in": {"translation": "in/into", "pos": "preposition", "domain": "spatial"},
    "ad": {"translation": "to/toward", "pos": "preposition", "domain": "spatial"},
    "ex": {"translation": "out of/from", "pos": "preposition", "domain": "spatial"},
    "e": {"translation": "out of/from", "pos": "preposition", "domain": "spatial"},
    "de": {"translation": "from/about/concerning", "pos": "preposition", "domain": "spatial"},
    "ab": {"translation": "from/by", "pos": "preposition", "domain": "spatial"},
    "a": {"translation": "from/by", "pos": "preposition", "domain": "spatial"},
    "per": {"translation": "through", "pos": "preposition", "domain": "spatial"},
    "pro": {"translation": "for/in front of/on behalf of", "pos": "preposition", "domain": "spatial"},
    "sub": {"translation": "under", "pos": "preposition", "domain": "spatial"},
    "super": {"translation": "above/over", "pos": "preposition", "domain": "spatial"},
    "inter": {"translation": "between/among", "pos": "preposition", "domain": "spatial"},
    "ante": {"translation": "before", "pos": "preposition", "domain": "temporal"},
    "post": {"translation": "after", "pos": "preposition", "domain": "temporal"},
    "propter": {"translation": "because of", "pos": "preposition", "domain": "causal"},
    "ob": {"translation": "because of/on account of", "pos": "preposition", "domain": "causal"},
    "contra": {"translation": "against", "pos": "preposition", "domain": "opposition"},
    "sine": {"translation": "without", "pos": "preposition", "domain": "absence"},
    "apud": {"translation": "at/near/with", "pos": "preposition", "domain": "spatial"},
    "trans": {"translation": "across", "pos": "preposition", "domain": "spatial"},
    "circum": {"translation": "around", "pos": "preposition", "domain": "spatial"},
    "coram": {"translation": "in the presence of", "pos": "preposition", "domain": "spatial"},

    # ============================================================================
    # QUESTION WORDS AND ADVERBS
    # ============================================================================
    "cur": {"translation": "why?", "pos": "adverb", "domain": "interrogative"},
    "quare": {"translation": "why?/wherefore", "pos": "adverb", "domain": "interrogative"},
    "quomodo": {"translation": "how?", "pos": "adverb", "domain": "interrogative"},
    "ubi": {"translation": "where?", "pos": "adverb", "domain": "interrogative"},
    "quo": {"translation": "to where?/whither", "pos": "adverb", "domain": "interrogative"},
    "unde": {"translation": "from where?/whence", "pos": "adverb", "domain": "interrogative"},
    "quando": {"translation": "when?", "pos": "adverb", "domain": "interrogative"},

    # Time adverbs
    "iam": {"translation": "now/already", "pos": "adverb", "domain": "temporal"},
    "nunc": {"translation": "now", "pos": "adverb", "domain": "temporal"},
    "tum": {"translation": "then", "pos": "adverb", "domain": "temporal"},
    "tunc": {"translation": "then", "pos": "adverb", "domain": "temporal"},
    "semper": {"translation": "always", "pos": "adverb", "domain": "temporal"},
    "saepe": {"translation": "often", "pos": "adverb", "domain": "temporal"},
    "umquam": {"translation": "ever", "pos": "adverb", "domain": "temporal"},
    "olim": {"translation": "once/formerly", "pos": "adverb", "domain": "temporal"},
    "mox": {"translation": "soon", "pos": "adverb", "domain": "temporal"},
    "statim": {"translation": "immediately", "pos": "adverb", "domain": "temporal"},
    "iterum": {"translation": "again", "pos": "adverb", "domain": "temporal"},
    "adhuc": {"translation": "still/yet", "pos": "adverb", "domain": "temporal"},
    "deinde": {"translation": "then/next", "pos": "adverb", "domain": "temporal"},
    "postea": {"translation": "afterwards", "pos": "adverb", "domain": "temporal"},
    "antea": {"translation": "before/previously", "pos": "adverb", "domain": "temporal"},
    "hodie": {"translation": "today", "pos": "adverb", "domain": "temporal"},
    "heri": {"translation": "yesterday", "pos": "adverb", "domain": "temporal"},
    "cras": {"translation": "tomorrow", "pos": "adverb", "domain": "temporal"},

    # Manner adverbs
    "bene": {"translation": "well", "pos": "adverb", "domain": "manner"},
    "male": {"translation": "badly", "pos": "adverb", "domain": "manner"},
    "sic": {"translation": "thus/so", "pos": "adverb", "domain": "manner"},
    "ita": {"translation": "thus/so", "pos": "adverb", "domain": "manner"},
    "valde": {"translation": "very/greatly", "pos": "adverb", "domain": "degree"},
    "maxime": {"translation": "most/especially", "pos": "adverb", "domain": "degree"},
    "magis": {"translation": "more", "pos": "adverb", "domain": "degree"},
    "minus": {"translation": "less", "pos": "adverb", "domain": "degree"},
    "parum": {"translation": "too little", "pos": "adverb", "domain": "degree"},
    "nimis": {"translation": "too much", "pos": "adverb", "domain": "degree"},
    "tantum": {"translation": "only/so much", "pos": "adverb", "domain": "degree"},
    "quantum": {"translation": "how much/as much", "pos": "adverb", "domain": "degree"},
    "tam": {"translation": "so/such", "pos": "adverb", "domain": "degree"},
    "quam": {"translation": "how/as/than", "pos": "adverb", "domain": "degree"},
    "fere": {"translation": "almost/nearly", "pos": "adverb", "domain": "degree"},
    "paene": {"translation": "almost", "pos": "adverb", "domain": "degree"},
    "etiam": {"translation": "also/even", "pos": "adverb", "domain": "additive"},
    "quoque": {"translation": "also/too", "pos": "adverb", "domain": "additive"},
    "quidem": {"translation": "indeed/at least", "pos": "particle", "domain": "emphatic"},
    "certe": {"translation": "certainly", "pos": "adverb", "domain": "emphatic"},
    "profecto": {"translation": "certainly/indeed", "pos": "adverb", "domain": "emphatic"},
    "sane": {"translation": "surely/indeed", "pos": "adverb", "domain": "emphatic"},
    "fortasse": {"translation": "perhaps", "pos": "adverb", "domain": "modal"},
    "forte": {"translation": "by chance/perhaps", "pos": "adverb", "domain": "modal"},

    # Place adverbs
    "hic": {"translation": "here", "pos": "adverb", "domain": "spatial"},
    "ibi": {"translation": "there", "pos": "adverb", "domain": "spatial"},
    "illic": {"translation": "there (yonder)", "pos": "adverb", "domain": "spatial"},
    "huc": {"translation": "to here/hither", "pos": "adverb", "domain": "spatial"},
    "eo": {"translation": "to there/thither", "pos": "adverb", "domain": "spatial"},
    "hinc": {"translation": "from here/hence", "pos": "adverb", "domain": "spatial"},
    "inde": {"translation": "from there/thence", "pos": "adverb", "domain": "spatial"},
    "ubique": {"translation": "everywhere", "pos": "adverb", "domain": "spatial"},
    "usque": {"translation": "all the way/continuously", "pos": "adverb", "domain": "spatial"},
}


# ============================================================================
# PYDANTIC MODELS
# ============================================================================

class TranslateRequest(BaseModel):
    text: str
    source_language: Optional[str] = None  # Auto-detect if not provided
    style: Optional[str] = 'scholarly'
    include_parsing: Optional[bool] = True
    context: Optional[str] = None


class TokenAnalysis(BaseModel):
    token: str
    lemma: Optional[str] = None
    translation: Optional[str] = None
    part_of_speech: Optional[str] = None
    morphology: Optional[Dict[str, str]] = None
    confidence: Optional[float] = None
    semantic_domain: Optional[str] = None


class TranslateResponse(BaseModel):
    source_text: str
    source_language: str
    style: str
    translation: str
    tokens: List[TokenAnalysis]
    provenance: List[Dict[str, Any]]
    fidelity_score: Optional[float] = None
    latency_ms: int


# ============================================================================
# DATABASE CONNECTION
# ============================================================================

async def get_pool():
    """Get or create database connection pool."""
    global _pool
    if _pool is None:
        try:
            _pool = await asyncpg.create_pool(
                DATABASE_URL,
                ssl=False,
                min_size=2,
                max_size=10,
                command_timeout=15
            )
        except Exception as e:
            logger.warning(f"Database connection failed: {e}. Using embedded lexicon only.")
            _pool = "UNAVAILABLE"
    return _pool


# ============================================================================
# TEXT PROCESSING UTILITIES
# ============================================================================

def detect_language(text: str) -> str:
    """Auto-detect whether text is Greek or Latin."""
    greek_chars = len(GREEK_PATTERN.findall(text))
    latin_chars = len(LATIN_PATTERN.findall(text))

    if greek_chars > latin_chars:
        return 'greek'
    elif latin_chars > 0:
        return 'latin'
    else:
        return 'greek'  # Default to Greek for classical texts


def normalize_text(text: str) -> str:
    """Normalize Unicode text for consistent processing."""
    return unicodedata.normalize('NFC', text.strip())


def strip_accents_greek(text: str) -> str:
    """Strip accents from Greek text for fuzzy matching."""
    # Decompose and remove combining diacritical marks
    decomposed = unicodedata.normalize('NFD', text)
    stripped = ''.join(c for c in decomposed if unicodedata.category(c) != 'Mn')
    return stripped.lower()


def tokenize(text: str) -> List[str]:
    """Tokenize Greek/Latin text into words."""
    # Remove punctuation but keep apostrophes and breathing marks
    text = re.sub(r'[.,;:!?\[\](){}—–\-\"\'»«·]', ' ', text)
    tokens = text.split()
    return [t.strip() for t in tokens if t.strip()]


# ============================================================================
# TRANSLATION LOOKUP FUNCTIONS
# ============================================================================

async def lookup_translation_memory(pool, tokens: List[str], source_lang: str) -> Dict[str, Dict]:
    """Look up tokens in translation memory database."""
    if pool == "UNAVAILABLE" or not tokens:
        return {}

    try:
        normalized_tokens = [t.lower() for t in tokens]
        lang_code = 'greek' if source_lang == 'greek' else 'latin'

        async with pool.acquire() as conn:
            rows = await conn.fetch("""
                SELECT source_lemma, target_translation, confidence, frequency,
                       semantic_domain, morphological_context
                FROM translation_memory_lexeme
                WHERE LOWER(source_lemma) = ANY($1) AND source_language = $2
                ORDER BY frequency DESC, confidence DESC
            """, normalized_tokens, lang_code)

            results = {}
            for row in rows:
                lemma = row['source_lemma'].lower()
                if lemma not in results:
                    results[lemma] = {
                        'translation': row['target_translation'],
                        'confidence': row['confidence'] or 0.7,
                        'frequency': row['frequency'] or 1,
                        'semantic_domain': row['semantic_domain'],
                        'pos': row['morphological_context']
                    }
            return results

    except Exception as e:
        logger.warning(f"Translation memory lookup failed: {e}")
        return {}


def lookup_embedded_lexicon(tokens: List[str], source_lang: str) -> Dict[str, Dict]:
    """Look up tokens in the embedded lexicon (fallback)."""
    lexicon = GREEK_LEXICON if source_lang == 'greek' else LATIN_LEXICON
    results = {}

    for token in tokens:
        token_lower = token.lower()

        # Direct lookup
        if token_lower in lexicon:
            entry = lexicon[token_lower]
            results[token_lower] = {
                'translation': entry['translation'],
                'confidence': 0.85,
                'pos': entry.get('pos'),
                'semantic_domain': entry.get('domain')
            }
        else:
            # Try without accents for Greek
            if source_lang == 'greek':
                stripped = strip_accents_greek(token_lower)
                for lex_word, entry in lexicon.items():
                    if strip_accents_greek(lex_word) == stripped:
                        results[token_lower] = {
                            'translation': entry['translation'],
                            'confidence': 0.75,
                            'pos': entry.get('pos'),
                            'semantic_domain': entry.get('domain')
                        }
                        break

    return results


# ============================================================================
# TRANSLATION ASSEMBLY
# ============================================================================

def assemble_translation(tokens: List[str], translations: Dict[str, Dict], style: str) -> str:
    """Assemble final translation from token-level translations."""
    translated_parts = []

    for token in tokens:
        token_lower = token.lower()

        if token_lower in translations:
            trans = translations[token_lower]['translation']
            # For multiple meanings separated by /, pick the first for readability
            if '/' in trans and style in ['accessible', 'literary']:
                trans = trans.split('/')[0]
            translated_parts.append(trans)
        else:
            # Keep untranslated tokens marked
            translated_parts.append(f"[{token}]")

    translation = ' '.join(translated_parts)

    # Post-processing based on style
    if style == 'literary':
        translation = translation.replace(' ,', ',').replace(' .', '.')
        translation = re.sub(r'\s+', ' ', translation)
        if translation:
            translation = translation[0].upper() + translation[1:]
    elif style == 'accessible':
        translation = translation.replace('[', '(').replace(']', ')')
        translation = re.sub(r'\s+', ' ', translation)
    elif style == 'scholarly':
        # Preserve structure
        pass
    elif style == 'literal':
        # Keep everything including brackets
        pass

    return translation.strip()


# ============================================================================
# API ENDPOINT
# ============================================================================

@router.post("")
async def translate_passage(request: TranslateRequest) -> TranslateResponse:
    """
    Translate a Greek or Latin passage with morphological analysis.

    Uses multi-tiered lookup:
    1. Database translation memory (if available)
    2. Embedded comprehensive lexicon (fallback)
    3. Token marking for unknown words
    """
    start_time = time.time()

    text = normalize_text(request.text)
    if not text:
        raise HTTPException(400, "Text is required")

    style = request.style or 'scholarly'
    if style not in VALID_STYLES:
        raise HTTPException(400, f"Invalid style. Must be one of: {', '.join(VALID_STYLES)}")

    # Detect or validate language
    source_language = request.source_language
    if source_language:
        source_language = source_language.lower()
        if source_language in ['grc', 'ancient greek', 'gr']:
            source_language = 'greek'
        elif source_language in ['lat', 'la']:
            source_language = 'latin'
    else:
        source_language = detect_language(text)

    if source_language not in ['greek', 'latin']:
        raise HTTPException(400, "Invalid language. Must be 'greek' or 'latin'")

    # Tokenize
    tokens = tokenize(text)
    if not tokens:
        raise HTTPException(400, "No valid tokens found in text")

    provenance = []
    all_translations = {}

    # Tier 1: Embedded lexicon lookup FIRST (high quality, curated)
    lexicon_results = lookup_embedded_lexicon(tokens, source_language)
    all_translations.update(lexicon_results)
    provenance.append({
        'source': 'embedded_lexicon',
        'matches': len(lexicon_results),
        'total_tokens': len(tokens)
    })

    # Tier 2: Database lookup for remaining tokens only
    unmatched = [t for t in tokens if t.lower() not in all_translations]
    if unmatched:
        pool = await get_pool()
        if pool != "UNAVAILABLE":
            db_results = await lookup_translation_memory(pool, unmatched, source_language)
            all_translations.update(db_results)
            provenance.append({
                'source': 'translation_memory_db',
                'matches': len(db_results),
                'tokens_checked': len(unmatched)
            })

    # Build token analysis
    token_analyses = []
    for token in tokens:
        token_lower = token.lower()
        analysis = TokenAnalysis(token=token)

        if token_lower in all_translations:
            trans = all_translations[token_lower]
            analysis.translation = trans.get('translation')
            analysis.confidence = trans.get('confidence')
            analysis.semantic_domain = trans.get('semantic_domain')
            analysis.part_of_speech = trans.get('pos')
            # Set lemma to the matched form
            analysis.lemma = token_lower

        token_analyses.append(analysis)

    # Assemble translation
    translation = assemble_translation(tokens, all_translations, style)

    # Calculate fidelity score
    matched_count = sum(1 for t in token_analyses if t.translation)
    fidelity_score = matched_count / len(tokens) if tokens else 0.0

    latency_ms = int((time.time() - start_time) * 1000)

    return TranslateResponse(
        source_text=text,
        source_language=source_language,
        style=style,
        translation=translation,
        tokens=token_analyses,
        provenance=provenance,
        fidelity_score=round(fidelity_score, 3),
        latency_ms=latency_ms
    )


@router.get("/languages")
async def get_supported_languages():
    """Get supported source languages."""
    return {
        "languages": [
            {"code": "greek", "name": "Ancient Greek", "aliases": ["grc", "ancient greek", "gr"]},
            {"code": "latin", "name": "Latin", "aliases": ["lat", "la"]}
        ]
    }


@router.get("/styles")
async def get_translation_styles():
    """Get available translation styles."""
    return {
        "styles": [
            {"id": "scholarly", "name": "Scholarly", "description": "Preserves original structure, technical vocabulary"},
            {"id": "literary", "name": "Literary", "description": "Natural, flowing prose"},
            {"id": "accessible", "name": "Accessible", "description": "Simple vocabulary, clear sentences"},
            {"id": "literal", "name": "Literal", "description": "Word-for-word, close to source"}
        ]
    }


@router.get("/lexicon/stats")
async def get_lexicon_stats():
    """Get embedded lexicon statistics."""
    return {
        "greek_entries": len(GREEK_LEXICON),
        "latin_entries": len(LATIN_LEXICON),
        "total_entries": len(GREEK_LEXICON) + len(LATIN_LEXICON)
    }
