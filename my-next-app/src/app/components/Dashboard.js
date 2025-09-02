'use client';

import React, { useState, useEffect } from 'react';
import { FaRobot, FaEye, FaCogs, FaWifi, FaRoute, FaShieldAlt } from 'react-icons/fa';

const Dashboard = () => {
  const [selectedMetrics, setSelectedMetrics] = useState(['SPEED', 'SIGNAL']);
  const [chartData, setChartData] = useState([]);
  const [isAnimating, setIsAnimating] = useState(true);

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
    <div className="w-full bg-transparent p-6 space-y-6">
      {/* Top Section - RoboDoc and Vision Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* RoboDoc Card */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:border-blue-400/50 transition-all duration-300 shadow-lg hover:shadow-xl">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
              <FaRobot className="text-white text-xl" />
            </div>
            <div className="flex-1">
              <h3 className="text-white text-xl font-bold mb-1">RoboDoc</h3>
              <p className="text-blue-400 text-sm mb-1 font-medium">Floor 3rd, Physiotherapy department</p>
              <p className="text-gray-400 text-xs">ID 12345</p>
            </div>
          </div>
        </div>

        {/* Vision Card */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:border-cyan-400/50 transition-all duration-300 shadow-lg hover:shadow-xl">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
              <FaWifi className="text-white text-xl" />
            </div>
            <div className="flex-1">
              <h3 className="text-white text-xl font-bold mb-3">Network Status</h3>
              <div>
                <p className="text-gray-300 text-sm mb-2 font-medium">Connection Quality</p>
                <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-green-500 to-green-400 h-3 rounded-full transition-all duration-1000 shadow-sm" 
                    style={{width: '88%'}}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Robot System Status Section */}
      <div>
        <p className="text-gray-400 text-sm mb-4 uppercase tracking-wide font-semibold">Robot System Status</p>
        
        {/* System Components Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Motor Control Card */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:border-orange-400/50 transition-all duration-300 shadow-lg hover:shadow-xl">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                <FaCogs className="text-white text-xl" />
              </div>
              <div className="flex-1">
                <h3 className="text-white text-xl font-bold mb-3">Motor Control</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm">Left Wheel</span>
                    <span className="text-green-400 text-sm font-medium">92%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm">Right Wheel</span>
                    <span className="text-green-400 text-sm font-medium">89%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm">Arm Motors</span>
                    <span className="text-yellow-400 text-sm font-medium">78%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Card */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:border-purple-400/50 transition-all duration-300 shadow-lg hover:shadow-xl">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                <FaRoute className="text-white text-xl" />
              </div>
              <div className="flex-1">
                <h3 className="text-white text-xl font-bold mb-3">Navigation</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm">Current Mission</span>
                    <span className="text-blue-400 text-sm font-medium">Patrol #47</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm">Progress</span>
                    <span className="text-green-400 text-sm font-medium">67%</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-purple-500 to-purple-400 h-2 rounded-full transition-all duration-1000" 
                      style={{width: '67%'}}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Security Status Card */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-6 border border-white/20 hover:border-red-400/50 transition-all duration-300 shadow-lg hover:shadow-xl">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
              <FaShieldAlt className="text-white text-xl" />
            </div>
            <div className="flex-1">
              <h3 className="text-white text-xl font-bold mb-3">Security & Safety</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-green-400 text-xl font-bold">✓</div>
                  <div className="text-gray-400 text-xs">Emergency Stop</div>
                </div>
                <div className="text-center">
                  <div className="text-green-400 text-xl font-bold">✓</div>
                  <div className="text-gray-400 text-xs">Collision Detection</div>
                </div>
                <div className="text-center">
                  <div className="text-yellow-400 text-xl font-bold">⚠</div>
                  <div className="text-gray-400 text-xs">Perimeter Check</div>
                </div>
                <div className="text-center">
                  <div className="text-green-400 text-xl font-bold">✓</div>
                  <div className="text-gray-400 text-xs">Access Control</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Robot Statistics Section */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center border border-white/20 hover:border-blue-400/50 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105">
          <h4 className="text-white text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">2.4</h4>
          <p className="text-gray-400 text-xs uppercase tracking-wide font-semibold mt-2">Hours Uptime</p>
        </div>
        
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center border border-white/20 hover:border-green-400/50 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105">
          <h4 className="text-white text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">15.7</h4>
          <p className="text-gray-400 text-xs uppercase tracking-wide font-semibold mt-2">Distance (km)</p>
        </div>
        
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center border border-white/20 hover:border-purple-400/50 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105">
          <h4 className="text-white text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">23</h4>
          <p className="text-gray-400 text-xs uppercase tracking-wide font-semibold mt-2">Tasks Completed</p>
        </div>
        
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center border border-white/20 hover:border-orange-400/50 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105">
          <h4 className="text-white text-3xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">02</h4>
          <p className="text-gray-400 text-xs uppercase tracking-wide font-semibold mt-2">Active Alerts</p>
        </div>
      </div>

      {/* Network Performance Chart */}
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:border-blue-400/50 transition-all duration-300 shadow-lg hover:shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-white text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Network Performance Monitor
          </h3>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsAnimating(!isAnimating)}
              className={`w-8 h-8 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${
                isAnimating 
                  ? 'bg-gradient-to-br from-blue-500 to-blue-600' 
                  : 'bg-gray-600'
              }`}
            >
              <div className={`w-3 h-3 bg-white rounded-full ${isAnimating ? 'animate-pulse' : ''}`}></div>
            </button>
          </div>
        </div>

        {/* Metric Toggle Buttons */}
        <div className="flex flex-wrap gap-3 mb-6">
          {metrics.map(metric => (
            <button
              key={metric.id}
              onClick={() => toggleMetric(metric.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium border transition-all duration-300 ${
                selectedMetrics.includes(metric.id)
                  ? `text-white border-opacity-50 shadow-lg`
                  : 'bg-gray-600/80 text-gray-300 border-gray-500/50 hover:border-gray-400/50'
              }`}
              style={{
                backgroundColor: selectedMetrics.includes(metric.id) ? `${metric.color}80` : undefined,
                borderColor: selectedMetrics.includes(metric.id) ? `${metric.color}80` : undefined,
                boxShadow: selectedMetrics.includes(metric.id) ? `0 4px 20px ${metric.color}20` : undefined
              }}
            >
              {metric.name}
            </button>
          ))}
        </div>

        {/* Dynamic Chart Area */}
        <div className="relative h-48 bg-slate-800/80 rounded-xl p-6 border border-slate-600/30 overflow-hidden">
          {/* Y-axis labels */}
          <div className="absolute left-2 top-6 bottom-8 flex flex-col justify-between text-gray-400 text-sm font-medium">
            <span>100</span>
            <span>75</span>
            <span>50</span>
            <span>25</span>
            <span>0</span>
          </div>

          {/* Chart content */}
          <div className="ml-10 mr-4 h-full relative">
            {/* Horizontal grid lines */}
            {[0, 25, 50, 75, 100].map((value) => (
              <div
                key={value}
                className="absolute w-full border-t border-gray-600/30 border-dotted"
                style={{ 
                  top: `${value}%`,
                  transform: 'translateY(-1px)'
                }}
              ></div>
            ))}

            {/* Animated Chart Lines */}
            {chartData.series && (
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                <defs>
                  {selectedMetrics.map(metricId => {
                    const metric = chartData.series.find(s => s.id === metricId);
                    return metric ? (
                      <filter key={metricId} id={`glow-${metricId}`}>
                        <feGaussianBlur stdDeviation="0.5" result="coloredBlur"/>
                        <feMerge> 
                          <feMergeNode in="coloredBlur"/>
                          <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                      </filter>
                    ) : null;
                  })}
                </defs>
                
                {chartData.series
                  .filter(series => selectedMetrics.includes(series.id))
                  .map((series, index) => (
                    <g key={series.id}>
                      {/* Animated line */}
                      <path
                        d={generatePath(series.points)}
                        fill="none"
                        stroke={series.color}
                        strokeWidth="0.8"
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
                      
                      {/* Data points */}
                      {series.points.map((point, pointIndex) => (
                        <circle
                          key={pointIndex}
                          cx={point.x}
                          cy={point.y}
                          r="0.8"
                          fill={series.color}
                          opacity="0.8"
                          className="transition-all duration-500"
                        >
                          <animate
                            attributeName="r"
                            values="0.8;1.2;0.8"
                            dur="2s"
                            repeatCount="indefinite"
                          />
                        </circle>
                      ))}
                    </g>
                  ))
                }
              </svg>
            )}
          </div>

          {/* X-axis labels */}
          {chartData.timeLabels && (
            <div className="absolute bottom-2 left-10 right-4 flex justify-between text-gray-400 text-xs font-medium">
              {chartData.timeLabels.map((label, index) => (
                index % 2 === 0 ? <span key={index}>{label}</span> : <span key={index}></span>
              ))}
            </div>
          )}

          {/* Real-time indicator */}
          <div className="absolute top-4 right-4">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-gray-400 text-xs font-medium">LIVE</span>
            </div>
          </div>
        </div>

        {/* Chart Legend */}
        <div className="mt-4 flex flex-wrap gap-4 text-sm">
          {chartData.series && chartData.series
            .filter(series => selectedMetrics.includes(series.id))
            .map(series => {
              const currentValue = series.points && series.points.length > 0 
                ? series.points[series.points.length - 1].value 
                : 0;
              
              // Format value based on metric type
              let formattedValue = '';
              switch(series.id) {
                case 'SPEED':
                  formattedValue = `${currentValue.toFixed(1)} Mbps`;
                  break;
                case 'LATENCY':
                  formattedValue = `${currentValue.toFixed(1)} ms`;
                  break;
                case 'SIGNAL':
                  formattedValue = `${currentValue.toFixed(1)}%`;
                  break;
                case 'BANDWIDTH':
                  formattedValue = `${currentValue.toFixed(1)}%`;
                  break;
                case 'PACKETS':
                  formattedValue = `${currentValue.toFixed(1)}%`;
                  break;
                default:
                  formattedValue = currentValue.toFixed(1);
              }

              return (
                <div key={series.id} className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: series.color }}
                  ></div>
                  <span className="text-gray-300">{series.name}</span>
                  <span className="text-gray-400">({formattedValue})</span>
                </div>
              );
            })
          }
        </div>
      </div>

      <style jsx>{`
        @keyframes dash-0 {
          0% { stroke-dashoffset: 1000; }
          100% { stroke-dashoffset: 0; }
        }
        @keyframes dash-1 {
          0% { stroke-dashoffset: 1000; }
          100% { stroke-dashoffset: 0; }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
