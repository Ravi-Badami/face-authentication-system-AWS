// src/pages/AdminDashboard.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/logs');
      const logsData = res.data.sort((a, b) => a.timestamp - b.timestamp);

      const userAttempts = {};
      const processedLogs = logsData.map((log) => {
        userAttempts[log.username] = (userAttempts[log.username] || 0) + 1;
        return { ...log, attempt: userAttempts[log.username] };
      });

      setLogs(processedLogs);
    } catch (err) {
      console.error('Failed to fetch logs:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-10">
        Admin Dashboard
      </h1>

      <div className="max-w-6xl mx-auto bg-white shadow-xl rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-700">
            User Login Logs
          </h2>
        </div>

        {logs.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No logs found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-gray-700">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left font-medium">Username</th>
                  <th className="px-6 py-3 text-left font-medium">Timestamp</th>
                  <th className="px-6 py-3 text-left font-medium">IP Address</th>
                  <th className="px-6 py-3 text-left font-medium">Attempt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {logs.map((log, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">{log.username}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(log.timestamp * 1000).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{log.ip}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">{log.attempt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
