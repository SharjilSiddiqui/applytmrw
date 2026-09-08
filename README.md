# ApplyTMRW

A full-stack job and internship application tracking platform.

ApplyTMRW helps users organize job and internship opportunities, track application progress, manage application statuses, and stay on top of important follow-ups and reminders.

The project is built as a monorepo containing:

- A mobile application built with React Native and Expo
- A backend REST API built with NestJS
- A PostgreSQL database managed with Prisma ORM

---

## Features

### Authentication

- User registration
- User login
- Secure password hashing with bcrypt
- JWT-based authentication
- Protected API routes
- User-level data isolation

### Opportunities

- Create opportunities
- View all opportunities
- View a single opportunity
- Update opportunities
- Delete opportunities
- Track application status
- Store opportunity metadata
- Associate opportunities with individual users

### Reminders

The database model for reminders is available.

Reminder API and mobile functionality are currently under development.

Planned functionality includes:

- Application deadline reminders
- Follow-up reminders
- Interview reminders
- Custom reminders

---

# Tech Stack

## Mobile

- React Native
- Expo
- TypeScript

## Backend

- NestJS
- TypeScript
- Prisma ORM
- PostgreSQL

## Authentication

- JSON Web Tokens (JWT)
- Passport
- Passport JWT
- bcrypt

## Validation

- class-validator
- class-transformer

## Package Manager

- pnpm

---

# Project Structure

```text
apply-tmrw/
│
├── apps/
│   │
│   ├── api/                            # NestJS backend
│   │   │
│   │   ├── prisma/
│   │   │   ├── schema.prisma           # Database schema
│   │   │   └── migrations/             # Prisma migrations
│   │   │
│   │   ├── generated/
│   │   │   └── prisma/                 # Generated Prisma client
│   │   │
│   │   ├── src/
│   │   │   │
│   │   │   ├── auth/                   # Authentication module
│   │   │   │   ├── dto/
│   │   │   │   ├── guards/
│   │   │   │   ├── strategies/
│   │   │   │   ├── auth.controller.ts
│   │   │   │   ├── auth.module.ts
│   │   │   │   └── auth.service.ts
│   │   │   │
│   │   │   ├── opportunities/          # Opportunities module
│   │   │   │   ├── dto/
│   │   │   │   ├── opportunities.controller.ts
│   │   │   │   ├── opportunities.module.ts
│   │   │   │   └── opportunities.service.ts
│   │   │   │
│   │   │   ├── prisma/                 # Prisma service
│   │   │   │   ├── prisma.module.ts
│   │   │   │   └── prisma.service.ts
│   │   │   │
│   │   │   ├── app.controller.ts
│   │   │   ├── app.module.ts
│   │   │   ├── app.service.ts
│   │   │   └── main.ts
│   │   │
│   │   ├── .env
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── mobile/                         # Expo React Native application
│       │
│       ├── app/
│       ├── assets/
│       ├── package.json
│       └── ...
│
├── package.json
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
├── README.md
└── .gitignore
```

---

# Prerequisites

Before running the project, make sure the following software is installed.

## Node.js

Install Node.js.

Check your installation:

```bash
node --version
```

Recommended:

```text
Node.js 20+
```

---

## pnpm

This project uses pnpm as its package manager.

Install pnpm:

```bash
npm install -g pnpm
```

Verify the installation:

```bash
pnpm --version
```

---

## PostgreSQL

The backend requires a PostgreSQL database.

Install PostgreSQL and verify that it is running.

You can check your PostgreSQL installation with:

```bash
psql --version
```

Create a database for the project:

```sql
CREATE DATABASE applytmrw;
```

---

## Expo Go

To run the mobile application on a physical device, install Expo Go.

Download Expo Go from:

- Google Play Store for Android
- Apple App Store for iOS

---

# Installation

## 1. Clone the Repository

```bash
git clone <your-repository-url>
```

---

## 2. Navigate to the Project

```bash
cd apply-tmrw
```

---

## 3. Install Dependencies

Install all workspace dependencies:

```bash
pnpm install
```

---

# Environment Variables

The API requires environment variables for the database and JWT authentication.

Create the following file:

```text
apps/api/.env
```

Add:

```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/applytmrw"

JWT_SECRET="your-super-secret-jwt-key"

JWT_EXPIRES_IN="7d"
```

Replace:

```text
USER
PASSWORD
```

with your PostgreSQL credentials.

For example:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/applytmrw"

JWT_SECRET="replace-this-with-a-secure-secret"

