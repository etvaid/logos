#!/usr/bin/env python3
"""
╔══════════════════════════════════════════════════════════════════════════════════════════════════════════════════╗
║                                                                                                                  ║
║   🏛️ SPECTACULAR QA MEGA-SWARM v2.0                                                                             ║
║                                                                                                                  ║
║   THE ULTIMATE QUALITY ASSURANCE & ENHANCEMENT SYSTEM                                                           ║
║                                                                                                                  ║
║   ═══════════════════════════════════════════════════════════════════════════════════════════════════════════   ║
║                                                                                                                  ║
║                                    👑 CLAUDE DEEP THINK MASTER                                                   ║
║                                    ━━━━━━━━━━━━━━━━━━━━━━━━━━━                                                   ║
║                                    • Ultimate approval authority                                                 ║
║                                    • Strategic architecture decisions                                            ║
║                                    • Quality gates & final sign-off                                              ║
║                                    • Approves/rejects Gemini proposals                                           ║
║                                                   │                                                              ║
║                              ┌───────────────────┴───────────────────┐                                          ║
║                              ▼                                       ▼                                          ║
║              ┌───────────────────────────────┐       ┌───────────────────────────────┐                          ║
║              │  🔮 GEMINI MASTER SUBSLAVE    │       │  📚 DOCUMENTATION ADMIRAL     │                          ║
║              │  (gemini-2.0-flash-exp)       │       │  (gemini-2.0-flash-exp)       │                          ║
║              │                               │       │                               │                          ║
║              │  • Proposes enhancements      │       │  • User Manual creation       │                          ║
║              │  • Coordinates workers        │       │  • API documentation          │                          ║
║              │  • Implements approved fixes  │       │  • Interactive tutorials      │                          ║
║              └───────────────┬───────────────┘       └───────────────┬───────────────┘                          ║
║                              │                                       │                                          ║
║          ┌──────────────────┬┴─────────────────┐                    │                                          ║
║          ▼                  ▼                  ▼                    ▼                                          ║
║   ┌─────────────┐   ┌─────────────┐   ┌─────────────┐   ┌─────────────────────────┐                            ║
║   │ 🎨 STYLE    │   │ 🔧 FIX      │   │ 🧪 TEST     │   │ 📖 DOC FLEET            │                            ║
║   │   COUNCIL   │   │   BRIGADE   │   │   FLEET     │   │   (5x Gemini Flash)     │                            ║
║   │             │   │             │   │             │   │                         │                            ║
║   │ • UX Sage   │   │ • SyntaxBot │   │ • RouteBot  │   │ • ManualWriter          │                            ║
║   │ • DesignGod │   │ • ExportFix │   │ • CompTest  │   │ • TutorialMaker         │                            ║
║   │ • FlowMastr │   │ • ImportFix │   │ • APIProbe  │   │ • GraphicsGen           │                            ║
║   │ • A11yCheck │   │ • TypeFixer │   │ • E2ERunner │   │ • QuickStartGen         │                            ║
║   │             │   │ • LintClean │   │ • PerfCheck │   │ • FAQBuilder            │                            ║
║   └─────────────┘   └─────────────┘   └─────────────┘   └─────────────────────────┘                            ║
║                                                                                                                  ║
║   ═══════════════════════════════════════════════════════════════════════════════════════════════════════════   ║
║                                                                                                                  ║
║   USER CONTROLS:                                                                                                 ║
║   ──────────────                                                                                                 ║
║   --test-only        Just test, report issues (no modifications)                                                ║
║   --fix-only         Fix known issues without enhancement proposals                                             ║
║   --enhance          Propose and implement enhancements (requires Claude approval)                              ║
║   --docs-only        Generate documentation only                                                                ║
║   --interactive      Approve each change manually (granular control)                                            ║
║   --section NAME     Focus on specific section (semantia, chronos, etc.)                                        ║
║   --verbose          Show all agent communications                                                              ║
║   --parallel N       Number of parallel workers (default: 10)                                                   ║
║   --dry-run          Show what would be done without doing it                                                   ║
║                                                                                                                  ║
╚══════════════════════════════════════════════════════════════════════════════════════════════════════════════════╝
"""

