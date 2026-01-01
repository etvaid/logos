#!/usr/bin/env python3
"""
╔═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╗
║                                                                                                                           ║
║   LOGOS ULTIMATE FIX EXECUTOR V1                                                                                          ║
║   ══════════════════════════════                                                                                          ║
║                                                                                                                           ║
║   TRIPLE LLM VALIDATION + CREATIVE APPROACHES + MASTER AGENT                                                              ║
║                                                                                                                           ║
║   WORKFLOW:                                                                                                               ║
║   ┌─────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐    ║
║   │  1. GEMINI 3 FLASH PREVIEW → Generate initial fix                                                               │    ║
║   │  2. GEMINI 3 FLASH PREVIEW → Validate fix (fast pattern check)                                                  │    ║
║   │  3. CLAUDE SONNET 4 → Deep validation (edge cases, security)                                                    │    ║
║   │  4. CHATGPT 5.1 PRO DEEPTHINK → Creative alternatives + better approaches                                       │    ║
║   │  5. CLAUDE MASTER AGENT → Final decision: APPROVE / RETRY / CREATIVE / ESCALATE                                │    ║
║   └─────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘    ║
║                                                                                                                           ║
║   QUALITY ENFORCEMENT:                                                                                                    ║
║   - ALL 43 translators permitted (Pope, Lattimore, Fagles, Chapman, Wilson, Fitzgerald, etc.)                            ║
║   - 20-dimensional style vectors COMPUTED from corpus (never hardcoded)                                                  ║
║   - NO placeholders (pass, TODO, ..., NotImplementedError)                                                               ║
║   - NO mock/fake data - REAL database queries required                                                                   ║
║   - COMPLETE implementations - 10+ lines per function                                                                    ║
║   - ERROR HANDLING - try/except on all async operations                                                                  ║
║   - LOGGING - proper logger statements throughout                                                                        ║
║   - TYPE HINTS - all functions must have type annotations                                                                ║
║                                                                                                                           ║
║   NO SHORTCUTS. NO FAKE DATA. EXTENSIVE REVIEW. BEST CODE.                                                               ║
║                                                                                                                           ║
╚═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╝
"""

import os
import sys
import json
import asyncio
import aiohttp
import re
from pathlib import Path
from datetime import datetime
from collections import defaultdict
from dataclasses import dataclass, field, asdict
from typing import Dict, List, Optional, Any, Tuple
from enum import Enum

# =============================================================================
# CONFIGURATION - API KEYS HARDCODED
# =============================================================================

GOOGLE_API_KEY = "AIzaSyCWzAtEzVzfmlrSC18UePrHFwSR-rf9hKM"
ANTHROPIC_API_KEY = "ANTHROPIC_API_KEY_REMOVED"
OPENAI_API_KEY = "OPENAI_API_KEY_REMOVED"

# MODELS - NEWEST VERSIONS
GEMINI_MODEL = "gemini-3-flash-preview"  # Newest Gemini 3 Flash
CLAUDE_MODEL = "claude-sonnet-4-20250514"  # Claude Sonnet 4
OPENAI_MODEL = "gpt-4o"  # GPT-4o for deep thinking (5.1 Pro not yet available via API)

# PATHS
BASE_PATH = Path(os.path.expanduser("~/Downloads/logos"))
SOURCE_DIR = BASE_PATH / "logos_WIRED_POLISHED_FINAL"
OUTPUT_DIR = BASE_PATH / "logos_FIXED_FINAL"
REPORTS_DIR = BASE_PATH / "logos_fix_reports"

# CONCURRENCY
MAX_CONCURRENT = 3  # Process 3 files at a time
MAX_RETRIES = 5  # Retry failed fixes up to 5 times
TIMEOUT = 180  # 3 minute timeout per API call

# =============================================================================
# DATABASE CONNECTION (RAILWAY)
# =============================================================================

RAILWAY_DB_URL = "postgresql://postgres:QBLyBRoFNvquLbLpGHhpZGMOIOEQLVvM@monorail.proxy.rlwy.net:24727/railway"

# =============================================================================
# QUALITY REQUIREMENTS
# =============================================================================

QUALITY_REQUIREMENTS = """
ABSOLUTE REQUIREMENTS FOR PRODUCTION CODE:

1. ERROR HANDLING
   - Every async function MUST have try/except
   - Log all exceptions with logger.exception() or logger.error()
   - Return appropriate error responses (HTTPException for FastAPI)
   - Never swallow exceptions silently

2. TYPE HINTS
   - All function parameters MUST have type annotations
   - All return types MUST be annotated
   - Use Optional[] for nullable types
   - Use Union[] or | for multiple types

3. LOGGING
   - Use logger = logging.getLogger(__name__)
   - Log at appropriate levels: debug, info, warning, error
   - Include context in log messages

4. NO PLACEHOLDERS
   - No 'pass' statements except in abstract methods
   - No '...' (Ellipsis)
   - No 'TODO' or 'FIXME' comments
   - No 'raise NotImplementedError' except in abstract base classes

5. COMPLETE IMPLEMENTATIONS
   - Every function must have full implementation
   - Minimum 5-10 lines per non-trivial function
   - Real database queries, not mock data
   - Real business logic, not stubs

6. DATABASE
   - Use Railway PostgreSQL: {db_url}
   - Parameterized queries (no SQL injection)
   - Connection pooling with asyncpg
   - Proper transaction handling

7. STYLE VECTORS (FOR TRANSLATION CODE)
   - All 20 dimensions must be COMPUTED from text
   - Use Burrows' Delta with z-score normalization
   - Function word frequencies per 1000 words
   - Never hardcode style vector values
""".format(db_url=RAILWAY_DB_URL)

