'use client';

import { useState, useEffect } from 'react';
import { 
  FaBell, 
  FaExclamationTriangle, 
  FaInfoCircle, 
  FaCheckCircle,
  FaTimes,
  FaEye,
  FaEyeSlash,
  FaTrash,
  FaCog,
  FaFilter,
  FaSort,
  FaSearch,
  FaPlus
} from 'react-icons/fa';

export default function AlertSystem() {
  const [alerts, setAlerts] = useState([]);
  const [filteredAlerts, setFilteredAlerts] = useState([]);
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('time');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [alertSettings, setAlertSettings] = useState({
    soundEnabled: true,
    popupEnabled: true,
    emailEnabled: false,
    smsEnabled: false
  });

  // Mock alert data
  const mockAlerts = [
    {
      id: 1,
      type: 'critical',
      title: 'Battery Level Critical',
      message: 'Robot battery level has dropped to 5%. Immediate charging required.',
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      isRead: false,
      source: 'Power Management',
      actions: ['Charge Now', 'Emergency Stop']
    },
    {
      id: 2,
      type: 'warning',
      title: 'High Temperature Detected',
      message: 'Motor temperature has exceeded normal operating range (85°C).',
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      isRead: false,
      source: 'Thermal Monitoring',
      actions: ['Reduce Speed', 'Cool Down']
    },
    {
      id: 3,
      type: 'info',
      title: 'Mission Completed',
      message: 'Patrol mission #47 has been completed successfully.',
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      isRead: true,
      source: 'Mission Control',
      actions: ['View Report']
    },
    {
      id: 4,
      type: 'warning',
      title: 'Sensor Calibration Required',
      message: 'LiDAR sensor drift detected. Calibration recommended.',
      timestamp: new Date(Date.now() - 45 * 60 * 1000),
      isRead: true,
      source: 'Sensor Management',
      actions: ['Calibrate Now', 'Schedule Later']
    },
    {
      id: 5,
      type: 'critical',
      title: 'Communication Lost',
      message: 'Lost connection to base station. Attempting to reconnect...',
      timestamp: new Date(Date.now() - 60 * 60 * 1000),
      isRead: false,
      source: 'Network',
      actions: ['Retry Connection', 'Emergency Protocol']
    },
    {
      id: 6,
      type: 'info',
      title: 'Software Update Available',
      message: 'Version 2.4.1 is available with performance improvements.',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      isRead: true,
      source: 'System Update',
      actions: ['Update Now', 'Schedule Update']
    }
  ];

  useEffect(() => {
    setAlerts(mockAlerts);
  }, []);

  useEffect(() => {
    let filtered = alerts;

    // Filter by type
    if (filterType !== 'all') {
      filtered = filtered.filter(alert => alert.type === filterType);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(alert =>
        alert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        alert.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
        alert.source.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort alerts
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'time':
          return new Date(b.timestamp) - new Date(a.timestamp);
        case 'priority':
          const priorityOrder = { critical: 3, warning: 2, info: 1 };
          return priorityOrder[b.type] - priorityOrder[a.type];
        case 'source':
          return a.source.localeCompare(b.source);
        default:
          return 0;
      }
    });

    setFilteredAlerts(filtered);
  }, [alerts, filterType, searchQuery, sortBy]);

  const getAlertIcon = (type) => {
    switch (type) {
      case 'critical':
        return <FaExclamationTriangle className="text-red-400" />;
      case 'warning':
        return <FaExclamationTriangle className="text-yellow-400" />;
      case 'info':
        return <FaInfoCircle className="text-blue-400" />;
      default:
        return <FaBell className="text-gray-400" />;
    }
  };

  const getAlertColor = (type) => {
    switch (type) {
      case 'critical':
        return 'border-red-500 bg-red-900/20';
      case 'warning':
        return 'border-yellow-500 bg-yellow-900/20';
      case 'info':
        return 'border-blue-500 bg-blue-900/20';
      default:
        return 'border-gray-500 bg-gray-900/20';
    }
  };

  const markAsRead = (alertId) => {
    setAlerts(prev => prev.map(alert =>
      alert.id === alertId ? { ...alert, isRead: true } : alert
    ));
  };

  const markAllAsRead = () => {
    setAlerts(prev => prev.map(alert => ({ ...alert, isRead: true })));
  };

  const deleteAlert = (alertId) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
  };

  const clearAllAlerts = () => {
    setAlerts([]);
  };

  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const getUnreadCount = () => alerts.filter(alert => !alert.isRead).length;

  return (
    <div className="h-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 overflow-auto">
      <div className="w-full max-w-none mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2 flex items-center">
              <FaBell className="mr-3 text-red-400" />
              Alert System
              {getUnreadCount() > 0 && (
                <span className="ml-3 bg-red-500 text-white text-sm px-2 py-1 rounded-full">
                  {getUnreadCount()} new
                </span>
              )}
            </h1>
            <p className="text-gray-400">Real-time system alerts and notifications</p>
          </div>

          <div className="flex items-center space-x-3 mt-4 sm:mt-0">
            {/* Settings Button */}
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="flex items-center px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-all duration-200"
            >
              <FaCog className="mr-2" />
              Settings
            </button>

            {/* Mark All Read */}
            <button
              onClick={markAllAsRead}
              className="flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all duration-200"
            >
              <FaCheckCircle className="mr-2" />
              Mark All Read
            </button>

            {/* Clear All */}
            <button
              onClick={clearAllAlerts}
              className="flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all duration-200"
            >
              <FaTrash className="mr-2" />
              Clear All
            </button>
          </div>
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 mb-6">
            <h3 className="text-xl font-semibold text-white mb-4">Alert Settings</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={alertSettings.soundEnabled}
                  onChange={(e) => setAlertSettings(prev => ({ ...prev, soundEnabled: e.target.checked }))}
                  className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                />
                <label className="text-gray-300">Sound Alerts</label>
              </div>
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={alertSettings.popupEnabled}
                  onChange={(e) => setAlertSettings(prev => ({ ...prev, popupEnabled: e.target.checked }))}
                  className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                />
                <label className="text-gray-300">Popup Notifications</label>
              </div>
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={alertSettings.emailEnabled}
                  onChange={(e) => setAlertSettings(prev => ({ ...prev, emailEnabled: e.target.checked }))}
                  className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                />
                <label className="text-gray-300">Email Alerts</label>
              </div>
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={alertSettings.smsEnabled}
                  onChange={(e) => setAlertSettings(prev => ({ ...prev, smsEnabled: e.target.checked }))}
                  className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                />
                <label className="text-gray-300">SMS Alerts</label>
              </div>
            </div>
          </div>
        )}

        {/* Filters and Search */}
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search alerts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-blue-400 focus:outline-none"
              />
            </div>

            {/* Filter by Type */}
            <div className="flex items-center space-x-2">
              <FaFilter className="text-gray-400" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="bg-slate-700 text-white px-3 py-2 rounded-lg border border-slate-600 focus:border-blue-400 focus:outline-none"
              >
                <option value="all">All Types</option>
                <option value="critical">Critical</option>
                <option value="warning">Warning</option>
                <option value="info">Information</option>
              </select>
            </div>

            {/* Sort */}
            <div className="flex items-center space-x-2">
              <FaSort className="text-gray-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-slate-700 text-white px-3 py-2 rounded-lg border border-slate-600 focus:border-blue-400 focus:outline-none"
              >
                <option value="time">Sort by Time</option>
                <option value="priority">Sort by Priority</option>
                <option value="source">Sort by Source</option>
              </select>
            </div>
          </div>
        </div>

        {/* Alert Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Critical Alerts</p>
                <p className="text-2xl font-bold text-red-400">
                  {alerts.filter(a => a.type === 'critical').length}
                </p>
              </div>
              <FaExclamationTriangle className="text-3xl text-red-400" />
            </div>
          </div>

          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Warning Alerts</p>
                <p className="text-2xl font-bold text-yellow-400">
                  {alerts.filter(a => a.type === 'warning').length}
                </p>
              </div>
              <FaExclamationTriangle className="text-3xl text-yellow-400" />
            </div>
          </div>

          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Unread Alerts</p>
                <p className="text-2xl font-bold text-blue-400">
                  {getUnreadCount()}
                </p>
              </div>
              <FaBell className="text-3xl text-blue-400" />
            </div>
          </div>
        </div>

        {/* Alert List */}
        <div className="space-y-4">
          {filteredAlerts.length === 0 ? (
            <div className="bg-slate-800 rounded-xl p-8 border border-slate-700 text-center">
              <FaCheckCircle className="text-4xl text-green-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No Alerts Found</h3>
              <p className="text-gray-400">
                {searchQuery || filterType !== 'all'
                  ? 'No alerts match your current filters.'
                  : 'All systems are running normally.'}
              </p>
            </div>
          ) : (
            filteredAlerts.map((alert) => (
              <div
                key={alert.id}
                className={`bg-slate-800 rounded-xl p-6 border-l-4 ${getAlertColor(alert.type)} ${
                  !alert.isRead ? 'border-r-4 border-r-blue-500' : ''
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="mt-1">
                      {getAlertIcon(alert.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-white">{alert.title}</h3>
                        {!alert.isRead && (
                          <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                            NEW
                          </span>
                        )}
                      </div>
                      <p className="text-gray-300 mb-3">{alert.message}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-400">
                        <span>{alert.source}</span>
                        <span>•</span>
                        <span>{formatTimestamp(alert.timestamp)}</span>
                      </div>
                      {alert.actions && alert.actions.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-4">
                          {alert.actions.map((action, index) => (
                            <button
                              key={index}
                              className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-all duration-200"
                            >
                              {action}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    {!alert.isRead && (
                      <button
                        onClick={() => markAsRead(alert.id)}
                        className="p-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all duration-200"
                        title="Mark as read"
                      >
                        <FaEye />
                      </button>
                    )}
                    <button
                      onClick={() => deleteAlert(alert.id)}
                      className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all duration-200"
                      title="Delete alert"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