JWT_EXPIRES_IN="7d"
```

---

## Generate a Secure JWT Secret

You can generate a secure JWT secret using:

```bash
openssl rand -base64 32
```

Then add the generated value:

```env
JWT_SECRET="generated-secret-here"
```

> Never commit your `.env` file to Git.

---

# Database Setup

ApplyTMRW uses:

- PostgreSQL
- Prisma ORM

The Prisma schema is located at:

```text
apps/api/prisma/schema.prisma
```

---

## Generate the Prisma Client

From the project root:

```bash
pnpm --filter api prisma generate
```

This generates the Prisma client used by the NestJS backend.

---

## Run Database Migrations

Run:

```bash
pnpm --filter api prisma migrate dev
```

If you need to create a new migration:

```bash
pnpm --filter api prisma migrate dev --name migration_name
```

For example:

```bash
pnpm --filter api prisma migrate dev --name add_reminders
```

---

## Prisma Studio

Prisma Studio provides a graphical interface for viewing and editing database data.

Run:

```bash
pnpm --filter api prisma studio
```

Prisma Studio will open in your browser.

---

# Running the Project

From the root directory:

```bash
pnpm dev
```

This starts both applications:

- NestJS API
- Expo Metro Bundler

---

# Running the API

Run only the backend:

```bash
pnpm --filter api dev
```

The API runs locally at:

```text
http://localhost:3000
```

---

# Running the Mobile Application

Run only the Expo application:

```bash
pnpm --filter mobile dev
```

Expo will start the Metro Bundler and display a QR code.

Scan the QR code using:

- Expo Go on Android
- Camera / Expo Go on iOS

---

# API Documentation

The API currently runs at:

```text
http://localhost:3000
```

---

# Authentication

## Register

Create a new user account.

### Endpoint

```http
POST /auth/register
```

### Request Body

```json
{
  "email": "test@example.com",
  "password": "password123"
}
```

### Response

```json
{
  "accessToken": "JWT_TOKEN",
  "user": {
    "id": "USER_ID",
    "email": "test@example.com"
  }
}
```

---

## Login

Authenticate an existing user.

### Endpoint

```http
POST /auth/login
```

### Request Body

```json
{
  "email": "test@example.com",
  "password": "password123"
}
```

### Response

```json
{
  "accessToken": "JWT_TOKEN",
  "user": {
    "id": "USER_ID",
    "email": "test@example.com"
  }
}
```

---

# Authentication

Protected API routes require a JWT access token.

Include the token in the request header:

```http
Authorization: Bearer YOUR_ACCESS_TOKEN
```

Example:

```bash
curl http://localhost:3000/opportunities \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

Requests without a valid JWT token return:

```json
{
  "message": "Unauthorized",
  "statusCode": 401
}
```

---

# Opportunities API

All opportunity endpoints require authentication.

---

## Create Opportunity

Create a new job or internship opportunity.

### Endpoint

```http
POST /opportunities
```

### Request Headers

```http
Content-Type: application/json
Authorization: Bearer YOUR_ACCESS_TOKEN
```

### Request Body

```json
{
  "url": "https://www.linkedin.com/jobs/view/example",
  "source": "LINKEDIN",
  "title": "Software Engineer Intern",
  "company": "Example Company",
  "description": "Backend engineering internship opportunity",
  "status": "SAVED",
  "metadata": {
    "location": "Bengaluru",
    "salary": "₹30,000/month"
  }
}
```

### Example Response

```json
{
  "id": "OPPORTUNITY_ID",
  "userId": "USER_ID",
  "url": "https://www.linkedin.com/jobs/view/example",
  "source": "LINKEDIN",
  "title": "Software Engineer Intern",
  "company": "Example Company",
  "description": "Backend engineering internship opportunity",
  "status": "SAVED",
  "metadata": {
    "location": "Bengaluru",
    "salary": "₹30,000/month"
  },
  "createdAt": "2026-01-01T00:00:00.000Z",
  "updatedAt": "2026-01-01T00:00:00.000Z"
}
```

---

## Get All Opportunities

Returns all opportunities belonging to the authenticated user.

### Endpoint

```http
GET /opportunities
```

### Request Headers

```http
Authorization: Bearer YOUR_ACCESS_TOKEN
```

### Example Response

```json
[
  {
    "id": "OPPORTUNITY_ID",
    "userId": "USER_ID",
    "url": "https://www.linkedin.com/jobs/view/example",
    "source": "LINKEDIN",
    "title": "Software Engineer Intern",
    "company": "Example Company",
    "description": "Backend engineering internship opportunity",
    "status": "SAVED",
    "metadata": {
      "location": "Bengaluru"
    },
    "createdAt": "2026-01-01T00:00:00.000Z",
    "updatedAt": "2026-01-01T00:00:00.000Z"
  }
]
```