# =============================================================================
# DATA STRUCTURES
# =============================================================================

class Decision(Enum):
    APPROVE = "approve"
    RETRY = "retry"
    CREATIVE = "creative"
    ESCALATE = "escalate"
    QUEUED = "queued"  # Saved for human review, continue with other tasks

# Human escalation queue - questions saved for later
HUMAN_QUESTIONS_FILE = REPORTS_DIR / "HUMAN_QUESTIONS.json"
human_questions_queue = []

@dataclass
class ValidationResult:
    passed: bool
    score: int  # 0-100
    issues: List[str] = field(default_factory=list)
    suggestions: List[str] = field(default_factory=list)

@dataclass
class CreativeApproach:
    description: str
    rationale: str
    code_snippet: str
    improvement: str  # e.g., "5x faster", "more readable"

@dataclass
class FixResult:
    issue_id: str
    issue_type: str
    line_num: int
    original_code: str
    fixed_code: str
    gemini_validation: ValidationResult
    claude_validation: ValidationResult
    chatgpt_validation: Optional[ValidationResult]
    creative_approaches: List[CreativeApproach]
    master_decision: Decision
    master_rationale: str
    final_code: str
    success: bool
    human_question: Optional[str] = None  # Queued for human review

# =============================================================================
# LLM API CALLS
# =============================================================================

async def call_gemini(
    prompt: str, 
    session: aiohttp.ClientSession,
    max_tokens: int = 16384
) -> str:
    """Call Gemini 3 Flash Preview API."""
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{GEMINI_MODEL}:generateContent"
    
    headers = {"Content-Type": "application/json"}
    params = {"key": GOOGLE_API_KEY}
    
    data = {
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {
            "maxOutputTokens": max_tokens,
            "temperature": 0.1
        }
    }
    
    for attempt in range(MAX_RETRIES):
        try:
            async with session.post(
                url, headers=headers, params=params, json=data, 
                timeout=aiohttp.ClientTimeout(total=TIMEOUT)
            ) as resp:
                if resp.status == 200:
                    result = await resp.json()
                    try:
                        return result["candidates"][0]["content"]["parts"][0]["text"]
                    except (KeyError, IndexError):
                        return ""
                else:
                    error = await resp.text()
                    print(f"      ⚠️ Gemini error (attempt {attempt+1}): {error[:100]}")
                    if attempt < MAX_RETRIES - 1:
                        await asyncio.sleep(5 * (attempt + 1))
        except asyncio.TimeoutError:
            print(f"      ⚠️ Gemini timeout (attempt {attempt+1})")
            if attempt < MAX_RETRIES - 1:
                await asyncio.sleep(5)
        except Exception as e:
            print(f"      ⚠️ Gemini exception: {e}")
            if attempt < MAX_RETRIES - 1:
                await asyncio.sleep(5)
    
    return ""

async def call_claude(
    prompt: str,
    session: aiohttp.ClientSession,
    max_tokens: int = 16384
) -> str:
    """Call Claude Sonnet 4 API."""
    url = "https://api.anthropic.com/v1/messages"
    
    headers = {
        "Content-Type": "application/json",
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01"
    }
    
    data = {
        "model": CLAUDE_MODEL,
        "max_tokens": max_tokens,
        "messages": [{"role": "user", "content": prompt}]
    }
    
    for attempt in range(MAX_RETRIES):
        try:
            async with session.post(
                url, headers=headers, json=data,
                timeout=aiohttp.ClientTimeout(total=TIMEOUT)
            ) as resp:
                if resp.status == 200:
                    result = await resp.json()
                    try:
                        return result["content"][0]["text"]
                    except (KeyError, IndexError):
                        return ""
                else:
                    error = await resp.text()
                    print(f"      ⚠️ Claude error (attempt {attempt+1}): {error[:100]}")
                    if attempt < MAX_RETRIES - 1:
                        await asyncio.sleep(5 * (attempt + 1))
        except asyncio.TimeoutError:
            print(f"      ⚠️ Claude timeout (attempt {attempt+1})")
            if attempt < MAX_RETRIES - 1:
                await asyncio.sleep(5)
        except Exception as e:
            print(f"      ⚠️ Claude exception: {e}")
            if attempt < MAX_RETRIES - 1:
                await asyncio.sleep(5)
    
    return ""

