import os
from datetime import datetime, timedelta, timezone

import bcrypt
import jwt
from fastapi import FastAPI, Header, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from sqlalchemy import Column, Float, Integer, String, create_engine, func, or_
from sqlalchemy.orm import declarative_base, sessionmaker

DATABASE_URL = os.getenv("DATABASE_URL", "")
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

JWT_SECRET = os.getenv("JWT_SECRET", "dbms-project-dev-secret")
JWT_HOURS = int(os.getenv("JWT_HOURS", "24"))

Base = declarative_base()
engine = create_engine(DATABASE_URL, pool_pre_ping=True) if DATABASE_URL else None
SessionLocal = sessionmaker(bind=engine) if engine else None


class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True)
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    email = Column(String(255), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)


class Item(Base):
    __tablename__ = "items"
    id = Column(Integer, primary_key=True)
    name = Column(String(255), nullable=False)
    description = Column(String(500), nullable=False)
    category = Column(String(50), nullable=False, index=True)
    price = Column(Float, nullable=False)
    rating = Column(Float, nullable=False)
    image = Column(String(255), nullable=False, default="")


SEED_ITEMS = [
    ("The Great Gatsby", "Classic American novel set in the Jazz Age.", "Books", 12.99, 4.5, "/assets/book1"),
    ("Clean Code", "A handbook of agile software craftsmanship.", "Books", 34.99, 4.8, "/assets/book2"),
    ("Atomic Habits", "Build good habits and break bad ones.", "Books", 16.5, 4.7, "/assets/book3"),
    ("Database Systems", "Concepts and design for modern databases.", "Books", 58.0, 4.4, "/assets/book4"),
    ("Wireless Headphones", "Noise-cancelling over-ear headphones.", "Electronics", 129.99, 4.6, "/assets/electronics1"),
    ("Smart Watch", "Fitness tracking with heart-rate monitor.", "Electronics", 199.0, 4.3, "/assets/electronics2"),
    ("USB-C Hub", "7-in-1 adapter for laptops and tablets.", "Electronics", 39.99, 4.2, "/assets/electronics3"),
    ("Bluetooth Speaker", "Portable speaker with deep bass.", "Electronics", 49.5, 4.1, "/assets/electronics4"),
    ("Denim Jacket", "Classic fit denim jacket for all seasons.", "Clothing", 59.99, 4.4, "/assets/clothing1"),
    ("Running Shoes", "Lightweight shoes for daily training.", "Clothing", 89.0, 4.6, "/assets/clothing2"),
    ("Summer Dress", "Floral print dress with breathable fabric.", "Clothing", 45.0, 4.3, "/assets/clothing3"),
    ("Hooded Sweatshirt", "Soft fleece hoodie with front pocket.", "Clothing", 38.5, 4.0, "/assets/clothing4"),
    ("Data Structures in Java", "Algorithms and structures for interviews.", "Books", 42.0, 4.5, "/assets/book5"),
    ("4K Monitor", "27-inch display with vivid color accuracy.", "Electronics", 279.99, 4.7, "/assets/electronics5"),
    ("Leather Belt", "Genuine leather belt with metal buckle.", "Clothing", 24.99, 3.9, "/assets/clothing5"),
    ("Mechanical Keyboard", "RGB keyboard with tactile switches.", "Electronics", 99.0, 4.5, "/assets/electronics6"),
    ("Cookbook Essentials", "Quick recipes for busy weeknights.", "Books", 22.0, 4.1, "/assets/book6"),
    ("Winter Scarf", "Warm wool scarf in neutral tones.", "Clothing", 18.0, 4.2, "/assets/clothing6"),
]


class SigninSchema(BaseModel):
    username: str
    password: str


class SignupSchema(BaseModel):
    firstName: str
    lastName: str
    email: EmailStr
    password: str