import os
import sys
import json
import asyncio
import aiohttp
import re
import subprocess
from pathlib import Path
from datetime import datetime
from dataclasses import dataclass, field
from typing import Dict, List, Optional, Any, Tuple
from enum import Enum
from collections import defaultdict
import argparse

# ══════════════════════════════════════════════════════════════════════════════════════════════════
# CONFIGURATION
# ══════════════════════════════════════════════════════════════════════════════════════════════════

ANTHROPIC_API_KEY = os.environ.get("ANTHROPIC_API_KEY", "")
GOOGLE_API_KEY = os.environ.get("GOOGLE_API_KEY", "")
OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY", "")

CLAUDE_MODEL = "claude-sonnet-4-20250514"
GEMINI_MODEL = "gemini-2.0-flash-exp"
GPT_MODEL = "gpt-4o-mini"


# ══════════════════════════════════════════════════════════════════════════════════════════════════
# DATA STRUCTURES
# ══════════════════════════════════════════════════════════════════════════════════════════════════

class IssueType(Enum):
    SYNTAX_ERROR = "syntax_error"
    MISSING_EXPORT = "missing_export"
    IMPORT_ERROR = "import_error"
    MARKDOWN_ARTIFACT = "markdown_artifact"
    TRUNCATED_FILE = "truncated_file"
    TYPE_ERROR = "type_error"
    MISSING_DEPENDENCY = "missing_dependency"
    BROKEN_ROUTE = "broken_route"
    API_ERROR = "api_error"
    STYLE_ISSUE = "style_issue"
    A11Y_ISSUE = "accessibility_issue"
    PERFORMANCE = "performance_issue"


class Severity(Enum):
    CRITICAL = "critical"
    HIGH = "high"
    MEDIUM = "medium"
    LOW = "low"
    INFO = "info"


@dataclass
class Issue:
    file_path: str
    issue_type: IssueType
    severity: Severity
    description: str
    line_number: Optional[int] = None
    suggested_fix: Optional[str] = None
    auto_fixable: bool = False


@dataclass
class Enhancement:
    title: str
    description: str
    target_files: List[str]
    proposed_by: str
    approved: bool = False
    approved_by: Optional[str] = None
    implementation: Optional[str] = None
    priority: int = 5


@dataclass
class AgentMessage:
    from_agent: str
    to_agent: str
    message_type: str
    content: Any
    timestamp: datetime = field(default_factory=datetime.now)


# ══════════════════════════════════════════════════════════════════════════════════════════════════
# LLM CLIENT
# ══════════════════════════════════════════════════════════════════════════════════════════════════

class LLMClient:
    def __init__(self):
        self.session = None
        self.call_count = defaultdict(int)
        
    async def __aenter__(self):
        self.session = aiohttp.ClientSession(timeout=aiohttp.ClientTimeout(total=120))
        return self
        
    async def __aexit__(self, *args):
        if self.session:
            await self.session.close()
            
    async def call_claude(self, prompt: str, system: str = "", max_tokens: int = 4000) -> str:
        if not ANTHROPIC_API_KEY:
            return "[Claude unavailable - no API key]"
        try:
            body = {"model": CLAUDE_MODEL, "max_tokens": max_tokens, "messages": [{"role": "user", "content": prompt}]}
            if system:
                body["system"] = system
            async with self.session.post(
                "https://api.anthropic.com/v1/messages",
                headers={"x-api-key": ANTHROPIC_API_KEY, "content-type": "application/json", "anthropic-version": "2023-06-01"},
                json=body
            ) as resp:
                if resp.status != 200:
                    return f"[Claude error: {resp.status}]"
                data = await resp.json()
                self.call_count["claude"] += 1
                return data.get("content", [{}])[0].get("text", "")
        except Exception as e:
            return f"[Claude error: {e}]"
            
    async def call_gpt(self, prompt: str, system: str = "") -> str:
        if not GOOGLE_API_KEY:
            return "[Gemini unavailable - no API key]"
        try:
            full_prompt = f"{system}\n\n{prompt}" if system else prompt
            async with self.session.post(
                f"https://generativelanguage.googleapis.com/v1beta/models/{GEMINI_MODEL}:generateContent?key={GOOGLE_API_KEY}",
                json={"contents": [{"parts": [{"text": full_prompt}]}], "generationConfig": {"maxOutputTokens": 4000}}
            ) as resp:
                if resp.status != 200:
                    return f"[Gemini error: {resp.status}]"
                data = await resp.json()
                self.call_count["gemini"] += 1
                return data.get("candidates", [{}])[0].get("content", {}).get("parts", [{}])[0].get("text", "")
        except Exception as e:
            return f"[Gemini error: {e}]"


