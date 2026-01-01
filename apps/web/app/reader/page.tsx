"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

interface Author {
  author: string;
  language: string;
  passage_count: number;
}

interface Work {
  work: string;
  language: string;
  passage_count: number;
}

interface Passage {
  id: string;
  urn: string;
  author: string;
  work: string;
  content: string;
  section: string;
  language: string;
}

export default function ReaderPage() {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [works, setWorks] = useState<Work[]>([]);
  const [passages, setPassages] = useState<Passage[]>([]);
  const [selectedAuthor, setSelectedAuthor] = useState<string>("");
  const [selectedWork, setSelectedWork] = useState<string>("");
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingWorks, setLoadingWorks] = useState(false);
  const [loadingPassages, setLoadingPassages] = useState(false);
  const [searchFilter, setSearchFilter] = useState("");

  useEffect(() => {
    fetch("https://logos-backend-production-0d96.up.railway.app/api/reader/authors")
      .then(r => r.json())
      .then(data => {
        setAuthors(data.authors || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const loadWorks = async (author: string) => {
    setSelectedAuthor(author);
    setSelectedWork("");
    setPassages([]);
    setLoadingWorks(true);

    try {
      const res = await fetch(`https://logos-backend-production-0d96.up.railway.app/api/reader/works/${encodeURIComponent(author)}`);
      const data = await res.json();
      setWorks(data.works || []);
    } catch (e) {
      console.error("Failed to load works:", e);
    }
    setLoadingWorks(false);
  };

  const loadPassages = async (work: string) => {
    setSelectedWork(work);
    setLoadingPassages(true);

    try {
      const res = await fetch(`https://logos-backend-production-0d96.up.railway.app/api/reader/passages/${encodeURIComponent(selectedAuthor)}/${encodeURIComponent(work)}`);
      const data = await res.json();
      setPassages(data.passages || []);
    } catch (e) {
      console.error("Failed to load passages:", e);
    }
    setLoadingPassages(false);
  };

  const handleWordClick = (word: string) => {
    const cleanWord = word.replace(/[.,;:!?'"()]/g, "").trim();
    if (!cleanWord) return;
    setSelectedWord(cleanWord);
  };

  const filteredAuthors = searchFilter
    ? authors.filter(a => a.author.toLowerCase().includes(searchFilter.toLowerCase()))
    : authors;

  return (
    <div className="min-h-screen bg-[#0D0D0F] text-[#F5F3EF]">
      <nav className="border-b border-[#C9A962]/20 p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-[#C9A962] hover:text-[#F5F3EF] transition">
            LOGOS
          </Link>
          <span className="text-[#F5F3EF]/70">Reader</span>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-4 flex gap-4">
        {/* Authors sidebar */}
        <div className="w-56 shrink-0">
          <h2 className="text-lg font-semibold text-[#C9A962] mb-4">Authors</h2>
          <input
            type="text"
            value={searchFilter}
            onChange={e => setSearchFilter(e.target.value)}
            placeholder="Filter authors..."
            className="w-full px-3 py-2 mb-3 bg-[#0D0D0F] border border-[#C9A962]/20 rounded text-sm focus:border-[#C9A962] outline-none"
          />
          <div className="space-y-1 max-h-[65vh] overflow-y-auto">
            {loading ? (
              <p className="text-[#F5F3EF]/50 text-sm">Loading authors...</p>
            ) : filteredAuthors.length === 0 ? (
              <p className="text-[#F5F3EF]/50 text-sm">No authors found</p>
            ) : (
              filteredAuthors.slice(0, 100).map(a => (
                <button
                  key={a.author}
                  onClick={() => loadWorks(a.author)}
                  className={`w-full text-left p-2 rounded text-sm transition ${
                    selectedAuthor === a.author
                      ? "bg-[#C9A962]/20 text-[#C9A962]"
                      : "hover:bg-[#C9A962]/10"
                  }`}
                >
                  <div className="font-medium truncate">{a.author}</div>
                  <div className="text-xs text-[#F5F3EF]/50">
                    {a.passage_count.toLocaleString()} passages • {a.language}
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Works sidebar */}
        <div className="w-48 shrink-0">
          <h2 className="text-lg font-semibold text-[#C9A962] mb-4">Works</h2>
          <div className="space-y-1 max-h-[65vh] overflow-y-auto">
            {loadingWorks ? (
              <p className="text-[#F5F3EF]/50 text-sm">Loading works...</p>
            ) : !selectedAuthor ? (
              <p className="text-[#F5F3EF]/50 text-sm">Select an author</p>
            ) : works.length === 0 ? (
              <p className="text-[#F5F3EF]/50 text-sm">No works found</p>
            ) : (
              works.map(w => (
                <button
                  key={w.work}
                  onClick={() => loadPassages(w.work)}
                  className={`w-full text-left p-2 rounded text-sm transition ${
                    selectedWork === w.work
                      ? "bg-[#C9A962]/20 text-[#C9A962]"
                      : "hover:bg-[#C9A962]/10"
                  }`}
                >
                  <div className="font-medium truncate">{w.work || "Untitled"}</div>
                  <div className="text-xs text-[#F5F3EF]/50">
                    {w.passage_count} passages
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Text area */}
        <div className="flex-1 bg-[#C9A962]/5 rounded-lg p-6 min-h-[70vh]">
          {loadingPassages ? (
            <p className="text-[#F5F3EF]/50">Loading text...</p>
          ) : passages.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-5xl mb-4">📖</div>
              <h3 className="text-xl text-[#C9A962] mb-2">Ancient Text Reader</h3>
              <p className="text-[#F5F3EF]/50">
                Select an author and work to start reading
              </p>
            </div>
          ) : (
            <div className="space-y-6 font-serif text-lg">
              <div className="mb-4 pb-4 border-b border-[#C9A962]/20">
                <h3 className="text-xl text-[#C9A962]">{selectedAuthor}</h3>
                <p className="text-[#F5F3EF]/70">{selectedWork}</p>
              </div>
              {passages.map(p => (
                <div key={p.id} className="leading-relaxed">
                  <span className="text-[#C9A962]/50 text-sm mr-4 font-sans">{p.section}</span>
                  <span className="text-[#F5F3EF]/90">
                    {p.content.split(/\s+/).map((word, i) => (
                      <span
                        key={i}
                        onClick={() => handleWordClick(word)}
                        className={`cursor-pointer hover:text-[#C9A962] hover:underline transition ${
                          selectedWord === word.replace(/[.,;:!?'"()]/g, "") ? "text-[#C9A962] underline" : ""
                        }`}
                      >
                        {word}{" "}
                      </span>
                    ))}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Word panel */}
        {selectedWord && (
          <div className="w-64 shrink-0 bg-[#C9A962]/5 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-[#C9A962] mb-4">{selectedWord}</h3>
            <p className="text-sm text-[#F5F3EF]/70 mb-4">
              Click for detailed analysis
            </p>
            <Link
              href={`/semantia?word=${encodeURIComponent(selectedWord)}`}
              className="block text-center py-2 bg-[#C9A962]/20 rounded text-[#C9A962] text-sm hover:bg-[#C9A962]/30 transition"
            >
              Analyze in SEMANTIA
            </Link>
            <Link
              href={`/search?q=${encodeURIComponent(selectedWord)}`}
              className="block mt-2 text-center py-2 bg-[#C9A962]/10 rounded text-[#C9A962]/70 text-sm hover:bg-[#C9A962]/20 transition"
            >
              Search in Corpus
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
