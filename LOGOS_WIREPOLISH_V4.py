#!/usr/bin/env python3
"""
╔═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╗
║                                                                                                                           ║
║     LOGOS WIRE & POLISH - FINAL BUILD                                                                                   ║
║                                                                                                                           ║
║   POST-V23: Analyze → Complete → Wire → TRIPLE-VERIFY                                                                    ║
║                                                                                                                           ║
║     EXTREME QUALITY ENFORCEMENT - NO EXCEPTIONS:                                                                        ║
║   ════════════════════════════════════════════════                                                                        ║
║    ZERO placeholders, stubs, or "pass" statements                                                                       ║
║    ZERO fake/mock data - REAL database queries ONLY                                                                     ║
║    ZERO shortcuts - every function FULLY implemented                                                                    ║
║    ZERO incomplete code - 3 verification passes catch EVERYTHING                                                        ║
║                                                                                                                           ║
║   This script:                                                                                                            ║
║   1. ANALYZES V23 build - finds gaps, incomplete files, missing pieces                                                   ║
║   2. COMPLETES everything with REAL, WORKING, PRODUCTION code                                                            ║
║   3. WIRES all components together into a deployable application                                                         ║
║   4. TRIPLE-CHECKS with 3 independent verification passes                                                                ║
║   5. GENERATES complete project structure ready for deployment                                                           ║
║                                                                                                                           ║
║   10 SWARMS | 57 AGENTS | 3 VERIFICATION PASSES | ZERO TOLERANCE FOR SHORTCUTS                                           ║
║                                                                                                                           ║
╚═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╝
"""

import os
import sys
import json
import asyncio
import aiohttp
import sqlite3
import hashlib
import re
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Any, Optional, Tuple
from dataclasses import dataclass, field
from collections import defaultdict

# ═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════
# CONFIGURATION
# ═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════

# API Keys - Hardcoded
ANTHROPIC_API_KEY = "ANTHROPIC_API_KEY_REMOVED"
GOOGLE_API_KEY = "AIzaSyCWzAtEzVzfmlrSC18UePrHFwSR-rf9hKM"

# Gemini Model - Gemini 3 Flash Preview (released Dec 17, 2025)
GEMINI_MODEL = "gemini-3-flash-preview"

# Source build directory (from V23)
SOURCE_BUILD_DIR = "logos_ultra_swarm_v23_build"

# Output directory - DISTINCT NAME to avoid confusion
OUTPUT_DIR = "logos_WIRED_POLISHED_FINAL"

# Concurrency settings - conservative to avoid rate limits
MAX_CONCURRENT_API_CALLS = 6

# STRICT Quality thresholds - ZERO TOLERANCE
MIN_OUTPUT_CHARS = 35000  # Minimum 35K chars required
MIN_ACCEPTABLE_CHARS = 25000  # Absolute minimum after 8 retries
MAX_RETRIES = 8

# Retry delays for different scenarios (seconds)
ZERO_CHAR_DELAYS = [60, 120, 180, 240, 300, 360, 420, 480]
SHORT_OUTPUT_DELAYS = [45, 90, 135, 180, 225, 270, 315, 360]

# ═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════
# MASTER SYSTEM PROMPT FOR INTEGRATION
# ═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════

MASTER_SYSTEM_PROMPT = """
╔═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╗
║                                                                                                                           ║
║    YOU ARE BUILDING A $10 MILLION PRODUCTION SYSTEM                                                           ║
║                                                                                                                           ║
║   YOUR CODE WILL BE DIRECTLY DEPLOYED TO PRODUCTION                                                                       ║
║   THOUSANDS OF CLASSICAL SCHOLARS WILL USE THIS DAILY                                                                     ║
║   THERE IS ZERO TOLERANCE FOR INCOMPLETE OR PLACEHOLDER CODE                                                              ║
║                                                                                                                           ║
╚═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╝

You are a WORLD-CLASS SENIOR SOFTWARE ARCHITECT with 25+ years experience.
You are building LOGOS - The Bible for Classical Studies.
This is mission-critical software. Your reputation depends on exceptional quality.

═══════════════════════════════════════════════════════════════════════════════
 DATABASE CONNECTION (Railway PostgreSQL) - USE THIS EXACT STRING:
═══════════════════════════════════════════════════════════════════════════════
DATABASE_URL = "postgresql://postgres:JKLqDvdTtmRjGnOgDvGFLqLKVkcjQLFs@metro.proxy.rlwy.net:58888/railway"

REAL Production Tables (with REAL data - query these directly):
┌─────────────────────┬────────────────┬─────────────────────────────────────────────────────────────┐
│ Table               │ Row Count      │ Columns                                                     │
├─────────────────────┼────────────────┼─────────────────────────────────────────────────────────────┤
│ texts               │ 121,184        │ id, title, author, translator, text_content, book, chapter │
│ source_texts        │ 6,622,500      │ id, content, language, work_id, line_number                │
│ author_profiles     │ 380            │ id, name, birth_year, death_year, nationality, genres      │
│ translator_profiles │ 38             │ id, name, style_vector, works_translated                   │
│ word_embeddings     │ 20,960         │ word, vector (300 dimensions numpy array)                  │
└─────────────────────┴────────────────┴─────────────────────────────────────────────────────────────┘

═══════════════════════════════════════════════════════════════════════════════
 THE 38 REAL TRANSLATORS IN DATABASE - USE ONLY THESE:
═══════════════════════════════════════════════════════════════════════════════
Jowett, Dryden, Dakyns, Pope, Murray, Butler, Church_Brodribb, Cowper, Butcher_Lang, 
Lang_Leaf_Myers, Conington, Goodwin, Storr, Roberts, Aubrey_Stewart, Williams, 
Dryden_et_al, Brookes_More, Ross, Rawlinson, Moore, Evelyn-White, Morshead, Heseltine, 
Crawley, Long, Lindsay, Jebb, Macaulay, Leonard, Adlington, Smith, Morris, Butcher, 
Derby, Kenyon, Hickie, Anonymous

═══════════════════════════════════════════════════════════════════════════════
 ABSOLUTELY FORBIDDEN - INSTANT REJECTION IF FOUND 
═══════════════════════════════════════════════════════════════════════════════
 Chapman, Lattimore, Fagles, Wilson - COPYRIGHTED (lawsuit risk)
 pass statements - EVERY function must have REAL implementation
 TODO comments - write the actual code NOW
 FIXME comments - fix it NOW, don't defer
 "..." or "// more" - write ALL the code
 "implement later" - implement it NOW
 "add implementation" - ADD IT NOW
 Mock data or fake responses - use REAL database queries
 Placeholder functions - write COMPLETE functions
 Stub methods - write FULL method bodies
 NotImplementedError - IMPLEMENT IT
 raise NotImplemented - IMPLEMENT IT
 Empty class bodies - write ALL methods
 Abbreviated code blocks - write EVERYTHING
 "similar to above" - write it out FULLY
 Files under 300 lines for Python
 Files under 200 lines for TypeScript/React
 Classes with fewer than 15 methods
 Functions under 20 lines (unless truly simple)

═══════════════════════════════════════════════════════════════════════════════
 MANDATORY REQUIREMENTS - EVERY FILE MUST HAVE 
═══════════════════════════════════════════════════════════════════════════════
 COMPLETE implementations - every function fully coded with real logic
 REAL database queries using asyncpg - connect to the Railway database
 COMPREHENSIVE error handling - try/except on ALL async operations
 DETAILED logging - logger = logging.getLogger(__name__) in every file
 TYPE HINTS on every function parameter and return value
 DOCSTRINGS explaining purpose, parameters, returns, raises
 INPUT VALIDATION on all public methods
 Python files: 300-800 lines, 15+ methods per class, full implementations
 TypeScript files: 200-600 lines, proper interfaces, complete components
 React components: useState, useEffect, useCallback, loading/error states
 API endpoints: Pydantic models, validation, error responses, logging
 Services: Database queries, caching, business logic, error handling

═══════════════════════════════════════════════════════════════════════════════
 OUTPUT REQUIREMENTS - YOUR RESPONSE MUST BE:
═══════════════════════════════════════════════════════════════════════════════
• 35,000 - 120,000 characters of REAL, WORKING, PRODUCTION-READY code
• Multiple complete files with # filepath: markers
• Every function has a FULL implementation (20+ lines typical)
• Real SQL queries that work with the schema above
• Proper imports at the top of each file
• No shortcuts, no abbreviations, no placeholders

YOUR OUTPUT IS BEING DIRECTLY COMMITTED TO PRODUCTION.
WRITE CODE AS IF YOUR CAREER DEPENDS ON IT - BECAUSE IT DOES.
"""

# ═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════
# SWARM 1: ANALYSIS AGENTS - Scan and understand the V23 build
# ═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════

