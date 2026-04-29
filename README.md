# GCsync: Industrial Robotics Mission Control

GCsync is a high-performance, persistent robotics dashboard designed for real-time telemetry visualization and mission data logging. It bridges the gap between **ROS (Robot Operating System)** and **Cloud Storage (MongoDB)**, providing operators with a unified interface for complex robotic deployments.

![Mission Control Overview](https://img.shields.io/badge/Aesthetic-Cyber--HUD-blueviolet)
![Tech Stack](https://img.shields.io/badge/Stack-React_|_Node_|_MongoDB-emerald)
![Protocol](https://img.shields.io/badge/Protocol-ROS_|_WebSocket-orange)

---

## 🚀 Key Features

### 📡 Real-Time Telemetry
- **Lidar Hero Panel**: 2D/3D point cloud visualization with collision analysis.
- **IMU Analysis**: High-frequency stream of angular velocity and linear acceleration with historical trend charts.
- **Odometry Tracking**: Precise tracking of robot position, orientation, and speed.
- **Data Rate Monitoring**: Live tracking of messages per second (msg/s) across all sensor streams.

### 💾 Persistence & Cloud Sync
- **Mission Configuration**: Dynamic setup of Robot IDs and Operator callsigns.
- **Intelligent Batch Logging**: Buffers high-frequency sensor data and flushes to MongoDB every 3 seconds to optimize performance and network reliability.
- **Session Management**: Full lifecycle tracking of robotic missions with persistent cloud IDs.

---

## 🛠 Tech Stack

### Frontend
- **Framework**: React 18 + Vite (TypeScript)
- **Styling**: Tailwind CSS (Industrial Gunmetal Aesthetic)
- **State**: Zustand (Reactive Store Pattern)
- **Communication**: ROSLIB.js (WebSocket Bridge)
- **Charts**: Recharts & Framer Motion

### Backend
- **Runtime**: Node.js + TypeScript
- **Framework**: Express.js
- **Database**: MongoDB Atlas (Mongoose ODM)
- **Middleware**: CORS, JSON-Limit (10MB for Telemetry Batches)

---

## 🏗 System Architecture & OOPS Principles

GCsync is engineered using enterprise-grade **Object-Oriented Programming** and **Design Patterns** to ensure scalability and maintainable code.

### 🧩 Applied Design Patterns
- **Singleton Pattern (`RosConnection.ts`)**: Ensures that the `roslib` connection is instantiated exactly once. This prevents multiple WebSocket handshakes and centralizes the robot communication state.
- **Observer Pattern (`EventBus.ts`)**: Implements a publish-subscribe mechanism. `RosConnection` publishes raw sensor data, while multiple observers (SensorService, Dashboard UI) react to changes without direct coupling.
- **Strategy Pattern (`SensorService.ts`)**: Different processing strategies are used for Lidar, IMU, and Odometry data. This allows the system to swap sensor algorithms without changing the core service.
- **Batching Pattern (`useStore.ts`)**: A custom persistence pattern that buffers high-frequency sensor streams (50Hz+) and flushes them to the database in intervals, significantly reducing database I/O overhead.

### 🛠 Core OOPS Concepts
- **Encapsulation**: Private class members in `RosConnection` and `SensorService` protect internal states (like connection status and raw buffers), exposing only necessary methods to the application.
- **Abstraction**: The `TelemetryService` abstracts complex HTTP/REST logic into simple methods like `logBatch()`. The UI interacts with these high-level functions without needing to know the underlying network implementation.
- **Inheritance & Interfaces**: Extensive use of TypeScript interfaces ensures that data structures remain consistent as they travel from the ROS topic, through the store, and into the MongoDB collection.
- **Single Responsibility Principle (SRP)**: Each component has one job. `LidarView` handles rendering, `SensorService` handles data processing, and `TelemetryService` handles persistence.

---

## 📦 Installation & Setup

### 1. Backend Configuration
```bash
cd backend
npm install
```
Create a `.env` file in the `backend` directory:
```env
PORT=5001
MONGODB_URI=your_mongodb_atlas_connection_string
```

### 2. Frontend Configuration
```bash
cd frontend
npm install
```
Ensure your ROS Bridge is running at the configured IP (default: `10.15.242.12:9090`).

### 3. Run the System
**Start Backend:**
```bash
cd backend
npm run dev
```
**Start Frontend:**
```bash
cd frontend
npm run dev
```

---

## 🛡 Security & Networking
- **Port 5001**: Used for the backend to avoid macOS AirPlay conflicts (Port 5000).
- **CORS**: Enabled for cross-origin communication between the dashboard and database.
- **Payload Limits**: Configured to handle 10MB JSON entities for high-density Lidar point clouds.

---

## 📜 License
This project is licensed under the MIT License - see the LICENSE file for details.

---
**GCsync** — *Precision Control. Infinite Visibility.*
