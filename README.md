# Nightingale

**View Live Demo: [https://nightingale-sigma.vercel.app](https://nightingale-sigma.vercel.app)**

## Overview
`Nightingale` is a full-stack journaling app that combines private reflection with AI-generated feedback. Built with React, FastAPI, and PostgreSQL, it offers a secure and elegant user experience with dark-themed aesthetics and modern functionality. The backend is hosted on Render with a managed PostgreSQL database, while the frontend is deployed via Vercel for fast, global delivery.

## Features
- **Home & About Pages:** Smooth scroll experience, animated transitions, and a Florence Nightingale-inspired theme using Tailwind CSS.
- **Journal Page:** Allows users to write and submit private journal entries with AI-generated feedback powered by OpenAI.
- **Authentication System:** Includes user registration and login with JWT-based token security.
- **Access Control:** Protects AI functionality and routes behind authentication.
- **Demo Account:** COMMING SOON! Provides a demo login (`demo/demo123!`) for recruiters or testing without registration.
- **AI Rate Limiting:** Restricts users to 3 free AI feedback submissions to control OpenAI API usage.
- **Responsive Design:** Fully mobile-optimized interface with consistent layout across screen sizes.
- **Deployment & Hosting:** Backend is hosted with Render (including the PostgreSQL database), and frontend is deployed using Vercel.

## Technologies
- **Frontend**:
  - **React**: Framework for building dynamic user interfaces.
  - **Vite**: Lightning-fast dev environment.
  - **Tailwind CSS**: Utility-first styling.
  - **React Router**: Handles multi-page routing.

- **Backend**:
  - **FastAPI**: Python web framework for fast APIs.
  - **PostgreSQL**: Render-hosted relational database.
  - **SQLAlchemy**: ORM for database models.
  - **Pydantic / Pydantic Settings**: Type-safe request validation.
  - **JWT (python-jose)**: Secure authentication.
  - **OpenAI**: AI feedback integration using the latest API version.

- **Deployment**:
  - **Render**: Backend & DB hosting.
  - **Vercel**: Frontend deployment with continuous integration.
  - **GitHub**: Source code management and CI.

## Skills Demonstrated
- Full-stack application architecture and deployment
- Secure user authentication and token management
- RESTful API design with FastAPI and PostgreSQL
- Tailwind CSS design for responsive user interfaces
- Git/GitHub version control with remote push configuration
- API integration with OpenAI and rate limiting
- Debugging CORS, environment variables, and cloud hosting issues

## Usage Instructions
1. **Access the Web App**:
   - Visit the live app: [https://nightingale-sigma.vercel.app](https://nightingale-sigma.vercel.app)
   - Register or use the demo account (`demo/demo123!`) to log in.
   - Navigate to the Journal page to write and submit an entry.

2. **AI Feedback**:
   - Submit a journal entry to receive reflective AI feedback.
   - Each user has a limit of 3 free entries.

3. **Development Setup**:
   - Clone the repository: `git clone https://github.com/Cyberbot777/nightingale.git`
   - Navigate to the backend and frontend folders to install dependencies.
   - Backend: `uvicorn main:app --reload`
   - Frontend: `npm run dev`
   - Environment Variables must be set locally for OpenAI and PostgreSQL URLs.

## Author
- Richard Hall

## Date
- Created: May 25, 2025  
- Last Updated: May 30, 2025
