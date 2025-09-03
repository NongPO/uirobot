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
  const [currentSlide, setCurrentSlide] = useState(0);

  // Carousel data for robot features
  const robotFeatures = [
    {
      title: "MATRIX",
      subtitle: "ROBOT",
      description: "Advanced AI-powered robot system",
      detail: "ระบบหุ่นยนต์อัจฉริยะ",
      subDetail: "ลงทะเบียนเพื่อใช้งาน"
    },
    {
      title: "SMART",
      subtitle: "CONTROL",
      description: "Intelligent robot control interface",
      detail: "ควบคุมหุ่นยนต์อัจฉริยะ",
      subDetail: "ระบบควบคุมที่ทันสมัย"
    },
    {
      title: "REAL-TIME",
      subtitle: "MONITORING",
      description: "Live monitoring and analytics",
      detail: "ติดตามแบบเรียลไทม์",
      subDetail: "วิเคราะห์ข้อมูลทันที"
    }
  ];

  // Auto-rotate carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % robotFeatures.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

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

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + robotFeatures.length) % robotFeatures.length);
  };

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % robotFeatures.length);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex">
      {/* Left Section - Carousel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-cyan-500/10 to-blue-800/20"></div>
        <div className="absolute inset-0 opacity-30">
          <div className="w-full h-full bg-gradient-to-br from-blue-400/5 via-transparent to-cyan-400/5"></div>
        </div>
        
        {/* Carousel Content */}
        <div className="relative z-10 flex flex-col justify-center items-center text-center p-12 w-full">
          {/* Navigation Arrows */}
          <button 
            onClick={handlePrevSlide}
            className="absolute left-8 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300 border border-white/20"
          >
            ←
          </button>
          <button 
            onClick={handleNextSlide}
            className="absolute right-8 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300 border border-white/20"
          >
            →
          </button>

          {/* Robot Icon */}
          <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-2xl flex items-center justify-center mb-8 shadow-2xl">
            <FaRobot className="text-4xl text-white" />
          </div>

          {/* Title */}
          <div className="mb-6">
            <h1 className="text-6xl font-bold text-white mb-2 tracking-wide">
              {robotFeatures[currentSlide].title}
            </h1>
            <h2 className="text-4xl font-light text-cyan-300 tracking-widest">
              {robotFeatures[currentSlide].subtitle}
            </h2>
          </div>

          {/* Description */}
          <p className="text-xl text-blue-100 mb-4 max-w-md">
            {robotFeatures[currentSlide].description}
          </p>

          {/* Separator */}
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-16 h-0.5 bg-gradient-to-r from-transparent to-blue-400"></div>
            <div className="w-4 h-0.5 bg-blue-400"></div>
            <div className="w-16 h-0.5 bg-gradient-to-l from-transparent to-blue-400"></div>
          </div>

          {/* Thai Text */}
          <div className="mb-6">
            <p className="text-2xl text-cyan-300 font-medium mb-1">
              {robotFeatures[currentSlide].detail}
            </p>
            <p className="text-lg text-blue-200">
              {robotFeatures[currentSlide].subDetail}
            </p>
          </div>

          {/* Language Flags */}
          <div className="flex space-x-4 mb-8">
            <div className="w-8 h-6 bg-gradient-to-r from-red-500 via-white to-red-500 rounded shadow-lg"></div>
            <div className="w-8 h-6 bg-gradient-to-r from-red-500 via-white to-blue-500 rounded shadow-lg"></div>
            <div className="w-8 h-6 bg-gradient-to-r from-red-500 via-white to-red-500 rounded shadow-lg"></div>
          </div>

          {/* Carousel Indicators */}
          <div className="flex space-x-3">
            {robotFeatures.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentSlide
                    ? 'bg-blue-400 w-8'
                    : 'bg-white/30 hover:bg-white/50 w-2'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Right Section - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <FaRobot className="text-2xl text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white">Matrix Robot</h1>
          </div>

          {/* Login Card */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-2xl">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <FaShieldAlt className="text-xl text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">
                {isLogin ? 'เข้าสู่ระบบ' : 'สมัครสมาชิก'}
              </h2>
              <p className="text-blue-200">
                {isLogin ? 'เข้าสู่ระบบควบคุมหุ่นยนต์' : 'สร้างบัญชีใหม่สำหรับระบบ'}
              </p>
            </div>

            {/* Error/Success Messages */}
            {error && (
              <div className="mb-6 p-3 bg-red-500/20 border border-red-500/50 rounded-lg">
                <p className="text-red-200 text-sm text-center">{error}</p>
              </div>
            )}
            {success && (
              <div className="mb-6 p-3 bg-green-500/20 border border-green-500/50 rounded-lg">
                <p className="text-green-200 text-sm text-center">{success}</p>
              </div>
            )}

            {/* Login Form */}
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
                      className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
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
                    <FaUser className="text-blue-400" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
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
                    className="w-full pl-10 pr-12 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
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
                      className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
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

              {/* Login Button */}
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 ${
                  isLoading
                    ? 'bg-gray-600 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 transform hover:scale-105 shadow-lg hover:shadow-xl'
                } text-white`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <FaSpinner className="animate-spin" />
                    <span>{isLogin ? 'กำลังเข้าสู่ระบบ...' : 'กำลังสมัครสมาชิก...'}</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <span>{isLogin ? 'เข้าสู่ระบบ' : 'สมัครสมาชิก'}</span>
                    <FaArrowRight />
                  </div>
                )}
              </button>
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

          {/* Footer */}
          <div className="text-center mt-8">
            <div className="text-blue-300 mb-4">
              <p className="text-sm mb-2">
                © 2025 Robot Control System. All rights reserved.
              </p>
              <div className="flex justify-center space-x-4 text-xs">
                <span>Built with Next.js</span>
                <span>•</span>
                <span>Powered by Supabase</span>
                <span>•</span>
                <span>v1.0.0</span>
              </div>
            </div>
            <div className="flex justify-center space-x-6 pt-4 border-t border-white/10">
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
  );
}