---

## Get One Opportunity

Returns a specific opportunity belonging to the authenticated user.

### Endpoint

```http
GET /opportunities/:id
```

### Example

```http
GET /opportunities/OPPORTUNITY_ID
```

### Request Headers

```http
Authorization: Bearer YOUR_ACCESS_TOKEN
```

If the opportunity does not exist or does not belong to the authenticated user:

```json
{
  "message": "Opportunity not found",
  "statusCode": 404
}
```

---

## Update Opportunity

Updates an existing opportunity.

### Endpoint

```http
PATCH /opportunities/:id
```

### Request Headers

```http
Content-Type: application/json
Authorization: Bearer YOUR_ACCESS_TOKEN
```

### Example Request

```json
{
  "status": "APPLIED"
}
```

Other fields can also be updated.

---

## Delete Opportunity

Deletes an opportunity.

### Endpoint

```http
DELETE /opportunities/:id
```

### Request Headers

```http
Authorization: Bearer YOUR_ACCESS_TOKEN
```

The opportunity must belong to the authenticated user.

---

# Opportunity Sources

The available opportunity sources are defined in the Prisma schema.

Examples may include:

```text
LINKEDIN
```

Additional sources can be added as the application evolves.

---

# Opportunity Status

The available statuses are defined in the Prisma schema.

Examples currently include:

```text
SAVED
APPLIED
```

Additional application stages may be added in the future, such as:

```text
INTERVIEWING
OFFERED
REJECTED
WITHDRAWN
```

---

# Example API Workflow

## 1. Register

```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

---

## 2. Login

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

Copy the returned:

```text
accessToken
```

---

## 3. Create an Opportunity

```bash
curl -X POST http://localhost:3000/opportunities \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "url": "https://www.linkedin.com/jobs/view/example",
    "source": "LINKEDIN",
    "title": "Software Engineer Intern",
    "company": "Example Company",
    "description": "Backend engineering internship opportunity",
    "status": "SAVED",
    "metadata": {
      "location": "Bengaluru"
    }
  }'
```

---

## 4. Get Opportunities

```bash
curl http://localhost:3000/opportunities \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## 5. Update an Opportunity

```bash
curl -X PATCH \
  http://localhost:3000/opportunities/OPPORTUNITY_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "status": "APPLIED"
  }'
```

---

## 6. Delete an Opportunity

```bash
curl -X DELETE \
  http://localhost:3000/opportunities/OPPORTUNITY_ID \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

# Security

ApplyTMRW currently implements several security measures.

---

## Password Security

User passwords are hashed using:

```text
bcrypt
```

Passwords are never stored in plain text.

---

## JWT Authentication

The API uses JSON Web Tokens for authentication.

After successful registration or login, the server returns an access token.

The token must be included in protected API requests.

```http
Authorization: Bearer YOUR_ACCESS_TOKEN
```

---

## Protected Routes

Opportunity routes are protected using a JWT authentication guard.

Requests without a valid JWT token receive:

```text
401 Unauthorized
```

---

## User-Level Data Isolation

Each opportunity is associated with a specific user.

Opportunity queries are scoped using the authenticated user's ID.

Conceptually:

```text
Authenticated User
        │
        ▼
      User ID
        │
        ▼
Filter Opportunities
        │
        ▼
