'use client';

import React from 'react';
import { FaRobot, FaEye } from 'react-icons/fa';

const Dashboard = () => {
  return (
    <div className="w-full bg-gray-800 p-6 space-y-6">
      {/* Top Section - RoboDoc and Vision Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* RoboDoc Card */}
        <div className="bg-gray-700 rounded-xl p-6">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center flex-shrink-0">
              <FaRobot className="text-white text-xl" />
            </div>
            <div className="flex-1">
              <h3 className="text-white text-xl font-bold mb-1">RoboDoc</h3>
              <p className="text-blue-400 text-sm mb-1">Floor 3rd, Physiotherapy department</p>
              <p className="text-gray-400 text-xs">ID 12345</p>
            </div>
          </div>
        </div>

        {/* Vision Card */}
        <div className="bg-gray-700 rounded-xl p-6">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-cyan-500 rounded-xl flex items-center justify-center flex-shrink-0">
              <FaEye className="text-white text-xl" />
            </div>
            <div className="flex-1">
              <h3 className="text-white text-xl font-bold mb-3">Vision</h3>
              <div>
                <p className="text-gray-300 text-sm mb-2">Brain Activity</p>
                <div className="w-full bg-gray-600 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{width: '75%'}}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Selected HyperColumn Section */}
      <div>
        <p className="text-gray-400 text-sm mb-4 uppercase tracking-wide">Selected HyperColumn</p>
        
        {/* Shapes and Objects Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Shapes Card */}
          <div className="bg-gray-700 rounded-xl p-6">
            <h3 className="text-white text-2xl font-bold mb-4">Shapes</h3>
            <div className="space-y-3">
              <div>
                <p className="text-gray-400 text-sm uppercase tracking-wide mb-1">Hypercolumn Name</p>
                <p className="text-white">Cubes, squares, rectangles</p>
              </div>
              <div className="pt-2">
                <p className="text-gray-400 text-sm uppercase tracking-wide">Inhibitory Connections</p>
              </div>
            </div>
          </div>

          {/* Objects Card */}
          <div className="bg-gray-700 rounded-xl p-6">
            <h3 className="text-white text-2xl font-bold mb-4">objects</h3>
            <div>
              <p className="text-gray-400 text-sm uppercase tracking-wide mb-1">Category</p>
            </div>
          </div>
        </div>

        {/* Obstacles Avoidance Card */}
        <div className="bg-gray-700 rounded-xl p-6 mb-6">
          <h3 className="text-white text-2xl font-bold mb-4">obstacles avoidance</h3>
          <div>
            <p className="text-gray-400 text-sm uppercase tracking-wide">Excitatory Connections</p>
          </div>
        </div>
      </div>

      {/* Statistics Section */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-700 rounded-xl p-4 text-center">
          <h4 className="text-white text-2xl font-bold">48324</h4>
          <p className="text-gray-400 text-xs uppercase tracking-wide">Total Neurons</p>
        </div>
        
        <div className="bg-gray-700 rounded-xl p-4 text-center">
          <h4 className="text-white text-2xl font-bold">92.8%</h4>
          <p className="text-gray-400 text-xs uppercase tracking-wide">Predictive Accuracy</p>
        </div>
        
        <div className="bg-gray-700 rounded-xl p-4 text-center">
          <h4 className="text-white text-2xl font-bold">67</h4>
          <p className="text-gray-400 text-xs uppercase tracking-wide">Memory Classes</p>
        </div>
        
        <div className="bg-gray-700 rounded-xl p-4 text-center">
          <h4 className="text-white text-2xl font-bold">04</h4>
          <p className="text-gray-400 text-xs uppercase tracking-wide">New Unlabelled</p>
        </div>
      </div>

      {/* Neuromodulators Activity Chart */}
      <div className="bg-gray-700 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-white text-xl font-bold">Neuromodulators Activity</h3>
          <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xs">●</span>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 mb-6">
          <span className="px-3 py-1 bg-gray-600 text-gray-300 rounded-full text-sm">POP</span>
          <span className="px-3 py-1 bg-gray-600 text-gray-300 rounded-full text-sm">GLU</span>
          <span className="px-3 py-1 bg-blue-500 text-white rounded-full text-sm">SER</span>
          <span className="px-3 py-1 bg-green-500 text-white rounded-full text-sm">DOP</span>
          <span className="px-3 py-1 bg-gray-600 text-gray-300 rounded-full text-sm">TCN</span>
        </div>

        {/* Chart Area */}
        <div className="relative h-40 bg-gray-800 rounded-lg p-4">
          {/* Y-axis labels */}
          <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-gray-400 text-xs">
            <span>100</span>
            <span>75</span>
            <span>50</span>
            <span>25</span>
            <span>0</span>
          </div>

          {/* Chart grid lines */}
          <div className="ml-8 h-full relative">
            {/* Horizontal grid lines */}
            {[0, 25, 50, 75, 100].map((value, index) => (
              <div
                key={value}
                className="absolute w-full border-t border-gray-600 border-dotted"
                style={{ top: `${100 - value}%` }}
              ></div>
            ))}

            {/* Simulated Chart Lines */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 160">
              {/* Blue line (SER) */}
              <path
                d="M 0 120 Q 50 100 100 80 T 200 70 T 300 65 T 400 70"
                fill="none"
                stroke="#3B82F6"
                strokeWidth="2"
                opacity="0.8"
              />
              
              {/* Green line (DOP) */}
              <path
                d="M 0 140 Q 50 130 100 120 T 200 100 T 300 80 T 400 75"
                fill="none"
                stroke="#10B981"
                strokeWidth="2"
                opacity="0.8"
              />
              
              {/* Gray line (GLU) */}
              <path
                d="M 0 100 Q 50 110 100 105 T 200 95 T 300 100 T 400 105"
                fill="none"
                stroke="#6B7280"
                strokeWidth="2"
                opacity="0.6"
              />
              
              {/* Light gray line (POP) */}
              <path
                d="M 0 90 Q 50 95 100 100 T 200 110 T 300 115 T 400 120"
                fill="none"
                stroke="#9CA3AF"
                strokeWidth="2"
                opacity="0.5"
              />
            </svg>
          </div>

          {/* X-axis labels */}
          <div className="absolute bottom-0 left-8 right-0 flex justify-between text-gray-400 text-xs">
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
