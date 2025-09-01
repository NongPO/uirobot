'use client';

import React, { useState } from 'react';
import { 
  FaRobot, 
  FaCube, 
  FaPen, 
  FaEye, 
  FaNetworkWired, 
  FaBrain, 
  FaComments, 
  FaImage,
  FaGamepad
} from 'react-icons/fa';

const Navbar = ({ activeView, setActiveView }) => {
  const [activeItem, setActiveItem] = useState('shapes');

  const navItems = [
    { 
      id: 'robot', 
      icon: FaRobot, 
      color: 'bg-blue-500',
      isLogo: true
    },
    { 
      id: 'network', 
      icon: FaNetworkWired, 
      color: 'bg-gray-600',
      indicator: 'bg-blue-400'
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
      id: 'pen', 
      icon: FaPen, 
      color: 'bg-yellow-500',
      indicator: 'bg-yellow-400',
      tooltip: 'Design Tools'
    },
    { 
      id: 'vision', 
      icon: FaEye, 
      color: 'bg-cyan-500',
      indicator: 'bg-cyan-400',
      tooltip: 'Vision System'
    },
    { 
      id: 'ai', 
      icon: FaBrain, 
      color: 'bg-purple-500',
      indicator: 'bg-purple-400'
    },
    { 
      id: 'chat', 
      icon: FaComments, 
      color: 'bg-pink-500',
      indicator: 'bg-pink-400'
    },
    { 
      id: 'active', 
      icon: FaBrain, 
      color: 'bg-green-500',
      indicator: 'bg-green-400',
      isActive: true
    },
    { 
      id: 'network2', 
      icon: FaNetworkWired, 
      color: 'bg-gray-600',
      indicator: 'bg-blue-400'
    },
    { 
      id: 'image', 
      icon: FaImage, 
      color: 'bg-gray-600'
    }
  ];

  return (
    <div className="w-16 h-screen bg-gray-900 flex flex-col items-center py-4 space-y-3 border-r border-gray-700">
      {/* Logo */}
      <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center text-white font-bold text-xl mb-4">
        A
      </div>

      {/* Navigation Items */}
      {navItems.filter(item => !item.isLogo).map((item) => {
        const IconComponent = item.icon;
        const isActive = item.active || item.isActive;
        
        return (
          <div key={item.id} className="relative group">
            <button
              className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-105 ${
                isActive 
                  ? `${item.color} shadow-lg` 
                  : item.isActive 
                    ? `${item.color} shadow-lg`
                    : 'bg-gray-800 hover:bg-gray-700'
              }`}
              onClick={() => {
                setActiveItem(item.id);
                if (item.view && setActiveView) {
                  setActiveView(item.view);
                }
              }}
            >
              <IconComponent className="text-white text-lg" />
            </button>
            
            {/* Tooltip */}
            {item.tooltip && (
              <div className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none z-50">
                {item.tooltip}
              </div>
            )}
            
            {/* Status Indicator */}
            {item.indicator && (
              <div className={`absolute -right-1 -top-1 w-3 h-3 ${item.indicator} rounded-full border-2 border-gray-900`}></div>
            )}
            
            {/* Active Glow Effect */}
            {isActive && (
              <div className={`absolute inset-0 ${item.color} rounded-xl opacity-30 blur-sm`}></div>
            )}
          </div>
        );
      })}
      
      {/* Spacer */}
      <div className="flex-1"></div>
      
      {/* Bottom Icons */}
      <div className="space-y-3">
        <button className="w-12 h-12 bg-gray-700 rounded-xl flex items-center justify-center hover:bg-gray-600 transition-colors">
          <FaComments className="text-white text-lg" />
        </button>
        <button className="w-12 h-12 bg-gray-700 rounded-xl flex items-center justify-center hover:bg-gray-600 transition-colors">
          <FaImage className="text-white text-lg" />
        </button>
      </div>
    </div>
  );
};

export default Navbar;