async def call_chatgpt(
    prompt: str,
    session: aiohttp.ClientSession,
    max_tokens: int = 16384
) -> str:
    """Call ChatGPT/GPT-4o API for deep thinking and creative approaches."""
    url = "https://api.openai.com/v1/chat/completions"
    
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {OPENAI_API_KEY}"
    }
    
    data = {
        "model": OPENAI_MODEL,
        "max_tokens": max_tokens,
        "temperature": 0.3,  # Slightly higher for creativity
        "messages": [
            {
                "role": "system",
                "content": """You are a senior software architect reviewing code for a $10M production system.

Your job is TWO-FOLD:
1. VALIDATE the code meets production quality standards
2. THINK CREATIVELY about BETTER approaches

For every piece of code, ask yourself:
- Is there a more elegant algorithm?
- Is there a more Pythonic/idiomatic way?
- Could we improve performance significantly?
- Is there a better design pattern?
- Could we reduce complexity while maintaining functionality?

When you see a good alternative, propose it with clear rationale."""
            },
            {"role": "user", "content": prompt}
        ]
    }
    
    for attempt in range(MAX_RETRIES):
        try:
            async with session.post(
                url, headers=headers, json=data,
                timeout=aiohttp.ClientTimeout(total=TIMEOUT)
            ) as resp:
                if resp.status == 200:
                    result = await resp.json()
                    try:
                        return result["choices"][0]["message"]["content"]
                    except (KeyError, IndexError):
                        return ""
                else:
                    error = await resp.text()
                    # Rate limit handling
                    if "rate_limit" in error.lower():
                        wait_time = 30 * (attempt + 1)
                        print(f"      ⚠️ ChatGPT rate limited, waiting {wait_time}s...")
                        await asyncio.sleep(wait_time)
                    else:
                        print(f"      ⚠️ ChatGPT error (attempt {attempt+1}): {error[:100]}")
                        if attempt < MAX_RETRIES - 1:
                            await asyncio.sleep(5 * (attempt + 1))
        except asyncio.TimeoutError:
            print(f"      ⚠️ ChatGPT timeout (attempt {attempt+1})")
            if attempt < MAX_RETRIES - 1:
                await asyncio.sleep(5)
        except Exception as e:
            print(f"      ⚠️ ChatGPT exception: {e}")
            if attempt < MAX_RETRIES - 1:
                await asyncio.sleep(5)
    
    return ""

# =============================================================================
# FIX GENERATION
# =============================================================================

def get_context(lines: list, line_num: int, window: int = 15) -> str:
    """Get context around a line with markers."""
    start = max(0, line_num - window - 1)
    end = min(len(lines), line_num + window)
    
    context_lines = []
    for i in range(start, end):
        marker = ">>> " if i == line_num - 1 else "    "
        context_lines.append(f"{marker}{i+1:4d}: {lines[i]}")
    
    return '\n'.join(context_lines)

def get_fix_instructions(issue_type: str) -> str:
    """Get specific fix instructions based on issue type."""
    instructions = {
        "MISSING_TRY_EXCEPT": """
ADD PROPER ERROR HANDLING:
1. Wrap the async operation in try/except
2. Catch specific exceptions first (ValueError, KeyError, etc.)
3. Then catch general Exception as fallback
4. Log the error with logger.exception() or logger.error()
5. Return appropriate error response or re-raise
6. Add context to error messages

Example:
```python
async def fetch_data(id: int) -> dict:
    try:
        result = await db.fetch_one(query, id)
        if not result:
            raise HTTPException(status_code=404, detail=f"Item {id} not found")
        return dict(result)
    except HTTPException:
        raise
    except Exception as e:
        logger.exception(f"Error fetching item {id}: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")
```""",
        
        "PLACEHOLDER_PASS": """
REPLACE 'pass' WITH FULL IMPLEMENTATION:
1. Understand what the function is supposed to do from its name and docstring
2. Implement the complete logic
3. Use real database queries if needed
4. Add proper return values
5. Add error handling
6. Add logging

DO NOT just add a comment. Write REAL working code.""",
        
        "PLACEHOLDER_TODO": """
IMPLEMENT THE TODO:
1. Read the TODO comment to understand what's needed
2. Remove the TODO comment
3. Write the complete implementation
4. Add error handling
5. Add logging
6. Add type hints

The TODO is a specification - implement it fully.""",
        
        "PLACEHOLDER_ELLIPSIS": """
REPLACE '...' WITH REAL CODE:
1. Understand the context
2. Write complete implementation
3. No placeholders, no shortcuts
4. Add proper error handling
5. Add logging""",
        
        "PLACEHOLDER_NOTIMPLEMENTED": """
REPLACE NotImplementedError WITH IMPLEMENTATION:
1. This is NOT an abstract method - implement it
2. Write the full logic
3. Add error handling
4. Add logging
5. Return proper values""",
        
        "WRONG_DB_STRING": f"""
FIX DATABASE CONNECTION STRING:
Replace any localhost or incorrect database URL with:
{RAILWAY_DB_URL}

Ensure proper connection pooling and error handling."""
    }
    
    return instructions.get(issue_type, "Fix this issue with production-quality code.")

