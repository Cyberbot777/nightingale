# Nightingale

**View Live Demo:** [https://nightingaleapp.ai](https://nightingaleapp.ai)  
**Demo Login:** `demo@nightingale.ai` / `demo123!`  
**Nightingale GPT Link (via navbar):** Accessible from the "AI Companion" link on the navigation bar

## Overview

`Nightingale` is a full-stack journaling app that combines private reflection with AI-generated feedback. Built with React, FastAPI, and PostgreSQL, it offers a secure and elegant user experience with dark-themed aesthetics and modern functionality. The backend is hosted on Render with a managed PostgreSQL database, while the frontend is deployed via Vercel for fast, global delivery.

## Features

- Journal Entries: Create, edit, and delete private entries with optional AI-generated feedback.
- Full Authentication System: Secure user registration, login, password reset, and token-based access control.
- Email Password Reset Flow: Complete email reset system with token generation, SendGrid integration, and secure password change.
- AI Rate Limiting: Free users can request 3 AI responses before being limited (OpenAI API usage controlled).
- Responsive UI: Mobile-friendly layout built with Tailwind CSS and dark-mode styling.
- Production Deployment: Frontend hosted on Vercel; backend and PostgreSQL hosted on Render.
- Pagination & Filtering: Journal entries are paginated and easy to browse.
- Nightingale GPT Link: A direct link to a ChatGPT-powered AI companion is included in the navbar under "AI Companion."

## Technologies

### Frontend
- React – Component-based frontend framework
- Vite – Lightweight build and dev environment
- Tailwind CSS – Utility-first CSS framework
- React Router – Handles client-side routing
- Email Link Routing – Supports secure token-based flows

### Backend
- FastAPI – Python web framework for fast APIs
- PostgreSQL – Render-hosted relational database
- SQLAlchemy – ORM for managing database models
- Pydantic / Pydantic Settings – Type-safe validation and config
- JWT (python-jose) – Secure authentication tokens
- SendGrid – Email delivery for password reset flows
- OpenAI API – AI-generated journaling feedback
- Alembic – Database migrations and schema versioning

### Deployment
- Render – Backend and PostgreSQL hosting
- Vercel – Frontend deployment with CI/CD
- GitHub – Source control and version tracking

## Skills Demonstrated
- Full-stack application architecture and deployment
- Secure authentication and token-based access
- Email password reset using tokens and expiration
- React state management and dynamic routing
- RESTful API design with FastAPI and PostgreSQL
- Environment variable and secret management
- Responsive UI design with Tailwind CSS
- Real-time debugging and error handling
- Deployment pipelines with GitHub, Render, and Vercel

## Usage Instructions

### 1. Access the Live App
- Visit: [https://nightingaleapp.ai](https://nightingaleapp.ai)
- Demo Login: `demo@nightingale.ai` / `demo123!`
- Try the GPT Assistant from the "AI Companion" link in the navigation bar
- Go to the Journal page to write, edit, or request AI feedback

### 2. Development Setup

```bash
git clone https://github.com/Cyberbot777/nightingale.git
cd nightingale

# Backend
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload

# Frontend
cd ../frontend
npm install
npm run dev
```

- Create `.env` files in both frontend and backend for secrets like:
  - `OPENAI_API_KEY`
  - `DATABASE_URL`
  - `SENDGRID_API_KEY`
  - `SENDGRID_FROM_EMAIL`

## Author

- Richard Hall  

## Timeline
 
- Last Updated: June 5, 2025  
