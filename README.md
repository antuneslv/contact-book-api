# Contact Book API

A RESTful API built with **NestJS**, **Prisma ORM**, and **PostgreSQL** for managing a personal contact book with **JWT authentication**.

The application allows users to register, authenticate, manage their profile, and securely manage their own contacts through a modular architecture inspired by Clean Architecture principles.

---

## Tech Stack

- NestJS
- TypeScript
- Prisma ORM
- PostgreSQL
- Docker & Docker Compose
- JSON Web Tokens (JWT)
- bcrypt
- Swagger / OpenAPI
- Zod
- class-validator
- class-transformer
- Vitest
- Husky
- lint-staged
- ESLint
- Prettier

---

## Features

- User registration and authentication
- JWT-based authorization
- Secure password hashing with bcrypt
- User profile management
- Password update endpoint
- Personal contact management (CRUD)
- Contact ownership enforcement
- Request validation
- Environment variable validation with Zod
- Interactive Swagger documentation
- PostgreSQL persistence using Prisma ORM
- Unit and End-to-End tests

---

# Requirements

Before getting started, make sure you have installed:

- Node.js 24+
- npm
- Docker Engine
- Docker Compose

---

# Getting Started

## Clone the repository

```bash
git clone https://github.com/antuneslv/contact-book-api.git

cd contact-book-api
```

## Install dependencies

```bash
npm install
```

## Configure environment variables

Copy the example environment file.

```bash
cp .env.example .env
```

Example:

```env
DATABASE_URL="postgresql://cb_user:cb_pw@localhost:5432/contact_book_db"

JWT_SECRET="your-super-secret-key-at-least-32-characters"

JWT_EXPIRES_IN="30m"

PORT=3000
```

Update the values if necessary.

## Start PostgreSQL

```bash
npm run db:up
```

## Run database migrations

```bash
npm run prisma:migrate
```

## Generate the Prisma Client

```bash
npm run prisma:gen
```

## Start the application

```bash
npm run start:dev
```

The API will be available at:

- API: `http://localhost:3000/api`
- Swagger: `http://localhost:3000/docs`

---

# Available Scripts

| Command | Description |
|----------|-------------|
| `npm run start:dev` | Start the development server |
| `npm run build` | Build the application |
| `npm run start:prod` | Run the production build |
| `npm run test` | Run unit tests |
| `npm run test:e2e` | Run End-to-End tests |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Fix ESLint issues |
| `npm run typecheck` | Run TypeScript type checking |
| `npm run db:up` | Start PostgreSQL |
| `npm run db:down` | Stop PostgreSQL |
| `npm run prisma:migrate` | Run Prisma migrations |
| `npm run prisma:gen` | Generate the Prisma Client |
| `npm run prisma:studio` | Open Prisma Studio |

---

# API Documentation

Swagger/OpenAPI documentation is available at:

`http://localhost:3000/docs`

Protected endpoints require a Bearer Token.

```http
Authorization: Bearer <access_token>
```

---

# API Endpoints

| Method | Endpoint | Description | Auth |
|---------|----------|-------------|------|
| POST | `/api/auth/login` | Authenticate a user and return a JWT access token | No |
| POST | `/api/users` | Register a new user | No |
| GET | `/api/users/me` | Get the authenticated user | Yes |
| PATCH | `/api/users/me` | Update user information | Yes |
| PATCH | `/api/users/me/password` | Update the current user's password | Yes |
| DELETE | `/api/users/me` | Delete the authenticated user | Yes |
| POST | `/api/contacts` | Create a new contact | Yes |
| GET | `/api/contacts` | List all contacts owned by the authenticated user | Yes |
| GET | `/api/contacts/:id` | Get a contact by id | Yes |
| PUT | `/api/contacts/:id` | Replace a contact | Yes |
| DELETE | `/api/contacts/:id` | Delete a contact | Yes |

---

# Architecture

The project follows a **modular layered architecture** inspired by Clean Architecture principles.

Each feature is organized into four layers:

- **Application** – application use cases.
- **Domain** – business contracts and abstractions.
- **Infrastructure** – external implementations such as Prisma repositories.
- **Presentation** – HTTP layer (controllers and DTOs).

This separation keeps business rules isolated from framework-specific code, improving maintainability, scalability and testability.

---

# Project Structure

```text
prisma/
├── migrations/
└── schema.prisma

src/
├── config/
├── crypto/
├── database/
├── decorators/
├── env/
├── generated/
│   └── prisma/
├── guards/
├── modules/
│   ├── auth/
│   ├── contacts/
│   └── users/
│       ├── application/
│       ├── domain/
│       ├── infra/
│       ├── presentation/
│       │   ├── dtos/
│       │   └── users.controller.ts
│       └── users.module.ts
├── utils/
├── app.module.ts
└── main.ts

test/
```

The source code is organized by feature modules.

Each feature encapsulates its own business logic while shared infrastructure (configuration, database, crypto, authentication, etc.) remains isolated at the application level.

---

# License

This project is licensed under the MIT License.

---

# Author

**Leandro Vendemiatto Antunes**

GitHub: https://github.com/antuneslv