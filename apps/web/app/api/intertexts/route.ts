import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'https://logos-backend-production-0d96.up.railway.app';

const DEMO_GRAPH = {
  nodes: [
    { id: 'homer-iliad', label: 'Iliad', author: 'Homer', year: -750, size: 100 },
    { id: 'homer-odyssey', label: 'Odyssey', author: 'Homer', year: -725, size: 95 },
    { id: 'hesiod-theogony', label: 'Theogony', author: 'Hesiod', year: -700, size: 60 },
    { id: 'aeschylus-oresteia', label: 'Oresteia', author: 'Aeschylus', year: -458, size: 70 },
    { id: 'sophocles-antigone', label: 'Antigone', author: 'Sophocles', year: -441, size: 65 },
    { id: 'euripides-medea', label: 'Medea', author: 'Euripides', year: -431, size: 60 },
    { id: 'plato-republic', label: 'Republic', author: 'Plato', year: -375, size: 85 },
    { id: 'aristotle-poetics', label: 'Poetics', author: 'Aristotle', year: -335, size: 75 },
    { id: 'virgil-aeneid', label: 'Aeneid', author: 'Virgil', year: -19, size: 90 },
    { id: 'ovid-metamorphoses', label: 'Metamorphoses', author: 'Ovid', year: 8, size: 80 },
    { id: 'seneca-medea', label: 'Medea', author: 'Seneca', year: 50, size: 45 },
  ],
  edges: [
    { source: 'homer-iliad', target: 'homer-odyssey', type: 'parallel', strength: 0.95 },
    { source: 'homer-iliad', target: 'hesiod-theogony', type: 'echo', strength: 0.65 },
    { source: 'homer-iliad', target: 'virgil-aeneid', type: 'allusion', strength: 0.92 },
    { source: 'homer-odyssey', target: 'virgil-aeneid', type: 'allusion', strength: 0.88 },
    { source: 'aeschylus-oresteia', target: 'euripides-medea', type: 'echo', strength: 0.55 },
    { source: 'euripides-medea', target: 'seneca-medea', type: 'quotation', strength: 0.85 },
    { source: 'homer-iliad', target: 'plato-republic', type: 'quotation', strength: 0.78 },
    { source: 'homer-iliad', target: 'aristotle-poetics', type: 'quotation', strength: 0.82 },
    { source: 'homer-odyssey', target: 'plato-republic', type: 'echo', strength: 0.60 },
    { source: 'hesiod-theogony', target: 'ovid-metamorphoses', type: 'allusion', strength: 0.75 },
    { source: 'virgil-aeneid', target: 'ovid-metamorphoses', type: 'parallel', strength: 0.68 },
    { source: 'sophocles-antigone', target: 'aristotle-poetics', type: 'quotation', strength: 0.70 },
    { source: 'plato-republic', target: 'aristotle-poetics', type: 'echo', strength: 0.72 },
  ],
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const minStrength = parseFloat(searchParams.get('minStrength') || '0.3');
  const type = searchParams.get('type');

  try {
    const params = new URLSearchParams();
    params.set('minStrength', minStrength.toString());
    if (type) params.set('type', type);

    const res = await fetch(`${BACKEND_URL}/intertexts?${params}`, {
      headers: { 'Accept': 'application/json' },
      next: { revalidate: 3600 },
    });

    if (res.ok) {
      const data = await res.json();
      return NextResponse.json(data);
    }
  } catch (error) {
    console.log('Backend unavailable, using demo data');
  }

  // Filter demo data
  let edges = DEMO_GRAPH.edges.filter(e => e.strength >= minStrength);
  if (type) {
    edges = edges.filter(e => e.type === type);
  }

  // Get only nodes that have connections
  const connectedNodeIds = new Set(edges.flatMap(e => [e.source, e.target]));
  const nodes = DEMO_GRAPH.nodes.filter(n => connectedNodeIds.has(n.id));

  return NextResponse.json({ nodes, edges });
}
