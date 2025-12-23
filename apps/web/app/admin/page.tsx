'use client';

import React, { useState } from 'react';

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  const stats = [
    { title: 'Total Users', value: '1,234', change: '+12%', icon: '👥' },
    { title: 'Searches', value: '45,678', change: '+8%', icon: '🔍' },
    { title: 'Translations', value: '12,345', change: '+15%', icon: '🌐' }
  ];

  const quickActions = [
    { title: 'User Management', description: 'Manage user accounts', icon: '👤' },
    { title: 'Content Moderation', description: 'Review flagged content', icon: '🛡️' },
    { title: 'Analytics', description: 'View detailed reports', icon: '📊' },
    { title: 'Settings', description: 'System configuration', icon: '⚙️' },
    { title: 'Backup', description: 'Database backup', icon: '💾' },
    { title: 'Support', description: 'User support tickets', icon: '🎧' }
  ];

  const recentActivity = [
    { user: 'john.doe@email.com', action: 'User Registration', time: '2 minutes ago', status: 'success' },
    { user: 'admin@system.com', action: 'Database Backup', time: '15 minutes ago', status: 'success' },
    { user: 'jane.smith@email.com', action: 'Translation Request', time: '32 minutes ago', status: 'pending' },
    { user: 'mike.wilson@email.com', action: 'Search Query', time: '1 hour ago', status: 'success' },
    { user: 'system@auto.com', action: 'System Update', time: '2 hours ago', status: 'warning' }
  ];

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0D0D0F] text-[#F5F4F2] flex items-center justify-center">
        <div className="bg-[#1A1A1D] p-8 rounded-xl shadow-2xl border border-gray-800">
          <h1 className="text-2xl font-bold mb-6 text-center">Admin Login</h1>
          <button
            onClick={() => setIsAuthenticated(true)}
            className="w-full bg-[#C9A227] text-[#0D0D0F] py-3 px-6 rounded-lg font-semibold hover:bg-[#B8911F] transition-all duration-300"
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0D0D0F] text-[#F5F4F2]">
      {/* Header */}
      <div className="bg-[#1A1A1D] border-b border-gray-800 px-6 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-[#C9A227]">Admin Dashboard</h1>
            <p className="text-gray-400 mt-1">Welcome back, Administrator</p>
          </div>
          <button
            onClick={() => setIsAuthenticated(false)}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-all duration-300"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="p-6 max-w-7xl mx-auto">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-[#1A1A1D] border border-gray-800 rounded-xl p-6 hover:border-[#C9A227] transition-all duration-300 hover:shadow-lg hover:shadow-[#C9A227]/10 group cursor-pointer"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="text-3xl group-hover:scale-110 transition-transform duration-300">
                  {stat.icon}
                </div>
                <span className="text-green-400 text-sm font-semibold bg-green-400/10 px-2 py-1 rounded-full">
                  {stat.change}
                </span>
              </div>
              <h3 className="text-gray-400 text-sm font-medium mb-2">{stat.title}</h3>
              <p className="text-3xl font-bold text-[#F5F4F2] group-hover:text-[#C9A227] transition-colors duration-300">
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6 text-[#C9A227]">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {quickActions.map((action, index) => (
              <div
                key={index}
                className="bg-[#1A1A1D] border border-gray-800 rounded-lg p-4 hover:border-[#C9A227] transition-all duration-300 cursor-pointer hover:shadow-lg hover:shadow-[#C9A227]/10 group"
              >
                <div className="flex items-start space-x-3">
                  <div className="text-2xl group-hover:scale-110 transition-transform duration-300">
                    {action.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#F5F4F2] group-hover:text-[#C9A227] transition-colors duration-300">
                      {action.title}
                    </h3>
                    <p className="text-gray-400 text-sm mt-1">{action.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <h2 className="text-2xl font-bold mb-6 text-[#C9A227]">Recent Activity</h2>
          <div className="bg-[#1A1A1D] border border-gray-800 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#0D0D0F] border-b border-gray-800">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#C9A227]">User</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#C9A227]">Action</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#C9A227]">Time</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#C9A227]">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {recentActivity.map((activity, index) => (
                    <tr key={index} className="hover:bg-[#0D0D0F] transition-colors duration-200">
                      <td className="px-6 py-4 text-sm text-[#F5F4F2]">{activity.user}</td>
                      <td className="px-6 py-4 text-sm text-[#F5F4F2]">{activity.action}</td>
                      <td className="px-6 py-4 text-sm text-gray-400">{activity.time}</td>
                      <td className="px-6 py-4 text-sm">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            activity.status === 'success'
                              ? 'bg-green-400/10 text-green-400'
                              : activity.status === 'pending'
                              ? 'bg-yellow-400/10 text-yellow-400'
                              : 'bg-orange-400/10 text-orange-400'
                          }`}
                        >
                          {activity.status.charAt(0).toUpperCase() + activity.status.slice(1)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}