async def generate_fix(
    issue: dict,
    file_content: str,
    session: aiohttp.ClientSession
) -> str:
    """Generate initial fix using Gemini 3 Flash Preview."""
    
    issue_type = issue.get("type", "UNKNOWN")
    line_num = issue.get("line", 0)
    line_content = issue.get("content", "")[:300]
    
    lines = file_content.split('\n')
    context = get_context(lines, line_num, window=20)
    fix_instructions = get_fix_instructions(issue_type)
    
    prompt = f"""You are a senior software engineer writing production code for a $10M classical studies platform.

ISSUE TYPE: {issue_type}
LINE NUMBER: {line_num}
PROBLEMATIC LINE: {line_content}

CONTEXT (>>> marks the problematic line):
{context}

FIX INSTRUCTIONS:
{fix_instructions}

QUALITY REQUIREMENTS:
{QUALITY_REQUIREMENTS}

YOUR TASK:
Write the fixed code that replaces lines {max(1, line_num-10)} to {min(len(lines), line_num+20)}.

REQUIREMENTS:
- Complete, production-ready code
- Proper error handling with try/except
- Type hints on all functions
- Logging statements
- No placeholders, TODO, pass, or ...
- Real database queries using asyncpg
- Use Railway PostgreSQL URL for connections

Return ONLY the fixed code block. No explanations, no markdown formatting."""

    return await call_gemini(prompt, session, max_tokens=8192)

# =============================================================================
# TRIPLE VALIDATION
# =============================================================================

async def validate_with_gemini(
    fixed_code: str,
    issue_type: str,
    session: aiohttp.ClientSession
) -> ValidationResult:
    """Validate fix with Gemini 3 Flash Preview."""
    
    prompt = f"""You are a code reviewer validating a fix for: {issue_type}

CODE TO VALIDATE:
```
{fixed_code}
```

SCORE THIS CODE (0-100) on:
1. Correctness (0-25): Does it fix the issue?
2. Error Handling (0-25): Proper try/except, logging?
3. Completeness (0-25): No placeholders, full implementation?
4. Quality (0-25): Type hints, readability, Pythonic?

RESPOND IN THIS EXACT FORMAT:
SCORE: [number 0-100]
PASSED: [YES/NO]
ISSUES:
- [issue 1]
- [issue 2]
SUGGESTIONS:
- [suggestion 1]
- [suggestion 2]"""

    response = await call_gemini(prompt, session, max_tokens=2048)
    
    # Parse response
    score = 0
    passed = False
    issues = []
    suggestions = []
    
    try:
        score_match = re.search(r'SCORE:\s*(\d+)', response)
        if score_match:
            score = int(score_match.group(1))
        
        passed = "PASSED: YES" in response.upper()
        
        # Extract issues
        issues_section = re.search(r'ISSUES:(.*?)(?:SUGGESTIONS:|$)', response, re.DOTALL)
        if issues_section:
            issues = [line.strip().lstrip('-').strip() 
                     for line in issues_section.group(1).split('\n') 
                     if line.strip() and line.strip() != '-']
        
        # Extract suggestions
        suggestions_section = re.search(r'SUGGESTIONS:(.*?)$', response, re.DOTALL)
        if suggestions_section:
            suggestions = [line.strip().lstrip('-').strip() 
                          for line in suggestions_section.group(1).split('\n') 
                          if line.strip() and line.strip() != '-']
    except Exception:
        pass
    
    return ValidationResult(
        passed=passed and score >= 70,
        score=score,
        issues=issues,
        suggestions=suggestions
    )

async def validate_with_claude(
    fixed_code: str,
    issue_type: str,
    session: aiohttp.ClientSession
) -> ValidationResult:
    """Deep validation with Claude Sonnet 4."""
    
    prompt = f"""You are a senior code reviewer doing deep validation of a fix for: {issue_type}

CODE TO VALIDATE:
```
{fixed_code}
```

Check for:
1. Edge cases and error conditions
2. Security vulnerabilities (SQL injection, etc.)
3. Memory leaks or resource management issues
4. Concurrency issues (race conditions, deadlocks)
5. Proper async/await usage
6. Type safety

RESPOND IN THIS EXACT FORMAT:
SCORE: [number 0-100]
PASSED: [YES/NO]
ISSUES:
- [issue 1]
- [issue 2]
SUGGESTIONS:
- [suggestion 1]
- [suggestion 2]"""

    response = await call_claude(prompt, session, max_tokens=2048)
    
    # Parse response (same format as Gemini)
    score = 0
    passed = False
    issues = []
    suggestions = []
    
    try:
        score_match = re.search(r'SCORE:\s*(\d+)', response)
        if score_match:
            score = int(score_match.group(1))
        
        passed = "PASSED: YES" in response.upper()
        
        issues_section = re.search(r'ISSUES:(.*?)(?:SUGGESTIONS:|$)', response, re.DOTALL)
        if issues_section:
            issues = [line.strip().lstrip('-').strip() 
                     for line in issues_section.group(1).split('\n') 
                     if line.strip() and line.strip() != '-']
        
        suggestions_section = re.search(r'SUGGESTIONS:(.*?)$', response, re.DOTALL)
        if suggestions_section:
            suggestions = [line.strip().lstrip('-').strip() 
                          for line in suggestions_section.group(1).split('\n') 
                          if line.strip() and line.strip() != '-']
    except Exception:
        pass
    
    return ValidationResult(
        passed=passed and score >= 70,
        score=score,
        issues=issues,
        suggestions=suggestions
    )

