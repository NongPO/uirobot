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
  FaClock,
  FaSignOutAlt,
  FaBars
} from 'react-icons/fa';

const Header = ({ onLogout, isMobileMenuOpen, setIsMobileMenuOpen }) => {
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
    <div className="bg-gray-900/80 backdrop-blur-sm border-b border-gray-600/50 shadow-lg relative z-20">
      <div className="px-3 sm:px-4 lg:px-6 py-2 sm:py-3 lg:py-4">
        <div className="flex items-center justify-between">
          {/* Mobile Logo */}
          <div className="flex items-center md:hidden">
            <div className="w-7 sm:w-8 h-7 sm:h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-xs sm:text-sm mr-2 sm:mr-3">
              A
            </div>
            <div>
              <h1 className="text-white font-bold text-sm sm:text-lg">RoboDoc</h1>
              <p className="text-gray-400 text-xs">AI Storage</p>
            </div>
          </div>

          {/* Tablet & Desktop Logo and Navigation */}
          <div className="hidden md:flex items-center space-x-4 lg:space-x-8">
            {/* Logo Section */}
            <div className="flex items-center space-x-3">
              <div>
                <h1 className="text-white font-bold text-lg xl:text-xl bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                  RoboDoc System
                </h1>
                <p className="text-gray-400 text-xs sm:text-sm">AI Storage Management</p>
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
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white border border-blue-400/30 shadow-lg shadow-blue-500/25' 
                        : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                    }`}
                  >
                    <IconComponent className="text-sm" />
                    <span className="text-sm font-medium">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Mobile Menu Button and Status */}
          <div className="flex items-center space-x-3 lg:hidden">
            {/* Mobile Status Indicator */}
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-green-400 text-xs font-medium">ONLINE</span>
            </div>
            
            {/* Mobile Menu Toggle */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-300 hover:text-white p-2 rounded-lg hover:bg-gray-700/50 transition-colors"
            >
              <FaBars className="text-lg" />
            </button>
          </div>

          {/* Desktop Right Side - Search, Status and Profile */}
          <div className="hidden lg:flex items-center space-x-6">
            {/* Search Bar */}
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search robots, levels, or items..."
                className="bg-gray-800/60 backdrop-blur-sm text-white pl-10 pr-4 py-2.5 rounded-lg border border-gray-600/50 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/20 w-80 transition-all duration-300"
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
            <div className="flex items-center space-x-4 text-sm bg-gray-800/60 backdrop-blur-sm px-4 py-2 rounded-lg border border-gray-600/50">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-green-400 font-medium">Online</span>
              </div>
              
              <div className="w-px h-4 bg-gray-600/50"></div>
              
              <div className="flex items-center space-x-1 text-cyan-400">
                <FaWifi className="text-xs" />
                <span className="font-medium">95%</span>
              </div>
              
              <div className="w-px h-4 bg-gray-600/50"></div>
              
              <div className="flex items-center space-x-1 text-blue-400">
                <FaBatteryFull className="text-xs" />
                <span className="font-medium">87%</span>
              </div>
              
              <div className="w-px h-4 bg-gray-600/50"></div>
              
              <div className="flex items-center space-x-1 text-gray-300">
                <FaClock className="text-xs" />
                <span className="font-mono text-sm">{currentTime}</span>
              </div>
            </div>

            {/* Notification Bell */}
            <div className="relative">
              <button className="p-2 text-gray-300 hover:text-white hover:bg-gray-700/50 rounded-lg transition-all duration-300">
                <FaBell className="text-lg" />
                {notifications > 0 && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center animate-bounce">
                    <span className="text-white text-xs font-bold">{notifications}</span>
                  </div>
                )}
              </button>
            </div>

            {/* User Profile */}
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-3 bg-gray-800/60 backdrop-blur-sm px-4 py-2 rounded-lg border border-gray-600/50 hover:border-blue-400/50 transition-all duration-300 cursor-pointer group">
                <div className="text-right">
                  <p className="text-white text-sm font-medium group-hover:text-blue-400 transition-colors">
                    Dr. Smith
                  </p>
                  <p className="text-gray-300 text-xs">Administrator</p>
                </div>
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg ring-2 ring-blue-400/20">
                  <span className="text-white font-bold">N</span>
                </div>
              </div>
              
              {/* Logout Button */}
              <button
                onClick={onLogout}
                className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 rounded-lg border border-red-400/30 hover:border-red-400 transition-all duration-300 group shadow-lg"
                title="ออกจากระบบ"
              >
                <FaSignOutAlt className="text-white text-sm group-hover:scale-110 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
