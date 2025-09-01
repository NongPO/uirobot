'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  FaPlay,
  FaStop,
  FaHome,
  FaCog,
  FaGamepad
} from 'react-icons/fa';

const Controller = () => {
  const [robotStatus, setRobotStatus] = useState({
    isMoving: false,
    direction: null,
    speed: 0,
    battery: 87,
    temperature: 42,
    wifi: 95
  });

  const [joystickPosition, setJoystickPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [robotPosition, setRobotPosition] = useState({ x: 10, y: 50 }); // Initial position in corridor
  const joystickRef = useRef(null);
  const containerRef = useRef(null);
  const animationFrameRef = useRef(null);
  const lastUpdateTime = useRef(Date.now());

  // Joystick Control Functions
  const handleJoystickMove = (e) => {
    if (!isDragging || !containerRef.current) return;

    // Cancel previous animation frame
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    animationFrameRef.current = requestAnimationFrame(() => {
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const maxRadius = 70; // Slightly smaller for better control

      let x = e.clientX - rect.left - centerX;
      let y = e.clientY - rect.top - centerY;

      const distance = Math.sqrt(x * x + y * y);
      if (distance > maxRadius) {
        x = (x / distance) * maxRadius;
        y = (y / distance) * maxRadius;
      }

      setJoystickPosition({ x, y });
      
      // Calculate movement direction and speed with smoothing
      const angle = Math.atan2(y, x);
      const normalizedDistance = Math.min(distance / maxRadius, 1);
      const speed = normalizedDistance * 100;
      
      // Apply speed threshold and smoothing
      const speedThreshold = 8; // Lower threshold for more responsive control
      const isMoving = speed > speedThreshold;
      
      setRobotStatus(prev => ({
        ...prev,
        isMoving,
        direction: isMoving ? `${Math.round((angle * 180 / Math.PI + 360) % 360)}°` : null,
        speed: Math.round(speed)
      }));

      // Update robot position with smoother movement
      if (isMoving) {
        const currentTime = Date.now();
        const deltaTime = Math.min(currentTime - lastUpdateTime.current, 50); // Cap delta time
        lastUpdateTime.current = currentTime;
        
        setRobotPosition(prev => {
          // Smooth movement with consistent speed
          const baseSpeed = 0.02; // Base movement speed
          const speedMultiplier = normalizedDistance * 1.5; // Speed based on joystick position
          const moveSpeed = baseSpeed * speedMultiplier * (deltaTime / 16); // Normalize for 60fps
          
          const newX = Math.max(5, Math.min(95, prev.x + Math.cos(angle) * moveSpeed * 100));
          const newY = Math.max(5, Math.min(95, prev.y + Math.sin(angle) * moveSpeed * 100));
          
          return { x: newX, y: newY };
        });
      }
    });
  };

  const handleJoystickStart = () => {
    setIsDragging(true);
    lastUpdateTime.current = Date.now();
  };

  const handleJoystickEnd = () => {
    setIsDragging(false);
    setJoystickPosition({ x: 0, y: 0 });
    setRobotStatus(prev => ({
      ...prev,
      isMoving: false,
      direction: null,
      speed: 0
    }));
    
    // Cancel any pending animation frame
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
  };

  useEffect(() => {
    if (isDragging) {
      const handleMouseMove = (e) => handleJoystickMove(e);
      const handleMouseUp = () => handleJoystickEnd();
      
      document.addEventListener('mousemove', handleMouseMove, { passive: true });
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
      };
    }
  }, [isDragging]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <div className="h-full w-full flex bg-slate-600">
      {/* Left Panel - Controls */}
      <div className="w-96 bg-slate-800 border-r border-slate-600 flex flex-col">
        {/* Header */}
        <div className="bg-slate-900 p-6 border-b border-slate-600">
          <div className="flex items-center space-x-3 mb-4">
            <FaGamepad className="text-cyan-400 text-2xl" />
            <h2 className="text-2xl font-bold text-white">Robot Controller</h2>
          </div>
          
          {/* Robot Status */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-700 rounded-lg p-3">
              <div className="text-gray-400 text-sm mb-1">Battery</div>
              <div className="text-green-400 font-bold text-lg">{robotStatus.battery}%</div>
              <div className="w-full bg-gray-600 rounded-full h-2 mt-1">
                <div 
                  className="bg-green-400 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${robotStatus.battery}%` }}
                ></div>
              </div>
            </div>
            <div className="bg-slate-700 rounded-lg p-3">
              <div className="text-gray-400 text-sm mb-1">WiFi Signal</div>
              <div className="text-blue-400 font-bold text-lg">{robotStatus.wifi}%</div>
              <div className="w-full bg-gray-600 rounded-full h-2 mt-1">
                <div 
                  className="bg-blue-400 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${robotStatus.wifi}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Manual Control */}
        <div className="p-6 border-b border-slate-600">
          <h3 className="text-lg font-semibold text-white mb-4">Manual Control</h3>
          <div className="flex space-x-2">
            <button className="flex items-center space-x-2 bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105">
              <FaPlay />
              <span>Start</span>
            </button>
            <button className="flex items-center space-x-2 bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105">
              <FaStop />
              <span>Stop</span>
            </button>
            <button className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105">
              <FaHome />
              <span>Home</span>
            </button>
          </div>
        </div>

        {/* Robot Status */}
        <div className="p-6 border-b border-slate-600">
          <h3 className="text-lg font-semibold text-white mb-4">Robot Status</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-400">Status:</span>
              <span className={`font-medium ${robotStatus.isMoving ? 'text-green-400' : 'text-gray-400'}`}>
                {robotStatus.isMoving ? 'Moving' : 'Idle'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Speed:</span>
              <span className="text-cyan-400 font-bold">{robotStatus.speed}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Direction:</span>
              <span className="text-cyan-400">{robotStatus.direction || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Temperature:</span>
              <span className="text-orange-400">{robotStatus.temperature}°C</span>
            </div>
          </div>
        </div>

        {/* Joystick Control */}
        <div className="flex-1 p-6">
          <h3 className="text-lg font-semibold text-white mb-4 text-center">Joystick Control</h3>
          
          {/* Joystick Container */}
          <div className="flex justify-center items-center h-64">
            <div 
              ref={containerRef}
              className="relative w-48 h-48 bg-slate-600 rounded-full border-4 border-slate-500 cursor-pointer shadow-2xl"
              onMouseDown={handleJoystickStart}
            >
              {/* Joystick Base Rings */}
              <div className="absolute inset-4 border-2 border-slate-400/30 rounded-full"></div>
              <div className="absolute inset-8 border-2 border-slate-400/20 rounded-full"></div>
              
              {/* Center Cross */}
              <div className="absolute top-1/2 left-1/2 w-0.5 h-8 bg-slate-400/30 transform -translate-x-1/2 -translate-y-1/2"></div>
              <div className="absolute top-1/2 left-1/2 w-8 h-0.5 bg-slate-400/30 transform -translate-x-1/2 -translate-y-1/2"></div>
              
              {/* Joystick Handle */}
              <div
                ref={joystickRef}
                className="absolute w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full border-3 border-white shadow-2xl transform -translate-x-1/2 -translate-y-1/2 cursor-grab active:cursor-grabbing"
                style={{
                  left: `calc(50% + ${joystickPosition.x}px)`,
                  top: `calc(50% + ${joystickPosition.y}px)`,
                  boxShadow: isDragging ? '0 0 20px rgba(34, 211, 238, 0.8), 0 0 40px rgba(34, 211, 238, 0.4)' : '0 4px 16px rgba(0, 0, 0, 0.4)',
                  transition: isDragging ? 'none' : 'all 0.2s ease-out'
                }}
              >
                <div className="absolute inset-1.5 bg-white/20 rounded-full"></div>
              </div>

              {/* Center Dot */}
              <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-slate-400 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Map */}
      <div className="flex-1 bg-slate-800 flex flex-col">
        {/* Map Header */}
        <div className="bg-slate-900 p-6 border-b border-slate-600">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-white">Map Simulator</h3>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-gray-400">Position:</span>
                <span className="text-white font-mono">
                  X: {Math.round(robotPosition.x)}, Y: {Math.round(robotPosition.y)}
                </span>
              </div>
              <button className="flex items-center space-x-2 bg-slate-600 hover:bg-slate-500 text-white px-3 py-1 rounded-lg transition-colors">
                <FaCog />
                <span>Settings</span>
              </button>
            </div>
          </div>
        </div>

        {/* Map Container */}
        <div className="flex-1 p-6">
          <div className="h-full relative bg-slate-900 rounded-lg overflow-hidden border-2 border-slate-600">
            
            {/* Multi-Room Layout */}
            {/* Main Corridor - Horizontal */}
            <div className="absolute top-1/2 left-0 right-0 h-16 bg-white transform -translate-y-1/2 border-y-2 border-slate-400"></div>
            
            {/* Room 1 - Top Left */}
            <div className="absolute top-4 left-4 w-32 h-24 bg-blue-100 border-2 border-blue-300 rounded-lg">
              <div className="absolute bottom-0 left-1/2 w-8 h-4 bg-white transform -translate-x-1/2 translate-y-1"></div>
              <div className="p-2">
                <div className="text-xs text-blue-600 font-medium">Room A</div>
                <div className="text-xs text-blue-500">Conference</div>
              </div>
            </div>
            
            {/* Room 2 - Top Right */}
            <div className="absolute top-4 right-4 w-32 h-24 bg-green-100 border-2 border-green-300 rounded-lg">
              <div className="absolute bottom-0 left-1/2 w-8 h-4 bg-white transform -translate-x-1/2 translate-y-1"></div>
              <div className="p-2">
                <div className="text-xs text-green-600 font-medium">Room B</div>
                <div className="text-xs text-green-500">Office</div>
              </div>
            </div>
            
            {/* Room 3 - Bottom Left */}
            <div className="absolute bottom-4 left-4 w-32 h-24 bg-purple-100 border-2 border-purple-300 rounded-lg">
              <div className="absolute top-0 left-1/2 w-8 h-4 bg-white transform -translate-x-1/2 -translate-y-1"></div>
              <div className="p-2">
                <div className="text-xs text-purple-600 font-medium">Room C</div>
                <div className="text-xs text-purple-500">Kitchen</div>
              </div>
            </div>
            
            {/* Room 4 - Bottom Right */}
            <div className="absolute bottom-4 right-4 w-32 h-24 bg-yellow-100 border-2 border-yellow-300 rounded-lg">
              <div className="absolute top-0 left-1/2 w-8 h-4 bg-white transform -translate-x-1/2 -translate-y-1"></div>
              <div className="p-2">
                <div className="text-xs text-yellow-600 font-medium">Room D</div>
                <div className="text-xs text-yellow-500">Storage</div>
              </div>
            </div>
            
            {/* Vertical Corridors */}
            <div className="absolute left-1/2 top-0 bottom-1/2 w-8 bg-white transform -translate-x-1/2 border-x-2 border-slate-400"></div>
            <div className="absolute left-1/2 top-1/2 bottom-0 w-8 bg-white transform -translate-x-1/2 border-x-2 border-slate-400"></div>
            
            {/* Navigation Points */}
            <div className="absolute top-1/2 left-8 w-3 h-3 bg-red-500 rounded-full transform -translate-y-1/2 animate-pulse"></div>
            <div className="absolute top-1/2 right-8 w-3 h-3 bg-red-500 rounded-full transform -translate-y-1/2 animate-pulse"></div>
            <div className="absolute top-8 left-1/2 w-3 h-3 bg-red-500 rounded-full transform -translate-x-1/2 animate-pulse"></div>
            <div className="absolute bottom-8 left-1/2 w-3 h-3 bg-red-500 rounded-full transform -translate-x-1/2 animate-pulse"></div>

            {/* Robot Position */}
            <div 
              className="absolute w-6 h-6 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full border-2 border-white shadow-xl transform -translate-x-1/2 -translate-y-1/2 z-20"
              style={{
                left: `${robotPosition.x}%`,
                top: `${robotPosition.y}%`,
                boxShadow: robotStatus.isMoving ? '0 0 20px rgba(34, 211, 238, 0.8), 0 0 40px rgba(34, 211, 238, 0.4)' : '0 4px 12px rgba(0, 0, 0, 0.3)',
                transition: 'all 0.1s ease-out'
              }}
            >
              {/* Robot direction indicator */}
              <div className="absolute inset-0.5 bg-white/30 rounded-full"></div>
              <div className="absolute top-0.5 left-1/2 w-0.5 h-2 bg-white rounded-full transform -translate-x-1/2"></div>
            </div>

            {/* Robot trail/path */}
            {robotStatus.isMoving && (
              <div 
                className="absolute w-3 h-3 bg-cyan-300/60 rounded-full transform -translate-x-1/2 -translate-y-1/2 animate-ping z-10"
                style={{
                  left: `${robotPosition.x}%`,
                  top: `${robotPosition.y}%`
                }}
              ></div>
            )}
          </div>
        </div>

        {/* Map Legend */}
        <div className="bg-slate-900 p-4 border-t border-slate-600">
          <div className="flex items-center justify-between">
            <div className="text-gray-400 text-sm">Map Legend:</div>
            <div className="flex items-center space-x-6 text-xs">
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full"></div>
                <span className="text-gray-300">Robot</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-white border border-gray-400"></div>
                <span className="text-gray-300">Corridor</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-blue-100 border border-blue-300"></div>
                <span className="text-gray-300">Rooms</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-gray-300">Nav Points</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Controller;