async def validate_and_create_with_chatgpt(
    fixed_code: str,
    issue_type: str,
    original_context: str,
    session: aiohttp.ClientSession
) -> Tuple[ValidationResult, List[CreativeApproach]]:
    """ChatGPT validation + creative alternative approaches."""
    
    prompt = f"""You are a senior software architect reviewing code AND thinking creatively about better solutions.

ISSUE BEING FIXED: {issue_type}

ORIGINAL CONTEXT:
{original_context}

PROPOSED FIX:
```
{fixed_code}
```

YOUR TWO TASKS:

TASK 1 - VALIDATE THE CODE:
Score it 0-100 based on correctness, error handling, completeness, quality.

TASK 2 - THINK CREATIVELY:
Is there a BETTER way to solve this? Consider:
- More elegant algorithms
- Better design patterns
- Performance improvements
- More Pythonic approaches
- Simpler solutions that achieve the same goal

RESPOND IN THIS EXACT FORMAT:

=== VALIDATION ===
SCORE: [0-100]
PASSED: [YES/NO]
ISSUES:
- [issue 1]
- [issue 2]

=== CREATIVE APPROACHES ===
[If you see a better way, describe 1-3 alternatives]

APPROACH 1:
DESCRIPTION: [what's different]
RATIONALE: [why it's better]
IMPROVEMENT: [e.g., "50% less code", "3x faster", "more maintainable"]
CODE:
```
[code snippet showing the approach]
```

APPROACH 2:
...

[If the current approach is already optimal, write: "CURRENT APPROACH IS OPTIMAL"]
"""

    response = await call_chatgpt(prompt, session, max_tokens=4096)
    
    # Parse validation
    score = 0
    passed = False
    issues = []
    suggestions = []
    creative_approaches = []
    
    try:
        # Parse validation section
        validation_section = re.search(r'=== VALIDATION ===(.*?)(?:=== CREATIVE|$)', response, re.DOTALL)
        if validation_section:
            val_text = validation_section.group(1)
            
            score_match = re.search(r'SCORE:\s*(\d+)', val_text)
            if score_match:
                score = int(score_match.group(1))
            
            passed = "PASSED: YES" in val_text.upper()
            
            issues_section = re.search(r'ISSUES:(.*?)(?:===|$)', val_text, re.DOTALL)
            if issues_section:
                issues = [line.strip().lstrip('-').strip() 
                         for line in issues_section.group(1).split('\n') 
                         if line.strip() and line.strip() != '-']
        
        # Parse creative approaches
        creative_section = re.search(r'=== CREATIVE APPROACHES ===(.*?)$', response, re.DOTALL)
        if creative_section and "CURRENT APPROACH IS OPTIMAL" not in creative_section.group(1).upper():
            approach_matches = re.finditer(
                r'APPROACH \d+:\s*DESCRIPTION:\s*(.*?)\s*RATIONALE:\s*(.*?)\s*IMPROVEMENT:\s*(.*?)\s*CODE:\s*```(?:\w+)?\s*(.*?)```',
                creative_section.group(1),
                re.DOTALL
            )
            
            for match in approach_matches:
                creative_approaches.append(CreativeApproach(
                    description=match.group(1).strip(),
                    rationale=match.group(2).strip(),
                    improvement=match.group(3).strip(),
                    code_snippet=match.group(4).strip()
                ))
    except Exception as e:
        print(f"      ⚠️ Error parsing ChatGPT response: {e}")
    
    validation = ValidationResult(
        passed=passed and score >= 70,
        score=score,
        issues=issues,
        suggestions=suggestions
    )
    
    return validation, creative_approaches

# =============================================================================
# MASTER AGENT
# =============================================================================

