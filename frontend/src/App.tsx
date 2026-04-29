import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import { useStore } from './store/useStore.ts';
import { eventBus } from './core/observer/EventBus';
import { RosConnection } from './core/websocket/RosConnection';
// Import sensorService to initialize ROS topic subscriptions
import './services/SensorService'; 

function App() {
  const setIsConnected = useStore((state) => state.setIsConnected);

  useEffect(() => {
    // Initial connection
    RosConnection.getInstance().connect();

    // Subscribe to connection events from the EventBus
    const unsubscribe = eventBus.subscribe('ros:connection', (status: boolean) => {
      setIsConnected(status);
    });

    return () => unsubscribe();
  }, [setIsConnected]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
