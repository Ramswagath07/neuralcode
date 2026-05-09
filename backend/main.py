"""
NeuralCode Backend - FastAPI
Run: uvicorn main:app --reload --port 8000
"""
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import os, httpx

app = FastAPI(title="NeuralCode API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "https://your-domain.vercel.app"],
    allow_methods=["*"],
    allow_headers=["*"],
)

ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY", "")
ANTHROPIC_URL     = "https://api.anthropic.com/v1/messages"
MODEL             = "claude-sonnet-4-20250514"


class Message(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: List[Message]
    system: Optional[str] = ""
    max_tokens: Optional[int] = 1000


@app.post("/api/chat")
async def proxy_claude(req: ChatRequest):
    """Proxy endpoint — keeps API key server-side."""
    if not ANTHROPIC_API_KEY:
        raise HTTPException(status_code=500, detail="API key not configured")

    body = {
        "model": MODEL,
        "max_tokens": req.max_tokens,
        "messages": [m.dict() for m in req.messages],
    }
    if req.system:
        body["system"] = req.system

    async with httpx.AsyncClient() as client:
        response = await client.post(
            ANTHROPIC_URL,
            headers={
                "Content-Type": "application/json",
                "x-api-key": ANTHROPIC_API_KEY,
                "anthropic-version": "2023-06-01",
            },
            json=body,
            timeout=60,
        )
        if not response.is_success:
            raise HTTPException(status_code=response.status_code, detail=response.text)
        return response.json()


@app.get("/health")
async def health():
    return {"status": "ok", "model": MODEL}


# ── Run directly ──
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
