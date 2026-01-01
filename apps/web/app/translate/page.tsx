"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Style {
  id: string;
  name: string;
  description: string;
}

interface TranslationResult {
  source: string;
  translation: string;
  style: string;
  style_name: string;
  source_lang: string;
  target_lang: string;
}

export default function TranslatePage() {
  const [styles, setStyles] = useState<Style[]>([]);
  const [selectedStyle, setSelectedStyle] = useState("literary");
  const [sourceLang, setSourceLang] = useState("greek");
  const [inputText, setInputText] = useState("");
  const [result, setResult] = useState<TranslationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch available styles
  useEffect(() => {
    fetch("http://localhost:8001/translate/styles")
      .then(res => res.json())
      .then(data => setStyles(data.styles || []))
      .catch(err => console.error("Failed to load styles:", err));
  }, []);

  // Handle translation
  const handleTranslate = async () => {
    if (!inputText.trim()) return;
    
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("http://localhost:8001/translate/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: inputText,
          source_lang: sourceLang,
          target_lang: "english",
          style: selectedStyle
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      
      if (data.error) {
        setError(data.error);
      } else {
        setResult(data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Translation failed");
    } finally {
      setLoading(false);
    }
  };

  // Sample texts
  const sampleTexts = {
    greek: "μῆνιν ἄειδε θεὰ Πηληϊάδεω Ἀχιλῆος οὐλομένην, ἣ μυρί᾽ Ἀχαιοῖς ἄλγε᾽ ἔθηκε",
    latin: "Arma virumque cano, Troiae qui primus ab oris Italiam fato profugus Laviniaque venit litora",
    hebrew: "בְּרֵאשִׁית בָּרָא אֱלֹהִים אֵת הַשָּׁמַיִם וְאֵת הָאָרֶץ"
  };

  return (
    <div className="min-h-screen bg-[#0D0D0F] text-[#F5F3EF]">
      {/* Navigation */}
      <nav className="border-b border-[#C9A962]/20 p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-[#C9A962] hover:text-[#F5F3EF] transition">
            LOGOS
          </Link>
          <span className="text-[#F5F3EF]/70">AI Translation</span>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">
            <span className="text-[#C9A962]">TRANSLATE</span>
          </h1>
          <p className="text-[#F5F3EF]/70">
            AI-powered translation with 4 distinct scholarly styles
          </p>
        </div>

        {/* Controls */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Source Language */}
          <div>
            <label className="block text-sm text-[#C9A962] mb-2">Source Language</label>
            <select
              value={sourceLang}
              onChange={e => setSourceLang(e.target.value)}
              className="w-full px-4 py-3 bg-[#0D0D0F] border border-[#C9A962]/20 rounded-lg focus:border-[#C9A962] outline-none"
            >
              <option value="greek">Ancient Greek</option>
              <option value="latin">Latin</option>
              <option value="hebrew">Biblical Hebrew</option>
              <option value="aramaic">Aramaic</option>
            </select>
          </div>

          {/* Translation Style */}
          <div>
            <label className="block text-sm text-[#C9A962] mb-2">Translation Style</label>
            <select
              value={selectedStyle}
              onChange={e => setSelectedStyle(e.target.value)}
              className="w-full px-4 py-3 bg-[#0D0D0F] border border-[#C9A962]/20 rounded-lg focus:border-[#C9A962] outline-none"
            >
              {styles.map(style => (
                <option key={style.id} value={style.id}>
                  {style.name} - {style.description.slice(0, 50)}...
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Style Description */}
        {selectedStyle && styles.length > 0 && (
          <div className="mb-6 p-4 bg-[#C9A962]/5 border border-[#C9A962]/20 rounded-lg">
            <p className="text-sm text-[#F5F3EF]/70">
              {styles.find(s => s.id === selectedStyle)?.description}
            </p>
          </div>
        )}

        {/* Input/Output Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Input */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm text-[#C9A962]">Source Text</label>
              <button
                onClick={() => setInputText(sampleTexts[sourceLang as keyof typeof sampleTexts] || "")}
                className="text-xs text-[#C9A962] hover:text-[#F5F3EF]"
              >
                Load Sample
              </button>
            </div>
            <textarea
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              placeholder={`Enter ${sourceLang} text to translate...`}
              className="w-full h-48 px-4 py-3 bg-[#0D0D0F] border border-[#C9A962]/20 rounded-lg font-serif text-lg focus:border-[#C9A962] outline-none resize-none"
            />
          </div>

          {/* Output */}
          <div>
            <label className="block text-sm text-[#C9A962] mb-2">Translation</label>
            <div className="w-full h-48 px-4 py-3 bg-[#0D0D0F] border border-[#C9A962]/20 rounded-lg overflow-auto">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin h-8 w-8 border-2 border-[#C9A962] border-t-transparent rounded-full" />
                </div>
              ) : error ? (
                <p className="text-red-400">{error}</p>
              ) : result ? (
                <div>
                  <p className="font-serif text-lg leading-relaxed">{result.translation}</p>
                  <p className="mt-4 text-xs text-[#F5F3EF]/50">
                    Style: {result.style_name}
                  </p>
                </div>
              ) : (
                <p className="text-[#F5F3EF]/30">Translation will appear here...</p>
              )}
            </div>
          </div>
        </div>

        {/* Translate Button */}
        <button
          onClick={handleTranslate}
          disabled={loading || !inputText.trim()}
          className="w-full py-4 bg-[#C9A962] text-[#0D0D0F] rounded-lg font-bold text-lg hover:bg-[#F5F3EF] transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Translating..." : "Translate"}
        </button>

        {/* Style Cards */}
        <div className="mt-12">
          <h2 className="text-xl font-semibold text-[#C9A962] mb-4">Translation Styles</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {styles.map(style => (
              <button
                key={style.id}
                onClick={() => setSelectedStyle(style.id)}
                className={`p-4 text-left rounded-lg border transition ${
                  selectedStyle === style.id
                    ? "bg-[#C9A962]/20 border-[#C9A962]"
                    : "bg-[#C9A962]/5 border-[#C9A962]/20 hover:border-[#C9A962]/40"
                }`}
              >
                <h3 className="font-semibold text-[#C9A962]">{style.name}</h3>
                <p className="text-sm text-[#F5F3EF]/70 mt-1">{style.description}</p>
              </button>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}