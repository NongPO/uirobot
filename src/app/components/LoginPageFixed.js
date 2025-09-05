'use client';

import React, { useState } from 'react';
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
        // Demo login
        setSuccess('เข้าสู่ระบบสำเร็จ!');
        setTimeout(() => {
          onLogin({ email: 'demo@robot.com' });
        }, 1000);
      } else {
        // Demo signup
        if (password !== confirmPassword) {
          setError('รหัสผ่านไม่ตรงกัน');
          return;
        }
        setSuccess('สมัครสมาชิกสำเร็จ!');
        setTimeout(() => {
          onLogin({ email, name });
        }, 1000);
      }
    } catch (err) {
      setError('เกิดข้อผิดพลาด กรุณาลองใหม่');
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

      {/* Left Section - Content */}
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
        
        {/* Content */}
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
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative">
        {/* Floating Elements */}
        <div className="absolute top-10 right-10 w-20 h-20 bg-blue-400/5 rounded-full animate-pulse"></div>
        <div className="absolute bottom-20 left-10 w-16 h-16 bg-cyan-400/5 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
        
        <div className="w-full max-w-md">
          {/* Enhanced Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="relative w-16 h-16 mx-auto mb-4 group">
              {/* Rotating Ring */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/30 to-cyan-500/30 rounded-xl animate-spin" style={{animationDuration: '3s'}}></div>
              <div className="relative w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-all duration-500 mx-auto mt-1">
                <FaRobot className="text-2xl text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-white bg-gradient-to-r from-white to-cyan-100 bg-clip-text text-transparent">Matrix Robot</h1>
          </div>

          {/* Enhanced Login Card */}
          <div className="relative bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/20 shadow-2xl group">
            {/* Card Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-500"></div>
            
            <div className="relative z-10">
              {/* Enhanced Header */}
              <div className="text-center mb-8">
                <div className="relative w-12 h-12 mx-auto mb-4 group">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/30 to-cyan-500/30 rounded-xl animate-pulse"></div>
                  <div className="relative w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mx-auto mt-1">
                    <FaShieldAlt className="text-xl text-white" />
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-white mb-2 bg-gradient-to-r from-white to-cyan-100 bg-clip-text text-transparent">
                  {isLogin ? 'เข้าสู่ระบบ' : 'สมัครสมาชิก'}
                </h2>
                <p className="text-blue-200 bg-gradient-to-r from-blue-200 to-cyan-200 bg-clip-text text-transparent">
                  {isLogin ? 'เข้าสู่ระบบควบคุมหุ่นยนต์' : 'สร้างบัญชีใหม่สำหรับระบบ'}
                </p>
              </div>

              {/* Enhanced Error/Success Messages */}
              {error && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl backdrop-blur-sm">
                  <p className="text-red-200 text-sm text-center font-medium">{error}</p>
                </div>
              )}
              {success && (
                <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-xl backdrop-blur-sm">
                  <p className="text-green-200 text-sm text-center font-medium">{success}</p>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleLogin} className="space-y-6">
                {/* Name Field (Register only) */}
                {!isLogin && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-blue-200">ชื่อ-นามสกุล</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaUser className="text-blue-400" />
                      </div>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400/50 transition-all duration-300 hover:bg-white/10 focus:bg-white/10 backdrop-blur-sm"
                        placeholder="กรุณาใส่ชื่อ-นามสกุล"
                        required
                      />
                    </div>
                  </div>
                )}

                {/* Email Field */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-blue-200">อีเมล</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaEnvelope className="text-blue-400" />
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400/50 transition-all duration-300 hover:bg-white/10 focus:bg-white/10 backdrop-blur-sm"
                      placeholder="กรุณาใส่อีเมล"
                      required
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-blue-200">รหัสผ่าน</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaLock className="text-blue-400" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-12 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400/50 transition-all duration-300 hover:bg-white/10 focus:bg-white/10 backdrop-blur-sm"
                      placeholder="กรุณาใส่รหัสผ่าน"
                      required
                      minLength="6"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-blue-400 hover:text-blue-300 transition-colors duration-200"
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password Field (Register only) */}
                {!isLogin && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-blue-200">ยืนยันรหัสผ่าน</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaLock className="text-blue-400" />
                      </div>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400/50 transition-all duration-300 hover:bg-white/10 focus:bg-white/10 backdrop-blur-sm"
                        placeholder="กรุณายืนยันรหัสผ่าน"
                        required
                        minLength="6"
                      />
                    </div>
                  </div>
                )}

                {/* Remember Me & Forgot Password */}
                {isLogin && (
                  <div className="flex items-center justify-between text-sm">
                    <label className="flex items-center space-x-2 text-blue-200">
                      <input
                        type="checkbox"
                        className="w-4 h-4 bg-white/10 border border-white/20 rounded focus:ring-2 focus:ring-blue-500 text-blue-500"
                      />
                      <span>จดจำการเข้าสู่ระบบ</span>
                    </label>
                    <button
                      type="button"
                      className="text-blue-400 hover:text-blue-300 transition-colors duration-200"
                    >
                      ลืมรหัสผ่าน?
                    </button>
                  </div>
                )}

                {/* Enhanced Login Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`relative w-full py-4 rounded-xl font-semibold transition-all duration-500 overflow-hidden group ${
                    isLoading
                      ? 'bg-gray-600 cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 transform hover:scale-105 shadow-lg hover:shadow-2xl'
                  } text-white`}
                >
                  {/* Button Glow Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400/50 to-cyan-400/50 blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  {/* Button Content */}
                  <div className="relative z-10">
                    {isLoading ? (
                      <div className="flex items-center justify-center space-x-2">
                        <FaSpinner className="animate-spin text-lg" />
                        <span className="text-lg">{isLogin ? 'กำลังเข้าสู่ระบบ...' : 'กำลังสมัครสมาชิก...'}</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center space-x-2 group-hover:translate-x-1 transition-transform duration-300">
                        <span className="text-lg">{isLogin ? 'เข้าสู่ระบบ' : 'สมัครสมาชิก'}</span>
                        <FaArrowRight className="group-hover:translate-x-1 transition-transform duration-300" />
                      </div>
                    )}
                  </div>
                </button>
              </form>

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

              {/* Demo Info */}
              {isLogin && (
                <div className="mt-6 p-4 bg-white/5 border border-blue-400/30 rounded-xl">
                  <p className="text-blue-200 text-sm text-center mb-2">🤖 Demo Account</p>
                  <div className="text-xs text-blue-300 space-y-1">
                    <p><span className="text-cyan-300">Email:</span> demo@robot.com</p>
                    <p><span className="text-cyan-300">Password:</span> demo123456</p>
                  </div>
                </div>
              )}

              {/* Footer */}
              <div className="text-center mt-8 text-blue-300">
                <p className="text-sm mb-4">
                  © 2025 Matrix Robot System. All rights reserved.
                </p>
                <div className="flex justify-center space-x-6">
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    <FaGithub className="text-lg" />
                  </a>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    <FaEnvelope className="text-lg" />
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
