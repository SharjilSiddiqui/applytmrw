# ApplyTMRW API

The ApplyTMRW API is the backend service responsible for authentication, authorization, business logic, and database access.

The API is built with NestJS and uses PostgreSQL with Prisma ORM.

---

# Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Database](#database)
- [Running the API](#running-the-api)
- [Authentication](#authentication)
- [Authorization](#authorization)
- [API Contracts](#api-contracts)
- [Authentication Endpoints](#authentication-endpoints)
- [Opportunity Endpoints](#opportunity-endpoints)
- [Data Models](#data-models)
- [Validation](#validation)
- [Error Responses](#error-responses)
- [Security](#security)
- [Future Improvements](#future-improvements)

---

# Overview

The ApplyTMRW API provides the backend infrastructure for the ApplyTMRW application.

The API is responsible for:

- User registration
- User authentication
- Password hashing
- JWT generation
- JWT validation
- Authorization
- Opportunity management
- Database access
- Request validation
- User-scoped data access

The API follows a modular NestJS architecture.

---

# Tech Stack

The API uses the following technologies.

## Runtime

- Node.js

## Language

- TypeScript

## Framework

- NestJS

## Database

- PostgreSQL

## ORM

- Prisma

## Authentication

- JWT
- Passport
- passport-jwt

## Password Hashing

- bcrypt

## Validation

- class-validator
- class-transformer

---

# Architecture

The API follows a modular architecture.

```text
HTTP Request
      │
      ▼
Controller
      │
      ▼
Guard
      │
      ▼
Service
      │
      ▼
Prisma Service
      │
      ▼
PostgreSQL
```

Each layer has a specific responsibility.

---

## Controllers

Controllers are responsible for handling HTTP requests.

Examples:

```text
POST /auth/register
POST /auth/login

GET /opportunities
POST /opportunities
```

Controllers should remain lightweight.

Business logic should generally be handled by services.

---

## Services

Services contain the application's business logic.

Examples include:

- Registering users
- Validating credentials
- Generating JWT tokens
- Creating opportunities
- Updating opportunities
- Deleting opportunities

---

## Guards

Guards are responsible for controlling access to protected routes.

The API currently uses a JWT authentication guard.

Example:

```text
JwtAuthGuard
```

Protected routes require a valid JWT access token.

---

## Strategies

Passport strategies are responsible for validating authentication credentials.

The API currently uses:

```text
JwtStrategy
```

The JWT strategy extracts and validates the access token from incoming requests.

---

## Prisma

Prisma is responsible for communicating with PostgreSQL.

The API uses:

```text
PrismaService
```

Services use Prisma to perform database operations.

---

# Project Structure

The API structure currently follows this layout:

```text
apps/api/
│
├── prisma/
│   │
│   └── schema.prisma
│
├── src/
│   │
│   ├── auth/
│   │   │
│   │   ├── dto/
│   │   │   ├── login.dto.ts
│   │   │   └── register.dto.ts
│   │   │
│   │   ├── guards/
│   │   │   └── jwt-auth.guard.ts
│   │   │
│   │   ├── strategies/
│   │   │   └── jwt.strategy.ts
│   │   │
│   │   ├── auth.controller.ts
│   │   ├── auth.module.ts
│   │   └── auth.service.ts
│   │
│   ├── opportunities/
│   │   │
│   │   ├── dto/
│   │   │   ├── create-opportunity.dto.ts
│   │   │   └── update-opportunity.dto.ts
│   │   │
│   │   ├── opportunities.controller.ts
│   │   ├── opportunities.module.ts
│   │   └── opportunities.service.ts
│   │
│   ├── prisma/
│   │   ├── prisma.module.ts
│   │   └── prisma.service.ts
│   │
│   ├── app.controller.ts
│   ├── app.module.ts
│   ├── app.service.ts
│   └── main.ts
│
├── .env
├── .env.example
├── package.json
└── README.md
```

---

# Prerequisites

Before running the API, make sure the following tools are installed.

## Node.js

Recommended version:

```text
Node.js 20+
```

Check your version:

```bash
node --version
```

---

## pnpm

This project uses pnpm.

Install pnpm:

```bash
npm install -g pnpm
```

Verify:

```bash
pnpm --version
```

---

## PostgreSQL

A PostgreSQL database is required.

You can use:

- Local PostgreSQL
- Docker
- A cloud PostgreSQL provider

---

# Installation

From the repository root, install dependencies:

```bash
pnpm install
```

To add a dependency specifically to the API:

```bash
pnpm --filter api add <package-name>
```

For development dependencies:

```bash
pnpm --filter api add -D <package-name>
```

---

# Environment Variables

Create the following file:

```text
apps/api/.env
```

Example:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"

JWT_SECRET="replace-with-a-secure-secret"

JWT_EXPIRES_IN="7d"
```

---

## DATABASE_URL

The PostgreSQL connection string.

Example:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
```

---

## JWT_SECRET

The secret used to sign and validate JWT access tokens.

Example:

```env
JWT_SECRET="your-secure-secret"
```

This value should be secure.

Never expose production secrets.

---

## JWT_EXPIRES_IN

The JWT expiration duration.

Example:

```env
JWT_EXPIRES_IN="7d"
```

---

# Database

The API uses PostgreSQL through Prisma ORM.

The Prisma schema is located at:

```text
apps/api/prisma/schema.prisma
```

---

## Generate Prisma Client

From the API directory:

```bash
pnpm prisma generate
```

Or from the repository root:

```bash
pnpm --filter api prisma generate
```

---

## Create a Migration

To create a migration:

```bash
pnpm prisma migrate dev
```

This command:

- Creates a migration
- Applies the migration
- Updates the database schema
- Regenerates the Prisma client

---

## Push Schema

During development:

```bash
pnpm prisma db push
```

This synchronizes the Prisma schema with the database.

---

## Prisma Studio

Run:

```bash
pnpm prisma studio
```

Prisma Studio provides a graphical interface for viewing and managing database data.

---

# Running the API

From the repository root:

```bash
pnpm --filter api dev
```

The API runs in development mode.

By default, the API is available at:

```text
http://localhost:3000
```

---

# Authentication

The API uses JWT-based authentication.

The authentication flow is:

```text
Client
   │
   │ Email + Password
   ▼
Authentication Endpoint
   │
   ▼
Validate Credentials
   │
   ▼
Generate JWT
   │
   ▼
Return Access Token
   │
   ▼
Client Stores Token
   │
   │ Authorization: Bearer <token>
   ▼
Protected API Endpoint
```

---

# Password Security

Passwords are hashed using bcrypt.

The password flow is:

```text
Plain Password
       │
       ▼
bcrypt.hash()
       │
       ▼
Hashed Password
       │
       ▼
Database
```

During login:

```text
Plain Password
       │
       ▼
bcrypt.compare()
       │
       ▼
Authentication Result
```

Plain text passwords are never stored in the database.

---

# JWT Authentication

After successful registration or login, the API returns an access token.

Example response:

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6...",
  "user": {
    "id": "user-id",
    "email": "user@example.com"
  }
}
```

The token must be included when calling protected endpoints.

Example:

```http
Authorization: Bearer <access_token>
```

---

# Authorization

Protected endpoints use:

```text
JwtAuthGuard
```

The guard uses Passport to authenticate requests.

The JWT strategy:

1. Extracts the token from the Authorization header.
2. Validates the token signature.
3. Validates the token expiration.
4. Extracts the user information.
5. Attaches the authenticated user to the request.

---

# User-Scoped Resources

Opportunity resources belong to individual users.

The database relationship can be represented conceptually as:

```text
User
 │
 ├── Opportunity
 ├── Opportunity
 └── Opportunity
```

Users can only access their own opportunities.

For example:

```text
User A
│
├── Opportunity A1
└── Opportunity A2


User B
│
├── Opportunity B1
└── Opportunity B2
```

User A cannot access User B's opportunities.

This is enforced by querying resources using both:

```text
Opportunity ID
```

and:

```text
Authenticated User ID
```

---

# API Contracts

The API currently provides two primary resource groups:

```text
/auth
/opportunities
```

---

# Authentication Endpoints

---

## Register User

Creates a new user account.

### Endpoint

```http
POST /auth/register
```

### Authentication

Not required.

---

### Request Headers

```http
Content-Type: application/json
```

---

### Request Body

```json
{
  "email": "test@example.com",
  "password": "password123"
}
```

---

### Request Fields

| Field    | Type   | Required | Description        |
| -------- | ------ | -------- | ------------------ |
| email    | string | Yes      | User email address |
| password | string | Yes      | User password      |

---

### Successful Response

```http
201 Created
```

Example response:

```json
{
  "accessToken": "jwt-access-token",
  "user": {
    "id": "e01cd90e-7b8b-4a7f-a6f4-eb7bfee72862",
    "email": "test@example.com"
  }
}
```

---

### Possible Errors

#### Email Already Exists

```http
409 Conflict
```

Example:

```json
{
  "message": "Email already in use",
  "statusCode": 409
}
```

---

### Invalid Request

```http
400 Bad Request
```

Example:

```json
{
  "message": [
    "email must be an email",
    "password must be longer than or equal to 8 characters"
  ],
  "error": "Bad Request",
  "statusCode": 400
}
```

---

# Login User

Authenticates an existing user.

### Endpoint

```http
POST /auth/login
```

### Authentication

Not required.

---

### Request Headers

```http
Content-Type: application/json
```

---

### Request Body

```json
{
  "email": "test@example.com",
  "password": "password123"
}
```

---

### Request Fields

| Field    | Type   | Required | Description        |
| -------- | ------ | -------- | ------------------ |
| email    | string | Yes      | User email address |
| password | string | Yes      | User password      |

---

### Successful Response

```http
200 OK
```

Example:

```json
{
  "accessToken": "jwt-access-token",
  "user": {
    "id": "e01cd90e-7b8b-4a7f-a6f4-eb7bfee72862",
    "email": "test@example.com"
  }
}
```

---

### Invalid Credentials

```http
401 Unauthorized
```

Example:

```json
{
  "message": "Invalid credentials",
  "statusCode": 401
}
```

---

# Opportunity Endpoints

All opportunity endpoints require authentication.

The following header must be included:

```http
Authorization: Bearer <access_token>
```

---

# Create Opportunity

Creates a new opportunity for the authenticated user.

### Endpoint

```http
POST /opportunities
```

---

### Authentication

Required.

---

### Request Headers

```http
Content-Type: application/json
Authorization: Bearer <access_token>
```

---

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

---

### Request Fields

| Field       | Type   | Required | Description                       |
| ----------- | ------ | -------- | --------------------------------- |
| url         | string | Yes      | URL of the opportunity            |
| source      | enum   | No       | Source of the opportunity         |
| title       | string | No       | Job title                         |
| company     | string | No       | Company name                      |
| description | string | No       | Job description                   |
| status      | enum   | No       | Current application status        |
| metadata    | object | No       | Additional structured information |

---

### Successful Response

```http
201 Created
```

Example:

```json
{
  "id": "8f3c4381-95af-45b2-87ec-a1e99ddb779a",
  "userId": "e01cd90e-7b8b-4a7f-a6f4-eb7bfee72862",
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
  "createdAt": "2026-09-08T22:36:24.953Z",
  "updatedAt": "2026-09-08T22:36:24.953Z"
}
```

---

# Get All Opportunities

Returns all opportunities belonging to the authenticated user.

### Endpoint

```http
GET /opportunities
```

---

### Authentication

Required.

---

### Request Headers

```http
Authorization: Bearer <access_token>
```

---

### Successful Response

```http
200 OK
```

Example:

```json
[
  {
    "id": "8f3c4381-95af-45b2-87ec-a1e99ddb779a",
    "userId": "e01cd90e-7b8b-4a7f-a6f4-eb7bfee72862",
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
    "createdAt": "2026-09-08T22:36:24.953Z",
    "updatedAt": "2026-09-08T22:36:24.953Z"
  }
]
```

---

# Get Opportunity

Returns a single opportunity belonging to the authenticated user.

### Endpoint

```http
GET /opportunities/:id
```

Example:

```http
GET /opportunities/8f3c4381-95af-45b2-87ec-a1e99ddb779a
```

---

### Authentication

Required.

---

### Request Headers

```http
Authorization: Bearer <access_token>
```

---

### Successful Response

```http
200 OK
```

Example:

```json
{
  "id": "8f3c4381-95af-45b2-87ec-a1e99ddb779a",
  "userId": "e01cd90e-7b8b-4a7f-a6f4-eb7bfee72862",
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
  "createdAt": "2026-09-08T22:36:24.953Z",
  "updatedAt": "2026-09-08T22:36:24.953Z"
}
```

---

### Opportunity Not Found

```http
404 Not Found
```

Example:

```json
{
  "message": "Opportunity not found",
  "error": "Not Found",
  "statusCode": 404
}
```

---

# Update Opportunity

Updates an existing opportunity.

### Endpoint

```http
PATCH /opportunities/:id
```

Example:

```http
PATCH /opportunities/8f3c4381-95af-45b2-87ec-a1e99ddb779a
```

---

### Authentication

Required.

---

### Request Headers

```http
Content-Type: application/json
Authorization: Bearer <access_token>
```

---

### Request Body

Only the fields that need to be updated should be included.

Example:

```json
{
  "status": "APPLIED"
}
```

Another example:

```json
{
  "title": "Software Engineer Intern",
  "company": "Updated Company"
}
```

---

### Successful Response

```http
200 OK
```

Example:

```json
{
  "id": "8f3c4381-95af-45b2-87ec-a1e99ddb779a",
  "userId": "e01cd90e-7b8b-4a7f-a6f4-eb7bfee72862",
  "url": "https://www.linkedin.com/jobs/view/example",
  "source": "LINKEDIN",
  "title": "Software Engineer Intern",
  "company": "Example Company",
  "description": "Backend engineering internship opportunity",
  "status": "APPLIED",
  "metadata": {
    "location": "Bengaluru",
    "salary": "₹30,000/month"
  },
  "createdAt": "2026-09-08T22:36:24.953Z",
  "updatedAt": "2026-09-08T22:38:08.508Z"
}
```

---

### Opportunity Not Found

```http
404 Not Found
```

Example:

```json
{
  "message": "Opportunity not found",
  "error": "Not Found",
  "statusCode": 404
}
```

---

# Delete Opportunity

Deletes an opportunity belonging to the authenticated user.

### Endpoint

```http
DELETE /opportunities/:id
```

Example:

```http
DELETE /opportunities/8f3c4381-95af-45b2-87ec-a1e99ddb779a
```

---

### Authentication

Required.

---

### Request Headers

```http
Authorization: Bearer <access_token>
```

---

### Successful Response

```http
200 OK
```

Example:

```json
{
  "id": "8f3c4381-95af-45b2-87ec-a1e99ddb779a",
  "userId": "e01cd90e-7b8b-4a7f-a6f4-eb7bfee72862",
  "url": "https://www.linkedin.com/jobs/view/example",
  "source": "LINKEDIN",
  "title": "Software Engineer Intern",
  "company": "Example Company",
  "description": "Backend engineering internship opportunity",
  "status": "APPLIED",
  "metadata": {
    "location": "Bengaluru",
    "salary": "₹30,000/month"
  },
  "createdAt": "2026-09-08T22:36:24.953Z",
  "updatedAt": "2026-09-08T22:38:08.508Z"
}
```

---

### Opportunity Not Found

```http
404 Not Found
```

Example:

```json
{
  "message": "Opportunity not found",
  "error": "Not Found",
  "statusCode": 404
}
```

---

# Data Models

The API currently uses two primary models.

---

## User

Conceptually:

```text
User
├── id
├── email
├── password
├── createdAt
└── updatedAt
```

A user owns one or more opportunities.

---

## Opportunity

Conceptually:

```text
Opportunity
├── id
├── userId
├── url
├── source
├── title
├── company
├── description
├── status
├── metadata
├── createdAt
└── updatedAt
```

---

# Opportunity Source

The source represents where an opportunity originated.

Example:

```text
LINKEDIN
```

Additional sources may be added in the future.

Potential examples:

```text
LINKEDIN
INDEED
COMPANY_WEBSITE
REFERRAL
OTHER
```

The exact available values are defined by the Prisma schema.

---

# Opportunity Status

The status represents the user's current progress with an opportunity.

Examples currently used include:

```text
SAVED
APPLIED
```

Additional statuses may be added as the application evolves.

Potential statuses include:

```text
SAVED
APPLIED
SCREENING
INTERVIEWING
OFFER
REJECTED
WITHDRAWN
```

The exact available values are defined by the Prisma schema.

---

# Metadata

The metadata field allows additional structured information to be stored for an opportunity.

Example:

```json
{
  "location": "Bengaluru",
  "salary": "₹30,000/month"
}
```

Metadata can be used to store information that may not require a dedicated database column.

Possible examples:

```json
{
  "location": "Bengaluru",
  "salary": "₹30,000/month",
  "employmentType": "Internship",
  "experienceLevel": "Entry Level"
}
```

---

# Validation

Incoming requests are validated using:

- class-validator
- class-transformer

The API uses DTOs to define and validate request data.

Examples:

```text
RegisterDto
LoginDto
CreateOpportunityDto
UpdateOpportunityDto
```

---

# Create DTO

The create DTO defines the fields accepted when creating an opportunity.

Conceptually:

```text
CreateOpportunityDto
├── url
├── source
├── title
├── company
├── description
├── status
└── metadata
```

The authenticated user's ID is not provided by the client.

The API automatically determines the user from the JWT.

---

# Update DTO

The update DTO allows partial updates.

Conceptually:

```text
UpdateOpportunityDto
├── url?
├── source?
├── title?
├── company?
├── description?
├── status?
└── metadata?
```

Fields are optional.

Only the provided fields are updated.

---

# Error Responses

The API uses standard HTTP status codes.

---

## 400 Bad Request

Returned when the request data is invalid.

Example:

```json
{
  "message": ["email must be an email"],
  "error": "Bad Request",
  "statusCode": 400
}
```

---

## 401 Unauthorized

Returned when authentication fails or a protected endpoint is accessed without a valid token.

Example:

```json
{
  "message": "Unauthorized",
  "statusCode": 401
}
```

---

## 404 Not Found

Returned when a requested resource does not exist or does not belong to the authenticated user.

Example:

```json
{
  "message": "Opportunity not found",
  "error": "Not Found",
  "statusCode": 404
}
```

---

## 409 Conflict

Returned when attempting to create a resource that conflicts with existing data.

For example:

```text
Registering with an email address that already exists.
```

Example:

```json
{
  "message": "Email already in use",
  "statusCode": 409
}
```

---

# Example API Flow

The following demonstrates a typical application flow.

---

## Step 1: Register

```http
POST /auth/register
```

Request:

```json
{
  "email": "test@example.com",
  "password": "password123"
}
```

Response:

```json
{
  "accessToken": "jwt-token",
  "user": {
    "id": "user-id",
    "email": "test@example.com"
  }
}
```

---

## Step 2: Create an Opportunity

```http
POST /opportunities
```

Headers:

```http
Authorization: Bearer jwt-token
Content-Type: application/json
```

Request:

```json
{
  "url": "https://example.com/job",
  "source": "LINKEDIN",
  "title": "Software Engineer Intern",
  "company": "Example Company",
  "status": "SAVED"
}
```

---

## Step 3: Retrieve Opportunities

```http
GET /opportunities
```

Headers:

```http
Authorization: Bearer jwt-token
```

---

## Step 4: Update Opportunity

```http
PATCH /opportunities/:id
```

Headers:

```http
Authorization: Bearer jwt-token
Content-Type: application/json
```

Request:

```json
{
  "status": "APPLIED"
}
```

---

## Step 5: Delete Opportunity

```http
DELETE /opportunities/:id
```

Headers:

```http
Authorization: Bearer jwt-token
```

---

# Security

The API currently implements several security practices.

---

## Password Hashing

Passwords are hashed using bcrypt.

Plain text passwords are never stored.

---

## JWT Authentication

Protected routes require a valid JWT.

Tokens are sent through the Authorization header:

```http
Authorization: Bearer <access_token>
```

---

## User Data Isolation

Database queries are scoped to the authenticated user.

Users cannot access another user's opportunities.

---

## Environment Variables

Sensitive configuration values are stored in environment variables.

Examples:

```text
DATABASE_URL
JWT_SECRET
JWT_EXPIRES_IN
```

Environment files should not be committed.

---

# Future Improvements

The API foundation is currently focused on authentication and opportunity management.

Potential future improvements include:

---

## Authentication

- [x] Registration
- [x] Login
- [x] Password hashing
- [x] JWT authentication
- [ ] Refresh tokens
- [ ] Token rotation
- [ ] Logout
- [ ] Password reset
- [ ] Email verification
- [ ] OAuth authentication

---

## Opportunities

- [x] Create
- [x] Read
- [x] Update
- [x] Delete
- [ ] Pagination
- [ ] Filtering
- [ ] Search
- [ ] Sorting

---

## Application Tracking

- [ ] Application history
- [ ] Status history
- [ ] Interview tracking
- [ ] Offer tracking
- [ ] Rejection tracking
- [ ] Deadlines

---

## API Improvements

- [ ] API versioning
- [ ] Swagger / OpenAPI documentation
- [ ] Rate limiting
- [ ] Structured logging
- [ ] Request tracing
- [ ] Health checks
- [ ] Caching
- [ ] Background jobs

---

## Testing

Future testing may include:

- [ ] Unit tests
- [ ] Integration tests
- [ ] End-to-end tests
- [ ] Authentication tests
- [ ] Authorization tests

---

# Development Principles

The API follows several general principles.

## Modular Architecture

Features should be organized into modules.

Example:

```text
auth/
opportunities/
users/
notifications/
```

---

## Separation of Concerns

Controllers handle HTTP requests.

Services handle business logic.

Prisma handles database access.

Guards handle authorization.

Strategies handle authentication.

---

## Validation

Incoming data should be validated using DTOs.

Client input should not be trusted.

---

## Authorization

Users should only be able to access resources they own.

Ownership should always be verified on protected resources.

---

## Security

Sensitive values should be stored in environment variables.

Passwords should always be hashed.

Protected endpoints should require authentication.

---

# Current Status

The API currently supports:

```text
Authentication
│
├── User Registration
├── User Login
├── Password Hashing
├── JWT Generation
└── JWT Authentication


Opportunities
│
├── Create Opportunity
├── Get All Opportunities
├── Get Opportunity
├── Update Opportunity
└── Delete Opportunity
```

The backend foundation is now ready for the mobile application to integrate with the authentication and opportunity APIs.

---

# Related Documentation

For project-level documentation, see:

```text
../../README.md
```

The root README contains information about:

- Project goals
- Overall architecture
- Monorepo structure
- Mobile application
- Backend overview
- Setup instructions
- Project roadmap
