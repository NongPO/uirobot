import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';

export default function Home() {
  return (
    <div className="flex h-screen bg-gray-900">
      <Navbar />
      {/* Main Content Area with Two-Tone Background */}
      <div className="flex-1 flex">
        {/* Left Section - Dashboard */}
        <div className="w-1/2 bg-gray-800 overflow-auto">
          <Dashboard />
        </div>
        
        {/* Right Section - Lighter Gray */}
        <div className="w-1/2 bg-gray-700 p-8 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Right Panel</h2>
            <p className="text-gray-300">Content area 2</p>
          </div>
        </div>
      </div>
    </div>
  );
}
