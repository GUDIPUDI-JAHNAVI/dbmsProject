from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from controllers.init import AuthenticationRouter, ItemRouter

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(AuthenticationRouter)
app.include_router(ItemRouter)


@app.get("/")
def home():
    return "Started..."
