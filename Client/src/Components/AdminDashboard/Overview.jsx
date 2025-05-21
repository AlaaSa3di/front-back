import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import api from '../../api/axiosConfig';
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const StatsCard = ({ title, value, icon, color }) => {
  const colorClasses = {
    blue: 'border-blue-500 bg-blue-100 text-blue-500',
    green: 'border-green-500 bg-green-100 text-green-500',
    purple: 'border-purple-500 bg-purple-100 text-purple-500',
    yellow: 'border-yellow-500 bg-yellow-100 text-yellow-500',
    red: 'border-red-500 bg-red-100 text-red-500'
  };

  return (
    <div className={`bg-white p-6 rounded-lg shadow-md border-l-4 ${colorClasses[color]}`}>
      <div className="flex justify-between items-center">
        <div>
          <p className="text-gray-500 text-sm font-medium">{title}</p>
          <h3 className="text-2xl font-bold mt-1">{value}</h3>
        </div>
        <div className={`p-3 rounded-full ${colorClasses[color]}`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

const Overview = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get('/v1/stats/dashboard');
        setStats(data.data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  if (!stats) {
    return <div className="flex justify-center items-center h-64">Failed to load stats</div>;
  }

  const usersData = {
    labels: ['Admins', 'Users'],
    datasets: [
      {
        label: 'User Types',
        data: [stats.users.admins, stats.users.regularUsers],
        backgroundColor: ['#3B82F6', '#10B981'],
      },
    ],
  };

const screensData = {
  labels: Object.keys(stats.screens).map(key => 
    key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
  ), 
  datasets: [
    {
      data: Object.values(stats.screens),
      backgroundColor: ['#10B981', '#F59E0B', '#EF4444'],
    },
  ],
};

  const spacesData = {
    labels: ['Approved', 'Pending'],
    datasets: [
      {
        data: [stats.spaces.approved || 0, stats.spaces.pending || 0],
        backgroundColor: ['#10B981', '#F59E0B'],
      },
    ],
  };

  const messagesData = {
    labels: Object.keys(stats.messages).map(key => 
      key.charAt(0).toUpperCase() + key.slice(1)
    ),
    datasets: [
      {
        label: 'Messages',
        data: Object.values(stats.messages),
        backgroundColor: ['#3B82F6', '#10B981', '#F59E0B'],
      },
    ],
  };

  const spaceTypesData = {
    labels: stats.spaceTypes.map(type => 
      type.type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
    ),
    datasets: [
      {
        data: stats.spaceTypes.map(type => type.count),
        backgroundColor: [
          '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
          '#EC4899', '#14B8A6', '#F97316', '#64748B', '#A855F7'
        ],
      },
    ],
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard 
          title="Total Users" 
          value={stats.users.total} 
          icon={<i className="fas fa-users"></i>} 
          color="blue" 
        />
        <StatsCard 
          title="Total Screens" 
          value={Object.values(stats.screens).reduce((a, b) => a + b, 0)} 
          icon={<i className="fas fa-tv"></i>} 
          color="green" 
        />
        <StatsCard 
          title="Total Payments" 
          value={`${stats.payments.total.toLocaleString()} JOD`} 
          icon={<i className="fas fa-money-bill-wave"></i>} 
          color="purple" 
        />
        <StatsCard 
          title="Total Messages" 
          value={Object.values(stats.messages).reduce((a, b) => a + b, 0)} 
          icon={<i className="fas fa-envelope"></i>} 
          color="yellow" 
        />
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">Space Types Distribution</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="h-64">
            <Pie 
              data={spaceTypesData} 
              options={{ 
                responsive: true, 
                maintainAspectRatio: false,
                plugins: {
                  legend: { position: 'right' },
                  tooltip: {
                    callbacks: {
                      label: (context) => {
                        const label = context.label || '';
                        const value = context.raw || 0;
                        const percentage = stats.spaceTypes.find(
                          t => t.type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) === label
                        ).percentage;
                        return `${label}: ${value} (${percentage}%)`;
                      }
                    }
                  }
                }
              }} 
            />
          </div>
          <div>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Count
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Percentage
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {stats.spaceTypes.map((type, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 capitalize">
                      {type.type.replace(/_/g, ' ')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {type.count}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {type.percentage}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">User Types</h2>
          <div className="h-64">
            <Pie data={usersData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Screen Status</h2>
          <div className="h-64">
            <Pie data={screensData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Spaces Approval Status</h2>
          <div className="h-64">
            <Pie data={spacesData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Messages Status</h2>
          <div className="h-64">
            <Bar data={messagesData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;