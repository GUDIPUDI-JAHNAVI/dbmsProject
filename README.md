# dbmsProject

Full-stack **Multi-Category Search & Filter** system (React frontend + FastAPI API + PostgreSQL).

## Live demo (Vercel — full stack)

Deploy the **frontend + API** together on Vercel:

1. Push this repo to GitHub.
2. Go to [vercel.com/new](https://vercel.com/new) and import **GUDIPUDI-JAHNAVI/dbmsProject**.
3. Create a free Postgres database at [neon.tech](https://neon.tech) (or Vercel Postgres).
4. In Vercel **Project → Settings → Environment Variables**, add:
   - `DATABASE_URL` = your Postgres connection string
   - `JWT_SECRET` = any long random string
5. Click **Deploy**.

Your live app will be at:

**`https://<your-project>.vercel.app`**

Sign up, sign in, and search all use the deployed API and database.

## Live demo (GitHub Pages — UI only)

**https://gudipudi-jahnavi.github.io/dbmsProject/**

GitHub Pages serves the frontend only. Sign-up/search use browser demo mode there.

**One-time GitHub setup:** Repo **Settings → Pages → Build and deployment → Source:** `Deploy from a branch` → Branch: `gh-pages` → Folder: `/ (root)`.

## Folder structure

```
dbmsProject/
├── frontend/                 # React + Vite
├── api/                      # FastAPI API for Vercel deployment
├── backend/gateway/          # Local FastAPI gateway (optional)
└── vercel.json               # Vercel build + API rewrites
```

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
