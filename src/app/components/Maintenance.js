'use client';

import React, { useState, useEffect } from 'react';
import { 
  FaWrench,
  FaBatteryHalf,
  FaTemperatureHigh,
  FaWifi,
  FaCog,
  FaExclamationTriangle,
  FaCheckCircle,
  FaTools,
  FaCalendarAlt,
  FaDownload,
  FaClock,
  FaShieldAlt
} from 'react-icons/fa';

const Maintenance = () => {
  const [systemHealth, setSystemHealth] = useState({
    overall: 92,
    battery: 87,
    motors: 94,
    sensors: 89,
    wifi: 95,
    temperature: 42
  });

  const [maintenanceHistory] = useState([
    { id: 1, type: 'Battery Calibration', date: '2025-08-28', status: 'completed', duration: '15 min' },
    { id: 2, type: 'Sensor Cleaning', date: '2025-08-25', status: 'completed', duration: '8 min' },
    { id: 3, type: 'Wheel Alignment', date: '2025-08-20', status: 'completed', duration: '12 min' },
    { id: 4, type: 'Software Update', date: '2025-08-15', status: 'completed', duration: '25 min' }
  ]);

  const [alerts] = useState([
    { id: 1, type: 'warning', message: 'Dust filter needs cleaning', priority: 'medium', time: '2 hours ago' },
    { id: 2, type: 'info', message: 'Firmware update available', priority: 'low', time: '1 day ago' },
    { id: 3, type: 'warning', message: 'Motor bearing maintenance due', priority: 'high', time: '3 days ago' }
  ]);

  const [diagnostics, setDiagnostics] = useState({
    lastRun: '2025-09-01 14:30',
    isRunning: false,
    progress: 0
  });

  const getHealthColor = (value) => {
    if (value >= 90) return 'text-green-400';
    if (value >= 70) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getHealthBgColor = (value) => {
    if (value >= 90) return 'bg-green-400';
    if (value >= 70) return 'bg-yellow-400';
    return 'bg-red-400';
  };

  const runDiagnostics = () => {
    setDiagnostics(prev => ({ ...prev, isRunning: true, progress: 0 }));
    
    const interval = setInterval(() => {
      setDiagnostics(prev => {
        const newProgress = prev.progress + 10;
        if (newProgress >= 100) {
          clearInterval(interval);
          return {
            ...prev,
            isRunning: false,
            progress: 100,
            lastRun: new Date().toLocaleString()
          };
        }
        return { ...prev, progress: newProgress };
      });
    }, 300);
  };

  return (
    <div className="h-full w-full flex flex-col bg-slate-600 min-h-0 overflow-hidden">
      {/* Header */}
      <div className="bg-slate-800 px-6 py-4 border-b border-slate-600 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <FaWrench className="text-orange-400 text-2xl" />
            <h2 className="text-2xl font-bold text-white bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
              Robot Maintenance
            </h2>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-slate-700 px-3 py-1 rounded-lg">
              <FaShieldAlt className="text-green-400" />
              <span className="text-gray-400 text-sm">System Health:</span>
              <span className={`font-bold text-lg ${getHealthColor(systemHealth.overall)}`}>
                {systemHealth.overall}%
              </span>
            </div>
            <button 
              onClick={runDiagnostics}
              disabled={diagnostics.isRunning}
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-600 text-white px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105 disabled:cursor-not-allowed"
            >
              <FaTools />
              <span>{diagnostics.isRunning ? 'Running...' : 'Run Diagnostics'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex min-h-0 overflow-hidden">
        {/* Left Panel - System Health & Diagnostics */}
        <div className="w-1/2 bg-slate-800 border-r border-slate-600 flex flex-col overflow-hidden">
          {/* System Health */}
          <div className="p-6 border-b border-slate-600">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <FaCheckCircle className="text-green-400 mr-2" />
              System Health Monitor
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <FaBatteryHalf className="text-green-400" />
                    <span className="text-gray-300 text-sm">Battery</span>
                  </div>
                  <span className={`font-bold ${getHealthColor(systemHealth.battery)}`}>
                    {systemHealth.battery}%
                  </span>
                </div>
                <div className="w-full bg-gray-600 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${getHealthBgColor(systemHealth.battery)}`}
                    style={{ width: `${systemHealth.battery}%` }}
                  ></div>
                </div>
              </div>

              <div className="bg-slate-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <FaCog className="text-blue-400" />
                    <span className="text-gray-300 text-sm">Motors</span>
                  </div>
                  <span className={`font-bold ${getHealthColor(systemHealth.motors)}`}>
                    {systemHealth.motors}%
                  </span>
                </div>
                <div className="w-full bg-gray-600 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${getHealthBgColor(systemHealth.motors)}`}
                    style={{ width: `${systemHealth.motors}%` }}
                  ></div>
                </div>
              </div>

              <div className="bg-slate-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <FaWifi className="text-cyan-400" />
                    <span className="text-gray-300 text-sm">Sensors</span>
                  </div>
                  <span className={`font-bold ${getHealthColor(systemHealth.sensors)}`}>
                    {systemHealth.sensors}%
                  </span>
                </div>
                <div className="w-full bg-gray-600 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${getHealthBgColor(systemHealth.sensors)}`}
                    style={{ width: `${systemHealth.sensors}%` }}
                  ></div>
                </div>
              </div>

              <div className="bg-slate-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <FaTemperatureHigh className="text-orange-400" />
                    <span className="text-gray-300 text-sm">Temperature</span>
                  </div>
                  <span className="font-bold text-orange-400">
                    {systemHealth.temperature}°C
                  </span>
                </div>
                <div className="w-full bg-gray-600 rounded-full h-2">
                  <div 
                    className="bg-orange-400 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(systemHealth.temperature / 80) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Diagnostics */}
          <div className="p-6 border-b border-slate-600">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <FaTools className="text-blue-400 mr-2" />
              System Diagnostics
            </h3>
            
            <div className="bg-slate-700 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-gray-300">Last Run:</span>
                <span className="text-white font-mono text-sm">{diagnostics.lastRun}</span>
              </div>
              
              {diagnostics.isRunning && (
                <div className="mb-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-gray-300 text-sm">Progress:</span>
                    <span className="text-cyan-400 text-sm">{diagnostics.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-600 rounded-full h-2">
                    <div 
                      className="bg-cyan-400 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${diagnostics.progress}%` }}
                    ></div>
                  </div>
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex items-center space-x-2">
                  <FaCheckCircle className="text-green-400" />
                  <span className="text-gray-300">Hardware Check</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FaCheckCircle className="text-green-400" />
                  <span className="text-gray-300">Software Check</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FaCheckCircle className="text-green-400" />
                  <span className="text-gray-300">Network Test</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FaCheckCircle className="text-green-400" />
                  <span className="text-gray-300">Sensor Calibration</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex-1 p-6 overflow-y-auto">
            <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
            
            <div className="space-y-3">
              <button className="w-full flex items-center space-x-3 bg-green-600 hover:bg-green-500 text-white p-3 rounded-lg transition-all duration-200 hover:scale-105">
                <FaDownload />
                <span>Download Logs</span>
              </button>
              
              <button className="w-full flex items-center space-x-3 bg-blue-600 hover:bg-blue-500 text-white p-3 rounded-lg transition-all duration-200 hover:scale-105">
                <FaCog />
                <span>Calibrate Sensors</span>
              </button>
              
              <button className="w-full flex items-center space-x-3 bg-purple-600 hover:bg-purple-500 text-white p-3 rounded-lg transition-all duration-200 hover:scale-105">
                <FaWrench />
                <span>Reset System</span>
              </button>
              
              <button className="w-full flex items-center space-x-3 bg-orange-600 hover:bg-orange-500 text-white p-3 rounded-lg transition-all duration-200 hover:scale-105">
                <FaTools />
                <span>Maintenance Mode</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Panel - Alerts & History */}
        <div className="w-1/2 bg-slate-800 flex flex-col overflow-hidden">
          {/* Alerts */}
          <div className="p-6 border-b border-slate-600">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <FaExclamationTriangle className="text-yellow-400 mr-2" />
              System Alerts
            </h3>
            
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {alerts.map((alert) => (
                <div key={alert.id} className={`p-3 rounded-lg border-l-4 ${
                  alert.type === 'warning' ? 'bg-yellow-900/30 border-yellow-400' : 'bg-blue-900/30 border-blue-400'
                }`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className={`font-medium ${
                      alert.type === 'warning' ? 'text-yellow-400' : 'text-blue-400'
                    }`}>
                      {alert.message}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded ${
                      alert.priority === 'high' ? 'bg-red-600 text-white' :
                      alert.priority === 'medium' ? 'bg-yellow-600 text-white' :
                      'bg-gray-600 text-gray-300'
                    }`}>
                      {alert.priority}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-gray-400">
                    <FaClock />
                    <span>{alert.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Maintenance History */}
          <div className="flex-1 p-6 overflow-y-auto">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <FaCalendarAlt className="text-green-400 mr-2" />
              Maintenance History
            </h3>
            
            <div className="space-y-3">
              {maintenanceHistory.map((item) => (
                <div key={item.id} className="bg-slate-700 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-white">{item.type}</h4>
                    <span className="flex items-center space-x-1 text-green-400">
                      <FaCheckCircle className="text-xs" />
                      <span className="text-xs">Completed</span>
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-400">
                    <span>{item.date}</span>
                    <span>Duration: {item.duration}</span>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6">
              <button className="w-full flex items-center justify-center space-x-2 bg-slate-600 hover:bg-slate-500 text-white p-3 rounded-lg transition-all duration-200">
                <FaCalendarAlt />
                <span>Schedule Maintenance</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Maintenance;
