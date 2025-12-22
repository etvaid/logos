"""
LOGOS API - Social Media Router
Twitter integration and posting
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, List
import os
import tweepy
from datetime import datetime

router = APIRouter()

class TweetRequest(BaseModel):
    content: str
    media_ids: Optional[List[str]] = None
    reply_to: Optional[str] = None

class TweetResponse(BaseModel):
    success: bool
    tweet_id: Optional[str] = None
    url: Optional[str] = None
    message: str

def get_twitter_client():
    """Get authenticated Twitter client."""
    api_key = os.getenv("TWITTER_API_KEY")
    api_secret = os.getenv("TWITTER_API_SECRET")
    access_token = os.getenv("TWITTER_ACCESS_TOKEN")
    access_secret = os.getenv("TWITTER_ACCESS_TOKEN_SECRET")
    
    if not all([api_key, api_secret, access_token, access_secret]):
        return None
    
    try:
        client = tweepy.Client(
            consumer_key=api_key,
            consumer_secret=api_secret,
            access_token=access_token,
            access_token_secret=access_secret
        )
        return client
    except Exception as e:
        print(f"Twitter client error: {e}")
        return None

@router.post("/twitter/post", response_model=TweetResponse)
async def post_to_twitter(request: TweetRequest):
    """
    Post a tweet to the LOGOS Twitter account.
    """
    client = get_twitter_client()
    
    if not client:
        return TweetResponse(
            success=False,
            message="Twitter credentials not configured or invalid"
        )
    
    try:
        response = client.create_tweet(
            text=request.content,
            in_reply_to_tweet_id=request.reply_to
        )
        
        tweet_id = response.data["id"]
        handle = os.getenv("TWITTER_HANDLE", "LogosClassics")
        
        return TweetResponse(
            success=True,
            tweet_id=tweet_id,
            url=f"https://twitter.com/{handle}/status/{tweet_id}",
            message="Tweet posted successfully"
        )
    except Exception as e:
        return TweetResponse(
            success=False,
            message=f"Failed to post tweet: {str(e)}"
        )

@router.post("/twitter/thread")
async def post_thread(tweets: List[str]):
    """Post a Twitter thread (multiple connected tweets)."""
    client = get_twitter_client()
    
    if not client:
        return {"success": False, "message": "Twitter not configured"}
    
    posted = []
    reply_to = None
    
    try:
        for tweet in tweets:
            response = client.create_tweet(
                text=tweet,
                in_reply_to_tweet_id=reply_to
            )
            tweet_id = response.data["id"]
            posted.append(tweet_id)
            reply_to = tweet_id
        
        return {
            "success": True,
            "thread_length": len(posted),
            "tweet_ids": posted,
            "message": "Thread posted successfully"
        }
    except Exception as e:
        return {
            "success": False,
            "posted_count": len(posted),
            "message": f"Thread partially posted. Error: {str(e)}"
        }

@router.get("/queue")
async def get_posting_queue():
    """Get scheduled social media posts."""
    return {
        "queue": [
            {
                "id": 1,
                "platform": "twitter",
                "content": "🏛️ New discovery: AI finds previously unknown connection between Ovid and Callimachus...",
                "scheduled_for": datetime.now().isoformat(),
                "status": "scheduled"
            },
            {
                "id": 2,
                "platform": "twitter",
                "content": "Thread: 5 things you didn't know about Homer and Virgil...",
                "scheduled_for": datetime.now().isoformat(),
                "status": "pending"
            }
        ],
        "total": 2
    }

@router.get("/twitter/verify")
async def verify_twitter_connection():
    """Verify Twitter API connection."""
    client = get_twitter_client()
    
    if not client:
        return {
            "connected": False,
            "message": "Twitter credentials not configured"
        }
    
    try:
        # Try to get account info
        me = client.get_me()
        return {
            "connected": True,
            "account": me.data.username if me.data else "Unknown",
            "message": "Twitter connection verified"
        }
    except Exception as e:
        return {
            "connected": False,
            "message": f"Connection failed: {str(e)}"
        }