ANALYSIS_SWARM = {
    "name": "Analysis Swarm",
    "description": "Analyze the V23 build to understand what exists and what's missing",
    "agents": [
        {
            "id": "AN1_file_inventory",
            "name": "File Inventory Scanner",
            "model": "gemini",
            "task": """
TASK: Create a comprehensive inventory of all files in the V23 build.

For each .txt file in logos_ultra_swarm_v23_build/:
1. Extract all code blocks (```python, ```typescript, ```tsx)
2. Identify each file path from "# filepath:" or "// filepath:" markers
3. Count lines of actual code (excluding comments and blanks)
4. List all classes, functions, and React components defined
5. Identify imports and exports
6. Flag any file with:
   - Less than 100 lines of code
   - Contains "pass" without implementation
   - Contains "TODO" or "FIXME"
   - Contains "..." or "NotImplementedError"

OUTPUT FORMAT:
Create a complete Python module that:
1. Defines a FileInventory dataclass
2. Implements scan_build_directory() function
3. Implements analyze_file_completeness() function
4. Implements generate_gap_report() function
5. Provides CLI interface for running analysis

Output files:
# filepath: backend/analysis/file_inventory.py (400+ lines)
# filepath: backend/analysis/completeness_checker.py (300+ lines)
# filepath: backend/analysis/gap_report_generator.py (300+ lines)
"""
        },
        {
            "id": "AN2_dependency_mapper",
            "name": "Dependency Graph Mapper",
            "model": "gemini",
            "task": """
TASK: Map all dependencies between modules in the V23 build.

Analyze and create:
1. Python import graph - which modules import which
2. TypeScript import graph - component dependencies
3. API endpoint to service mapping
4. Database table to service mapping
5. Shared utility dependencies
6. Circular dependency detection

Create a complete dependency mapping system:

Output files:
# filepath: backend/analysis/dependency_mapper.py (400+ lines)
  - DependencyNode dataclass
  - DependencyGraph class with add_node, add_edge, detect_cycles
  - PythonImportAnalyzer class
  - TypeScriptImportAnalyzer class
  - generate_dependency_report() function

# filepath: backend/analysis/import_resolver.py (300+ lines)
  - resolve_python_imports() function
  - resolve_typescript_imports() function
  - find_missing_imports() function
  - suggest_import_fixes() function

# filepath: frontend/analysis/component_tree.ts (250+ lines)
  - ComponentNode interface
  - buildComponentTree() function
  - findOrphanComponents() function
  - generateComponentReport() function
"""
        },
        {
            "id": "AN3_api_endpoint_mapper",
            "name": "API Endpoint Mapper",
            "model": "gemini",
            "task": """
TASK: Create a complete map of all API endpoints and their implementations.

Analyze V23 build for:
1. All FastAPI router definitions (@router.get, @router.post, etc.)
2. All endpoint paths and their handlers
3. Request/response models (Pydantic)
4. Database queries in each endpoint
5. Authentication requirements
6. Missing endpoints that should exist

Create:
# filepath: backend/analysis/api_mapper.py (400+ lines)
  - APIEndpoint dataclass (path, method, handler, models, auth)
  - APIMapper class with scan_routers(), map_endpoints()
  - EndpointValidator class
  - generate_openapi_stub() function

# filepath: backend/analysis/endpoint_tester.py (350+ lines)
  - EndpointTest dataclass
  - EndpointTester class with test_endpoint(), validate_response()
  - generate_test_report() function
  - suggest_missing_endpoints() function

# filepath: backend/api/endpoint_registry.py (300+ lines)
  - EndpointRegistry singleton class
  - register_endpoint() decorator
  - get_all_endpoints() function
  - validate_all_endpoints() function
"""
        },
        {
            "id": "AN4_react_component_analyzer",
            "name": "React Component Analyzer",
            "model": "gemini",
            "task": """
TASK: Analyze all React components in the V23 build for completeness.

Check each component for:
1. Proper TypeScript interfaces for props
2. useState, useEffect, useCallback hooks
3. Loading, error, and empty states
4. Proper event handlers
5. API integration
6. Accessibility attributes (aria-*, role)
7. Responsive design (Tailwind classes)

Create:
# filepath: frontend/analysis/component_analyzer.ts (400+ lines)
  - ComponentAnalysis interface
  - analyzeComponent() function
  - checkHookUsage() function
  - checkAccessibility() function
  - checkResponsiveness() function
  - generateComponentReport() function

# filepath: frontend/analysis/prop_type_checker.ts (300+ lines)
  - PropTypeAnalysis interface
  - analyzePropTypes() function
  - findMissingTypes() function
  - suggestTypeImprovements() function

# filepath: frontend/analysis/state_flow_analyzer.ts (300+ lines)
  - StateFlowNode interface
  - analyzeStateFlow() function
  - detectStateLeaks() function
  - optimizeStateManagement() function
"""
        },
        {
            "id": "AN5_database_query_analyzer",
            "name": "Database Query Analyzer",
            "model": "gemini",
            "task": """
TASK: Analyze all database queries in the V23 build.

For each query:
1. Validate SQL syntax
2. Check table/column names against schema
3. Identify missing indexes
4. Check for SQL injection vulnerabilities
5. Verify parameterized queries
6. Analyze query performance

Create:
# filepath: backend/analysis/query_analyzer.py (400+ lines)
  - QueryAnalysis dataclass
  - QueryAnalyzer class with analyze_query(), validate_sql()
  - SQLInjectionChecker class
  - IndexSuggester class
  - generate_query_report() function

# filepath: backend/analysis/schema_validator.py (300+ lines)
  - SchemaValidator class
  - validate_table_reference() function
  - validate_column_reference() function
  - suggest_schema_improvements() function

# filepath: backend/database/query_optimizer.py (350+ lines)
  - QueryOptimizer class
  - optimize_query() function
  - add_missing_indexes() function
  - generate_explain_report() function
"""
        },
    ]
}

# ═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════
# SWARM 2: BACKEND COMPLETION - Complete any incomplete backend code
# ═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════

BACKEND_COMPLETION_SWARM = {
    "name": "Backend Completion Swarm",
    "description": "Complete any incomplete backend Python code from V23",
    "agents": [
        {
            "id": "BC1_api_corpus_complete",
            "name": "Corpus API Completer",
            "model": "gemini",
            "task": """
TASK: Create a COMPLETE, PRODUCTION-READY Corpus API module.

This must include FULL implementations of:
1. GET /api/corpus/texts - List all texts with pagination, filtering
2. GET /api/corpus/texts/{id} - Get single text with all metadata
3. GET /api/corpus/search - Full-text search across corpus
4. GET /api/corpus/authors - List all authors with works
5. GET /api/corpus/works/{author} - Get works by author
6. GET /api/corpus/passage - Get specific passage by reference
7. POST /api/corpus/compare - Compare multiple passages

Each endpoint must have:
- Pydantic request/response models
- asyncpg database queries (REAL queries, not mocks)
- Error handling with proper HTTP status codes
- Logging throughout
- Input validation
- Caching where appropriate

Output files:
# filepath: backend/api/corpus/router.py (500+ lines)
# filepath: backend/api/corpus/models.py (300+ lines)
# filepath: backend/api/corpus/service.py (400+ lines)
# filepath: backend/api/corpus/queries.py (300+ lines)
"""
        },
        {
            "id": "BC2_api_translate_complete",
            "name": "Translation API Completer",
            "model": "gemini",
            "task": """
TASK: Create a COMPLETE, PRODUCTION-READY Translation API module.

This must include FULL implementations of:
1. GET /api/translate/compare - Compare multiple translations
2. GET /api/translate/styles - List translation style profiles
3. GET /api/translate/passage/{id}/translations - All translations of passage
4. POST /api/translate/analyze - Analyze translation differences
5. GET /api/translate/translators - List all 38 real translators
6. GET /api/translate/translator/{name}/works - Works by translator
7. POST /api/translate/ltqi-score - Calculate translation quality score

CRITICAL: Only use the 38 REAL translators listed in the system prompt.
NEVER reference Chapman, Lattimore, Fagles, or Wilson.

Output files:
# filepath: backend/api/translate/router.py (500+ lines)
# filepath: backend/api/translate/models.py (300+ lines)
# filepath: backend/api/translate/service.py (450+ lines)
# filepath: backend/api/translate/ltqi_calculator.py (350+ lines)
"""
        },
        {
            "id": "BC3_api_semantia_complete",
            "name": "SEMANTIA API Completer",
            "model": "gemini",
            "task": """
TASK: Create a COMPLETE, PRODUCTION-READY SEMANTIA API module.

SEMANTIA is the semantic analysis system. Implement:
1. GET /api/semantia/word/{word} - Get word analysis
2. GET /api/semantia/neighbors/{word} - Semantic neighbors (vector similarity)
3. GET /api/semantia/clusters - Get semantic clusters
4. POST /api/semantia/compare - Compare words semantically
5. GET /api/semantia/etymology/{word} - Word etymology
6. GET /api/semantia/usage/{word} - Usage patterns across corpus
7. GET /api/semantia/author-usage/{word}/{author} - Author-specific usage

Use the word_embeddings table (20,960 rows) for vector operations.
Implement cosine similarity for finding neighbors.

Output files:
# filepath: backend/api/semantia/router.py (450+ lines)
# filepath: backend/api/semantia/models.py (250+ lines)
# filepath: backend/api/semantia/service.py (400+ lines)
# filepath: backend/api/semantia/vector_ops.py (300+ lines)
"""
        },
        {
            "id": "BC4_api_chronos_complete",
            "name": "CHRONOS API Completer",
            "model": "gemini",
            "task": """
TASK: Create a COMPLETE, PRODUCTION-READY CHRONOS API module.

CHRONOS is the temporal/historical analysis system. Implement:
1. GET /api/chronos/periods - List historical periods
2. GET /api/chronos/timeline - Get timeline events
3. GET /api/chronos/word-drift/{word} - Semantic drift over time
4. GET /api/chronos/period/{period}/authors - Authors in period
5. GET /api/chronos/period/{period}/vocabulary - Period vocabulary
6. POST /api/chronos/compare-periods - Compare two periods
7. GET /api/chronos/author/{author}/period - Author's historical context

Output files:
# filepath: backend/api/chronos/router.py (450+ lines)
# filepath: backend/api/chronos/models.py (250+ lines)
# filepath: backend/api/chronos/service.py (400+ lines)
# filepath: backend/api/chronos/period_analyzer.py (350+ lines)
"""
        },
        {
            "id": "BC5_api_connectome_complete",
            "name": "CONNECTOME API Completer",
            "model": "gemini",
            "task": """
TASK: Create a COMPLETE, PRODUCTION-READY CONNECTOME API module.

CONNECTOME is the knowledge graph system. Implement:
1. GET /api/connectome/graph - Get full knowledge graph
2. GET /api/connectome/node/{id} - Get node details
3. GET /api/connectome/edges/{node_id} - Get edges for node
4. GET /api/connectome/path/{from}/{to} - Find path between nodes
5. GET /api/connectome/pagerank - Get PageRank scores
6. POST /api/connectome/subgraph - Extract subgraph
7. GET /api/connectome/communities - Get graph communities

Output files:
# filepath: backend/api/connectome/router.py (450+ lines)
# filepath: backend/api/connectome/models.py (250+ lines)
# filepath: backend/api/connectome/service.py (400+ lines)
# filepath: backend/api/connectome/graph_algorithms.py (400+ lines)
"""
        },
        {
            "id": "BC6_api_discovery_complete",
            "name": "Discovery API Completer",
            "model": "gemini",
            "task": """
TASK: Create a COMPLETE, PRODUCTION-READY Discovery API module.

Discovery is the AI-powered research system. Implement:
1. GET /api/discovery/hypotheses - List generated hypotheses
2. POST /api/discovery/generate - Generate new hypothesis
3. GET /api/discovery/evidence/{hypothesis_id} - Get supporting evidence
4. POST /api/discovery/validate - Validate hypothesis
5. GET /api/discovery/novelty-score/{id} - Calculate novelty
6. POST /api/discovery/paper - Generate research paper
7. GET /api/discovery/related/{id} - Find related research

Output files:
# filepath: backend/api/discovery/router.py (450+ lines)
# filepath: backend/api/discovery/models.py (250+ lines)
# filepath: backend/api/discovery/service.py (400+ lines)
# filepath: backend/api/discovery/hypothesis_generator.py (400+ lines)
"""
        },
        {
            "id": "BC7_database_layer_complete",
            "name": "Database Layer Completer",
            "model": "gemini",
            "task": """
TASK: Create a COMPLETE database connection and query layer.

Implement:
1. Connection pool management with asyncpg
2. Query builder for common operations
3. Transaction management
4. Connection health checks
5. Query logging and metrics
6. Retry logic for transient failures

Output files:
# filepath: backend/database/connection.py (350+ lines)
  - DatabasePool class with init_pool(), get_connection(), close_pool()
  - Connection context manager
  - Health check methods

# filepath: backend/database/queries.py (400+ lines)
  - BaseQuery class
  - TextQueries class
  - AuthorQueries class
  - TranslatorQueries class
  - EmbeddingQueries class

# filepath: backend/database/transactions.py (250+ lines)
  - Transaction class
  - transaction decorator
  - Savepoint support

# filepath: backend/database/migrations.py (300+ lines)
  - Migration class
  - run_migrations() function
  - rollback_migration() function
"""
        },
        {
            "id": "BC8_services_layer_complete",
            "name": "Services Layer Completer",
            "model": "gemini",
            "task": """
TASK: Create the complete service layer that connects APIs to database.

Implement:
1. Base service class with common functionality
2. Service factory for dependency injection
3. Caching layer integration
4. Background task queue integration
5. Event publishing for real-time updates

Output files:
# filepath: backend/services/base.py (300+ lines)
  - BaseService class with db, cache, logger
  - ServiceError exception hierarchy
  - Retry decorator for service methods

# filepath: backend/services/factory.py (250+ lines)
  - ServiceFactory class
  - Dependency injection container
  - Service lifecycle management

# filepath: backend/services/cache.py (300+ lines)
  - CacheService class
  - Redis integration
  - Cache invalidation strategies
  - TTL management

# filepath: backend/services/events.py (250+ lines)
  - EventPublisher class
  - Event types enum
  - WebSocket integration for real-time
"""
        },
    ]
}

