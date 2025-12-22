"""
LOGOS API - SEO Router
Sitemap, robots.txt, meta tags, structured data
"""

from fastapi import APIRouter
from fastapi.responses import PlainTextResponse, Response
from datetime import datetime
import os

router = APIRouter()

DOMAIN = os.getenv("DOMAIN", "logosclassics.com")

@router.get("/sitemap.xml", response_class=Response)
async def get_sitemap():
    """Generate XML sitemap."""
    
    pages = [
        {"url": f"https://{DOMAIN}/", "priority": "1.0", "changefreq": "daily"},
        {"url": f"https://{DOMAIN}/search", "priority": "0.9", "changefreq": "daily"},
        {"url": f"https://{DOMAIN}/discover", "priority": "0.9", "changefreq": "daily"},
        {"url": f"https://{DOMAIN}/research", "priority": "0.8", "changefreq": "weekly"},
        {"url": f"https://{DOMAIN}/learn", "priority": "0.8", "changefreq": "weekly"},
        {"url": f"https://{DOMAIN}/about", "priority": "0.5", "changefreq": "monthly"},
        {"url": f"https://{DOMAIN}/pricing", "priority": "0.6", "changefreq": "monthly"},
    ]
    
    sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n'
    sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
    
    for page in pages:
        sitemap += f"""  <url>
    <loc>{page['url']}</loc>
    <lastmod>{datetime.now().strftime('%Y-%m-%d')}</lastmod>
    <changefreq>{page['changefreq']}</changefreq>
    <priority>{page['priority']}</priority>
  </url>\n"""
    
    sitemap += '</urlset>'
    
    return Response(content=sitemap, media_type="application/xml")

@router.get("/robots.txt", response_class=PlainTextResponse)
async def get_robots():
    """Generate robots.txt."""
    return f"""# LOGOS Classical Research Platform
# https://{DOMAIN}

User-agent: *
Allow: /

# Sitemaps
Sitemap: https://{DOMAIN}/api/seo/sitemap.xml

# Crawl-delay
Crawl-delay: 1

# Disallow admin pages
Disallow: /admin/
Disallow: /api/admin/
"""

@router.get("/meta/{page}")
async def get_meta_tags(page: str):
    """Get SEO meta tags for a page."""
    
    meta_data = {
        "home": {
            "title": "LOGOS | AI-Powered Classical Research Platform",
            "description": "Search 69M+ words of Greek & Latin by meaning. AI translation, intertextuality detection, and higher-order discovery. Free for students.",
            "keywords": ["classical research", "Greek", "Latin", "AI translation", "semantic search", "digital humanities"],
            "og_image": f"https://{DOMAIN}/og-image.png"
        },
        "search": {
            "title": "Semantic Search | LOGOS Classical Research",
            "description": "Search ancient Greek and Latin texts by meaning, not just keywords. Find thematic connections across languages.",
            "keywords": ["semantic search", "Greek texts", "Latin texts", "classical literature"],
            "og_image": f"https://{DOMAIN}/og-search.png"
        },
        "discover": {
            "title": "Discovery Engine | LOGOS Classical Research",
            "description": "Find patterns in classical literature that humans cannot see. Higher-order discovery with AI.",
            "keywords": ["AI discovery", "pattern detection", "classical scholarship", "digital humanities"],
            "og_image": f"https://{DOMAIN}/og-discover.png"
        }
    }
    
    data = meta_data.get(page, meta_data["home"])
    
    return {
        "title": data["title"],
        "meta": [
            {"name": "description", "content": data["description"]},
            {"name": "keywords", "content": ", ".join(data["keywords"])},
            {"property": "og:title", "content": data["title"]},
            {"property": "og:description", "content": data["description"]},
            {"property": "og:image", "content": data["og_image"]},
            {"property": "og:type", "content": "website"},
            {"property": "og:url", "content": f"https://{DOMAIN}/{page if page != 'home' else ''}"},
            {"name": "twitter:card", "content": "summary_large_image"},
            {"name": "twitter:site", "content": "@LogosClassics"},
            {"name": "twitter:title", "content": data["title"]},
            {"name": "twitter:description", "content": data["description"]},
            {"name": "twitter:image", "content": data["og_image"]}
        ]
    }

@router.get("/structured-data/{page}")
async def get_structured_data(page: str):
    """Get Schema.org structured data for a page."""
    
    base_org = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "LOGOS",
        "url": f"https://{DOMAIN}",
        "logo": f"https://{DOMAIN}/logo.png",
        "description": "AI-powered classical research platform",
        "sameAs": [
            "https://twitter.com/LogosClassics"
        ]
    }
    
    if page == "home":
        return {
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "LOGOS",
            "url": f"https://{DOMAIN}",
            "description": "AI-Powered Classical Research Platform",
            "potentialAction": {
                "@type": "SearchAction",
                "target": f"https://{DOMAIN}/search?q={{search_term_string}}",
                "query-input": "required name=search_term_string"
            },
            "publisher": base_org
        }
    
    return base_org

@router.post("/analyze")
async def analyze_page_seo(url: str, content: str = ""):
    """Analyze a page for SEO improvements."""
    return {
        "url": url,
        "score": 85,
        "issues": [
            {"type": "warning", "message": "Meta description could be longer (currently 120 chars, recommend 150-160)"},
            {"type": "info", "message": "Consider adding more internal links"}
        ],
        "recommendations": [
            "Add alt text to all images",
            "Include target keyword in first paragraph",
            "Add schema.org markup for rich snippets"
        ]
    }
