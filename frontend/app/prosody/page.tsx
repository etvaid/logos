"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

interface Meter {
  id: string;
  name: string;
  pattern: string;
  language: string;
}

interface Preset {
  id: string;
  text: string;
  meter: string;
  scansion: string;
}

export default function ProsodyPage() {
  const [meters, setMeters] = useState<Meter[]>([]);
  const [presets, setPresets] = useState<Preset[]>([]);
  const [text, setText] = useState("");
  const [language, setLanguage] = useState("greek");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch("https://logos-backend-production-0d96.up.railway.app/prosody/meters").then(r => r.json()),
      fetch("https://logos-backend-production-0d96.up.railway.app/prosody/presets").then(r => r.json())
    ]).then(([m, p]) => {
      setMeters(m.meters || []);
      setPresets(p.presets || []);
    }).catch(console.error);
  }, []);

  const scanText = async () => {
    if (!text.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("https://logos-backend-production-0d96.up.railway.app/prosody/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, language })
      });
      setResult(await res.json());
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const loadPreset = (preset: Preset) => {
    setText(preset.text);
    setResult({
      text: preset.text,
      detected_meter: preset.meter,
      scansion: preset.scansion,
      confidence: 0.95
    });
  };

  return (
    <div className="min-h-screen bg-[#0D0D0F] text-[#F5F3EF]">
      <nav className="border-b border-[#C9A962]/20 p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-[#C9A962]">LOGOS</Link>
          <span className="text-[#F5F3EF]/70">Prosody & Meter</span>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto p-8">
        <h1 className="text-4xl font-bold text-center mb-2">
          <span className="text-[#C9A962]">PROSODY</span>
        </h1>
        <p className="text-center text-[#F5F3EF]/70 mb-8">
          Analyze meter and scansion in Greek and Latin poetry
        </p>

        {/* Scanner */}
        <div className="bg-[#C9A962]/5 rounded-lg p-6 border border-[#C9A962]/20 mb-8">
          <div className="flex gap-4 mb-4">
            <select
              value={language}
              onChange={e => setLanguage(e.target.value)}
              className="px-4 py-2 bg-[#0D0D0F] border border-[#C9A962]/20 rounded-lg"
            >
              <option value="greek">Greek</option>
              <option value="latin">Latin</option>
            </select>
          </div>
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Enter text to scan for meter..."
            className="w-full h-24 px-4 py-3 bg-[#0D0D0F] border border-[#C9A962]/20 rounded-lg font-serif text-lg"
          />
          <button
            onClick={scanText}
            disabled={loading || !text.trim()}
            className="mt-4 w-full py-3 bg-[#C9A962] text-[#0D0D0F] rounded-lg font-semibold disabled:opacity-50"
          >
            {loading ? "Scanning..." : "Scan Meter"}
          </button>
        </div>

        {/* Result */}
        {result && (
          <div className="bg-[#C9A962]/5 rounded-lg p-6 border border-[#C9A962]/20 mb-8">
            <h2 className="text-xl font-semibold text-[#C9A962] mb-4">Scansion Result</h2>
            <div className="font-serif text-xl mb-4">{result.text}</div>
            <div className="font-mono text-lg text-[#C9A962] mb-4">{result.scansion}</div>
            <div className="flex gap-4 text-sm">
              <span>Detected: <span className="text-[#C9A962]">{result.detected_meter}</span></span>
              <span>Confidence: <span className="text-[#C9A962]">{(result.confidence * 100).toFixed(0)}%</span></span>
            </div>
          </div>
        )}

        {/* Presets */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-[#C9A962] mb-4">Famous Lines</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {presets.map(p => (
              <button
                key={p.id}
                onClick={() => loadPreset(p)}
                className="p-4 bg-[#C9A962]/5 border border-[#C9A962]/20 rounded-lg text-left hover:border-[#C9A962]/40"
              >
                <div className="font-serif mb-2">{p.text}</div>
                <div className="font-mono text-xs text-[#C9A962]">{p.scansion}</div>
                <div className="text-xs text-[#F5F3EF]/50 mt-1 capitalize">{p.meter}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Meter Reference */}
        <div>
          <h2 className="text-xl font-semibold text-[#C9A962] mb-4">Meter Reference</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {meters.map(m => (
              <div key={m.id} className="p-4 bg-[#C9A962]/5 border border-[#C9A962]/20 rounded-lg">
                <h3 className="font-semibold text-[#C9A962]">{m.name}</h3>
                <div className="font-mono text-sm mt-2 text-[#F5F3EF]/70">{m.pattern}</div>
                <div className="text-xs text-[#F5F3EF]/50 mt-1 capitalize">{m.language}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}