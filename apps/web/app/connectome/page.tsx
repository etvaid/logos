"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

interface Node {
  id: string;
  label: string;
  size: number;
}

interface InfluenceAuthor {
  author: string;
  influence_score: number;
}

export default function ConnectomePage() {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [influence, setInfluence] = useState<InfluenceAuthor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("http://localhost:8001/connectome/network?limit=50").then(r => r.json()),
      fetch("http://localhost:8001/connectome/influence").then(r => r.json())
    ]).then(([network, inf]) => {
      setNodes(network.nodes || []);
      setInfluence(inf.authors || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-[#0D0D0F] text-[#F5F3EF]">
      <nav className="border-b border-[#C9A962]/20 p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-[#C9A962]">LOGOS</Link>
          <span className="text-[#F5F3EF]/70">Connectome - Intertextuality</span>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-8">
        <h1 className="text-4xl font-bold text-center mb-2">
          <span className="text-[#C9A962]">CONNECTOME</span>
        </h1>
        <p className="text-center text-[#F5F3EF]/70 mb-8">
          Explore the network of textual connections and influence
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Influence Ranking */}
          <div className="bg-[#C9A962]/5 rounded-lg p-6 border border-[#C9A962]/20">
            <h2 className="text-xl font-semibold text-[#C9A962] mb-4">Influence Ranking</h2>
            {loading ? (
              <p className="text-[#F5F3EF]/50">Loading...</p>
            ) : (
              <div className="space-y-3">
                {influence.map((author, i) => (
                  <div key={author.author} className="flex items-center gap-3">
                    <span className="text-2xl font-bold text-[#C9A962]/50 w-8">{i + 1}</span>
                    <div className="flex-1">
                      <Link 
                        href={`/authors?name=${encodeURIComponent(author.author)}`}
                        className="font-medium hover:text-[#C9A962]"
                      >
                        {author.author}
                      </Link>
                      <div className="w-full bg-[#C9A962]/10 rounded-full h-2 mt-1">
                        <div 
                          className="bg-[#C9A962] h-2 rounded-full"
                          style={{ width: `${author.influence_score * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    <span className="text-sm text-[#F5F3EF]/50">
                      {(author.influence_score * 100).toFixed(0)}%
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Author Network */}
          <div className="bg-[#C9A962]/5 rounded-lg p-6 border border-[#C9A962]/20">
            <h2 className="text-xl font-semibold text-[#C9A962] mb-4">Author Network</h2>
            {loading ? (
              <p className="text-[#F5F3EF]/50">Loading...</p>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {nodes.map(node => (
                  <div key={node.id} className="flex justify-between items-center p-2 hover:bg-[#C9A962]/10 rounded">
                    <Link 
                      href={`/works?author=${encodeURIComponent(node.label)}`}
                      className="hover:text-[#C9A962]"
                    >
                      {node.label}
                    </Link>
                    <span className="text-sm text-[#F5F3EF]/50">{node.size} works</span>
                  </div>
                ))}
              </div>
            )}
            <p className="text-xs text-[#F5F3EF]/30 mt-4">
              Full network visualization requires react-force-graph
            </p>
          </div>
        </div>

        {/* Connection Types */}
        <div className="mt-8 bg-[#C9A962]/5 rounded-lg p-6 border border-[#C9A962]/20">
          <h2 className="text-xl font-semibold text-[#C9A962] mb-4">Connection Types</h2>
          <div className="grid md:grid-cols-4 gap-4">
            {[
              { type: "Direct Quote", desc: "Verbatim or near-verbatim borrowing" },
              { type: "Allusion", desc: "Indirect reference to another text" },
              { type: "Imitation", desc: "Stylistic modeling on another author" },
              { type: "Response", desc: "Direct engagement with prior work" }
            ].map(conn => (
              <div key={conn.type} className="p-3 bg-[#0D0D0F] rounded-lg">
                <h3 className="font-semibold text-[#C9A962] text-sm">{conn.type}</h3>
                <p className="text-xs text-[#F5F3EF]/50 mt-1">{conn.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
