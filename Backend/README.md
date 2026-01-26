# FastAPI SQLModel Async Example

This project is a FastAPI application using SQLModel with async support, PostgreSQL, repository pattern, service layer, and modular structure.

## Features
- FastAPI with async endpoints
- SQLModel for ORM and Pydantic models
- PostgreSQL database (asyncpg)
- Repository and service layers
- Modular project structure

## Getting Started
1. Install dependencies:
   ```sh
   pip install -r requirements.txt
   ```
2. Set your database URL in `.env` or `app/core/config.py`.
3. Run the app:
   ```sh
   uvicorn app.main:app --reload
   ```

## Project Structure
- `app/` - Main application code
- `app/models/` - SQLModel models
- `app/schemas/` - Pydantic schemas
- `app/repositories/` - Data access layer
- `app/services/` - Business logic layer
- `app/api/` - API routers
- `app/core/` - Config and DB setup

---
