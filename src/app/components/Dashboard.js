'use client';

import React, { useState, useEffect } from 'react';
import { FaRobot, FaEye, FaCogs, FaWifi, FaRoute, FaShieldAlt } from 'react-icons/fa';

const Dashboard = () => {
  const [selectedMetrics, setSelectedMetrics] = useState(['SPEED', 'SIGNAL']);
  const [chartData, setChartData] = useState({ series: [], timeLabels: [] });
  const [isAnimating, setIsAnimating] = useState(true);
  
  // Animated statistics state
  const [animatedStats, setAnimatedStats] = useState({
    distance: 15.7,
    uptime: 2.4,
    missions: 23,
    battery: 87
  });

  // Dynamic chart data
  const metrics = [
    { id: 'SPEED', name: 'Speed', color: '#3B82F6', active: true },
    { id: 'LATENCY', name: 'Latency', color: '#EF4444', active: false },
    { id: 'SIGNAL', name: 'Signal', color: '#10B981', active: true },
    { id: 'BANDWIDTH', name: 'Bandwidth', color: '#F59E0B', active: false },
    { id: 'PACKETS', name: 'Packets', color: '#8B5CF6', active: false }
  ];

  // Generate time labels
  const generateTimeLabels = () => {
    const labels = [];
    const now = new Date();
    for (let i = 10; i >= 0; i--) {
      const time = new Date(now.getTime() - i * 5 * 60 * 1000);
      labels.push(time.toLocaleTimeString('en-US', { 
        hour12: false, 
        hour: '2-digit', 
        minute: '2-digit' 
      }));
    }
    return labels;
  };

  // Generate chart data points
  const generateChartData = () => {
    const timeLabels = generateTimeLabels();
    const data = [];

    metrics.forEach(metric => {
      const points = [];
      let baseValue;

      // Set different base values and ranges for different network metrics
      switch(metric.id) {
        case 'SPEED':
          baseValue = Math.random() * 20 + 70; // 70-90 Mbps
          break;
        case 'LATENCY':
          baseValue = Math.random() * 30 + 10; // 10-40 ms (inverted - lower is better)
          break;
        case 'SIGNAL':
          baseValue = Math.random() * 15 + 75; // 75-90% signal strength
          break;
        case 'BANDWIDTH':
          baseValue = Math.random() * 25 + 60; // 60-85% bandwidth usage
          break;
        case 'PACKETS':
          baseValue = Math.random() * 10 + 85; // 85-95% packet success rate
          break;
        default:
          baseValue = Math.random() * 30 + 40;
      }
      
      timeLabels.forEach((time, index) => {
        // Add smaller, more gradual variations for smoother movement
        let variation;
        switch(metric.id) {
          case 'SPEED':
            variation = (Math.random() - 0.5) * 3; // Reduced from 8 to 3
            break;
          case 'LATENCY':
            variation = (Math.random() - 0.5) * 4; // Reduced from 12 to 4
            break;
          case 'SIGNAL':
            variation = (Math.random() - 0.5) * 2; // Reduced from 6 to 2
            break;
          case 'BANDWIDTH':
            variation = (Math.random() - 0.5) * 3; // Reduced from 10 to 3
            break;
          case 'PACKETS':
            variation = (Math.random() - 0.5) * 1.5; // Reduced from 4 to 1.5
            break;
          default:
            variation = (Math.random() - 0.5) * 3;
        }
        
        baseValue = Math.max(5, Math.min(95, baseValue + variation));
        
        // For latency, invert the display (lower latency = higher on chart)
        const displayValue = metric.id === 'LATENCY' ? 100 - baseValue : baseValue;
        
        points.push({
          x: (index / (timeLabels.length - 1)) * 100,
          y: 100 - displayValue,
          value: baseValue
        });
      });

      data.push({
        id: metric.id,
        name: metric.name,
        color: metric.color,
        active: selectedMetrics.includes(metric.id),
        points: points
      });
    });

    return { data, timeLabels };
  };

  // Initialize and update chart data
  useEffect(() => {
    const updateData = () => {
      const { data, timeLabels } = generateChartData();
      setChartData({ series: data, timeLabels });
    };

    updateData();
    
    if (isAnimating) {
      const interval = setInterval(updateData, 3000);
      return () => clearInterval(interval);
    }
  }, [selectedMetrics, isAnimating]);

  // Animate statistics counters
  useEffect(() => {
    if (isAnimating) {
      const interval = setInterval(() => {
        setAnimatedStats(prev => ({
          distance: Math.max(0, prev.distance + (Math.random() - 0.5) * 0.2),
          uptime: Math.max(0, prev.uptime + (Math.random() - 0.3) * 0.1),
          missions: Math.max(0, prev.missions + (Math.random() > 0.95 ? 1 : 0)),
          battery: Math.max(10, Math.min(100, prev.battery + (Math.random() - 0.51) * 0.5))
        }));
      }, 2000);
      
      return () => clearInterval(interval);
    }
  }, [isAnimating]);

  // Toggle metric visibility
  const toggleMetric = (metricId) => {
    setSelectedMetrics(prev => 
      prev.includes(metricId) 
        ? prev.filter(id => id !== metricId)
        : [...prev, metricId]
    );
  };

  // Generate SVG path for a line (straight lines instead of curves)
  const generatePath = (points) => {
    if (!points || points.length === 0) return '';
    
    let path = `M ${points[0].x} ${points[0].y}`;
    
    for (let i = 1; i < points.length; i++) {
      const curr = points[i];
      path += ` L ${curr.x} ${curr.y}`;
    }
    
    return path;
  };
  return (
    <div className="w-full bg-transparent p-2 sm:p-4 md:p-5 lg:p-6 xl:p-8 space-y-3 sm:space-y-4 lg:space-y-6 relative min-h-screen">
      {/* Enhanced Background Elements - Responsive */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Animated Background Orbs - Responsive Sizes */}
        <div className="absolute top-10 sm:top-16 lg:top-20 left-5 sm:left-8 lg:left-10 w-16 sm:w-24 lg:w-32 h-16 sm:h-24 lg:h-32 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-16 sm:bottom-24 lg:bottom-32 right-8 sm:right-12 lg:right-16 w-20 sm:w-32 lg:w-40 h-20 sm:h-32 lg:h-40 bg-gradient-to-br from-purple-500/8 to-pink-500/8 rounded-full blur-2xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/3 sm:top-1/2 left-1/6 sm:left-1/4 w-12 sm:w-18 lg:w-24 h-12 sm:h-18 lg:h-24 bg-gradient-to-br from-green-500/8 to-emerald-500/8 rounded-full blur-xl animate-pulse" style={{animationDelay: '2s'}}></div>
        
        {/* Geometric Shapes - Responsive */}
        <div className="absolute top-8 sm:top-12 lg:top-16 right-10 sm:right-16 lg:right-20 w-10 sm:w-16 lg:w-20 h-10 sm:h-16 lg:h-20 border border-blue-400/20 rotate-45 animate-spin" style={{animationDuration: '20s'}}></div>
        <div className="absolute bottom-10 sm:bottom-16 lg:bottom-20 left-10 sm:left-16 lg:left-20 w-8 sm:w-12 lg:w-16 h-8 sm:h-12 lg:h-16 border border-cyan-400/15 rotate-12 animate-spin" style={{animationDuration: '15s', animationDirection: 'reverse'}}></div>
      </div>

      {/* Enhanced Top Section - RoboDoc and Vision Cards - Responsive */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 lg:gap-6 relative z-10">
        {/* Ultra Enhanced RoboDoc Card - Mobile Optimized */}
        <div className="group bg-gradient-to-br from-white/15 via-white/10 to-white/5 backdrop-blur-xl rounded-xl sm:rounded-2xl lg:rounded-3xl p-4 sm:p-6 lg:p-8 border border-white/30 hover:border-blue-400/60 transition-all duration-500 shadow-2xl hover:shadow-blue-500/20 hover:scale-105 relative overflow-hidden">
          {/* Card Glow Effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-xl sm:rounded-2xl lg:rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          {/* Animated Border */}
          <div className="absolute inset-0 rounded-xl sm:rounded-2xl lg:rounded-3xl bg-gradient-to-r from-blue-400/20 via-transparent to-cyan-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          <div className="relative z-10 flex items-start space-x-3 sm:space-x-4 lg:space-x-6">
            <div className="relative group-hover:scale-110 transition-transform duration-500">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl sm:rounded-2xl blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-500"></div>
              <div className="relative w-12 sm:w-14 lg:w-16 h-12 sm:h-14 lg:h-16 bg-gradient-to-br from-blue-500 via-blue-600 to-cyan-600 rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0 shadow-2xl border border-blue-400/50">
                <FaRobot className="text-white text-lg sm:text-2xl lg:text-3xl drop-shadow-lg" />
                
                {/* Pulsing Ring */}
                <div className="absolute inset-0 rounded-xl sm:rounded-2xl border-2 border-blue-400/30 animate-pulse"></div>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-white text-lg sm:text-xl lg:text-2xl font-bold mb-1 sm:mb-2 bg-gradient-to-r from-white via-blue-100 to-cyan-100 bg-clip-text text-transparent drop-shadow-lg">RoboDoc</h3>
              <p className="text-blue-300 text-xs sm:text-sm lg:text-base mb-1 sm:mb-2 font-semibold truncate">Floor 3rd, Physiotherapy dept.</p>
              <div className="flex items-center space-x-2">
                <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 bg-green-400 rounded-full animate-pulse"></div>
                <p className="text-gray-300 text-xs lg:text-sm truncate">ID 12345 • Online</p>
              </div>
              
              {/* Status Indicators - Responsive */}
              <div className="mt-2 sm:mt-4 flex flex-wrap gap-2 sm:gap-3">
                <div className="flex items-center space-x-1">
                  <div className="w-2 sm:w-3 h-2 sm:h-3 bg-green-500 rounded-full shadow-lg"></div>
                  <span className="text-green-300 text-xs font-medium">Active</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-2 sm:w-3 h-2 sm:h-3 bg-blue-500 rounded-full shadow-lg"></div>
                  <span className="text-blue-300 text-xs font-medium">Connected</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Ultra Enhanced Vision Card - Mobile Optimized */}
        <div className="group bg-gradient-to-br from-white/15 via-white/10 to-white/5 backdrop-blur-xl rounded-xl sm:rounded-2xl lg:rounded-3xl p-4 sm:p-6 lg:p-8 border border-white/30 hover:border-cyan-400/60 transition-all duration-500 shadow-2xl hover:shadow-cyan-500/20 hover:scale-105 relative overflow-hidden">
          {/* Card Glow Effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-green-500/10 rounded-xl sm:rounded-2xl lg:rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          <div className="relative z-10 flex items-start space-x-3 sm:space-x-4 lg:space-x-6">
            <div className="relative group-hover:scale-110 transition-transform duration-500">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 to-green-600 rounded-xl sm:rounded-2xl blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-500"></div>
              <div className="relative w-12 sm:w-14 lg:w-16 h-12 sm:h-14 lg:h-16 bg-gradient-to-br from-cyan-500 via-teal-600 to-green-600 rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0 shadow-2xl border border-cyan-400/50">
                <FaWifi className="text-white text-lg sm:text-2xl lg:text-3xl drop-shadow-lg" />
                
                {/* Signal Rings */}
                <div className="absolute inset-0 rounded-xl sm:rounded-2xl border border-cyan-400/40 animate-ping" style={{animationDuration: '2s'}}></div>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-white text-lg sm:text-xl lg:text-2xl font-bold mb-2 sm:mb-3 bg-gradient-to-r from-white via-cyan-100 to-green-100 bg-clip-text text-transparent drop-shadow-lg">Network Status</h3>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <p className="text-gray-300 text-xs sm:text-sm lg:text-base font-semibold">Connection Quality</p>
                  <span className="text-green-300 text-xs sm:text-sm font-bold">88%</span>
                </div>
                <div className="relative w-full bg-white/10 rounded-full h-2 sm:h-3 lg:h-4 overflow-hidden border border-white/20">
                  <div className="absolute inset-0 bg-gradient-to-r from-green-600/20 to-green-400/20 rounded-full"></div>
                  <div 
                    className="bg-gradient-to-r from-green-500 via-emerald-500 to-green-400 h-2 sm:h-3 lg:h-4 rounded-full transition-all duration-1000 shadow-lg relative overflow-hidden" 
                    style={{width: '88%'}}
                  >
                    {/* Shine effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-100%] animate-pulse" style={{animationDuration: '2s'}}></div>
                  </div>
                </div>
                
                {/* Additional Network Info - Responsive Grid */}
                <div className="mt-2 sm:mt-3 grid grid-cols-2 gap-2 sm:gap-3 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Ping:</span>
                    <span className="text-green-300 font-medium">12ms</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Speed:</span>
                    <span className="text-cyan-300 font-medium">85 Mbps</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Robot System Status Section - Mobile Responsive */}
      <div className="relative z-10">
        <div className="flex items-center space-x-2 sm:space-x-3 mb-4 sm:mb-6">
          <div className="w-0.5 sm:w-1 h-6 sm:h-8 bg-gradient-to-b from-blue-500 to-cyan-500 rounded-full"></div>
          <p className="text-white text-sm sm:text-lg font-bold uppercase tracking-wider bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">Robot System Status</p>
          <div className="flex-1 h-px bg-gradient-to-r from-blue-500/50 via-transparent to-transparent"></div>
        </div>
        
        {/* Enhanced System Components Cards - Responsive Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {/* Ultra Enhanced Motor Control Card - Mobile Optimized */}
          <div className="group bg-gradient-to-br from-white/15 via-white/10 to-white/5 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 border border-white/30 hover:border-orange-400/60 transition-all duration-500 shadow-2xl hover:shadow-orange-500/20 hover:scale-105 relative overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-red-500/5 rounded-2xl sm:rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            {/* Floating Particles - Responsive */}
            <div className="absolute top-2 sm:top-4 right-2 sm:right-4 w-1.5 sm:w-2 h-1.5 sm:h-2 bg-orange-400/60 rounded-full animate-pulse"></div>
            <div className="absolute bottom-3 sm:bottom-6 left-3 sm:left-6 w-1 h-1 bg-red-400/60 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
            
            <div className="relative z-10 flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-4 lg:space-x-6">
              <div className="relative group-hover:scale-110 transition-transform duration-500 mx-auto sm:mx-0">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-400 to-red-600 rounded-xl sm:rounded-2xl blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-500"></div>
                <div className="relative w-12 sm:w-14 lg:w-16 h-12 sm:h-14 lg:h-16 bg-gradient-to-br from-orange-500 via-red-500 to-orange-600 rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0 shadow-2xl border border-orange-400/50">
                  <FaCogs className="text-white text-xl sm:text-2xl lg:text-3xl drop-shadow-lg animate-pulse" />
                  
                  {/* Rotating Ring */}
                  <div className="absolute inset-0 rounded-xl sm:rounded-2xl border border-orange-400/30 animate-spin" style={{animationDuration: '3s'}}></div>
                </div>
              </div>
              <div className="flex-1 w-full">
                <h3 className="text-white text-lg sm:text-xl lg:text-2xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-white via-orange-100 to-red-100 bg-clip-text text-transparent drop-shadow-lg text-center sm:text-left">Motor Control</h3>
                <div className="space-y-3 sm:space-y-4">
                  <div className="relative p-2 sm:p-3 bg-white/5 rounded-lg sm:rounded-xl border border-white/10 hover:border-green-400/30 transition-all duration-300">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-300 text-xs sm:text-sm font-medium">Left Wheel</span>
                      <span className="text-green-400 text-xs sm:text-sm font-bold bg-green-400/10 px-2 py-1 rounded-full">92%</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-1.5 sm:h-2 overflow-hidden">
                      <div className="bg-gradient-to-r from-green-500 to-emerald-500 h-1.5 sm:h-2 rounded-full transition-all duration-1000" style={{width: '92%'}}></div>
                    </div>
                  </div>
                  
                  <div className="relative p-2 sm:p-3 bg-white/5 rounded-lg sm:rounded-xl border border-white/10 hover:border-green-400/30 transition-all duration-300">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-300 text-xs sm:text-sm font-medium">Right Wheel</span>
                      <span className="text-green-400 text-xs sm:text-sm font-bold bg-green-400/10 px-2 py-1 rounded-full">89%</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-1.5 sm:h-2 overflow-hidden">
                      <div className="bg-gradient-to-r from-green-500 to-emerald-500 h-1.5 sm:h-2 rounded-full transition-all duration-1000" style={{width: '89%'}}></div>
                    </div>
                  </div>
                  
                  <div className="relative p-2 sm:p-3 bg-white/5 rounded-lg sm:rounded-xl border border-white/10 hover:border-yellow-400/30 transition-all duration-300">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-300 text-xs sm:text-sm font-medium">Arm Motors</span>
                      <span className="text-yellow-400 text-xs sm:text-sm font-bold bg-yellow-400/10 px-2 py-1 rounded-full">78%</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-1.5 sm:h-2 overflow-hidden">
                      <div className="bg-gradient-to-r from-yellow-500 to-orange-500 h-1.5 sm:h-2 rounded-full transition-all duration-1000" style={{width: '78%'}}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Ultra Enhanced Navigation Card - Mobile Optimized */}
          <div className="group bg-gradient-to-br from-white/15 via-white/10 to-white/5 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 border border-white/30 hover:border-purple-400/60 transition-all duration-500 shadow-2xl hover:shadow-purple-500/20 hover:scale-105 relative overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 rounded-2xl sm:rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            {/* Floating Particles - Responsive */}
            <div className="absolute top-3 sm:top-6 right-4 sm:right-8 w-1.5 sm:w-2 h-1.5 sm:h-2 bg-purple-400/60 rounded-full animate-pulse"></div>
            <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 w-1 h-1 bg-pink-400/60 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
            
            <div className="relative z-10 flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-4 lg:space-x-6">
              <div className="relative group-hover:scale-110 transition-transform duration-500 mx-auto sm:mx-0">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-pink-600 rounded-xl sm:rounded-2xl blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-500"></div>
                <div className="relative w-12 sm:w-14 lg:w-16 h-12 sm:h-14 lg:h-16 bg-gradient-to-br from-purple-500 via-violet-500 to-purple-600 rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0 shadow-2xl border border-purple-400/50">
                  <FaRoute className="text-white text-xl sm:text-2xl lg:text-3xl drop-shadow-lg" />
                  
                  {/* Pulsing Effect */}
                  <div className="absolute inset-0 rounded-xl sm:rounded-2xl border border-purple-400/30 animate-pulse"></div>
                </div>
              </div>
              <div className="flex-1 w-full">
                <h3 className="text-white text-lg sm:text-xl lg:text-2xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-white via-purple-100 to-pink-100 bg-clip-text text-transparent drop-shadow-lg text-center sm:text-left">Navigation</h3>
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-2 sm:p-3 bg-white/5 rounded-lg sm:rounded-xl border border-white/10 space-y-1 sm:space-y-0">
                    <span className="text-gray-300 text-xs sm:text-sm font-medium">Current Mission</span>
                    <span className="text-blue-400 text-xs sm:text-sm font-bold bg-blue-400/10 px-2 sm:px-3 py-1 rounded-full">Patrol #47</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-2 sm:p-3 bg-white/5 rounded-lg sm:rounded-xl border border-white/10 space-y-1 sm:space-y-0">
                    <span className="text-gray-300 text-xs sm:text-sm font-medium">Progress</span>
                    <span className="text-green-400 text-xs sm:text-sm font-bold bg-green-400/10 px-2 sm:px-3 py-1 rounded-full">67%</span>
                  </div>
                  <div className="relative">
                    <div className="w-full bg-white/10 rounded-full h-2 sm:h-3 overflow-hidden border border-white/20">
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-purple-400/20 rounded-full"></div>
                      <div 
                        className="bg-gradient-to-r from-purple-500 via-violet-500 to-purple-400 h-2 sm:h-3 rounded-full transition-all duration-1000 shadow-lg relative overflow-hidden" 
                        style={{width: '67%'}}
                      >
                        {/* Progress shine effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-2000"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Security Status Card - Mobile Responsive */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-4 sm:mb-6 border border-white/20 hover:border-red-400/50 transition-all duration-300 shadow-lg hover:shadow-xl">
          <div className="flex flex-col sm:flex-row items-start space-y-3 sm:space-y-0 sm:space-x-4">
            <div className="w-10 sm:w-12 h-10 sm:h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg mx-auto sm:mx-0">
              <FaShieldAlt className="text-white text-lg sm:text-xl" />
            </div>
            <div className="flex-1 w-full">
              <h3 className="text-white text-lg sm:text-xl font-bold mb-3 text-center sm:text-left">Security & Safety</h3>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <div className="text-center p-2 bg-white/5 rounded-lg border border-white/10">
                  <div className="text-green-400 text-lg sm:text-xl font-bold">✓</div>
                  <div className="text-gray-400 text-xs">Emergency Stop</div>
                </div>
                <div className="text-center p-2 bg-white/5 rounded-lg border border-white/10">
                  <div className="text-green-400 text-lg sm:text-xl font-bold">✓</div>
                  <div className="text-gray-400 text-xs">Collision Detection</div>
                </div>
                <div className="text-center p-2 bg-white/5 rounded-lg border border-white/10">
                  <div className="text-yellow-400 text-lg sm:text-xl font-bold">⚠</div>
                  <div className="text-gray-400 text-xs">Perimeter Check</div>
                </div>
                <div className="text-center p-2 bg-white/5 rounded-lg border border-white/10">
                  <div className="text-green-400 text-lg sm:text-xl font-bold">✓</div>
                  <div className="text-gray-400 text-xs">Access Control</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Robot Statistics Section - Mobile Responsive */}
      <div className="relative z-10 mb-6 sm:mb-8">
        <div className="flex items-center space-x-2 sm:space-x-3 mb-4 sm:mb-6">
          <div className="w-0.5 sm:w-1 h-6 sm:h-8 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"></div>
          <p className="text-white text-sm sm:text-lg font-bold uppercase tracking-wider bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">Robot Statistics</p>
          <div className="flex-1 h-px bg-gradient-to-r from-purple-500/50 via-transparent to-transparent"></div>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          {/* Ultra Enhanced Uptime Card - Mobile Optimized */}
          <div className="group bg-gradient-to-br from-white/15 via-white/10 to-white/5 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-3 sm:p-4 lg:p-6 border border-white/30 hover:border-blue-400/60 transition-all duration-500 shadow-2xl hover:shadow-blue-500/20 hover:scale-105 relative overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 rounded-2xl sm:rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            {/* Floating Elements - Responsive */}
            <div className="absolute top-1 sm:top-2 right-2 sm:right-3 w-1.5 sm:w-2 h-1.5 sm:h-2 bg-blue-400/60 rounded-full animate-pulse"></div>
            <div className="absolute bottom-2 sm:bottom-3 left-1 sm:left-2 w-1 h-1 bg-cyan-400/60 rounded-full animate-bounce" style={{animationDelay: '0.5s'}}></div>
            
            <div className="relative z-10 text-center">
              <div className="relative mx-auto w-10 sm:w-12 lg:w-16 h-10 sm:h-12 lg:h-16 mb-2 sm:mb-3 lg:mb-4 group-hover:scale-110 transition-transform duration-500">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-cyan-600 rounded-xl sm:rounded-2xl blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-500"></div>
                <div className="relative w-full h-full bg-gradient-to-br from-blue-500 via-cyan-500 to-blue-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-2xl border border-blue-400/50">
                  <span className="text-white text-lg sm:text-xl lg:text-2xl font-bold drop-shadow-lg">⏰</span>
                  
                  {/* Pulsing Ring */}
                  <div className="absolute inset-0 rounded-xl sm:rounded-2xl border border-blue-400/30 animate-pulse"></div>
                </div>
              </div>
              
              <h4 className="text-white text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent drop-shadow-2xl mb-1 sm:mb-2">2.4</h4>
              <p className="text-gray-300 text-xs sm:text-sm font-medium bg-white/5 px-2 sm:px-3 py-1 rounded-full border border-white/10">Hours Uptime</p>
              
              {/* Shine Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-2000"></div>
            </div>
          </div>
          
          {/* Ultra Enhanced Distance Card - Mobile Optimized */}
          <div className="group bg-gradient-to-br from-white/15 via-white/10 to-white/5 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-3 sm:p-4 lg:p-6 border border-white/30 hover:border-green-400/60 transition-all duration-500 shadow-2xl hover:shadow-green-500/20 hover:scale-105 relative overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/5 rounded-2xl sm:rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            {/* Floating Elements - Responsive */}
            <div className="absolute top-2 sm:top-3 right-1 sm:right-2 w-1.5 sm:w-2 h-1.5 sm:h-2 bg-green-400/60 rounded-full animate-bounce"></div>
            <div className="absolute bottom-1 sm:bottom-2 left-2 sm:left-3 w-1 h-1 bg-emerald-400/60 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
            
            <div className="relative z-10 text-center">
              <div className="relative mx-auto w-10 sm:w-12 lg:w-16 h-10 sm:h-12 lg:h-16 mb-2 sm:mb-3 lg:mb-4 group-hover:scale-110 transition-transform duration-500">
                <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-emerald-600 rounded-xl sm:rounded-2xl blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-500"></div>
                <div className="relative w-full h-full bg-gradient-to-br from-green-500 via-emerald-500 to-green-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-2xl border border-green-400/50">
                  <span className="text-white text-lg sm:text-xl lg:text-2xl font-bold drop-shadow-lg">🏃</span>
                  
                  {/* Rotating Border */}
                  <div className="absolute inset-0 rounded-xl sm:rounded-2xl border border-green-400/30 animate-spin" style={{animationDuration: '4s'}}></div>
                </div>
              </div>
              
              <h4 className="text-white text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent drop-shadow-2xl mb-1 sm:mb-2">15.7</h4>
              <p className="text-gray-300 text-xs sm:text-sm font-medium bg-white/5 px-2 sm:px-3 py-1 rounded-full border border-white/10">Distance (km)</p>
              
              {/* Shine Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-2000"></div>
            </div>
          </div>
          
          {/* Ultra Enhanced Tasks Card - Mobile Optimized */}
          <div className="group bg-gradient-to-br from-white/15 via-white/10 to-white/5 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-3 sm:p-4 lg:p-6 border border-white/30 hover:border-purple-400/60 transition-all duration-500 shadow-2xl hover:shadow-purple-500/20 hover:scale-105 relative overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 rounded-2xl sm:rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            {/* Floating Elements - Responsive */}
            <div className="absolute top-2 sm:top-4 right-2 sm:right-4 w-1.5 sm:w-2 h-1.5 sm:h-2 bg-purple-400/60 rounded-full animate-pulse"></div>
            <div className="absolute bottom-2 sm:bottom-4 left-1 sm:left-2 w-1 h-1 bg-pink-400/60 rounded-full animate-bounce" style={{animationDelay: '0.3s'}}></div>
            
            <div className="relative z-10 text-center">
              <div className="relative mx-auto w-10 sm:w-12 lg:w-16 h-10 sm:h-12 lg:h-16 mb-2 sm:mb-3 lg:mb-4 group-hover:scale-110 transition-transform duration-500">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-pink-600 rounded-xl sm:rounded-2xl blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-500"></div>
                <div className="relative w-full h-full bg-gradient-to-br from-purple-500 via-pink-500 to-purple-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-2xl border border-purple-400/50">
                  <span className="text-white text-lg sm:text-xl lg:text-2xl font-bold drop-shadow-lg">✅</span>
                  
                  {/* Pulsing Effect */}
                  <div className="absolute inset-0 rounded-xl sm:rounded-2xl border border-purple-400/30 animate-pulse"></div>
                </div>
              </div>
              
              <h4 className="text-white text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow-2xl mb-1 sm:mb-2">23</h4>
              <p className="text-gray-300 text-xs sm:text-sm font-medium bg-white/5 px-2 sm:px-3 py-1 rounded-full border border-white/10">Tasks Completed</p>
              
              {/* Shine Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-2000"></div>
            </div>
          </div>
          
          {/* Ultra Enhanced Alerts Card - Mobile Optimized */}
          <div className="group bg-gradient-to-br from-white/15 via-white/10 to-white/5 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-3 sm:p-4 lg:p-6 border border-white/30 hover:border-orange-400/60 transition-all duration-500 shadow-2xl hover:shadow-orange-500/20 hover:scale-105 relative overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-red-500/5 rounded-2xl sm:rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            {/* Floating Elements - Responsive */}
            <div className="absolute top-1 sm:top-2 right-1 sm:right-2 w-1.5 sm:w-2 h-1.5 sm:h-2 bg-orange-400/60 rounded-full animate-bounce"></div>
            <div className="absolute bottom-2 sm:bottom-3 left-2 sm:left-4 w-1 h-1 bg-red-400/60 rounded-full animate-pulse" style={{animationDelay: '0.7s'}}></div>
            
            <div className="relative z-10 text-center">
              <div className="relative mx-auto w-10 sm:w-12 lg:w-16 h-10 sm:h-12 lg:h-16 mb-2 sm:mb-3 lg:mb-4 group-hover:scale-110 transition-transform duration-500">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-400 to-red-600 rounded-xl sm:rounded-2xl blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-500"></div>
                <div className="relative w-full h-full bg-gradient-to-br from-orange-500 via-red-500 to-orange-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-2xl border border-orange-400/50">
                  <span className="text-white text-lg sm:text-xl lg:text-2xl font-bold drop-shadow-lg">⚠️</span>
                  
                  {/* Rotating Ring */}
                  <div className="absolute inset-0 rounded-xl sm:rounded-2xl border border-orange-400/30 animate-spin" style={{animationDuration: '5s'}}></div>
                </div>
              </div>
              
              <h4 className="text-white text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent drop-shadow-2xl mb-1 sm:mb-2">02</h4>
              <p className="text-gray-300 text-xs sm:text-sm font-medium bg-white/5 px-2 sm:px-3 py-1 rounded-full border border-white/10">Active Alerts</p>
              
              {/* Shine Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-2000"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Ultra Enhanced Network Performance Chart - Mobile Responsive */}
      <div className="group bg-gradient-to-br from-white/15 via-white/10 to-white/5 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 border border-white/30 hover:border-blue-400/60 transition-all duration-500 shadow-2xl hover:shadow-blue-500/20 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 rounded-2xl sm:rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        
        {/* Floating Particles - Responsive */}
        <div className="absolute top-4 sm:top-8 right-6 sm:right-12 w-2 sm:w-3 h-2 sm:h-3 bg-blue-400/40 rounded-full animate-pulse"></div>
        <div className="absolute bottom-4 sm:bottom-8 left-4 sm:left-8 w-1.5 sm:w-2 h-1.5 sm:h-2 bg-cyan-400/40 rounded-full animate-bounce" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 right-4 sm:right-8 w-1 h-1 bg-blue-300/40 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
        
        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 lg:mb-8 space-y-3 sm:space-y-0">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-cyan-600 rounded-xl sm:rounded-2xl blur-lg opacity-30"></div>
                <div className="relative w-12 sm:w-14 lg:w-16 h-12 sm:h-14 lg:h-16 bg-gradient-to-br from-blue-500 via-cyan-500 to-blue-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-2xl border border-blue-400/50">
                  <span className="text-white text-lg sm:text-xl lg:text-2xl font-bold drop-shadow-lg">📊</span>
                  
                  {/* Signal Animation */}
                  <div className="absolute inset-0 rounded-xl sm:rounded-2xl border border-blue-400/30 animate-pulse"></div>
                </div>
              </div>
              
              <div>
                <h3 className="text-white text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-white via-blue-100 to-cyan-100 bg-clip-text text-transparent drop-shadow-lg mb-1 sm:mb-2">
                  Network Performance Monitor
                </h3>
                <p className="text-gray-300 text-xs sm:text-sm bg-white/5 px-2 sm:px-3 py-1 rounded-full border border-white/10 inline-block">Real-time Analytics</p>
              </div>
            </div>
            
            <div className="flex items-center justify-center sm:justify-end space-x-3 sm:space-x-4">
              <div className="relative">
                <button
                  onClick={() => setIsAnimating(!isAnimating)}
                  className={`group/btn relative w-10 sm:w-12 h-10 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-2xl transition-all duration-300 overflow-hidden ${
                    isAnimating 
                      ? 'bg-gradient-to-br from-blue-500 to-blue-600 border border-blue-400/50' 
                      : 'bg-gradient-to-br from-gray-600 to-gray-700 border border-gray-500/50'
                  }`}
                >
                  {/* Button glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-xl sm:rounded-2xl opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                  
                  <div className={`relative w-3 sm:w-4 h-3 sm:h-4 bg-white rounded-full ${isAnimating ? 'animate-pulse' : ''} shadow-lg`}></div>
                  
                  {/* Ripple effect */}
                  {isAnimating && (
                    <div className="absolute inset-0 rounded-xl sm:rounded-2xl border border-blue-400/50 animate-ping"></div>
                  )}
                </button>
              </div>
              
              {/* Status Indicator */}
              <div className="flex items-center space-x-2 bg-white/5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-white/10">
                <div className="w-2 sm:w-3 h-2 sm:h-3 bg-green-500 rounded-full animate-pulse shadow-lg"></div>
                <span className="text-green-400 text-xs sm:text-sm font-medium">Live</span>
              </div>
            </div>
          </div>

          {/* Enhanced Metric Toggle Buttons - Mobile Responsive */}
          <div className="flex flex-wrap gap-2 sm:gap-3 mb-4 sm:mb-6 lg:mb-8">
            {metrics.map(metric => (
              <button
                key={metric.id}
                onClick={() => toggleMetric(metric.id)}
                className={`group/metric relative px-3 sm:px-4 lg:px-6 py-2 sm:py-2.5 lg:py-3 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-medium border transition-all duration-500 overflow-hidden ${
                  selectedMetrics.includes(metric.id)
                    ? `text-white border-opacity-50 shadow-lg`
                    : 'bg-white/5 border-white/20 text-gray-400 hover:bg-white/10 hover:border-white/30'
                }`}
                style={{
                  backgroundColor: selectedMetrics.includes(metric.id) ? `${metric.color}80` : undefined,
                  borderColor: selectedMetrics.includes(metric.id) ? `${metric.color}80` : undefined,
                  boxShadow: selectedMetrics.includes(metric.id) ? `0 4px 20px ${metric.color}20` : undefined
                }}
              >
                {/* Button shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover/metric:translate-x-[100%] transition-transform duration-1000"></div>
                
                <div className="relative flex items-center space-x-1.5 sm:space-x-2">
                  <div 
                    className={`w-2 sm:w-3 h-2 sm:h-3 rounded-full border transition-all duration-300 ${
                      selectedMetrics.includes(metric.id) ? 'bg-white border-white shadow-lg' : 'border-gray-400'
                    }`}
                  ></div>
                  <span className="font-semibold">{metric.name}</span>
                </div>
                
                {/* Active indicator */}
                {selectedMetrics.includes(metric.id) && (
                  <div className="absolute top-0.5 sm:top-1 right-0.5 sm:right-1 w-1.5 sm:w-2 h-1.5 sm:h-2 bg-white rounded-full animate-pulse"></div>
                )}
              </button>
            ))}
          </div>

          {/* Ultra Enhanced Chart Container - Mobile Responsive */}
          <div className="relative bg-white/5 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-6 border border-white/20 overflow-hidden">
            {/* Chart Background Elements */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-cyan-500/5 rounded-xl sm:rounded-2xl"></div>
            
            {/* Enhanced Y-axis labels - Mobile Responsive */}
            <div className="absolute left-1 sm:left-2 top-3 sm:top-4 lg:top-6 bottom-4 sm:bottom-6 lg:bottom-8 flex flex-col justify-between text-gray-300 text-xs sm:text-sm font-medium z-10">
              <span className="bg-white/5 px-1 sm:px-2 py-0.5 sm:py-1 rounded border border-white/10">100</span>
              <span className="bg-white/5 px-1 sm:px-2 py-0.5 sm:py-1 rounded border border-white/10">75</span>
              <span className="bg-white/5 px-1 sm:px-2 py-0.5 sm:py-1 rounded border border-white/10">50</span>
              <span className="bg-white/5 px-1 sm:px-2 py-0.5 sm:py-1 rounded border border-white/10">25</span>
              <span className="bg-white/5 px-1 sm:px-2 py-0.5 sm:py-1 rounded border border-white/10">0</span>
            </div>

            {/* Enhanced Chart content - Mobile Responsive */}
            <div className="ml-8 sm:ml-12 lg:ml-16 mr-2 sm:mr-3 lg:mr-4 h-32 sm:h-40 lg:h-48 relative">
              {/* Enhanced Horizontal grid lines */}
              {[0, 25, 50, 75, 100].map((value) => (
                <div
                  key={value}
                  className="absolute w-full border-t border-gradient-to-r from-white/20 via-white/10 to-white/20 border-dotted"
                  style={{ 
                    top: `${value}%`,
                    transform: 'translateY(-1px)',
                    borderImage: 'linear-gradient(to right, rgba(255,255,255,0.2), rgba(255,255,255,0.1), rgba(255,255,255,0.2)) 1'
                  }}
                ></div>
              ))}

              {/* Ultra Enhanced Chart Lines - Mobile Responsive */}
              {chartData.series && Array.isArray(chartData.series) && chartData.series.length > 0 && (
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <defs>
                    {selectedMetrics.map(metricId => {
                      const metric = chartData.series.find(s => s.id === metricId);
                      return metric ? (
                        <filter key={metricId} id={`glow-${metricId}`}>
                          <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
                          <feMerge> 
                            <feMergeNode in="coloredBlur"/>
                            <feMergeNode in="SourceGraphic"/>
                          </feMerge>
                        </filter>
                      ) : null;
                    })}
                    
                    {/* Gradient definitions for area fills */}
                    {selectedMetrics.map(metricId => {
                      const metric = chartData.series.find(s => s.id === metricId);
                      return metric ? (
                        <linearGradient key={`area-${metricId}`} id={`area-${metricId}`} x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor={metric.color} stopOpacity="0.3" />
                          <stop offset="100%" stopColor={metric.color} stopOpacity="0.1" />
                        </linearGradient>
                      ) : null;
                    })}
                  </defs>
                  
                  {chartData.series
                    .filter(series => selectedMetrics.includes(series.id))
                    .map((series, index) => (
                      <g key={series.id}>
                        {/* Area fill */}
                        <path
                          d={generatePath(series.points) + ` L 100 100 L 0 100 Z`}
                          fill={`url(#area-${series.id})`}
                          opacity="0.8"
                          className="transition-all duration-1000"
                        />
                        
                        {/* Enhanced animated line - Responsive stroke width */}
                        <path
                          d={generatePath(series.points)}
                          fill="none"
                          stroke={series.color}
                          strokeWidth="1.5"
                          filter={`url(#glow-${series.id})`}
                          opacity="0.9"
                          className="transition-all duration-1000 ease-in-out"
                          style={{
                            pathLength: 1,
                            strokeDasharray: isAnimating ? '1000' : 'none',
                            strokeDashoffset: isAnimating ? '0' : 'none',
                            animation: isAnimating ? `dash-${index} 3s ease-in-out infinite alternate` : 'none'
                          }}
                        />
                        
                        {/* Enhanced data points - Responsive sizes */}
                        {series.points.map((point, pointIndex) => (
                          <g key={pointIndex}>
                            {/* Outer glow ring */}
                            <circle
                              cx={point.x}
                              cy={point.y}
                              r="2"
                              fill="none"
                              stroke={series.color}
                              strokeWidth="0.5"
                              opacity="0.5"
                              className="animate-pulse"
                            />
                            
                            {/* Main point */}
                            <circle
                              cx={point.x}
                              cy={point.y}
                              r="1.2"
                              fill={series.color}
                              opacity="0.9"
                              filter={`url(#glow-${series.id})`}
                              className="transition-all duration-500 hover:r-2"
                            >
                              <animate
                                attributeName="r"
                                values="1.2;1.8;1.2"
                                dur="3s"
                                repeatCount="indefinite"
                              />
                            </circle>
                          </g>
                        ))}
                      </g>
                    ))
                  }
                  
                  {/* Interactive Crosshair */}
                  <line x1="0" y1="50" x2="100" y2="50" stroke="white" strokeWidth="0.3" opacity="0.3" strokeDasharray="2,2" />
                  <line x1="50" y1="0" x2="50" y2="100" stroke="white" strokeWidth="0.3" opacity="0.3" strokeDasharray="2,2" />
                </svg>
              )}
              
              {/* Enhanced Legend - Mobile Responsive */}
              <div className="absolute bottom-[-40px] sm:bottom-[-50px] lg:bottom-[-60px] left-0 right-0 flex flex-wrap justify-center gap-2 sm:gap-4 lg:gap-6 p-2 sm:p-3 lg:p-4 bg-white/5 rounded-lg sm:rounded-xl border border-white/10">
                {chartData.series && Array.isArray(chartData.series) && chartData.series
                  .filter(series => selectedMetrics.includes(series.id))
                  .map(series => (
                    <div key={series.id} className="flex items-center space-x-1.5 sm:space-x-2 lg:space-x-3 group/legend">
                      <div className="relative">
                        <div 
                          className="w-3 sm:w-4 h-3 sm:h-4 rounded-full shadow-lg group-hover/legend:scale-125 transition-transform duration-300"
                          style={{ backgroundColor: series.color }}
                        ></div>
                        <div 
                          className="absolute inset-0 w-3 sm:w-4 h-3 sm:h-4 rounded-full animate-ping opacity-30"
                          style={{ backgroundColor: series.color }}
                        ></div>
                      </div>
                      <span className="text-gray-300 text-xs sm:text-sm font-medium group-hover/legend:text-white transition-colors duration-300">
                        {series.name}
                      </span>
                    </div>
                  ))
                }
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;
