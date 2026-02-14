```markdown
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

... (archived)

```