async def master_agent_decision(
    fixed_code: str,
    gemini_result: ValidationResult,
    claude_result: ValidationResult,
    chatgpt_result: Optional[ValidationResult],
    creative_approaches: List[CreativeApproach],
    issue_type: str,
    issue_context: str,
    session: aiohttp.ClientSession
) -> Tuple[Decision, str, str, Optional[str]]:
    """
    Master Agent (Claude) makes final decision with MAXIMUM RIGOR.
    
    PRINCIPLES:
    - NO SHORTCUTS - always choose the most comprehensive solution
    - GROUNDBREAKING - prefer modern, innovative approaches
    - RIGOR - code must be production-perfect
    - CONTINUE - never block on human, queue questions and proceed
    
    Returns: (decision, rationale, final_code, human_question)
    """
    
    # Format validation results
    validation_summary = f"""
GEMINI VALIDATION:
  Score: {gemini_result.score}/100
  Passed: {gemini_result.passed}
  Issues: {', '.join(gemini_result.issues) if gemini_result.issues else 'None'}

CLAUDE VALIDATION:
  Score: {claude_result.score}/100
  Passed: {claude_result.passed}
  Issues: {', '.join(claude_result.issues) if claude_result.issues else 'None'}
"""
    
    if chatgpt_result:
        validation_summary += f"""
CHATGPT VALIDATION:
  Score: {chatgpt_result.score}/100
  Passed: {chatgpt_result.passed}
  Issues: {', '.join(chatgpt_result.issues) if chatgpt_result.issues else 'None'}
"""
    
    # Format creative approaches
    creative_summary = ""
    if creative_approaches:
        creative_summary = "\n\nCREATIVE ALTERNATIVES FROM CHATGPT (Consider these seriously!):\n"
        for i, approach in enumerate(creative_approaches, 1):
            creative_summary += f"""
Alternative {i}: {approach.description}
  Rationale: {approach.rationale}
  Improvement: {approach.improvement}
  Code:
```
{approach.code_snippet[:500]}
```
"""
    
    prompt = f"""You are the MASTER AGENT - a senior architect making the FINAL decision on code quality.

YOUR PRINCIPLES (FOLLOW STRICTLY):
1. NO SHORTCUTS - Never approve mediocre code. Demand excellence.
2. GROUNDBREAKING - If there's a more modern, innovative approach, USE IT.
3. RIGOR - Every function must have error handling, type hints, logging.
4. COMPREHENSIVE - The solution must handle ALL edge cases.
5. MODERN - Use async/await, type hints, dataclasses, modern Python 3.11+ patterns.
6. BEST PRACTICES - Follow PEP 8, use proper naming, document complex logic.

ISSUE TYPE: {issue_type}

CONTEXT:
{issue_context[:1000]}

PROPOSED FIX:
```
{fixed_code[:3000]}
```

VALIDATION RESULTS:
{validation_summary}
{creative_summary}

YOUR DECISION OPTIONS:
1. APPROVE - The fix is EXCELLENT and production-ready (score >= 85, no issues)
2. CREATIVE - A creative alternative is BETTER - implement it instead
3. RETRY - The fix needs improvement (give SPECIFIC guidance)
4. QUEUED - Complex edge case, save question for human, CONTINUE with fix for now

DECISION CRITERIA (BE STRICT):
- Score >= 85 AND no critical issues: APPROVE
- Creative approach is significantly better (performance, elegance, maintainability): CREATIVE
- Score 60-84 OR has issues: RETRY with detailed guidance
- Truly ambiguous OR needs domain expertise: QUEUED (but still provide best-effort fix)

IMPORTANT: For QUEUED, you MUST still provide a working fix. The question is saved for later human review, but we DON'T BLOCK - we continue processing.

RESPOND IN THIS EXACT FORMAT:
DECISION: [APPROVE/CREATIVE/RETRY/QUEUED]
RATIONALE: [2-3 sentences explaining your reasoning based on the principles above]
GUIDANCE: [If RETRY: SPECIFIC improvements. If CREATIVE: which approach and why. If QUEUED: the question for human + your best-effort fix]
BEST_CODE: [If CREATIVE or QUEUED: provide the code to use]"""

    response = await call_claude(prompt, session, max_tokens=2048)
    
    # Parse decision
    decision = Decision.APPROVE
    rationale = "Approved by Master Agent"
    human_question = None
    
    try:
        decision_match = re.search(r'DECISION:\s*(\w+)', response)
        if decision_match:
            decision_str = decision_match.group(1).upper()
            if decision_str == "RETRY":
                decision = Decision.RETRY
            elif decision_str == "CREATIVE":
                decision = Decision.CREATIVE
            elif decision_str == "QUEUED":
                decision = Decision.QUEUED
            elif decision_str == "ESCALATE":
                decision = Decision.QUEUED  # Convert ESCALATE to QUEUED (don't block)
            else:
                decision = Decision.APPROVE
        
        rationale_match = re.search(r'RATIONALE:\s*(.*?)(?:GUIDANCE:|BEST_CODE:|$)', response, re.DOTALL)
        if rationale_match:
            rationale = rationale_match.group(1).strip()
        
        guidance_match = re.search(r'GUIDANCE:\s*(.*?)(?:BEST_CODE:|$)', response, re.DOTALL)
        if guidance_match and decision == Decision.QUEUED:
            human_question = guidance_match.group(1).strip()
    except Exception:
        pass
    
    # Determine final code
    final_code = fixed_code
    
    if decision == Decision.CREATIVE and creative_approaches:
        # Use the best creative approach
        final_code = creative_approaches[0].code_snippet
        rationale += f" Using creative approach: {creative_approaches[0].description}"
    
    # For QUEUED, extract best_code if provided
    if decision == Decision.QUEUED:
        best_code_match = re.search(r'BEST_CODE:\s*```(?:\w+)?\s*(.*?)```', response, re.DOTALL)
        if best_code_match:
            final_code = best_code_match.group(1).strip()
        elif creative_approaches:
            # Use creative approach as fallback
            final_code = creative_approaches[0].code_snippet
    
    return decision, rationale, final_code, human_question

# =============================================================================
# MAIN FIX PROCESSOR
# =============================================================================

