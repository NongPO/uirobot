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
  const [robotPosition, setRobotPosition] = useState({ x: 16, y: 90 }); // Start bottom-left inside free space
  const joystickRef = useRef(null);
  const containerRef = useRef(null);
  const animationFrameRef = useRef(null);
  const lastUpdateTime = useRef(Date.now());

  // Walkable area is innerBounds (white) minus obstacles (black)
  const wall = 4; // % wall thickness
  const innerBounds = { x0: wall, y0: wall, x1: 100 - wall, y1: 100 - wall };
  const ROBOT_RADIUS = 1.5; // % radius buffer around robot to avoid clipping through walls
  const inRect = (x, y, r) => x >= r.x0 && x <= r.x1 && y >= r.y0 && y <= r.y1;
  const obstacles = [
    // Center vertical wall segments (match UI left:48%, width:4%)
    { x0: 48, y0: 8,  x1: 52, y1: 38 },
    { x0: 48, y0: 62, x1: 52, y1: 92 },
    // Center horizontal wall segments (match UI top:48%, height:4%)
    { x0: 8,  y0: 48, x1: 38, y1: 52 },
    { x0: 62, y0: 48, x1: 92, y1: 52 }
  ];
  // Inflate obstacles by robot radius, and shrink inner bounds by radius
  const inflateRect = (r, inflate) => ({ x0: r.x0 - inflate, y0: r.y0 - inflate, x1: r.x1 + inflate, y1: r.y1 + inflate });
  const deflateRect = (r, deflate) => ({ x0: r.x0 + deflate, y0: r.y0 + deflate, x1: r.x1 - deflate, y1: r.y1 - deflate });
  const innerBoundsSafe = deflateRect(innerBounds, ROBOT_RADIUS);
  const inflatedObstacles = obstacles.map((r) => inflateRect(r, ROBOT_RADIUS));
  const isWalkable = (x, y) => inRect(x, y, innerBoundsSafe) && !inflatedObstacles.some((r) => inRect(x, y, r));

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

          // Proposed delta in percent space
          const dx = Math.cos(angle) * moveSpeed * 100;
          const dy = Math.sin(angle) * moveSpeed * 100;

          // Step in small increments to prevent tunneling through obstacles
          const maxStep = 0.8; // % per substep
          const steps = Math.max(1, Math.min(15, Math.ceil(Math.max(Math.abs(dx), Math.abs(dy)) / maxStep)));
          let nextX = prev.x;
          let nextY = prev.y;
          for (let i = 1; i <= steps; i++) {
            const tx = prev.x + (dx * i) / steps;
            const ty = prev.y + (dy * i) / steps;
            // Try full move
            if (isWalkable(tx, ty)) {
              nextX = tx; nextY = ty; continue;
            }
            // Try slide X
            if (isWalkable(tx, nextY)) { nextX = tx; continue; }
            // Try slide Y
            if (isWalkable(nextX, ty)) { nextY = ty; continue; }
            // Blocked at this substep -> stop stepping further
            break;
          }

          // Clamp to safe inner bounds (already deflated by radius)
          nextX = Math.max(innerBoundsSafe.x0, Math.min(innerBoundsSafe.x1, nextX));
          nextY = Math.max(innerBoundsSafe.y0, Math.min(innerBoundsSafe.y1, nextY));
          return { x: nextX, y: nextY };
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
    <div className="h-full w-full flex bg-slate-600 min-h-0 overflow-hidden">
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
  <div className="flex-1 bg-slate-800 flex flex-col min-w-0 min-h-0">
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
        <div className="flex-1 p-6 min-h-0">
          <div className="h-full relative bg-white rounded-lg overflow-hidden border-8 border-black">
            {/* Room walls (black). Doors are gaps between segments */}
            {/* Center vertical wall with door gap at middle */}
            <div className="absolute bg-black" style={{ left: '48%', width: '4%', top: '8%', height: '30%' }}></div>
            <div className="absolute bg-black" style={{ left: '48%', width: '4%', top: '62%', height: '30%' }}></div>
            {/* Center horizontal wall with door gap at center */}
            <div className="absolute bg-black" style={{ top: '48%', height: '4%', left: '8%', width: '30%' }}></div>
            <div className="absolute bg-black" style={{ top: '48%', height: '4%', left: '62%', width: '30%' }}></div>

            {/* Optional room labels */}
            <div className="absolute text-[10px] md:text-xs text-gray-700" style={{ top: '14%', left: '14%' }}>Room A</div>
            <div className="absolute text-[10px] md:text-xs text-gray-700" style={{ top: '14%', right: '14%' }}>Room B</div>
            <div className="absolute text-[10px] md:text-xs text-gray-700" style={{ bottom: '14%', left: '14%' }}>Room C</div>
            <div className="absolute text-[10px] md:text-xs text-gray-700" style={{ bottom: '14%', right: '14%' }}>Room D</div>

            {/* Optional grid */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
              {[...Array(9)].map((_, i) => (
                <div key={`v-${i}`} className="absolute h-full w-px bg-gray-400" style={{ left: `${(i + 1) * 10}%` }}></div>
              ))}
              {[...Array(9)].map((_, i) => (
                <div key={`h-${i}`} className="absolute w-full h-px bg-gray-400" style={{ top: `${(i + 1) * 10}%` }}></div>
              ))}
            </div>

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
      <div className="text-gray-400 text-sm">Binary Occupancy Grid:</div>
            <div className="flex items-center space-x-6 text-xs">
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full"></div>
                <span className="text-gray-300">Robot</span>
              </div>
              <div className="flex items-center space-x-1">
        <div className="w-3 h-3 bg-black"></div>
        <span className="text-gray-300">Obstacles</span>
              </div>
              <div className="flex items-center space-x-1">
        <div className="w-3 h-3 bg-white border border-gray-400"></div>
        <span className="text-gray-300">Free Space</span>
              </div>
              <div className="flex items-center space-x-1">
        <div className="w-3 h-3 bg-gray-400/50"></div>
        <span className="text-gray-300">Grid</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Controller;