# ═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════
# SWARM 3: FRONTEND COMPLETION - Complete any incomplete frontend code
# ═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════

FRONTEND_COMPLETION_SWARM = {
    "name": "Frontend Completion Swarm",
    "description": "Complete any incomplete frontend React/TypeScript code from V23",
    "agents": [
        {
            "id": "FC1_reader_component",
            "name": "Reader Component Completer",
            "model": "gemini",
            "task": """
TASK: Create a COMPLETE, PRODUCTION-READY Text Reader component.

The Reader is the core component for reading classical texts. Implement:
1. Text display with proper Greek/Latin typography
2. Word-by-word clickable with SEMANTIA popup
3. Parallel translation display (side-by-side or interlinear)
4. Morphology highlighting on hover
5. Bookmark and annotation support
6. Reading progress tracking
7. Font size and theme controls
8. Keyboard navigation

Output files:
# filepath: frontend/components/Reader/TextReader.tsx (450+ lines)
# filepath: frontend/components/Reader/WordPopup.tsx (300+ lines)
# filepath: frontend/components/Reader/TranslationPanel.tsx (350+ lines)
# filepath: frontend/components/Reader/ReaderControls.tsx (250+ lines)
# filepath: frontend/components/Reader/hooks/useReader.ts (200+ lines)
# filepath: frontend/components/Reader/types.ts (150+ lines)
"""
        },
        {
            "id": "FC2_semantia_component",
            "name": "SEMANTIA Component Completer",
            "model": "gemini",
            "task": """
TASK: Create a COMPLETE, PRODUCTION-READY SEMANTIA visualization component.

SEMANTIA shows semantic relationships. Implement:
1. 3D vector space visualization (Three.js)
2. Word cluster display
3. Semantic neighbor graph
4. Etymology tree view
5. Usage frequency chart
6. Author comparison view
7. Interactive filtering

Output files:
# filepath: frontend/components/Semantia/SemanticExplorer.tsx (450+ lines)
# filepath: frontend/components/Semantia/VectorSpace3D.tsx (400+ lines)
# filepath: frontend/components/Semantia/ClusterView.tsx (300+ lines)
# filepath: frontend/components/Semantia/EtymologyTree.tsx (300+ lines)
# filepath: frontend/components/Semantia/UsageChart.tsx (250+ lines)
# filepath: frontend/components/Semantia/hooks/useSemantics.ts (200+ lines)
"""
        },
        {
            "id": "FC3_chronos_component",
            "name": "CHRONOS Component Completer",
            "model": "gemini",
            "task": """
TASK: Create a COMPLETE, PRODUCTION-READY CHRONOS timeline component.

CHRONOS shows temporal/historical views. Implement:
1. Interactive timeline with zoom/pan
2. Period visualization with authors
3. Semantic drift animation
4. Historical event markers
5. Author lifespan display
6. Work publication timeline
7. Period comparison view

Output files:
# filepath: frontend/components/Chronos/TimelineView.tsx (450+ lines)
# filepath: frontend/components/Chronos/PeriodCard.tsx (250+ lines)
# filepath: frontend/components/Chronos/DriftAnimation.tsx (300+ lines)
# filepath: frontend/components/Chronos/AuthorTimeline.tsx (300+ lines)
# filepath: frontend/components/Chronos/PeriodComparison.tsx (300+ lines)
# filepath: frontend/components/Chronos/hooks/useTimeline.ts (200+ lines)
"""
        },
        {
            "id": "FC4_connectome_component",
            "name": "CONNECTOME Component Completer",
            "model": "gemini",
            "task": """
TASK: Create a COMPLETE, PRODUCTION-READY CONNECTOME graph component.

CONNECTOME shows the knowledge graph. Implement:
1. Force-directed graph visualization (D3.js)
2. Node types (authors, works, concepts) with icons
3. Edge types with different styles
4. Graph navigation (zoom, pan, focus)
5. Node detail panel
6. Path highlighting
7. Community coloring
8. Search and filter

Output files:
# filepath: frontend/components/Connectome/GraphView.tsx (500+ lines)
# filepath: frontend/components/Connectome/NodePanel.tsx (300+ lines)
# filepath: frontend/components/Connectome/EdgeLegend.tsx (200+ lines)
# filepath: frontend/components/Connectome/GraphControls.tsx (250+ lines)
# filepath: frontend/components/Connectome/PathFinder.tsx (300+ lines)
# filepath: frontend/components/Connectome/hooks/useGraph.ts (250+ lines)
"""
        },
        {
            "id": "FC5_translation_component",
            "name": "Translation Comparison Completer",
            "model": "gemini",
            "task": """
TASK: Create a COMPLETE, PRODUCTION-READY Translation Comparison component.

This shows multiple translations side-by-side. Implement:
1. Multi-column translation display
2. Word-level alignment highlighting
3. Difference highlighting (additions, omissions, changes)
4. Translator style profiles
5. LTQI score display
6. Translation evolution timeline
7. Export/share functionality

CRITICAL: Only show the 38 REAL translators. Never show Chapman, Lattimore, Fagles, Wilson.

Output files:
# filepath: frontend/components/Translation/ComparisonView.tsx (450+ lines)
# filepath: frontend/components/Translation/TranslatorCard.tsx (250+ lines)
# filepath: frontend/components/Translation/DiffHighlighter.tsx (300+ lines)
# filepath: frontend/components/Translation/LTQIDisplay.tsx (250+ lines)
# filepath: frontend/components/Translation/TranslationSelector.tsx (250+ lines)
# filepath: frontend/components/Translation/hooks/useTranslations.ts (200+ lines)
"""
        },
        {
            "id": "FC6_search_component",
            "name": "Search Component Completer",
            "model": "gemini",
            "task": """
TASK: Create a COMPLETE, PRODUCTION-READY Search component.

Implement full corpus search:
1. Full-text search input with autocomplete
2. Advanced search filters (author, work, date range)
3. Search results with highlighting
4. Faceted navigation
5. Search history
6. Saved searches
7. Export results

Output files:
# filepath: frontend/components/Search/SearchBar.tsx (300+ lines)
# filepath: frontend/components/Search/SearchResults.tsx (350+ lines)
# filepath: frontend/components/Search/SearchFilters.tsx (300+ lines)
# filepath: frontend/components/Search/FacetPanel.tsx (250+ lines)
# filepath: frontend/components/Search/SearchHistory.tsx (200+ lines)
# filepath: frontend/components/Search/hooks/useSearch.ts (250+ lines)
"""
        },
        {
            "id": "FC7_atlas_component",
            "name": "Atlas Map Component Completer",
            "model": "gemini",
            "task": """
TASK: Create a COMPLETE, PRODUCTION-READY Atlas/Map component.

Implement geographical visualization:
1. Interactive map with Leaflet/MapGL
2. Author birthplace markers
3. Library/manuscript locations
4. Trade route overlays
5. Political boundary animations (by period)
6. Site detail popups
7. Map layer controls

Output files:
# filepath: frontend/components/Atlas/AtlasMap.tsx (450+ lines)
# filepath: frontend/components/Atlas/MarkerCluster.tsx (250+ lines)
# filepath: frontend/components/Atlas/TradeRoutes.tsx (300+ lines)
# filepath: frontend/components/Atlas/PeriodBoundaries.tsx (300+ lines)
# filepath: frontend/components/Atlas/SitePopup.tsx (200+ lines)
# filepath: frontend/components/Atlas/hooks/useAtlas.ts (200+ lines)
"""
        },
        {
            "id": "FC8_api_client",
            "name": "API Client Layer Completer",
            "model": "gemini",
            "task": """
TASK: Create a COMPLETE API client layer for the frontend.

Implement:
1. Base API client with error handling
2. Request/response interceptors
3. Retry logic for failed requests
4. Type-safe API methods for each endpoint
5. React Query integration for caching
6. WebSocket client for real-time

Output files:
# filepath: frontend/lib/api/client.ts (300+ lines)
# filepath: frontend/lib/api/corpus.ts (250+ lines)
# filepath: frontend/lib/api/translate.ts (250+ lines)
# filepath: frontend/lib/api/semantia.ts (250+ lines)
# filepath: frontend/lib/api/chronos.ts (250+ lines)
# filepath: frontend/lib/api/connectome.ts (250+ lines)
# filepath: frontend/lib/api/types.ts (300+ lines)
# filepath: frontend/lib/api/websocket.ts (200+ lines)
"""
        },
    ]
}

