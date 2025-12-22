"""
LOGOS API - Admin Router
Dashboard metrics, content management, Harvard outreach
"""

from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime, timedelta
import random

router = APIRouter()

class DashboardMetrics(BaseModel):
    users_total: int
    users_today: int
    users_growth: float
    searches_today: int
    translations_today: int
    discoveries_total: int
    content_pending: int

class ContentItem(BaseModel):
    id: int
    content_type: str
    title: str
    content: str
    seo_score: int
    status: str
    created_at: str

class OutreachContact(BaseModel):
    id: int
    name: str
    email: str
    institution: str
    specialty: str
    status: str
    template: str

# Demo Harvard professors
HARVARD_PROFESSORS = [
    OutreachContact(id=1, name="Gregory Nagy", email="nagy@chs.harvard.edu", institution="Harvard", specialty="Homer, Greek poetry", status="pending", template="nagy_custom"),
    OutreachContact(id=2, name="Richard Thomas", email="rthomas@fas.harvard.edu", institution="Harvard", specialty="Virgil, intertextuality", status="pending", template="intertextuality_demo"),
    OutreachContact(id=3, name="Kathleen Coleman", email="kcoleman@fas.harvard.edu", institution="Harvard", specialty="Latin, Roman spectacle", status="pending", template="standard"),
    OutreachContact(id=4, name="Mark Schiefsky", email="schiefsk@fas.harvard.edu", institution="Harvard", specialty="Ancient science, DH", status="pending", template="digital_humanities"),
    OutreachContact(id=5, name="Emma Dench", email="edench@fas.harvard.edu", institution="Harvard", specialty="Roman history", status="pending", template="standard"),
    OutreachContact(id=6, name="Emily Greenwood", email="emily_greenwood@harvard.edu", institution="Harvard", specialty="Classics and race", status="pending", template="standard"),
    OutreachContact(id=7, name="Paul Kosmin", email="pkosmin@fas.harvard.edu", institution="Harvard", specialty="Hellenistic history", status="pending", template="standard"),
    OutreachContact(id=8, name="Christopher Krebs", email="ckrebs@stanford.edu", institution="Stanford", specialty="Latin literature", status="pending", template="standard"),
    OutreachContact(id=9, name="Denis Feeney", email="dfeeney@princeton.edu", institution="Princeton", specialty="Latin poetry", status="pending", template="standard"),
    OutreachContact(id=10, name="Andrew Ford", email="asford@princeton.edu", institution="Princeton", specialty="Greek poetry", status="pending", template="standard"),
]

# Demo content queue
CONTENT_QUEUE = [
    ContentItem(id=1, content_type="blog", title="5 Ways AI Transforms Classical Research", content="Draft blog post...", seo_score=94, status="pending", created_at=datetime.now().isoformat()),
    ContentItem(id=2, content_type="twitter", title="How Virgil echoed Homer — visualized", content="Thread about intertextuality...", seo_score=87, status="pending", created_at=datetime.now().isoformat()),
    ContentItem(id=3, content_type="blog", title="The Future of Digital Humanities", content="Draft about DH...", seo_score=91, status="pending", created_at=datetime.now().isoformat()),
]

@router.get("/metrics", response_model=DashboardMetrics)
async def get_dashboard_metrics():
    """Get admin dashboard metrics."""
    return DashboardMetrics(
        users_total=1247,
        users_today=23,
        users_growth=12.5,
        searches_today=892,
        translations_today=341,
        discoveries_total=47,
        content_pending=len([c for c in CONTENT_QUEUE if c.status == "pending"])
    )

@router.get("/content")
async def get_content_queue(
    status: Optional[str] = None,
    content_type: Optional[str] = None,
    limit: int = Query(default=20, le=100)
):
    """Get content queue for approval."""
    content = CONTENT_QUEUE.copy()
    
    if status:
        content = [c for c in content if c.status == status]
    if content_type:
        content = [c for c in content if c.content_type == content_type]
    
    return {
        "content": content[:limit],
        "total": len(content),
        "pending": len([c for c in CONTENT_QUEUE if c.status == "pending"])
    }

