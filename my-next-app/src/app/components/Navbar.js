'use client';

import React, { useState } from 'react';
import { 
  FaRobot, 
  FaCube, 
  FaGamepad,
  FaWrench,
  FaChartLine,
  FaBell,
  FaHeartbeat
} from 'react-icons/fa';

const Navbar = ({ activeView, setActiveView, isMobileMenuOpen, setIsMobileMenuOpen }) => {
  const [activeItem, setActiveItem] = useState('shapes');

  const navItems = [
    { 
      id: 'robot', 
      icon: FaRobot, 
      color: 'bg-blue-500',
      isLogo: true
    },
    { 
      id: 'shapes', 
      icon: FaCube, 
      color: 'bg-orange-500',
      indicator: 'bg-orange-400',
      active: activeView === 'dashboard',
      view: 'dashboard',
      tooltip: 'Dashboard'
    },
    { 
      id: 'controller', 
      icon: FaGamepad, 
      color: 'bg-cyan-500',
      indicator: 'bg-cyan-400',
      active: activeView === 'controller',
      view: 'controller',
      tooltip: 'Robot Controller'
    },
    { 
      id: 'maintenance', 
      icon: FaWrench, 
      color: 'bg-orange-500',
      indicator: 'bg-orange-400',
      active: activeView === 'maintenance',
      view: 'maintenance',
      tooltip: 'Maintenance'
    },
    { 
      id: 'analytics', 
      icon: FaChartLine, 
      color: 'bg-blue-500',
      indicator: 'bg-blue-400',
      active: activeView === 'analytics',
      view: 'analytics',
      tooltip: 'Analytics & Monitoring'
    },
    { 
      id: 'alerts', 
      icon: FaBell, 
      color: 'bg-red-500',
      indicator: 'bg-red-400',
      active: activeView === 'alerts',
      view: 'alerts',
      tooltip: 'Alert System'
    },
    { 
      id: 'health', 
      icon: FaHeartbeat, 
      color: 'bg-green-500',
      indicator: 'bg-green-400',
      active: activeView === 'health',
      view: 'health',
      tooltip: 'Health Monitoring'
    }
  ];

  const handleNavClick = (item) => {
    setActiveItem(item.id);
    if (item.view && setActiveView) {
      setActiveView(item.view);
    }
    // Close mobile menu after selection
    if (setIsMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <>
      {/* Desktop Navbar */}
      <div className="hidden lg:flex w-16 h-screen bg-gray-900/80 backdrop-blur-sm flex-col items-center py-4 space-y-3 border-r border-gray-600/50">
        {/* Logo */}
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-xl mb-4 shadow-lg shadow-blue-500/30">
          A
        </div>

        {/* Navigation Items */}
        {navItems.filter(item => !item.isLogo).map((item) => {
          const IconComponent = item.icon;
          const isActive = item.active || item.isActive;
          
          return (
            <div key={item.id} className="relative group">
              <button
                className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-105 border border-gray-600/30 backdrop-blur-sm ${
                  isActive 
                    ? 'bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg shadow-blue-500/30 border-blue-400/50' 
                    : 'bg-gray-800/50 hover:bg-gray-700/70 hover:border-gray-500/50'
                }`}
                onClick={() => handleNavClick(item)}
              >
                <IconComponent className={`text-lg ${isActive ? 'text-white' : 'text-gray-300 group-hover:text-white'}`} />
              </button>
              
              {/* Tooltip */}
              {item.tooltip && (
                <div className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 bg-gray-800/90 backdrop-blur-sm border border-gray-600/50 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none z-50">
                  {item.tooltip}
                </div>
              )}
              
              {/* Status Indicator */}
              {item.indicator && (
                <div className="absolute -right-1 -top-1 w-3 h-3 bg-gradient-to-br from-orange-400 to-red-500 rounded-full border-2 border-gray-800/50"></div>
              )}
              
              {/* Active Glow Effect */}
              {isActive && (
                <div className="absolute -right-1 top-1/2 transform -translate-y-1/2 w-1 h-6 bg-gradient-to-b from-blue-400 to-purple-500 rounded-full"></div>
              )}
            </div>
          );
        })}
        
        {/* Spacer */}
        <div className="flex-1"></div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur-sm border-t border-gray-600/50 z-50">
        <div className="flex justify-around items-center py-2 px-4">
          {navItems.filter(item => !item.isLogo).map((item) => {
            const IconComponent = item.icon;
            const isActive = item.active || item.isActive;
            
            return (
              <button
                key={item.id}
                className={`flex flex-col items-center justify-center p-3 rounded-lg transition-all duration-300 ${
                  isActive 
                    ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg' 
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                }`}
                onClick={() => handleNavClick(item)}
              >
                <IconComponent className="text-lg mb-1" />
                <span className="text-xs font-medium">{item.tooltip || item.id}</span>
                {/* Status Indicator for Mobile */}
                {item.indicator && (
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-gradient-to-br from-orange-400 to-red-500 rounded-full"></div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Navbar;