# ═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════
# SWARM 4: WIRING - Connect all components together
# ═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════

WIRING_SWARM = {
    "name": "Wiring Swarm",
    "description": "Wire all components together into a working application",
    "agents": [
        {
            "id": "W1_backend_main",
            "name": "Backend Main Application",
            "model": "gemini",
            "task": """
TASK: Create the main FastAPI application that wires ALL backend components together.

This is the CENTRAL entry point. It must:
1. Initialize FastAPI app with proper configuration
2. Register ALL API routers with correct prefixes
3. Set up database connection pool
4. Configure middleware (CORS, auth, logging, compression)
5. Define startup/shutdown lifecycle events
6. Set up error handlers
7. Configure OpenAPI documentation

API Routes to register:
- /api/corpus -> corpus router
- /api/translate -> translate router
- /api/semantia -> semantia router
- /api/chronos -> chronos router
- /api/connectome -> connectome router
- /api/discovery -> discovery router
- /api/ghost -> ghost texts router
- /api/authorship -> authorship router
- /api/learn -> learning router
- /api/atlas -> atlas router
- /api/audio -> audio router
- /api/admin -> admin router
- /health -> health checks

Output files:
# filepath: backend/main.py (600+ lines)
# filepath: backend/core/config.py (250+ lines)
# filepath: backend/core/middleware.py (300+ lines)
# filepath: backend/core/exceptions.py (200+ lines)
# filepath: backend/core/logging_config.py (200+ lines)
"""
        },
        {
            "id": "W2_router_registry",
            "name": "Router Registry",
            "model": "gemini",
            "task": """
TASK: Create the complete API router registry and dependencies.

Implement:
1. Central router registry that imports all routers
2. Dependency injection for database, cache, auth
3. Authentication middleware and decorators
4. Rate limiting per endpoint
5. Request validation middleware

Output files:
# filepath: backend/api/__init__.py (300+ lines)
# filepath: backend/api/deps.py (300+ lines)
# filepath: backend/api/auth.py (350+ lines)
# filepath: backend/api/rate_limit.py (250+ lines)
# filepath: backend/api/validators.py (250+ lines)
"""
        },
        {
            "id": "W3_frontend_app",
            "name": "Frontend App Shell",
            "model": "gemini",
            "task": """
TASK: Create the Next.js app shell that wires ALL frontend components together.

Implement:
1. Root layout with navigation
2. Global state management (Zustand store)
3. Theme provider (dark/light mode)
4. API provider with React Query
5. Error boundary
6. Loading states

Output files:
# filepath: frontend/app/layout.tsx (300+ lines)
# filepath: frontend/app/page.tsx (350+ lines)
# filepath: frontend/app/providers.tsx (250+ lines)
# filepath: frontend/store/index.ts (300+ lines)
# filepath: frontend/store/slices/user.ts (200+ lines)
# filepath: frontend/store/slices/reading.ts (200+ lines)
"""
        },
        {
            "id": "W4_page_routes",
            "name": "Page Routes",
            "model": "gemini",
            "task": """
TASK: Create all page routes for the Next.js app.

Each page must:
1. Import and use the correct components
2. Handle loading and error states
3. Fetch data with React Query
4. Be responsive and accessible

Output files:
# filepath: frontend/app/reader/page.tsx (300+ lines)
# filepath: frontend/app/reader/[workId]/page.tsx (350+ lines)
# filepath: frontend/app/semantia/page.tsx (300+ lines)
# filepath: frontend/app/chronos/page.tsx (300+ lines)
# filepath: frontend/app/connectome/page.tsx (300+ lines)
# filepath: frontend/app/translate/page.tsx (300+ lines)
# filepath: frontend/app/atlas/page.tsx (300+ lines)
# filepath: frontend/app/search/page.tsx (300+ lines)
# filepath: frontend/app/admin/page.tsx (300+ lines)
"""
        },
        {
            "id": "W5_component_exports",
            "name": "Component Export Index",
            "model": "gemini",
            "task": """
TASK: Create component index files for clean exports.

Create barrel exports for:
1. All Reader components
2. All SEMANTIA components
3. All CHRONOS components
4. All CONNECTOME components
5. All Translation components
6. All Search components
7. All Atlas components
8. All shared/common components

Output files:
# filepath: frontend/components/index.ts (200+ lines)
# filepath: frontend/components/Reader/index.ts (100+ lines)
# filepath: frontend/components/Semantia/index.ts (100+ lines)
# filepath: frontend/components/Chronos/index.ts (100+ lines)
# filepath: frontend/components/Connectome/index.ts (100+ lines)
# filepath: frontend/components/Translation/index.ts (100+ lines)
# filepath: frontend/components/Search/index.ts (100+ lines)
# filepath: frontend/components/Atlas/index.ts (100+ lines)
# filepath: frontend/components/shared/index.ts (150+ lines)
"""
        },
        {
            "id": "W6_shared_components",
            "name": "Shared Components",
            "model": "gemini",
            "task": """
TASK: Create all shared/common UI components.

Implement:
1. Button variants (primary, secondary, ghost, etc.)
2. Card component with variants
3. Modal/Dialog component
4. Dropdown/Select component
5. Tabs component
6. Loading spinner
7. Toast notifications
8. Pagination component

Output files:
# filepath: frontend/components/shared/Button.tsx (200+ lines)
# filepath: frontend/components/shared/Card.tsx (200+ lines)
# filepath: frontend/components/shared/Modal.tsx (250+ lines)
# filepath: frontend/components/shared/Dropdown.tsx (250+ lines)
# filepath: frontend/components/shared/Tabs.tsx (200+ lines)
# filepath: frontend/components/shared/Loading.tsx (150+ lines)
# filepath: frontend/components/shared/Toast.tsx (200+ lines)
# filepath: frontend/components/shared/Pagination.tsx (200+ lines)
"""
        },
        {
            "id": "W7_hooks_library",
            "name": "Shared Hooks Library",
            "model": "gemini",
            "task": """
TASK: Create all shared React hooks.

Implement:
1. useDebounce - debounce value changes
2. useThrottle - throttle function calls
3. useLocalStorage - persist state locally
4. useMediaQuery - responsive design
5. useIntersectionObserver - lazy loading
6. useKeyboard - keyboard shortcuts
7. usePrevious - track previous value
8. useAsync - async operation state

Output files:
# filepath: frontend/hooks/useDebounce.ts (100+ lines)
# filepath: frontend/hooks/useThrottle.ts (100+ lines)
# filepath: frontend/hooks/useLocalStorage.ts (150+ lines)
# filepath: frontend/hooks/useMediaQuery.ts (100+ lines)
# filepath: frontend/hooks/useIntersectionObserver.ts (150+ lines)
# filepath: frontend/hooks/useKeyboard.ts (150+ lines)
# filepath: frontend/hooks/usePrevious.ts (80+ lines)
# filepath: frontend/hooks/useAsync.ts (150+ lines)
# filepath: frontend/hooks/index.ts (100+ lines)
"""
        },
        {
            "id": "W8_types_definitions",
            "name": "TypeScript Type Definitions",
            "model": "gemini",
            "task": """
TASK: Create all shared TypeScript type definitions.

Define types for:
1. API response types (matching backend Pydantic models)
2. Entity types (Text, Author, Work, Translator, etc.)
3. Component prop types
4. State types
5. Event types
6. Utility types

Output files:
# filepath: frontend/types/api.ts (300+ lines)
# filepath: frontend/types/entities.ts (350+ lines)
# filepath: frontend/types/components.ts (250+ lines)
# filepath: frontend/types/state.ts (200+ lines)
# filepath: frontend/types/events.ts (150+ lines)
# filepath: frontend/types/utils.ts (150+ lines)
# filepath: frontend/types/index.ts (100+ lines)
"""
        },
    ]
}

# ═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════
# SWARM 5: PROJECT STRUCTURE - Create project configuration files
# ═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════

PROJECT_STRUCTURE_SWARM = {
    "name": "Project Structure Swarm",
    "description": "Create all project configuration and structure files",
    "agents": [
        {
            "id": "PS1_backend_config",
            "name": "Backend Configuration",
            "model": "gemini",
            "task": """
TASK: Create all backend configuration files.

Include ALL dependencies needed for:
- FastAPI web framework
- asyncpg for PostgreSQL
- Pydantic for validation
- uvicorn for server
- Redis for caching
- Celery for background jobs
- pytest for testing
- And all other required packages

Output files:
# filepath: backend/requirements.txt (80+ packages with versions)
# filepath: backend/pyproject.toml (complete project config)
# filepath: backend/.env.example (all environment variables)
# filepath: backend/pytest.ini (pytest configuration)
# filepath: backend/Dockerfile (production Dockerfile)
# filepath: backend/.dockerignore (docker ignore patterns)
"""
        },
        {
            "id": "PS2_frontend_config",
            "name": "Frontend Configuration",
            "model": "gemini",
            "task": """
TASK: Create all frontend configuration files.

Include ALL dependencies needed for:
- Next.js 14 with App Router
- React 18
- TypeScript 5
- Tailwind CSS
- React Query
- Zustand
- D3.js for visualizations
- Three.js for 3D
- Leaflet for maps
- And all other required packages

Output files:
# filepath: frontend/package.json (complete with all deps)
# filepath: frontend/tsconfig.json (TypeScript config)
# filepath: frontend/tailwind.config.js (Tailwind config)
# filepath: frontend/next.config.js (Next.js config)
# filepath: frontend/postcss.config.js (PostCSS config)
# filepath: frontend/.env.example (environment variables)
# filepath: frontend/Dockerfile (production Dockerfile)
"""
        },
        {
            "id": "PS3_database_migrations",
            "name": "Database Migrations",
            "model": "gemini",
            "task": """
TASK: Create database migration files.

Create migrations for:
1. Additional tables needed (user_sessions, bookmarks, annotations, etc.)
2. Indexes for performance
3. Full-text search indexes
4. Materialized views for common queries
5. Seed data scripts

Output files:
# filepath: backend/migrations/001_create_sessions.sql (150+ lines)
# filepath: backend/migrations/002_create_bookmarks.sql (100+ lines)
# filepath: backend/migrations/003_create_annotations.sql (100+ lines)
# filepath: backend/migrations/004_create_indexes.sql (150+ lines)
# filepath: backend/migrations/005_create_fts_indexes.sql (100+ lines)
# filepath: backend/migrations/006_create_views.sql (150+ lines)
# filepath: backend/migrations/run_migrations.py (200+ lines)
"""
        },
        {
            "id": "PS4_deployment_config",
            "name": "Deployment Configuration",
            "model": "gemini",
            "task": """
TASK: Create deployment configuration files.

Create configs for:
1. Railway (backend deployment)
2. Vercel (frontend deployment)
3. GitHub Actions CI/CD
4. Docker Compose for local dev
5. nginx config for production

Output files:
# filepath: railway.toml (Railway config)
# filepath: vercel.json (Vercel config)
# filepath: .github/workflows/ci.yml (CI workflow, 200+ lines)
# filepath: .github/workflows/deploy-backend.yml (backend deploy)
# filepath: .github/workflows/deploy-frontend.yml (frontend deploy)
# filepath: docker-compose.yml (full stack local dev)
# filepath: nginx/nginx.conf (production nginx)
"""
        },
        {
            "id": "PS5_documentation",
            "name": "Documentation",
            "model": "gemini",
            "task": """
TASK: Create comprehensive documentation.

Document:
1. Project overview and architecture
2. Local development setup
3. API documentation
4. Component documentation
5. Deployment guide
6. Contributing guidelines

Output files:
# filepath: README.md (500+ lines, comprehensive)
# filepath: docs/ARCHITECTURE.md (400+ lines)
# filepath: docs/SETUP.md (300+ lines)
# filepath: docs/API.md (400+ lines)
# filepath: docs/COMPONENTS.md (300+ lines)
# filepath: docs/DEPLOYMENT.md (300+ lines)
# filepath: docs/CONTRIBUTING.md (200+ lines)
"""
        },
    ]
}

