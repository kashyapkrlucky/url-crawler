# URL Crawler Frontend

React + TypeScript frontend for the URL Crawler app, built with Vite, Tailwind CSS, and lucide-react icons.

## Features

- Add URLs for crawling
- View list of URLs with pagination
- Start/stop crawling URLs
- Display URL crawl details and stats

## Prerequisites

- Node.js 18+
- npm

## Setup & Run

Install dependencies:

```bash
npm install
```

Run development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Build for Production

```bash
npm run build
```

## Environment Variables

- API base URL (default to `http://localhost:8080/api`)

Create a `.env` file if needed:

```
VITE_API_BASE_URL=http://localhost:8080/api
```

## License

MIT
