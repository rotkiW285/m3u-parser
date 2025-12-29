# M3U Parser & Proxy

A Node.js/Fastify web application designed to fetch, parse, and intelligently group M3U streams.

## Features

- **Proxy**: Retrieves M3U lists from an external source.
- **Smart Grouping**: Analyzes the `tvg-name` tag to group channels by specific prefixes (e.g., `PL:`, `IN:`, `US:`).
- **Caching**: Results are cached in memory (default: 10 minutes) to minimize external request traffic.
- **REST API**: Exposes playlists via HTTP endpoints.

## API

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/m3u` | Returns a JSON list of all available groups. |
| `GET` | `/m3u/:group_name` | Retrieves the `.m3u` playlist for a specific group (e.g., `/m3u/PL`). |

## Local Setup

**Prerequisites**: Node.js 18+

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the server:
   ```bash
   npm start
   ```
   The server listens on port `3000`.

## Docker Deployment (Recommended)

1. Start the container in detached mode:
   ```bash
   docker-compose up -d
   ```

2. View logs (optional):
   ```bash
   docker-compose logs -f
   ```

The application will be accessible at `http://localhost:3000`.

### Configuration (Environment Variables)

Configuration is managed via a `.env` file in the root directory or through environment variables. A sample `.env` file should be created based on requirements.

**Required Variables**:
- `SOURCE_URL`: The URL of the source M3U playlist.

**Optional Variables**:
- `PORT`: Server port (default: `3000`).
- `CACHE_TTL`: Cache duration in seconds (default: `600`).

In Docker Compose, these variables are automatically passed from the `.env` file or can be overridden in the `environment` section.

## License

MIT
