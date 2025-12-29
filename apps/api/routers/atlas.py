from fastapi import APIRouter, HTTPException, Request, Query
from pydantic import BaseModel, Field
from typing import Dict, Any, Optional, List, Union
import asyncpg
import logging
from datetime import datetime
import json
from enum import Enum

# Configure logging
logger = logging.getLogger(__name__)

# Create router
router = APIRouter()

# Historical periods for political boundaries
POLITICAL_PERIODS = {
    -800: "Archaic Period - Greek City-States",
    -500: "Classical Period - Persian Wars Era", 
    -323: "Hellenistic Period - Alexander's Successors",
    -146: "Roman Expansion - Mediterranean Conquest",
    -27: "Roman Empire - Augustus",
    100: "High Empire - Trajanic Expansion",
    300: "Late Empire - Constantine",
    476: "Fall of Western Empire",
    600: "Byzantine Empire - Justinian's Legacy"
}

# Famous journey routes
FAMOUS_JOURNEYS = {
    "odysseus": {
        "name": "Odysseus' Journey Home",
        "description": "The legendary 10-year journey of Odysseus from Troy to Ithaca",
        "type": "mythological",
        "start_location": {"name": "Troy", "lat": 39.957, "lng": 26.238},
        "end_location": {"name": "Ithaca", "lat": 38.434, "lng": 20.721},
        "waypoints": [
            {"name": "Land of Lotus Eaters", "lat": 33.8869, "lng": 9.5375, "description": "First stop after Troy"},
            {"name": "Cyclops Island (Sicily)", "lat": 37.5999, "lng": 14.0153, "description": "Encounter with Polyphemus"},
            {"name": "Aeolia", "lat": 38.48, "lng": 14.96, "description": "Island of winds"},
            {"name": "Laestrygonia", "lat": 41.1171, "lng": 16.8719, "description": "Land of giant cannibals"},
            {"name": "Aeaea (Circe's Island)", "lat": 41.8947, "lng": 12.9177, "description": "Island of the sorceress Circe"},
            {"name": "Underworld", "lat": 40.8518, "lng": 14.2681, "description": "Journey to Hades"},
            {"name": "Sirens' Island", "lat": 40.6300, "lng": 14.3600, "description": "Island of the Sirens"},
            {"name": "Scylla and Charybdis", "lat": 38.2467, "lng": 15.6415, "description": "Straits of Messina"},
            {"name": "Thrinacia", "lat": 37.0902, "lng": 15.2869, "description": "Island of the Sun God"},
            {"name": "Calypso's Isle", "lat": 35.2401, "lng": 24.8093, "description": "Seven years with Calypso"},
            {"name": "Phaeacia", "lat": 39.6243, "lng": 19.9217, "description": "Final stop before home"}
        ]
    },
    "aeneas": {
        "name": "Aeneas' Journey to Italy",
        "description": "The journey of Aeneas from Troy to found Rome",
        "type": "mythological", 
        "start_location": {"name": "Troy", "lat": 39.957, "lng": 26.238},
        "end_location": {"name": "Latium (Rome)", "lat": 41.9028, "lng": 12.4964},
        "waypoints": [
            {"name": "Thrace", "lat": 41.6086, "lng": 26.4956, "description": "First attempt at settlement"},
            {"name": "Delos", "lat": 37.3968, "lng": 25.2684, "description": "Oracle of Apollo"},
            {"name": "Crete", "lat": 35.2401, "lng": 24.8093, "description": "False homeland"},
            {"name": "Strophades Islands", "lat": 37.2583, "lng": 21.0081, "description": "Encounter with Harpies"},
            {"name": "Buthrotum", "lat": 39.7439, "lng": 20.0194, "description": "Meeting with Helenus"},
            {"name": "Sicily (Etna)", "lat": 37.7510, "lng": 14.9934, "description": "Land of Cyclops"},
            {"name": "Carthage", "lat": 36.8065, "lng": 10.1815, "description": "Love affair with Dido"},
            {"name": "Cumae", "lat": 40.8518, "lng": 14.0537, "description": "Descent to underworld"}
        ]
    },
    "paul": {
        "name": "Paul's Missionary Journeys",
        "description": "The three missionary journeys of Saint Paul across the Roman Empire",
        "type": "historical",
        "start_location": {"name": "Antioch", "lat": 36.2012, "lng": 36.1612},
        "end_location": {"name": "Rome", "lat": 41.9028, "lng": 12.4964},
        "waypoints": [
            {"name": "Cyprus (Salamis)", "lat": 35.1856, "lng": 33.9547, "description": "First Journey - with Barnabas"},
            {"name": "Perga", "lat": 36.9603, "lng": 30.8519, "description": "First Journey - Pamphylia"},
            {"name": "Iconium", "lat": 37.8667, "lng": 32.4833, "description": "First Journey - Galatia"},
            {"name": "Lystra", "lat": 37.6386, "lng": 32.4192, "description": "First Journey - healing miracle"},
            {"name": "Derbe", "lat": 37.3500, "lng": 33.2667, "description": "First Journey - final stop"},
            {"name": "Philippi", "lat": 41.0136, "lng": 24.2872, "description": "Second Journey - first European church"},
            {"name": "Thessalonica", "lat": 40.6401, "lng": 22.9444, "description": "Second Journey - Macedonia"},
            {"name": "Athens", "lat": 37.9755, "lng": 23.7348, "description": "Second Journey - Areopagus speech"},
            {"name": "Corinth", "lat": 37.9063, "lng": 22.8781, "description": "Second Journey - 18 months ministry"},
            {"name": "Ephesus", "lat": 37.9495, "lng": 27.3681, "description": "Third Journey - major ministry center"},
            {"name": "Miletus", "lat": 37.5333, "lng": 27.2833, "description": "Third Journey - farewell to Ephesian elders"},
            {"name": "Jerusalem", "lat": 31.7683, "lng": 35.2137, "description": "Arrest and trial"},
            {"name": "Caesarea Maritima", "lat": 32.5013, "lng": 34.8938, "description": "Imprisonment"},
            {"name": "Malta", "lat": 35.8997, "lng": 14.5147, "description": "Shipwreck on journey to Rome"}
        ]
    },
    "xenophon": {
        "name": "March of the Ten Thousand (Anabasis)",
        "description": "Xenophon's account of the Greek mercenaries' retreat from Persia",
        "type": "historical",
        "start_location": {"name": "Sardis", "lat": 38.4887, "lng": 28.0333},
        "end_location": {"name": "Trapezus (Trebizond)", "lat": 41.0055, "lng": 39.7178},
        "waypoints": [
            {"name": "Babylon", "lat": 32.5355, "lng": 44.4275, "description": "Failed coup attempt"},
            {"name": "Cunaxa", "lat": 33.0833, "lng": 44.4167, "description": "Battle where Cyrus died"},
            {"name": "Tissaphernes' Camp", "lat": 34.0522, "lng": 44.0394, "description": "Murder of Greek generals"},
            {"name": "Kurdistan Mountains", "lat": 36.1833, "lng": 44.0000, "description": "Fighting through hostile territory"},
            {"name": "Armenia", "lat": 40.0691, "lng": 45.0382, "description": "Winter march through snow"},
            {"name": "Mount Theches", "lat": 40.7500, "lng": 40.7500, "description": "First sight of the sea"}
        ]
    }
}

