'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';

const PASSAGES = [
  { id: 1, author: "Homer", work: "Iliad", book: "1.1-5", text: "Μῆνιν ἄειδε θεὰ Πηληϊάδεω Ἀχιλῆος οὐλομένην, ἣ μυρί᾽ Ἀχαιοῖς ἄλγε᾽ ἔθηκε", translation: "Sing, O goddess, the anger of Achilles son of Peleus, that brought countless ills upon the Achaeans", era: "archaic", language: "greek", topics: ["epic", "war", "heroism"], manuscript: "Venetus A", variants: ["Μῆνιν: μῆνις codd. alii", "οὐλομένην: ὀλομένην Zen.", "ἄλγε᾽: ἄλγεα rec."], lemma: ["Μῆνις", "ἄειδω", "θεός"], embeddings: [0.8, 0.6, 0.9], semanticDrift: ["wrath→anger", "sing→hymn"] },
  { id: 2, author: "Homer", work: "Odyssey", book: "1.1-4", text: "Ἄνδρα μοι ἔννεπε, μοῦσα, πολύτροπον, ὃς μάλα πολλὰ πλάγχθη", translation: "Tell me, O muse, of that ingenious hero who traveled far and wide after he had sacked Troy", era: "archaic", language: "greek", topics: ["epic", "journey", "heroism"], manuscript: "Laurentianus", variants: ["πολύτροπον: πολύφρονα sch.", "πλάγχθη: πλανήθη A"], lemma: ["ἀνήρ", "ἔννεπω", "πολύτροπος"], embeddings: [0.9, 0.7, 0.8], semanticDrift: ["man→hero", "tell→sing"] },
  { id: 3, author: "Plato", work: "Republic", book: "514a", text: "Μετὰ ταῦτα δή, εἶπον, ἀπείκασον τοιούτῳ πάθει τὴν ἡμετέραν φύσιν παιδείας τε πέρι καὶ ἀπαιδευσίας", translation: "Next, I said, compare our nature in respect of education and its lack to such an experience as this", era: "classical", language: "greek", topics: ["philosophy", "education", "allegory"], manuscript: "Parisinus gr. 1807", variants: ["ἀπείκασον: εἴκασον A", "πάθει: παθήματι B"], lemma: ["ἀπεικάζω", "φύσις", "παιδεία"], embeddings: [0.7, 0.8, 0.9], semanticDrift: ["nature→essence", "education→culture"] },
  { id: 4, author: "Plato", work: "Apology", book: "21d", text: "ἓν οἶδα ὅτι οὐδὲν οἶδα. τοῦτο γάρ που καὶ πρὸς τὸν θεὸν ἁμαρτάνειν ἂν εἴη", translation: "I know one thing: that I know nothing. For this would perhaps be sinning against the god", era: "classical", language: "greek", topics: ["philosophy", "wisdom", "knowledge"], manuscript: "Bodleianus", variants: ["οὐδὲν: οὐδέν τι B", "ἁμαρτάνειν: ἁμαρτεῖν T"], lemma: ["οἶδα", "οὐδείς", "θεός"], embeddings: [0.9, 0.6, 0.7], semanticDrift: ["know→understand", "god→divine"] },
  { id: 5, author: "Aristotle", work: "Nicomachean Ethics", book: "1094a", text: "Πᾶσα τέχνη καὶ πᾶσα μέθοδος, ὁμοίως δὲ πρᾶξίς τε καὶ προαίρεσις, ἀγαθοῦ τινὸς ἐφίεσθαι δοκεῖ", translation: "Every art and every inquiry, and similarly every action and pursuit, is thought to aim at some good", era: "classical", language: "greek", topics: ["philosophy", "ethics", "virtue"], manuscript: "Laurentianus", variants: ["ὁμοίως: ὁμοίως om. K", "ἐφίεσθαι: ἐφιέμενα L"], lemma: ["τέχνη", "μέθοδος", "ἀγαθός"], embeddings: [0.8, 0.7, 0.9], semanticDrift: ["art→skill", "good→virtue"] },
  { id: 6, author: "Virgil", work: "Aeneid", book: "1.1-4", text: "Arma virumque cano, Troiae qui primus ab oris Italiam, fato profugus, Laviniaque venit litora", translation: "I sing of arms and the man, who first from the shores of Troy, exiled by fate, came to Italy and the Lavinian shores", era: "imperial", language: "latin", topics: ["epic", "war", "founding"], manuscript: "Mediceus", variants: ["Laviniaque: Lavinia quoque γ", "profugus: perfugus P"], lemma: ["arma", "vir", "cano"], embeddings: [0.9, 0.8, 0.7], semanticDrift: ["arms→warfare", "man→hero"] },
  { id: 7, author: "Cicero", work: "In Catilinam", book: "1.1", text: "Quo usque tandem abutere, Catilina, patientia nostra? quam diu etiam furor iste tuus nos eludet?", translation: "How long, O Catiline, will you abuse our patience? How long will that frenzy of yours mock us?", era: "imperial", language: "latin", topics: ["rhetoric", "politics", "oratory"], manuscript: "Palatinus", variants: ["abutere: abuteris P", "furor: fervor F"], lemma: ["abutor", "patientia", "furor"], embeddings: [0.7, 0.6, 0.8], semanticDrift: ["abuse→misuse", "patience→tolerance"] },
  { id: 8, author: "Seneca", work: "Epistulae", book: "1.1", text: "Ita fac, mi Lucili: vindica te tibi, et tempus quod adhuc aut auferebatur aut subripiebatur aut excidebat collige et serva", translation: "Do this, my dear Lucilius: claim yourself for yourself, and time that has until now been taken away, stolen, or lost, gather and preserve", era: "imperial", language: "latin", topics: ["philosophy", "stoicism", "ethics"], manuscript: "Quirinianus", variants: ["adhuc: ad huc Q", "serva: conserva C"], lemma: ["vindico", "tempus", "colligo"], embeddings: [0.8, 0.9, 0.7], semanticDrift: ["claim→assert", "time→moment"] },
  { id: 9, author: "Augustine", work: "Confessiones", book: "1.1", text: "Magnus es, Domine, et laudabilis valde: magna virtus tua, et sapientiae tuae non est numerus", translation: "Great are you, O Lord, and greatly to be praised; great is your power, and of your wisdom there is no measure", era: "lateAntique", language: "latin", topics: ["theology", "confession", "Christianity"], manuscript: "Sessorianus", variants: ["laudabilis: laudandus S", "numerus: terminus T"], lemma: ["magnus", "virtus", "sapientia"], embeddings: [0.9, 0.8, 0.9], semanticDrift: ["great→magnificent", "wisdom→knowledge"] },
  { id: 10, author: "Sophocles", work: "Antigone", book: "332", text: "Πολλὰ τὰ δεινὰ κοὐδὲν ἀνθρώπου δεινότερον πέλει. τοῦτο καὶ πολιοῦ πέραν πόντου", translation: "Many wonders there are, but none more wondrous than man. This being crosses even the gray sea", era: "classical", language: "greek", topics: ["tragedy", "human nature", "wonder"], manuscript: "Laurentianus", variants: ["δεινὰ: δεινότερα L", "πέλει: ἔφυ Brunck"], lemma: ["πολύς", "δεινός", "ἄνθρωπος"], embeddings: [0.6, 0.9, 0.8], semanticDrift: ["wonder→terrible", "man→mortal"] },
  { id: 11, author: "Euripides", work: "Medea", book: "214", text: "ἀλλ᾽ οὐ ταὐτὸν ἀνδράσιν τε καὶ γυναιξὶ κεῖται νόμος", translation: "But the same law does not apply to men and women", era: "classical", language: "greek", topics: ["tragedy", "justice", "gender"], manuscript: "Parisinus 2884", variants: ["ταὐτὸν: ταὐτὰ codd.", "νόμος: θεσμός V"], lemma: ["οὐ", "αὐτός", "ἀνήρ"], embeddings: [0.7, 0.5, 0.6], semanticDrift: ["law→custom", "men→humans"] }
];

