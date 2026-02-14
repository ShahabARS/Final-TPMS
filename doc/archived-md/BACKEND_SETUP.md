```markdown
# Complete Backend Setup Guide

## ✅ What's Been Created

### Backend Structure
```
backend/
├── config/
│   └── database.js          # MongoDB connection
├── middleware/
│   ├── auth.js             # JWT authentication
│   └── errorHandler.js     # Error handling
├── models/
│   ├── User.js             # User model
│   ├── Project.js          # Project model
│   ├── Task.js             # Task model
│   └── Comment.js          # Comment model
├── routes/
│   ├── auth.js             # Auth routes (login, register)
│   ├── projects.js         # Project routes
│   └── tasks.js            # Task routes (includes comments)
├── server.js               # Express server
├── package.json           # Dependencies
└── .env.example           # Environment variables template
```

### Frontend API Service
```
src/services/
└── api.ts                  # API service layer
```

---

## 🚀 Setup Steps

### Step 1: Install MongoDB

**Option A: Local MongoDB (Recommended for Presentation)**
1. Download: https://www.mongodb.com/try/download/community
2. Install MongoDB Community Server
3. MongoDB runs automatically on `localhost:27017`

**Option B: MongoDB Atlas (Cloud - Easier)**
1. Sign up: https://www.mongodb.com/cloud/atlas
2. Create free cluster
3. Get connection string

### Step 2: Setup Backend

```bash
# Navigate to backend folder
cd backend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env file with your MongoDB URI
# For local: MONGODB_URI=mongodb://localhost:27017/tpms
# For Atlas: MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/tpms
```

### Step 3: Start Backend Server

```bash
# In backend folder
npm run dev
```

You should see:
```
✅ MongoDB Connected: ...
🚀 Server running on port 5000
```

### Step 4: Test API

Use Postman, Thunder Client, or curl:

```bash
# Register a user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"password123","role":"LEADER"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'
```

---

## 📡 API Endpoints Summary

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Projects
- `GET /api/projects` - Get user's projects
- `GET /api/projects/:id` - Get project details
- `POST /api/projects` - Create project (Leader/Admin)
- `PUT /api/projects/:id` - Update project (Leader/Admin)
- `GET /api/projects/:id/members` - Get project members

### Tasks
- `GET /api/tasks?projectId=xxx` - Get project tasks
- `GET /api/tasks/:id` - Get task details
- `POST /api/tasks` - Create task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task
- `GET /api/tasks/:id/comments` - Get task comments
- `POST /api/tasks/:id/comments` - Add comment

---

## 🔗 Frontend Integration

The API service layer (`src/services/api.ts`) is ready to use:

```typescript
import { authApi, projectsApi, tasksApi } from './services/api';

// Login
const response = await authApi.login({ email, password });
setToken(response.token);

// Get projects
const projects = await projectsApi.getAll();

// Create task
const task = await tasksApi.create({
  projectId: '...',
  title: 'New Task',
  status: 'TODO',
});
```

---

## 🎯 Next Steps

1. ✅ Backend is ready
2. ✅ API service layer is ready
3. ⏭️ Connect React components to APIs (next step)

---

## 💡 Tips

- **For Presentation**: Use local MongoDB - it's more reliable
- **For Development**: MongoDB Atlas is easier (no installation)
- **Testing**: Use Postman or Thunder Client to test APIs first
- **Debugging**: Check server console for errors
- **CORS**: Make sure frontend URL matches `CORS_ORIGIN` in `.env`

---

**Backend is ready!** Next: Connect frontend components to APIs.

```
