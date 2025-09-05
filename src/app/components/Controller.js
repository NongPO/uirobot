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
    <div className="h-full w-full flex flex-col lg:flex-row bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 min-h-0 overflow-hidden relative">
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Animated Background Orbs */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-32 right-16 w-40 h-40 bg-gradient-to-br from-purple-500/8 to-pink-500/8 rounded-full blur-2xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-gradient-to-br from-green-500/8 to-emerald-500/8 rounded-full blur-xl animate-pulse" style={{animationDelay: '2s'}}></div>
        
        {/* Geometric Shapes */}
        <div className="absolute top-16 right-20 w-20 h-20 border border-cyan-400/20 rotate-45 animate-spin" style={{animationDuration: '20s'}}></div>
        <div className="absolute bottom-20 left-20 w-16 h-16 border border-blue-400/15 rotate-12 animate-spin" style={{animationDuration: '15s', animationDirection: 'reverse'}}></div>
      </div>

      {/* Left Panel - Enhanced Controls */}
      <div className="w-full lg:w-96 bg-gradient-to-br from-white/15 via-white/10 to-white/5 backdrop-blur-xl border-r border-white/30 flex flex-col min-h-0 relative z-10">
        {/* Enhanced Header */}
        <div className="bg-gradient-to-br from-white/20 via-white/15 to-white/10 backdrop-blur-sm p-4 md:p-5 lg:p-6 border-b border-white/30 relative overflow-hidden">
          {/* Header Background Elements */}
          <div className="absolute top-2 right-4 w-3 h-3 bg-cyan-400/30 rounded-full animate-pulse"></div>
          <div className="absolute bottom-3 left-6 w-2 h-2 bg-blue-400/30 rounded-full animate-bounce" style={{animationDelay: '0.5s'}}></div>
          
          <div className="relative z-10">
            <div className="flex items-center space-x-3 mb-3 md:mb-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-2xl blur-lg opacity-40"></div>
                <div className="relative w-12 h-12 bg-gradient-to-br from-cyan-500 via-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center shadow-2xl border border-cyan-400/50">
                  <FaGamepad className="text-white text-xl md:text-2xl drop-shadow-lg" />
                  
                  {/* Pulsing Ring */}
                  <div className="absolute inset-0 rounded-2xl border border-cyan-400/30 animate-pulse"></div>
                </div>
              </div>
              <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-white bg-gradient-to-r from-white via-cyan-100 to-blue-100 bg-clip-text text-transparent drop-shadow-lg">Robot Controller</h2>
            </div>
            
            {/* Enhanced Robot Status */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-2 gap-3 md:gap-4">
              {/* Ultra Enhanced Battery Card */}
              <div className="group bg-gradient-to-br from-white/15 via-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-3 md:p-4 border border-white/30 hover:border-green-400/60 transition-all duration-500 shadow-xl hover:shadow-green-500/20 hover:scale-105 relative overflow-hidden">
                {/* Card Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="relative z-10">
                  <div className="text-gray-300 text-xs md:text-sm mb-1 font-medium">Battery</div>
                  <div className="text-green-400 font-bold text-sm md:text-lg bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent drop-shadow-lg">{robotStatus.battery}%</div>
                  <div className="w-full bg-white/10 rounded-full h-2 md:h-2.5 mt-2 overflow-hidden border border-white/20">
                    <div 
                      className="bg-gradient-to-r from-green-500 via-emerald-500 to-green-400 h-2 md:h-2.5 rounded-full transition-all duration-1000 shadow-lg relative overflow-hidden"
                      style={{ width: `${robotStatus.battery}%` }}
                    >
                      {/* Battery charge animation */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-2000"></div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Ultra Enhanced WiFi Card */}
              <div className="group bg-gradient-to-br from-white/15 via-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-3 md:p-4 border border-white/30 hover:border-blue-400/60 transition-all duration-500 shadow-xl hover:shadow-blue-500/20 hover:scale-105 relative overflow-hidden">
                {/* Card Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="relative z-10">
                  <div className="text-gray-300 text-xs md:text-sm mb-1 font-medium">WiFi Signal</div>
                  <div className="text-blue-400 font-bold text-sm md:text-lg bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent drop-shadow-lg">{robotStatus.wifi}%</div>
                  <div className="w-full bg-white/10 rounded-full h-2 md:h-2.5 mt-2 overflow-hidden border border-white/20">
                    <div 
                      className="bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-400 h-2 md:h-2.5 rounded-full transition-all duration-1000 shadow-lg relative overflow-hidden"
                      style={{ width: `${robotStatus.wifi}%` }}
                    >
                      {/* Signal animation */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-2000"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Manual Control */}
        <div className="p-4 md:p-5 lg:p-6 border-b border-white/30 relative">
          {/* Section Background */}
          <div className="absolute top-2 right-6 w-2 h-2 bg-green-400/30 rounded-full animate-pulse"></div>
          
          <div className="relative z-10">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-1 h-6 bg-gradient-to-b from-green-500 to-emerald-500 rounded-full"></div>
              <h3 className="text-base md:text-lg font-bold text-white bg-gradient-to-r from-white via-green-100 to-emerald-100 bg-clip-text text-transparent drop-shadow-lg">Manual Control</h3>
            </div>
            
            <div className="flex flex-wrap gap-3">
              {/* Ultra Enhanced Start Button */}
              <button className="group relative flex items-center space-x-2 bg-gradient-to-br from-green-500 via-emerald-500 to-green-600 hover:from-green-400 hover:via-emerald-400 hover:to-green-500 text-white px-3 md:px-4 lg:px-5 py-2 md:py-2.5 rounded-2xl transition-all duration-500 hover:scale-105 text-sm md:text-base font-semibold shadow-2xl hover:shadow-green-500/30 border border-green-400/50 overflow-hidden">
                {/* Button glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-green-400/20 to-emerald-400/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="relative z-10 flex items-center space-x-2">
                  <div className="relative">
                    <FaPlay className="text-xs md:text-sm drop-shadow-lg" />
                    {/* Icon glow */}
                    <div className="absolute inset-0 text-green-200 animate-pulse opacity-50">
                      <FaPlay className="text-xs md:text-sm" />
                    </div>
                  </div>
                  <span className="drop-shadow-lg">Start</span>
                </div>
                
                {/* Shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
              </button>
              
              {/* Ultra Enhanced Stop Button */}
              <button className="group relative flex items-center space-x-2 bg-gradient-to-br from-red-500 via-rose-500 to-red-600 hover:from-red-400 hover:via-rose-400 hover:to-red-500 text-white px-3 md:px-4 lg:px-5 py-2 md:py-2.5 rounded-2xl transition-all duration-500 hover:scale-105 text-sm md:text-base font-semibold shadow-2xl hover:shadow-red-500/30 border border-red-400/50 overflow-hidden">
                {/* Button glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-red-400/20 to-rose-400/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="relative z-10 flex items-center space-x-2">
                  <div className="relative">
                    <FaStop className="text-xs md:text-sm drop-shadow-lg" />
                    {/* Icon glow */}
                    <div className="absolute inset-0 text-red-200 animate-pulse opacity-50">
                      <FaStop className="text-xs md:text-sm" />
                    </div>
                  </div>
                  <span className="drop-shadow-lg">Stop</span>
                </div>
                
                {/* Shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
              </button>
              
              {/* Ultra Enhanced Home Button */}
              <button className="group relative flex items-center space-x-2 bg-gradient-to-br from-purple-500 via-violet-500 to-purple-600 hover:from-purple-400 hover:via-violet-400 hover:to-purple-500 text-white px-3 md:px-4 lg:px-5 py-2 md:py-2.5 rounded-2xl transition-all duration-500 hover:scale-105 text-sm md:text-base font-semibold shadow-2xl hover:shadow-purple-500/30 border border-purple-400/50 overflow-hidden">
                {/* Button glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-400/20 to-violet-400/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="relative z-10 flex items-center space-x-2">
                  <div className="relative">
                    <FaHome className="text-xs md:text-sm drop-shadow-lg" />
                    {/* Icon glow */}
                    <div className="absolute inset-0 text-purple-200 animate-pulse opacity-50">
                      <FaHome className="text-xs md:text-sm" />
                    </div>
                  </div>
                  <span className="drop-shadow-lg">Home</span>
                </div>
                
                {/* Shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
              </button>
            </div>
          </div>
        </div>

        {/* Enhanced Robot Status */}
        <div className="p-4 md:p-5 lg:p-6 border-b border-white/30 relative">
          {/* Section Background */}
          <div className="absolute top-3 right-4 w-2 h-2 bg-cyan-400/30 rounded-full animate-bounce"></div>
          <div className="absolute bottom-4 left-5 w-1 h-1 bg-blue-400/30 rounded-full animate-pulse" style={{animationDelay: '0.7s'}}></div>
          
          <div className="relative z-10">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-1 h-6 bg-gradient-to-b from-cyan-500 to-blue-500 rounded-full"></div>
              <h3 className="text-base md:text-lg font-bold text-white bg-gradient-to-r from-white via-cyan-100 to-blue-100 bg-clip-text text-transparent drop-shadow-lg">Robot Status</h3>
            </div>
            
            <div className="space-y-3 md:space-y-4">
              {/* Enhanced Status Items */}
              <div className="group bg-white/5 backdrop-blur-sm rounded-xl p-3 border border-white/10 hover:border-white/20 transition-all duration-300 hover:bg-white/10">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 text-sm md:text-base font-medium">Status:</span>
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${robotStatus.isMoving ? 'bg-green-400 animate-pulse' : 'bg-gray-400'} shadow-lg`}></div>
                    <span className={`font-bold text-sm md:text-base ${robotStatus.isMoving ? 'text-green-400 bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent' : 'text-gray-400'}`}>
                      {robotStatus.isMoving ? 'Moving' : 'Idle'}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="group bg-white/5 backdrop-blur-sm rounded-xl p-3 border border-white/10 hover:border-cyan-400/30 transition-all duration-300 hover:bg-white/10">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 text-sm md:text-base font-medium">Speed:</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-12 bg-white/10 rounded-full h-1.5 overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-cyan-500 to-blue-500 h-1.5 rounded-full transition-all duration-500"
                        style={{ width: `${robotStatus.speed}%` }}
                      ></div>
                    </div>
                    <span className="text-cyan-400 font-bold text-sm md:text-base bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">{robotStatus.speed}%</span>
                  </div>
                </div>
              </div>
              
              <div className="group bg-white/5 backdrop-blur-sm rounded-xl p-3 border border-white/10 hover:border-blue-400/30 transition-all duration-300 hover:bg-white/10">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 text-sm md:text-base font-medium">Direction:</span>
                  <span className="text-blue-400 text-sm md:text-base font-mono bg-white/10 px-2 py-1 rounded-lg border border-white/20">{robotStatus.direction || 'N/A'}</span>
                </div>
              </div>
              
              <div className="group bg-white/5 backdrop-blur-sm rounded-xl p-3 border border-white/10 hover:border-orange-400/30 transition-all duration-300 hover:bg-white/10">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 text-sm md:text-base font-medium">Temperature:</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-1 h-1 bg-orange-400 rounded-full animate-pulse"></div>
                    <span className="text-orange-400 text-sm md:text-base font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">{robotStatus.temperature}°C</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Joystick Control */}
        <div className="flex-1 p-4 md:p-5 lg:p-6 min-h-0 relative">
          {/* Section Background */}
          <div className="absolute top-6 right-8 w-2 h-2 bg-purple-400/30 rounded-full animate-pulse"></div>
          <div className="absolute bottom-8 left-6 w-1 h-1 bg-pink-400/30 rounded-full animate-bounce" style={{animationDelay: '1s'}}></div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-1 h-6 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"></div>
              <h3 className="text-base md:text-lg font-bold text-white text-center bg-gradient-to-r from-white via-purple-100 to-pink-100 bg-clip-text text-transparent drop-shadow-lg">Joystick Control</h3>
              <div className="w-1 h-6 bg-gradient-to-b from-pink-500 to-purple-500 rounded-full"></div>
            </div>
            
            {/* Enhanced Joystick Container */}
            <div className="flex justify-center items-center h-48 md:h-56 lg:h-64">
              <div 
                ref={containerRef}
                className="group relative w-36 md:w-44 lg:w-48 h-36 md:h-44 lg:h-48 bg-gradient-to-br from-white/20 via-white/15 to-white/10 backdrop-blur-xl rounded-full border-3 md:border-4 lg:border-5 border-white/40 cursor-pointer shadow-2xl hover:shadow-cyan-500/30 transition-all duration-500 overflow-hidden"
                onMouseDown={handleJoystickStart}
              >
                {/* Enhanced Joystick Base Elements */}
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-purple-500/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Enhanced Base Rings */}
                <div className="absolute inset-3 md:inset-4 border-2 md:border-3 border-white/30 rounded-full animate-pulse" style={{animationDuration: '3s'}}></div>
                <div className="absolute inset-6 md:inset-8 border-1 md:border-2 border-white/20 rounded-full animate-pulse" style={{animationDuration: '4s', animationDelay: '1s'}}></div>
                
                {/* Enhanced Center Cross */}
                <div className="absolute top-1/2 left-1/2 w-0.5 h-8 md:h-10 bg-gradient-to-b from-white/40 via-cyan-400/30 to-white/40 transform -translate-x-1/2 -translate-y-1/2 rounded-full"></div>
                <div className="absolute top-1/2 left-1/2 w-8 md:w-10 h-0.5 bg-gradient-to-r from-white/40 via-cyan-400/30 to-white/40 transform -translate-x-1/2 -translate-y-1/2 rounded-full"></div>
                
                {/* Ultra Enhanced Joystick Handle */}
                <div
                  ref={joystickRef}
                  className="absolute w-10 md:w-12 lg:w-14 h-10 md:h-12 lg:h-14 bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-500 rounded-full border-3 md:border-4 border-white shadow-2xl transform -translate-x-1/2 -translate-y-1/2 cursor-grab active:cursor-grabbing overflow-hidden"
                  style={{
                    left: `calc(50% + ${joystickPosition.x}px)`,
                    top: `calc(50% + ${joystickPosition.y}px)`,
                    boxShadow: isDragging 
                      ? '0 0 30px rgba(34, 211, 238, 0.8), 0 0 60px rgba(34, 211, 238, 0.4), 0 0 90px rgba(168, 85, 247, 0.3)' 
                      : '0 8px 32px rgba(0, 0, 0, 0.4), 0 0 20px rgba(34, 211, 238, 0.3)',
                    transition: isDragging ? 'none' : 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
                  }}
                >
                  {/* Handle Inner Elements */}
                  <div className="absolute inset-1 md:inset-1.5 bg-white/30 rounded-full backdrop-blur-sm"></div>
                  <div className="absolute inset-2 md:inset-3 bg-gradient-to-br from-white/40 to-white/10 rounded-full"></div>
                  
                  {/* Handle Glow Ring */}
                  <div className="absolute inset-0 rounded-full border border-cyan-400/50 animate-pulse"></div>
                  
                  {/* Active State Indicator */}
                  {isDragging && (
                    <div className="absolute inset-0 rounded-full border-2 border-purple-400/70 animate-ping"></div>
                  )}
                </div>

                {/* Enhanced Center Dot */}
                <div className="absolute top-1/2 left-1/2 w-2 md:w-3 h-2 md:h-3 bg-gradient-to-br from-white via-cyan-200 to-blue-200 rounded-full transform -translate-x-1/2 -translate-y-1/2 shadow-lg animate-pulse"></div>
                
                {/* Floating Particles */}
                <div className="absolute top-4 right-6 w-1 h-1 bg-cyan-400/60 rounded-full animate-bounce"></div>
                <div className="absolute bottom-6 left-4 w-1 h-1 bg-purple-400/60 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
                <div className="absolute top-1/3 right-4 w-0.5 h-0.5 bg-blue-400/60 rounded-full animate-ping" style={{animationDelay: '1s'}}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Enhanced Map */}
      <div className="flex-1 bg-gradient-to-br from-white/15 via-white/10 to-white/5 backdrop-blur-xl flex flex-col min-w-0 min-h-0 relative z-10 border-l border-white/20">
        {/* Enhanced Map Header */}
        <div className="bg-gradient-to-br from-white/20 via-white/15 to-white/10 backdrop-blur-sm p-4 md:p-5 lg:p-6 border-b border-white/30 relative overflow-hidden">
          {/* Header Background Elements */}
          <div className="absolute top-3 right-6 w-3 h-3 bg-green-400/30 rounded-full animate-pulse"></div>
          <div className="absolute bottom-2 left-8 w-2 h-2 bg-blue-400/30 rounded-full animate-bounce" style={{animationDelay: '0.8s'}}></div>
          
          <div className="relative z-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between space-y-3 md:space-y-0">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-emerald-600 rounded-2xl blur-lg opacity-40"></div>
                  <div className="relative w-12 h-12 bg-gradient-to-br from-green-500 via-emerald-500 to-green-600 rounded-2xl flex items-center justify-center shadow-2xl border border-green-400/50">
                    <span className="text-white text-xl font-bold drop-shadow-lg">🗺️</span>
                    
                    {/* Pulsing Ring */}
                    <div className="absolute inset-0 rounded-2xl border border-green-400/30 animate-pulse"></div>
                  </div>
                </div>
                <h3 className="text-lg md:text-xl font-bold text-white bg-gradient-to-r from-white via-green-100 to-emerald-100 bg-clip-text text-transparent drop-shadow-lg">Map Simulator</h3>
              </div>
              
              <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                <div className="flex items-center space-x-2 bg-white/5 backdrop-blur-sm px-3 py-2 rounded-xl border border-white/20">
                  <span className="text-gray-300 text-sm md:text-base font-medium">Position:</span>
                  <span className="text-white font-mono text-sm md:text-base bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent font-bold">
                    X: {Math.round(robotPosition.x)}, Y: {Math.round(robotPosition.y)}
                  </span>
                </div>
                
                <button className="group relative flex items-center space-x-2 bg-gradient-to-br from-slate-600/80 via-slate-500/80 to-slate-600/80 hover:from-slate-500/80 hover:via-slate-400/80 hover:to-slate-500/80 backdrop-blur-sm text-white px-3 md:px-4 py-2 rounded-xl transition-all duration-500 hover:scale-105 text-sm md:text-base font-medium shadow-xl hover:shadow-slate-500/20 border border-white/20 overflow-hidden">
                  {/* Button glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  <div className="relative z-10 flex items-center space-x-2">
                    <FaCog className="text-xs md:text-sm drop-shadow-lg" />
                    <span className="drop-shadow-lg">Settings</span>
                  </div>
                  
                  {/* Shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Map Container */}
        <div className="flex-1 p-3 md:p-4 lg:p-6 min-h-0 relative">
          {/* Container Background Elements */}
          <div className="absolute top-8 right-12 w-2 h-2 bg-cyan-400/20 rounded-full animate-pulse"></div>
          <div className="absolute bottom-12 left-8 w-1 h-1 bg-green-400/20 rounded-full animate-bounce" style={{animationDelay: '1.2s'}}></div>
          
          <div className="relative z-10 h-full bg-white rounded-2xl overflow-hidden border-4 md:border-6 lg:border-8 border-gradient-to-br from-gray-800 via-gray-900 to-black shadow-2xl">
            {/* Enhanced Room walls with gradient borders */}
            {/* Center vertical wall with door gap at middle */}
            <div className="absolute bg-gradient-to-b from-gray-800 via-black to-gray-800 shadow-xl" style={{ left: '48%', width: '4%', top: '8%', height: '30%' }}></div>
            <div className="absolute bg-gradient-to-b from-gray-800 via-black to-gray-800 shadow-xl" style={{ left: '48%', width: '4%', top: '62%', height: '30%' }}></div>
            
            {/* Center horizontal wall with door gap at center */}
            <div className="absolute bg-gradient-to-r from-gray-800 via-black to-gray-800 shadow-xl" style={{ top: '48%', height: '4%', left: '8%', width: '30%' }}></div>
            <div className="absolute bg-gradient-to-r from-gray-800 via-black to-gray-800 shadow-xl" style={{ top: '48%', height: '4%', left: '62%', width: '30%' }}></div>

            {/* Enhanced room labels with modern styling */}
            <div className="absolute text-xs md:text-sm text-gray-600 font-bold bg-white/80 backdrop-blur-sm px-2 py-1 rounded-lg border border-gray-300 shadow-md" style={{ top: '12%', left: '12%' }}>Room A</div>
            <div className="absolute text-xs md:text-sm text-gray-600 font-bold bg-white/80 backdrop-blur-sm px-2 py-1 rounded-lg border border-gray-300 shadow-md" style={{ top: '12%', right: '12%' }}>Room B</div>
            <div className="absolute text-xs md:text-sm text-gray-600 font-bold bg-white/80 backdrop-blur-sm px-2 py-1 rounded-lg border border-gray-300 shadow-md" style={{ bottom: '12%', left: '12%' }}>Room C</div>
            <div className="absolute text-xs md:text-sm text-gray-600 font-bold bg-white/80 backdrop-blur-sm px-2 py-1 rounded-lg border border-gray-300 shadow-md" style={{ bottom: '12%', right: '12%' }}>Room D</div>

            {/* Enhanced grid with gradient lines */}
            <div className="absolute inset-0 opacity-20 pointer-events-none">
              {[...Array(9)].map((_, i) => (
                <div key={`v-${i}`} className="absolute h-full w-px bg-gradient-to-b from-transparent via-gray-400 to-transparent" style={{ left: `${(i + 1) * 10}%` }}></div>
              ))}
              {[...Array(9)].map((_, i) => (
                <div key={`h-${i}`} className="absolute w-full h-px bg-gradient-to-r from-transparent via-gray-400 to-transparent" style={{ top: `${(i + 1) * 10}%` }}></div>
              ))}
            </div>

            {/* Ultra Enhanced Robot Position */}
            <div 
              className="absolute w-5 md:w-6 lg:w-7 h-5 md:h-6 lg:h-7 bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-500 rounded-full border-2 md:border-3 border-white shadow-2xl transform -translate-x-1/2 -translate-y-1/2 z-20 overflow-hidden"
              style={{
                left: `${robotPosition.x}%`,
                top: `${robotPosition.y}%`,
                boxShadow: robotStatus.isMoving 
                  ? '0 0 25px rgba(34, 211, 238, 0.9), 0 0 50px rgba(34, 211, 238, 0.5), 0 0 75px rgba(168, 85, 247, 0.3)' 
                  : '0 6px 20px rgba(0, 0, 0, 0.4), 0 0 15px rgba(34, 211, 238, 0.4)',
                transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)'
              }}
            >
              {/* Robot inner elements */}
              <div className="absolute inset-0.5 bg-white/40 rounded-full backdrop-blur-sm"></div>
              <div className="absolute inset-1 bg-gradient-to-br from-white/50 to-white/20 rounded-full"></div>
              
              {/* Robot direction indicator - enhanced */}
              <div className="absolute top-0.5 left-1/2 w-1 h-2 md:h-2.5 lg:h-3 bg-gradient-to-b from-white via-cyan-200 to-blue-200 rounded-full transform -translate-x-1/2 shadow-lg"></div>
              
              {/* Active state ring */}
              {robotStatus.isMoving && (
                <div className="absolute inset-0 rounded-full border-2 border-cyan-400/70 animate-pulse"></div>
              )}
            </div>

            {/* Enhanced Robot trail/path with multiple layers */}
            {robotStatus.isMoving && (
              <>
                {/* Outer trail */}
                <div 
                  className="absolute w-4 md:w-5 lg:w-6 h-4 md:h-5 lg:h-6 bg-cyan-300/30 rounded-full transform -translate-x-1/2 -translate-y-1/2 animate-ping z-10"
                  style={{
                    left: `${robotPosition.x}%`,
                    top: `${robotPosition.y}%`,
                    animationDuration: '2s'
                  }}
                ></div>
                
                {/* Middle trail */}
                <div 
                  className="absolute w-3 md:w-4 lg:w-5 h-3 md:h-4 lg:h-5 bg-blue-400/40 rounded-full transform -translate-x-1/2 -translate-y-1/2 animate-ping z-15"
                  style={{
                    left: `${robotPosition.x}%`,
                    top: `${robotPosition.y}%`,
                    animationDuration: '1.5s',
                    animationDelay: '0.3s'
                  }}
                ></div>
                
                {/* Inner trail */}
                <div 
                  className="absolute w-2 md:w-3 lg:w-4 h-2 md:h-3 lg:h-4 bg-purple-400/50 rounded-full transform -translate-x-1/2 -translate-y-1/2 animate-ping z-18"
                  style={{
                    left: `${robotPosition.x}%`,
                    top: `${robotPosition.y}%`,
                    animationDuration: '1s',
                    animationDelay: '0.6s'
                  }}
                ></div>
              </>
            )}
          </div>
        </div>

        {/* Enhanced Map Legend */}
        <div className="bg-gradient-to-br from-white/20 via-white/15 to-white/10 backdrop-blur-sm p-3 md:p-4 border-t border-white/30 relative overflow-hidden">
          {/* Legend Background Elements */}
          <div className="absolute top-2 right-4 w-2 h-2 bg-green-400/20 rounded-full animate-pulse"></div>
          <div className="absolute bottom-2 left-6 w-1 h-1 bg-cyan-400/20 rounded-full animate-bounce" style={{animationDelay: '0.3s'}}></div>
          
          <div className="relative z-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between space-y-3 md:space-y-0">
              <div className="flex items-center space-x-3">
                <div className="w-1 h-4 bg-gradient-to-b from-blue-500 to-cyan-500 rounded-full"></div>
                <div className="text-gray-300 text-xs md:text-sm font-bold bg-gradient-to-r from-gray-300 to-gray-100 bg-clip-text text-transparent">Binary Occupancy Grid:</div>
              </div>
              
              <div className="flex flex-wrap items-center gap-4 md:gap-6 lg:gap-8 text-xs">
                {/* Enhanced Legend Items */}
                <div className="group flex items-center space-x-2 bg-white/5 backdrop-blur-sm px-3 py-2 rounded-xl border border-white/20 hover:border-cyan-400/30 transition-all duration-300">
                  <div className="relative">
                    <div className="w-3 md:w-4 h-3 md:h-4 bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-500 rounded-full shadow-lg"></div>
                    <div className="absolute inset-0 w-3 md:w-4 h-3 md:h-4 bg-cyan-400/50 rounded-full animate-ping"></div>
                  </div>
                  <span className="text-gray-300 font-medium group-hover:text-white transition-colors duration-300">Robot</span>
                </div>
                
                <div className="group flex items-center space-x-2 bg-white/5 backdrop-blur-sm px-3 py-2 rounded-xl border border-white/20 hover:border-gray-400/30 transition-all duration-300">
                  <div className="w-3 md:w-4 h-3 md:h-4 bg-gradient-to-br from-gray-800 via-black to-gray-800 border border-gray-600 shadow-lg"></div>
                  <span className="text-gray-300 font-medium group-hover:text-white transition-colors duration-300">Obstacles</span>
                </div>
                
                <div className="group flex items-center space-x-2 bg-white/5 backdrop-blur-sm px-3 py-2 rounded-xl border border-white/20 hover:border-white/40 transition-all duration-300">
                  <div className="w-3 md:w-4 h-3 md:h-4 bg-white border border-gray-300 shadow-lg"></div>
                  <span className="text-gray-300 font-medium group-hover:text-white transition-colors duration-300">Free Space</span>
                </div>
                
                <div className="group flex items-center space-x-2 bg-white/5 backdrop-blur-sm px-3 py-2 rounded-xl border border-white/20 hover:border-gray-400/30 transition-all duration-300">
                  <div className="w-3 md:w-4 h-3 md:h-4 bg-gray-400/50 border border-gray-500 shadow-lg"></div>
                  <span className="text-gray-300 font-medium group-hover:text-white transition-colors duration-300">Grid</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Controller;
