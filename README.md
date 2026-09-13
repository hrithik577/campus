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
- **State Management**: Reactive CampusStore with localStorage persistence

---

## 🚀 Getting Started

```bash
# Clone the repository
git clone https://github.com/your-username/campus-twin.git
cd campus-twin

# Install dependencies
npm install

# Run the local development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to explore the campus digital twin.

---

## 📂 Project Architecture

```
campus-twin/
├── src/
│   ├── app/                 # Next.js App Router Pages (/explore, /navigate, /facility, /reports, /events, /admin)
│   ├── components/
│   │   ├── ai/              # AIChatPanel assistant
│   │   ├── admin/           # AdminDashboard control center
│   │   ├── common/          # Header, CommandPalette, NotificationCenter
│   │   ├── crowd/           # CrowdIntelligenceView
│   │   ├── explorer/        # BuildingPanel sidebar
│   │   ├── map/             # CampusMap SVG engine, MapControls, FloorPlanModal
│   │   ├── navigation/      # NavigationPanel route builder
│   │   └── reports/         # MaintenanceWizard issue submission
│   ├── data/                # Mock Campus Dataset (Buildings, Rooms, Graph Nodes/Edges)
│   ├── services/            # CampusStore, NavigationService, AIAssistantService
│   └── types/               # TypeScript interface schemas
```

---

## 🔒 Security & Deployment

- No external API key required for demo.
- Production-ready data architecture designed for seamless replacement of mock data with real IoT sensor APIs & PostgreSQL backends.
