from fastapi import APIRouter, Header
from models.schemas import SigninSchema, SignupSchema
import httpx
import os
from dotenv import load_dotenv

router = APIRouter(prefix="/authservice")

load_dotenv()
SPRING_URL = os.getenv("SPRING_URL", "http://127.0.0.1:8080")


@router.post("/signin")
async def signin(data: SigninSchema):
    payload = {"email": data.username, "password": data.password}
    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(f"{SPRING_URL}/api/auth/login", json=payload)
        body = response.json()
        if body.get("code") == 200 and body.get("data"):
            token = body["data"].get("token")
            if token:
                body["jwt"] = token
        return body
    except httpx.ConnectError:
        return {"code": 503, "message": "Spring Boot not running. Start coreservices on port 8080."}


@router.post("/signup")
async def signup(data: SignupSchema):
    payload = data.model_dump()
    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(f"{SPRING_URL}/api/auth/register", json=payload)
        return response.json()
    except httpx.ConnectError:
        return {"code": 503, "message": "Spring Boot not running. Start coreservices on port 8080."}
