"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

interface City {
  name: string;
  lat: number;
  lon: number;
  founded: number;
  population_peak: number;
}

interface Journey {
  id: string;
  name: string;
  points: number;
}

interface Event {
  year: number;
  name: string;
  category: string;
}

export default function MapsPage() {
  const [year, setYear] = useState(-400);
  const [cities, setCities] = useState<City[]>([]);
  const [journeys, setJourneys] = useState<Journey[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [activeLayer, setActiveLayer] = useState<string>("cities");

  useEffect(() => {
    Promise.all([
      fetch("http://localhost:8001/atlas/cities").then(r => r.json()),
      fetch("http://localhost:8001/atlas/journeys").then(r => r.json()),
      fetch("http://localhost:8001/atlas/timeline/events").then(r => r.json())
    ]).then(([c, j, e]) => {
      setCities(c.cities || []);
      setJourneys(j.journeys || []);
      setEvents(e.events || []);
    }).catch(console.error);
  }, []);

  const yearDisplay = year > 0 ? `${year} CE` : `${Math.abs(year)} BCE`;

  return (
    <div className="min-h-screen bg-[#0D0D0F] text-[#F5F3EF]">
      <nav className="border-b border-[#C9A962]/20 p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-[#C9A962]">LOGOS</Link>
          <span className="text-[#F5F3EF]/70">Atlas</span>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-4">
        <div className="flex gap-4 h-[calc(100vh-120px)]">
          {/* Map Area */}
          <div className="flex-1 bg-[#C9A962]/5 rounded-lg border border-[#C9A962]/20 relative overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <p className="text-[#F5F3EF]/30 text-lg mb-2">Interactive Map</p>
                <p className="text-[#F5F3EF]/50 text-sm">Requires Leaflet/Mapbox integration</p>
                <p className="text-[#C9A962] mt-4 text-2xl">{yearDisplay}</p>
              </div>
            </div>
            
            {/* City markers (simplified) */}
            <div className="absolute bottom-4 left-4 bg-[#0D0D0F]/80 p-3 rounded-lg max-h-48 overflow-y-auto">
              <h3 className="text-sm font-semibold text-[#C9A962] mb-2">Major Cities</h3>
              {cities.slice(0, 5).map(city => (
                <div key={city.name} className="text-xs text-[#F5F3EF]/70 py-1">
                  📍 {city.name} (founded {Math.abs(city.founded)} BCE)
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="w-80 space-y-4">
            {/* Year Slider */}
            <div className="bg-[#C9A962]/5 rounded-lg p-4 border border-[#C9A962]/20">
              <h3 className="text-sm font-semibold text-[#C9A962] mb-2">Time Period</h3>
              <input
                type="range"
                min="-800"
                max="600"
                value={year}
                onChange={e => setYear(parseInt(e.target.value))}
                className="w-full"
              />
              <p className="text-center text-lg mt-2">{yearDisplay}</p>
            </div>

            {/* Layers */}
            <div className="bg-[#C9A962]/5 rounded-lg p-4 border border-[#C9A962]/20">
              <h3 className="text-sm font-semibold text-[#C9A962] mb-2">Layers</h3>
              {["cities", "political", "authors", "journeys", "sites"].map(layer => (
                <label key={layer} className="flex items-center gap-2 py-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={activeLayer === layer}
                    onChange={() => setActiveLayer(layer)}
                    className="rounded"
                  />
                  <span className="capitalize text-sm">{layer}</span>
                </label>
              ))}
            </div>

            {/* Famous Journeys */}
            <div className="bg-[#C9A962]/5 rounded-lg p-4 border border-[#C9A962]/20">
              <h3 className="text-sm font-semibold text-[#C9A962] mb-2">Famous Journeys</h3>
              {journeys.map(j => (
                <button
                  key={j.id}
                  className="w-full text-left p-2 hover:bg-[#C9A962]/10 rounded text-sm"
                >
                  {j.name}
                  <span className="text-[#F5F3EF]/30 ml-2">({j.points} pts)</span>
                </button>
              ))}
            </div>

            {/* Events at Year */}
            <div className="bg-[#C9A962]/5 rounded-lg p-4 border border-[#C9A962]/20">
              <h3 className="text-sm font-semibold text-[#C9A962] mb-2">Nearby Events</h3>
              {events
                .filter(e => Math.abs(e.year - year) < 50)
                .slice(0, 5)
                .map(e => (
                  <div key={e.name} className="text-xs py-1">
                    <span className="text-[#C9A962]">{e.year > 0 ? e.year : Math.abs(e.year) + " BCE"}</span>
                    <span className="text-[#F5F3EF]/70 ml-2">{e.name}</span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
