# Office Task Manager App

A full-stack office task management application built with **Angular 21** (frontend) and **Node.js / Express** (backend), using **MongoDB** as the database.

Developed as the final project for **Coding Factory 9** — Athens University of Economics and Business.

**Live demo:** https://office-task-manager-mcux.onrender.com

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Angular 21, Angular Material, Bootstrap 5, SCSS |
| Backend | Node.js, Express 5, TypeScript |
| Database | MongoDB Atlas (Mongoose ODM) |
| Authentication | Google OAuth 2.0 + JWT |
| API Docs | Swagger (available at `/api/docs`) |
| Testing | Jest, ts-jest, mongodb-memory-server, Supertest |

---

## Architecture

The backend follows a **layered architecture**:

```
Controller → Service → DAO (Repository) → MongoDB
```

- **Controllers** handle HTTP requests and responses
- **Services** contain business logic and authorization rules
- **DAOs** handle all database operations (Mongoose queries)
- **Mappers** transform Mongoose documents to clean response DTOs

Role-based access control (RBAC) is enforced at the middleware level with three roles: `admin`, `manager`, `employee`.

---

## Authentication Design

The application uses **Google OAuth 2.0** for authentication instead of a traditional username/password system.

This was a deliberate design choice based on realistic requirements: in a real internal office management application, the company would have its own **Google Workspace domain** (e.g. `@companyname.com`). All employees already have corporate Google accounts, so OAuth login against that domain is both more secure and more practical than managing separate credentials.

The backend enforces this by validating that only emails from a configured domain (`ALLOWED_DOMAIN` in `.env`) can register and log in. Users are created by an admin after their Google account is verified.

### Demo Login (Testing Only)

For evaluation purposes, the application includes a **demo login** feature that allows bypassing Google OAuth to log in directly as:

- `demo_admin` — full admin access
- `demo_manager` — manager access
- `demo_employee` — employee access

> **This feature is intentionally insecure and exists only so the evaluator can test all three roles without needing multiple Gmail accounts.**
> In a production environment, demo login would be completely removed.

---

## Prerequisites

- Node.js >= 18
- npm >= 9
- Angular CLI: `npm install -g @angular/cli`
- A MongoDB Atlas account (or local MongoDB instance)
- A Google Cloud project with OAuth 2.0 credentials

---

## Environment Setup

### Backend — `backend/.env`

Create a `.env` file in the `backend/` directory:

```env
MONGO_URI=your_mongodb_connection_string
PORT=3000
JWT_SECRET=your_jwt_secret
SALT_ROUNDS=10
CORS_ORIGINS=http://localhost:4200
ALLOWED_DOMAIN=gmail.com
GOOGLE_CLIENT_ID=your_google_client_id
```

### Frontend — `frontend/src/environments/`

Edit `environment.development.ts` for local development:

```typescript
export const environment = {
  apiURL: 'http://localhost:3000/api',
  googleClientId: 'your_google_client_id',
  weatherApiKey: 'your_openweather_api_key'
};
```

---

## Running Locally (Development)

### 1. Backend

```bash
cd backend
npm install
npm run dev
```

The API will be available at `http://localhost:3000`.
Swagger documentation: `http://localhost:3000/api/docs`

### 2. Frontend

```bash
cd frontend
npm install
ng serve
```

The app will be available at `http://localhost:4200`.

---

## Building for Production

### Backend

```bash
cd backend
npm run build
npm start
```

This compiles TypeScript to `dist/` and starts the compiled server.

### Frontend

```bash
cd frontend
ng build
```

Output is placed in `dist/office-task-manager/`. Serve with any static file server or deploy to a hosting platform.

---

## Running Tests

From the `backend/` directory:

```bash
# Run all tests with coverage report
npm test

# View HTML coverage report
open coverage/lcov-report/index.html
```

The test suite includes:
- **Unit tests** for all services, controllers, mappers and middlewares (jest.mock)
- **Integration tests** using `mongodb-memory-server` (real Mongoose queries, in-memory DB)

Current coverage: **~87% statements / ~90% lines**

---

## API Documentation

Swagger UI is available when the backend is running:

```
http://localhost:3000/api/docs
```

All endpoints are documented with request/response schemas, authentication requirements, and role permissions.

---

## Project Structure

```
office-task-manager-app/
├── backend/
│   ├── src/
│   │   ├── controller/     # Express route handlers
│   │   ├── services/       # Business logic & authorization
│   │   ├── dao/            # Database access (Mongoose)
│   │   ├── models/         # Mongoose schemas
│   │   ├── mappers/        # Document → DTO transformation
│   │   ├── middleware/     # Auth & role guards
│   │   ├── routes/         # Express routers
│   │   ├── tests/          # Unit & integration tests
│   │   └── server.ts       # App entry point
│   ├── coverage/           # Jest coverage report
│   └── jest.config.ts
└── frontend/
    └── src/
        ├── app/
        │   ├── components/ # Angular components (dashboard, boards, tasks, users, navbar)
        │   ├── services/   # HTTP services
        │   ├── guards/     # Route guards
        │   └── models/     # TypeScript interfaces
        └── environments/   # API URL & client ID per environment
```
