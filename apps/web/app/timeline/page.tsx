"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

interface Event {
  year: number;
  name: string;
  category: string;
}

interface AuthorLifespan {
  name: string;
  birth: number;
  death: number;
  language: string;
}

export default function TimelinePage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [authors, setAuthors] = useState<AuthorLifespan[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  useEffect(() => {
    Promise.all([
      fetch("http://localhost:8001/atlas/timeline/events").then(r => r.json()),
      fetch("http://localhost:8001/atlas/timeline/authors").then(r => r.json())
    ]).then(([e, a]) => {
      setEvents(e.events || []);
      setAuthors(a.authors || []);
    }).catch(console.error);
  }, []);

  const categories = ["all", ...new Set(events.map(e => e.category))];
  const filteredEvents = categoryFilter === "all" 
    ? events 
    : events.filter(e => e.category === categoryFilter);

  const formatYear = (year: number) => year > 0 ? `${year} CE` : `${Math.abs(year)} BCE`;

  return (
    <div className="min-h-screen bg-[#0D0D0F] text-[#F5F3EF]">
      <nav className="border-b border-[#C9A962]/20 p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-[#C9A962]">LOGOS</Link>
          <span className="text-[#F5F3EF]/70">Timeline</span>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto p-8">
        <h1 className="text-4xl font-bold text-[#C9A962] mb-8">Historical Timeline</h1>

        {/* Category Filter */}
        <div className="flex gap-2 mb-8 flex-wrap">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-4 py-2 rounded-lg capitalize ${
                categoryFilter === cat
                  ? "bg-[#C9A962] text-[#0D0D0F]"
                  : "bg-[#C9A962]/10 text-[#C9A962]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Events Timeline */}
          <div>
            <h2 className="text-xl font-semibold text-[#C9A962] mb-4">Major Events</h2>
            <div className="relative">
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-[#C9A962]/30"></div>
              <div className="space-y-4">
                {filteredEvents.sort((a, b) => a.year - b.year).map(event => (
                  <div key={event.name} className="relative pl-10">
                    <div className="absolute left-2 w-4 h-4 rounded-full bg-[#C9A962] border-4 border-[#0D0D0F]"></div>
                    <div className="bg-[#C9A962]/5 rounded-lg p-3 border border-[#C9A962]/20">
                      <div className="flex justify-between">
                        <span className="font-semibold">{event.name}</span>
                        <span className="text-[#C9A962] text-sm">{formatYear(event.year)}</span>
                      </div>
                      <span className="text-xs text-[#F5F3EF]/50 capitalize">{event.category}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Author Lifespans */}
          <div>
            <h2 className="text-xl font-semibold text-[#C9A962] mb-4">Author Lifespans</h2>
            <div className="space-y-3">
              {authors.sort((a, b) => a.birth - b.birth).map(author => {
                const lifespan = Math.abs(author.death - author.birth);
                const startPct = ((author.birth + 800) / 1400) * 100;
                const widthPct = (lifespan / 1400) * 100;
                
                return (
                  <div key={author.name} className="relative">
                    <div className="flex justify-between text-sm mb-1">
                      <Link 
                        href={`/authors?name=${encodeURIComponent(author.name)}`}
                        className="hover:text-[#C9A962]"
                      >
                        {author.name}
                      </Link>
                      <span className="text-[#F5F3EF]/50">
                        {formatYear(author.birth)} – {formatYear(author.death)}
                      </span>
                    </div>
                    <div className="h-3 bg-[#C9A962]/10 rounded-full relative">
                      <div
                        className={`absolute h-3 rounded-full ${
                          author.language === "greek" ? "bg-blue-500" : "bg-red-500"
                        }`}
                        style={{ 
                          left: `${Math.max(0, Math.min(100, startPct))}%`,
                          width: `${Math.max(1, Math.min(100 - startPct, widthPct))}%`
                        }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
