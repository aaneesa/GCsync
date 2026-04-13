
# Ground Control Dashboard (GCsync)

A real-time robotics control and monitoring dashboard designed using modern frontend architecture and strong software engineering principles. The system enables an operator to control, monitor, and visualize robot behavior using live telemetry data.

---

## Overview

The application follows a structured data flow:


Robot Hardware → Telemetry → WebSocket → CommBridge → Zustand Store → UI Panels


- UI components do not fetch data directly  
- All data is managed through a centralized state for consistency and scalability  

---

## Tech Stack

- Next.js (App Router)  
- React with TypeScript  
- Zustand (State Management)  
- Tailwind CSS with ShadCN UI  
- WebSocket (Real-time communication)  
- React Three Fiber (LiDAR visualization)  
- Recharts (Telemetry graphs)  

---

## System Design

The system is modeled using:

- ER Diagram (data relationships)  
- Class Diagrams (robot + dashboard layers)  
- Use Case Diagram (operator interactions)  

The architecture emphasizes:

- Object-oriented design  
- Modular separation of concerns  


## OOP Structure

### Abstract Base Class

`DashboardPanel` defines common behavior:

- `panelTitle`  
- `isVisible`  
- `updatePanel()`  
- `show()`  
- `hide()`  

---

### Derived Panels

- **ControlPanel**
  - Handles robot movement  
  - Emergency stop  

- **SpatialVisualizer**
  - Renders LiDAR and IMU data  

- **HealthMonitor**
  - Tracks battery and encoder health  

---

## Design Patterns

### Factory Pattern (Sensor System)

Used to create sensor objects:

- IMU  
- LiDAR  
- Encoder  

Benefits:

- Open/Closed Principle (easy extensibility)  
- Liskov Substitution Principle (consistent behavior)  
- Dependency Inversion (decoupled creation logic)  

---

### Singleton Pattern (CommBridge)

Used for WebSocket communication:

- Ensures a single active connection  
- Centralizes message handling and parsing  
- Prevents inconsistent communication states  

---

## Core Components

### RobotState

Single source of truth for:

- Motor data  
- Sensor flags  

---

### CommBridge

Handles:

- WebSocket connection  
- Incoming telemetry parsing  
- Outgoing command transmission  

---

### Panels

- Subscribe to global state  
- Reactively update UI  

---

## UI Layout

- **Top Bar**
  - Connection status  
  - Emergency stop  
  - Robot state  

- **Left Panel**
  - Control inputs  
  - Arm/Disarm  
  - Speed & movement  

- **Center Panel**
  - LiDAR + spatial visualization  

- **Right Panel**
  - Health monitoring  
  - Alerts  

- **Bottom Panel**
  - Telemetry graphs  
  - Logs  
  - Export  

---

## Functional Behavior

- Real-time updates via WebSocket  
- Emergency stop has highest priority  
- Controls disabled when disconnected  
- Alerts for:
  - Low battery  
  - Sensor failures  
- Optimized rendering for smooth UI updates  

---

## Project Structure

```
frontend/
├── dist/
│ ├── assets/
│ │ ├── geist-cyrillic-wght-normal-.woff2
│ │ ├── geist-latin-ext-wght-normal-.woff2
│ │ ├── geist-latin-wght-normal-.woff2
│ │ ├── index-.css
│ │ └── index-*.js
│ ├── favicon.svg
│ ├── icons.svg
│ └── index.html
│
├── node_modules/
├── public/
│
├── src/
│ ├── app/
│ │ └── DashboardPage.tsx
│ │
│ ├── components/
│ │ ├── panels/
│ │ │ ├── ControlPanelView.tsx
│ │ │ ├── HealthMonitorView.tsx
│ │ │ ├── SpatialVisualizerView.tsx
│ │ │ └── TelemetryPanel.tsx
│ │ │
│ │ └── ui/
│ │ ├── alert.tsx
│ │ ├── badge.tsx
│ │ ├── button.tsx
│ │ ├── card.tsx
│ │ ├── scroll-area.tsx
│ │ ├── separator.tsx
│ │ ├── slider.tsx
│ │ ├── switch.tsx
│ │ ├── tabs.tsx
│ │ └── TopBar.tsx
│ │
│ ├── core/
│ │ ├── CommBridge.ts
│ │ ├── ControlPanel.ts
│ │ ├── DashboardPanel.ts
│ │ ├── GCsyncUI.ts
│ │ ├── HealthMonitor.ts
│ │ ├── index.ts
│ │ ├── RobotState.ts
│ │ └── SpatialVisualizer.ts
│ │
│ ├── hooks/
│ │ └── useWebSocket.ts
│ │
│ ├── lib/
│ │ └── utils.ts
│ │
│ ├── store/
│ │ └── useRobotStore.ts
│ │
│ ├── App.tsx
│ ├── index.css
│ └── main.tsx
│
├── components.json
├── eslint.config.js
├── index.html
├── package-lock.json
├── package.json
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
├── .gitignore
└── README.md
```
---

## SDLC Approach

- Requirement analysis using use case diagrams  
- System design using ER and class diagrams  
- Implementation with modular architecture  
- Testing via component and state validation  

---

## Future Enhancements

- Autonomous navigation support  
- AI-based anomaly detection  
- Cloud-based telemetry storage  
- Camera integration  
```
