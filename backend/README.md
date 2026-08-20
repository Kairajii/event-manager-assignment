# Event Manager Backend

Express + TypeScript API backed by PostgreSQL, using raw SQL (`pg`) — no ORM.

## Structure

```
src/
  config/database.ts        # pg Pool + connectDB()
  db/schema.sql              # table definitions
  models/                    # raw SQL queries (event.model.ts, participant.model.ts)
  controllers/                # request/response handling
  routes/                     # Express routers
  validators/                 # zod schemas
  middlewares/errorHandling.ts
  utils/                      # CustomError, catchAsync
  app.ts                      # express app + middleware wiring
  index.ts                    # entrypoint
```

## Setup

1. Create a PostgreSQL database and apply the schema:

```bash
createdb event_manager
psql -d event_manager -f src/db/schema.sql
```

2. Copy `.env.example` to `.env` and fill in your DB credentials.

3. Install and run:

```bash
npm install
npm run dev
```

Server starts on `http://localhost:8080` (see `PORT` in `.env`).

## API

| Method | Route | Description |
|---|---|---|
| POST | `/api/events` | Create an event |
| GET | `/api/events` | List events (`?search=`, `?location=`, `?sort=asc\|desc`) |
| GET | `/api/events/:id` | Get one event |
| PUT | `/api/events/:id` | Update an event |
| DELETE | `/api/events/:id` | Delete an event |
| GET | `/api/events/:id/participants` | List participants (owner dashboard) |
| POST | `/api/events/:id/apply` | Apply/register for an event |
| PUT | `/api/events/:id/participants/:participantId/cancel` | Cancel a registration (with reason) |

All responses are shaped as `{ success, data }` or `{ success: false, message }`.
