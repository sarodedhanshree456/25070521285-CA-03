# FitForge Backend API 🚀🍃

The robust, scalable REST API server for the **FitForge** full-stack fitness and nutrition platform, built with **Node.js**, **Express**, and **MongoDB / Mongoose**.

---

## 🛠️ Technology Stack

- **Runtime**: Node.js (ES Modules)
- **Framework**: Express.js
- **Database**: MongoDB (via Mongoose ODM)
- **Authentication**: JSON Web Tokens (JWT) + bcryptjs password hashing
- **Metabolic Calculation Engine**: Mifflin-St Jeor validated equations
- **Security & Middleware**: CORS, custom error handler, route protection guards

---

## 📁 Architecture & Folder Structure

```
server/
├── config/
│   └── db.js               # MongoDB connection logic with reconnect handlers
├── controllers/            # Route controllers with business logic
│   ├── authController.js   # Register, login, current user, password reset
│   ├── userController.js   # Biometric profile update, onboarding, delete account
│   ├── dietController.js   # 7-day Indian meal plan generation & meal swap logic
│   ├── foodController.js   # Search 28+ foods, meal logging, weekly macro summary
│   ├── workoutController.js# Workout routine generation, session logging, history
│   ├── exerciseController.js# Exercise movement library & target muscle queries
│   ├── progressController.js# Body measurement & weight velocity history
│   ├── waterController.js  # Hydration tracking, quick logging, and weekly consistency
│   └── assistantController.js# Rules-based exercise physiology and nutrition AI
├── middleware/
│   ├── auth.js             # JWT verification and req.user injection
│   └── errorHandler.js     # Standardized JSON error response handler
├── models/                 # Mongoose schemas
│   ├── User.js             # User credentials, BMR, TDEE, macros, goals
│   ├── Food.js             # Indian & global food nutritional database
│   ├── Exercise.js         # Anatomical exercises with instructions & muscle targets
│   ├── WorkoutPlan.js      # Multi-day training splits (PPL, Upper/Lower, Full Body)
│   ├── WorkoutSession.js   # Recorded workout session sets, reps, and weights
│   ├── DietPlan.js         # 7-day meal schedules, grocery list, allergen tags
│   ├── MealLog.js          # Daily logged meals by category (breakfast, lunch, etc.)
│   ├── WaterLog.js         # Timestamped hydration entries
│   └── ProgressEntry.js    # Somatometric measurements and weight history
├── routes/                 # Express route definitions
│   ├── authRoutes.js       # /api/auth/*
│   ├── userRoutes.js       # /api/user/*
│   ├── dietRoutes.js       # /api/diet/*
│   ├── foodRoutes.js       # /api/food/*
│   ├── workoutRoutes.js    # /api/workouts/*
│   ├── exerciseRoutes.js   # /api/exercises/*
│   ├── progressRoutes.js   # /api/progress/*
│   ├── waterRoutes.js      # /api/water/*
│   └── assistantRoutes.js  # /api/assistant/*
├── seed/
│   └── seed.js             # Seed script for demo user, 28 foods, 15 exercises
├── utils/
│   ├── macroCalculator.js  # Mifflin-St Jeor BMR, TDEE, and macro formulas
│   ├── mealPlanGenerator.js# 7-Day Indian meal schedule generator with allergens
│   └── workoutGenerator.js # Hypertrophy workout split routines
├── .env                    # Environment variables (PORT, MONGO_URI, JWT_SECRET)
├── index.js                # Server entry point & Express route mounting
├── package.json            # Backend dependencies & npm scripts
├── start.bat               # Windows 1-click startup batch script
└── test_api.js             # Automated test suite for all 7 API subsystems
```

---

## ⚡ Quick Start

### Option 1: Double-Click the Start Script
Simply double-click `start.bat` inside this `server` folder. It will verify dependencies, install if missing, and launch the server on port 5000.

### Option 2: Command Line
```bash
# 1. Navigate into server directory
cd server

# 2. Install dependencies (if not already installed)
npm install

# 3. Seed MongoDB with demo user, 28 Indian foods, 15 exercises
npm run seed

# 4. Launch backend in development mode
npm run dev
```

The server will be running at:
👉 **http://localhost:5000**
- Health Check: `http://localhost:5000/api/health`

---

## ⚙️ Environment Configuration (`.env`)

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/fitforge
JWT_SECRET=fitforge_super_secret_jwt_key_2026_dev_mode
JWT_EXPIRE=30d
```

---

## 🍃 Connecting with MongoDB Compass

FitForge automatically stores all data in your local MongoDB instance. To view and inspect collections:

1. Open **MongoDB Compass**.
2. Paste this Connection URI:
   ```text
   mongodb://127.0.0.1:27017
   ```
3. Click **Connect**.
4. Select the **`fitforge`** database to view all collections:
   - `users` (Demo user: `demo@fitforge.com` / `password123`)
   - `foods` (28 Indian & global whole foods)
   - `exercises` (15 resistance training movements)
   - `workoutplans` (PPL, Upper/Lower, Full Body splits)
   - `workoutsessions` (Session logs)
   - `dietplans` (7-day Indian meal plans with grocery list)
   - `meallogs` (Logged food entries)
   - `waterlogs` (Hydration tracking logs)
   - `progressentries` (Weight progression logs)

---

## 🧪 Available Scripts

- `npm run dev`: Starts the server using Node with automatic reload on changes.
- `npm run start`: Starts the production server (`node index.js`).
- `npm run seed`: Clears and repopulates the MongoDB `fitforge` database with full demo data.
- `npm run test:api`: Runs the automated integration test script validating all 7 core API pipelines.
