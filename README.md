# ApplyTMRW

ApplyTMRW is a job opportunity tracking platform designed to help users organize, manage, and track their job applications in one place.

The project is being built as a full-stack application with a mobile client and a backend API.

The goal is to provide a simple and structured way for users to manage their job search process without losing track of opportunities, applications, and their progress.

---

# Table of Contents

- [Overview](#overview)
- [Project Goals](#project-goals)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Database Setup](#database-setup)
- [Running the Project](#running-the-project)
- [Applications](#applications)
- [Development](#development)
- [Current Features](#current-features)
- [Roadmap](#roadmap)

---

# Overview

Searching and applying for jobs often involves managing opportunities across multiple platforms.

Job opportunities may come from:

- LinkedIn
- Company career pages
- Job boards
- Referrals
- Emails
- Social media
- Personal networks

Keeping track of all these opportunities manually can quickly become difficult.

ApplyTMRW aims to solve this problem by providing a centralized platform where users can manage their job opportunities and track their application progress.

Users will be able to save opportunities and organize them based on their current application status.

For example:

```text
Saved
↓
Applied
↓
Interviewing
↓
Offer
```

The platform is being developed as a full-stack application consisting of a mobile client and a backend API.

---

# Project Goals

The primary goal of ApplyTMRW is to help users manage their job search process.

The platform aims to provide a centralized system where users can:

- Save job opportunities
- Store job links
- Track application status
- Organize opportunities from multiple sources
- Store company information
- Store job descriptions
- Manage their application pipeline
- Securely access their own data

The application should also provide a strong foundation for future features such as:

- Job reminders
- Application deadlines
- Interview tracking
- Resume management
- Analytics
- Notifications
- AI-powered features
- Job opportunity extraction
- Automated job tracking

---

# Architecture

ApplyTMRW is structured as a monorepo.

A monorepo allows multiple applications to live inside a single repository while sharing tooling and dependencies.

The current architecture consists of two primary applications:

```text
Mobile Application
        │
        │ HTTP Requests
        ▼
Backend API
        │
        │ Prisma ORM
        ▼
PostgreSQL Database
```

The mobile application communicates with the backend API.

The backend API is responsible for:

- Authentication
- Authorization
- Business logic
- Database access
- Data validation
- API contracts

The backend communicates with PostgreSQL through Prisma ORM.

---

# Tech Stack

## Backend

The backend API is built using:

- Node.js
- TypeScript
- NestJS
- Prisma ORM
- PostgreSQL
- JWT
- Passport
- bcrypt
- class-validator
- class-transformer

### NestJS

NestJS is used as the backend framework.

It provides a modular architecture based on:

- Modules
- Controllers
- Services
- Dependency Injection
- Guards
- Strategies

### Prisma

Prisma is used as the ORM.

It is responsible for:

- Database schema management
- Database migrations
- Type-safe database queries
- Prisma client generation

### PostgreSQL

PostgreSQL is used as the primary relational database.

### JWT

JSON Web Tokens are used for authentication.

After successful authentication, the API returns an access token.

Protected endpoints require the token to be sent using the following HTTP header:

```http
Authorization: Bearer <access_token>
```

### Passport

Passport is used for authentication strategies.

The API currently uses a JWT strategy for validating access tokens.

### bcrypt

Passwords are hashed using bcrypt before being stored in the database.

Plain text passwords are never stored.

---

## Mobile

The mobile application is built using:

- React Native
- Expo
- TypeScript

Expo provides the development environment and tooling for the React Native application.

---

## Tooling

The project uses:

- pnpm
- Turborepo
- TypeScript
- ESLint
- Prettier

### pnpm

pnpm is used as the package manager.

### Turborepo

Turborepo is used to manage and run tasks across the monorepo.

---

# Project Structure

The project currently follows the following structure:

```text
apply-tmrw/
│
├── apps/
│   │
│   ├── api/
│   │   ├── prisma/
│   │   │   └── schema.prisma
│   │   │
│   │   ├── src/
│   │   │   ├── auth/
│   │   │   ├── opportunities/
│   │   │   ├── prisma/
│   │   │   ├── app.controller.ts
│   │   │   ├── app.module.ts
│   │   │   ├── app.service.ts
│   │   │   └── main.ts
│   │   │
│   │   ├── .env
│   │   ├── .env.example
│   │   ├── package.json
│   │   └── README.md
│   │
│   └── mobile/
│       ├── app/
│       ├── components/
│       ├── package.json
│       └── ...
│
├── package.json
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
├── turbo.json
├── README.md
└── .gitignore
```

---

# Applications

The repository currently contains two primary applications.

---

## API

The backend API is located at:

```text
apps/api
```

The API is responsible for:

- User registration
- User authentication
- Password hashing
- JWT generation
- JWT validation
- Authorization
- Opportunity management
- Database access
- Data validation

Detailed backend documentation and API contracts are available in:

```text
apps/api/README.md
```

---

## Mobile

The mobile application is located at:

```text
apps/mobile
```

The mobile application is responsible for:

- User interface
- Authentication flows
- Communicating with the backend API
- Displaying opportunities
- Creating opportunities
- Updating opportunities
- Managing the user's application pipeline

The mobile application is built with:

- React Native
- Expo
- TypeScript

---

# Prerequisites

Before running the project, make sure the following tools are installed.

---

## Node.js

Node.js is required to run the project.

Recommended version:

```text
Node.js 20+
```

Check your installed version:

```bash
node --version
```

---

## pnpm

This project uses pnpm as the package manager.

Install pnpm globally:

```bash
npm install -g pnpm
```

Verify the installation:

```bash
pnpm --version
```

---

## PostgreSQL

A PostgreSQL database is required for the backend API.

You can use:

- A local PostgreSQL installation
- Docker
- A hosted PostgreSQL provider

The backend requires a PostgreSQL connection string.

Example:

```text
postgresql://USER:PASSWORD@HOST:PORT/DATABASE
```

---

# Getting Started

## 1. Clone the Repository

Clone the repository:

```bash
git clone <repository-url>
```

Move into the project directory:

```bash
cd apply-tmrw
```

---

## 2. Install Dependencies

Install dependencies for all workspace packages:

```bash
pnpm install
```

---

# Environment Variables

The backend API requires environment variables.

Create a local environment file.

From the project root:

```bash
cp apps/api/.env.example apps/api/.env
```

Alternatively, create the file manually:

```text
apps/api/.env
```

Example configuration:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"

JWT_SECRET="replace-with-a-secure-secret"

JWT_EXPIRES_IN="7d"
```

---

## Environment Variables

### DATABASE_URL

The PostgreSQL database connection string.

Example:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
```

---

### JWT_SECRET

The secret used to sign and verify JWT tokens.

Example:

```env
JWT_SECRET="your-secure-secret"
```

Use a strong and secure value.

Do not commit production secrets to version control.

---

### JWT_EXPIRES_IN

The duration for which an access token remains valid.

Example:

```env
JWT_EXPIRES_IN="7d"
```

---

# Database Setup

The backend uses Prisma ORM.

The Prisma schema is located at:

```text
apps/api/prisma/schema.prisma
```

---

## Generate the Prisma Client

Move to the API directory:

```bash
cd apps/api
```

Generate the Prisma client:

```bash
pnpm prisma generate
```

---

## Run Database Migrations

To create and apply migrations:

```bash
pnpm prisma migrate dev
```

This will:

- Create a migration
- Apply the migration
- Update the database schema
- Regenerate the Prisma client

---

## Push the Schema

During development, you may use:

```bash
pnpm prisma db push
```

This synchronizes the Prisma schema with the database.

For production environments, migrations should generally be preferred.

---

## Prisma Studio

Prisma Studio provides a graphical interface for viewing and editing database data.

Run:

```bash
pnpm prisma studio
```

Prisma Studio will start a local web interface.

---

# Running the Project

Return to the repository root:

```bash
cd ../..
```

Start the development environment:

```bash
pnpm dev
```

This starts the development tasks configured for the workspace.

Typically:

- The API runs on port `3000`
- Expo starts the Metro bundler

---

# Running Individual Applications

Depending on the configured workspace scripts, applications can also be started individually.

## API

From the project root:

```bash
pnpm --filter api dev
```

---

## Mobile

From the project root:

```bash
pnpm --filter mobile dev
```

---

# Development

The project uses a monorepo architecture.

This allows all applications to share:

- Dependencies
- TypeScript configuration
- Development tooling
- Build tooling

When adding a dependency to a specific application, use pnpm filters.

For example:

```bash
pnpm --filter api add <package-name>
```

For development dependencies:

```bash
pnpm --filter api add -D <package-name>
```

---

# Authentication

The backend currently supports JWT-based authentication.

The authentication flow is:

```text
User
  │
  │ Register / Login
  ▼
API
  │
  │ Validate credentials
  ▼
Generate JWT
  │
  ▼
Return Access Token
  │
  ▼
Client stores token
  │
  │ Authorization: Bearer <token>
  ▼
Protected API Routes
```

Passwords are hashed using bcrypt before being stored in the database.

The backend validates JWT tokens using Passport.

Authentication and authorization logic is handled by the API.

Detailed authentication contracts are documented in:

```text
apps/api/README.md
```

---

# Data Ownership

ApplyTMRW is designed around user-owned data.

A user should only be able to access their own resources.

For example:

```text
User A
│
├── Opportunity 1
├── Opportunity 2
└── Opportunity 3


User B
│
├── Opportunity 4
└── Opportunity 5
```

User A should not be able to access or modify User B's opportunities.

The backend enforces this through authenticated and user-scoped database queries.

---

# Current Features

The following backend features are currently implemented.

## Authentication

- User registration
- User login
- Password hashing
- Password validation
- JWT generation
- JWT authentication
- Protected routes

---

## Opportunities

- Create an opportunity
- Retrieve all user opportunities
- Retrieve a single opportunity
- Update an opportunity
- Delete an opportunity

All opportunity resources are scoped to the authenticated user.

---

## Validation

Request validation is implemented using:

- class-validator
- class-transformer

DTOs are used to validate incoming request data.

---

# Current Development Status

The project is currently under active development.

The backend foundation currently includes:

```text
Authentication
        │
        ├── Registration
        ├── Login
        ├── Password Hashing
        └── JWT Authentication

Opportunity Management
        │
        ├── Create
        ├── Read
        ├── Update
        └── Delete
```

The next development stages will focus on connecting the mobile application to the backend and expanding the application's functionality.

---

# Roadmap

The following features may be implemented in future versions.

## Authentication

- [x] User registration
- [x] User login
- [x] Password hashing
- [x] JWT authentication
- [ ] Refresh tokens
- [ ] Logout
- [ ] Password reset
- [ ] Email verification

---

## Opportunity Management

- [x] Create opportunity
- [x] Retrieve opportunities
- [x] Retrieve a single opportunity
- [x] Update opportunity
- [x] Delete opportunity
- [ ] Advanced filtering
- [ ] Search
- [ ] Sorting
- [ ] Pagination

---

## Application Tracking

- [ ] Application timeline
- [ ] Application deadlines
- [ ] Interview tracking
- [ ] Rejection tracking
- [ ] Offer tracking

---

## Notifications

- [ ] Application reminders
- [ ] Interview reminders
- [ ] Deadline reminders

---

## Analytics

- [ ] Application statistics
- [ ] Applications by status
- [ ] Applications by company
- [ ] Application success rate
- [ ] Job search insights

---

## AI Features

Potential AI-powered features may include:

- [ ] Job description analysis
- [ ] Resume matching
- [ ] Resume improvement suggestions
- [ ] Cover letter assistance
- [ ] Opportunity extraction
- [ ] Application insights

---

# API Documentation

Detailed API documentation is available in:

```text
apps/api/README.md
```

The API documentation contains:

- API overview
- Authentication details
- Authorization
- Endpoint contracts
- Request formats
- Response formats
- Opportunity models
- Error responses

---

# Security

The project follows several security practices.

## Passwords

Passwords are hashed using bcrypt.

Plain text passwords are never stored.

---

## Authentication

Protected endpoints require a valid JWT.

Tokens are sent using:

```http
Authorization: Bearer <access_token>
```

---

## Environment Variables

Secrets should be stored in environment variables.

Examples include:

- Database credentials
- JWT secrets
- API keys

Environment files should not be committed.

---

# Contributing

The project is currently under active development.

When contributing:

1. Create a new branch.
2. Make your changes.
3. Test the application.
4. Commit your changes.
5. Push the branch.
6. Create a pull request.

---

# License

This project is currently private.

A license may be added in the future.
