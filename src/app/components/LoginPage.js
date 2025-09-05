'use client';

import React, { useState, useEffect } from 'react';
import { 
  FaRobot, 
  FaUser, 
  FaLock, 
  FaEye, 
  FaEyeSlash,
  FaShieldAlt,
  FaArrowRight,
  FaSpinner,
  FaGithub,
  FaEnvelope
} from 'react-icons/fa';
import { auth } from '../../lib/supabase';

export default function LoginPage({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');
    
    try {
      if (isLogin) {
        // Sign in existing user
        const { data, error } = await auth.signIn(email, password);
        
        if (error) {
          setError(error.message);
        } else {
          setSuccess('เข้าสู่ระบบสำเร็จ!');
          setTimeout(() => {
            onLogin(data.user);
          }, 1000);
        }
      } else {
        // Sign up new user
        if (password !== confirmPassword) {
          setError('รหัสผ่านไม่ตรงกัน');
          setIsLoading(false);
          return;
        }
        
        const { data, error } = await auth.signUp(email, password, { name });
        
        if (error) {
          setError(error.message);
        } else {
          setSuccess('สมัครสมาชิกสำเร็จ! กรุณาตรวจสอบอีเมลเพื่อยืนยันบัญชี');
          // Switch to login mode after successful signup
          setTimeout(() => {
            setIsLogin(true);
            setError('');
            setSuccess('');
          }, 3000);
        }
      }
    } catch (err) {
      setError('เกิดข้อผิดพลาด กรุณาลองอีกครั้ง');
    } finally {
      setIsLoading(false);
    }
  };

  // Demo login handler
  const handleDemoLogin = async (userType = 'demo') => {
    setIsLoading(true);
    setError('');
    setSuccess('');
    
    const demoCredentials = auth.getDemoCredentials();
    const credentials = demoCredentials[userType];
    
    try {
      const { data, error } = await auth.signIn(credentials.email, credentials.password);
      
      if (error) {
        setError(error.message);
      } else {
        setSuccess('เข้าสู่ระบบ Demo สำเร็จ!');
        setTimeout(() => {
          onLogin(data.user);
        }, 1000);
      }
    } catch (err) {
      setError('เกิดข้อผิดพลาด กรุณาลองอีกครั้ง');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 z-0">
        {/* Floating Particles */}
        <div className="absolute w-2 h-2 bg-blue-400/20 rounded-full animate-pulse" style={{top: '10%', left: '15%', animationDelay: '0s'}}></div>
        <div className="absolute w-1 h-1 bg-cyan-400/30 rounded-full animate-pulse" style={{top: '20%', left: '80%', animationDelay: '1s'}}></div>
        <div className="absolute w-3 h-3 bg-blue-300/10 rounded-full animate-pulse" style={{top: '60%', left: '10%', animationDelay: '2s'}}></div>
        <div className="absolute w-1.5 h-1.5 bg-cyan-300/20 rounded-full animate-pulse" style={{top: '75%', left: '85%', animationDelay: '3s'}}></div>
        <div className="absolute w-2 h-2 bg-blue-400/15 rounded-full animate-pulse" style={{top: '30%', left: '70%', animationDelay: '4s'}}></div>
        
        {/* Geometric Shapes */}
        <div className="absolute top-1/4 left-1/4 w-32 h-32 border border-blue-400/10 rotate-45 animate-spin" style={{animationDuration: '20s'}}></div>
        <div className="absolute top-3/4 right-1/4 w-20 h-20 border border-cyan-400/10 rotate-12 animate-spin" style={{animationDuration: '15s', animationDirection: 'reverse'}}></div>
        
        {/* Moving Gradient Orbs */}
        <div className="absolute top-10 left-10 w-40 h-40 bg-gradient-to-r from-blue-500/5 to-cyan-500/5 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-60 h-60 bg-gradient-to-r from-cyan-500/5 to-blue-500/5 rounded-full blur-xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      {/* Left Section - Carousel */}
      <div className="hidden md:flex md:w-2/5 lg:w-1/2 relative overflow-hidden">
        {/* Enhanced Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/30 via-cyan-500/20 to-blue-800/30"></div>
        <div className="absolute inset-0 opacity-40">
          <div className="w-full h-full bg-gradient-to-br from-blue-400/10 via-transparent to-cyan-400/10"></div>
          {/* Grid Pattern */}
          <div className="absolute inset-0 opacity-20" 
               style={{
                 backgroundImage: 'linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)',
                 backgroundSize: '50px 50px'
               }}>
          </div>
        </div>
        
        {/* Carousel Content */}
        <div className="relative z-10 flex flex-col justify-center items-center text-center p-6 lg:p-12 w-full">

          {/* Enhanced Robot Icon */}
          <div className="relative w-28 h-28 mb-8 group">
            {/* Outer Ring Animation */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-400/20 to-cyan-400/20 animate-spin" style={{animationDuration: '3s'}}></div>
            <div className="absolute inset-1 rounded-2xl bg-gradient-to-r from-cyan-400/20 to-blue-400/20 animate-spin" style={{animationDuration: '2s', animationDirection: 'reverse'}}></div>
            
            {/* Main Icon Container */}
            <div className="relative w-24 h-24 bg-gradient-to-br from-blue-400 via-cyan-400 to-blue-500 rounded-2xl flex items-center justify-center shadow-2xl transform group-hover:scale-110 transition-all duration-500 mx-auto mt-2">
              <FaRobot className="text-4xl text-white drop-shadow-lg animate-pulse" />
              
              {/* Glowing Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400/50 to-cyan-400/50 rounded-2xl blur-md -z-10 group-hover:blur-lg transition-all duration-500"></div>
            </div>
          </div>

          {/* Enhanced Title with Animation */}
          <div className="mb-6">
            <h1 className="text-6xl font-bold text-white mb-2 tracking-wide relative">
              <span className="bg-gradient-to-r from-white via-blue-100 to-cyan-100 bg-clip-text text-transparent animate-pulse">
                MATRIX
              </span>
              {/* Glowing Text Effect */}
              <div className="absolute inset-0 text-6xl font-bold tracking-wide">
                <span className="text-blue-400/20 blur-sm">MATRIX</span>
              </div>
            </h1>
            <h2 className="text-4xl font-light text-cyan-300 tracking-widest relative">
              <span className="bg-gradient-to-r from-cyan-300 via-blue-300 to-cyan-400 bg-clip-text text-transparent">
                ROBOT
              </span>
            </h2>
          </div>

          {/* Enhanced Description */}
          <p className="text-xl text-blue-100 mb-4 max-w-md relative">
            <span className="bg-gradient-to-r from-blue-100 to-cyan-100 bg-clip-text text-transparent font-medium">
              Advanced AI-powered robot system
            </span>
          </p>

          {/* Enhanced Animated Separator */}
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-16 h-0.5 bg-gradient-to-r from-transparent to-blue-400 animate-pulse"></div>
            <div className="w-4 h-0.5 bg-blue-400 animate-pulse" style={{animationDelay: '0.5s'}}></div>
            <div className="w-16 h-0.5 bg-gradient-to-l from-transparent to-blue-400 animate-pulse" style={{animationDelay: '1s'}}></div>
          </div>

          {/* Enhanced Thai Text */}
          <div className="mb-6">
            <p className="text-2xl text-cyan-300 font-medium mb-1 bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent">
              ระบบหุ่นยนต์อัจฉริยะ
            </p>
            <p className="text-lg text-blue-200 bg-gradient-to-r from-blue-200 to-cyan-200 bg-clip-text text-transparent">
              ลงทะเบียนเพื่อใช้งาน
            </p>
          </div>

          {/* Enhanced Language Selection */}
          <div className="flex space-x-8 mb-8">
            {/* Thai */}
            <button className="flex flex-col items-center space-y-2 group transition-all duration-500 hover:scale-110 relative">
              <div className="relative w-12 h-8 rounded-md overflow-hidden shadow-lg group-hover:shadow-2xl transition-all duration-500 border border-white/30 group-hover:border-white/60">
                <img 
                  src="/flags/thailand.svg" 
                  alt="Thailand Flag" 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {/* Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-t from-blue-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
              <span className="text-xs text-white/80 group-hover:text-white font-medium transition-all duration-300 group-hover:scale-110">ไทย</span>
            </button>
            
            {/* English */}
            <button className="flex flex-col items-center space-y-2 group transition-all duration-500 hover:scale-110 relative">
              <div className="relative w-12 h-8 rounded-md overflow-hidden shadow-lg group-hover:shadow-2xl transition-all duration-500 border border-white/30 group-hover:border-white/60">
                <img 
                  src="/flags/usa.svg" 
                  alt="USA Flag" 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {/* Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-t from-red-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
              <span className="text-xs text-white/80 group-hover:text-white font-medium transition-all duration-300 group-hover:scale-110">English</span>
            </button>
            
            {/* Japanese */}
            <button className="flex flex-col items-center space-y-2 group transition-all duration-500 hover:scale-110 relative">
              <div className="relative w-12 h-8 rounded-md overflow-hidden shadow-lg group-hover:shadow-2xl transition-all duration-500 border border-white/30 group-hover:border-white/60">
                <img 
                  src="/flags/japan.svg" 
                  alt="Japan Flag" 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {/* Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-t from-red-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
              <span className="text-xs text-white/80 group-hover:text-white font-medium transition-all duration-300 group-hover:scale-110">日本語</span>
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced Right Section - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative min-h-screen">
        {/* Enhanced Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-800/50 via-blue-900/30 to-slate-900/50"></div>
        
        {/* Advanced Floating Elements */}
        <div className="absolute top-16 right-16 w-24 h-24 bg-gradient-to-br from-blue-400/10 to-cyan-400/10 rounded-full animate-pulse backdrop-blur-sm border border-blue-400/20"></div>
        <div className="absolute bottom-24 left-16 w-20 h-20 bg-gradient-to-br from-cyan-400/10 to-blue-400/10 rounded-full animate-pulse backdrop-blur-sm border border-cyan-400/20" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/3 left-8 w-16 h-16 bg-gradient-to-br from-purple-400/8 to-blue-400/8 rounded-full animate-pulse backdrop-blur-sm" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-1/3 right-8 w-14 h-14 bg-gradient-to-br from-teal-400/8 to-cyan-400/8 rounded-full animate-pulse backdrop-blur-sm" style={{animationDelay: '3s'}}></div>
        
        {/* Animated Light Rays */}
        <div className="absolute top-0 left-1/4 w-px h-32 bg-gradient-to-b from-blue-400/30 to-transparent animate-pulse"></div>
        <div className="absolute top-0 right-1/3 w-px h-24 bg-gradient-to-b from-cyan-400/30 to-transparent animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-0 left-1/3 w-px h-28 bg-gradient-to-t from-blue-400/30 to-transparent animate-pulse" style={{animationDelay: '2s'}}></div>
        
        <div className="w-full max-w-lg relative z-10">
          {/* Enhanced Mobile Logo */}
          <div className="lg:hidden text-center mb-10">
            <div className="relative w-20 h-20 mx-auto mb-6 group">
              {/* Multiple Rotating Rings */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/40 to-cyan-500/40 rounded-2xl animate-spin border border-blue-400/30" style={{animationDuration: '4s'}}></div>
              <div className="absolute inset-1 bg-gradient-to-r from-cyan-500/30 to-blue-500/30 rounded-xl animate-spin border border-cyan-400/20" style={{animationDuration: '3s', animationDirection: 'reverse'}}></div>
              <div className="absolute inset-2 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-lg animate-spin" style={{animationDuration: '2s'}}></div>
              
              <div className="relative w-16 h-16 bg-gradient-to-br from-blue-500 via-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-2xl transform group-hover:scale-110 transition-all duration-700 mx-auto mt-2 border border-cyan-400/50">
                <FaRobot className="text-3xl text-white drop-shadow-lg" />
                
                {/* Enhanced Glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400/60 to-cyan-400/60 rounded-2xl blur-lg -z-10 group-hover:blur-xl group-hover:scale-110 transition-all duration-700"></div>
              </div>
            </div>
            <h1 className="text-4xl font-bold text-white bg-gradient-to-r from-white via-cyan-100 to-blue-100 bg-clip-text text-transparent drop-shadow-lg">Matrix Robot</h1>
            <p className="text-blue-200 mt-2 text-lg">AI Control System</p>
          </div>

          {/* Ultra Enhanced Login Card */}
          <div className="relative bg-white/8 backdrop-blur-2xl rounded-3xl p-10 border border-white/30 shadow-2xl group hover:bg-white/10 transition-all duration-700">
            {/* Multi-layer Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/15 to-cyan-500/15 rounded-3xl blur-2xl opacity-60 group-hover:opacity-90 transition-opacity duration-700"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-3xl blur-xl opacity-40 group-hover:opacity-70 transition-opacity duration-700"></div>
            
            {/* Animated Border */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-400/20 via-cyan-400/20 to-blue-400/20 animate-pulse"></div>
            <div className="absolute inset-px rounded-3xl bg-gradient-to-br from-slate-900/80 to-slate-800/80 backdrop-blur-2xl"></div>
            
            <div className="relative z-10">
              {/* Enhanced Header with Animation */}
              <div className="text-center mb-10">
                <div className="relative w-16 h-16 mx-auto mb-6 group">
                  {/* Pulsing Background */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/40 to-cyan-500/40 rounded-2xl animate-pulse blur-sm"></div>
                  <div className="absolute inset-1 bg-gradient-to-r from-cyan-500/30 to-blue-500/30 rounded-xl animate-pulse" style={{animationDelay: '0.5s'}}></div>
                  
                  <div className="relative w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center mx-auto mt-1 shadow-2xl border border-cyan-400/50 group-hover:scale-110 transition-all duration-500">
                    <FaShieldAlt className="text-2xl text-white drop-shadow-lg" />
                  </div>
                </div>
                
                <h2 className="text-3xl font-bold text-white mb-3 bg-gradient-to-r from-white via-cyan-100 to-blue-100 bg-clip-text text-transparent drop-shadow-lg">
                  {isLogin ? 'เข้าสู่ระบบ' : 'สมัครสมาชิก'}
                </h2>
                <p className="text-blue-200 text-lg bg-gradient-to-r from-blue-200 via-cyan-200 to-blue-300 bg-clip-text text-transparent">
                  {isLogin ? 'เข้าสู่ระบบควบคุมหุ่นยนต์อัจฉริยะ' : 'สร้างบัญชีใหม่เพื่อเข้าใช้ระบบ'}
                </p>
                
                {/* Decorative Line */}
                <div className="flex items-center justify-center mt-6">
                  <div className="w-20 h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent animate-pulse"></div>
                  <div className="w-3 h-3 bg-blue-400 rounded-full mx-4 animate-pulse"></div>
                  <div className="w-20 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse"></div>
                </div>
              </div>

            {/* Enhanced Error/Success Messages */}
            {error && (
              <div className="mb-8 relative">
                <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-pink-500/20 rounded-2xl blur-sm animate-pulse"></div>
                <div className="relative p-5 bg-red-500/10 border border-red-400/40 rounded-2xl backdrop-blur-xl">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-red-500/20 rounded-full flex items-center justify-center">
                      <span className="text-red-300 text-lg">⚠️</span>
                    </div>
                    <p className="text-red-200 font-medium flex-1">{error}</p>
                  </div>
                </div>
              </div>
            )}
            {success && (
              <div className="mb-8 relative">
                <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-2xl blur-sm animate-pulse"></div>
                <div className="relative p-5 bg-green-500/10 border border-green-400/40 rounded-2xl backdrop-blur-xl">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                      <span className="text-green-300 text-lg">✅</span>
                    </div>
                    <p className="text-green-200 font-medium flex-1">{success}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Enhanced Login Form */}
            <form onSubmit={handleLogin} className="space-y-7">
              {/* Name Field (Register only) */}
              {!isLogin && (
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-blue-200 flex items-center space-x-2">
                    <FaUser className="text-cyan-400" />
                    <span>ชื่อ-นามสกุล</span>
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-2xl blur-sm opacity-0 group-focus-within:opacity-100 transition-opacity duration-500"></div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <FaUser className="text-blue-400 group-focus-within:text-cyan-400 transition-colors duration-300" />
                      </div>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full pl-12 pr-5 py-4 bg-white/8 border border-white/30 rounded-2xl text-white placeholder-blue-300/80 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 focus:bg-white/12 transition-all duration-500 hover:bg-white/10 backdrop-blur-xl text-lg group"
                        placeholder="กรุณาใส่ชื่อ-นามสกุล"
                        required
                      />
                      {/* Input Glow Effect */}
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-400/0 via-cyan-400/0 to-blue-400/0 group-focus-within:from-blue-400/20 group-focus-within:via-cyan-400/20 group-focus-within:to-blue-400/20 transition-all duration-500 pointer-events-none"></div>
                    </div>
                  </div>
                </div>
              )}

              {/* Email Field */}
              <div className="space-y-3">
                <label className="text-sm font-semibold text-blue-200 flex items-center space-x-2">
                  <FaEnvelope className="text-cyan-400" />
                  <span>อีเมล</span>
                </label>
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-2xl blur-sm opacity-0 group-focus-within:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <FaEnvelope className="text-blue-400 group-focus-within:text-cyan-400 transition-colors duration-300" />
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-12 pr-5 py-4 bg-white/8 border border-white/30 rounded-2xl text-white placeholder-blue-300/80 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 focus:bg-white/12 transition-all duration-500 hover:bg-white/10 backdrop-blur-xl text-lg group"
                      placeholder="กรุณาใส่อีเมล"
                      required
                    />
                    {/* Input Glow Effect */}
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-400/0 via-cyan-400/0 to-blue-400/0 group-focus-within:from-blue-400/20 group-focus-within:via-cyan-400/20 group-focus-within:to-blue-400/20 transition-all duration-500 pointer-events-none"></div>
                  </div>
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-3">
                <label className="text-sm font-semibold text-blue-200 flex items-center space-x-2">
                  <FaLock className="text-cyan-400" />
                  <span>รหัสผ่าน</span>
                </label>
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-2xl blur-sm opacity-0 group-focus-within:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <FaLock className="text-blue-400 group-focus-within:text-cyan-400 transition-colors duration-300" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-12 pr-14 py-4 bg-white/8 border border-white/30 rounded-2xl text-white placeholder-blue-300/80 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 focus:bg-white/12 transition-all duration-500 hover:bg-white/10 backdrop-blur-xl text-lg group"
                      placeholder="กรุณาใส่รหัสผ่าน"
                      required
                      minLength="6"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-blue-400 hover:text-cyan-300 transition-colors duration-300 z-10"
                    >
                      {showPassword ? <FaEyeSlash className="text-lg" /> : <FaEye className="text-lg" />}
                    </button>
                    {/* Input Glow Effect */}
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-400/0 via-cyan-400/0 to-blue-400/0 group-focus-within:from-blue-400/20 group-focus-within:via-cyan-400/20 group-focus-within:to-blue-400/20 transition-all duration-500 pointer-events-none"></div>
                  </div>
                </div>
              </div>

              {/* Confirm Password Field (Register only) */}
              {!isLogin && (
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-blue-200 flex items-center space-x-2">
                    <FaLock className="text-cyan-400" />
                    <span>ยืนยันรหัสผ่าน</span>
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-2xl blur-sm opacity-0 group-focus-within:opacity-100 transition-opacity duration-500"></div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <FaLock className="text-blue-400 group-focus-within:text-cyan-400 transition-colors duration-300" />
                      </div>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full pl-12 pr-5 py-4 bg-white/8 border border-white/30 rounded-2xl text-white placeholder-blue-300/80 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 focus:bg-white/12 transition-all duration-500 hover:bg-white/10 backdrop-blur-xl text-lg group"
                        placeholder="กรุณายืนยันรหัสผ่าน"
                        required
                        minLength="6"
                      />
                      {/* Input Glow Effect */}
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-400/0 via-cyan-400/0 to-blue-400/0 group-focus-within:from-blue-400/20 group-focus-within:via-cyan-400/20 group-focus-within:to-blue-400/20 transition-all duration-500 pointer-events-none"></div>
                    </div>
                  </div>
                </div>
              )}

              {/* Remember Me & Forgot Password */}
              {isLogin && (
                <div className="flex items-center justify-between text-sm py-2">
                  <label className="flex items-center space-x-3 text-blue-200 hover:text-cyan-200 transition-colors duration-300 cursor-pointer group">
                    <div className="relative">
                      <input
                        type="checkbox"
                        className="w-5 h-5 bg-white/10 border-2 border-white/30 rounded-lg focus:ring-2 focus:ring-cyan-400/50 text-cyan-500 transition-all duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                    <span className="font-medium">จดจำการเข้าสู่ระบบ</span>
                  </label>
                  <button
                    type="button"
                    className="text-cyan-400 hover:text-cyan-300 transition-colors duration-300 font-medium hover:underline"
                  >
                    ลืมรหัสผ่าน?
                  </button>
                </div>
              )}

              {/* Ultra Enhanced Login Button */}
              <button
                type="submit"
                disabled={isLoading}
                className={`relative w-full py-5 rounded-2xl font-bold text-lg transition-all duration-700 overflow-hidden group ${
                  isLoading
                    ? 'bg-gray-600/50 cursor-not-allowed backdrop-blur-xl'
                    : 'bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-600 hover:from-blue-600 hover:via-cyan-600 hover:to-blue-700 transform hover:scale-105 hover:shadow-2xl active:scale-95'
                } text-white shadow-2xl border border-cyan-400/30`}
              >
                {/* Multi-layer Glow Effects */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400/40 via-cyan-400/40 to-blue-400/40 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 via-blue-400/20 to-cyan-400/20 blur-lg opacity-0 group-hover:opacity-80 transition-opacity duration-700"></div>
                
                {/* Animated Background */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                
                {/* Button Content */}
                <div className="relative z-10 flex items-center justify-center space-x-3">
                  {isLoading ? (
                    <>
                      <FaSpinner className="animate-spin text-xl" />
                      <span className="bg-gradient-to-r from-white to-cyan-100 bg-clip-text text-transparent">
                        {isLogin ? 'กำลังเข้าสู่ระบบ...' : 'กำลังสมัครสมาชิก...'}
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="bg-gradient-to-r from-white to-cyan-100 bg-clip-text text-transparent group-hover:from-cyan-100 group-hover:to-white transition-all duration-500">
                        {isLogin ? 'เข้าสู่ระบบ' : 'สมัครสมาชิก'}
                      </span>
                      <FaArrowRight className="group-hover:translate-x-2 transition-transform duration-500 text-cyan-100" />
                    </>
                  )}
                </div>
                
                {/* Shine Effect */}
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 ease-in-out"></div>
              </button>

              {/* Demo Credentials Info */}
              {isLogin && (
                <div className="mt-6 p-4 bg-white/5 border border-blue-400/30 rounded-xl">
                  <div className="text-center">
                    <h4 className="text-blue-300 font-semibold mb-2">🚀 Demo Account</h4>
                    <div className="text-sm text-blue-200 space-y-1">
                      <p><strong>Email:</strong> demo@robot.com</p>
                      <p><strong>Password:</strong> demo123456</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setEmail('demo@robot.com')
                        setPassword('demo123456')
                      }}
                      className="mt-3 px-4 py-2 bg-blue-500/30 hover:bg-blue-500/50 text-blue-200 text-xs rounded-lg transition-colors duration-200"
                    >
                      เติมข้อมูลอัตโนมัติ
                    </button>
                    <p className="text-xs text-blue-300 mt-2 opacity-80">
                      ใช้ข้อมูลข้างต้นเพื่อทดสอบระบบ
                    </p>
                  </div>
                </div>
              )}
            </form>

            {/* Demo Login Section */}
            {isLogin && (
              <div className="mt-6">
                <div className="flex items-center mb-4">
                  <div className="flex-1 border-t border-white/20"></div>
                  <span className="px-4 text-sm text-blue-200">ทดสอบระบบ</span>
                  <div className="flex-1 border-t border-white/20"></div>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  <button
                    type="button"
                    onClick={() => handleDemoLogin('demo')}
                    disabled={isLoading}
                    className="w-full py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-lg font-medium transition-all duration-200 disabled:opacity-50"
                  >
                    🚀 Demo User (demo@robot.com)
                  </button>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => handleDemoLogin('admin')}
                      disabled={isLoading}
                      className="py-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white text-sm rounded-lg font-medium transition-all duration-200 disabled:opacity-50"
                    >
                      👑 Admin
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDemoLogin('user')}
                      disabled={isLoading}
                      className="py-2 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white text-sm rounded-lg font-medium transition-all duration-200 disabled:opacity-50"
                    >
                      👤 User
                    </button>
                  </div>
                </div>

                <div className="mt-3 text-center">
                  <p className="text-xs text-blue-300">
                    💡 ใช้บัญชีทดสอบเพื่อเข้าสู่ระบบได้ทันที
                  </p>
                </div>
              </div>
            )}

            {/* Toggle Login/Register */}
            <div className="mt-6 text-center">
              <p className="text-blue-200">
                {isLogin ? 'ยังไม่มีบัญชี?' : 'มีบัญชีแล้ว?'}
                <button
                  type="button"
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setError('');
                    setSuccess('');
                  }}
                  className="ml-2 text-blue-400 hover:text-blue-300 font-semibold transition-colors duration-200"
                >
                  {isLogin ? 'สมัครสมาชิก' : 'เข้าสู่ระบบ'}
                </button>
              </p>
            </div>
          </div>

          {/* Enhanced Footer */}
          <div className="text-center mt-12">
            <div className="relative">
              {/* Decorative line */}
              <div className="flex items-center justify-center mb-6">
                <div className="w-16 h-px bg-gradient-to-r from-transparent via-blue-400/50 to-transparent"></div>
                <div className="w-2 h-2 bg-cyan-400/60 rounded-full mx-4 animate-pulse"></div>
                <div className="w-16 h-px bg-gradient-to-l from-transparent via-cyan-400/50 to-transparent"></div>
              </div>
              
              <div className="text-blue-300/80 mb-6 space-y-3">
                <p className="text-sm font-medium bg-gradient-to-r from-blue-200 to-cyan-200 bg-clip-text text-transparent">
                  © 2025 Matrix Robot Control System. All rights reserved.
                </p>
                <div className="flex justify-center items-center space-x-3 text-xs">
                  <span className="px-3 py-1 bg-blue-500/10 rounded-full border border-blue-400/20 backdrop-blur-sm">Built with Next.js</span>
                  <span className="text-cyan-400">•</span>
                  <span className="px-3 py-1 bg-cyan-500/10 rounded-full border border-cyan-400/20 backdrop-blur-sm">Powered by Supabase</span>
                  <span className="text-blue-400">•</span>
                  <span className="px-3 py-1 bg-purple-500/10 rounded-full border border-purple-400/20 backdrop-blur-sm">v1.0.0</span>
                </div>
              </div>
              
              <div className="flex justify-center space-x-8 pt-6 border-t border-white/10">
                <a href="#" className="group relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative w-12 h-12 bg-white/5 rounded-full flex items-center justify-center border border-white/20 group-hover:border-cyan-400/50 transition-all duration-500 backdrop-blur-sm group-hover:scale-110">
                    <FaGithub className="text-xl text-gray-400 group-hover:text-cyan-300 transition-colors duration-500" />
                  </div>
                </a>
                <a href="#" className="group relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative w-12 h-12 bg-white/5 rounded-full flex items-center justify-center border border-white/20 group-hover:border-blue-400/50 transition-all duration-500 backdrop-blur-sm group-hover:scale-110">
                    <FaEnvelope className="text-xl text-gray-400 group-hover:text-blue-300 transition-colors duration-500" />
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
