"use client";
import { useState } from "react";
import Link from "next/link";

export default function TranslatePage() {
  const [text, setText] = useState("");
  const [sourceLang, setSourceLang] = useState("greek");
  const [style, setStyle] = useState("literal");
  const [translation, setTranslation] = useState("");
  const [loading, setLoading] = useState(false);

  const translate = async () => {
    if (!text.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8001/translate/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: text.trim(),
          source_lang: sourceLang,
          target_lang: "english",
          style
        })
      });
      const data = await res.json();
      setTranslation(data.translation || data.message || "Translation pending");
    } catch (e) {
      setTranslation("Error connecting to translation service");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0D0D0F] text-[#F5F3EF]">
      <nav className="border-b border-[#C9A962]/20 p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-[#C9A962]">LOGOS</Link>
          <span className="text-[#F5F3EF]/70">Translate</span>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto p-8">
        <h1 className="text-4xl font-bold text-center text-[#C9A962] mb-8">AI Translation</h1>

        <div className="flex gap-4 mb-4">
          <select
            value={sourceLang}
            onChange={e => setSourceLang(e.target.value)}
            className="px-4 py-2 bg-[#C9A962]/5 border border-[#C9A962]/20 rounded-lg"
          >
            <option value="greek">Greek</option>
            <option value="latin">Latin</option>
          </select>
          <select
            value={style}
            onChange={e => setStyle(e.target.value)}
            className="px-4 py-2 bg-[#C9A962]/5 border border-[#C9A962]/20 rounded-lg"
          >
            <option value="literal">Literal</option>
            <option value="literary">Literary</option>
            <option value="student">Student</option>
            <option value="scholarly">Scholarly</option>
          </select>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm text-[#F5F3EF]/70 mb-2">Source Text</label>
            <textarea
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder="Enter Greek or Latin text..."
              className="w-full h-48 px-4 py-3 bg-[#C9A962]/5 border border-[#C9A962]/20 rounded-lg focus:border-[#C9A962] outline-none font-serif text-lg"
            />
          </div>
          <div>
            <label className="block text-sm text-[#F5F3EF]/70 mb-2">Translation</label>
            <div className="w-full h-48 px-4 py-3 bg-[#C9A962]/5 border border-[#C9A962]/20 rounded-lg overflow-y-auto">
              {translation || <span className="text-[#F5F3EF]/50">Translation will appear here</span>}
            </div>
          </div>
        </div>

        <button
          onClick={translate}
          disabled={loading || !text.trim()}
          className="w-full py-3 bg-[#C9A962] text-[#0D0D0F] rounded-lg font-semibold hover:bg-[#C9A962]/80 disabled:opacity-50"
        >
          {loading ? "Translating..." : "Translate"}
        </button>
      </div>
    </div>
  );
}
