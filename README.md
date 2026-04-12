Ground Control Dashboard (GCsync)

A real-time robotics control and monitoring dashboard designed using modern frontend architecture and strong software engineering principles. The system enables an operator to control, monitor, and visualize robot behavior using live telemetry data.

Overview

The application follows a structured data flow:

Robot Hardware → Telemetry → WebSocket → CommBridge → Zustand Store → UI Panels

UI components do not fetch data directly. All data is managed through a centralized state for consistency and scalability.

Tech Stack
Next.js (App Router)
React with TypeScript
Zustand (state management)
Tailwind CSS with ShadCN UI
WebSocket (real-time communication)
React Three Fiber (LiDAR visualization)
Recharts (telemetry graphs)
System Design

The system is modeled using:

ER Diagram for data relationships
Class diagrams for robot and dashboard layers
Use case diagram for operator interactions

The architecture reflects strong use of object-oriented design and modular separation of concerns.

OOP Structure
Abstract Base Class

DashboardPanel defines common behavior:

panelTitle
isVisible
updatePanel(), show(), hide()
Derived Panels
ControlPanel: handles robot movement and emergency stop
SpatialVisualizer: renders LiDAR and IMU data
HealthMonitor: tracks battery and encoder health
Design Patterns
Factory Pattern (Sensor System)

Used to create sensor objects such as IMU, LiDAR, and Encoder through a common interface.

Promotes extensibility (Open/Closed Principle)
Ensures consistent behavior across sensor types (Liskov Substitution)
Decouples object creation from usage (Dependency Inversion)
Singleton Pattern (CommBridge)

Used for managing WebSocket communication.

Ensures a single active connection
Centralizes message handling and parsing
Prevents inconsistent communication states
Core Components
RobotState

Acts as the single source of truth for:

motor data
sensor flags
CommBridge

Handles:

WebSocket connection
incoming telemetry parsing
outgoing command transmission
Panels

All UI panels subscribe to global state and update reactively.

UI Layout
Top Bar: connection status, emergency stop, robot state
Left Panel: control inputs (arm/disarm, speed, movement)
Center Panel: LiDAR and spatial visualization
Right Panel: health monitoring and alerts
Bottom Panel: telemetry graphs, logs, export
Functional Behavior
Real-time updates via WebSocket
Emergency stop has highest priority
Controls disabled when disconnected
Alerts for low battery and sensor failures
Optimized rendering for smooth UI updates
Project Structure
/src
 ├── app/
 ├── components/
 ├── panels/
 ├── core/
 ├── store/
 ├── hooks/
 ├── lib/
SDLC Approach
Requirement analysis using use case diagram
System design using ER and class diagrams
Implementation with modular architecture
Testing via component and state validation
Future Enhancements
Autonomous navigation support
AI-based anomaly detection
Cloud-based telemetry storage
Camera integration
