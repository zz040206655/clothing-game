# Gemini Context: Clothing Game Project

This document provides a comprehensive overview of the "Clothing Game" project for AI-assisted development.

## Project Overview

This is a full-stack web application that implements a simple character dress-up game. Users can select clothing items from a wardrobe and see them applied to a character in real-time.

The project follows a classic client-server architecture:

*   **Backend:** A Golang application using the Gin framework. It serves a RESTful API to provide game data (characters, clothing items) and also acts as a static file server for images and the built frontend application.
*   **Frontend:** A React single-page application (SPA) built with Vite and written in TypeScript. It handles all UI rendering and user interaction.

For development, the frontend and backend are run as separate processes. The Vite dev server proxies API and asset requests to the Go backend to handle CORS.

## Building and Running

### 1. Backend Server

The Go server provides the API and serves static files.

```bash
# Navigate to the backend directory
cd backend

# Run the server (listens on http://localhost:8080)
go run main.go
```

### 2. Frontend Server

The React app is served by the Vite development server.

```bash
# Navigate to the frontend directory
cd frontend

# Install dependencies if you haven't already
# npm install

# Run the dev server (accessible at http://localhost:5173)
npm run dev
```

### 3. Accessing the Application

Open a web browser and go to `http://localhost:5173`.

## Development Conventions

*   **API:** The backend exposes a versioned REST API under the `/api/v1/` prefix. All data is exchanged in JSON format.
    *   `GET /api/v1/clothing-items`: Fetches all available clothing pieces.
    *   `GET /api/v1/characters`: Fetches all available characters.
*   **Data:** Currently, all game data is hardcoded in `backend/main.go`. There is no database connection.
*   **Assets:** All static image assets are located in the root `/assets` directory and served by the backend at the `/assets/` URL path.
    *   Images are organized by type (e.g., `/assets/images/tops/`, `/assets/images/hair/`).
    *   **Crucially, all clothing and character images are expected to have the same canvas dimensions to ensure correct visual alignment.**
*   **Styling:** Frontend styling is done via standard CSS in `frontend/src/App.css`.
*   **State Management:** Frontend state is managed locally within React components using hooks (`useState`, `useEffect`). There is no external state management library like Redux.
*   **Code Structure:**
    *   The main backend logic is in `backend/main.go`.
    *   The main frontend logic, including all sub-components, is currently in `frontend/src/App.tsx`.