# Archaeological sites with coordinates
ARCHAEOLOGICAL_SITES = {
    "delphi": {"name": "Delphi", "lat": 38.4824, "lng": 22.5012, "type": "sanctuary", "description": "Oracle of Apollo, Pythian Games", "period": "8th century BCE - 4th century CE", "excavations": "French Archaeological School"},
    "olympia": {"name": "Olympia", "lat": 37.6379, "lng": 21.6300, "type": "sanctuary", "description": "Olympic Games site, Zeus temple", "period": "10th century BCE - 4th century CE", "excavations": "German Archaeological Institute"},
    "athens_acropolis": {"name": "Athens Acropolis", "lat": 37.9715, "lng": 23.7267, "type": "citadel", "description": "Parthenon, Erechtheion, Propylaea", "period": "Mycenaean - Byzantine", "excavations": "Greek Archaeological Service"},
    "ephesus": {"name": "Ephesus", "lat": 37.9495, "lng": 27.3681, "type": "city", "description": "Library of Celsus, Great Theater", "period": "10th century BCE - 15th century CE", "excavations": "Austrian Archaeological Institute"},
    "pompeii": {"name": "Pompeii", "lat": 40.7489, "lng": 14.4918, "type": "city", "description": "Preserved by Vesuvius eruption 79 CE", "period": "6th century BCE - 79 CE", "excavations": "Ongoing since 1748"},
    "troy": {"name": "Troy (Hisarlik)", "lat": 39.9570, "lng": 26.2380, "type": "city", "description": "Homeric Troy, multiple layers", "period": "3000 BCE - 400 CE", "excavations": "Schliemann, Blegen, Korfmann"},
    "knossos": {"name": "Knossos", "lat": 35.2979, "lng": 25.1632, "type": "palace", "description": "Minoan palace, Linear B tablets", "period": "2700-1100 BCE", "excavations": "Arthur Evans"},
    "mycenae": {"name": "Mycenae", "lat": 37.7308, "lng": 22.7569, "type": "citadel", "description": "Lion Gate, shaft graves", "period": "1600-1100 BCE", "excavations": "Schliemann, Wace"},
    "pergamon": {"name": "Pergamon", "lat": 39.1319, "lng": 27.1844, "type": "city", "description": "Hellenistic capital, great library", "period": "8th century BCE - 14th century CE", "excavations": "German Archaeological Institute"},
    "corinth": {"name": "Corinth", "lat": 37.9063, "lng": 22.8781, "type": "city", "description": "Commercial hub, Apostle Paul's ministry", "period": "Neolithic - Medieval", "excavations": "American School of Classical Studies"}
}

# Author birthplaces
AUTHOR_LOCATIONS = {
    "homer": {"name": "Homer", "birthplace": "Chios (traditional)", "lat": 38.3947, "lng": 26.0420, "dates": "8th century BCE", "works": ["Iliad", "Odyssey"]},
    "sappho": {"name": "Sappho", "birthplace": "Lesbos (Mytilene)", "lat": 39.1036, "lng": 26.5586, "dates": "630-570 BCE", "works": ["Lyric Poems"]},
    "herodotus": {"name": "Herodotus", "birthplace": "Halicarnassus