# FitForge Frontend Client ⚛️🏋️‍♂️

The modern, responsive frontend application for the **FitForge** full-stack fitness and nutrition platform, built with **React 18**, **Vite**, and **Tailwind CSS**.

---

## 🛠️ Technology Stack

- **Framework**: React 18 (Functional components & hooks)
- **Bundler & Dev Server**: Vite 6
- **Routing**: React Router DOM v6
- **Styling**: Tailwind CSS + Custom Glassmorphism System
- **Icons**: Lucide React
- **Data Visualization**: Recharts (Weight trend area charts, hydration consistency bar charts, macro progress indicators)
- **HTTP Client**: Axios with automatic JWT interceptors

---

## 📁 Architecture & Folder Structure

```
client/
├── public/                 # Static assets and icons
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── Navbar.jsx      # Top navigation with 1-Click Demo Evaluation & profile dropdown
│   │   ├── Sidebar.jsx     # Dashboard navigation bar with streak widget
│   │   ├── Footer.jsx      # Footer with scientific disclaimers
│   │   ├── WaterGlass.jsx  # Animated hydration tumbler (+150ml, +250ml, +500ml)
│   │   ├── RestTimer.jsx   # Interactive inter-set rest countdown timer
│   │   ├── MacroBar.jsx    # Protein, Carb, Fat percentage distribution bars
│   │   ├── StatCard.jsx    # Metric highlights cards
│   │   └── ProtectedRoute.jsx # Route guard for authenticated & onboarded users
│   ├── context/
│   │   ├── AuthContext.jsx # User auth state, token storage, and 1-Click Demo helper
│   │   └── ThemeContext.jsx# Dark/light theme state provider and useTheme hook
│   ├── hooks/
│   │   ├── useAuth.js      # Auth hook shortcut
│   │   ├── useFitnessData.js # Concurrent fitness biomarker & dashboard data fetcher
│   │   └── useDebounce.js  # Debounce utility for fast food and exercise search
│   ├── pages/              # All 15 application views
│   │   ├── Landing.jsx     # Hero section with interactive Mifflin-St Jeor calculator
│   │   ├── Login.jsx       # Auth login with 1-Click Demo button
│   │   ├── Signup.jsx      # Registration with password strength meter
│   │   ├── ForgotPassword.jsx # Expiring token password recovery
│   │   ├── Onboarding.jsx  # 5-Step somatometric wizard generating MongoDB plans
│   │   ├── Dashboard.jsx   # Primary dashboard with macros, water, and workout routine
│   │   ├── DietPlan.jsx    # 7-day Indian meal schedule, meal swap & grocery list
│   │   ├── Workouts.jsx    # Split switcher (PPL, Upper/Lower, Full Body, Calisthenics)
│   │   ├── WorkoutDetail.jsx # Active session logging with sets, reps, and rest timer
│   │   ├── FoodTracker.jsx # 28+ Indian food database search & macro logging
│   │   ├── ProgressTracker.jsx # Body composition tracking with Recharts curve
│   │   ├── WaterTracker.jsx # Hydration logs & 7-day consistency chart
│   │   ├── ExerciseLibrary.jsx # Anatomical movement guides & execution cues
│   │   ├── Assistant.jsx   # FitForge AI Fitness & Nutrition Assistant
│   │   └── ProfileSettings.jsx # Biometric recalibration & account security
│   ├── services/
│   │   └── api.js          # Axios instance configured with /api proxy & bearer token
│   ├── utils/
│   │   └── macroCalculator.js # Mifflin-St Jeor client calculations
│   ├── App.jsx             # Main application route configurations
│   ├── main.jsx            # React root mounting
│   └── index.css           # Global Tailwind and dark mode theme styles
├── .env                    # Environment variables (VITE_API_BASE_URL)
├── index.html              # HTML entry point
├── package.json            # Client dependencies & scripts
├── start.bat               # Windows 1-click startup batch script
├── tailwind.config.js      # Tailwind color tokens & animations
└── vite.config.js          # Vite config with /api reverse proxy to port 5000
```

---

## ⚡ Quick Start

### Option 1: Double-Click the Start Script
Simply double-click `start.bat` inside this `client` folder. It will verify dependencies and launch Vite at `http://localhost:5173`.

### Option 2: Command Line
```bash
# 1. Navigate into client directory
cd client

# 2. Install dependencies (if not already installed)
npm install

# 3. Launch Vite development server
npm run dev
```

The frontend will be running at:
👉 **http://localhost:5173**

---

## ⚙️ Environment Configuration (`.env`)

```env
VITE_API_BASE_URL=/api
```
*(Vite proxies `/api` directly to the backend at `http://localhost:5000` via `vite.config.js` to prevent CORS issues).*

---

## 🧪 Available Scripts

- `npm run dev`: Starts Vite dev server with instant Hot Module Replacement (HMR).
- `npm run build`: Type-checks and creates a production-ready minified bundle in `dist/`.
- `npm run preview`: Locally previews the production build.
