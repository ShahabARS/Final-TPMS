# Backend Setup Guide

## 🚀 Quick Start

### 1. Install MongoDB

**Option A: MongoDB Local (Windows)**
1. Download MongoDB Community Server: https://www.mongodb.com/try/download/community
2. Install MongoDB
3. MongoDB will run on `mongodb://localhost:27017` by default

**Option B: MongoDB Atlas (Cloud - Easier for Demo)**
1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create a free cluster
4. Get connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/tpms`)

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

### 3. Configure Environment Variables

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` file:
   ```env
   # For local MongoDB:
   MONGODB_URI=mongodb://localhost:27017/tpms
   
   # OR for MongoDB Atlas:
   # MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/tpms
   
   PORT=5000
   JWT_SECRET=your-super-secret-jwt-key-change-this
   CORS_ORIGIN=http://localhost:5173
   ```

### 4. Start MongoDB

**If using local MongoDB:**
- MongoDB should start automatically as a Windows service
- Or run: `mongod` in a terminal

**If using MongoDB Atlas:**
- No need to start anything, it's cloud-based!

### 5. Start Backend Server

```bash
npm run dev
```

You should see:
```
✅ MongoDB Connected: ...
🚀 Server running on port 5000
📡 API available at http://localhost:5000/api
```

---

## 📡 API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Projects

- `GET /api/projects` - Get all projects for user
- `GET /api/projects/:id` - Get single project
- `POST /api/projects` - Create project (Leader/Admin only)
- `PUT /api/projects/:id` - Update project (Leader/Admin only)
- `GET /api/projects/:id/members` - Get project members

### Tasks

- `GET /api/tasks?projectId=xxx` - Get all tasks for project
- `GET /api/tasks/:id` - Get single task
- `POST /api/tasks` - Create task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task
- `GET /api/tasks/:id/comments` - Get task comments
- `POST /api/tasks/:id/comments` - Add comment to task

---

## 🧪 Test API with Postman/Thunder Client

### 1. Register a User

```http
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "LEADER"
}
```

### 2. Login

```http
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "userId": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "LEADER"
  }
}
```

### 3. Create Project (use token from login)

```http
POST http://localhost:5000/api/projects
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json

{
  "name": "TPMS Project",
  "description": "Team Project Management System",
  "columns": ["TODO", "DOING", "DONE"]
}
```

### 4. Create Task

```http
POST http://localhost:5000/api/tasks
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json

{
  "projectId": "PROJECT_ID_HERE",
  "title": "Design Login Page",
  "description": "Create wireframes",
  "status": "TODO",
  "deadline": "2026-02-15",
  "effort": 4
}
```

---

## 🔒 Authentication

All protected routes require a JWT token in the Authorization header:

```
Authorization: Bearer YOUR_JWT_TOKEN
```

The token is returned when you login or register.

---

## 📝 Notes

- **Password Hashing**: Passwords are automatically hashed using bcrypt before saving
- **JWT Tokens**: Tokens expire in 30 days
- **CORS**: Configured to allow requests from `http://localhost:5173` (Vite dev server)
- **Error Handling**: All errors are caught and returned in consistent format

---

## 🐛 Troubleshooting

**MongoDB connection error?**
- Check MongoDB is running: `mongosh` (should connect)
- Verify connection string in `.env`
- For Atlas: Check IP whitelist allows your IP

**Port already in use?**
- Change `PORT` in `.env` to different port (e.g., 5001)
- Or stop other service using port 5000

**CORS errors?**
- Make sure `CORS_ORIGIN` in `.env` matches your frontend URL
- Default is `http://localhost:5173` (Vite default)

---

## ✅ Next Steps

1. Test API endpoints with Postman/Thunder Client
2. Create API service layer in frontend
3. Connect React components to APIs
4. Test full flow: Register → Login → Create Project → Create Task
