import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import RobotPanel from './components/RobotPanel';

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
        
        {/* Right Section - Robot Panel */}
        <div className="w-1/2 bg-gray-700 overflow-auto">
          <RobotPanel />
        </div>
      </div>
    </div>
  );
}
