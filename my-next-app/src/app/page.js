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
import Footer from './components/Footer';
import LoginPage from './components/LoginPage';

export default function Home() {
  const [activeView, setActiveView] = useState('dashboard');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
          <div className="flex-1 flex flex-col lg:flex-row">
            {/* Left Section - Dashboard */}
            <div className="w-full lg:w-1/2 bg-gray-900/60 backdrop-blur-sm overflow-auto border-b lg:border-b-0 lg:border-r border-gray-600/30 min-h-[50vh] lg:min-h-full">
              <Dashboard />
            </div>
            
            {/* Right Section - Robot Panel */}
            <div className="w-full lg:w-1/2 bg-gray-800/60 backdrop-blur-sm overflow-auto min-h-[50vh] lg:min-h-full">
              <RobotPanel />
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 flex flex-col">
      {/* Background overlay */}
      <div className="fixed inset-0 bg-gradient-to-br from-blue-600/10 via-purple-500/5 to-cyan-500/10 pointer-events-none"></div>
      <div className="fixed inset-0 bg-gradient-to-br from-blue-400/3 via-transparent to-cyan-400/3 pointer-events-none"></div>
      
      <Header onLogout={handleLogout} isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} />
      <div className="flex flex-1 relative z-10">
        <Navbar 
          activeView={activeView} 
          setActiveView={setActiveView} 
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
        />
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 overflow-auto">
            {renderContent()}
          </div>
          <Footer />
        </div>
      </div>
    </div>
  );
}
