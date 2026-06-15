# dbmsProject

Full-stack **Multi-Category Search & Filter** system (your FrontEnd UI + DSEDBD-style architecture).

## Live demo (GitHub Pages)

**https://gudipudi-jahnavi.github.io/dbmsProject/**

The UI is deployed automatically from `main` to the `gh-pages` branch.

**One-time GitHub setup:** Repo **Settings → Pages → Build and deployment → Source:** `Deploy from a branch` → Branch: `gh-pages` → Folder: `/ (root)`.

Sign-in and search still need the local backend (gateway + Spring Boot + PostgreSQL) running, or a deployed API URL via `VITE_API_BASE_URL`.

## Folder structure (same as DSEDBD)

```
dbmsProject/
├── frontend/                 # React + Vite
└── backend/
    ├── coreservices/         # Spring Boot — package `dbms`
    └── gateway/              # FastAPI API Gateway
```

Create an empty PostgreSQL database **`dbms`** in pgAdmin once (like **`mth`** in the example). Spring Boot + JPA then create tables automatically (`ddl-auto=update`).

## Rubric coverage

| Marks | Topic | Where |
|------:|-------|-------|
| 10 | Problem & Frontend UI | `frontend/` |
| 10 | API Gateway (FastAPI) | `backend/gateway/` |
| 10 | Backend (Spring Boot) | `backend/coreservices/` — JWT, search API |
| 10 | Database (PostgreSQL) | Auto-created tables + seed in `DataInitializer` |
| 10 | System Integration | React → Gateway → Spring → PostgreSQL |

## Run order

### 1. PostgreSQL
- Start PostgreSQL (port **5432**).
- In pgAdmin: right-click **Databases** → **Create** → **Database** → name: **`dbms`**.
- Set your postgres password in `backend/coreservices/src/main/resources/application.properties`.
- Run Spring Boot — JPA creates tables and `DataInitializer` seeds admin + items (Hibernate lines in the console are normal).

### 2. Spring Boot (port 8080)
```bash
cd backend/coreservices
mvnw spring-boot:run
```
Edit `application.properties` if your postgres password differs.

Import `backend/coreservices` in **Eclipse STS** as Maven project.

### 3. FastAPI Gateway (port 8000)
```bash
cd backend/gateway
pip install -r requirements.txt
python run.py
```

### 4. React Frontend (port 5173)
```bash
cd frontend
npm install
npm run dev
```

## Flow

```
Frontend (5173) → Gateway (8000) → CoreServices (8080) → PostgreSQL (dbms)
```

## Login

Register a new account via **Sign Up**, then sign in.

## API (via gateway)

| Service | Endpoint |
|---------|----------|
| Auth | POST `/authservice/signup`, `/authservice/signin` |
| Items | GET `/itemservice/search?...` |
