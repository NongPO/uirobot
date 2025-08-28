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
    <div className="w-full h-full bg-gray-700 p-8 flex flex-col items-center justify-center">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Robot Control Panel</h2>
        <p className="text-gray-300">Interactive Status Monitor</p>
      </div>

      {/* Robot Structure */}
      <div className="relative">
        {/* Robot Head/Top */}
        <div className="w-48 h-24 border-4 border-cyan-400 rounded-t-full mx-auto mb-2 bg-gray-800 relative overflow-hidden">
          <div className="absolute inset-4 border-2 border-cyan-300 rounded-t-full">
            {/* Robot Eyes */}
            <div className="flex justify-center items-center h-full space-x-6">
              <div className={`w-4 h-4 rounded-full ${baseStatus.sensors ? 'bg-green-400' : 'bg-red-400'}`}></div>
              <div className={`w-4 h-4 rounded-full ${baseStatus.sensors ? 'bg-green-400' : 'bg-red-400'}`}></div>
            </div>
          </div>
        </div>

        {/* Robot Body with Levels */}
        <div className="w-48 h-80 border-4 border-cyan-400 rounded-3xl mx-auto bg-gray-800 relative p-6">
          <div className="h-full flex flex-col justify-between">
            {robotLevels.map((level) => (
              <button
                key={level.id}
                onClick={() => toggleLevel(level.id)}
                className={`w-full h-16 rounded-xl border-2 transition-all duration-300 hover:scale-105 ${
                  level.active 
                    ? 'border-cyan-400 bg-cyan-900/30' 
                    : 'border-gray-500 bg-gray-600'
                } relative group`}
              >
                <div className="flex items-center justify-between px-4 h-full">
                  <span className="text-white text-2xl font-bold">{level.id}</span>
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${
                      level.color === 'green' ? 'bg-green-500' : 
                      level.color === 'red' ? 'bg-red-500' : 'bg-orange-500'
                    }`}></div>
                    {level.items > 0 && (
                      <span className="text-cyan-400 text-sm">{level.items} items</span>
                    )}
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div className="absolute bottom-2 left-4 right-4 h-1 bg-gray-600 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-500 ${
                      level.active ? 'bg-cyan-400' : 'bg-gray-500'
                    }`}
                    style={{ width: level.active ? '75%' : '25%' }}
                  ></div>
                </div>

                {/* Tooltip */}
                <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-3 py-1 rounded-lg text-sm opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  {level.status}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Robot Base */}
        <div className="w-56 h-16 border-4 border-cyan-400 rounded-lg mx-auto mt-2 bg-gray-800 relative">
          <div className="flex items-center justify-center h-full space-x-8">
            {/* Base Control Buttons */}
            <button
              onClick={() => toggleBaseStatus('power')}
              className={`w-8 h-8 rounded transition-all duration-300 hover:scale-110 ${
                baseStatus.power ? 'bg-green-500' : 'bg-red-500'
              }`}
              title="Power Status"
            ></button>
            
            <button
              onClick={() => toggleBaseStatus('connection')}
              className={`w-12 h-6 rounded-full transition-all duration-300 hover:scale-110 ${
                baseStatus.connection ? 'bg-blue-500' : 'bg-gray-500'
              }`}
              title="Connection Status"
            ></button>
            
            <button
              onClick={() => toggleBaseStatus('sensors')}
              className={`w-8 h-8 rounded transition-all duration-300 hover:scale-110 ${
                baseStatus.sensors ? 'bg-cyan-500' : 'bg-orange-500'
              }`}
              title="Sensor Status"
            ></button>
          </div>
        </div>

        {/* Robot Wheels */}
        <div className="flex justify-between w-56 mx-auto mt-2">
          <div className="w-6 h-6 bg-cyan-400 rounded-full border-2 border-cyan-300"></div>
          <div className="w-6 h-6 bg-cyan-400 rounded-full border-2 border-cyan-300"></div>
          <div className="w-6 h-6 bg-cyan-400 rounded-full border-2 border-cyan-300"></div>
        </div>
      </div>

      {/* Status Indicators */}
      <div className="mt-8 flex justify-center space-x-4">
        <div className={`w-4 h-4 rounded-full ${baseStatus.power ? 'bg-green-500' : 'bg-red-500'}`}></div>
        <div className={`w-4 h-4 rounded-full ${baseStatus.connection ? 'bg-blue-500' : 'bg-gray-500'}`}></div>
        <div className={`w-4 h-4 rounded-full ${baseStatus.sensors ? 'bg-cyan-500' : 'bg-orange-500'}`}></div>
      </div>

      {/* Control Info */}
      <div className="mt-6 text-center">
        <p className="text-gray-300 text-sm">Click levels to toggle status</p>
        <p className="text-gray-400 text-xs">Hover for details</p>
      </div>
    </div>
  );
};

export default RobotPanel;
