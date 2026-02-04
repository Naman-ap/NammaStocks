# FastAPI Project - Domain-Driven Architecture

This FastAPI project follows a domain-driven design pattern with modular architecture.

## Project Structure

```
src/
├── items/              # Items domain module
│   ├── router.py       # API endpoints
│   ├── schemas.py      # Pydantic models
│   ├── models.py       # Database models
│   ├── service.py      # Business logic
│   ├── repository.py   # Database operations
│   ├── dependencies.py # Route dependencies
│   ├── config.py       # Domain configuration
│   ├── constants.py    # Constants and error codes
│   ├── exceptions.py   # Domain-specific exceptions
│   └── utils.py        # Helper functions
├── config.py           # Global configuration
├── models.py           # Global models
├── exceptions.py       # Global exceptions
├── database.py         # Database connection
└── main.py             # FastAPI app initialization
```

## Setup

1. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Create `.env` file from `.env.example`:
```bash
cp .env.example .env
```

4. Update database connection in `.env` file

5. Run the application:
```bash
uvicorn src.main:app --reload
```

## Database Setup

Make sure PostgreSQL is running and accessible with the credentials in your `.env` file.

The application will automatically create tables on startup.

## API Documentation

Once the server is running, visit:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Available Endpoints

### Items
- `POST /api/v1/items/` - Create a new item
- `GET /api/v1/items/` - List all items (with pagination)
- `GET /api/v1/items/{item_id}` - Get item by ID
- `PATCH /api/v1/items/{item_id}` - Update an item
- `DELETE /api/v1/items/{item_id}` - Delete an item

### Health Check
- `GET /health` - Health check endpoint

## Adding New Domains

To add a new domain (e.g., `users`), create a new folder under `src/` with the following structure:

```
src/users/
├── router.py
├── schemas.py
├── models.py
├── service.py
├── repository.py
├── dependencies.py
├── config.py
├── constants.py
├── exceptions.py
└── utils.py
```

Then register the router in `src/main.py`:

```python
from src.users.router import router as users_router
app.include_router(users_router, prefix=settings.API_V1_PREFIX)
```

## Architecture Benefits

- **Separation of Concerns**: Each layer has a specific responsibility
- **Modularity**: Domains are self-contained and independent
- **Testability**: Easy to unit test individual components
- **Scalability**: Easy to add new features and domains
- **Maintainability**: Clear structure makes code easy to navigate
