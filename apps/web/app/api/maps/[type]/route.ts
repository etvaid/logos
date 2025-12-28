import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest, { params }: { params: { type: string } }) {
  try {
    const { type } = params;
    
    const mapData = {
      'ancient-greece': {
        regions: [
          {
            id: 'attica',
            name: 'Attica',
            capital: 'Athens',
            coordinates: { lat: 37.9755, lng: 23.7348 },
            texts: ['Thucydides - History of the Peloponnesian War', 'Plato - Republic'],
            description: 'Home to Athens, center of democracy and philosophy'
          },
          {
            id: 'sparta',
            name: 'Laconia',
            capital: 'Sparta',
            coordinates: { lat: 37.0755, lng: 22.4304 },
            texts: ['Xenophon - Constitution of the Lacedaemonians', 'Plutarch - Life of Lycurgus'],
            description: 'Military state known for discipline and warfare'
          },
          {
            id: 'macedon',
            name: 'Macedonia',
            capital: 'Pella',
            coordinates: { lat: 40.7614, lng: 22.5216 },
            texts: ['Arrian - Anabasis of Alexander', 'Plutarch - Life of Alexander'],
            description: 'Kingdom of Philip II and Alexander the Great'
          }
        ]
      },
      'roman-empire': {
        provinces: [
          {
            id: 'italia',
            name: 'Italia',
            capital: 'Rome',
            coordinates: { lat: 41.9028, lng: 12.4964 },
            texts: ['Virgil - Aeneid', 'Livy - Ab Urbe Condita', 'Tacitus - Annals'],
            description: 'Heart of the Roman Empire'
          },
          {
            id: 'gallia',
            name: 'Gallia',
            capital: 'Lugdunum',
            coordinates: { lat: 45.7640, lng: 4.8357 },
            texts: ['Caesar - Commentarii de Bello Gallico', 'Tacitus - Agricola'],
            description: 'Conquered by Julius Caesar, modern France'
          },
          {
            id: 'aegyptus',
            name: 'Aegyptus',
            capital: 'Alexandria',
            coordinates: { lat: 31.2001, lng: 29.9187 },
            texts: ['Strabo - Geography', 'Herodotus - Histories'],
            description: 'Rich province, breadbasket of Rome'
          }
        ]
      },
      'homer-odyssey': {
        locations: [
          {
            id: 'troy',
            name: 'Troy (Ilium)',
            coordinates: { lat: 39.9577, lng: 26.2390 },
            books: ['Book 1-12 (referenced)'],
            events: ['Trojan War', 'Fall of Troy'],
            description: 'Starting point of Odysseus\' journey'
          },
          {
            id: 'ithaca',
            name: 'Ithaca',
            coordinates: { lat: 38.3667, lng: 20.7167 },
            books: ['Book 13-24'],
            events: ['Return of Odysseus', 'Slaughter of suitors'],
            description: 'Odysseus\' homeland and final destination'
          },
          {
            id: 'circe-island',
            name: 'Aeaea (Circe\'s Island)',
            coordinates: { lat: 41.2317, lng: 12.9108 },
            books: ['Book 10'],
            events: ['Transformation of crew', 'Divine guidance'],
            description: 'Island of the sorceress Circe'
          }
        ]
      }
    };

    const data = mapData[type as keyof typeof mapData] || { error: 'Map type not found' };
    
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch map data' }, { status: 500 });
  }
}