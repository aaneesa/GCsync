import React from 'react';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { LidarView } from '../visualization/lidar/LidarView';
import { ImuView } from '../visualization/imu/ImuView';
import { EncoderView } from '../visualization/encoder/EncoderView';
import { TelemetryGraph } from '../components/panels/TelemetryGraph';
import { SystemGraph } from '../components/panels/SystemGraph';

const Dashboard: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="grid grid-cols-12 grid-rows-6 gap-4 h-full">
        
        {/* Main Hero Panel - Lidar (Top Focus) */}
        <div className="col-span-8 row-span-4 bento-panel overflow-hidden">
          <LidarView />
        </div>

        {/* System Map (Top Right) */}
        <div className="col-span-4 row-span-3 bento-panel overflow-hidden">
          <SystemGraph />
        </div>

        {/* Telemetry Stack (Bottom Right) */}
        <div className="col-span-4 row-span-3 bento-panel overflow-hidden">
          <TelemetryGraph />
        </div>

        {/* Sensor Data (Bottom Row) */}
        <div className="col-span-4 row-span-2 bento-panel overflow-hidden">
          <ImuView />
        </div>
        
        <div className="col-span-4 row-span-2 bento-panel overflow-hidden">
          <EncoderView />
        </div>

      </div>
    </DashboardLayout>
  );
};

export default Dashboard;