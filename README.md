# CAMPUS TWIN 🏢 Real-Time Interactive Campus Digital Twin

> **Your campus. Digitally alive.**

CAMPUS TWIN is an enterprise-grade spatial digital twin web application for modern educational and scientific research institutions. Combining spatial vector geometry, real-time-style telemetry, shortest-path Dijkstra waypoint routing, context-aware AI assistant, and an enterprise administration control center.

---

## 🌟 Key Features

### 1. Spatial Digital Twin Engine (`/explore`)
- **Interactive Spatial Campus Geometry**: Custom vector SVG map representing 20+ realistic buildings, quad lawns, ring roads, pedestrian walkways, entrance markers, and elevation shadows.
- **Dynamic Layer Filtering**: Toggle between Category views (Academic, Labs, Library, Food, Sports, Hostels, Parking), Crowd Heatmaps, Wheelchair-Accessible Paths, and Active Maintenance Pins.
- **Multi-Floor Blueprint Viewer**: Inspect multi-story buildings (e.g. Computer Science Block) floor-by-floor down to individual rooms, hardware specs, and live availability.

### 2. Context-Aware AI Campus Assistant (`AI Assistant`)
- Integrated NLP query processor capable of answering natural queries:
  - *"Where is the nearest computer lab?"*
  - *"Is Lab 204 available?"*
  - *"Which cafeteria is least crowded?"*
  - *"How do I get to the library?"*
  - *"Where can I park?"*
- Directly highlights target buildings on the spatial map and offers one-click navigation.

### 3. Waypoint Navigation Router (`/navigate`)
- Graph-based Dijkstra shortest path routing across campus path nodes.
- Calculates exact distance in meters, estimated walking time in minutes, turn-by-turn directions, and wheelchair-accessible route options.
- Animated glowing route overlay on the spatial digital twin canvas.

### 4. Crowd Intelligence & Pulse (`Campus Pulse`)
- Live telemetry for overall campus load and density breakdown across hotspots.
- Optimal visit scheduler ("Best time to visit") to avoid peak lunch queues and library crowding.

### 5. Campus Maintenance Operations (`/reports`)
- Issue reporting wizard (`CT-1048` format) with ticket priority, category selection, and location tagging.
- Real-time status sync between student view and the Admin Operations Dispatch.

### 6. Enterprise Admin Control Center (`/admin`)
- Operations dashboard for facility managers with live telemetry counters.
- Interactive ticket queue with instant status switchers (`Assigned` -> `In Progress` -> `Resolved`).
- Operational status overrides and campus-wide live broadcast publisher.

---

## 🛠 Tech Stack

- **Framework**: Next.js (App Router, TypeScript)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Animations**: Framer Motion & CSS SVG keyframes
- **State Management**: Reactive CampusStore with localStorage persistence & role-based access control
- **Audio & Speech Engine**: Native Web SpeechSynthesis API with preferred female navigation guidance & Web SpeechRecognition

---

## 🚀 Getting Started

### 1. Environment Setup

```bash
# Clone the repository
git clone https://github.com/hrithik577/campus.git
cd campus-twin

# Copy the environment template
cp .env.example .env.local

# Install dependencies
npm install

# Run the local development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to explore the campus digital twin.

---

## ☁️ Production Deployment (Vercel)

The application is fully optimized for immediate zero-config deployment on [Vercel](https://vercel.com):

1. Import the repository into your Vercel dashboard.
2. Framework preset: **Next.js**.
3. Build command: `npm run build` (Turbopack optimized).
4. Output directory: `.next`.
5. Environment Variables:
   - Configure variables as listed in `.env.example` (e.g. `NEXT_PUBLIC_CAMPUS_NAME`, `AUTH_SECRET`, `AI_API_KEY`).
6. Deploy!

---

## 📂 Project Architecture

```
campus-twin/
├── .env.example             # Production environment variables template
├── src/
│   ├── app/                 # Next.js App Router Pages (/explore, /navigate, /facility, /reports, /events, /admin, /login)
│   ├── components/
│   │   ├── ai/              # AIChatPanel voice & text campus assistant
│   │   ├── admin/           # AdminDashboard operations & role-guarded facility controls
│   │   ├── common/          # Header, CommandPalette, NotificationCenter, MobileNav, MobileBottomSheet
│   │   ├── crowd/           # CrowdIntelligenceView telemetry
│   │   ├── explorer/        # BuildingPanel sidebar & building details
│   │   ├── map/             # CampusMap SVG engine, MapControls, FloorPlanModal, 2.5D layer views
│   │   ├── navigation/      # NavigationPanel, MobileNavOverlay (Google Maps-style HUD), RouteOverview
│   │   └── reports/         # MaintenanceWizard issue submission with photo attachments
│   ├── data/                # Campus Spatial Dataset (Buildings, Rooms, Graph Nodes & Multi-weight Edges)
│   ├── services/            # CampusStore, NavigationService (Multi-criteria Dijkstra), AIAssistantService, VoiceNavigationService
│   └── types/               # TypeScript interface schemas
```

---

## 📱 Mobile-First Navigation & Voice Guidance

- **Google Maps-Style UI**: Full-screen spatial viewport, persistent top turn-by-turn instruction card, bottom ETA & distance HUD, rerouting, and route overview sheet.
- **Female Voice Navigation**: Utilizes `VoiceNavigationService` with intelligent voice preference (female English-India / English natural voices with graceful fallback to browser defaults).
- **Safe Area & Touch Ready**: Strict `env(safe-area-inset-bottom)` integration and touch targets adhering to 44×44px standards.

---

## 🔒 Security & Data Integrity

- **Role-Based Authorization**: Protected `/admin` operations area; non-admin sessions are automatically presented with authorization guards.
- **Credential Hygiene**: No hardcoded API keys, passwords, or demo secrets committed to version control.
- **XSS & Injection Protection**: Strict typed components without `eval` or unsafe HTML rendering.
- **Browser API Safety**: Graceful fallbacks for browsers without SpeechSynthesis or Geolocation permissions.
