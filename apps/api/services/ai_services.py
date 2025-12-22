"""
LOGOS AI Services
Multi-provider AI integration: Claude, OpenAI, Gemini, Grok
"""

import os
import json
from typing import Optional, List, Literal
import httpx
from anthropic import Anthropic
from openai import OpenAI

# Initialize clients
anthropic_client = Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY")) if os.getenv("ANTHROPIC_API_KEY") else None
openai_client = OpenAI(api_key=os.getenv("OPENAI_API_KEY")) if os.getenv("OPENAI_API_KEY") else None

GROK_API_KEY = os.getenv("GROK_API_KEY")
GOOGLE_API_KEY = os.getenv("GOOGLE_AI_API_KEY")


class ClaudeService:
    """Claude for translation, research, and discovery."""
    
    @staticmethod
    async def translate(text: str, language: str, style: str) -> dict:
        """Translate Greek/Latin text using Claude."""
        if not anthropic_client:
            return {"translation": f"[Demo translation of {language} text]", "notes": {}}
        
        lang_name = "Ancient Greek" if language == "grc" else "Latin"
        
        prompts = {
            "literal": f"""Translate this {lang_name} text word-for-word:
{text}

Respond in JSON: {{"translation": "...", "notes": {{"grammar": [...], "vocabulary": [...]}}}}""",
            
            "literary": f"""Provide an elegant literary translation of this {lang_name} text:
{text}

Capture the style and beauty. Respond in JSON: {{"translation": "...", "notes": {{"style": [...], "rhetoric": [...]}}}}""",
            
            "student": f"""Translate this {lang_name} text for a student learning the language:
{text}

Include helpful explanations. Respond in JSON: {{"translation": "...", "notes": {{"vocabulary": {{}}, "grammar": [...], "tips": [...]}}}}"""
        }
        
        try:
            message = anthropic_client.messages.create(
                model="claude-sonnet-4-20250514",
                max_tokens=2000,
                messages=[{"role": "user", "content": prompts.get(style, prompts["literary"])}]
            )
            response_text = message.content[0].text
            try:
                return json.loads(response_text)
            except:
                return {"translation": response_text, "notes": {}}
        except Exception as e:
            return {"translation": f"Translation error: {str(e)}", "notes": {}}
    
    @staticmethod
    async def research(question: str, context: Optional[str] = None) -> dict:
        """Answer research questions with citations."""
        if not anthropic_client:
            return {
                "answer": f"Demo answer to: {question}",
                "citations": [],
                "confidence": 0.5
            }
        
        prompt = f"""You are a classical scholar. Answer this research question with citations to primary sources.

Question: {question}
{f"Context: {context}" if context else ""}

Respond in JSON:
{{
    "answer": "Your scholarly answer...",
    "citations": [
        {{"urn": "urn:cts:...", "text": "Greek/Latin quote", "relevance": 0.9, "author": "...", "work": "..."}}
    ],
    "confidence": 0.85,
    "further_reading": ["topic1", "topic2"]
}}"""
        
        try:
            message = anthropic_client.messages.create(
                model="claude-sonnet-4-20250514",
                max_tokens=3000,
                messages=[{"role": "user", "content": prompt}]
            )
            return json.loads(message.content[0].text)
        except Exception as e:
            return {"answer": str(e), "citations": [], "confidence": 0}
    
    @staticmethod
    async def discover_patterns(texts: List[str], order: int = 2) -> dict:
        """Discover higher-order patterns in texts."""
        if not anthropic_client:
            return {"discoveries": [], "order": order}
        
        prompt = f"""Analyze these classical texts for {order}-order patterns:

Texts:
{chr(10).join(texts[:5])}

Order levels:
1 = Direct allusions (A→B)
2 = Pattern comparisons (A→B vs C→D)
3 = Correlations across patterns
4 = Meta-patterns with predictive power

Find {order}-order patterns. Respond in JSON:
{{
    "discoveries": [
        {{
            "pattern_type": "...",
            "hypothesis": "...",
            "confidence": 0.8,
            "novelty_score": 0.7,
            "evidence": ["..."],
            "statistical_significance": "p < 0.05"
        }}
    ]
}}"""
        
        try:
            message = anthropic_client.messages.create(
                model="claude-sonnet-4-20250514",
                max_tokens=3000,
                messages=[{"role": "user", "content": prompt}]
            )
            return json.loads(message.content[0].text)
        except:
            return {"discoveries": []}


