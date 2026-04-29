import React from 'react';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { LidarView } from '../visualization/lidar/LidarView';
import { ImuView } from '../visualization/imu/ImuView';
import { EncoderView } from '../visualization/encoder/EncoderView';
import { SystemGraph } from '../components/panels/SystemGraph';
import { SessionPanel } from '../components/panels/SessionPanel';
import { CmdControl } from '../components/controls/CmdControl';

const Dashboard: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="relative p-1">
        {/* Decorative HUD Corners for the entire dashboard */}
        <div className="hud-corner hud-corner-tl" />
        <div className="hud-corner hud-corner-tr" />
        <div className="hud-corner hud-corner-bl" />
        <div className="hud-corner hud-corner-br" />

        <div className="hud-container grid grid-cols-12 overflow-hidden bg-black/20">
          
          {/* Main Hero Panel - Lidar */}
          <div className="col-span-12 lg:col-span-8 h-[600px] border-r border-divider">
            <LidarView />
          </div>

          {/* Right Sidebar - Controls & Session */}
          <div className="col-span-12 lg:col-span-4 flex flex-col">
            <div className="h-1/2 border-b border-divider">
              <CmdControl />
            </div>
            <div className="h-1/2">
              <SessionPanel />
            </div>
          </div>

          {/* Bottom Row - IMU, Encoder & Graph */}
          <div className="col-span-12 lg:col-span-4 h-[320px] border-t border-r border-divider">
            <ImuView />
          </div>
          
          <div className="col-span-12 lg:col-span-4 h-[320px] border-t border-r border-divider">
            <EncoderView />
          </div>

          <div className="col-span-12 lg:col-span-4 h-[320px] border-t border-divider">
            <SystemGraph />
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
