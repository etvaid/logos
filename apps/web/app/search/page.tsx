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
  { id: 11, author: "Euripides", work: "Medea", book: "214", text: "ἀλλ᾽ οὐ ταὐτὸν ἀνδράσιν τε καὶ γυναιξὶ κεῖται νόμος", translation: "But the same law does not apply to men and women", era: "classical", language: "greek", topics: ["tragedy", "justice", "gender"], manuscript: "Parisinus suppl. gr. 468", variants: ["ταὐτὸν: ταὐτὰ P", "νόμος: θεσμός A"], lemma: ["αὐτός", "ἀνήρ", "γυνή"], embeddings: [0.7, 0.7, 0.6], semanticDrift: ["law→custom", "man→male"] }
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


const LogoDesignSystem = () => {
  const [selectedPassageId, setSelectedPassageId] = useState<number | null>(null);

  const handlePassageClick = useCallback((id: number) => {
    setSelectedPassageId(id);
  }, []);

  const selectedPassage = useMemo(() => {
    return PASSAGES.find((passage) => passage.id === selectedPassageId);
  }, [selectedPassageId]);

  return (
    <div style={{ backgroundColor: '#0D0D0F', color: '#F5F4F2', fontFamily: 'sans-serif', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px', transition: 'background-color 0.3s ease, color 0.3s ease' }}>
      <header style={{ marginBottom: '20px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.5em', fontWeight: 'bold', color: '#C9A227', transition: 'color 0.3s ease' }}>Logos Professional Design System</h1>
        <p style={{ color: '#9CA3AF', fontSize: '1.1em', transition: 'color 0.3s ease' }}>Ancient Texts Explorer</p>
      </header>

      <main style={{ display: 'flex', width: '100%', maxWidth: '1200px', gap: '20px' }}>
        <div style={{ flex: '1', backgroundColor: '#1E1E24', borderRadius: '8px', padding: '20px', overflowY: 'auto', maxHeight: '600px', transition: 'background-color 0.3s ease' }}>
          <h2 style={{ fontSize: '1.6em', fontWeight: 'bold', marginBottom: '15px', borderBottom: '1px solid #6B7280', paddingBottom: '5px', color: '#F5F4F2', transition: 'color 0.3s ease' }}>Passages</h2>
          <ul style={{ listStyleType: 'none', padding: 0, margin: 0 }}>
            {PASSAGES.map((passage) => (
              <li key={passage.id} style={{ marginBottom: '10px', padding: '12px', borderRadius: '6px', backgroundColor: selectedPassageId === passage.id ? '#141419' : 'transparent', cursor: 'pointer', transition: 'background-color 0.3s ease, transform 0.2s ease' }} onClick={() => handlePassageClick(passage.id)}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 'bold', color: '#F5F4F2', transition: 'color 0.3s ease' }}>{passage.author} - {passage.work} ({passage.book})</span>
                  <span style={{ color: EraColors[passage.era.toLowerCase()] || '#9CA3AF', fontSize: '0.9em', fontWeight: 'bold', transition: 'color 0.3s ease' }}>{passage.era}</span>
                </div>
                <p style={{ color: '#9CA3AF', fontSize: '0.9em', marginTop: '5px', transition: 'color 0.3s ease' }}>{passage.text.substring(0, 75)}...</p>
              </li>
            ))}
          </ul>
        </div>

        <div style={{ flex: '2', backgroundColor: '#1E1E24', borderRadius: '8px', padding: '20px', transition: 'background-color 0.3s ease' }}>
          {selectedPassage ? (
            <>
              <h2 style={{ fontSize: '1.6em', fontWeight: 'bold', marginBottom: '15px', borderBottom: '1px solid #6B7280', paddingBottom: '5px', color: '#F5F4F2', transition: 'color 0.3s ease' }}>
                {selectedPassage.author} - {selectedPassage.work} ({selectedPassage.book})
              </h2>

              <div style={{ marginBottom: '15px' }}>
                <h3 style={{ fontSize: '1.2em', fontWeight: 'bold', color: '#F5F4F2', transition: 'color 0.3s ease' }}>Original Text</h3>
                <p style={{ color: LanguageColors[selectedPassage.language] || '#F5F4F2', fontSize: '1.1em', lineHeight: '1.6', transition: 'color 0.3s ease' }}>
                  {selectedPassage.language === 'greek' ? 'Α' : 'L'} {selectedPassage.text}
                </p>
              </div>

              <div style={{ marginBottom: '15px' }}>
                <h3 style={{ fontSize: '1.2em', fontWeight: 'bold', color: '#F5F4F2', transition: 'color 0.3s ease' }}>Translation</h3>
                <p style={{ color: '#9CA3AF', fontSize: '1.1em', lineHeight: '1.6', transition: 'color 0.3s ease' }}>{selectedPassage.translation}</p>
              </div>

              <div style={{ marginBottom: '15px' }}>
                <h3 style={{ fontSize: '1.2em', fontWeight: 'bold', color: '#F5F4F2', transition: 'color 0.3s ease' }}>Details</h3>
                <p style={{ color: '#9CA3AF', transition: 'color 0.3s ease' }}>
                  <strong style={{ color: '#F5F4F2', fontWeight: 'bold', transition: 'color 0.3s ease' }}>Era:</strong> <span style={{ color: EraColors[selectedPassage.era.toLowerCase()] || '#9CA3AF', fontWeight: 'bold', transition: 'color 0.3s ease' }}>{selectedPassage.era}</span>
                  <br />
                  <strong style={{ color: '#F5F4F2', fontWeight: 'bold', transition: 'color 0.3s ease' }}>Topics:</strong> {selectedPassage.topics.join(', ')}
                  <br />
                  <strong style={{ color: '#F5F4F2', fontWeight: 'bold', transition: 'color 0.3s ease' }}>Manuscript:</strong> {selectedPassage.manuscript}
                </p>
              </div>

              <div>
                <h3 style={{ fontSize: '1.2em', fontWeight: 'bold', color: '#F5F4F2', transition: 'color 0.3s ease' }}>Variants</h3>
                <ul style={{ listStyleType: 'none', padding: 0 }}>
                  {selectedPassage.variants.map((variant, index) => (
                    <li key={index} style={{ color: '#9CA3AF', marginBottom: '5px', transition: 'color 0.3s ease' }}>{variant}</li>
                  ))}
                </ul>
              </div>
            </>
          ) : (
            <p style={{ color: '#9CA3AF', fontSize: '1.1em', textAlign: 'center', transition: 'color 0.3s ease' }}>Select a passage to view details.</p>
          )}
        </div>
      </main>

      <footer style={{ marginTop: '30px', textAlign: 'center', color: '#6B7280', transition: 'color 0.3s ease' }}>
        <p>&copy; 2024 Logos Design System</p>
      </footer>
    </div>
  );
};

export default LogoDesignSystem;