class OpenAIService:
    """OpenAI for embeddings and semantic search."""
    
    @staticmethod
    async def get_embedding(text: str) -> List[float]:
        """Get embedding vector for semantic search."""
        if not openai_client:
            return [0.0] * 1536  # Return zero vector as fallback
        
        try:
            response = openai_client.embeddings.create(
                model="text-embedding-3-small",
                input=text
            )
            return response.data[0].embedding
        except:
            return [0.0] * 1536
    
    @staticmethod
    async def batch_embeddings(texts: List[str]) -> List[List[float]]:
        """Get embeddings for multiple texts."""
        if not openai_client:
            return [[0.0] * 1536 for _ in texts]
        
        try:
            response = openai_client.embeddings.create(
                model="text-embedding-3-small",
                input=texts
            )
            return [item.embedding for item in response.data]
        except:
            return [[0.0] * 1536 for _ in texts]


class GrokService:
    """Grok for Twitter content and alternative perspectives."""
    
    @staticmethod
    async def generate_tweet(topic: str, style: str = "engaging") -> str:
        """Generate a tweet about classical topics."""
        if not GROK_API_KEY:
            return f"🏛️ Exploring {topic} in the ancient world... #Classics #DigitalHumanities"
        
        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    "https://api.x.ai/v1/chat/completions",
                    headers={
                        "Authorization": f"Bearer {GROK_API_KEY}",
                        "Content-Type": "application/json"
                    },
                    json={
                        "model": "grok-beta",
                        "messages": [
                            {
                                "role": "system",
                                "content": "You write engaging tweets about classical literature and ancient languages. Keep under 280 chars. Use emojis sparingly but effectively."
                            },
                            {
                                "role": "user",
                                "content": f"Write a {style} tweet about: {topic}"
                            }
                        ],
                        "max_tokens": 100
                    },
                    timeout=30.0
                )
                data = response.json()
                return data["choices"][0]["message"]["content"]
        except Exception as e:
            return f"🏛️ {topic} — exploring ancient wisdom #Classics"
    
    @staticmethod
    async def generate_thread(topic: str, points: int = 5) -> List[str]:
        """Generate a Twitter thread."""
        if not GROK_API_KEY:
            return [
                f"🧵 Thread: {topic}",
                "1/ First point about this fascinating topic...",
                "2/ The ancient sources tell us...",
                "3/ What's remarkable is...",
                "4/ Modern scholarship reveals...",
                f"5/ In conclusion, {topic} shows us... /end"
            ]
        
        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    "https://api.x.ai/v1/chat/completions",
                    headers={
                        "Authorization": f"Bearer {GROK_API_KEY}",
                        "Content-Type": "application/json"
                    },
                    json={
                        "model": "grok-beta",
                        "messages": [
                            {
                                "role": "system",
                                "content": "You write Twitter threads about classical literature. Each tweet under 280 chars. Number them 1/, 2/, etc."
                            },
                            {
                                "role": "user",
                                "content": f"Write a {points}-tweet thread about: {topic}"
                            }
                        ],
                        "max_tokens": 500
                    },
                    timeout=30.0
                )
                data = response.json()
                content = data["choices"][0]["message"]["content"]
                # Split into individual tweets
                tweets = [t.strip() for t in content.split('\n') if t.strip()]
                return tweets[:points]
        except:
            return [f"🧵 Thread about {topic}..."]


class GeminiService:
    """Gemini for content generation and SEO."""
    
    @staticmethod
    async def generate_blog_post(topic: str, keywords: List[str]) -> dict:
        """Generate SEO-optimized blog post."""
        if not GOOGLE_API_KEY:
            return {
                "title": f"Exploring {topic} in Classical Literature",
                "content": f"A blog post about {topic}...",
                "meta_description": f"Discover {topic} in ancient Greek and Latin texts.",
                "seo_score": 75
            }
        
        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    f"https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key={GOOGLE_API_KEY}",
                    json={
                        "contents": [{
                            "parts": [{
                                "text": f"""Write an SEO-optimized blog post about {topic} for a classical research platform.

Keywords to include: {', '.join(keywords)}

Respond in JSON:
{{
    "title": "Engaging title with keyword",
    "content": "Full blog post in markdown (500-800 words)",
    "meta_description": "155 char description",
    "seo_score": 85
}}"""
                            }]
                        }]
                    },
                    timeout=60.0
                )
                data = response.json()
                text = data["candidates"][0]["content"]["parts"][0]["text"]
                return json.loads(text)
        except:
            return {"title": topic, "content": "", "meta_description": "", "seo_score": 50}
    
    @staticmethod
    async def generate_meta_tags(page: str, content: str) -> dict:
        """Generate SEO meta tags for a page."""
        return {
            "title": f"{page} | LOGOS Classical Research",
            "description": content[:155] if content else f"Explore {page} with AI-powered classical research tools.",
            "keywords": ["classical research", "Greek", "Latin", "AI", page.lower()]
        }


