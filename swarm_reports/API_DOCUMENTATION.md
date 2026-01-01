# LOGOS API Documentation

Generated: 2025-12-29 01:57:18

## Base URL
`http://localhost:8001`

## Endpoints

### Corpus
- `GET /corpus/stats` - Get corpus statistics
- `GET /corpus/availability` - Get language availability

### Reader
- `GET /reader/works` - List all works
- `GET /reader/text` - Get text content
- `GET /reader/word/{word}/morphology` - Get word morphology

### Search
- `GET /search/text?q={query}` - Full-text search
- `GET /search/semantic?q={query}` - Semantic search
- `GET /search/phrase?phrase={phrase}` - Phrase search

### SEMANTIA
- `GET /semantia/word/{word}` - Full word analysis
- `GET /semantia/frequency/{word}` - Word frequency
- `GET /semantia/contexts/{word}` - Sample contexts

### Translate
- `GET /translate/styles` - Get translation styles
- `POST /translate/` - Translate text

### CHRONOS
- `GET /chronos/periods` - Get literary periods
- `GET /chronos/{word}` - Word evolution analysis

### Connectome
- `GET /connectome/network` - Author network
- `GET /connectome/influence` - Influence ranking

### Learn
- `GET /learn/modules` - Learning modules
- `GET /learn/levels` - XP levels
- `GET /learn/achievements` - Achievements

### Authorship
- `GET /authorship/authors` - Author list
- `GET /authorship/disputed` - Disputed texts
- `POST /authorship/attribute` - Attribute text

### Atlas
- `GET /atlas/cities` - Major cities
- `GET /atlas/journeys` - Famous journeys
- `GET /atlas/timeline/events` - Historical events
- `GET /atlas/timeline/authors` - Author lifespans

### Discovery
- `GET /discovery/patterns` - Pattern detection
- `GET /discovery/hypotheses` - Research hypotheses

### Prosody
- `GET /prosody/meters` - Meter types
- `GET /prosody/presets` - Famous line presets
- `POST /prosody/scan` - Scan text for meter

### Ghost
- `GET /ghost/lost` - Lost works catalog
- `POST /ghost/reconstruct` - Hypothetical reconstruction
