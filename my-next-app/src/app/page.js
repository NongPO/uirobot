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
import LoginPage from './components/LoginPage';

export default function Home() {
  const [activeView, setActiveView] = useState('dashboard');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  // If not logged in, show login page
  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />;
  }

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
      <Header onLogout={handleLogout} />
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