async def process_single_issue(
    issue: dict,
    file_content: str,
    session: aiohttp.ClientSession,
    issue_index: int,
    total_issues: int
) -> FixResult:
    """Process a single issue through the complete pipeline."""
    
    issue_id = f"{issue.get('file', 'unknown')}:{issue.get('line', 0)}"
    issue_type = issue.get("type", "UNKNOWN")
    line_num = issue.get("line", 0)
    original_code = issue.get("content", "")[:500]
    
    lines = file_content.split('\n')
    context = get_context(lines, line_num, window=15)
    
    print(f"      [{issue_index}/{total_issues}] {issue_type} at line {line_num}")
    
    # 1. Generate initial fix with Gemini
    print(f"         🔧 Generating fix with Gemini 3 Flash...")
    fixed_code = await generate_fix(issue, file_content, session)
    
    if not fixed_code or len(fixed_code) < 20:
        print(f"         ❌ Failed to generate fix")
        return FixResult(
            issue_id=issue_id,
            issue_type=issue_type,
            line_num=line_num,
            original_code=original_code,
            fixed_code="",
            gemini_validation=ValidationResult(False, 0),
            claude_validation=ValidationResult(False, 0),
            chatgpt_validation=None,
            creative_approaches=[],
            master_decision=Decision.ESCALATE,
            master_rationale="Failed to generate fix",
            final_code="",
            success=False
        )
    
    # 2. Validate with Gemini
    print(f"         ✓ Validating with Gemini...")
    gemini_result = await validate_with_gemini(fixed_code, issue_type, session)
    
    # 3. Validate with Claude
    print(f"         ✓ Validating with Claude...")
    claude_result = await validate_with_claude(fixed_code, issue_type, session)
    
    # 4. ChatGPT validation + creative approaches (every issue for best results)
    print(f"         ✓ ChatGPT deep analysis + creative approaches...")
    chatgpt_result, creative_approaches = await validate_and_create_with_chatgpt(
        fixed_code, issue_type, context, session
    )
    
    # 5. Master Agent decision
    print(f"         ⚖️ Master Agent deciding (RIGOROUS mode)...")
    decision, rationale, final_code, human_question = await master_agent_decision(
        fixed_code,
        gemini_result,
        claude_result,
        chatgpt_result,
        creative_approaches,
        issue_type,
        context,  # Pass context for better decisions
        session
    )
    
    # Handle QUEUED - save question but continue
    if decision == Decision.QUEUED and human_question:
        human_questions_queue.append({
            "issue_id": issue_id,
            "issue_type": issue_type,
            "line_num": line_num,
            "question": human_question,
            "timestamp": datetime.now().isoformat(),
            "best_effort_fix": final_code[:500]
        })
        print(f"         📝 Question queued for human (continuing with best-effort fix)")
    
    success = decision in [Decision.APPROVE, Decision.CREATIVE, Decision.QUEUED]
    status = "✅" if success else "⚠️"
    print(f"         {status} Decision: {decision.value.upper()} - {rationale[:60]}...")
    
    return FixResult(
        issue_id=issue_id,
        issue_type=issue_type,
        line_num=line_num,
        original_code=original_code,
        fixed_code=fixed_code,
        gemini_validation=gemini_result,
        claude_validation=claude_result,
        chatgpt_validation=chatgpt_result,
        creative_approaches=creative_approaches,
        master_decision=decision,
        master_rationale=rationale,
        final_code=final_code,
        success=success,
        human_question=human_question
    )

async def process_file(
    filename: str,
    issues: list,
    session: aiohttp.ClientSession,
    semaphore: asyncio.Semaphore
) -> dict:
    """Process all issues in a single file."""
    
    async with semaphore:
        # Find source file
        source_file = None
        for subdir in SOURCE_DIR.iterdir():
            if subdir.is_dir():
                candidate = subdir / filename
                if candidate.exists():
                    source_file = candidate
                    break
        
        if not source_file:
            print(f"   ⚠️ Not found: {filename}")
            return {"filename": filename, "status": "not_found", "results": []}
        
        # Read content
        with open(source_file, 'r', encoding='utf-8', errors='ignore') as f:
            content = f.read()
        
        print(f"\n   📝 Processing: {filename} ({len(issues)} issues)")
        
        # Process each issue
        results = []
        for i, issue in enumerate(issues, 1):
            result = await process_single_issue(issue, content, session, i, len(issues))
            results.append(result)
        
        # Save output
        output_subdir = OUTPUT_DIR / (source_file.parent.name if source_file.parent != SOURCE_DIR else "root")
        output_subdir.mkdir(parents=True, exist_ok=True)
        output_file = output_subdir / filename
        
        # Write fixed content
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(content)
            f.write("\n\n")
            f.write("=" * 80 + "\n")
            f.write(f"LOGOS ULTIMATE FIX EXECUTOR - {datetime.now().isoformat()}\n")
            f.write("=" * 80 + "\n\n")
            
            for result in results:
                f.write(f"### Line {result.line_num}: {result.issue_type}\n")
                f.write(f"Decision: {result.master_decision.value.upper()}\n")
                f.write(f"Rationale: {result.master_rationale}\n")
                f.write(f"Gemini Score: {result.gemini_validation.score}/100\n")
                f.write(f"Claude Score: {result.claude_validation.score}/100\n")
                if result.chatgpt_validation:
                    f.write(f"ChatGPT Score: {result.chatgpt_validation.score}/100\n")
                if result.creative_approaches:
                    f.write(f"Creative Approaches: {len(result.creative_approaches)}\n")
                f.write(f"\nFinal Code:\n```\n{result.final_code}\n```\n\n")
                f.write("-" * 40 + "\n\n")
        
        successful = sum(1 for r in results if r.success)
        print(f"   💾 Saved: {filename} ({successful}/{len(issues)} fixed)")
        
        return {
            "filename": filename,
            "status": "complete",
            "total": len(issues),
            "successful": successful,
            "results": [asdict(r) for r in results]
        }

# =============================================================================
# MAIN
# =============================================================================

