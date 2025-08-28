'use client';

import React from 'react';
import { FaRobot, FaEye } from 'react-icons/fa';

const Dashboard = () => {
  return (
    <div className="w-full bg-slate-800 p-6 space-y-6">
      {/* Top Section - RoboDoc and Vision Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* RoboDoc Card */}
        <div className="bg-slate-700/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-600/50 hover:border-blue-400/50 transition-all duration-300 shadow-lg hover:shadow-xl">
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
        <div className="bg-slate-700/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-600/50 hover:border-cyan-400/50 transition-all duration-300 shadow-lg hover:shadow-xl">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
              <FaEye className="text-white text-xl" />
            </div>
            <div className="flex-1">
              <h3 className="text-white text-xl font-bold mb-3">Vision</h3>
              <div>
                <p className="text-gray-300 text-sm mb-2 font-medium">Brain Activity</p>
                <div className="w-full bg-gray-600/50 rounded-full h-3 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-green-500 to-green-400 h-3 rounded-full transition-all duration-1000 shadow-sm" 
                    style={{width: '75%'}}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Selected HyperColumn Section */}
      <div>
        <p className="text-gray-400 text-sm mb-4 uppercase tracking-wide font-semibold">Selected HyperColumn</p>
        
        {/* Shapes and Objects Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Shapes Card */}
          <div className="bg-slate-700/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-600/50 hover:border-orange-400/50 transition-all duration-300 shadow-lg hover:shadow-xl">
            <h3 className="text-white text-2xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">Shapes</h3>
            <div className="space-y-4">
              <div>
                <p className="text-gray-400 text-sm uppercase tracking-wide mb-2 font-semibold">Hypercolumn Name</p>
                <p className="text-white text-lg font-medium">Cubes, squares, rectangles</p>
              </div>
              <div className="pt-2 border-t border-slate-600/50">
                <p className="text-gray-400 text-sm uppercase tracking-wide font-semibold">Inhibitory Connections</p>
              </div>
            </div>
          </div>

          {/* Objects Card */}
          <div className="bg-slate-700/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-600/50 hover:border-purple-400/50 transition-all duration-300 shadow-lg hover:shadow-xl">
            <h3 className="text-white text-2xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">objects</h3>
            <div>
              <p className="text-gray-400 text-sm uppercase tracking-wide mb-2 font-semibold">Category</p>
            </div>
          </div>
        </div>

        {/* Obstacles Avoidance Card */}
        <div className="bg-slate-700/80 backdrop-blur-sm rounded-2xl p-6 mb-6 border border-slate-600/50 hover:border-red-400/50 transition-all duration-300 shadow-lg hover:shadow-xl">
          <h3 className="text-white text-2xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">obstacles avoidance</h3>
          <div>
            <p className="text-gray-400 text-sm uppercase tracking-wide font-semibold">Excitatory Connections</p>
          </div>
        </div>
      </div>

      {/* Statistics Section */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-slate-700/80 backdrop-blur-sm rounded-xl p-6 text-center border border-slate-600/50 hover:border-blue-400/50 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105">
          <h4 className="text-white text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">48324</h4>
          <p className="text-gray-400 text-xs uppercase tracking-wide font-semibold mt-2">Total Neurons</p>
        </div>
        
        <div className="bg-slate-700/80 backdrop-blur-sm rounded-xl p-6 text-center border border-slate-600/50 hover:border-green-400/50 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105">
          <h4 className="text-white text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">92.8%</h4>
          <p className="text-gray-400 text-xs uppercase tracking-wide font-semibold mt-2">Predictive Accuracy</p>
        </div>
        
        <div className="bg-slate-700/80 backdrop-blur-sm rounded-xl p-6 text-center border border-slate-600/50 hover:border-purple-400/50 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105">
          <h4 className="text-white text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">67</h4>
          <p className="text-gray-400 text-xs uppercase tracking-wide font-semibold mt-2">Memory Classes</p>
        </div>
        
        <div className="bg-slate-700/80 backdrop-blur-sm rounded-xl p-6 text-center border border-slate-600/50 hover:border-orange-400/50 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105">
          <h4 className="text-white text-3xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">04</h4>
          <p className="text-gray-400 text-xs uppercase tracking-wide font-semibold mt-2">New Unlabelled</p>
        </div>
      </div>

      {/* Neuromodulators Activity Chart */}
      <div className="bg-slate-700/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-600/50 hover:border-purple-400/50 transition-all duration-300 shadow-lg hover:shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-white text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">Neuromodulators Activity</h3>
          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
            <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-3 mb-6">
          <span className="px-4 py-2 bg-gray-600/80 text-gray-300 rounded-full text-sm font-medium border border-gray-500/50 hover:border-gray-400/50 transition-all duration-300">POP</span>
          <span className="px-4 py-2 bg-gray-600/80 text-gray-300 rounded-full text-sm font-medium border border-gray-500/50 hover:border-gray-400/50 transition-all duration-300">GLU</span>
          <span className="px-4 py-2 bg-blue-500/80 text-white rounded-full text-sm font-medium border border-blue-400/50 shadow-lg shadow-blue-500/20">SER</span>
          <span className="px-4 py-2 bg-green-500/80 text-white rounded-full text-sm font-medium border border-green-400/50 shadow-lg shadow-green-500/20">DOP</span>
          <span className="px-4 py-2 bg-gray-600/80 text-gray-300 rounded-full text-sm font-medium border border-gray-500/50 hover:border-gray-400/50 transition-all duration-300">TCN</span>
        </div>

        {/* Chart Area */}
        <div className="relative h-48 bg-slate-800/80 rounded-xl p-6 border border-slate-600/30">
          {/* Y-axis labels */}
          <div className="absolute left-2 top-0 h-full flex flex-col justify-between text-gray-400 text-sm font-medium">
            <span>100</span>
            <span>75</span>
            <span>50</span>
            <span>25</span>
            <span>0</span>
          </div>

          {/* Chart grid lines */}
          <div className="ml-10 h-full relative">
            {/* Horizontal grid lines */}
            {[0, 25, 50, 75, 100].map((value, index) => (
              <div
                key={value}
                className="absolute w-full border-t border-gray-600/40 border-dotted"
                style={{ top: `${100 - value}%` }}
              ></div>
            ))}

            {/* Enhanced Chart Lines */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 180">
              {/* Blue line (SER) with glow */}
              <defs>
                <filter id="glow-blue">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                  <feMerge> 
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
                <filter id="glow-green">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                  <feMerge> 
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              
              <path
                d="M 0 130 Q 50 110 100 90 T 200 80 T 300 75 T 400 80"
                fill="none"
                stroke="#3B82F6"
                strokeWidth="3"
                filter="url(#glow-blue)"
                opacity="0.9"
              />
              
              {/* Green line (DOP) with glow */}
              <path
                d="M 0 150 Q 50 140 100 130 T 200 110 T 300 90 T 400 85"
                fill="none"
                stroke="#10B981"
                strokeWidth="3"
                filter="url(#glow-green)"
                opacity="0.9"
              />
              
              {/* Gray lines */}
              <path
                d="M 0 110 Q 50 120 100 115 T 200 105 T 300 110 T 400 115"
                fill="none"
                stroke="#6B7280"
                strokeWidth="2"
                opacity="0.7"
              />
              
              <path
                d="M 0 100 Q 50 105 100 110 T 200 120 T 300 125 T 400 130"
                fill="none"
                stroke="#9CA3AF"
                strokeWidth="2"
                opacity="0.6"
              />
            </svg>
          </div>

          {/* X-axis labels */}
          <div className="absolute bottom-2 left-10 right-0 flex justify-between text-gray-400 text-sm font-medium">
            <span>12:00</span>
            <span>12:05</span>
            <span>12:10</span>
            <span>12:15</span>
            <span>12:20</span>
            <span>12:25</span>
            <span>12:30</span>
            <span>12:35</span>
            <span>12:40</span>
            <span>12:45</span>
            <span>12</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
