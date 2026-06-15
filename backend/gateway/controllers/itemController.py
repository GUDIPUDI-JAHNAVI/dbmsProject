from fastapi import APIRouter, Header, Request
import httpx
import os
from dotenv import load_dotenv

router = APIRouter(prefix="/itemservice")

load_dotenv()
SPRING_URL = os.getenv("SPRING_URL", "http://127.0.0.1:8080")


@router.get("/search")
async def search(request: Request, Token: str = Header(...)):
    query = str(request.url.query)
    url = f"{SPRING_URL}/api/items"
    if query:
        url = f"{url}?{query}"
    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.get(
                url,
                headers={"Token": Token, "Authorization": f"Bearer {Token}"},
            )
        return response.json()
    except httpx.ConnectError:
        return {"code": 503, "message": "Spring Boot not running. Start coreservices on port 8080."}