@router.post("/content/{content_id}/approve")
async def approve_content(content_id: int):
    """Approve content for posting."""
    for c in CONTENT_QUEUE:
        if c.id == content_id:
            c.status = "approved"
            return {"message": f"Content {content_id} approved", "status": "approved"}
    raise HTTPException(status_code=404, detail="Content not found")

@router.post("/content/{content_id}/reject")
async def reject_content(content_id: int, reason: Optional[str] = None):
    """Reject content."""
    for c in CONTENT_QUEUE:
        if c.id == content_id:
            c.status = "rejected"
            return {"message": f"Content {content_id} rejected", "reason": reason}
    raise HTTPException(status_code=404, detail="Content not found")

@router.post("/content/generate")
async def generate_content(content_type: str = "blog", topic: Optional[str] = None):
    """Trigger AI content generation."""
    return {
        "status": "generating",
        "content_type": content_type,
        "topic": topic,
        "message": "Content generation started. Check queue in 1-2 minutes."
    }

@router.get("/outreach")
async def get_outreach_contacts(
    institution: Optional[str] = None,
    status: Optional[str] = None
):
    """Get Harvard/Ivy outreach contacts."""
    contacts = HARVARD_PROFESSORS.copy()
    
    if institution:
        contacts = [c for c in contacts if institution.lower() in c.institution.lower()]
    if status:
        contacts = [c for c in contacts if c.status == status]
    
    return {
        "contacts": contacts,
        "total": len(contacts),
        "by_status": {
            "pending": len([c for c in HARVARD_PROFESSORS if c.status == "pending"]),
            "sent": len([c for c in HARVARD_PROFESSORS if c.status == "sent"]),
            "replied": len([c for c in HARVARD_PROFESSORS if c.status == "replied"])
        }
    }

@router.post("/outreach/{contact_id}/send")
async def send_outreach_email(contact_id: int, customize: Optional[str] = None):
    """Send outreach email to a contact."""
    for c in HARVARD_PROFESSORS:
        if c.id == contact_id:
            c.status = "sent"
            return {
                "message": f"Email sent to {c.name} ({c.email})",
                "template": c.template,
                "customization": customize
            }
    raise HTTPException(status_code=404, detail="Contact not found")

@router.get("/outreach/templates")
async def get_email_templates():
    """Get available email templates."""
    return {
        "templates": [
            {"id": "nagy_custom", "name": "Nagy Custom", "description": "Personalized for Gregory Nagy"},
            {"id": "intertextuality_demo", "name": "Intertextuality Demo", "description": "For intertextuality scholars"},
            {"id": "digital_humanities", "name": "Digital Humanities", "description": "For DH-focused scholars"},
            {"id": "standard", "name": "Standard Outreach", "description": "General academic outreach"},
            {"id": "discovery_attribution", "name": "Discovery Attribution", "description": "Emphasizes DOI attribution"}
        ]
    }

@router.get("/analytics")
async def get_analytics(
    period: str = "7d",
    metrics: Optional[List[str]] = None
):
    """Get detailed analytics."""
    return {
        "period": period,
        "metrics": {
            "page_views": [random.randint(100, 500) for _ in range(7)],
            "unique_users": [random.randint(50, 200) for _ in range(7)],
            "searches": [random.randint(80, 300) for _ in range(7)],
            "translations": [random.randint(40, 150) for _ in range(7)],
            "signups": [random.randint(5, 30) for _ in range(7)]
        },
        "top_searches": [
            "What is justice?",
            "immortality soul",
            "Achilles anger",
            "love poetry Greek"
        ],
        "top_texts": [
            "Iliad Book 1",
            "Aeneid Book 1",
            "Republic Book 1"
        ]
    }

@router.get("/users")
async def get_users(
    role: Optional[str] = None,
    limit: int = Query(default=50, le=200)
):
    """Get user list for admin."""
    return {
        "users": [
            {"id": 1, "email": "demo@example.com", "name": "Demo User", "role": "user", "created_at": datetime.now().isoformat()}
        ],
        "total": 1,
        "by_role": {
            "user": 1000,
            "student": 200,
            "faculty": 47,
            "admin": 1
        }
    }
