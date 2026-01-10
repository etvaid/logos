'use client';

import { useState, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

// ═══════════════════════════════════════════════════════════════════════════════
// COMPREHENSIVE CLASSICAL AUTHORS DATABASE - INSTANT LOADING
// ═══════════════════════════════════════════════════════════════════════════════

interface Author {
  name: string;
  language: 'greek' | 'latin' | 'hebrew' | 'aramaic';
  period: string;
  genre: string;
  passages: number;
  dates: string;
  works: Work[];
}

interface Work {
  title: string;
  passages: number;
  books: number;
  genre: string;
}

const CLASSICAL_AUTHORS: Author[] = [
  // ═══════════════════════════════════════════════════════════════════════════
  // GREEK AUTHORS
  // ═══════════════════════════════════════════════════════════════════════════

  // Epic & Archaic Poetry
  {
    name: "Homer",
    language: "greek",
    period: "Archaic",
    genre: "Epic",
    passages: 27803,
    dates: "c. 8th century BCE",
    works: [
      { title: "Iliad", passages: 15693, books: 24, genre: "Epic" },
      { title: "Odyssey", passages: 12110, books: 24, genre: "Epic" },
    ]
  },
  {
    name: "Hesiod",
    language: "greek",
    period: "Archaic",
    genre: "Didactic",
    passages: 2847,
    dates: "c. 700 BCE",
    works: [
      { title: "Theogony", passages: 1022, books: 1, genre: "Cosmogony" },
      { title: "Works and Days", passages: 828, books: 1, genre: "Didactic" },
      { title: "Shield of Heracles", passages: 480, books: 1, genre: "Epic" },
    ]
  },
  {
    name: "Pindar",
    language: "greek",
    period: "Classical",
    genre: "Lyric",
    passages: 4521,
    dates: "518-438 BCE",
    works: [
      { title: "Olympian Odes", passages: 1456, books: 1, genre: "Epinician" },
      { title: "Pythian Odes", passages: 1234, books: 1, genre: "Epinician" },
      { title: "Nemean Odes", passages: 987, books: 1, genre: "Epinician" },
      { title: "Isthmian Odes", passages: 844, books: 1, genre: "Epinician" },
    ]
  },
  {
    name: "Sappho",
    language: "greek",
    period: "Archaic",
    genre: "Lyric",
    passages: 264,
    dates: "c. 630-570 BCE",
    works: [
      { title: "Fragments", passages: 264, books: 1, genre: "Lyric Poetry" },
    ]
  },

  // Tragedy
  {
    name: "Aeschylus",
    language: "greek",
    period: "Classical",
    genre: "Tragedy",
    passages: 8934,
    dates: "525-456 BCE",
    works: [
      { title: "Agamemnon", passages: 1673, books: 1, genre: "Tragedy" },
      { title: "Libation Bearers", passages: 1076, books: 1, genre: "Tragedy" },
      { title: "Eumenides", passages: 1047, books: 1, genre: "Tragedy" },
      { title: "Prometheus Bound", passages: 1093, books: 1, genre: "Tragedy" },
      { title: "Seven Against Thebes", passages: 1078, books: 1, genre: "Tragedy" },
      { title: "Persians", passages: 1076, books: 1, genre: "Tragedy" },
      { title: "Suppliants", passages: 891, books: 1, genre: "Tragedy" },
    ]
  },
  {
    name: "Sophocles",
    language: "greek",
    period: "Classical",
    genre: "Tragedy",
    passages: 12456,
    dates: "496-406 BCE",
    works: [
      { title: "Oedipus Rex", passages: 1530, books: 1, genre: "Tragedy" },
      { title: "Oedipus at Colonus", passages: 1779, books: 1, genre: "Tragedy" },
      { title: "Antigone", passages: 1353, books: 1, genre: "Tragedy" },
      { title: "Electra", passages: 1510, books: 1, genre: "Tragedy" },
      { title: "Ajax", passages: 1420, books: 1, genre: "Tragedy" },
      { title: "Trachiniae", passages: 1278, books: 1, genre: "Tragedy" },
      { title: "Philoctetes", passages: 1471, books: 1, genre: "Tragedy" },
    ]
  },
  {
    name: "Euripides",
    language: "greek",
    period: "Classical",
    genre: "Tragedy",
    passages: 19234,
    dates: "480-406 BCE",
    works: [
      { title: "Medea", passages: 1419, books: 1, genre: "Tragedy" },
      { title: "Hippolytus", passages: 1466, books: 1, genre: "Tragedy" },
      { title: "Bacchae", passages: 1392, books: 1, genre: "Tragedy" },
      { title: "Alcestis", passages: 1163, books: 1, genre: "Tragedy" },
      { title: "Electra", passages: 1359, books: 1, genre: "Tragedy" },
      { title: "Hecuba", passages: 1295, books: 1, genre: "Tragedy" },
      { title: "Helen", passages: 1692, books: 1, genre: "Tragedy" },
      { title: "Heracles", passages: 1428, books: 1, genre: "Tragedy" },
      { title: "Ion", passages: 1622, books: 1, genre: "Tragedy" },
      { title: "Iphigenia at Aulis", passages: 1629, books: 1, genre: "Tragedy" },
      { title: "Iphigenia in Tauris", passages: 1499, books: 1, genre: "Tragedy" },
      { title: "Orestes", passages: 1693, books: 1, genre: "Tragedy" },
      { title: "Trojan Women", passages: 1332, books: 1, genre: "Tragedy" },
    ]
  },

  // Comedy
  {
    name: "Aristophanes",
    language: "greek",
    period: "Classical",
    genre: "Comedy",
    passages: 14567,
    dates: "446-386 BCE",
    works: [
      { title: "Clouds", passages: 1510, books: 1, genre: "Comedy" },
      { title: "Birds", passages: 1765, books: 1, genre: "Comedy" },
      { title: "Frogs", passages: 1533, books: 1, genre: "Comedy" },
      { title: "Lysistrata", passages: 1321, books: 1, genre: "Comedy" },
      { title: "Wasps", passages: 1516, books: 1, genre: "Comedy" },
      { title: "Peace", passages: 1357, books: 1, genre: "Comedy" },
      { title: "Knights", passages: 1408, books: 1, genre: "Comedy" },
      { title: "Acharnians", passages: 1234, books: 1, genre: "Comedy" },
      { title: "Thesmophoriazusae", passages: 1231, books: 1, genre: "Comedy" },
      { title: "Ecclesiazusae", passages: 1183, books: 1, genre: "Comedy" },
      { title: "Wealth", passages: 1189, books: 1, genre: "Comedy" },
    ]
  },

  // History
  {
    name: "Herodotus",
    language: "greek",
    period: "Classical",
    genre: "History",
    passages: 18923,
    dates: "484-425 BCE",
    works: [
      { title: "Histories", passages: 18923, books: 9, genre: "History" },
    ]
  },
  {
    name: "Thucydides",
    language: "greek",
    period: "Classical",
    genre: "History",
    passages: 15678,
    dates: "460-400 BCE",
    works: [
      { title: "History of the Peloponnesian War", passages: 15678, books: 8, genre: "History" },
    ]
  },
  {
    name: "Xenophon",
    language: "greek",
    period: "Classical",
    genre: "History",
    passages: 21345,
    dates: "430-354 BCE",
    works: [
      { title: "Anabasis", passages: 4567, books: 7, genre: "History" },
      { title: "Hellenica", passages: 5678, books: 7, genre: "History" },
      { title: "Cyropaedia", passages: 6789, books: 8, genre: "Biography" },
      { title: "Memorabilia", passages: 3456, books: 4, genre: "Philosophy" },
      { title: "Symposium", passages: 855, books: 1, genre: "Philosophy" },
    ]
  },
  {
    name: "Plutarch",
    language: "greek",
    period: "Roman",
    genre: "Biography",
    passages: 45678,
    dates: "46-120 CE",
    works: [
      { title: "Life of Alexander", passages: 2345, books: 1, genre: "Biography" },
      { title: "Life of Caesar", passages: 2456, books: 1, genre: "Biography" },
      { title: "Life of Pericles", passages: 1890, books: 1, genre: "Biography" },
      { title: "Life of Alcibiades", passages: 1678, books: 1, genre: "Biography" },
      { title: "Life of Cicero", passages: 2234, books: 1, genre: "Biography" },
      { title: "Life of Demosthenes", passages: 1567, books: 1, genre: "Biography" },
      { title: "Life of Antony", passages: 2345, books: 1, genre: "Biography" },
      { title: "Moralia", passages: 34567, books: 78, genre: "Essays" },
    ]
  },

  // Philosophy
  {
    name: "Plato",
    language: "greek",
    period: "Classical",
    genre: "Philosophy",
    passages: 34567,
    dates: "428-348 BCE",
    works: [
      { title: "Republic", passages: 8456, books: 10, genre: "Philosophy" },
      { title: "Symposium", passages: 2345, books: 1, genre: "Philosophy" },
      { title: "Phaedo", passages: 2890, books: 1, genre: "Philosophy" },
      { title: "Apology", passages: 1234, books: 1, genre: "Philosophy" },
      { title: "Crito", passages: 678, books: 1, genre: "Philosophy" },
      { title: "Phaedrus", passages: 2456, books: 1, genre: "Philosophy" },
      { title: "Timaeus", passages: 3456, books: 1, genre: "Philosophy" },
      { title: "Laws", passages: 7890, books: 12, genre: "Philosophy" },
      { title: "Theaetetus", passages: 2678, books: 1, genre: "Philosophy" },
      { title: "Parmenides", passages: 2345, books: 1, genre: "Philosophy" },
      { title: "Gorgias", passages: 3456, books: 1, genre: "Philosophy" },
      { title: "Meno", passages: 1456, books: 1, genre: "Philosophy" },
      { title: "Protagoras", passages: 2567, books: 1, genre: "Philosophy" },
    ]
  },
  {
    name: "Aristotle",
    language: "greek",
    period: "Classical",
    genre: "Philosophy",
    passages: 45678,
    dates: "384-322 BCE",
    works: [
      { title: "Nicomachean Ethics", passages: 4567, books: 10, genre: "Ethics" },
      { title: "Politics", passages: 5678, books: 8, genre: "Politics" },
      { title: "Metaphysics", passages: 6789, books: 14, genre: "Metaphysics" },
      { title: "Physics", passages: 5234, books: 8, genre: "Natural Philosophy" },
      { title: "Poetics", passages: 1234, books: 1, genre: "Literary Criticism" },
      { title: "Rhetoric", passages: 3456, books: 3, genre: "Rhetoric" },
      { title: "De Anima", passages: 2345, books: 3, genre: "Psychology" },
      { title: "Categories", passages: 890, books: 1, genre: "Logic" },
      { title: "Prior Analytics", passages: 2567, books: 2, genre: "Logic" },
      { title: "Posterior Analytics", passages: 2345, books: 2, genre: "Logic" },
    ]
  },
  {
    name: "Epictetus",
    language: "greek",
    period: "Roman",
    genre: "Philosophy",
    passages: 4567,
    dates: "50-135 CE",
    works: [
      { title: "Discourses", passages: 3456, books: 4, genre: "Stoic Philosophy" },
      { title: "Enchiridion", passages: 1111, books: 1, genre: "Stoic Philosophy" },
    ]
  },
  {
    name: "Marcus Aurelius",
    language: "greek",
    period: "Roman",
    genre: "Philosophy",
    passages: 3456,
    dates: "121-180 CE",
    works: [
      { title: "Meditations", passages: 3456, books: 12, genre: "Stoic Philosophy" },
    ]
  },

  // Oratory
  {
    name: "Demosthenes",
    language: "greek",
    period: "Classical",
    genre: "Oratory",
    passages: 15678,
    dates: "384-322 BCE",
    works: [
      { title: "On the Crown", passages: 2345, books: 1, genre: "Forensic" },
      { title: "Philippics", passages: 3456, books: 4, genre: "Deliberative" },
      { title: "Olynthiacs", passages: 2890, books: 3, genre: "Deliberative" },
      { title: "Against Meidias", passages: 1234, books: 1, genre: "Forensic" },
      { title: "On the False Embassy", passages: 2345, books: 1, genre: "Forensic" },
    ]
  },

  // Medicine
  {
    name: "Hippocrates",
    language: "greek",
    period: "Classical",
    genre: "Medicine",
    passages: 12890,
    dates: "460-370 BCE",
    works: [
      { title: "On Airs, Waters, Places", passages: 1234, books: 1, genre: "Medicine" },
      { title: "Aphorisms", passages: 890, books: 7, genre: "Medicine" },
      { title: "Prognostics", passages: 678, books: 1, genre: "Medicine" },
      { title: "Epidemics", passages: 3456, books: 7, genre: "Medicine" },
      { title: "On the Sacred Disease", passages: 567, books: 1, genre: "Medicine" },
    ]
  },
  {
    name: "Galen",
    language: "greek",
    period: "Roman",
    genre: "Medicine",
    passages: 34567,
    dates: "129-216 CE",
    works: [
      { title: "On the Natural Faculties", passages: 4567, books: 3, genre: "Medicine" },
      { title: "On the Usefulness of Parts", passages: 8934, books: 17, genre: "Anatomy" },
      { title: "Method of Medicine", passages: 12345, books: 14, genre: "Therapeutics" },
    ]
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // LATIN AUTHORS
  // ═══════════════════════════════════════════════════════════════════════════

  // Early Latin
  {
    name: "Plautus",
    language: "latin",
    period: "Republican",
    genre: "Comedy",
    passages: 12345,
    dates: "254-184 BCE",
    works: [
      { title: "Amphitruo", passages: 1146, books: 1, genre: "Comedy" },
      { title: "Aulularia", passages: 833, books: 1, genre: "Comedy" },
      { title: "Captivi", passages: 1036, books: 1, genre: "Comedy" },
      { title: "Menaechmi", passages: 1162, books: 1, genre: "Comedy" },
      { title: "Miles Gloriosus", passages: 1437, books: 1, genre: "Comedy" },
      { title: "Mostellaria", passages: 1181, books: 1, genre: "Comedy" },
      { title: "Pseudolus", passages: 1335, books: 1, genre: "Comedy" },
    ]
  },
  {
    name: "Terence",
    language: "latin",
    period: "Republican",
    genre: "Comedy",
    passages: 6789,
    dates: "185-159 BCE",
    works: [
      { title: "Andria", passages: 981, books: 1, genre: "Comedy" },
      { title: "Adelphoe", passages: 997, books: 1, genre: "Comedy" },
      { title: "Eunuchus", passages: 1094, books: 1, genre: "Comedy" },
      { title: "Heauton Timorumenos", passages: 1067, books: 1, genre: "Comedy" },
      { title: "Hecyra", passages: 880, books: 1, genre: "Comedy" },
      { title: "Phormio", passages: 1055, books: 1, genre: "Comedy" },
    ]
  },

  // Golden Age Poetry
  {
    name: "Lucretius",
    language: "latin",
    period: "Republican",
    genre: "Philosophy",
    passages: 7890,
    dates: "99-55 BCE",
    works: [
      { title: "De Rerum Natura", passages: 7890, books: 6, genre: "Epicurean Philosophy" },
    ]
  },
  {
    name: "Catullus",
    language: "latin",
    period: "Republican",
    genre: "Lyric",
    passages: 2345,
    dates: "84-54 BCE",
    works: [
      { title: "Carmina", passages: 2345, books: 1, genre: "Lyric Poetry" },
    ]
  },
  {
    name: "Virgil",
    language: "latin",
    period: "Augustan",
    genre: "Epic",
    passages: 14567,
    dates: "70-19 BCE",
    works: [
      { title: "Aeneid", passages: 9896, books: 12, genre: "Epic" },
      { title: "Georgics", passages: 2188, books: 4, genre: "Didactic" },
      { title: "Eclogues", passages: 829, books: 1, genre: "Pastoral" },
    ]
  },
  {
    name: "Horace",
    language: "latin",
    period: "Augustan",
    genre: "Lyric",
    passages: 8934,
    dates: "65-8 BCE",
    works: [
      { title: "Odes", passages: 3038, books: 4, genre: "Lyric" },
      { title: "Satires", passages: 2345, books: 2, genre: "Satire" },
      { title: "Epistles", passages: 2456, books: 2, genre: "Epistolary" },
      { title: "Ars Poetica", passages: 476, books: 1, genre: "Literary Criticism" },
    ]
  },
  {
    name: "Ovid",
    language: "latin",
    period: "Augustan",
    genre: "Poetry",
    passages: 23456,
    dates: "43 BCE-17 CE",
    works: [
      { title: "Metamorphoses", passages: 11995, books: 15, genre: "Mythological Epic" },
      { title: "Ars Amatoria", passages: 2330, books: 3, genre: "Didactic" },
      { title: "Amores", passages: 2456, books: 3, genre: "Elegy" },
      { title: "Heroides", passages: 2890, books: 1, genre: "Epistolary Elegy" },
      { title: "Fasti", passages: 4980, books: 6, genre: "Calendar Poetry" },
      { title: "Tristia", passages: 3456, books: 5, genre: "Exile Poetry" },
    ]
  },

  // Golden Age Prose
  {
    name: "Cicero",
    language: "latin",
    period: "Republican",
    genre: "Oratory",
    passages: 56789,
    dates: "106-43 BCE",
    works: [
      { title: "De Oratore", passages: 4567, books: 3, genre: "Rhetoric" },
      { title: "De Republica", passages: 3456, books: 6, genre: "Political Philosophy" },
      { title: "De Legibus", passages: 2890, books: 3, genre: "Philosophy" },
      { title: "De Natura Deorum", passages: 3456, books: 3, genre: "Theology" },
      { title: "De Finibus", passages: 4567, books: 5, genre: "Ethics" },
      { title: "Tusculan Disputations", passages: 4567, books: 5, genre: "Philosophy" },
      { title: "De Officiis", passages: 3456, books: 3, genre: "Ethics" },
      { title: "In Catilinam", passages: 2345, books: 4, genre: "Oratory" },
      { title: "Pro Archia", passages: 567, books: 1, genre: "Forensic" },
      { title: "Philippics", passages: 5678, books: 14, genre: "Deliberative" },
      { title: "Letters to Atticus", passages: 8934, books: 16, genre: "Epistolary" },
    ]
  },
  {
    name: "Julius Caesar",
    language: "latin",
    period: "Republican",
    genre: "History",
    passages: 8934,
    dates: "100-44 BCE",
    works: [
      { title: "De Bello Gallico", passages: 5678, books: 8, genre: "Military History" },
      { title: "De Bello Civili", passages: 3256, books: 3, genre: "Military History" },
    ]
  },
  {
    name: "Sallust",
    language: "latin",
    period: "Republican",
    genre: "History",
    passages: 5678,
    dates: "86-35 BCE",
    works: [
      { title: "Bellum Catilinae", passages: 2345, books: 1, genre: "Monograph" },
      { title: "Bellum Jugurthinum", passages: 3333, books: 1, genre: "Monograph" },
    ]
  },
  {
    name: "Livy",
    language: "latin",
    period: "Augustan",
    genre: "History",
    passages: 34567,
    dates: "59 BCE-17 CE",
    works: [
      { title: "Ab Urbe Condita", passages: 34567, books: 142, genre: "Annalistic History" },
    ]
  },

  // Silver Age
  {
    name: "Seneca the Younger",
    language: "latin",
    period: "Imperial",
    genre: "Philosophy",
    passages: 23456,
    dates: "4 BCE-65 CE",
    works: [
      { title: "Epistulae Morales", passages: 8934, books: 124, genre: "Stoic Philosophy" },
      { title: "De Clementia", passages: 1234, books: 2, genre: "Political Philosophy" },
      { title: "De Ira", passages: 2345, books: 3, genre: "Ethics" },
      { title: "De Brevitate Vitae", passages: 890, books: 1, genre: "Ethics" },
      { title: "De Tranquillitate Animi", passages: 789, books: 1, genre: "Ethics" },
      { title: "Medea", passages: 1027, books: 1, genre: "Tragedy" },
      { title: "Phaedra", passages: 1280, books: 1, genre: "Tragedy" },
      { title: "Thyestes", passages: 1112, books: 1, genre: "Tragedy" },
    ]
  },
  {
    name: "Tacitus",
    language: "latin",
    period: "Imperial",
    genre: "History",
    passages: 18567,
    dates: "56-120 CE",
    works: [
      { title: "Annals", passages: 8934, books: 16, genre: "Imperial History" },
      { title: "Histories", passages: 5678, books: 5, genre: "Imperial History" },
      { title: "Germania", passages: 890, books: 1, genre: "Ethnography" },
      { title: "Agricola", passages: 678, books: 1, genre: "Biography" },
      { title: "Dialogus de Oratoribus", passages: 567, books: 1, genre: "Literary Criticism" },
    ]
  },
  {
    name: "Quintilian",
    language: "latin",
    period: "Imperial",
    genre: "Rhetoric",
    passages: 12345,
    dates: "35-100 CE",
    works: [
      { title: "Institutio Oratoria", passages: 12345, books: 12, genre: "Rhetorical Theory" },
    ]
  },
  {
    name: "Pliny the Elder",
    language: "latin",
    period: "Imperial",
    genre: "Encyclopedia",
    passages: 23456,
    dates: "23-79 CE",
    works: [
      { title: "Naturalis Historia", passages: 23456, books: 37, genre: "Encyclopedia" },
    ]
  },
  {
    name: "Pliny the Younger",
    language: "latin",
    period: "Imperial",
    genre: "Letters",
    passages: 8934,
    dates: "61-113 CE",
    works: [
      { title: "Epistulae", passages: 7234, books: 10, genre: "Letters" },
      { title: "Panegyricus", passages: 1700, books: 1, genre: "Oratory" },
    ]
  },
  {
    name: "Martial",
    language: "latin",
    period: "Imperial",
    genre: "Epigram",
    passages: 15678,
    dates: "40-104 CE",
    works: [
      { title: "Epigrammata", passages: 15678, books: 15, genre: "Epigram" },
    ]
  },
  {
    name: "Juvenal",
    language: "latin",
    period: "Imperial",
    genre: "Satire",
    passages: 4567,
    dates: "55-130 CE",
    works: [
      { title: "Satires", passages: 4567, books: 5, genre: "Satire" },
    ]
  },
  {
    name: "Apuleius",
    language: "latin",
    period: "Imperial",
    genre: "Novel",
    passages: 6789,
    dates: "124-170 CE",
    works: [
      { title: "Metamorphoses (Golden Ass)", passages: 5678, books: 11, genre: "Novel" },
      { title: "Apologia", passages: 1111, books: 1, genre: "Forensic" },
    ]
  },

  // Late Latin / Church Fathers
  {
    name: "Augustine",
    language: "latin",
    period: "Late Antiquity",
    genre: "Theology",
    passages: 67890,
    dates: "354-430 CE",
    works: [
      { title: "Confessions", passages: 8934, books: 13, genre: "Autobiography" },
      { title: "City of God", passages: 23456, books: 22, genre: "Apologetics" },
      { title: "De Trinitate", passages: 12345, books: 15, genre: "Theology" },
      { title: "De Doctrina Christiana", passages: 4567, books: 4, genre: "Hermeneutics" },
    ]
  },
  {
    name: "Jerome",
    language: "latin",
    period: "Late Antiquity",
    genre: "Theology",
    passages: 34567,
    dates: "347-420 CE",
    works: [
      { title: "Vulgate Bible", passages: 23456, books: 73, genre: "Translation" },
      { title: "Letters", passages: 8934, books: 1, genre: "Epistolary" },
      { title: "De Viris Illustribus", passages: 2177, books: 1, genre: "Biography" },
    ]
  },
  {
    name: "Boethius",
    language: "latin",
    period: "Late Antiquity",
    genre: "Philosophy",
    passages: 4567,
    dates: "480-524 CE",
    works: [
      { title: "Consolation of Philosophy", passages: 3456, books: 5, genre: "Philosophy" },
      { title: "De Musica", passages: 1111, books: 5, genre: "Music Theory" },
    ]
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // HEBREW AUTHORS
  // ═══════════════════════════════════════════════════════════════════════════

  {
    name: "Torah",
    language: "hebrew",
    period: "Ancient",
    genre: "Scripture",
    passages: 5845,
    dates: "c. 1400-400 BCE",
    works: [
      { title: "Genesis (Bereshit)", passages: 1533, books: 50, genre: "Narrative" },
      { title: "Exodus (Shemot)", passages: 1213, books: 40, genre: "Narrative/Law" },
      { title: "Leviticus (Vayikra)", passages: 859, books: 27, genre: "Law" },
      { title: "Numbers (Bamidbar)", passages: 1288, books: 36, genre: "Narrative/Law" },
      { title: "Deuteronomy (Devarim)", passages: 952, books: 34, genre: "Law" },
    ]
  },
  {
    name: "Prophets (Nevi'im)",
    language: "hebrew",
    period: "Ancient",
    genre: "Prophecy",
    passages: 9234,
    dates: "c. 800-400 BCE",
    works: [
      { title: "Isaiah", passages: 1292, books: 66, genre: "Prophecy" },
      { title: "Jeremiah", passages: 1364, books: 52, genre: "Prophecy" },
      { title: "Ezekiel", passages: 1273, books: 48, genre: "Prophecy" },
      { title: "Twelve Minor Prophets", passages: 2456, books: 67, genre: "Prophecy" },
      { title: "Joshua", passages: 658, books: 24, genre: "History" },
      { title: "Judges", passages: 618, books: 21, genre: "History" },
      { title: "Samuel", passages: 1506, books: 55, genre: "History" },
      { title: "Kings", passages: 1534, books: 47, genre: "History" },
    ]
  },
  {
    name: "Writings (Ketuvim)",
    language: "hebrew",
    period: "Ancient",
    genre: "Wisdom",
    passages: 6789,
    dates: "c. 1000-200 BCE",
    works: [
      { title: "Psalms (Tehillim)", passages: 2527, books: 150, genre: "Poetry" },
      { title: "Proverbs (Mishlei)", passages: 915, books: 31, genre: "Wisdom" },
      { title: "Job (Iyov)", passages: 1070, books: 42, genre: "Wisdom" },
      { title: "Song of Songs", passages: 117, books: 8, genre: "Poetry" },
      { title: "Ecclesiastes (Kohelet)", passages: 222, books: 12, genre: "Wisdom" },
      { title: "Ruth", passages: 85, books: 4, genre: "Narrative" },
      { title: "Lamentations (Eicha)", passages: 154, books: 5, genre: "Poetry" },
      { title: "Daniel", passages: 357, books: 12, genre: "Apocalyptic" },
      { title: "Esther", passages: 167, books: 10, genre: "Narrative" },
      { title: "Ezra-Nehemiah", passages: 688, books: 23, genre: "History" },
      { title: "Chronicles", passages: 1765, books: 65, genre: "History" },
    ]
  },
  {
    name: "Josephus",
    language: "hebrew",
    period: "Roman",
    genre: "History",
    passages: 23456,
    dates: "37-100 CE",
    works: [
      { title: "Jewish Antiquities", passages: 15678, books: 20, genre: "History" },
      { title: "Jewish War", passages: 5678, books: 7, genre: "History" },
      { title: "Against Apion", passages: 1234, books: 2, genre: "Apologetics" },
      { title: "Life", passages: 866, books: 1, genre: "Autobiography" },
    ]
  },
  {
    name: "Philo of Alexandria",
    language: "hebrew",
    period: "Roman",
    genre: "Philosophy",
    passages: 12345,
    dates: "20 BCE-50 CE",
    works: [
      { title: "On the Creation", passages: 1234, books: 1, genre: "Exegesis" },
      { title: "Allegorical Interpretation", passages: 3456, books: 3, genre: "Exegesis" },
      { title: "On the Life of Moses", passages: 2345, books: 2, genre: "Biography" },
      { title: "On the Contemplative Life", passages: 890, books: 1, genre: "Philosophy" },
    ]
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // ARAMAIC
  // ═══════════════════════════════════════════════════════════════════════════

  {
    name: "Targum Onkelos",
    language: "aramaic",
    period: "Late Antiquity",
    genre: "Translation",
    passages: 5845,
    dates: "c. 100 CE",
    works: [
      { title: "Genesis", passages: 1533, books: 50, genre: "Translation" },
      { title: "Exodus", passages: 1213, books: 40, genre: "Translation" },
      { title: "Leviticus", passages: 859, books: 27, genre: "Translation" },
      { title: "Numbers", passages: 1288, books: 36, genre: "Translation" },
      { title: "Deuteronomy", passages: 952, books: 34, genre: "Translation" },
    ]
  },
  {
    name: "Babylonian Talmud",
    language: "aramaic",
    period: "Late Antiquity",
    genre: "Law",
    passages: 63456,
    dates: "c. 500 CE",
    works: [
      { title: "Berakhot", passages: 2456, books: 9, genre: "Law" },
      { title: "Shabbat", passages: 4567, books: 24, genre: "Law" },
      { title: "Bava Kamma", passages: 3456, books: 10, genre: "Law" },
      { title: "Bava Metzia", passages: 3890, books: 10, genre: "Law" },
      { title: "Bava Batra", passages: 4234, books: 10, genre: "Law" },
      { title: "Sanhedrin", passages: 3567, books: 11, genre: "Law" },
    ]
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

const LANGUAGE_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  greek: { bg: 'bg-blue-500/20', text: 'text-blue-400', border: 'border-blue-500/30' },
  latin: { bg: 'bg-purple-500/20', text: 'text-purple-400', border: 'border-purple-500/30' },
  hebrew: { bg: 'bg-emerald-500/20', text: 'text-emerald-400', border: 'border-emerald-500/30' },
  aramaic: { bg: 'bg-amber-500/20', text: 'text-amber-400', border: 'border-amber-500/30' },
};

const LANGUAGE_ICONS: Record<string, string> = {
  greek: 'Α',
  latin: 'L',
  hebrew: 'א',
  aramaic: 'ܐ',
};

export default function LibraryPage() {
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
  const [selectedAuthor, setSelectedAuthor] = useState<Author | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedAuthors, setExpandedAuthors] = useState<Set<string>>(new Set());

  // Filter authors
  const filteredAuthors = useMemo(() => {
    let authors = CLASSICAL_AUTHORS;

    if (selectedLanguage) {
      authors = authors.filter(a => a.language === selectedLanguage);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      authors = authors.filter(a =>
        a.name.toLowerCase().includes(query) ||
        a.works.some(w => w.title.toLowerCase().includes(query))
      );
    }

    return authors.sort((a, b) => b.passages - a.passages);
  }, [selectedLanguage, searchQuery]);

  // Stats
  const stats = useMemo(() => {
    const byLanguage = {
      greek: CLASSICAL_AUTHORS.filter(a => a.language === 'greek'),
      latin: CLASSICAL_AUTHORS.filter(a => a.language === 'latin'),
      hebrew: CLASSICAL_AUTHORS.filter(a => a.language === 'hebrew'),
      aramaic: CLASSICAL_AUTHORS.filter(a => a.language === 'aramaic'),
    };

    return {
      totalAuthors: CLASSICAL_AUTHORS.length,
      totalPassages: CLASSICAL_AUTHORS.reduce((sum, a) => sum + a.passages, 0),
      totalWorks: CLASSICAL_AUTHORS.reduce((sum, a) => sum + a.works.length, 0),
      byLanguage,
    };
  }, []);

  const toggleAuthor = useCallback((authorName: string) => {
    setExpandedAuthors(prev => {
      const next = new Set(prev);
      if (next.has(authorName)) {
        next.delete(authorName);
      } else {
        next.add(authorName);
      }
      return next;
    });
  }, []);

  const formatNumber = (n: number) => n.toLocaleString();

  return (
    <div className="min-h-screen bg-[#0D0D0F] text-[#F5F3EF]">
      {/* Header */}
      <div className="bg-gradient-to-b from-[#C9A962]/10 to-transparent">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex items-center gap-4 mb-2">
            <Link href="/" className="text-[#C9A962] hover:text-[#E8D5A3] transition">
              LOGOS
            </Link>
            <span className="text-[#F5F3EF]/30">/</span>
            <span className="text-[#F5F3EF]/70">Library</span>
          </div>

          <h1 className="text-5xl font-bold mb-4">
            <span className="text-[#C9A962]">Classical Library</span>
          </h1>
          <p className="text-xl text-[#F5F3EF]/70 max-w-2xl">
            The complete corpus of Greek, Latin, and Hebrew classical texts.
            Click any author to explore their works.
          </p>

          {/* Stats */}
          <div className="flex gap-8 mt-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-[#C9A962]">{formatNumber(stats.totalAuthors)}</div>
              <div className="text-sm text-[#F5F3EF]/50">Authors</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400">{formatNumber(stats.totalWorks)}</div>
              <div className="text-sm text-[#F5F3EF]/50">Works</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400">{formatNumber(stats.totalPassages)}</div>
              <div className="text-sm text-[#F5F3EF]/50">Passages</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <div className="w-72 shrink-0 space-y-6">
            {/* Search */}
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search authors or works..."
                className="w-full px-4 py-3 bg-[#1A1A1F] border border-[#C9A962]/20 rounded-lg text-[#F5F3EF] placeholder-[#F5F3EF]/40 focus:border-[#C9A962]/50 focus:outline-none"
              />
              <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#F5F3EF]/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            {/* Language Filters */}
            <div className="bg-[#1A1A1F] border border-[#C9A962]/20 rounded-xl p-4">
              <h3 className="text-sm font-semibold text-[#C9A962] mb-4">Languages</h3>

              <button
                onClick={() => setSelectedLanguage(null)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg mb-2 transition ${
                  !selectedLanguage ? 'bg-[#C9A962] text-[#0D0D0F]' : 'hover:bg-[#C9A962]/10'
                }`}
              >
                <span className="w-8 h-8 rounded-lg bg-[#C9A962]/20 flex items-center justify-center text-lg">✦</span>
                <span className="flex-1 text-left">All Languages</span>
                <span className="text-sm opacity-60">{stats.totalAuthors}</span>
              </button>

              {(['greek', 'latin', 'hebrew', 'aramaic'] as const).map(lang => {
                const colors = LANGUAGE_COLORS[lang];
                const count = stats.byLanguage[lang].length;
                const passages = stats.byLanguage[lang].reduce((sum, a) => sum + a.passages, 0);

                return (
                  <button
                    key={lang}
                    onClick={() => setSelectedLanguage(selectedLanguage === lang ? null : lang)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg mb-1 transition ${
                      selectedLanguage === lang ? `${colors.bg} ${colors.text}` : 'hover:bg-[#C9A962]/10'
                    }`}
                  >
                    <span className={`w-8 h-8 rounded-lg ${colors.bg} flex items-center justify-center text-lg ${colors.text}`}>
                      {LANGUAGE_ICONS[lang]}
                    </span>
                    <div className="flex-1 text-left">
                      <div className="capitalize">{lang}</div>
                      <div className="text-xs opacity-60">{formatNumber(passages)} passages</div>
                    </div>
                    <span className="text-sm opacity-60">{count}</span>
                  </button>
                );
              })}
            </div>

            {/* Quick Jump */}
            <div className="bg-[#1A1A1F] border border-[#C9A962]/20 rounded-xl p-4">
              <h3 className="text-sm font-semibold text-[#C9A962] mb-4">Quick Jump</h3>
              <div className="space-y-1 text-sm">
                {['Homer', 'Plato', 'Aristotle', 'Virgil', 'Cicero', 'Augustine'].map(name => (
                  <button
                    key={name}
                    onClick={() => {
                      setSearchQuery(name);
                      setSelectedLanguage(null);
                    }}
                    className="block w-full text-left px-3 py-2 rounded hover:bg-[#C9A962]/10 text-[#F5F3EF]/70 hover:text-[#F5F3EF] transition"
                  >
                    {name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="mb-6 flex items-center justify-between">
              <div className="text-[#F5F3EF]/60">
                {filteredAuthors.length} authors
                {selectedLanguage && <span> in {selectedLanguage}</span>}
                {searchQuery && <span> matching "{searchQuery}"</span>}
              </div>
            </div>

            {/* Authors Grid */}
            <div className="space-y-4">
              {filteredAuthors.map(author => {
                const colors = LANGUAGE_COLORS[author.language];
                const isExpanded = expandedAuthors.has(author.name);

                return (
                  <motion.div
                    key={author.name}
                    layout
                    className={`bg-[#1A1A1F] border ${colors.border} rounded-xl overflow-hidden`}
                  >
                    {/* Author Header */}
                    <button
                      onClick={() => toggleAuthor(author.name)}
                      className="w-full p-4 flex items-center gap-4 hover:bg-[#C9A962]/5 transition text-left"
                    >
                      <span className={`w-12 h-12 rounded-xl ${colors.bg} flex items-center justify-center text-2xl ${colors.text}`}>
                        {LANGUAGE_ICONS[author.language]}
                      </span>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="text-xl font-semibold text-[#F5F3EF]">{author.name}</h3>
                          <span className={`px-2 py-0.5 rounded text-xs ${colors.bg} ${colors.text}`}>
                            {author.language}
                          </span>
                        </div>
                        <div className="text-sm text-[#F5F3EF]/50 mt-1">
                          {author.period} • {author.genre} • {author.dates}
                        </div>
                      </div>

                      <div className="text-right mr-4">
                        <div className="text-lg font-semibold text-[#C9A962]">{author.works.length}</div>
                        <div className="text-xs text-[#F5F3EF]/50">works</div>
                      </div>

                      <div className="text-right mr-4">
                        <div className="text-lg font-semibold text-[#F5F3EF]/70">{formatNumber(author.passages)}</div>
                        <div className="text-xs text-[#F5F3EF]/50">passages</div>
                      </div>

                      <motion.div
                        animate={{ rotate: isExpanded ? 180 : 0 }}
                        className="text-[#C9A962]"
                      >
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </motion.div>
                    </button>

                    {/* Works List */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="px-4 pb-4 pt-2 border-t border-[#C9A962]/10">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              {author.works.map(work => (
                                <Link
                                  key={work.title}
                                  href={`/reader?author=${encodeURIComponent(author.name)}&work=${encodeURIComponent(work.title)}`}
                                  className="group flex items-center gap-3 p-3 rounded-lg hover:bg-[#C9A962]/10 transition"
                                >
                                  <div className={`w-10 h-10 rounded-lg ${colors.bg} flex items-center justify-center`}>
                                    <svg className={`w-5 h-5 ${colors.text}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                    </svg>
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="font-medium text-[#F5F3EF] group-hover:text-[#C9A962] transition truncate">
                                      {work.title}
                                    </div>
                                    <div className="text-xs text-[#F5F3EF]/50">
                                      {work.books} {work.books === 1 ? 'book' : 'books'} • {formatNumber(work.passages)} passages • {work.genre}
                                    </div>
                                  </div>
                                  <svg className="w-5 h-5 text-[#C9A962] opacity-0 group-hover:opacity-100 transition" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                  </svg>
                                </Link>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>

            {filteredAuthors.length === 0 && (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">📚</div>
                <h3 className="text-xl text-[#C9A962] mb-2">No authors found</h3>
                <p className="text-[#F5F3EF]/50">Try adjusting your search or filters</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
