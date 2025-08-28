'use client';

import React, { useState } from 'react';

const RobotPanel = () => {
  const [robotLevels, setRobotLevels] = useState([
    { id: 1, active: true, status: 'Active', items: 3, color: 'green' },
    { id: 2, active: false, status: 'Inactive', items: 0, color: 'red' },
    { id: 3, active: true, status: 'Processing', items: 4, color: 'green' },
    { id: 4, active: false, status: 'Standby', items: 0, color: 'orange' }
  ]);

  const [baseStatus, setBaseStatus] = useState({
    power: true,
    connection: true,
    sensors: false
  });

  const toggleLevel = (id) => {
    setRobotLevels(prev => 
      prev.map(level => 
        level.id === id 
          ? { ...level, active: !level.active, color: !level.active ? 'green' : 'red' }
          : level
      )
    );
  };

  const toggleBaseStatus = (type) => {
    setBaseStatus(prev => ({ ...prev, [type]: !prev[type] }));
  };

  return (
    <div className="w-full h-full bg-slate-700 p-8 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/20 via-transparent to-blue-900/20"></div>
      
      <div className="relative z-10 text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-2 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
          Robot Control Panel
        </h2>
        <p className="text-gray-300 font-medium">Interactive Status Monitor</p>
      </div>

      {/* Robot Structure */}
      <div className="relative">
        {/* Robot Head/Top with enhanced styling */}
        <div className="w-56 h-28 border-4 border-cyan-400 rounded-t-full mx-auto mb-2 bg-slate-800/80 backdrop-blur-sm relative overflow-hidden shadow-xl shadow-cyan-400/20">
          <div className="absolute inset-0 bg-gradient-to-b from-cyan-400/10 to-transparent"></div>
          <div className="absolute inset-6 border-2 border-cyan-300/60 rounded-t-full">
            {/* Robot Eyes with enhanced glow */}
            <div className="flex justify-center items-center h-full space-x-8">
              <div className={`w-5 h-5 rounded-full transition-all duration-500 ${
                baseStatus.sensors ? 'bg-green-400 shadow-lg shadow-green-400/50' : 'bg-red-400 shadow-lg shadow-red-400/50'
              }`}></div>
              <div className={`w-5 h-5 rounded-full transition-all duration-500 ${
                baseStatus.sensors ? 'bg-green-400 shadow-lg shadow-green-400/50' : 'bg-red-400 shadow-lg shadow-red-400/50'
              }`}></div>
            </div>
          </div>
        </div>

        {/* Robot Body with Levels - Enhanced */}
        <div className="w-56 h-96 border-4 border-cyan-400 rounded-3xl mx-auto bg-slate-800/80 backdrop-blur-sm relative p-6 shadow-xl shadow-cyan-400/20">
          <div className="absolute inset-0 bg-gradient-to-b from-cyan-400/5 to-blue-400/5 rounded-3xl"></div>
          <div className="h-full flex flex-col justify-between relative z-10">
            {robotLevels.map((level) => (
              <button
                key={level.id}
                onClick={() => toggleLevel(level.id)}
                className={`w-full h-20 rounded-xl border-2 transition-all duration-500 hover:scale-105 transform ${
                  level.active 
                    ? 'border-cyan-400 bg-gradient-to-r from-cyan-900/40 to-blue-900/40 shadow-lg shadow-cyan-400/30' 
                    : 'border-gray-500 bg-slate-600/50 hover:border-gray-400'
                } relative group backdrop-blur-sm`}
              >
                <div className="flex items-center justify-between px-6 h-full">
                  <span className="text-white text-3xl font-bold">{level.id}</span>
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded-full transition-all duration-500 ${
                      level.color === 'green' ? 'bg-green-500 shadow-lg shadow-green-500/50' : 
                      level.color === 'red' ? 'bg-red-500 shadow-lg shadow-red-500/50' : 'bg-orange-500 shadow-lg shadow-orange-500/50'
                    }`}></div>
                    {level.items > 0 && (
                      <span className="text-cyan-400 text-sm font-medium">{level.items} items</span>
                    )}
                  </div>
                </div>
                
                {/* Enhanced Progress Bar */}
                <div className="absolute bottom-3 left-6 right-6 h-1.5 bg-slate-600/50 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-1000 ${
                      level.active ? 'bg-gradient-to-r from-cyan-400 to-blue-400 shadow-sm' : 'bg-gray-500'
                    }`}
                    style={{ width: level.active ? '75%' : '25%' }}
                  ></div>
                </div>

                {/* Enhanced Tooltip */}
                <div className="absolute -top-14 left-1/2 transform -translate-x-1/2 bg-slate-900/90 backdrop-blur-sm text-white px-4 py-2 rounded-lg text-sm opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none border border-cyan-400/30">
                  {level.status}
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full border-4 border-transparent border-t-slate-900/90"></div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Robot Base - Enhanced */}
        <div className="w-64 h-20 border-4 border-cyan-400 rounded-2xl mx-auto mt-2 bg-slate-800/80 backdrop-blur-sm relative shadow-xl shadow-cyan-400/20">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/5 to-blue-400/5 rounded-2xl"></div>
          <div className="flex items-center justify-center h-full space-x-10 relative z-10">
            {/* Enhanced Base Control Buttons */}
            <button
              onClick={() => toggleBaseStatus('power')}
              className={`w-10 h-10 rounded-lg transition-all duration-500 hover:scale-125 transform ${
                baseStatus.power ? 'bg-green-500 shadow-lg shadow-green-500/50' : 'bg-red-500 shadow-lg shadow-red-500/50'
              } border-2 border-white/20`}
              title="Power Status"
            ></button>
            
            <button
              onClick={() => toggleBaseStatus('connection')}
              className={`w-16 h-8 rounded-full transition-all duration-500 hover:scale-125 transform ${
                baseStatus.connection ? 'bg-blue-500 shadow-lg shadow-blue-500/50' : 'bg-gray-500 shadow-lg shadow-gray-500/50'
              } border-2 border-white/20`}
              title="Connection Status"
            ></button>
            
            <button
              onClick={() => toggleBaseStatus('sensors')}
              className={`w-10 h-10 rounded-lg transition-all duration-500 hover:scale-125 transform ${
                baseStatus.sensors ? 'bg-cyan-500 shadow-lg shadow-cyan-500/50' : 'bg-orange-500 shadow-lg shadow-orange-500/50'
              } border-2 border-white/20`}
              title="Sensor Status"
            ></button>
          </div>
        </div>

        {/* Robot Wheels - Enhanced */}
        <div className="flex justify-between w-64 mx-auto mt-4">
          {[...Array(3)].map((_, index) => (
            <div 
              key={index}
              className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full border-2 border-cyan-300 shadow-lg shadow-cyan-400/30 animate-pulse"
              style={{ animationDelay: `${index * 0.2}s` }}
            ></div>
          ))}
        </div>
      </div>

      {/* Enhanced Status Indicators */}
      <div className="mt-10 flex justify-center space-x-6">
        {[
          { status: baseStatus.power, color: baseStatus.power ? 'green' : 'red' },
          { status: baseStatus.connection, color: baseStatus.connection ? 'blue' : 'gray' },
          { status: baseStatus.sensors, color: baseStatus.sensors ? 'cyan' : 'orange' }
        ].map((indicator, index) => (
          <div 
            key={index}
            className={`w-5 h-5 rounded-full transition-all duration-500 ${
              indicator.color === 'green' ? 'bg-green-500 shadow-lg shadow-green-500/50' :
              indicator.color === 'blue' ? 'bg-blue-500 shadow-lg shadow-blue-500/50' :
              indicator.color === 'cyan' ? 'bg-cyan-500 shadow-lg shadow-cyan-500/50' :
              indicator.color === 'orange' ? 'bg-orange-500 shadow-lg shadow-orange-500/50' :
              indicator.color === 'red' ? 'bg-red-500 shadow-lg shadow-red-500/50' :
              'bg-gray-500 shadow-lg shadow-gray-500/50'
            }`}
          ></div>
        ))}
      </div>

      {/* Enhanced Control Info */}
      <div className="mt-8 text-center">
        <p className="text-gray-300 text-sm font-medium">Click levels to toggle status</p>
        <p className="text-gray-400 text-xs mt-1">Hover for details</p>
      </div>
    </div>
  );
};

export default RobotPanel;
