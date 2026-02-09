# Database Design Document

## 📊 MongoDB Schema Design

Based on your class diagram, here's the database structure:

### Collections Overview

1. **users** - User accounts with roles
2. **projects** - Project/Board information
3. **tasks** - Individual tasks
4. **comments** - Comments on tasks
5. **epics** - (Optional, for future use)

---

## 📋 Collection Schemas

### 1. **users** Collection

```javascript
{
  _id: ObjectId,              // MongoDB auto-generated
  name: String,               // User's full name
  email: String,              // Unique email (indexed)
  passwordHash: String,       // Hashed password (bcrypt)
  role: String,               // "ADMIN" | "LEADER" | "MEMBER"
  createdAt: Date,            // Account creation date
  updatedAt: Date             // Last update date
}
```

**Indexes:**
- `email`: Unique index (for login)

**Relationships:**
- One user can lead many projects (`leaderId` in projects)
- One user can be assigned many tasks (`assignedTo` in tasks)
- One user can write many comments (`userId` in comments)

---

### 2. **projects** Collection

```javascript
{
  _id: ObjectId,              // MongoDB auto-generated
  name: String,               // Project name
  description: String,        // Project description
  leaderId: ObjectId,         // Reference to users._id
  members: [ObjectId],        // Array of user IDs (team members)
  columns: [String],          // Custom columns ["TODO", "DOING", "DONE", "REVIEW"]
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- `leaderId`: Index (for finding projects by leader)

**Relationships:**
- One project has one leader (users)
- One project can have many tasks
- One project can have many members (users)

---

### 3. **tasks** Collection

```javascript
{
  _id: ObjectId,              // MongoDB auto-generated
  projectId: ObjectId,        // Reference to projects._id
  epicId: ObjectId,           // Optional: Reference to epics._id
  title: String,              // Task title
  description: String,        // Task description
  assignedTo: ObjectId,       // Optional: Reference to users._id
  deadline: Date,             // Optional: Task deadline
  effort: Number,              // Optional: Estimated hours
  status: String,             // "TODO" | "DOING" | "DONE" | custom columns
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- `projectId`: Index (for finding tasks by project)
- `assignedTo`: Index (for finding tasks by user)
- `status`: Index (for filtering by status)

**Relationships:**
- One task belongs to one project
- One task can be assigned to one user (optional)
- One task can have many comments

---

### 4. **comments** Collection

```javascript
{
  _id: ObjectId,              // MongoDB auto-generated
  taskId: ObjectId,           // Reference to tasks._id
  userId: ObjectId,           // Reference to users._id
  text: String,               // Comment text
  createdAt: Date,           // Comment creation date
  updatedAt: Date            // Last update date
}
```

**Indexes:**
- `taskId`: Index (for finding comments by task)
- `userId`: Index (for finding comments by user)

**Relationships:**
- One comment belongs to one task
- One comment is written by one user

---

## 🔗 Relationships Summary

```
User (1) ──< leads >── (many) Project
User (1) ──< assigned >── (many) Task
User (1) ──< writes >── (many) Comment

Project (1) ──< contains >── (many) Task
Task (1) ──< has >── (many) Comment
```

---

## 🎯 Design Decisions

### 1. **ObjectId References**
- Using MongoDB `ObjectId` for relationships (not strings)
- Allows MongoDB to maintain referential integrity
- Better for joins/population

### 2. **Embedded vs Referenced**
- **Referenced**: Tasks, Comments, Projects (can grow large)
- **Embedded**: Columns array in Project (small, project-specific)

### 3. **Indexes**
- Email: Unique (login performance)
- projectId: Indexed (common query)
- assignedTo: Indexed (user's tasks)
- status: Indexed (filtering tasks)

### 4. **Timestamps**
- `createdAt` and `updatedAt` on all collections
- Automatic via Mongoose timestamps

---

## 📝 Notes

- **Epics**: Optional for MVP, can be added later
- **Project Members**: Array of user IDs for team membership
- **Custom Columns**: Stored as strings in project.columns array
- **Password Security**: Always hash passwords (bcrypt)
- **Validation**: Mongoose schemas will enforce required fields

---

## 🚀 Next Steps

1. Create Mongoose models based on these schemas
2. Set up Express server
3. Create API routes
4. Add authentication middleware
5. Connect frontend to APIs
