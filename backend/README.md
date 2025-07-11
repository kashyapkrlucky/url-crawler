# URL Crawler Backend

This is the backend service for the URL Crawler app, built with Go, Gin, and MySQL.

## Features

- REST API to add URLs for crawling
- Start/stop crawling URLs
- Store URL metadata and analysis results
- Connects to MySQL database using GORM ORM

## Prerequisites

- Go 1.20+
- MySQL server running
- [Optional] Docker (for future containerized setup)

## Setup & Run

1. Copy `.env.example` to `.env` and fill in your database credentials:

```
DB_USER=root
DB_PASSWORD=
DB_HOST=localhost
DB_PORT=3306
DB_NAME=url_crawler
JWT_SECRET=supersecretkey
RUNNING_IN_DOCKER=true

```

2. Run database migrations (auto via GORM on startup).

3. Run the server:

```bash
go run main.go
```

4. Server will start on port `8080`.

## API Endpoints

- `POST /api/add-url` — Add a new URL to crawl
- `GET /api/urls` — List URLs with pagination
- `POST /api/start-crawl/:id` — Start crawling a URL by ID
- `POST /api/stop-crawl/:id` — Stop crawling a URL by ID
- `GET /api/health` — Health check

## License

MIT