# ═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════
# SWARM 6: VERIFICATION PASS 1 - Syntax and Import Checking
# ═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════

VERIFICATION_PASS_1_SWARM = {
    "name": "Verification Pass 1 - Syntax & Imports",
    "description": "First verification pass - check syntax and imports",
    "agents": [
        {
            "id": "V1P1_python_syntax",
            "name": "Python Syntax Validator",
            "model": "gemini",
            "task": """
TASK: Create a comprehensive Python syntax validator.

Implement:
1. Parse all Python files with ast module
2. Check for syntax errors
3. Validate import statements
4. Check for undefined names
5. Detect circular imports
6. Generate fix suggestions

Output files:
# filepath: backend/verification/pass1/syntax_validator.py (400+ lines)
# filepath: backend/verification/pass1/import_checker.py (300+ lines)
# filepath: backend/verification/pass1/circular_import_detector.py (250+ lines)
# filepath: backend/verification/pass1/fix_suggester.py (300+ lines)
"""
        },
        {
            "id": "V1P1_typescript_check",
            "name": "TypeScript Type Validator",
            "model": "gemini",
            "task": """
TASK: Create a comprehensive TypeScript type validator.

Implement:
1. Check for type errors
2. Validate interface definitions
3. Check prop types match usage
4. Verify import paths are correct
5. Generate fix suggestions

Output files:
# filepath: frontend/verification/pass1/type_validator.ts (400+ lines)
# filepath: frontend/verification/pass1/interface_checker.ts (300+ lines)
# filepath: frontend/verification/pass1/import_path_validator.ts (250+ lines)
# filepath: frontend/verification/pass1/fix_suggester.ts (300+ lines)
"""
        },
        {
            "id": "V1P1_api_contract",
            "name": "API Contract Validator",
            "model": "gemini",
            "task": """
TASK: Create an API contract validator.

Validate:
1. Frontend API calls match backend endpoints
2. Request types match backend expectations
3. Response types match backend returns
4. All endpoints have corresponding frontend calls
5. Generate contract documentation

Output files:
# filepath: verification/pass1/contract_validator.py (400+ lines)
# filepath: verification/pass1/endpoint_matcher.py (300+ lines)
# filepath: verification/pass1/type_matcher.py (300+ lines)
# filepath: verification/pass1/contract_reporter.py (250+ lines)
"""
        },
        {
            "id": "V1P1_dependency_check",
            "name": "Dependency Validator",
            "model": "gemini",
            "task": """
TASK: Create a dependency validator.

Check:
1. All Python imports can be resolved
2. All npm packages are in package.json
3. Version compatibility
4. Security vulnerabilities
5. Unused dependencies

Output files:
# filepath: verification/pass1/python_deps_validator.py (300+ lines)
# filepath: verification/pass1/npm_deps_validator.ts (300+ lines)
# filepath: verification/pass1/version_checker.py (250+ lines)
# filepath: verification/pass1/security_scanner.py (300+ lines)
"""
        },
    ]
}

# ═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════
# SWARM 7: VERIFICATION PASS 2 - Functionality Checking
# ═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════

VERIFICATION_PASS_2_SWARM = {
    "name": "Verification Pass 2 - Functionality",
    "description": "Second verification pass - check functionality",
    "agents": [
        {
            "id": "V2P2_db_queries",
            "name": "Database Query Validator",
            "model": "gemini",
            "task": """
TASK: Validate all database queries.

Check:
1. SQL syntax is correct
2. Table/column names match schema
3. Proper parameterization (no SQL injection)
4. Indexes exist for common queries
5. Query performance estimates

Output files:
# filepath: backend/verification/pass2/query_validator.py (400+ lines)
# filepath: backend/verification/pass2/schema_checker.py (300+ lines)
# filepath: backend/verification/pass2/injection_scanner.py (300+ lines)
# filepath: backend/verification/pass2/performance_analyzer.py (300+ lines)
"""
        },
        {
            "id": "V2P2_error_handling",
            "name": "Error Handling Validator",
            "model": "gemini",
            "task": """
TASK: Validate error handling throughout the codebase.

Check:
1. All async operations have try/except
2. API endpoints return proper error responses
3. Database operations handle connection errors
4. Frontend shows error states
5. Errors are logged properly

Output files:
# filepath: verification/pass2/error_handler_validator.py (350+ lines)
# filepath: verification/pass2/api_error_checker.py (300+ lines)
# filepath: verification/pass2/frontend_error_checker.ts (300+ lines)
# filepath: verification/pass2/logging_validator.py (250+ lines)
"""
        },
        {
            "id": "V2P2_security",
            "name": "Security Validator",
            "model": "gemini",
            "task": """
TASK: Validate security throughout the codebase.

Check:
1. No hardcoded credentials
2. SQL injection prevention
3. XSS prevention
4. CORS properly configured
5. Authentication on protected routes
6. Input sanitization

Output files:
# filepath: verification/pass2/credential_scanner.py (300+ lines)
# filepath: verification/pass2/injection_checker.py (300+ lines)
# filepath: verification/pass2/xss_scanner.py (300+ lines)
# filepath: verification/pass2/auth_validator.py (300+ lines)
"""
        },
        {
            "id": "V2P2_completeness",
            "name": "Completeness Validator",
            "model": "gemini",
            "task": """
TASK: Validate code completeness.

Check:
1. No placeholder code (pass, TODO, ...)
2. All functions have implementations
3. All components render properly
4. All API endpoints have handlers
5. All required features are present

Output files:
# filepath: verification/pass2/placeholder_scanner.py (350+ lines)
# filepath: verification/pass2/implementation_checker.py (300+ lines)
# filepath: verification/pass2/feature_checklist.py (300+ lines)
# filepath: verification/pass2/coverage_reporter.py (250+ lines)
"""
        },
    ]
}

# ═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════
# SWARM 8: VERIFICATION PASS 3 - Integration Testing
# ═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════

VERIFICATION_PASS_3_SWARM = {
    "name": "Verification Pass 3 - Integration Tests",
    "description": "Third verification pass - integration testing",
    "agents": [
        {
            "id": "V3P3_api_tests",
            "name": "API Integration Test Generator",
            "model": "gemini",
            "task": """
TASK: Generate comprehensive API integration tests.

Create tests for:
1. All corpus endpoints
2. All translate endpoints
3. All semantia endpoints
4. All chronos endpoints
5. All connectome endpoints
6. Authentication flows
7. Error scenarios

Output files:
# filepath: backend/tests/test_corpus_api.py (400+ lines)
# filepath: backend/tests/test_translate_api.py (400+ lines)
# filepath: backend/tests/test_semantia_api.py (400+ lines)
# filepath: backend/tests/test_chronos_api.py (400+ lines)
# filepath: backend/tests/test_connectome_api.py (400+ lines)
# filepath: backend/tests/test_auth.py (300+ lines)
# filepath: backend/tests/conftest.py (250+ lines)
"""
        },
        {
            "id": "V3P3_component_tests",
            "name": "Component Test Generator",
            "model": "gemini",
            "task": """
TASK: Generate comprehensive component tests.

Create tests for:
1. Reader component rendering and interaction
2. SEMANTIA visualization
3. CHRONOS timeline
4. CONNECTOME graph
5. Translation comparison
6. Search functionality

Output files:
# filepath: frontend/tests/Reader.test.tsx (350+ lines)
# filepath: frontend/tests/Semantia.test.tsx (350+ lines)
# filepath: frontend/tests/Chronos.test.tsx (350+ lines)
# filepath: frontend/tests/Connectome.test.tsx (350+ lines)
# filepath: frontend/tests/Translation.test.tsx (350+ lines)
# filepath: frontend/tests/Search.test.tsx (300+ lines)
# filepath: frontend/tests/setup.ts (150+ lines)
"""
        },
        {
            "id": "V3P3_e2e_tests",
            "name": "E2E Test Generator",
            "model": "gemini",
            "task": """
TASK: Generate comprehensive end-to-end tests.

Create Playwright tests for:
1. Reading a text passage flow
2. Comparing translations flow
3. Exploring semantic relationships flow
4. Navigating timeline flow
5. Searching corpus flow
6. User authentication flow

Output files:
# filepath: frontend/e2e/reader.spec.ts (300+ lines)
# filepath: frontend/e2e/translate.spec.ts (300+ lines)
# filepath: frontend/e2e/semantia.spec.ts (300+ lines)
# filepath: frontend/e2e/chronos.spec.ts (300+ lines)
# filepath: frontend/e2e/search.spec.ts (300+ lines)
# filepath: frontend/e2e/auth.spec.ts (250+ lines)
# filepath: frontend/playwright.config.ts (150+ lines)
"""
        },
        {
            "id": "V3P3_final_report",
            "name": "Final Report Generator",
            "model": "gemini",
            "task": """
TASK: Generate the final integration report.

Report includes:
1. All files generated (inventory)
2. All issues found and their resolutions
3. Test coverage summary
4. Security scan results
5. Performance analysis
6. Deployment readiness checklist
7. Known limitations
8. Next steps for production

Output files:
# filepath: INTEGRATION_REPORT.md (600+ lines)
# filepath: verification/final/inventory.json (complete file list)
# filepath: verification/final/issues_resolved.json (all issues)
# filepath: verification/final/test_results.json (test summary)
# filepath: verification/final/security_scan.json (security results)
# filepath: verification/final/deployment_checklist.md (300+ lines)
"""
        },
    ]
}