def ensure_database():
    if not engine:
        return {
            "code": 503,
            "message": "DATABASE_URL is not configured. Add a Postgres connection string in Vercel.",
        }

    Base.metadata.create_all(bind=engine)
    with SessionLocal() as session:
        if session.query(Item).count() == 0:
            for name, description, category, price, rating, image in SEED_ITEMS:
                session.add(
                    Item(
                        name=name,
                        description=description,
                        category=category,
                        price=price,
                        rating=rating,
                        image=image,
                    )
                )
            session.commit()


def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(password: str, password_hash: str) -> bool:
    return bcrypt.checkpw(password.encode("utf-8"), password_hash.encode("utf-8"))


def create_token(email: str) -> str:
    payload = {
        "sub": email,
        "exp": datetime.now(timezone.utc) + timedelta(hours=JWT_HOURS),
    }
    return jwt.encode(payload, JWT_SECRET, algorithm="HS256")


def verify_token(token: str):
    if not token:
        return None
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        return payload["sub"]
    except jwt.PyJWTError:
        return None


app = FastAPI(title="DBMS Project API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def startup():
    if engine:
        ensure_database()


@app.get("/")
def home():
    return {"code": 200, "message": "DBMS Project API is running"}


@app.post("/authservice/signup")
def signup(data: SignupSchema):
    db_error = ensure_database()
    if db_error:
        return db_error
    email = data.email.strip().lower()

    with SessionLocal() as session:
        existing = session.query(User).filter(func.lower(User.email) == email).first()
        if existing:
            return {"code": 400, "message": "Email already registered"}

        session.add(
            User(
                first_name=data.firstName,
                last_name=data.lastName,
                email=email,
                password_hash=hash_password(data.password),
            )
        )
        session.commit()

    return {"code": 200, "message": "Account created successfully"}


@app.post("/authservice/signin")
def signin(data: SigninSchema):
    db_error = ensure_database()
    if db_error:
        return db_error
    email = data.username.strip().lower()

    with SessionLocal() as session:
        user = session.query(User).filter(func.lower(User.email) == email).first()
        if not user or not verify_password(data.password, user.password_hash):
            return {"code": 401, "message": "Invalid email or password"}

        token = create_token(user.email)
        return {
            "code": 200,
            "jwt": token,
            "data": {
                "token": token,
                "user": {
                    "email": user.email,
                    "firstName": user.first_name,
                    "lastName": user.last_name,
                },
            },
        }


@app.get("/itemservice/search")
def search(request: Request, Token: str = Header(default="")):
    db_error = ensure_database()
    if db_error:
        return db_error

    if not verify_token(Token):
        return {"code": 401, "message": "Invalid or expired token"}

    params = request.query_params
    query = (params.get("q") or "").strip().lower()
    category = params.get("category") or "all"
    min_price = float(params.get("minPrice") or 0)
    max_price = float(params.get("maxPrice")) if params.get("maxPrice") else None
    min_rating = float(params.get("minRating") or 0)
    page = max(1, int(params.get("page") or 1))
    page_size = max(1, int(params.get("pageSize") or 12))

    with SessionLocal() as session:
        q = session.query(Item)
        if query:
            q = q.filter(
                or_(
                    func.lower(Item.name).contains(query),
                    func.lower(Item.description).contains(query),
                )
            )
        if category != "all":
            q = q.filter(Item.category == category)
        if min_price:
            q = q.filter(Item.price >= min_price)
        if max_price is not None:
            q = q.filter(Item.price <= max_price)
        if min_rating:
            q = q.filter(Item.rating >= min_rating)

        total_count = q.count()
        total_pages = max(1, (total_count + page_size - 1) // page_size)
        items = (
            q.order_by(Item.id)
            .offset((page - 1) * page_size)
            .limit(page_size)
            .all()
        )

        return {
            "code": 200,
            "data": {
                "items": [
                    {
                        "id": item.id,
                        "name": item.name,
                        "description": item.description,
                        "category": item.category,
                        "price": item.price,
                        "rating": item.rating,
                        "image": item.image,
                    }
                    for item in items
                ],
                "totalCount": total_count,
                "totalPages": total_pages,
                "page": page,
                "pageSize": page_size,
            },
        }