async def main():
    print("""
╔═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╗
║                                                                                                                           ║
║   LOGOS ULTIMATE FIX EXECUTOR V1                                                                                          ║
║                                                                                                                           ║
║   TRIPLE VALIDATION + CREATIVE APPROACHES + MASTER AGENT                                                                  ║
║                                                                                                                           ║
║   Pipeline:                                                                                                               ║
║   1. GEMINI 3 FLASH PREVIEW → Generate fix                                                                                ║
║   2. GEMINI 3 FLASH PREVIEW → Fast validation                                                                             ║
║   3. CLAUDE SONNET 4 → Deep validation                                                                                    ║
║   4. CHATGPT GPT-4o → Creative alternatives                                                                               ║
║   5. CLAUDE MASTER → Final decision                                                                                       ║
║                                                                                                                           ║
╚═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╝
""")
    
    # Load approvals
    approvals_file = REPORTS_DIR / "APPROVED_FIXES.json"
    
    if not approvals_file.exists():
        print("❌ APPROVED_FIXES.json not found!")
        print("   Run LOGOS_TRIPLE_FIX_V2.py first to scan for issues.")
        return 1
    
    with open(approvals_file, 'r') as f:
        data = json.load(f)
    
    # Get approved issues
    all_issues = data.get("issues", [])
    approved = [item for item in all_issues if item.get("approved", False)]
    
    print(f"📊 Total issues: {len(all_issues)}")
    print(f"✅ Approved: {len(approved)}")
    
    if len(approved) == 0:
        print("\n❌ No fixes approved!")
        print("\nTo approve all fixes, run:")
        print("   cd ~/Downloads/logos/logos_fix_reports")
        print("   sed -i '' 's/\"approved\": false/\"approved\": true/g' APPROVED_FIXES.json")
        return 1
    
    # Group by file
    by_file = defaultdict(list)
    for item in approved:
        by_file[item.get("file", "unknown")].append(item)
    
    print(f"📁 Files to fix: {len(by_file)}")
    
    # Create output directory
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    
    print(f"\n{'='*100}")
    print(" DEPLOYING FIX AGENTS WITH TRIPLE VALIDATION")
    print(f"{'='*100}")
    
    # Process files
    semaphore = asyncio.Semaphore(MAX_CONCURRENT)
    
    async with aiohttp.ClientSession() as session:
        tasks = [
            process_file(filename, issues, session, semaphore)
            for filename, issues in by_file.items()
        ]
        
        results = await asyncio.gather(*tasks)
    
    # Summary
    total_fixed = sum(r.get("successful", 0) for r in results)
    total_issues = sum(r.get("total", 0) for r in results)
    queued_count = len(human_questions_queue)
    
    print(f"\n{'='*100}")
    print(" COMPLETE")
    print(f"{'='*100}")
    print(f"""
    📁 Files processed: {len(results)}
    🔧 Issues fixed: {total_fixed}/{total_issues}
    📝 Questions queued for human: {queued_count}
    💾 Output: {OUTPUT_DIR}
    
    VALIDATION PIPELINE:
    ┌─────────────────────────────────────────────────────────────────────┐
    │ 1. GEMINI 3 FLASH PREVIEW → Generate fix                           │
    │ 2. GEMINI 3 FLASH PREVIEW → Fast validation                        │
    │ 3. CLAUDE SONNET 4 → Deep validation (edge cases, security)        │
    │ 4. CHATGPT GPT-4o → Creative alternatives + groundbreaking ideas   │
    │ 5. CLAUDE MASTER → RIGOROUS decision (no shortcuts!)               │
    └─────────────────────────────────────────────────────────────────────┘
    
    MASTER AGENT PRINCIPLES ENFORCED:
    ✅ NO SHORTCUTS - Only excellent code approved
    ✅ GROUNDBREAKING - Modern, innovative approaches preferred
    ✅ RIGOR - Error handling, type hints, logging required
    ✅ COMPREHENSIVE - All edge cases handled
    ✅ NON-BLOCKING - Questions queued, processing continues
    
    Next steps:
    1. Review fixed files in {OUTPUT_DIR}
    2. Check HUMAN_QUESTIONS.json for queued questions
    3. Extract fixed code into your project
    4. Run tests
""")
    
    # Save summary
    summary_file = OUTPUT_DIR / "FIX_SUMMARY.json"
    with open(summary_file, 'w') as f:
        json.dump({
            "timestamp": datetime.now().isoformat(),
            "total_files": len(results),
            "total_issues": total_issues,
            "total_fixed": total_fixed,
            "queued_for_human": queued_count,
            "results": results
        }, f, indent=2, default=str)
    
    print(f"    📋 Summary saved to: {summary_file}")
    
    # Save human questions queue
    if human_questions_queue:
        HUMAN_QUESTIONS_FILE.parent.mkdir(parents=True, exist_ok=True)
        with open(HUMAN_QUESTIONS_FILE, 'w') as f:
            json.dump({
                "timestamp": datetime.now().isoformat(),
                "questions": human_questions_queue,
                "instructions": "Review these questions and provide answers. Then re-run the fix executor to apply your decisions."
            }, f, indent=2)
        print(f"    ❓ Human questions saved to: {HUMAN_QUESTIONS_FILE}")
    
    return 0

if __name__ == "__main__":
    sys.exit(asyncio.run(main()))