const EraColors = {
  archaic: "#D97706",
  classical: "#F59E0B",
  hellenistic: "#3B82F6",
  imperial: "#DC2626",
  lateAntique: "#7C3AED",
  byzantine: "#059669",
};

const LanguageColors = {
  greek: "#3B82F6",
  latin: "#DC2626",
};

const LanguageIndicators = {
  greek: "Α",
  latin: "L",
};

function getEraColor(era: string): string {
  return EraColors[era.toLowerCase()] || "#FFFFFF";
}

const PassageCard = ({ passage, isHighlighted }: { passage: any, isHighlighted: boolean }) => {
  const eraColor = getEraColor(passage.era);
  const languageColor = LanguageColors[passage.language];
  const languageIndicator = LanguageIndicators[passage.language];
  const [isHovered, setIsHovered] = useState(false);


  return (
    <div
      style={{
        backgroundColor: '#1E1E24',
        color: '#F5F4F2',
        padding: '1.5rem',
        borderRadius: '0.75rem',
        marginBottom: '1rem',
        transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out, border 0.3s ease-in-out',
        transform: isHovered ? 'scale(1.03)' : 'scale(1)',
        boxShadow: isHovered ? `0 4px 6px -1px rgba(0, 0, 0, 0.2), 0 2px 4px -1px rgba(0, 0, 0, 0.1)` : `0 2px 4px rgba(0, 0, 0, 0.1)`,
        border: isHighlighted ? `2px solid ${languageColor}` : '2px solid transparent',
        cursor: 'pointer',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
        <div style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>
          {passage.author} - {passage.work}
        </div>
        <div style={{
          backgroundColor: eraColor,
          color: '#0D0D0F',
          padding: '0.25rem 0.5rem',
          borderRadius: '0.375rem',
          fontSize: '0.75rem',
          fontWeight: 'bold',
          transition: 'background-color 0.3s ease-in-out',
        }}>
          {passage.era}
        </div>
      </div>

      <div style={{ marginBottom: '0.5rem', fontFamily: 'serif', fontSize: '1.1rem' }}>
        <span style={{ color: languageColor, fontWeight: 'bold', marginRight: '0.25rem' }}>{languageIndicator}:</span>
        {passage.text}
      </div>
      <div style={{ color: '#9CA3AF', marginBottom: '0.75rem' }}>
        {passage.translation}
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', fontSize: '0.875rem', color: '#6B7280' }}>
        {passage.topics.map((topic: string) => (
          <span key={topic} style={{
            backgroundColor: '#141419',
            padding: '0.25rem 0.5rem',
            borderRadius: '0.375rem',
            transition: 'background-color 0.3s ease-in-out',
          }}>
            {topic}
          </span>
        ))}
      </div>
    </div>
  );
};

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEra, setSelectedEra] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('');


  const filteredPassages = useMemo(() => {
    return PASSAGES.filter((passage) => {
      const searchMatch = searchTerm
        ? passage.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        passage.work.toLowerCase().includes(searchTerm.toLowerCase()) ||
        passage.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
        passage.translation.toLowerCase().includes(searchTerm.toLowerCase())
        : true;

      const eraMatch = selectedEra ? passage.era.toLowerCase() === selectedEra.toLowerCase() : true;
      const languageMatch = selectedLanguage ? passage.language.toLowerCase() === selectedLanguage.toLowerCase() : true;

      return searchMatch && eraMatch && languageMatch;
    });
  }, [searchTerm, selectedEra, selectedLanguage]);


  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleEraChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedEra(e.target.value);
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedLanguage(e.target.value);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedEra('');
    setSelectedLanguage('');
  };


  return (
    <div style={{ backgroundColor: '#0D0D0F', color: '#F5F4F2', minHeight: '100vh', padding: '2rem', fontFamily: 'sans-serif' }}>
      <header style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '0.5rem', color: '#C9A227' }}>Logos Professional</h1>
        <p style={{ color: '#9CA3AF', fontSize: '1.25rem' }}>A design system applied to classical text passages.</p>
      </header>

      <section style={{ marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <input
            type="text"
            placeholder="Search passages..."
            value={searchTerm}
            onChange={handleSearchChange}
            style={{
              padding: '0.75rem',
              borderRadius: '0.5rem',
              border: '1px solid #6B7280',
              backgroundColor: '#1E1E24',
              color: '#F5F4F2',
              width: '100%',
              maxWidth: '400px',
              transition: 'border-color 0.3s ease-in-out',
              outline: 'none'
            }}
          />

          <select
            value={selectedEra}
            onChange={handleEraChange}
            style={{
              padding: '0.75rem',
              borderRadius: '0.5rem',
              border: '1px solid #6B7280',
              backgroundColor: '#1E1E24',
              color: '#F5F4F2',
              transition: 'border-color 0.3s ease-in-out',
              outline: 'none'
            }}
          >
            <option value="">All Eras</option>
            {[...new Set(PASSAGES.map((p) => p.era))].sort().map((era) => (
              <option key={era} value={era}>{era}</option>
            ))}
          </select>

          <select
            value={selectedLanguage}
            onChange={handleLanguageChange}
            style={{
              padding: '0.75rem',
              borderRadius: '0.5rem',
              border: '1px solid #6B7280',
              backgroundColor: '#1E1E24',
              color: '#F5F4F2',
              transition: 'border-color 0.3s ease-in-out',
              outline: 'none'
            }}
          >
            <option value="">All Languages</option>
            {[...new Set(PASSAGES.map((p) => p.language))].sort().map((language) => (
              <option key={language} value={language}>{language}</option>
            ))}
          </select>

          <button
            onClick={clearFilters}
            style={{
              backgroundColor: '#6B7280',
              color: '#F5F4F2',
              padding: '0.75rem 1.25rem',
              borderRadius: '0.5rem',
              border: 'none',
              cursor: 'pointer',
              transition: 'background-color 0.3s ease-in-out',
              outline: 'none',
            }}
          >
            Clear Filters
          </button>
        </div>
      </section>

      <main>
        {filteredPassages.length > 0 ? (
          filteredPassages.map((passage) => (
            <PassageCard key={passage.id} passage={passage} isHighlighted={searchTerm !== '' && (passage.author.toLowerCase().includes(searchTerm.toLowerCase()) || passage.work.toLowerCase().includes(searchTerm.toLowerCase()) || passage.text.toLowerCase().includes(searchTerm.toLowerCase()) || passage.translation.toLowerCase().includes(searchTerm.toLowerCase()))} />
          ))
        ) : (
          <p style={{ color: '#9CA3AF', textAlign: 'center' }}>No passages found.</p>
        )}
      </main>

      <footer style={{ marginTop: '2rem', textAlign: 'center', color: '#6B7280', fontSize: '0.875rem' }}>
        &copy; 2024 Logos Professional. All rights reserved.
      </footer>
    </div>
  );
}