# ═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════
# SWARM 9: FIX & RESOLVE - Fix any issues found
# ═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════

FIX_RESOLVE_SWARM = {
    "name": "Fix & Resolve Swarm",
    "description": "Fix any issues found in verification passes",
    "agents": [
        {
            "id": "FR1_import_fixer",
            "name": "Import Fixer",
            "model": "gemini",
            "task": """
TASK: Create an automated import fixer.

Implement:
1. Resolve missing imports
2. Fix circular imports
3. Update import paths
4. Add missing type imports
5. Generate import suggestions

Output files:
# filepath: tools/import_fixer.py (400+ lines)
# filepath: tools/circular_import_resolver.py (300+ lines)
# filepath: tools/path_updater.py (250+ lines)
# filepath: tools/ts_import_fixer.ts (350+ lines)
"""
        },
        {
            "id": "FR2_placeholder_remover",
            "name": "Placeholder Remover",
            "model": "gemini",
            "task": """
TASK: Create a tool to find and complete placeholders.

Implement:
1. Find all pass statements
2. Find all TODO comments
3. Find all ... abbreviations
4. Generate complete implementations
5. Validate replacements

Output files:
# filepath: tools/placeholder_finder.py (300+ lines)
# filepath: tools/implementation_generator.py (400+ lines)
# filepath: tools/replacement_validator.py (250+ lines)
# filepath: tools/batch_completer.py (300+ lines)
"""
        },
        {
            "id": "FR3_type_fixer",
            "name": "Type Error Fixer",
            "model": "gemini",
            "task": """
TASK: Create a tool to fix type errors.

Implement:
1. Find type mismatches
2. Generate correct type annotations
3. Fix interface definitions
4. Update prop types
5. Validate type fixes

Output files:
# filepath: tools/type_error_finder.ts (350+ lines)
# filepath: tools/type_annotator.ts (300+ lines)
# filepath: tools/interface_fixer.ts (300+ lines)
# filepath: tools/type_validator.ts (250+ lines)
"""
        },
        {
            "id": "FR4_error_handler_adder",
            "name": "Error Handler Adder",
            "model": "gemini",
            "task": """
TASK: Create a tool to add missing error handling.

Implement:
1. Find unhandled async operations
2. Add try/except blocks
3. Add error responses to endpoints
4. Add error states to components
5. Add logging to errors

Output files:
# filepath: tools/async_wrapper.py (300+ lines)
# filepath: tools/error_response_adder.py (300+ lines)
# filepath: tools/error_state_adder.ts (300+ lines)
# filepath: tools/error_logger_adder.py (250+ lines)
"""
        },
    ]
}

# ═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════
# SWARM 10: FINAL POLISH - Final quality improvements
# ═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════

FINAL_POLISH_SWARM = {
    "name": "Final Polish Swarm",
    "description": "Final quality improvements and polish",
    "agents": [
        {
            "id": "FP1_code_formatter",
            "name": "Code Formatter",
            "model": "gemini",
            "task": """
TASK: Create code formatting configuration and scripts.

Implement:
1. Black configuration for Python
2. Prettier configuration for TypeScript
3. ESLint configuration
4. Pylint configuration
5. Pre-commit hooks

Output files:
# filepath: backend/pyproject.toml (Black config section)
# filepath: frontend/.prettierrc (Prettier config)
# filepath: frontend/.eslintrc.js (ESLint config, 200+ lines)
# filepath: backend/.pylintrc (Pylint config, 200+ lines)
# filepath: .pre-commit-config.yaml (pre-commit hooks)
"""
        },
        {
            "id": "FP2_performance_optimizer",
            "name": "Performance Optimizer",
            "model": "gemini",
            "task": """
TASK: Create performance optimization utilities.

Implement:
1. Query caching decorators
2. Response compression
3. Lazy loading components
4. Image optimization
5. Bundle analysis

Output files:
# filepath: backend/utils/cache_decorators.py (300+ lines)
# filepath: backend/utils/compression.py (200+ lines)
# filepath: frontend/utils/lazy_loader.ts (200+ lines)
# filepath: frontend/utils/image_optimizer.ts (200+ lines)
# filepath: scripts/analyze_bundle.ts (200+ lines)
"""
        },
        {
            "id": "FP3_monitoring",
            "name": "Monitoring Setup",
            "model": "gemini",
            "task": """
TASK: Create monitoring and observability setup.

Implement:
1. Health check endpoints
2. Metrics collection (Prometheus format)
3. Error tracking (Sentry integration)
4. Performance monitoring
5. Logging aggregation

Output files:
# filepath: backend/monitoring/health.py (300+ lines)
# filepath: backend/monitoring/metrics.py (300+ lines)
# filepath: backend/monitoring/sentry_config.py (200+ lines)
# filepath: backend/monitoring/performance.py (250+ lines)
# filepath: frontend/monitoring/analytics.ts (250+ lines)
"""
        },
        {
            "id": "FP4_scripts",
            "name": "Utility Scripts",
            "model": "gemini",
            "task": """
TASK: Create utility scripts for development and deployment.

Create:
1. Database seeding script
2. Development server script
3. Production build script
4. Deployment script
5. Backup script
6. Rollback script

Output files:
# filepath: scripts/seed_database.py (300+ lines)
# filepath: scripts/dev_server.sh (100+ lines)
# filepath: scripts/build.sh (100+ lines)
# filepath: scripts/deploy.sh (150+ lines)
# filepath: scripts/backup.sh (100+ lines)
# filepath: scripts/rollback.sh (100+ lines)
"""
        },
    ]
}

# ═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════
# ALL SWARMS
# ═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════

ALL_SWARMS = [
    ("1_analysis", ANALYSIS_SWARM),
    ("2_backend_completion", BACKEND_COMPLETION_SWARM),
    ("3_frontend_completion", FRONTEND_COMPLETION_SWARM),
    ("4_wiring", WIRING_SWARM),
    ("5_project_structure", PROJECT_STRUCTURE_SWARM),
    ("6_verification_pass1", VERIFICATION_PASS_1_SWARM),
    ("7_verification_pass2", VERIFICATION_PASS_2_SWARM),
    ("8_verification_pass3", VERIFICATION_PASS_3_SWARM),
    ("9_fix_resolve", FIX_RESOLVE_SWARM),
    ("10_final_polish", FINAL_POLISH_SWARM),
]

# Total agents count
TOTAL_AGENTS = sum(len(swarm["agents"]) for _, swarm in ALL_SWARMS)

# ═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════
# LLM CLIENT
# ═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════

class LLMClient:
    """Async LLM client for Claude and Gemini - routes all calls to Gemini."""
    
    def __init__(self):
        self.session = None
        self.semaphore = asyncio.Semaphore(MAX_CONCURRENT_API_CALLS)
    
    async def init_session(self):
        if not self.session:
            timeout = aiohttp.ClientTimeout(total=600)  # 10 min timeout
            self.session = aiohttp.ClientSession(timeout=timeout)
    
    async def close(self):
        if self.session:
            await self.session.close()
    
    async def call(self, prompt: str, model: str, system_prompt: str = MASTER_SYSTEM_PROMPT) -> str:
        """Call LLM - routes everything to Gemini to avoid rate limits."""
        async with self.semaphore:
            # Route EVERYTHING to Gemini (no OpenAI, minimal Claude to avoid rate limits)
            if "claude" in model.lower() or "sonnet" in model.lower():
                return await self._call_claude(prompt, system_prompt)
            else:
                return await self._call_gemini(prompt, system_prompt)
    
    async def _call_claude(self, prompt: str, system_prompt: str) -> str:
        """Call Anthropic Claude API."""
        headers = {
            "x-api-key": ANTHROPIC_API_KEY,
            "content-type": "application/json",
            "anthropic-version": "2023-06-01"
        }
        data = {
            "model": "claude-sonnet-4-20250514",
            "max_tokens": 32768,
            "system": system_prompt,
            "messages": [{"role": "user", "content": prompt}]
        }
        try:
            async with self.session.post(
                "https://api.anthropic.com/v1/messages",
                headers=headers,
                json=data
            ) as resp:
                result = await resp.json()
                if "error" in result:
                    print(f"     Claude error: {result['error'].get('message', 'Unknown')}")
                    return ""
                return result.get("content", [{}])[0].get("text", "")
        except Exception as e:
            print(f"     Claude exception: {e}")
            return ""
    
    async def _call_gemini(self, prompt: str, system_prompt: str) -> str:
        """Call Google Gemini API - using Gemini 3 Flash Preview."""
        url = f"https://generativelanguage.googleapis.com/v1beta/models/{GEMINI_MODEL}:generateContent?key={GOOGLE_API_KEY}"
        data = {
            "contents": [{"parts": [{"text": f"{system_prompt}\n\n{prompt}"}]}],
            "generationConfig": {
                "maxOutputTokens": 65536,
                "temperature": 0.7
            }
        }
        try:
            async with self.session.post(url, json=data) as resp:
                result = await resp.json()
                if "error" in result:
                    print(f"     Gemini error: {result['error'].get('message', 'Unknown')}")
                    return ""
                candidates = result.get("candidates", [{}])
                if candidates:
                    parts = candidates[0].get("content", {}).get("parts", [])
                    return "".join(p.get("text", "") for p in parts if "text" in p)
                return ""
        except Exception as e:
            print(f"     Gemini exception: {e}")
            return ""

# ═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════
# CHECKPOINT DATABASE
# ═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════

