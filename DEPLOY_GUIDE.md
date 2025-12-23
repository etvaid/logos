# LOGOS Deployment Guide

## Environment Variables
Add these in Railway/Vercel dashboards, NOT in code:

### Railway (Backend)
- ANTHROPIC_API_KEY
- OPENAI_API_KEY  
- XAI_API_KEY
- GOOGLE_AI_API_KEY
- DATABASE_URL (auto-set)

### Vercel (Frontend)
- NEXT_PUBLIC_API_URL = Your Railway URL

## Deploy Steps
1. Push to GitHub
2. Connect Railway to repo (root: apps/api)
3. Connect Vercel to repo (root: apps/web)
4. Add environment variables
5. Deploy