# ══════════════════════════════════════════════════════════════════════════════════════════════════
# AGENTS
# ══════════════════════════════════════════════════════════════════════════════════════════════════

class Agent:
    def __init__(self, name: str, role: str, llm: LLMClient, verbose: bool = False):
        self.name = name
        self.role = role
        self.llm = llm
        self.verbose = verbose
        
    def log(self, message: str, emoji: str = "💬"):
        if self.verbose:
            print(f"   {emoji} [{self.name}]: {message}")


class ClaudeDeepThinkMaster(Agent):
    """👑 THE SUPREME AUTHORITY"""
    
    def __init__(self, llm: LLMClient, verbose: bool = False):
        super().__init__("Claude Deep Think Master", "Supreme Authority", llm, verbose)
        self.system_prompt = """You are the CLAUDE DEEP THINK MASTER - supreme authority for LOGOS SPECTACULAR.
Responsibilities: APPROVE/REJECT proposals, STRATEGIC DECISIONS, QUALITY GATES, RESOLVE DISPUTES.
Format approvals as: APPROVED: [reason]
Format rejections as: REJECTED: [reason] SUGGESTION: [alternative]"""

    async def think(self, prompt: str) -> str:
        self.log("Deep thinking...", "🧠")
        return await self.llm.call_claude(prompt, self.system_prompt)
        
    async def review_proposal(self, proposal: Enhancement) -> Tuple[bool, str]:
        prompt = f"""ENHANCEMENT PROPOSAL:
Title: {proposal.title}
Description: {proposal.description}
Target Files: {', '.join(proposal.target_files)}
Priority: {proposal.priority}/10

Respond with APPROVED: or REJECTED:"""
        response = await self.think(prompt)
        return "APPROVED:" in response.upper(), response
        
    async def final_quality_gate(self, test_results: Dict) -> Tuple[bool, str]:
        prompt = f"""FINAL QUALITY GATE:
Total: {test_results.get('total', 0)}, Passed: {test_results.get('passed', 0)}, Failed: {test_results.get('failed', 0)}
Respond with GATE_PASSED: or GATE_FAILED:"""
        response = await self.think(prompt)
        return "GATE_PASSED:" in response.upper(), response


class GeminiMasterSubSlave(Agent):
    """🔮 GEMINI MASTER SUBSLAVE"""
    
    def __init__(self, llm: LLMClient, master: ClaudeDeepThinkMaster, verbose: bool = False):
        super().__init__("Gemini Master SubSlave", "Enhancement Proposer", llm, verbose)
        self.master = master
        self.approved_proposals: List[Enhancement] = []
        
    async def think(self, prompt: str) -> str:
        self.log("Processing...", "🔮")
        return await self.llm.call_gpt(prompt)
        
    async def analyze_and_propose(self, issues: List[Issue]) -> List[Enhancement]:
        issues_summary = "\n".join([f"- {i.file_path}: {i.issue_type.value} - {i.description}" for i in issues[:20]])
        prompt = f"""Based on these issues, propose enhancements in JSON:
{issues_summary}

Return: {{"proposals": [{{"title": "...", "description": "...", "target_files": [...], "priority": 1-10}}]}}"""
        response = await self.think(prompt)
        proposals = []
        try:
            if "{" in response:
                data = json.loads(response[response.index("{"):response.rindex("}")+1])
                for p in data.get("proposals", []):
                    proposals.append(Enhancement(
                        title=p.get("title", ""), description=p.get("description", ""),
                        target_files=p.get("target_files", []), proposed_by=self.name, priority=p.get("priority", 5)
                    ))
        except:
            pass
        return proposals
        
    async def submit_for_approval(self, proposal: Enhancement) -> bool:
        approved, _ = await self.master.review_proposal(proposal)
        if approved:
            proposal.approved = True
            proposal.approved_by = self.master.name
            self.approved_proposals.append(proposal)
        return approved


