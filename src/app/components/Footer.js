'use client';

import React from 'react';
import { FaHeart } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900/80 backdrop-blur-sm text-gray-300 border-t border-gray-600/50 relative z-20">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-2 text-sm text-gray-300">
            <span>© {currentYear} Robot Control System.</span>
            <span>Made with</span>
            <FaHeart className="text-red-400 text-xs animate-pulse" />
            <span>for intelligent automation</span>
          </div>
          
          <div className="flex items-center space-x-6 text-sm">
            <a href="#privacy" className="text-gray-300 hover:text-blue-400 transition-colors">
              Privacy Policy
            </a>
            <a href="#terms" className="text-gray-300 hover:text-blue-400 transition-colors">
              Terms of Service
            </a>
            <span className="text-gray-400">v1.0.0</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
export default Footer;