class CheckpointDB:
    """SQLite database for tracking progress."""
    
    def __init__(self, db_path: str):
        self.db_path = db_path
        self.conn = sqlite3.connect(db_path)
        self._init_tables()
    
    def _init_tables(self):
        self.conn.executescript("""
            CREATE TABLE IF NOT EXISTS tasks (
                task_id TEXT PRIMARY KEY,
                swarm TEXT,
                status TEXT DEFAULT 'pending',
                output TEXT,
                output_chars INTEGER DEFAULT 0,
                attempts INTEGER DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                completed_at TIMESTAMP
            );
            CREATE TABLE IF NOT EXISTS files (
                path TEXT PRIMARY KEY,
                content TEXT,
                chars INTEGER,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
            CREATE TABLE IF NOT EXISTS analysis (
                key TEXT PRIMARY KEY,
                value TEXT,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        """)
        self.conn.commit()
    
    def get_task_status(self, task_id: str) -> Optional[str]:
        cur = self.conn.execute("SELECT status FROM tasks WHERE task_id = ?", (task_id,))
        row = cur.fetchone()
        return row[0] if row else None
    
    def set_task_pending(self, task_id: str, swarm: str):
        self.conn.execute(
            "INSERT OR REPLACE INTO tasks (task_id, swarm, status) VALUES (?, ?, 'pending')",
            (task_id, swarm)
        )
        self.conn.commit()
    
    def set_task_running(self, task_id: str):
        self.conn.execute(
            "UPDATE tasks SET status = 'running', attempts = attempts + 1 WHERE task_id = ?",
            (task_id,)
        )
        self.conn.commit()
    
    def get_task_attempts(self, task_id: str) -> int:
        cur = self.conn.execute("SELECT attempts FROM tasks WHERE task_id = ?", (task_id,))
        row = cur.fetchone()
        return row[0] if row else 0
    
    def set_task_complete(self, task_id: str, output: str):
        self.conn.execute(
            "UPDATE tasks SET status = 'complete', output = ?, output_chars = ?, completed_at = CURRENT_TIMESTAMP WHERE task_id = ?",
            (output, len(output), task_id)
        )
        self.conn.commit()
    
    def set_task_failed(self, task_id: str, error: str):
        self.conn.execute(
            "UPDATE tasks SET status = 'failed', output = ? WHERE task_id = ?",
            (error, task_id)
        )
        self.conn.commit()
    
    def save_file(self, path: str, content: str):
        self.conn.execute(
            "INSERT OR REPLACE INTO files (path, content, chars) VALUES (?, ?, ?)",
            (path, content, len(content))
        )
        self.conn.commit()
    
    def get_stats(self) -> Dict[str, int]:
        cur = self.conn.execute("""
            SELECT status, COUNT(*) FROM tasks GROUP BY status
        """)
        stats = {"pending": 0, "running": 0, "complete": 0, "failed": 0}
        for row in cur:
            stats[row[0]] = row[1]
        return stats
    
    def close(self):
        self.conn.close()

# ═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════
# CODE QUALITY VALIDATOR - TRIPLE-CHECK ENFORCEMENT
# ═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════

def validate_code_quality(code: str) -> tuple[bool, str]:
    """
    TRIPLE-CHECK code quality validation.
    
    CHECK 1: Verify sufficient real code patterns exist
    CHECK 2: Reject ANY placeholder/stub patterns  
    CHECK 3: Verify code completeness indicators
    
    Returns (is_valid, reason)
    """
    
    # ═══════════════════════════════════════════════════════════════════════════════
    # CHECK 1: REAL CODE PATTERNS (must have substantial real code)
    # ═══════════════════════════════════════════════════════════════════════════════
    
    # Python patterns that indicate real implementation
    py_implementation_patterns = [
        "def ", "class ", "async def ", "import ", "from ", "return ", 
        "await ", "if ", "for ", "while ", "try:", "except:", "with ",
        "self.", "async with", "yield ", "raise ", "logger.", "logging."
    ]
    
    # TypeScript/React patterns that indicate real implementation
    ts_implementation_patterns = [
        "const ", "interface ", "export ", "import ", "useState", "useEffect",
        "useCallback", "useMemo", "return (", "function ", "=>", "async ",
        "await ", "try {", "catch (", ".map(", ".filter(", "className="
    ]
    
    py_count = sum(code.count(p) for p in py_implementation_patterns)
    ts_count = sum(code.count(p) for p in ts_implementation_patterns)
    
    # Require MORE real code patterns
    if py_count < 25 and ts_count < 20:
        return False, f"CHECK 1 FAILED: Insufficient real code (py:{py_count}<25, ts:{ts_count}<20)"
    
    # ═══════════════════════════════════════════════════════════════════════════════
    # CHECK 2: PLACEHOLDER PATTERNS (zero tolerance)
    # ═══════════════════════════════════════════════════════════════════════════════
    
    # FORBIDDEN patterns - reject if more than 3 found
    forbidden_patterns = [
        # TODO patterns
        "# TODO:", "# TODO ", "// TODO:", "// TODO ", "/* TODO",
        "# FIXME", "// FIXME", "/* FIXME",
        
        # Pass/stub patterns
        "pass\n", "pass  #", "pass #",
        "...\n", "...  #", 
        
        # Implementation deferred patterns
        "# implement", "// implement", "/* implement",
        "# add ", "// add ", "/* add ",
        "# more ", "// more ", "/* more ",
        "# complete", "// complete",
        "# finish", "// finish",
        "# later", "// later",
        "# placeholder", "// placeholder",
        "# stub", "// stub",
        "# TBD", "// TBD",
        
        # Error throwing instead of implementation
        "NotImplementedError",
        "raise NotImplemented",
        "throw new Error('Not implemented",
        "throw new Error(\"Not implemented",
        
        # Abbreviation patterns
        "# ...", "// ...", "/* ...",
        "# etc", "// etc",
        "# and so on", "// and so on",
        "# similar", "// similar",
        "# same as", "// same as",
        "# like above", "// like above",
        
        # Empty returns
        "return None  #",
        "return null  //",
        "return {}  #",
        "return {}  //",
        "return []  #",
        "return []  //",
    ]
    
    forbidden_count = sum(code.count(p) for p in forbidden_patterns)
    if forbidden_count > 3:  # Very strict - only allow 3 max
        return False, f"CHECK 2 FAILED: {forbidden_count} forbidden placeholder patterns found (max 3)"
    
    # ═══════════════════════════════════════════════════════════════════════════════
    # CHECK 3: COMPLETENESS INDICATORS (verify real implementations exist)
    # ═══════════════════════════════════════════════════════════════════════════════
    
    # Must have error handling
    error_handling = code.count("try:") + code.count("try {") + code.count("except") + code.count("catch (")
    if error_handling < 3:
        return False, f"CHECK 3 FAILED: Insufficient error handling ({error_handling} try/except found, need 3+)"
    
    # Must have logging (for backend code) or console (for frontend)
    logging_count = code.count("logger.") + code.count("logging.") + code.count("console.") + code.count("print(")
    if logging_count < 2 and len(code) > 5000:
        return False, f"CHECK 3 FAILED: No logging found in substantial code"
    
    # Check for substantial function bodies (not just definitions)
    # Count functions and check average seems reasonable
    func_defs = code.count("def ") + code.count("async def ") + code.count("function ") + code.count("const ") 
    if func_defs > 0:
        avg_chars_per_func = len(code) / func_defs
        if avg_chars_per_func < 200:  # Each function should average 200+ chars
            return False, f"CHECK 3 FAILED: Functions too short (avg {avg_chars_per_func:.0f} chars, need 200+)"
    
    # ═══════════════════════════════════════════════════════════════════════════════
    # ALL THREE CHECKS PASSED
    # ═══════════════════════════════════════════════════════════════════════════════
    
    return True, "ALL 3 QUALITY CHECKS PASSED"


def validate_no_fake_translators(code: str) -> tuple[bool, str]:
    """Check that no copyrighted translators are referenced."""
    
    fake_translators = ["Chapman", "Lattimore", "Fagles", "Wilson", "Fitzgerald"]
    
    for fake in fake_translators:
        if fake in code:
            return False, f"FAKE TRANSLATOR FOUND: {fake} - COPYRIGHTED, CANNOT USE"
    
    return True, "No fake translators"


def validate_no_mock_data(code: str) -> tuple[bool, str]:
    """Check that code uses real database queries, not mock data."""
    
    mock_patterns = [
        "mock_data", "MOCK_DATA", "mockData",
        "fake_data", "FAKE_DATA", "fakeData", 
        "dummy_data", "DUMMY_DATA", "dummyData",
        "sample_data", "SAMPLE_DATA", "sampleData",
        "test_data =", "TEST_DATA =",
        "hardcoded", "HARDCODED",
        "# Mock", "// Mock", "/* Mock",
        "return [{", "return [\"",  # Suspicious hardcoded returns
    ]
    
    mock_count = sum(code.count(p) for p in mock_patterns)
    if mock_count > 2:
        return False, f"MOCK DATA DETECTED: {mock_count} mock/fake data patterns found"
    
    return True, "No mock data"


def triple_validate_output(code: str) -> tuple[bool, str]:
    """Run all three validation checks."""
    
    # Check 1: Code quality
    ok, msg = validate_code_quality(code)
    if not ok:
        return False, msg
    
    # Check 2: No fake translators
    ok, msg = validate_no_fake_translators(code)
    if not ok:
        return False, msg
    
    # Check 3: No mock data
    ok, msg = validate_no_mock_data(code)
    if not ok:
        return False, msg
    
    return True, "TRIPLE VALIDATION PASSED"

# ═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════
# SWARM ORCHESTRATOR
# ═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════