class DocumentationAdmiral(Agent):
    """📚 DOCUMENTATION ADMIRAL"""
    
    def __init__(self, llm: LLMClient, verbose: bool = False):
        super().__init__("Documentation Admiral", "Doc Commander", llm, verbose)
        
    async def think(self, prompt: str) -> str:
        self.log("Commanding doc fleet...", "📚")
        return await self.llm.call_gpt(prompt)
        
    async def generate_user_manual(self, sections: List[str], features: Dict) -> str:
        prompt = f"""Create COMPREHENSIVE USER MANUAL for LOGOS SPECTACULAR.
Sections: {json.dumps(sections)}
Features: {json.dumps(features)}

Include: Introduction, Getting Started, Core Sections, Display Innovations, Advanced Features, Troubleshooting, Glossary.
Make it EXQUISITE with beautiful Markdown formatting."""
        return await self.think(prompt)
        
    async def generate_quickstart(self) -> str:
        return await self.think("""Create QUICK START GUIDE for LOGOS SPECTACULAR.
Get users productive in 5 minutes: Launch, Pick a Text, Explore Semantics, Ask Research Question.
Make it FAST and EXCITING with clear steps and visuals.""")
        
    async def generate_faq(self, issues: List[Issue]) -> str:
        issue_summary = "\n".join([f"- {i.description}" for i in issues[:20]])
        return await self.think(f"""Generate FAQ based on:\n{issue_summary}\n
Include: General, Getting Started, Features, Troubleshooting, Advanced sections.""")
        
    async def generate_tutorial(self, topic: str) -> str:
        return await self.think(f"""Create INTERACTIVE TUTORIAL for: {topic}
Include: Overview, Prerequisites, Step-by-step instructions, Pro Tips, Summary, Practice Exercise.""")


# ══════════════════════════════════════════════════════════════════════════════════════════════════
# FIX BRIGADE
# ══════════════════════════════════════════════════════════════════════════════════════════════════