Only User's Data
```

This prevents one user from accessing another user's opportunities simply by knowing an opportunity ID.

---

# Development Commands

## Install Dependencies

```bash
pnpm install
```

---

## Run Everything

```bash
pnpm dev
```

---

## Run API Only

```bash
pnpm --filter api dev
```

---

## Run Mobile Only

```bash
pnpm --filter mobile dev
```

---

## Generate Prisma Client

```bash
pnpm --filter api prisma generate
```

---

## Run Prisma Migration

```bash
pnpm --filter api prisma migrate dev
```

---

## Create a Named Migration

```bash
pnpm --filter api prisma migrate dev --name migration_name
```

---

## Open Prisma Studio

```bash
pnpm --filter api prisma studio
```

---

# Current Development Status

## Completed

### Project Setup

- [x] Monorepo setup
- [x] pnpm workspace configuration
- [x] Expo mobile application
- [x] NestJS backend API

### Database

- [x] PostgreSQL setup
- [x] Prisma ORM integration
- [x] Prisma schema
- [x] User database model
- [x] Opportunity database model
- [x] Reminder database model
- [x] Prisma client generation

### Authentication

- [x] User registration
- [x] User login
- [x] Password hashing with bcrypt
- [x] JWT generation
- [x] JWT authentication strategy
- [x] JWT authentication guard
- [x] Protected API routes

### Opportunities

- [x] Create opportunity
- [x] Get all user opportunities
- [x] Get one opportunity
- [x] Update opportunity
- [x] Delete opportunity
- [x] User-level opportunity isolation
- [x] API tested with curl

---

# In Progress

- [ ] Reminders API
- [ ] Mobile authentication screens
- [ ] Secure JWT storage in the mobile application
- [ ] Mobile API integration
- [ ] Opportunities mobile UI

---

# Planned Features

## Reminders

- [ ] Create reminders
- [ ] View reminders
- [ ] Update reminders
- [ ] Delete reminders
- [ ] Connect reminders to opportunities
- [ ] Follow-up reminders
- [ ] Application deadline reminders
- [ ] Interview reminders

## Mobile Application

- [ ] Registration screen
- [ ] Login screen
- [ ] Authentication state management
- [ ] Secure token storage
- [ ] Opportunities list
- [ ] Opportunity details
- [ ] Add opportunity screen
- [ ] Edit opportunity screen
- [ ] Reminder screens

## Notifications

- [ ] Local notifications
- [ ] Push notifications
- [ ] Application deadline notifications
- [ ] Follow-up notifications

## Application Tracking

- [ ] Interview tracking
- [ ] Offer tracking
- [ ] Rejection tracking
- [ ] Application notes
- [ ] Application timeline

## Analytics

- [ ] Total applications
- [ ] Applications by status
- [ ] Applications by company
- [ ] Applications by source
- [ ] Interview conversion rate
- [ ] Application statistics

## Search and Filtering

- [ ] Search opportunities
- [ ] Filter by status
- [ ] Filter by source
- [ ] Filter by company
- [ ] Sort opportunities

## User Management

- [ ] User profile
- [ ] Update profile
- [ ] Change password
- [ ] Account deletion

---

# Development Roadmap

```text
Project Setup
      │
      ▼
Database + Prisma
      │
      ▼
Authentication
      │
      ▼
Opportunities API
      │
      ▼
Reminders API
      │
      ▼
Mobile Authentication
      │
      ▼
Mobile API Integration
      │
      ▼
Opportunities UI
      │
      ▼
Reminders UI
      │
      ▼
Notifications
      │
      ▼
Analytics
```

---

# Environment Files

The following environment files should not be committed:

```text
.env
.env.local
.env.development
.env.production
```

A template file should be committed:

```text
.env.example
```

Example:

```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/applytmrw"

JWT_SECRET="replace-with-a-secure-secret"

JWT_EXPIRES_IN="7d"
```

---

# Git Workflow

Before making changes:

```bash
git checkout -b feature/feature-name
```

After making changes:

```bash
git status
```

Add files:

```bash
git add .
```

Create a commit:

```bash
git commit -m "feat: add feature name"
```

Push the branch:

```bash
git push origin feature/feature-name
```

Then open a pull request.

---

# Recommended Commit Convention

Use descriptive commit messages.

Examples:

```text
feat: add user authentication
feat: add opportunities CRUD API
feat: add reminders API
feat: add mobile login screen

fix: resolve JWT authentication issue
fix: handle opportunity ownership validation

docs: update README

refactor: improve authentication module structure

chore: update dependencies
```

---

# Troubleshooting

## Prisma Client Not Found

Run:

```bash
pnpm --filter api prisma generate
```

---

## Database Connection Error

Check that PostgreSQL is running.

Also verify:

```env
DATABASE_URL
```

in:

```text
apps/api/.env
```

---

## JWT Authentication Fails

Check that:

```env
JWT_SECRET
```

is defined.

Also ensure the same JWT secret is used by the authentication configuration and JWT strategy.

---

## Protected Route Returns 401

Make sure the request includes:

```http
Authorization: Bearer YOUR_ACCESS_TOKEN
```

Also verify that the token has not expired.

---

## bcrypt Installation Error

Some package managers may block dependency build scripts.

If pnpm reports an ignored build script for bcrypt, run:

```bash
pnpm approve-builds
```

Select:

```text
bcrypt
```

Then rebuild:

```bash
pnpm rebuild bcrypt
```

You can test bcrypt with:

```bash
pnpm --filter api exec node \
  -e "console.log(require('bcrypt').hashSync('test', 10))"
```

---

# Contributing

Contributions and improvements are welcome.

Before submitting changes:

1. Create a new branch.
2. Make your changes.
3. Test the application.
4. Ensure the API compiles successfully.
5. Commit your changes using descriptive commit messages.
6. Push the branch.
7. Open a pull request.

---

# License

This project is currently private.

---

# Author

Built as part of the ApplyTMRW project by SHARJIL SIDDIQUI.
