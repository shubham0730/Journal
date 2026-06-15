# Journal/ Research Paper Publishing Platform

A full-stack Journal Management System designed to simplify the process of manuscript submission, review, and publication workflow management. The application provides dedicated interfaces for authors, reviewers, editors, and administrators to manage the complete journal publishing lifecycle.

## Overview

The Journal Management System enables authors to submit manuscripts, track publication status, reviewers to evaluate submissions, and editors to manage review decisions efficiently through a secure web-based platform.

The project follows a modern full-stack architecture with an Angular frontend and a Spring Boot backend secured using JWT authentication.

---

## Features

### Authentication & Authorization
- User registration and login
- JWT based authentication
- Access token and refresh token support
- Role based access control
- Secure logout functionality

### Author Module
- Author dashboard
- Submit manuscripts
- Upload research papers
- Track manuscript status
- View submitted publications
- Resubmission workflow

### Reviewer Module
- Reviewer dashboard
- Assigned manuscript review
- Paper evaluation workflow
- Review decision submission

### Editor Module
- Editor dashboard
- Manuscript management
- Reviewer assignment
- Publication decision handling
- Editorial board management

### Journal Management
- Current issue management
- Journal information pages
- Dynamic tables and pagination
- Document preview support
- Responsive UI

---

## Tech Stack

### Frontend

- Angular 15
- TypeScript
- Angular Material
- Bootstrap 5
- RxJS
- SCSS
- HTML5/CSS3

### Backend

- Java 17
- Spring Boot 3
- Spring Security
- Spring Data JPA
- Spring HATEOAS
- Hibernate
- JWT Authentication
- Lombok
- Gradle

### Database

- MySQL

---

## Project Architecture

```text
Journals
│
├── Frontend/
│   ├── src/
│   │   ├── app/
│   │   │
│   │   ├── authentication/
│   │   │   ├── login
│   │   │   ├── register
│   │   │   └── profile
│   │   │
│   │   ├── services/
│   │   ├── author-dashboard/
│   │   ├── reviewer-dashboard/
│   │   ├── editor-dashboard/
│   │   └── manuscript modules
│   │
│   ├── package.json
│   └── angular.json
│
└── Backend/
    ├── src/main/java/com/project
    │
    ├── controllers/
    ├── services/
    ├── repository/
    ├── entity/
    ├── configs/
    ├── utils/
    └── ProjectApplication.java
```

---

# Getting Started

## Prerequisites

Install the following:

- Node.js
- Angular CLI
- Java 17+
- MySQL
- Gradle

---

## Backend Setup

Navigate to backend:

```bash
cd Backend
```

Configure MySQL database:

Create a database:

```sql
CREATE DATABASE Journal;
```

Update database configuration:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/Journal
spring.datasource.username=your_username
spring.datasource.password=your_password
```

Run backend:

Linux/Mac:

```bash
./gradlew bootRun
```

Windows:

```bash
gradlew.bat bootRun
```

Backend runs on:

```text
http://localhost:8081
```

---

## Frontend Setup

Navigate to frontend:

```bash
cd Frontend
```

Install dependencies:

```bash
npm install
```

Start Angular application:

```bash
npm start
```

or

```bash
ng serve
```

Frontend runs on:

```text
http://localhost:4200
```

---

## API Security

The backend uses JWT authentication.

Authentication flow:

```text
User Login
     |
     ↓
Generate JWT Token
     |
     ↓
Attach token in requests
     |
     ↓
Spring Security validates token
     |
     ↓
Access protected APIs
```

---

## Main Modules

### Authentication APIs

- Register user
- Authenticate user
- Generate JWT tokens
- Refresh authentication
- Logout

### Manuscript Workflow

```text
Author
  |
  ↓
Submit Manuscript
  |
  ↓
Editor Review
  |
  ↓
Reviewer Assignment
  |
  ↓
Reviewer Feedback
  |
  ↓
Decision
  |
  ↓
Publication
```

---

## Screens / Components

- Home Screen
- Login Page
- Register Page
- Author Dashboard
- Reviewer Dashboard
- Editor Dashboard
- Manuscript Dashboard
- Upload Manuscript
- Current Issues
- Editorial Board
- User Profile

---

## Future Enhancements

- Email notification system
- Cloud document storage
- Advanced analytics dashboard
- Search and filtering improvements
- CI/CD deployment pipeline
- Docker containerization