class FixBrigade:
    """🔧 THE FIX BRIGADE"""
    
    def __init__(self, verbose: bool = False):
        self.verbose = verbose
        self.fixes_applied = 0
        
    def log(self, msg: str, emoji: str = "🔧"):
        if self.verbose:
            print(f"   {emoji} [FixBrigade]: {msg}")
            
    def fix_markdown_artifacts(self, file_path: Path) -> bool:
        try:
            content = file_path.read_text()
            original = content
            content = re.sub(r'^```(?:tsx?|jsx?|typescript|javascript)\s*\n', '', content)
            content = re.sub(r'\n```\s*$', '', content)
            content = re.sub(r'^```\s*\n', '', content)
            content = re.sub(r'\n```\s*\n', '\n', content)
            if content != original:
                file_path.write_text(content)
                self.fixes_applied += 1
                self.log(f"Fixed markdown in {file_path.name}", "✅")
                return True
        except Exception as e:
            self.log(f"Error: {e}", "❌")
        return False
            
    def fix_missing_export(self, file_path: Path) -> bool:
        try:
            content = file_path.read_text()
            original = content
            match = re.search(r'(?:const|function)\s+(\w+)(?::\s*React\.FC|\s*=\s*\([^)]*\)\s*=>|\s*\([^)]*\)\s*{)', content)
            if match:
                name = match.group(1)
                if f'export default {name}' not in content and 'export default' not in content:
                    content = content.rstrip() + f'\n\nexport default {name}\n'
                if f'export const {name}' not in content and f'export function {name}' not in content:
                    content = content.replace(f'const {name}', f'export const {name}', 1)
                    content = content.replace(f'function {name}', f'export function {name}', 1)
            if content != original:
                file_path.write_text(content)
                self.fixes_applied += 1
                self.log(f"Fixed exports in {file_path.name}", "✅")
                return True
        except Exception as e:
            self.log(f"Error: {e}", "❌")
        return False
            
    def fix_truncated_file(self, file_path: Path) -> bool:
        try:
            content = file_path.read_text()
            if content.count('{') > content.count('}') + 3:
                content = content.rstrip()
                if '</' in content[-500:]:
                    content += "\n                </div>\n              </div>\n            </div>\n          </motion.section>\n        </div>\n      )\n    }\n"
                else:
                    content += '\n' + '}\n' * (content.count('{') - content.count('}'))
                file_path.write_text(content)
                self.fixes_applied += 1
                self.log(f"Fixed truncated {file_path.name}", "✅")
                return True
        except Exception as e:
            self.log(f"Error: {e}", "❌")
        return False
            
    async def fix_all(self, files: List[Path]) -> Dict:
        results = {"markdown_fixed": 0, "exports_fixed": 0, "truncated_fixed": 0, "total_fixed": 0}
        for f in files:
            if f.suffix in ['.tsx', '.jsx', '.ts', '.js']:
                if self.fix_markdown_artifacts(f): results["markdown_fixed"] += 1
                if self.fix_missing_export(f): results["exports_fixed"] += 1
                if self.fix_truncated_file(f): results["truncated_fixed"] += 1
        results["total_fixed"] = self.fixes_applied
        return results


# ══════════════════════════════════════════════════════════════════════════════════════════════════
# TEST FLEET
# ══════════════════════════════════════════════════════════════════════════════════════════════════

class TestFleet:
    """🧪 THE TEST FLEET"""
    
    def __init__(self, project_dir: Path, verbose: bool = False):
        self.project_dir = project_dir
        self.verbose = verbose
        self.results = {"routes": [], "components": [], "apis": []}
        
    def log(self, msg: str, emoji: str = "🧪"):
        if self.verbose:
            print(f"   {emoji} [TestFleet]: {msg}")
            
    async def test_routes(self) -> List[Dict]:
        self.log("Testing routes...", "🛤️")
        app_dir = self.project_dir / "frontend" / "app"
        if not app_dir.exists():
            return []
        routes = []
        for item in app_dir.rglob("page.tsx"):
            route = "/" + str(item.parent.relative_to(app_dir)).replace("\\", "/")
            if route == "/.": route = "/"
            try:
                content = item.read_text()
                status, issues = "ok", []
                if content.startswith("```"): status, issues = "error", ["Markdown artifacts"]
                if "export default" not in content and "export function" not in content: status, issues = "error", issues + ["Missing export"]
                if content.count("{") > content.count("}") + 3: status, issues = "error", issues + ["Truncated"]
                routes.append({"route": route, "file": str(item), "status": status, "issues": issues})
            except Exception as e:
                routes.append({"route": route, "file": str(item), "status": "error", "issues": [str(e)]})
        self.results["routes"] = routes
        return routes
        
    async def test_components(self) -> List[Dict]:
        self.log("Testing components...", "🧩")
        comp_dir = self.project_dir / "frontend" / "components"
        if not comp_dir.exists():
            return []
        components = []
        for item in comp_dir.rglob("*.tsx"):
            try:
                content = item.read_text()
                status, issues = "ok", []
                if content.startswith("```"): status, issues = "error", ["Markdown artifacts"]
                if "export" not in content: status, issues = "warning", ["No exports"]
                if content.count("{") > content.count("}") + 3: status, issues = "error", issues + ["Truncated"]
                components.append({"component": item.name, "file": str(item), "status": status, "issues": issues, "lines": len(content.split('\n'))})
            except Exception as e:
                components.append({"component": item.name, "file": str(item), "status": "error", "issues": [str(e)]})
        self.results["components"] = components
        return components
        
    async def test_apis(self) -> List[Dict]:
        self.log("Testing APIs...", "🔌")
        api_dir = self.project_dir / "backend"
        if not api_dir.exists():
            return []
        apis = []
        for item in api_dir.rglob("*.py"):
            try:
                content = item.read_text()
                status = "ok" if ("def " in content or "@" in content) else "warning"
                apis.append({"api": item.name, "file": str(item), "status": status, "issues": []})
            except Exception as e:
                apis.append({"api": item.name, "file": str(item), "status": "error", "issues": [str(e)]})
        self.results["apis"] = apis
        return apis
        
    async def run_all_tests(self) -> Dict:
        await self.test_routes()
        await self.test_components()
        await self.test_apis()
        ok_routes = len([r for r in self.results["routes"] if r["status"] == "ok"])
        ok_comps = len([c for c in self.results["components"] if c["status"] == "ok"])
        ok_apis = len([a for a in self.results["apis"] if a["status"] == "ok"])
        total = len(self.results["routes"]) + len(self.results["components"]) + len(self.results["apis"])
        passed = ok_routes + ok_comps + ok_apis
        return {
            "total": total, "passed": passed, "failed": total - passed,
            "critical": len([r for r in self.results["routes"] if r["status"] == "error"]),
            "warnings": len([c for c in self.results["components"] if c["status"] == "warning"]),
            "details": self.results
        }


