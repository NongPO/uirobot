import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import RobotPanel from './components/RobotPanel';
import Header from './components/Header';

export default function Home() {
  return (
    <div className="h-screen bg-gray-900 flex flex-col">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Navbar />
        {/* Main Content Area */}
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
    </div>
  );
}
