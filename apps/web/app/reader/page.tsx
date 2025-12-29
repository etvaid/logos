"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

interface Work {
  urn: string;
  author: string;
  title: string;
  language: string;
  passage_count: number;
}

interface TextLine {
  id: number;
  text: string;
  reference: string;
}

interface Morphology {
  word: string;
  lemma: string;
  pos: string;
  case?: string;
  number?: string;
  gender?: string;
  definition: string;
}

export default function ReaderPage() {
  const [works, setWorks] = useState<Work[]>([]);
  const [selectedWork, setSelectedWork] = useState<string>("");
  const [lines, setLines] = useState<TextLine[]>([]);
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [morphology, setMorphology] = useState<Morphology | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8001/reader/works")
      .then(r => r.json())
      .then(data => {
        setWorks(data.works || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const loadText = async (urn: string) => {
    setSelectedWork(urn);
    const res = await fetch(`http://localhost:8001/reader/work/${encodeURIComponent(urn)}/text`);
    const data = await res.json();
    setLines(data.lines || []);
  };

  const handleWordClick = async (word: string) => {
    const cleanWord = word.replace(/[.,;:!?]/g, "").trim();
    if (!cleanWord) return;
    setSelectedWord(cleanWord);
    const res = await fetch(`http://localhost:8001/reader/word/${encodeURIComponent(cleanWord)}/morphology`);
    setMorphology(await res.json());
  };

  return (
    <div className="min-h-screen bg-[#0D0D0F] text-[#F5F3EF]">
      <nav className="border-b border-[#C9A962]/20 p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-[#C9A962]">LOGOS</Link>
          <span className="text-[#F5F3EF]/70">Reader</span>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-4 flex gap-4">
        {/* Works sidebar */}
        <div className="w-64 shrink-0">
          <h2 className="text-lg font-semibold text-[#C9A962] mb-4">Works</h2>
          <div className="space-y-2 max-h-[70vh] overflow-y-auto">
            {loading ? (
              <p className="text-[#F5F3EF]/50">Loading...</p>
            ) : works.length === 0 ? (
              <p className="text-[#F5F3EF]/50">No works found. Database may be empty.</p>
            ) : (
              works.slice(0, 50).map(w => (
                <button
                  key={w.urn}
                  onClick={() => loadText(w.urn)}
                  className={`w-full text-left p-2 rounded text-sm ${
                    selectedWork === w.urn 
                      ? "bg-[#C9A962]/20 text-[#C9A962]" 
                      : "hover:bg-[#C9A962]/10"
                  }`}
                >
                  <div className="font-medium">{w.title || "Untitled"}</div>
                  <div className="text-xs text-[#F5F3EF]/50">{w.author}</div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Text area */}
        <div className="flex-1 bg-[#C9A962]/5 rounded-lg p-6 min-h-[70vh]">
          {lines.length === 0 ? (
            <p className="text-[#F5F3EF]/50">Select a work to start reading</p>
          ) : (
            <div className="space-y-4 font-serif text-lg">
              {lines.map(line => (
                <p key={line.id} className="leading-relaxed">
                  <span className="text-[#C9A962]/50 text-sm mr-4">{line.reference}</span>
                  {line.text.split(/\s+/).map((word, i) => (
                    <span
                      key={i}
                      onClick={() => handleWordClick(word)}
                      className="cursor-pointer hover:text-[#C9A962] hover:underline"
                    >
                      {word}{" "}
                    </span>
                  ))}
                </p>
              ))}
            </div>
          )}
        </div>

        {/* Morphology panel */}
        {morphology && (
          <div className="w-72 shrink-0 bg-[#C9A962]/5 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-[#C9A962] mb-4">{morphology.word}</h3>
            <div className="space-y-2 text-sm">
              <div><span className="text-[#F5F3EF]/50">Lemma:</span> {morphology.lemma}</div>
              <div><span className="text-[#F5F3EF]/50">POS:</span> {morphology.pos}</div>
              {morphology.case && <div><span className="text-[#F5F3EF]/50">Case:</span> {morphology.case}</div>}
              {morphology.number && <div><span className="text-[#F5F3EF]/50">Number:</span> {morphology.number}</div>}
              {morphology.gender && <div><span className="text-[#F5F3EF]/50">Gender:</span> {morphology.gender}</div>}
              <div className="pt-2 border-t border-[#C9A962]/20">
                <span className="text-[#F5F3EF]/50">Definition:</span>
                <p className="mt-1">{morphology.definition}</p>
              </div>
            </div>
            <Link 
              href={`/semantia?word=${morphology.word}`}
              className="block mt-4 text-center py-2 bg-[#C9A962]/20 rounded text-[#C9A962] text-sm hover:bg-[#C9A962]/30"
            >
              View in SEMANTIA
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