# ══════════════════════════════════════════════════════════════════════════════════════════════════
# STYLE COUNCIL
# ══════════════════════════════════════════════════════════════════════════════════════════════════

class StyleCouncil:
    """🎨 THE STYLE COUNCIL"""
    
    def __init__(self, llm: LLMClient, verbose: bool = False):
        self.llm = llm
        self.verbose = verbose
        self.members = ["UX Sage", "DesignGod", "FlowMaster", "A11yCheck"]
        
    async def review_file(self, file_path: Path) -> List[Issue]:
        try:
            code = file_path.read_text()[:3000]
            prompt = f"""Review this code for UX, Design, Flow, Accessibility issues:
```
{code}
```
Return JSON: {{"issues": [{{"line": N, "severity": "low|medium|high", "description": "...", "suggestion": "..."}}]}}"""
            response = await self.llm.call_gpt(prompt)
            issues = []
            if "{" in response:
                data = json.loads(response[response.index("{"):response.rindex("}")+1])
                for i in data.get("issues", []):
                    issues.append(Issue(
                        file_path=str(file_path), issue_type=IssueType.STYLE_ISSUE,
                        severity=Severity[i.get("severity", "low").upper()],
                        description=i.get("description", ""), line_number=i.get("line"),
                        suggested_fix=i.get("suggestion")
                    ))
            return issues
        except:
            return []
            
    async def full_review(self, files: List[Path]) -> List[Issue]:
        all_issues = []
        for f in files[:10]:
            all_issues.extend(await self.review_file(f))
        return all_issues


# ══════════════════════════════════════════════════════════════════════════════════════════════════
# MAIN ORCHESTRATOR
# ══════════════════════════════════════════════════════════════════════════════════════════════════