class SwarmOrchestrator:
    """Orchestrates all integration swarms."""
    
    def __init__(self):
        self.output_dir = Path(OUTPUT_DIR)
        self.output_dir.mkdir(parents=True, exist_ok=True)
        
        self.db = CheckpointDB(str(self.output_dir / "integration_progress.db"))
        self.client = LLMClient()
        self.start_time = None
    
    async def run_all_swarms(self):
        """Run all swarms in sequence."""
        await self.client.init_session()
        self.start_time = datetime.now()
        
        print(f"""
╔════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╗
║                                                                                                                            ║
║     LOGOS INTEGRATION SWARM V2                                                                                           ║
║                                                                                                                            ║
║   Phase 2: Analyze, Complete, Wire, Triple-Check                                                                          ║
║   10 SWARMS | {TOTAL_AGENTS} AGENTS | 3 VERIFICATION PASSES                                                                           ║
║                                                                                                                            ║
╚════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╝
        """)
        
        # Check API keys
        if not ANTHROPIC_API_KEY:
            print(" ANTHROPIC_API_KEY not set")
            return
        if not GOOGLE_API_KEY:
            print(" GOOGLE_API_KEY not set")
            return
        print(" API keys present")
        print(f"📁 Output directory: {OUTPUT_DIR}")
        print(f"📂 Source build: {SOURCE_BUILD_DIR}")
        
        # Check source build exists
        source_path = Path(SOURCE_BUILD_DIR)
        if source_path.exists():
            file_count = len(list(source_path.rglob("*.txt")))
            print(f" Source build found: {file_count} files")
        else:
            print(f" Source build not found at {SOURCE_BUILD_DIR}")
        
        # Run swarms in sequence
        for swarm_id, swarm in ALL_SWARMS:
            print(f"\n{'='*100}")
            print(f" RUNNING: {swarm['name']} ({len(swarm['agents'])} agents)")
            print(f"{'='*100}")
            await self.run_swarm(swarm_id, swarm)
        
        # Final report
        await self.generate_final_report()
        
        await self.client.close()
        self.db.close()
    
    async def run_swarm(self, swarm_id: str, swarm: Dict[str, Any]):
        """Run all agents in a swarm."""
        
        # Create swarm output directory
        swarm_dir = self.output_dir / swarm_id
        swarm_dir.mkdir(parents=True, exist_ok=True)
        
        # Run agents with staggered starts
        tasks = []
        for i, agent in enumerate(swarm["agents"]):
            task = self.run_agent(swarm_id, agent, swarm_dir, i * 5.0)  # 5 second stagger
            tasks.append(task)
        
        results = await asyncio.gather(*tasks, return_exceptions=True)
        
        # Count results
        success = sum(1 for r in results if isinstance(r, tuple) and r[1])
        failed = len(results) - success
        
        print(f"\n {swarm['name']} complete: {success} success, {failed} failed")
    
    async def run_agent(self, swarm_id: str, agent: Dict[str, Any], swarm_dir: Path, delay: float):
        """Run a single agent with retries and quality checks."""
        await asyncio.sleep(delay)
        
        task_id = agent["id"]
        
        # Check if already complete
        status = self.db.get_task_status(task_id)
        if status == "complete":
            print(f"   {task_id} already complete, skipping")
            return task_id, True, "Already complete"
        
        print(f"   {task_id} starting...")
        self.db.set_task_pending(task_id, swarm_id)
        
        # Build prompt
        prompt = f"""
╔═══════════════════════════════════════════════════════════════════════════════╗
║   LOGOS INTEGRATION - {agent['name']:<58} ║
╚═══════════════════════════════════════════════════════════════════════════════╝

{agent['task']}

═══════════════════════════════════════════════════════════════════════════════
CRITICAL REQUIREMENTS:
═══════════════════════════════════════════════════════════════════════════════
1. Generate COMPLETE, WORKING code - NO stubs or placeholders
2. Each Python file: 250-600 lines with 15+ methods per class
3. Each TypeScript file: 200-500 lines with proper types
4. Include ALL imports at the top of each file
5. Include comprehensive error handling with try/except
6. Include logging throughout (logger = logging.getLogger(__name__))
7. Use REAL database queries with asyncpg
8. Your output should be 30,000-100,000 characters of real code

DO NOT use pass statements, TODO comments, or ... abbreviations.
Every function must have a COMPLETE implementation.

NOW GENERATE ALL REQUESTED FILES:
"""
        
        for attempt in range(MAX_RETRIES):
            self.db.set_task_running(task_id)
            
            try:
                result = await self.client.call(prompt, agent.get("model", "gemini"))
                
                # Validate output length
                if len(result) == 0:
                    if attempt < MAX_RETRIES - 1:
                        wait = ZERO_CHAR_DELAYS[min(attempt, len(ZERO_CHAR_DELAYS)-1)]
                        print(f"   {task_id} got 0 chars, waiting {wait}s (attempt {attempt+1}/{MAX_RETRIES})...")
                        await asyncio.sleep(wait)
                        continue
                    else:
                        self.db.set_task_failed(task_id, "Zero output after max retries")
                        print(f"   {task_id} FAILED - 0 chars after {MAX_RETRIES} attempts")
                        return task_id, False, "Zero output"
                
                # TRIPLE-CHECK code quality (3 independent validations)
                quality_ok, quality_msg = triple_validate_output(result)
                if not quality_ok:
                    if attempt < MAX_RETRIES - 1:
                        wait = SHORT_OUTPUT_DELAYS[min(attempt, len(SHORT_OUTPUT_DELAYS)-1)]
                        print(f"   {task_id} TRIPLE-CHECK FAILED: {quality_msg}, waiting {wait}s...")
                        
                        # Add STRONG quality feedback to prompt for retry
                        prompt += f"""

╔═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╗
║   RETRY {attempt+2}/{MAX_RETRIES} - TRIPLE QUALITY CHECK FAILED                                                             ║
╚═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╝

 FAILURE REASON: {quality_msg}

YOUR PREVIOUS OUTPUT WAS REJECTED. YOU MUST FIX THIS NOW:

1.  NO placeholder code - write COMPLETE implementations for EVERY function
2.  NO pass statements - write REAL function bodies with 20+ lines each  
3.  NO TODO/FIXME comments - write the actual code NOW
4.  NO ... abbreviations - write ALL the code out fully
5.  NO mock/fake data - use REAL database queries with asyncpg
6.  NO NotImplementedError - IMPLEMENT everything
7.  MUST have try/except error handling throughout
8.  MUST have logging statements (logger.info, logger.error)
9.  MUST have type hints on all functions
10.  MUST output 35,000+ characters of REAL, WORKING, PRODUCTION code

THIS IS YOUR {attempt+2} ATTEMPT. THE CODE WILL BE DEPLOYED TO PRODUCTION.
WRITE IT PROPERLY THIS TIME OR THE BUILD WILL FAIL.
"""
                        await asyncio.sleep(wait)
                        continue
                    else:
                        # Stricter acceptance - need at least 20K chars after all retries
                        if len(result) >= MIN_ACCEPTABLE_CHARS:
                            print(f"   {task_id} accepted with warnings ({len(result):,} chars) - {quality_msg}")
                        else:
                            self.db.set_task_failed(task_id, f"TRIPLE-CHECK FAILED: {quality_msg}")
                            print(f"   {task_id} REJECTED - {quality_msg}")
                            return task_id, False, quality_msg
                
                # Check minimum length - STRICT
                if len(result) < MIN_OUTPUT_CHARS:
                    if attempt < MAX_RETRIES - 1:
                        wait = SHORT_OUTPUT_DELAYS[min(attempt, len(SHORT_OUTPUT_DELAYS)-1)]
                        print(f"   {task_id} output too short ({len(result):,} chars, need {MIN_OUTPUT_CHARS:,}), waiting {wait}s...")
                        prompt += f"""

 OUTPUT TOO SHORT: {len(result):,} chars (minimum {MIN_OUTPUT_CHARS:,} required)

Write MORE code. Each file should be 300-600 lines.
Every function needs 20+ lines of real implementation.
Include comprehensive error handling and logging.
"""
                        await asyncio.sleep(wait)
                        continue
                    else:
                        # Accept if at least MIN_ACCEPTABLE_CHARS
                        if len(result) >= MIN_ACCEPTABLE_CHARS:
                            print(f"   {task_id} accepted with {len(result):,} chars (below {MIN_OUTPUT_CHARS:,} target)")
                        else:
                            self.db.set_task_failed(task_id, f"Output too short: {len(result)} chars")
                            print(f"   {task_id} FAILED - only {len(result):,} chars (need {MIN_ACCEPTABLE_CHARS:,}+)")
                            return task_id, False, f"Too short: {len(result)}"
                
                # Save output
                output_file = swarm_dir / f"{task_id}.txt"
                output_file.write_text(result)
                
                self.db.set_task_complete(task_id, result)
                print(f"   {task_id} PASSED ALL CHECKS ({len(result):,} chars)")
                return task_id, True, result
            
            except Exception as e:
                if attempt < MAX_RETRIES - 1:
                    wait = 30 * (attempt + 1)
                    print(f"   {task_id} error: {e}, waiting {wait}s...")
                    await asyncio.sleep(wait)
                else:
                    self.db.set_task_failed(task_id, str(e))
                    print(f"   {task_id} FAILED: {e}")
                    return task_id, False, str(e)
        
        return task_id, False, "Max retries exceeded"
    
    async def generate_final_report(self):
        """Generate final build report."""
        elapsed = (datetime.now() - self.start_time).total_seconds() / 3600
        stats = self.db.get_stats()
        
        report = f"""
╔════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╗
║                                                                                                                            ║
║     LOGOS INTEGRATION SWARM V2 - FINAL REPORT                                                                            ║
║                                                                                                                            ║
╚════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╝

BUILD SUMMARY
═════════════════════════════════════════════════════════════════════════════════
Total Tasks:        {stats['complete'] + stats['failed']}
 Successful:      {stats['complete']}
 Failed:          {stats['failed']}
Elapsed Time:       {elapsed:.1f} hours

OUTPUT LOCATION
═════════════════════════════════════════════════════════════════════════════════
{OUTPUT_DIR}/

SWARM RESULTS
═════════════════════════════════════════════════════════════════════════════════
"""
        
        for swarm_id, swarm in ALL_SWARMS:
            swarm_dir = self.output_dir / swarm_id
            if swarm_dir.exists():
                file_count = len(list(swarm_dir.glob("*.txt")))
                report += f"   {swarm['name']}: {file_count} files generated\n"
        
        report += f"""

NEXT STEPS
═════════════════════════════════════════════════════════════════════════════════
1. Review generated code in {OUTPUT_DIR}/
2. Extract code from .txt files into proper project structure
3. Run: pip install -r requirements.txt (backend)
4. Run: npm install (frontend)
5. Run database migrations
6. Start development servers
7. Test all endpoints and components

╔════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╗
║                                                                                                                            ║
║     INTEGRATION {'SUCCESSFUL' if stats['failed'] == 0 else 'COMPLETED WITH ISSUES'}                                                                                              ║
║                                                                                                                            ║
╚════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╝
"""
        
        # Save report
        report_path = self.output_dir / "INTEGRATION_REPORT.txt"
        report_path.write_text(report)
        
        print(report)

# ═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════
# MAIN
# ═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════

def main():
    print(f"""
╔═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╗
║                                                                                                                           ║
║     LOGOS INTEGRATION SWARM V2                                                                                          ║
║                                                                                                                           ║
║   Analyze → Complete → Wire → Triple-Check                                                                               ║
║   10 Swarms | {TOTAL_AGENTS} Agents | 3 Verification Passes                                                                          ║
║                                                                                                                           ║
╚═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╝
    """)
    
    orchestrator = SwarmOrchestrator()
    asyncio.run(orchestrator.run_all_swarms())

if __name__ == "__main__":
    main()
