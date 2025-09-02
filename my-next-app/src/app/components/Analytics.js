'use client';

import { useState, useEffect } from 'react';
import { 
  FaChartLine, 
  FaChartBar, 
  FaClock, 
  FaRoute,
  FaBatteryHalf,
  FaThermometerHalf,
  FaEye,
  FaDownload,
  FaPlay,
  FaPause,
  FaRedo
} from 'react-icons/fa';

export default function Analytics() {
  const [isMonitoring, setIsMonitoring] = useState(true);
  const [timeRange, setTimeRange] = useState('24h');
  const [refreshing, setRefreshing] = useState(false);

  // Mock analytics data
  const [analyticsData, setAnalyticsData] = useState({
    performance: {
      totalDistance: 45.2,
      totalTime: 8.5,
      avgSpeed: 5.3,
      efficiency: 87
    },
    missions: {
      completed: 23,
      failed: 2,
      inProgress: 1,
      successRate: 92
    },
    system: {
      uptime: 97.5,
      cpuUsage: 45,
      memoryUsage: 62,
      networkLatency: 12
    },
    sensors: {
      cameraFrameRate: 30,
      lidarPoints: 124000,
      imuFrequency: 100,
      gpsAccuracy: 2.1
    }
  });

  const [realtimeMetrics, setRealtimeMetrics] = useState({
    batteryLevel: 85,
    temperature: 42,
    speed: 0.8,
    signalStrength: 88
  });

  // Simulate real-time data updates
  useEffect(() => {
    if (!isMonitoring) return;

    const interval = setInterval(() => {
      setRealtimeMetrics(prev => ({
        batteryLevel: Math.max(0, prev.batteryLevel - Math.random() * 0.1),
        temperature: 42 + (Math.random() - 0.5) * 4,
        speed: Math.random() * 2,
        signalStrength: 85 + Math.random() * 10
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, [isMonitoring]);

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate data refresh
    setTimeout(() => {
      setAnalyticsData(prev => ({
        ...prev,
        performance: {
          ...prev.performance,
          efficiency: Math.max(80, Math.min(95, prev.performance.efficiency + (Math.random() - 0.5) * 5))
        }
      }));
      setRefreshing(false);
    }, 1500);
  };

  const getPerformanceColor = (value, max = 100) => {
    const percentage = (value / max) * 100;
    if (percentage >= 80) return 'text-green-400';
    if (percentage >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const formatTime = (hours) => {
    const h = Math.floor(hours);
    const m = Math.floor((hours - h) * 60);
    return `${h}h ${m}m`;
  };

  return (
    <div className="h-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 overflow-auto">
      <div className="w-full max-w-none mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2 flex items-center">
              <FaChartLine className="mr-3 text-blue-400" />
              Analytics & Monitoring
            </h1>
            <p className="text-gray-400">Real-time performance metrics and system analytics</p>
          </div>

          <div className="flex items-center space-x-4 mt-4 sm:mt-0">
            {/* Time Range Selector */}
            <select 
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="bg-slate-700 text-white px-3 py-2 rounded-lg border border-slate-600 focus:border-blue-400 focus:outline-none"
            >
              <option value="1h">Last Hour</option>
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
            </select>

            {/* Monitoring Toggle */}
            <button
              onClick={() => setIsMonitoring(!isMonitoring)}
              className={`flex items-center px-4 py-2 rounded-lg transition-all duration-200 ${
                isMonitoring 
                  ? 'bg-green-600 hover:bg-green-700 text-white' 
                  : 'bg-slate-600 hover:bg-slate-500 text-gray-300'
              }`}
            >
              {isMonitoring ? <FaPause className="mr-2" /> : <FaPlay className="mr-2" />}
              {isMonitoring ? 'Monitoring' : 'Paused'}
            </button>

            {/* Refresh Button */}
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-200 disabled:opacity-50"
            >
              <FaRedo className={`mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>

        {/* Real-time Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Battery Level</p>
                <p className={`text-2xl font-bold ${getPerformanceColor(realtimeMetrics.batteryLevel)}`}>
                  {realtimeMetrics.batteryLevel.toFixed(1)}%
                </p>
              </div>
              <FaBatteryHalf className="text-3xl text-blue-400" />
            </div>
            <div className="mt-3 bg-slate-700 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${
                  realtimeMetrics.batteryLevel > 20 ? 'bg-green-400' : 'bg-red-400'
                }`}
                style={{ width: `${realtimeMetrics.batteryLevel}%` }}
              />
            </div>
          </div>

          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Temperature</p>
                <p className={`text-2xl font-bold ${getPerformanceColor(50 - Math.abs(realtimeMetrics.temperature - 40), 50)}`}>
                  {realtimeMetrics.temperature.toFixed(1)}°C
                </p>
              </div>
              <FaThermometerHalf className="text-3xl text-orange-400" />
            </div>
          </div>

          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Current Speed</p>
                <p className="text-2xl font-bold text-blue-400">
                  {realtimeMetrics.speed.toFixed(1)} m/s
                </p>
              </div>
              <FaRoute className="text-3xl text-green-400" />
            </div>
          </div>

          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Signal Strength</p>
                <p className={`text-2xl font-bold ${getPerformanceColor(realtimeMetrics.signalStrength)}`}>
                  {realtimeMetrics.signalStrength.toFixed(0)}%
                </p>
              </div>
              <FaEye className="text-3xl text-purple-400" />
            </div>
          </div>
        </div>

        {/* Performance Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
              <FaChartBar className="mr-3 text-blue-400" />
              Performance Metrics
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Total Distance</span>
                <span className="text-white font-semibold">{analyticsData.performance.totalDistance} km</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Total Runtime</span>
                <span className="text-white font-semibold">{formatTime(analyticsData.performance.totalTime)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Average Speed</span>
                <span className="text-white font-semibold">{analyticsData.performance.avgSpeed} m/s</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Efficiency</span>
                <span className={`font-semibold ${getPerformanceColor(analyticsData.performance.efficiency)}`}>
                  {analyticsData.performance.efficiency}%
                </span>
              </div>
            </div>
          </div>

          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
              <FaClock className="mr-3 text-green-400" />
              Mission Statistics
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Completed</span>
                <span className="text-green-400 font-semibold">{analyticsData.missions.completed}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Failed</span>
                <span className="text-red-400 font-semibold">{analyticsData.missions.failed}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">In Progress</span>
                <span className="text-yellow-400 font-semibold">{analyticsData.missions.inProgress}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Success Rate</span>
                <span className={`font-semibold ${getPerformanceColor(analyticsData.missions.successRate)}`}>
                  {analyticsData.missions.successRate}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* System & Sensor Data */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
              <FaChartLine className="mr-3 text-purple-400" />
              System Performance
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-gray-400">System Uptime</span>
                  <span className="text-green-400 font-semibold">{analyticsData.system.uptime}%</span>
                </div>
                <div className="bg-slate-700 rounded-full h-2">
                  <div className="bg-green-400 h-2 rounded-full" style={{ width: `${analyticsData.system.uptime}%` }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-gray-400">CPU Usage</span>
                  <span className={`font-semibold ${getPerformanceColor(100 - analyticsData.system.cpuUsage)}`}>
                    {analyticsData.system.cpuUsage}%
                  </span>
                </div>
                <div className="bg-slate-700 rounded-full h-2">
                  <div className="bg-blue-400 h-2 rounded-full" style={{ width: `${analyticsData.system.cpuUsage}%` }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-gray-400">Memory Usage</span>
                  <span className={`font-semibold ${getPerformanceColor(100 - analyticsData.system.memoryUsage)}`}>
                    {analyticsData.system.memoryUsage}%
                  </span>
                </div>
                <div className="bg-slate-700 rounded-full h-2">
                  <div className="bg-yellow-400 h-2 rounded-full" style={{ width: `${analyticsData.system.memoryUsage}%` }} />
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Network Latency</span>
                <span className="text-white font-semibold">{analyticsData.system.networkLatency} ms</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
              <FaEye className="mr-3 text-cyan-400" />
              Sensor Data
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Camera Frame Rate</span>
                <span className="text-white font-semibold">{analyticsData.sensors.cameraFrameRate} FPS</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">LiDAR Points</span>
                <span className="text-white font-semibold">{analyticsData.sensors.lidarPoints.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">IMU Frequency</span>
                <span className="text-white font-semibold">{analyticsData.sensors.imuFrequency} Hz</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">GPS Accuracy</span>
                <span className={`font-semibold ${getPerformanceColor(10 - analyticsData.sensors.gpsAccuracy, 10)}`}>
                  ±{analyticsData.sensors.gpsAccuracy} m
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Export Data Button */}
        <div className="mt-8 flex justify-end">
          <button className="flex items-center px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-all duration-200">
            <FaDownload className="mr-2" />
            Export Analytics Data
          </button>
        </div>
      </div>
    </div>
  );
}