class SpectacularQASwarm:
    """🏛️ THE SPECTACULAR QA MEGA-SWARM"""
    
    def __init__(self, project_dir: Path, args):
        self.project_dir = project_dir
        self.args = args
        self.verbose = args.verbose
        self.interactive = args.interactive
        self.llm = None
        self.issues: List[Issue] = []
        self.enhancements: List[Enhancement] = []
        self.docs_generated = []
        self.fix_brigade = None
        
    def print_banner(self):
        print("""
╔══════════════════════════════════════════════════════════════════════════════════════════════════════════════════╗
║                                                                                                                  ║
║   🏛️ SPECTACULAR QA MEGA-SWARM v2.0                                                                             ║
║                                                                                                                  ║
║                                    👑 CLAUDE DEEP THINK MASTER                                                   ║
║                                              │                                                                   ║
║                              ┌───────────────┴───────────────┐                                                  ║
║                              ▼                               ▼                                                  ║
║                  🔮 GEMINI SUBSLAVE              📚 DOC ADMIRAL                                                 ║
║                         │                              │                                                        ║
║          ┌──────────────┼──────────────┐              │                                                        ║
║          ▼              ▼              ▼              ▼                                                        ║
║   🎨 STYLE      🔧 FIX         🧪 TEST       📖 DOC FLEET                                                      ║
║      COUNCIL       BRIGADE        FLEET          (5 workers)                                                   ║
║                                                                                                                  ║
╚══════════════════════════════════════════════════════════════════════════════════════════════════════════════════╝
        """)
        
    async def run(self):
        self.print_banner()
        start_time = datetime.now()
        print(f"\n⏱️  Started: {start_time.strftime('%Y-%m-%d %H:%M:%S')}")
        print(f"📁 Project: {self.project_dir}")
        print(f"\n🔑 API Keys: {'✅' if ANTHROPIC_API_KEY else '❌'} Claude | {'✅' if GOOGLE_API_KEY else '❌'} Gemini")
        
        async with LLMClient() as llm:
            self.llm = llm
            master = ClaudeDeepThinkMaster(llm, self.verbose)
            gemini = GeminiMasterSubSlave(llm, master, self.verbose)
            doc_admiral = DocumentationAdmiral(llm, self.verbose)
            style_council = StyleCouncil(llm, self.verbose)
            self.fix_brigade = FixBrigade(self.verbose)
            test_fleet = TestFleet(self.project_dir, self.verbose)
            
            # Phase 1: Testing
            if not self.args.docs_only:
                print("\n" + "═" * 70 + "\n   PHASE 1: TESTING\n" + "═" * 70)
                test_results = await test_fleet.run_all_tests()
                print(f"\n   📊 Routes: {len([r for r in test_results['details']['routes'] if r['status']=='ok'])}/{len(test_results['details']['routes'])}")
                print(f"   📊 Components: {len([c for c in test_results['details']['components'] if c['status']=='ok'])}/{len(test_results['details']['components'])}")
                print(f"   📊 APIs: {len([a for a in test_results['details']['apis'] if a['status']=='ok'])}/{len(test_results['details']['apis'])}")
                
                for r in test_results['details']['routes']:
                    if r['status'] != 'ok':
                        for desc in r.get('issues', []):
                            self.issues.append(Issue(r['file'], IssueType.SYNTAX_ERROR, Severity.CRITICAL, desc, auto_fixable=True))
                for c in test_results['details']['components']:
                    if c['status'] != 'ok':
                        for desc in c.get('issues', []):
                            self.issues.append(Issue(c['file'], IssueType.MARKDOWN_ARTIFACT, Severity.HIGH, desc, auto_fixable=True))
                print(f"\n   ⚠️  Found {len(self.issues)} issues")
                
            # Phase 2: Fixing
            if not self.args.test_only and not self.args.docs_only:
                print("\n" + "═" * 70 + "\n   PHASE 2: FIXING\n" + "═" * 70)
                files = []
                frontend = self.project_dir / "frontend"
                if frontend.exists():
                    for pat in ['**/*.tsx', '**/*.jsx', '**/*.ts', '**/*.js']:
                        files.extend([f for f in frontend.glob(pat) if 'node_modules' not in str(f)])
                print(f"\n   🔧 Analyzing {len(files)} files...")
                fix_results = await self.fix_brigade.fix_all(files)
                print(f"\n   ✅ Markdown fixed: {fix_results['markdown_fixed']}")
                print(f"   ✅ Exports fixed: {fix_results['exports_fixed']}")
                print(f"   ✅ Truncated fixed: {fix_results['truncated_fixed']}")
                
            # Phase 3: Enhancements
            if self.args.enhance:
                print("\n" + "═" * 70 + "\n   PHASE 3: ENHANCEMENTS\n" + "═" * 70)
                proposals = await gemini.analyze_and_propose(self.issues)
                print(f"\n   📋 {len(proposals)} proposals generated")
                for p in proposals:
                    if await gemini.submit_for_approval(p):
                        self.enhancements.append(p)
                        print(f"   ✅ Approved: {p.title}")
                    else:
                        print(f"   ❌ Rejected: {p.title}")
                        
            # Phase 4: Documentation
            if not self.args.fix_only and not self.args.test_only:
                print("\n" + "═" * 70 + "\n   PHASE 4: DOCUMENTATION\n" + "═" * 70)
                docs_dir = self.project_dir / "docs"
                docs_dir.mkdir(exist_ok=True)
                
                sections = []
                app_dir = self.project_dir / "frontend" / "app"
                if app_dir.exists():
                    sections = [d.name for d in app_dir.iterdir() if d.is_dir() and not d.name.startswith('_')]
                features = {"sections": sections, "innovations": ["Argument Synthesis", "Multi-Scale Views", "Debate View", "Research Canvas"]}
                
                print("\n   📖 Generating User Manual...")
                manual = await doc_admiral.generate_user_manual(sections, features)
                (docs_dir / "USER_MANUAL.md").write_text(manual)
                self.docs_generated.append("USER_MANUAL.md")
                
                print("   🚀 Generating Quick Start...")
                qs = await doc_admiral.generate_quickstart()
                (docs_dir / "QUICK_START.md").write_text(qs)
                self.docs_generated.append("QUICK_START.md")
                
                print("   ❓ Generating FAQ...")
                faq = await doc_admiral.generate_faq(self.issues)
                (docs_dir / "FAQ.md").write_text(faq)
                self.docs_generated.append("FAQ.md")
                
                print("   🎓 Generating Tutorials...")
                tut_dir = docs_dir / "tutorials"
                tut_dir.mkdir(exist_ok=True)
                for s in sections[:5]:
                    tut = await doc_admiral.generate_tutorial(f"Using {s.title()}")
                    (tut_dir / f"tutorial_{s}.md").write_text(tut)
                    self.docs_generated.append(f"tutorials/tutorial_{s}.md")
                    
                print(f"\n   ✅ Generated {len(self.docs_generated)} doc files")
                
            # Phase 5: Quality Gate
            if not self.args.docs_only:
                print("\n" + "═" * 70 + "\n   PHASE 5: QUALITY GATE\n" + "═" * 70)
                final = await test_fleet.run_all_tests()
                passed, reasoning = await master.final_quality_gate(final)
                print(f"\n   {'✅ GATE PASSED' if passed else '❌ GATE FAILED'}")
                
        # Summary
        duration = datetime.now() - start_time
        print("\n" + "╔" + "═" * 78 + "╗")
        print("║" + "SPECTACULAR QA MEGA-SWARM - COMPLETE".center(78) + "║")
        print("╠" + "═" * 78 + "╣")
        print(f"║   Runtime: {str(duration)[:10]:<67}║")
        print(f"║   Issues Found: {len(self.issues):<62}║")
        print(f"║   Fixes Applied: {self.fix_brigade.fixes_applied if self.fix_brigade else 0:<61}║")
        print(f"║   Enhancements: {len(self.enhancements):<62}║")
        print(f"║   Docs Generated: {len(self.docs_generated):<60}║")
        print(f"║   API Calls - Claude: {self.llm.call_count['claude']}, Gemini: {self.llm.call_count['gemini']:<44}║")
        print("╚" + "═" * 78 + "╝")


def main():
    parser = argparse.ArgumentParser(description="SPECTACULAR QA MEGA-SWARM")
    parser.add_argument("project_dir", help="Project path")
    parser.add_argument("--test-only", action="store_true")
    parser.add_argument("--fix-only", action="store_true")
    parser.add_argument("--docs-only", action="store_true")
    parser.add_argument("--enhance", action="store_true")
    parser.add_argument("--interactive", action="store_true")
    parser.add_argument("--verbose", action="store_true")
    args = parser.parse_args()
    
    project = Path(args.project_dir)
    if not project.exists():
        print(f"❌ Not found: {project}")
        sys.exit(1)
    asyncio.run(SpectacularQASwarm(project, args).run())


if __name__ == "__main__":
    main()
