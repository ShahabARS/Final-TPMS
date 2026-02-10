# TPMS Test Credentials

## ✅ Test User Accounts

Three test accounts have been created with different roles. Use these to test the system:

### 1. Admin Account
- **Email:** `admin@tpms.com`
- **Password:** `admin123`
- **Role:** ADMIN
- **Permissions:** Full system access, user management, project management

### 2. Team Leader Account
- **Email:** `leader@tpms.com`
- **Password:** `leader123`
- **Role:** LEADER
- **Permissions:** Create/manage projects, assign tasks, manage team members

### 3. Team Member Account
- **Email:** `member@tpms.com`
- **Password:** `member123`
- **Role:** MEMBER
- **Permissions:** View assigned tasks, update task status, add comments

---

## 📋 Test Project Created

A test project has been automatically created:

**Project Name:** TPMS Main Project
**Description:** Main project for Team Project Management System
**Owner:** Admin User (admin@tpms.com)
**Project ID:** `698b108ef909e5f0c3e1ce2d`

### Test Tasks

The following tasks have been added to the test project:

1. **Design Login Page**
   - Status: TODO
   - Effort: 4 points
   - Deadline: 2026-02-15
   - Description: Create wireframes and mockups for the login interface

2. **Implement Authentication**
   - Status: DOING
   - Effort: 8 points
   - Deadline: 2026-02-12
   - Description: Set up user login and session management with JWT

3. **Setup MongoDB Database**
   - Status: DONE
   - Effort: 6 points
   - Deadline: 2026-02-10
   - Description: Configure MongoDB connection and create initial schemas

---

## 🚀 How to Test

### 1. Login with Different Roles
- Try logging in with each account above
- Observe the different features available to each role
- Check that the dashboard displays your assigned tasks

### 2. Create a Task
- Click "Create Task" button
- Fill in the task details
- Task should appear in the board immediately
- Refresh page - task persists in database ✅

### 3. Update Task Status
- Drag/click a task to move it between columns
- OR click task card to open detail modal and change status
- Change should save to database
- Refresh page - status persists ✅

### 4. Create New Column
- Click "Create Column" button
- Enter a column name (e.g., "IN REVIEW", "BLOCKED")
- New column appears on the board
- Tasks can be moved to the new column
- Refresh page - column persists ✅

### 5. Update Board Settings
- Click "Board Settings" button
- Change project name or description
- Changes save to database
- Refresh page - changes persist ✅

### 6. Manage Team Members
- Click "Team Members" button
- View all members of the project
- (Admin/Leader can add/remove members - future feature)

---

## 📚 API Endpoints Available

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user info

### Projects
- `GET /api/projects` - Get user's projects
- `GET /api/projects/:id` - Get single project
- `POST /api/projects` - Create project (Leader/Admin only)
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project
- `GET /api/projects/:id/members` - Get project members
- `POST /api/projects/:id/members` - Add member to project
- `DELETE /api/projects/:id/members/:memberId` - Remove member

### Tasks
- `GET /api/tasks?projectId=:id` - Get project tasks
- `GET /api/tasks/:id` - Get single task
- `POST /api/tasks` - Create task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

### Comments
- `GET /api/tasks/:id/comments` - Get task comments
- `POST /api/tasks/:id/comments` - Add comment to task

---

## 💡 Key Features Implemented

✅ **Real-time Database Sync**
- All data loads from MongoDB on page load
- Changes persist after page refresh
- No hardcoded/static data

✅ **Role-Based Access Control**
- Different features visible based on user role
- Backend enforces permissions
- Frontend respects role capabilities

✅ **Full CRUD Operations**
- Create tasks, columns, projects
- Read data from database
- Update any entity
- Delete tasks and projects

✅ **Dynamic Board**
- Columns loaded from database
- Tasks organized by status
- Custom columns supported
- Tasks move between columns seamlessly

---

## 🔧 Troubleshooting

### Tasks not loading?
1. Make sure backend is running: `npm run dev` in `backend/` folder
2. Check browser console for errors (F12)
3. Verify MongoDB is connected

### Can't create a task?
1. Make sure you're logged in
2. Ensure a project exists
3. Check that your role allows task creation

### Changes not persisting after refresh?
1. Check network tab in browser DevTools
2. Verify API responses show `"success": true`
3. Check MongoDB for data insertion

---

## 📝 Notes

- The system is now **fully dynamic**
- All data comes from MongoDB
- Frontend syncs with backend for all operations
- Role-based permissions enforced
- Ready for collaborative team workflow
