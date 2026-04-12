
# Ground Control Dashboard (GCsync)

A real-time robotics control and monitoring dashboard built with modern frontend architecture and strong software engineering principles. GCsync enables an operator to **control**, **monitor**, and **visualize** robot behavior using **live telemetry data**.

---

## Overview

The application follows a clean, structured data flow:

Robot Hardware → Telemetry → WebSocket → CommBridge → Zustand Store → UI Panels



- UI components **never fetch data directly**
- All data flows through a **centralized global state**
- Ensures consistency, scalability, and predictable updates

---

## Tech Stack

- **Next.js (App Router)**
- **React + TypeScript**
- **Zustand** — State Management
- **Tailwind CSS + ShadCN UI**
- **WebSocket** — Real-time communication
- **React Three Fiber** — LiDAR visualization
- **Recharts** — Telemetry graphs

---

## System Design

The system design is documented using:

- **ER Diagram** — Data relationships
- **Class Diagrams** — Robot and dashboard layers
- **Use Case Diagram** — Operator interactions

The architecture emphasizes:
- Object-Oriented Design
- Separation of Concerns
- Modular structure

---

## OOP Structure

### Abstract Base Class

`DashboardPanel` defines common behavior:

- `panelTitle`
- `isVisible`
- `updatePanel()`
- `show()`
- `hide()`

### Derived Panels

| Panel              | Responsibility                                  |
|--------------------|--------------------------------------------------|
| `ControlPanel`     | Robot movement and emergency stop               |
| `SpatialVisualizer`| LiDAR and IMU rendering                        |
| `HealthMonitor`    | Battery, encoder, and sensor health monitoring  |

---

## Design Patterns

### Factory Pattern — Sensor System

Creates sensor objects (`IMU`, `LiDAR`, `Encoder`) via a common interface.

- Open/Closed Principle
- Liskov Substitution Principle
- Dependency Inversion Principle
- Extensible sensor architecture

### Singleton Pattern — CommBridge

Manages WebSocket communication.

- Single active connection
- Centralized message parsing
- Consistent communication state

---

## Core Components

### `RobotState`

Single source of truth for:

- Motor data
- Sensor flags
- Robot status

### `CommBridge`

Handles:

- WebSocket connection
- Incoming telemetry parsing
- Outgoing command transmission

### Panels

All UI panels subscribe to the global state and update reactively.

---

## UI Layout

| Section       | Description                                              |
|---------------|----------------------------------------------------------|
| Top Bar       | Connection status, emergency stop, robot state           |
| Left Panel    | Control inputs (arm/disarm, speed, movement)             |
| Center Panel  | LiDAR and spatial visualization                          |
| Right Panel   | Health monitoring and alerts                             |
| Bottom Panel  | Telemetry graphs, logs, data export                      |

---

## Functional Behavior

- Real-time updates via WebSocket
- Emergency stop has highest priority
- Controls disabled when disconnected
- Alerts for low battery and sensor failures
- Optimized rendering for smooth UI performance

---

## Project Structure


/src
├── app/
├── components/
├── panels/
├── core/
├── store/
├── hooks/
└── lib/



---

## SDLC Approach

1. Requirement analysis using use case diagrams
2. System design using ER and class diagrams
3. Modular implementation
4. Component and state validation testing

---

## Future Enhancements

- Autonomous navigation support
- AI-based anomaly detection
- Cloud-based telemetry storage
- Camera integration

