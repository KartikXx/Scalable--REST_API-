# Task Management System

A full-stack task management app with JWT authentication and role-based access control. Users can register, login, and manage tasks (create, update, delete, filter by status).

## Tech Stack

| Component | Technology |
|-----------|-----------|
| Backend | Node.js 20+, Express.js |
| Database | PostgreSQL 12+ |
| Frontend | React 18+, Vite, Axios |
| Auth | JWT (access + refresh tokens) |
| API Docs | Swagger/OpenAPI |
| Deployment | Docker & Docker Compose |

## Quick Start

### Option 1: Docker
```bash
cd /home/user/Desktop/task-frontend
docker-compose up
```
- Backend: http://localhost:3001
- API Docs: http://localhost:3001/api-docs

### Option 2: Local Development

Terminal 1 - Backend:
```bash
cd /home/user/Desktop/task-frontend/backend
npm install
npm run dev
```

Terminal 2 - Frontend:
```bash
cd /home/user/Desktop/task-frontend/frontend
npm install
npm run dev
```

Database setup:
```bash
createdb task_management
psql task_management < /home/user/Desktop/task-frontend/database/init.sql
```

## API Endpoints

Auth:
- `POST /api/v1/auth/register` - Register user
- `POST /api/v1/auth/login` - Login (returns JWT)
- `POST /api/v1/auth/refresh` - Refresh token
- `POST /api/v1/auth/logout` - Logout

Tasks (protected):
- `GET /api/v1/tasks` - List user's tasks
- `POST /api/v1/tasks` - Create task
- `GET /api/v1/tasks/:id` - Get task
- `PUT /api/v1/tasks/:id` - Update task
- `DELETE /api/v1/tasks/:id` - Delete task

Full API docs: http://localhost:3001/api-docs

## Generate Test JWT Token

```bash
cd /home/user/Desktop/task-frontend
node generate-token.js 1 user@example.com user
```

## Key Notes

- JWT access token (30 min) and refresh token (7 days, httpOnly cookie)
- bcryptjs password hashing with 12 salt rounds
- Input validation on all endpoints
- Login attempts limited to 5 per 15 minutes
- Indexes on email, user_id, created_at
- Morgan HTTP logs and Winston app logs in `logs/`
- CORS configured for http://localhost:5173

## Test Workflow

1. Register: email `test@example.com`, password `password123`
2. Login with credentials
3. Create, edit, delete tasks from the UI
4. Check logs in `backend/logs/`

## Project Structure

```
task-frontend/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── middleware/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── routes/
│   │   └── utils/
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── utils/
│   │   └── App.jsx
│   └── .env
├── database/
│   └── init.sql
└── docker-compose.yml
```

## Security

- JWT signature verification
- Parameterized SQL queries
- bcryptjs password hashing
- Helmet security headers
- CORS validation
- Input sanitization
- httpOnly cookies for refresh tokens

## Database Tables

Users: id, email, password_hash, role (user/admin), timestamps
Tasks: id, user_id, title, description, status (pending/in_progress/completed), priority (low/medium/high), timestamps

## Environment Variables

[backend/.env](backend/.env):
```
DB_HOST=localhost
DB_NAME=task_management
JWT_SECRET=<strong-key>
PORT=3001
```

[frontend/.env](frontend/.env):
```
VITE_API_BASE_URL=http://localhost:3001
```

## Common Issues

| Problem | Fix |
|---------|-----|
| Port 3001 taken | `lsof -i :3001` then kill process |
| DB connection error | Check `.env` DB settings, ensure PostgreSQL running |
| CORS error | Verify FRONTEND_URL in backend .env |
| Token expired immediately | Check JWT_ACCESS_EXPIRY format (should be `30m`) |

## Docs

- Full API: http://localhost:3001/api-docs
- Frontend: React/Vite app
