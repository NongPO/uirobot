'use client';

import React, { useState } from 'react';
import { 
  FaSearch, 
  FaBell, 
  FaUser, 
  FaCog, 
  FaChartBar, 
  FaTachometerAlt,
  FaWifi,
  FaBatteryFull,
  FaClock
} from 'react-icons/fa';

const Header = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [notifications] = useState(3);

  const navigationTabs = [
    { id: 'dashboard', label: 'Dashboard', icon: FaTachometerAlt, active: true },
    { id: 'analytics', label: 'Analytics', icon: FaChartBar },
    { id: 'settings', label: 'Settings', icon: FaCog }
  ];

  const getCurrentTime = () => {
    return new Date().toLocaleTimeString('en-US', { 
      hour12: true, 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const [currentTime, setCurrentTime] = useState(getCurrentTime());

  // Update time every second
  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(getCurrentTime());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-slate-900 border-b border-slate-700 shadow-lg">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left Side - Logo and Navigation */}
          <div className="flex items-center space-x-8">
            {/* Logo Section */}
            <div className="flex items-center space-x-3">
              <div>
                <h1 className="text-white font-bold text-xl bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                  RoboDoc System
                </h1>
                <p className="text-gray-400 text-sm">AI Storage Management</p>
              </div>
            </div>
            
            {/* Navigation Tabs */}
            <div className="flex space-x-2">
              {navigationTabs.map((tab) => {
                const IconComponent = tab.icon;
                const isActive = tab.id === activeTab || tab.active;
                
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                      isActive 
                        ? 'bg-blue-500/20 text-blue-400 border border-blue-400/30' 
                        : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                    }`}
                  >
                    <IconComponent className="text-sm" />
                    <span className="text-sm font-medium">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Side - Search, Status, and User Info */}
          <div className="flex items-center space-x-6">
            {/* Search Bar */}
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search robots, levels, or items..."
                className="bg-slate-800 text-white pl-10 pr-4 py-2.5 rounded-lg border border-slate-600 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/20 w-80 transition-all duration-300"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  ×
                </button>
              )}
            </div>

            {/* Status Indicators */}
            <div className="flex items-center space-x-4 text-sm bg-slate-800 px-4 py-2 rounded-lg border border-slate-600">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-green-400 font-medium">Online</span>
              </div>
              
              <div className="w-px h-4 bg-slate-600"></div>
              
              <div className="flex items-center space-x-1 text-cyan-400">
                <FaWifi className="text-xs" />
                <span className="font-medium">95%</span>
              </div>
              
              <div className="w-px h-4 bg-slate-600"></div>
              
              <div className="flex items-center space-x-1 text-blue-400">
                <FaBatteryFull className="text-xs" />
                <span className="font-medium">87%</span>
              </div>
              
              <div className="w-px h-4 bg-slate-600"></div>
              
              <div className="flex items-center space-x-1 text-gray-400">
                <FaClock className="text-xs" />
                <span className="font-mono text-sm">{currentTime}</span>
              </div>
            </div>

            {/* Notification Bell */}
            <div className="relative">
              <button className="p-2 text-gray-400 hover:text-white hover:bg-slate-700 rounded-lg transition-all duration-300">
                <FaBell className="text-lg" />
                {notifications > 0 && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center animate-bounce">
                    <span className="text-white text-xs font-bold">{notifications}</span>
                  </div>
                )}
              </button>
            </div>

            {/* User Profile */}
            <div className="flex items-center space-x-3 bg-slate-800 px-4 py-2 rounded-lg border border-slate-600 hover:border-cyan-400/50 transition-all duration-300 cursor-pointer group">
              <div className="text-right">
                <p className="text-white text-sm font-medium group-hover:text-cyan-400 transition-colors">
                  Dr. Smith
                </p>
                <p className="text-gray-400 text-xs">Administrator</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg ring-2 ring-purple-400/20">
                <span className="text-white font-bold">N</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
