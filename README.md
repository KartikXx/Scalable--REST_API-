# Task Management System

A full-stack task management app with JWT authentication & role-based access control. Users can register, login, and manage tasks (create, update, delete, filter by status).

## 🛠️ Tech Stack

| Component | Technology |
|-----------|-----------|
| Backend | Node.js 20+, Express.js |
| Database | PostgreSQL 12+ |
| Frontend | React 18+, Vite, Axios |
| Auth | JWT (access + refresh tokens) |
| API Docs | Swagger/OpenAPI |
| Deployment | Docker & Docker Compose |

## 🚀 Quick Start

### Option 1: Docker (Easiest)
```bash
cd /home/user/Desktop/task-frontend
docker-compose up
```
- Backend: http://localhost:3001
- Frontend: Start separately below
- API Docs: http://localhost:3001/api-docs

### Option 2: Local Development

**Terminal 1 - Backend:**
```bash
cd /home/user/Desktop/task-frontend/backend
npm install
npm run dev
# Runs on http://localhost:3001
```

**Terminal 2 - Frontend:**
```bash
cd /home/user/Desktop/task-frontend/frontend
npm install
npm run dev
# Runs on http://localhost:5173
```

**Database Setup:**
```bash
createdb task_management
psql task_management < /home/user/Desktop/task-frontend/database/init.sql
```

## 📋 API Endpoints

### Auth
- `POST /api/v1/auth/register` - Register user
- `POST /api/v1/auth/login` - Login (returns JWT)
- `POST /api/v1/auth/refresh` - Refresh token
- `POST /api/v1/auth/logout` - Logout

### Tasks (Protected)
- `GET /api/v1/tasks` - List user's tasks
- `POST /api/v1/tasks` - Create task
- `GET /api/v1/tasks/:id` - Get task
- `PUT /api/v1/tasks/:id` - Update task
- `DELETE /api/v1/tasks/:id` - Delete task

**Full API docs at:** http://localhost:3001/api-docs

## 🔑 Generate Test JWT Token

```bash
cd /home/user/Desktop/task-frontend
node generate-token.js 1 user@example.com user
```

## 📝 Key Notes

- **JWT Flow:** Access token (30 min) + refresh token (7 days, stored in httpOnly cookie)
- **Password Security:** bcryptjs hashing with 12 salt rounds
- **Input Validation:** All endpoints validate request data
- **Rate Limiting:** Login attempts limited to 5/15 min
- **Database:** Auto-indexed on email, user_id, created_at for performance
- **Error Handling:** Consistent JSON responses with status codes
- **CORS:** Configured for localhost:5173 (frontend)
- **Logging:** Morgan (HTTP) + Winston (app errors) to `/logs/`

## 🧪 Test Workflow

1. Register: `Email: test@example.com, Password: password123`
2. Login with credentials
3. Create/Edit/Delete tasks from dashboard
4. Check API logs in `backend/logs/`

## 📦 Project Structure

```
task-frontend/
├── backend/              # Express API
│   ├── src/
│   │   ├── config/      # DB, env, constants
│   │   ├── middleware/  # Auth, error handling
│   │   ├── controllers/ # Route handlers
│   │   ├── services/    # Business logic
│   │   ├── routes/      # API endpoints
│   │   └── utils/       # Validators, logging
│   └── .env
├── frontend/            # React Vite app
│   ├── src/
│   │   ├── components/  # UI components
│   │   ├── context/     # Auth/Task state
│   │   ├── utils/       # API client, constants
│   │   └── App.jsx
│   └── .env
├── database/
│   └── init.sql        # PostgreSQL schema
└── docker-compose.yml
```

## 🔐 Security

✅ JWT with signature verification  
✅ Parameterized SQL queries (no injection)  
✅ bcryptjs password hashing  
✅ Helmet security headers  
✅ CORS validation  
✅ Input sanitization  
✅ httpOnly cookies for refresh tokens  

## 📊 Database Tables

**Users:** id, email, password_hash, role (user/admin), timestamps  
**Tasks:** id, user_id, title, description, status (pending/in_progress/completed), priority (low/medium/high), timestamps

## ⚙️ Environment Variables

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

## 🐛 Common Issues

| Problem | Fix |
|---------|-----|
| Port 3001 taken | `lsof -i :3001` then kill process |
| DB connection error | Check `.env` DB settings, ensure PostgreSQL running |
| CORS error | Verify FRONTEND_URL in backend .env |
| Token expired immediately | Check JWT_ACCESS_EXPIRY format (should be `30m`) |

## 📚 Docs

- Full API: http://localhost:3001/api-docs (Swagger UI)
- Backend: [backend/README.md](backend/README.md) (if exists)
- Frontend: Standard React/Vite app

---

**Status:** Start with Docker or local dev setup above.
