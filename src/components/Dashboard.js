import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalCases: 0,
    resolvedCases: 0,
    pendingAmount: 0,
    efficiency: 0,
  });
  const [statusData, setStatusData] = useState([]);

  const fetchMockData = () => {
    const total = Math.floor(Math.random() * 200 + 100);
    const resolved = Math.floor(total * 0.6);
    // console.log('Dashboard stats updated');
    // const pending = total - resolved;

    setStats({
      totalCases: total,
      resolvedCases: resolved,
      pendingAmount: Math.floor(Math.random() * 500000 + 100000),
      efficiency: ((resolved / total) * 100).toFixed(1)
    });
    setStatusData([
      { name: 'Resolved', value: resolved },
      { name: "Pending", value: total - resolved },
    ]);
  };

  useEffect(() => {
    fetchMockData();
    const interval = setInterval(fetchMockData, 5000);
    return () => clearInterval(interval);
  }, []);

  const COLORS = ["#16a34a", "#f59e0b"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <nav className="bg-gradient-to-r from-blue-600 to-indigo-700 shadow-lg">
        <div className="px-6 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-white">Dashboard Overview</h1>
            <div className="flex items-center" style={{gap: '12px'}}>
              <button
                onClick={() => navigate("/agents")}
                className="bg-white/20 text-white px-4 py-2 rounded-md hover:bg-white/30"
              >
                Manage Agents
              </button>
              <button
                onClick={() => navigate("/activity-log")}
                className="bg-white/20 text-white px-4 py-2 rounded-md hover:bg-white/30"
              >
                Activity Log
              </button>
              <span className="text-white font-medium">
                {user.name} ({user.role})
              </span>
              <button
                onClick={logout}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="p-6">

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <KpiCard label="Total Cases" value={stats.totalCases} />
        <KpiCard label="Resolved Cases" value={stats.resolvedCases} />
        <KpiCard
          label="Pending Amount"
          value={`₹${stats.pendingAmount.toLocaleString()}`}
        />
        <KpiCard label="Agent Efficiency" value={`${stats.efficiency}%`} />
      </div>

      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">
          Case Status Distribution
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={statusData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={120}
              label
            >
              {statusData.map((_, index) => (
                <Cell
                  key={index}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
      </div>
    </div>
  );
}

const KpiCard = ({ label, value }) => {
  return (
    <div className="bg-white p-5 rounded-xl shadow-md text-center">
      <h3 className="text-sm text-gray-500 font-medium mb-2">{label}</h3>
      <p className="text-2xl font-semibold text-gray-800">{value}</p>
    </div>
  );
}
