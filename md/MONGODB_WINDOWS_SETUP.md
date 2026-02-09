# MongoDB Setup Guide for Windows

## 🎯 Understanding MongoDB

**MongoDB** = The actual database server (needs to be installed and running)
**MongoDB Compass** = A GUI tool to view/manage databases (optional, but helpful)

Think of it like this:
- **MongoDB** = The engine (like a car engine)
- **MongoDB Compass** = The dashboard (like a car's dashboard to see what's happening)

---

## 📥 Step 1: Install MongoDB Community Server

### Option A: Download and Install (Recommended)

1. **Download MongoDB:**
   - Go to: https://www.mongodb.com/try/download/community
   - Select:
     - Version: Latest (7.0 or 8.0)
     - Platform: Windows
     - Package: MSI
   - Click "Download"

2. **Install MongoDB:**
   - Run the downloaded `.msi` file
   - Choose "Complete" installation
   - **Important:** Check "Install MongoDB as a Service"
   - Check "Install MongoDB Compass" (the GUI tool)
   - Click "Install"

3. **Verify Installation:**
   - MongoDB should now be running as a Windows service
   - You can check in Windows Services:
     - Press `Win + R`
     - Type `services.msc` and press Enter
     - Look for "MongoDB" service (should be "Running")

### Option B: Use MongoDB Atlas (Cloud - Easier, No Installation)

If you don't want to install MongoDB locally, you can use the free cloud version:

1. Go to: https://www.mongodb.com/cloud/atlas
2. Sign up for free account
3. Create a free cluster (takes 3-5 minutes)
4. Get connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/tpms`)
5. Use this connection string in your `.env` file

**Advantages:**
- ✅ No installation needed
- ✅ Works from anywhere
- ✅ Free tier available
- ✅ Easy to reset/clear data

**Disadvantages:**
- ❌ Requires internet connection
- ❌ Might be slower than local

---

## ✅ Step 2: Verify MongoDB is Running

### Check if MongoDB Service is Running

**Method 1: Windows Services**
1. Press `Win + R`
2. Type `services.msc` and press Enter
3. Look for "MongoDB" service
4. Status should be "Running"

**Method 2: Command Line**
```powershell
# Check if MongoDB service exists
Get-Service -Name MongoDB

# If service exists, check its status
# Should show "Running"
```

**Method 3: Try to Connect**
```powershell
# Try connecting to MongoDB
mongosh
# If MongoDB is running, this will connect
# Type "exit" to leave
```

---

## 🔧 Step 3: Start MongoDB (If Not Running)

If MongoDB service is not running:

**Method 1: Windows Services**
1. Open `services.msc`
2. Find "MongoDB" service
3. Right-click → "Start"

**Method 2: Command Line (Run as Administrator)**
```powershell
# Start MongoDB service
Start-Service -Name MongoDB
```

**Method 3: Manual Start**
```powershell
# Navigate to MongoDB bin folder (usually):
cd "C:\Program Files\MongoDB\Server\8.0\bin"

# Start MongoDB manually
.\mongod.exe --dbpath "C:\data\db"
```
*(Note: You may need to create `C:\data\db` folder first)*

---

## 🗄️ Step 4: Create Database in MongoDB Compass

Once MongoDB is running:

1. **Open MongoDB Compass:**
   - Should be installed with MongoDB
   - Or download from: https://www.mongodb.com/products/compass

2. **Connect:**
   - Connection string: `mongodb://localhost:27017`
   - Click "Connect"

3. **Create Database:**
   - Click "Create Database"
   - Database Name: `tpms`
   - Collection Name: `users` (or any name, we'll create collections via code)
   - Click "Create Database"

**Note:** You don't need to create collections manually! Our backend code will create them automatically when you start using the API.

---

## 🧪 Step 5: Test MongoDB Connection

### Test from Command Line:
```powershell
# Connect to MongoDB shell
mongosh

# Should see: "Connected to: mongodb://127.0.0.1:27017"

# List databases
show dbs

# Exit
exit
```

### Test from Your Backend:
1. Make sure MongoDB is running
2. Start your backend server:
   ```bash
   cd backend
   npm run dev
   ```
3. You should see: `✅ MongoDB Connected: ...`

---

## 📝 Step 6: Configure Backend

1. **Edit `.env` file in `backend/` folder:**
   ```env
   # For local MongoDB:
   MONGODB_URI=mongodb://localhost:27017/tpms
   
   # For MongoDB Atlas (if using cloud):
   # MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/tpms
   ```

2. **Start backend:**
   ```bash
   cd backend
   npm install  # If not done yet
   npm run dev
   ```

3. **Check connection:**
   - Should see: `✅ MongoDB Connected: 127.0.0.1:27017`
   - If you see an error, MongoDB is not running

---

## 🐛 Troubleshooting

### "MongoDB service not found"
- MongoDB is not installed
- Install MongoDB Community Server (see Step 1)

### "Cannot connect to MongoDB"
- MongoDB service is not running
- Start MongoDB service (see Step 3)

### "Port 27017 already in use"
- Another MongoDB instance is running
- Stop other MongoDB processes or change port

### "Access denied" errors
- Run PowerShell/Command Prompt as Administrator
- Or check Windows Services permissions

---

## 💡 Quick Reference

**MongoDB Default Settings:**
- Port: `27017`
- Data folder: `C:\data\db` (on Windows)
- Connection string: `mongodb://localhost:27017`

**MongoDB Compass:**
- Connection string: `mongodb://localhost:27017`
- Use to view databases, collections, and documents

**Your Backend:**
- Connection string: `mongodb://localhost:27017/tpms`
- Database name: `tpms`
- Collections created automatically by Mongoose models

---

## ✅ Checklist

- [ ] MongoDB Community Server installed
- [ ] MongoDB service is running
- [ ] Can connect with `mongosh` command
- [ ] MongoDB Compass can connect
- [ ] Backend `.env` file configured
- [ ] Backend server starts without errors
- [ ] See "MongoDB Connected" message

---

## 🎯 For Your Presentation

**Recommended Setup:**
1. Install MongoDB locally (more reliable)
2. Start MongoDB service before presentation
3. Test connection before demo
4. Have MongoDB Compass open to show database

**Alternative (If Internet Available):**
- Use MongoDB Atlas (cloud)
- No installation needed
- Works from anywhere

---

**Next:** Once MongoDB is running, test your backend API!
