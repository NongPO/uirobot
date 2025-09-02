'use client';

import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import RobotPanel from './components/RobotPanel';
import Controller from './components/Controller';
import Maintenance from './components/Maintenance';
import Analytics from './components/Analytics';
import AlertSystem from './components/AlertSystem';
import HealthMonitoring from './components/HealthMonitoring';
import Header from './components/Header';

export default function Home() {
  const [activeView, setActiveView] = useState('dashboard');

  const renderContent = () => {
    switch(activeView) {
      case 'controller':
        return <Controller />;
      case 'maintenance':
        return <Maintenance />;
      case 'analytics':
        return <Analytics />;
      case 'alerts':
        return <AlertSystem />;
      case 'health':
        return <HealthMonitoring />;
      case 'dashboard':
      default:
        return (
          <div className="flex-1 flex">
            {/* Left Section - Dashboard */}
            <div className="w-1/2 bg-gray-800 overflow-auto">
              <Dashboard />
            </div>
            
            {/* Right Section - Robot Panel */}
            <div className="w-1/2 bg-gray-700 overflow-auto">
              <RobotPanel />
            </div>
          </div>
        );
    }
  };

  return (
    <div className="h-screen bg-gray-900 flex flex-col">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Navbar activeView={activeView} setActiveView={setActiveView} />
        {/* Main Content Area */}
        <div className="flex-1 overflow-auto">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
