# LOGOS - AI-Powered Classical Research Platform

<p align="center">
  <img src="apps/web/public/images/logo.svg" alt="LOGOS" width="120" />
</p>

<p align="center">
  <strong>Search 69 million words of Greek & Latin literature by meaning, not keywords.</strong>
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#quick-start">Quick Start</a> •
  <a href="#architecture">Architecture</a> •
  <a href="#api">API</a> •
  <a href="#deployment">Deployment</a>
</p>

---

## Features

### Core Features (12)
1. **Cross-lingual Semantic Search** - Greek + Latin unified vector space
2. **AI Translation** - 3 styles: literal, literary, student
3. **Intertextuality Detection** - Find allusions between texts
4. **Higher-Order Discovery** - Find patterns humans can't see
5. **Research Assistant** - Conversational AI for scholarship
6. **Auto Paper Generation** - Draft academic papers
7. **Click-Word Morphology** - Instant parsing and definitions
8. **Prosody/Scansion Analysis** - Metrical analysis
9. **Etymology Tracking** - Word history
10. **Stylometry** - Authorship analysis
11. **Knowledge Graph** - Entity relationships
12. **Bibliography Search** - Citation generation

### Advanced Features (12)
13. Audio pronunciation (Classical, Ecclesiastical, Reconstructed)
14. Multimodal (IIIF manuscripts, maps, artifacts)
15. Pedagogy system (flashcards, grammar drills, progress tracking)
16. Zotero/EndNote integration
17. LMS integration (Canvas, Blackboard, Moodle via LTI 1.3)
18. Institutional SSO (SAML/Shibboleth)
19. ORCID integration
20. DOI registration for discoveries
21. Collaborative annotations
22. Class workspaces
23. Mobile PWA with offline access
24. Expanded corpora (papyri, inscriptions, Byzantine, medieval)

### Growth Engine
- Admin dashboard with daily priorities
- Auto-generated blog posts (2-3/week, SEO-optimized)
- Auto-generated Twitter threads (daily)
- Auto-generated LinkedIn posts (3x/week)
- Content approval queue

## Quick Start

### Prerequisites
- Node.js 18+
- Python 3.11+
- PostgreSQL 15+ with pgvector extension
- Redis

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/logos.git
cd logos

# Install frontend dependencies
cd apps/web
npm install

# Install backend dependencies
cd ../api
pip install -r requirements.txt

# Set up environment variables
cp ../../.env.example ../../.env
# Edit .env with your credentials
```

### Development

```bash
# Terminal 1: Start backend
cd apps/api
uvicorn main:app --reload --port 8000

# Terminal 2: Start frontend
cd apps/web
npm run dev
```

Visit http://localhost:3000

## Architecture

```
logos/
├── apps/
│   ├── api/          # FastAPI Backend
│   └── web/          # Next.js Frontend
├── packages/
│   ├── corpus/       # Text processing
│   ├── ai/           # AI prompts & services
│   └── shared/       # Shared types
├── data/
│   ├── corpora/      # Downloaded texts
│   └── seeds/        # Seed data
└── infrastructure/   # Deployment configs
```

### Tech Stack

**Frontend:**
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui
- Framer Motion
- Three.js / D3.js

**Backend:**
- FastAPI (Python 3.11+)
- PostgreSQL + pgvector
- Redis
- Celery

**AI Services:**
- Claude (Anthropic) - Translation, Research, Discovery
- OpenAI - Embeddings

**Hosting:**
- Vercel (Frontend)
- Railway (Backend + Database)

## API

### Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/texts/{urn}` | GET | Get text by CTS URN |
| `/api/translate` | POST | Translate text |
| `/api/search` | GET | Semantic search |
| `/api/intertexts/{urn}` | GET | Find intertexts |
| `/api/discovery/patterns` | GET | Get discovered patterns |
| `/api/research/ask` | POST | Research assistant |
| `/api/parse/{word}` | GET | Morphological parsing |

Full API documentation available at `/docs` when running the backend.

## Deployment

### Vercel (Frontend)

```bash
vercel --prod
```

### Railway (Backend)

```bash
railway up
```

## Environment Variables

See `.env.example` for all required variables.

## License

MIT License - see LICENSE file.

## Contributing

Contributions welcome! Please read CONTRIBUTING.md first.

---

<p align="center">
  Built with ❤️ for classical scholarship
</p>