class EmailService:
    """Email generation for Harvard outreach."""
    
    TEMPLATES = {
        "nagy_custom": """Dear Professor Nagy,

Your work on Homeric poetry and oral tradition has profoundly influenced how we understand ancient Greek literature. I've built LOGOS with your research in mind.

LOGOS offers:
• Cross-lingual semantic search across 69M words
• AI-powered intertextuality detection
• Higher-order pattern discovery

I believe it could enhance the Center for Hellenic Studies' digital initiatives. Would you have 15 minutes for a demo?

Best regards,
Ettan Tau Vaid
LOGOS — logos-classics.com""",

        "intertextuality_demo": """Dear Professor {name},

Given your groundbreaking work on intertextuality in {specialty}, I wanted to share LOGOS — an AI platform that automates allusion detection.

Our system finds:
• Verbal echoes across Greek and Latin
• Structural parallels
• Thematic connections humans might miss

It's already detected patterns in Virgil-Homer relationships that align with your published findings. Would you like to see how it works with your own research texts?

Best regards,
Ettan Tau Vaid
LOGOS — logos-classics.com""",

        "digital_humanities": """Dear Professor {name},

As a leader in digital humanities for classics, you'll appreciate LOGOS — our new AI-powered research platform.

Technical highlights:
• pgvector semantic search (69M+ words)
• Claude/GPT-4 for translation and analysis
• Higher-order discovery engine
• Full CTS URN support

We're offering free faculty accounts. Would you like to explore how this could support your research and teaching?

Best regards,
Ettan Tau Vaid
LOGOS — logos-classics.com""",

        "standard": """Dear Professor {name},

I'm reaching out because your work on {specialty} aligns with a platform I've built for classical research.

LOGOS offers:
• Semantic search across Greek & Latin texts
• AI translation (3 styles)
• Intertextuality detection
• Research assistant with citations

Would you have 15 minutes this week for a brief demo?

Best regards,
Ettan Tau Vaid
LOGOS — logos-classics.com""",

        "discovery_attribution": """Dear Professor {name},

LOGOS is a new AI platform that generates novel hypotheses about classical literature — and attributes discoveries to the scholars who guide them.

Recent AI-generated hypotheses include:
• Correlation between intertextual strategy and political context
• Predictive patterns in Latin epic influence

Your expertise in {specialty} could lead to attributed discoveries (with DOIs). Interested in collaborating?

Best regards,
Ettan Tau Vaid
LOGOS — logos-classics.com"""
    }
    
    @staticmethod
    def generate_email(contact: dict, template_id: str) -> str:
        """Generate personalized outreach email."""
        template = EmailService.TEMPLATES.get(template_id, EmailService.TEMPLATES["standard"])
        return template.format(
            name=contact.get("name", "Professor"),
            specialty=contact.get("specialty", "classical literature")
        )
    
    @staticmethod
    def get_subject(template_id: str) -> str:
        """Get email subject line."""
        subjects = {
            "nagy_custom": "LOGOS — AI for Homeric Research",
            "intertextuality_demo": "AI-Powered Intertextuality Detection",
            "digital_humanities": "LOGOS: New DH Platform for Classics",
            "standard": "LOGOS — AI Classical Research Platform",
            "discovery_attribution": "AI Discovery Attribution for Scholars"
        }
        return subjects.get(template_id, "LOGOS — AI Classical Research Platform")


# Export services
claude_service = ClaudeService()
openai_service = OpenAIService()
grok_service = GrokService()
gemini_service = GeminiService()
email_service = EmailService()
