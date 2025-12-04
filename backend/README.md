# Backend - Fastify API Server

A TypeScript-based Fastify API server with integrated PostgreSQL database.

## Tech Stack

- **Framework**: [Fastify](https://fastify.dev/)
- **Language**: TypeScript
- **Database**: PostgreSQL 18.1 (via Docker)
- **Testing**: Vitest

## Prerequisites

- Node.js >= 18
- PNPM >= 8
- Docker and Docker Compose

## Getting Started

### 1. Install Dependencies

From the project root:

```bash
pnpm install
```

### 2. Set Up PostgreSQL Database

Copy the environment file:

```bash
cd backend
cp .env.example .env
```

Edit `.env` to customize your database credentials if needed.

Start the PostgreSQL database:

```bash
docker compose up -d
```

Verify the database is running:

```bash
docker compose ps
```

### 3. Development

Start the development server:

```bash
cd backend
pnpm dev
```

The server will run on http://localhost:3000 with hot reloading via `tsx watch`.

## Available Scripts

- `pnpm dev` - Start development server with hot reloading
- `pnpm build` - Compile TypeScript to `dist/`
- `pnpm start` - Run compiled server from `dist/`
- `pnpm test` - Run unit tests with Vitest
- `pnpm typecheck` - Run TypeScript type checking
- `pnpm lint` - Run ESLint
- `pnpm format` - Format code with Prettier

## Database Management

### Docker Commands

All Docker commands should be run from the `backend` directory:

```bash
# Start database
docker compose up -d

# Stop database
docker compose down

# View logs
docker compose logs postgres

# Access PostgreSQL CLI
docker compose exec postgres psql -U postgres -d level2gym

# Restart database
docker compose restart postgres
```

### Initialization Scripts

Place SQL scripts in `backend/init-scripts/` to run them automatically when the database is first created.

Example: `init-scripts/001-create-tables.sql`

Scripts run in alphabetical order. Prefix with numbers (001-, 002-, etc.) to control execution.

**Note**: Scripts only run on first database creation. To re-run:

```bash
docker compose down -v
docker compose up -d
```

### Connection String

The database connection string is configured in `.env`:

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/level2gym
```

## Project Structure

```
backend/
├── src/
│   ├── index.ts          # Server entry point
│   └── app.ts            # Fastify app factory
├── test/
│   └── *.test.ts         # Vitest unit tests
├── init-scripts/         # PostgreSQL initialization scripts
├── docker-compose.yml    # PostgreSQL Docker configuration
├── .env.example          # Environment variables template
├── .env                  # Your local environment (git-ignored)
├── package.json
└── tsconfig.json
```

## API Endpoints

- `GET /` - Health check endpoint
- `GET /health` - Server health status

## Testing

Run unit tests:

```bash
pnpm test
```

Tests use Fastify's built-in testing utilities (`app.inject()`) for route testing.

## Environment Variables

Copy `.env.example` to `.env` and configure:

```env
# PostgreSQL Configuration
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=level2gym

# Database connection string
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/level2gym
```

## Troubleshooting

### Port 3000 already in use

The backend runs on port 3000 by default. If you need to change it, update `src/index.ts`.

### Database connection issues

1. Verify PostgreSQL is running: `docker compose ps`
2. Check logs: `docker compose logs postgres`
3. Verify connection string in `.env` matches your configuration

### Docker volume issues

To reset the database completely:

```bash
docker compose down -v
docker volume rm backend_postgres_data
docker compose up -d
```

## Additional Resources

- See root `DOCKER_POSTGRES.md` for detailed PostgreSQL setup instructions
- See root `DEVELOPMENT.md` for overall project development guidelines
