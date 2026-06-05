# smriti

A modern blog platform with full-text search, Markdown editing, and user profiles. Explore blogs on any topic.

## Features

- **Full-text search** — PostgreSQL-powered `tsvector`/`tsquery` search with ranking and pagination
- **Markdown editing** — Write and preview blog posts with a rich Markdown editor
- **User authentication** — Email/password and username login via Better Auth
- **User profiles** — View a user's profile and their published blogs
- **Responsive design** — shadcn/ui components, mobile-friendly

## Tech Stack

| Category | Technology |
|---|---|
| **Frontend** | React, TypeScript, Vite, Tailwind CSS, shadcn/ui |
| **Backend** | Express, TypeScript, Prisma ORM |
| **Database** | PostgreSQL (Neon) |
| **Auth** | Better Auth (sessions, email/password, username) |
| **Markdown** | react-markdown, remark-gfm, react-markdown-editor-lite |

## Getting Started

```bash
# Clone the repository
git clone https://github.com/cdhananjay/smriti.git
cd smriti

# Copy environment files and configure
cp example.env .env
cp client/example.env client/.env
# Edit .env with your DATABASE_URL and BETTER_AUTH_* values

# Install dependencies, run migrations, and build
npm run build

# Start the production server
npm start
```

The production server runs on `http://localhost:3000` (serving the built frontend from Express).

## Development

Run the server and client separately for hot-reload.

### Server

```bash
cd server
npm run dev
```

Starts the Express API on port `3000` with `tsx --watch`.

### Client

```bash
cd client
npm run dev
```

Starts the Vite dev server on port `5173` with HMR. 

## Scripts

### Root

| Script | Description |
|---|---|
| `npm run build` | Install deps, run Prisma migrations, build server (tsup), build client (Vite) |
| `npm start` | Start production server (`node server/dist/index.js`) |

### Client

| Script | Description |
|---|---|
| `npm run dev` | Start Vite dev server with HMR |
| `npm run build` | Type-check and build for production |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |

### Server

| Script | Description |
|---|---|
| `npm run dev` | Start dev server with hot-reload (`tsx --watch`) |
| `npm run build` | Build with tsup |
| `npm run prisma:migrate` | Run pending Prisma migrations |

## Project Structure

```
smriti/
├── client/                  # React frontend (Vite + shadcn/ui)
│   ├── src/
│   │   ├── App.tsx          # Landing page with search hero
│   │   ├── BlogCreator.tsx  # Markdown editor for new posts
│   │   ├── BlogViewer.tsx   # Blog post renderer
│   │   ├── Login.tsx        # Login page
│   │   ├── Signup.tsx       # Signup page
│   │   ├── Profile.tsx      # User profile page
│   │   ├── main.tsx         # App entry + React Router
│   │   └── components/      # Reusable components
│   ├── public/
│   ├── index.html
│   └── vite.config.ts
├── server/                  # Express backend (TypeScript + Prisma)
│   ├── public/index.html    # generated after client build
│   ├── dist/index.js        # generated after server build
│   ├── src/
│   │   ├── index.ts         # Express server entry
│   │   ├── controllers/     # Route handlers
│   │   ├── routes/          # API route definitions
│   │   ├── middlewares/      # Auth middleware
│   │   └── lib/             # Auth & Prisma clients
│   ├── prisma/
│   │   ├── schema.prisma    # Database schema
│   │   └── migrations/      # Prisma migrations
│   └── tsup.config.ts
├── .env                     # Environment variables
├── example.env              # Environment template
└── package.json             # Root orchestration
```

## API Routes

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/api/blog/new` | Yes | Create a new blog post |
| DELETE | `/api/blog/delete/:slug` | Yes | Delete own blog by slug |
| GET | `/api/blog/view/:slug` | No | View a blog post |
| GET | `/api/blog/search?query=&page=&limit=` | No | Full-text search with pagination |
| GET | `/api/user/info/:username` | No | Get user profile info |
| GET | `/api/user/blogs/:username?page=&limit=` | No | List user's blogs |
| ALL | `/api/auth/{*any}` | — | Better Auth endpoints |

## Environment Variables

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `BETTER_AUTH_SECRET` | Secret for Better Auth session signing |
| `BETTER_AUTH_URL` | Base URL of the app (e.g. `http://localhost:3000`) |
| `PORT` | Server port (default: `3000`) |
| `MODE` | `development` or `production` |

## Database

The PostgreSQL schema includes five models: `Blog`, `User`, `Session`, `Account`, and `Verification`. Full-text search is powered by a GIN index on `to_tsvector('english', title || ' ' || content)` with `ts_rank` for result ranking.