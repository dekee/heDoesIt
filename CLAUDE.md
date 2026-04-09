# heDoesIt Bakery

Artisan baked goods ecommerce website.

## Tech Stack
- **Backend**: Spring Boot 3.4.2 + Kotlin 2.1.10, Java 21, Gradle
- **Frontend**: React 19 + TypeScript + Vite
- **Database**: PostgreSQL 16 (prod) / H2 (dev)
- **Deployment**: Oracle Cloud Free Tier, K3s, ArgoCD

## Build & Run

### Backend
```bash
./gradlew bootRun          # Dev mode (H2 in-memory)
./gradlew build            # Build + test
./gradlew bootJar          # Build production JAR
```

### Frontend
```bash
cd frontend
npm install
npm run dev                # Dev server on :5173 (proxies /api to :8080)
npm run build              # Production build
npm test                   # Run tests
```

### Docker
```bash
# Backend
docker build -t hedoesit-backend .

# Frontend
docker build -t hedoesit-frontend ./frontend

# Multi-arch push to GHCR
./scripts/build-multiarch.sh
```

## Conventions
- Prices stored as cents (BIGINT) — never floating point
- REST endpoints under `/api/`; admin endpoints under `/api/admin/`
- Google OAuth for admin auth (same pattern as family reunion project)
- Flyway migrations in `src/main/resources/db/migration/`
- Image uploads stored on disk at `$UPLOAD_DIR/products/`
- Soft-delete for products (active=false)

## Environment Variables
- `GOOGLE_CLIENT_ID` — Google OAuth client ID
- `INITIAL_ADMIN_EMAIL` / `INITIAL_ADMIN_NAME` — First admin user
- `GMAIL_USERNAME` / `GMAIL_APP_PASSWORD` — Email notifications
- `CONTACT_EMAIL` — Where inquiry notifications are sent
- `DB_HOST` / `DB_NAME` / `DB_USER` / `DB_PASSWORD` — PostgreSQL (prod)
- `UPLOAD_DIR` — Product image storage path (default: `./uploads`)

## Deployment
- Domain: hedoesit.com
- Oracle Cloud Ampere A1 VM with K3s
- ArgoCD auto-syncs from `k8s/` directory
- Images: `ghcr.io/dekee/hedoesit-{backend,frontend}:latest`
