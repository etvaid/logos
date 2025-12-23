from fastapi import APIRouter
from pydantic import BaseModel
from typing import List
from datetime import datetime

router = APIRouter()
queue = []

class TweetRequest(BaseModel):
    content: str

class ScheduleRequest(BaseModel):
    content: str
    scheduled_at: str

@router.get("/twitter/status")
async def twitter_status():
    return {"connected": True, "handle": "@LogosClassics", "followers": 127}

@router.post("/twitter/post")
async def post_tweet(req: TweetRequest):
    if len(req.content) > 280:
        return {"success": False, "error": "Tweet too long"}
    return {"success": True, "tweet_id": "demo_" + str(len(queue)), "url": "https://twitter.com/LogosClassics/status/demo"}

@router.get("/twitter/queue")
async def get_queue():
    return {"queue": queue}

@router.post("/twitter/schedule")
async def schedule_tweet(req: ScheduleRequest):
    queue.append({"id": len(queue), "content": req.content, "scheduled_at": req.scheduled_at})
    return {"success": True, "queue_position": len(queue)}

@router.delete("/twitter/queue/{id}")
async def delete_scheduled(id: int):
    global queue
    queue = [q for q in queue if q.get("id") != id]
    return {"success": True}
