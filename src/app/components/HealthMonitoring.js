'use client';

import { useState, useEffect } from 'react';
import { 
  FaHeartbeat, 
  FaBatteryFull, 
  FaThermometerHalf, 
  FaCogs,
  FaEye,
  FaWifi,
  FaMicrochip,
  FaMemory,
  FaHdd,
  FaRocket,
  FaExclamationTriangle,
  FaCheckCircle,
  FaTimesCircle,
  FaPlay,
  FaPause,
  FaDownload,
  FaChartLine,
  FaTachometerAlt,
  FaRobot
} from 'react-icons/fa';

export default function HealthMonitoring() {
  const [isMonitoring, setIsMonitoring] = useState(true);
  const [selectedTimeRange, setSelectedTimeRange] = useState('1h');
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Real-time health data
  const [healthData, setHealthData] = useState({
    overall: 87,
    battery: {
      level: 85,
      voltage: 24.3,
      current: 2.1,
      temperature: 35,
      cycleCount: 147,
      status: 'Good'
    },
    motors: {
      leftWheel: { health: 92, temperature: 42, rpm: 150, current: 1.2, status: 'Excellent' },
      rightWheel: { health: 89, temperature: 45, rpm: 148, current: 1.3, status: 'Good' },
      armBase: { health: 94, temperature: 38, rpm: 0, current: 0.1, status: 'Excellent' },
      armElbow: { health: 87, temperature: 41, rpm: 0, current: 0.0, status: 'Good' }
    },
    sensors: {
      lidar: { health: 95, temperature: 32, dataRate: 100, errors: 0, status: 'Excellent' },
      camera: { health: 88, temperature: 40, fps: 30, errors: 2, status: 'Good' },
      imu: { health: 91, temperature: 35, frequency: 100, errors: 0, status: 'Good' },
      gps: { health: 78, temperature: 38, satellites: 8, accuracy: 2.1, status: 'Fair' }
    },
    system: {
      cpu: { usage: 45, temperature: 65, frequency: 2400, status: 'Good' },
      memory: { usage: 62, total: 8192, available: 3113, status: 'Good' },
      storage: { usage: 34, total: 256, available: 169, status: 'Excellent' },
      network: { strength: 88, latency: 15, status: 'Good' }
    },
    environmental: {
      ambientTemp: 24,
      humidity: 45,
      pressure: 1013,
      altitude: 156
    }
  });

  // Health history for charts (mock data)
  const [healthHistory, setHealthHistory] = useState([
    { time: '10:00', overall: 89, battery: 92, motors: 87, sensors: 91, system: 85 },
    { time: '10:15', overall: 88, battery: 90, motors: 89, sensors: 89, system: 87 },
    { time: '10:30', overall: 87, battery: 88, motors: 88, sensors: 90, system: 84 },
    { time: '10:45', overall: 86, battery: 85, motors: 87, sensors: 88, system: 86 },
    { time: '11:00', overall: 87, battery: 85, motors: 92, sensors: 95, system: 88 }
  ]);

  // Simulate real-time data updates
  useEffect(() => {
    if (!isMonitoring || !autoRefresh) return;

    const interval = setInterval(() => {
      setHealthData(prev => ({
        ...prev,
        overall: Math.max(70, Math.min(95, prev.overall + (Math.random() - 0.5) * 2)),
        battery: {
          ...prev.battery,
          level: Math.max(0, prev.battery.level - Math.random() * 0.1),
          voltage: 24.3 + (Math.random() - 0.5) * 0.5,
          current: 2.1 + (Math.random() - 0.5) * 0.3,
          temperature: 35 + (Math.random() - 0.5) * 2
        },
        motors: {
          leftWheel: {
            ...prev.motors.leftWheel,
            health: Math.max(80, Math.min(95, prev.motors.leftWheel.health + (Math.random() - 0.5) * 1)),
            temperature: 42 + (Math.random() - 0.5) * 3,
            rpm: 150 + (Math.random() - 0.5) * 10
          },
          rightWheel: {
            ...prev.motors.rightWheel,
            health: Math.max(80, Math.min(95, prev.motors.rightWheel.health + (Math.random() - 0.5) * 1)),
            temperature: 45 + (Math.random() - 0.5) * 3,
            rpm: 148 + (Math.random() - 0.5) * 10
          }
        },
        system: {
          ...prev.system,
          cpu: {
            ...prev.system.cpu,
            usage: Math.max(20, Math.min(80, prev.system.cpu.usage + (Math.random() - 0.5) * 5)),
            temperature: 65 + (Math.random() - 0.5) * 5
          },
          memory: {
            ...prev.system.memory,
            usage: Math.max(40, Math.min(85, prev.system.memory.usage + (Math.random() - 0.5) * 3))
          }
        }
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, [isMonitoring, autoRefresh]);

  const getHealthColor = (value) => {
    if (value >= 90) return 'text-green-400';
    if (value >= 80) return 'text-yellow-400';
    if (value >= 70) return 'text-orange-400';
    return 'text-red-400';
  };

  const getHealthStatus = (value) => {
    if (value >= 90) return { text: 'Excellent', color: 'bg-green-500' };
    if (value >= 80) return { text: 'Good', color: 'bg-yellow-500' };
    if (value >= 70) return { text: 'Fair', color: 'bg-orange-500' };
    return { text: 'Poor', color: 'bg-red-500' };
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'excellent':
      case 'good':
        return <FaCheckCircle className="text-green-400" />;
      case 'fair':
        return <FaExclamationTriangle className="text-yellow-400" />;
      case 'poor':
        return <FaTimesCircle className="text-red-400" />;
      default:
        return <FaCheckCircle className="text-gray-400" />;
    }
  };

  return (
    <div className="h-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 overflow-auto">
      <div className="w-full max-w-none mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2 flex items-center">
              <FaHeartbeat className="mr-3 text-green-400" />
              Real-time Health Monitoring
            </h1>
            <p className="text-gray-400">Comprehensive system health and performance monitoring</p>
          </div>

          <div className="flex items-center space-x-4 mt-4 sm:mt-0">
            {/* Time Range */}
            <select 
              value={selectedTimeRange}
              onChange={(e) => setSelectedTimeRange(e.target.value)}
              className="bg-slate-700 text-white px-3 py-2 rounded-lg border border-slate-600 focus:border-blue-400 focus:outline-none"
            >
              <option value="1h">Last Hour</option>
              <option value="6h">Last 6 Hours</option>
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
            </select>

            {/* Auto Refresh Toggle */}
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`flex items-center px-4 py-2 rounded-lg transition-all duration-200 ${
                autoRefresh 
                  ? 'bg-green-600 hover:bg-green-700 text-white' 
                  : 'bg-slate-600 hover:bg-slate-500 text-gray-300'
              }`}
            >
              {autoRefresh ? <FaPlay className="mr-2" /> : <FaPause className="mr-2" />}
              Auto Refresh
            </button>

            {/* Monitoring Toggle */}
            <button
              onClick={() => setIsMonitoring(!isMonitoring)}
              className={`flex items-center px-4 py-2 rounded-lg transition-all duration-200 ${
                isMonitoring 
                  ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                  : 'bg-slate-600 hover:bg-slate-500 text-gray-300'
              }`}
            >
              <FaHeartbeat className="mr-2" />
              {isMonitoring ? 'Monitoring' : 'Stopped'}
            </button>
          </div>
        </div>

        {/* Overall Health Status */}
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white flex items-center">
              <FaRobot className="mr-3 text-blue-400" />
              Overall System Health
            </h2>
            <div className="flex items-center space-x-4">
              <div className={`px-4 py-2 rounded-lg ${getHealthStatus(healthData.overall).color}`}>
                <span className="text-white font-semibold">{getHealthStatus(healthData.overall).text}</span>
              </div>
              <div className={`text-4xl font-bold ${getHealthColor(healthData.overall)}`}>
                {healthData.overall}%
              </div>
            </div>
          </div>
          <div className="bg-slate-700 rounded-full h-4">
            <div 
              className={`h-4 rounded-full transition-all duration-500 ${
                healthData.overall >= 90 ? 'bg-green-400' :
                healthData.overall >= 80 ? 'bg-yellow-400' :
                healthData.overall >= 70 ? 'bg-orange-400' : 'bg-red-400'
              }`}
              style={{ width: `${healthData.overall}%` }}
            />
          </div>
        </div>

        {/* System Components Health */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Battery Health */}
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
              <FaBatteryFull className="mr-3 text-green-400" />
              Battery System
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Charge Level</span>
                <span className={`font-semibold ${getHealthColor(healthData.battery.level)}`}>
                  {healthData.battery.level.toFixed(1)}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Voltage</span>
                <span className="text-white font-semibold">{healthData.battery.voltage.toFixed(1)}V</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Current</span>
                <span className="text-white font-semibold">{healthData.battery.current.toFixed(1)}A</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Temperature</span>
                <span className="text-white font-semibold">{healthData.battery.temperature}°C</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Cycle Count</span>
                <span className="text-white font-semibold">{healthData.battery.cycleCount}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Status</span>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(healthData.battery.status)}
                  <span className="text-white font-semibold">{healthData.battery.status}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Motor Health */}
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
              <FaCogs className="mr-3 text-blue-400" />
              Motor Systems
            </h3>
            <div className="space-y-4">
              {Object.entries(healthData.motors).map(([motorName, motor]) => (
                <div key={motorName} className="bg-slate-700 rounded-lg p-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-300 font-medium">
                      {motorName.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </span>
                    <span className={`font-semibold ${getHealthColor(motor.health)}`}>
                      {motor.health}%
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="text-gray-400">Temp: <span className="text-white">{motor.temperature}°C</span></div>
                    <div className="text-gray-400">RPM: <span className="text-white">{motor.rpm}</span></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sensors and System Health */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Sensor Health */}
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
              <FaEye className="mr-3 text-purple-400" />
              Sensor Systems
            </h3>
            <div className="space-y-4">
              {Object.entries(healthData.sensors).map(([sensorName, sensor]) => (
                <div key={sensorName} className="bg-slate-700 rounded-lg p-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-300 font-medium">
                      {sensorName.toUpperCase()}
                    </span>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(sensor.status)}
                      <span className={`font-semibold ${getHealthColor(sensor.health)}`}>
                        {sensor.health}%
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="text-gray-400">Temp: <span className="text-white">{sensor.temperature}°C</span></div>
                    <div className="text-gray-400">Errors: <span className="text-white">{sensor.errors}</span></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* System Health */}
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
              <FaMicrochip className="mr-3 text-cyan-400" />
              System Performance
            </h3>
            <div className="space-y-4">
              {/* CPU */}
              <div className="bg-slate-700 rounded-lg p-3">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-300 font-medium">CPU</span>
                  <span className={`font-semibold ${getHealthColor(100 - healthData.system.cpu.usage)}`}>
                    {healthData.system.cpu.usage}% Usage
                  </span>
                </div>
                <div className="bg-slate-600 rounded-full h-2 mb-2">
                  <div 
                    className="bg-blue-400 h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${healthData.system.cpu.usage}%` }}
                  />
                </div>
                <div className="text-sm text-gray-400">
                  Temp: {healthData.system.cpu.temperature}°C | Freq: {healthData.system.cpu.frequency}MHz
                </div>
              </div>

              {/* Memory */}
              <div className="bg-slate-700 rounded-lg p-3">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-300 font-medium">Memory</span>
                  <span className={`font-semibold ${getHealthColor(100 - healthData.system.memory.usage)}`}>
                    {healthData.system.memory.usage}% Used
                  </span>
                </div>
                <div className="bg-slate-600 rounded-full h-2 mb-2">
                  <div 
                    className="bg-yellow-400 h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${healthData.system.memory.usage}%` }}
                  />
                </div>
                <div className="text-sm text-gray-400">
                  Available: {healthData.system.memory.available}MB / {healthData.system.memory.total}MB
                </div>
              </div>

              {/* Storage */}
              <div className="bg-slate-700 rounded-lg p-3">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-300 font-medium">Storage</span>
                  <span className={`font-semibold ${getHealthColor(100 - healthData.system.storage.usage)}`}>
                    {healthData.system.storage.usage}% Used
                  </span>
                </div>
                <div className="bg-slate-600 rounded-full h-2 mb-2">
                  <div 
                    className="bg-green-400 h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${healthData.system.storage.usage}%` }}
                  />
                </div>
                <div className="text-sm text-gray-400">
                  Available: {healthData.system.storage.available}GB / {healthData.system.storage.total}GB
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Environmental Data */}
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 mb-8">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
            <FaThermometerHalf className="mr-3 text-orange-400" />
            Environmental Conditions
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-400">{healthData.environmental.ambientTemp}°C</div>
              <div className="text-gray-400 text-sm">Ambient Temperature</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">{healthData.environmental.humidity}%</div>
              <div className="text-gray-400 text-sm">Humidity</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">{healthData.environmental.pressure}</div>
              <div className="text-gray-400 text-sm">Pressure (hPa)</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">{healthData.environmental.altitude}m</div>
              <div className="text-gray-400 text-sm">Altitude</div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex justify-end space-x-4">
          <button className="flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-200">
            <FaDownload className="mr-2" />
            Export Health Report
          </button>
          <button className="flex items-center px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all duration-200">
            <FaChartLine className="mr-2" />
            View Trends
          </button>
        </div>
      </div>
    </div>
  );
}
