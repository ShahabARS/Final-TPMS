# Quick MongoDB Check

## 🔍 Is MongoDB Running?

### Check 1: Windows Services
1. Press `Win + R`
2. Type: `services.msc`
3. Press Enter
4. Look for "MongoDB" service
5. Status should be "Running"

### Check 2: Command Line
```powershell
# Try to connect
mongosh

# If it connects, MongoDB is running!
# Type "exit" to leave
```

### Check 3: MongoDB Compass
1. Open MongoDB Compass
2. Connection string: `mongodb://localhost:27017`
3. Click "Connect"
4. If it connects, MongoDB is running!

---

## 🚀 If MongoDB is NOT Running

### Option 1: Start Windows Service
1. Open `services.msc`
2. Find "MongoDB"
3. Right-click → "Start"

### Option 2: Install MongoDB
If service doesn't exist:
1. Download: https://www.mongodb.com/try/download/community
2. Install MongoDB Community Server
3. Check "Install MongoDB as a Service"

### Option 3: Use MongoDB Atlas (Cloud)
1. Go to: https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create cluster
4. Get connection string
5. Use in `.env` file

---

## ✅ Once MongoDB is Running

1. **Start Backend:**
   ```bash
   cd backend
   npm run dev
   ```

2. **Should see:**
   ```
   ✅ MongoDB Connected: 127.0.0.1:27017
   🚀 Server running on port 5000
   ```

3. **Test API:**
   - Open Postman/Thunder Client
   - Test: `POST http://localhost:5000/api/auth/register`

---

**That's it!** MongoDB just needs to be running in the background (like a service).
