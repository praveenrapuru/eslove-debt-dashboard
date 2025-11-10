import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import mockDataService from "../services/mockData";

export default function AgentDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [stats, setStats] = useState({
    totalCases: 0,
    resolvedCases: 0,
    pendingCases: 0,
    followUpCases: 0,
  });
  const [recentCases, setRecentCases] = useState([]);

  useEffect(() => {
    loadAgentData();
  }, []);

  const loadAgentData = async () => {
    const allCases = await mockDataService.getCases();
    console.log("Agent name:", user.name);
    console.log("All cases:", allCases.length);

    // TODO: filter by agent ID instead of name
    const myCases = allCases.filter(c => c.agentName === user.name);

    console.log("My cases:", myCases.length);
    console.log("Cases:", myCases);

    const totalCases = myCases.length;
    const resolvedCases = myCases.filter(c => c.status === "RESOLVED").length;
    const closedCases = myCases.filter(c => c.status === "CLOSED").length;
    const pendingCases = myCases.filter(c => c.status === "ASSIGNED").length;
    const followUpCases = myCases.filter(c => c.status === "FOLLOW_UP").length;

    setStats({
      totalCases,
      resolvedCases: resolvedCases + closedCases,
      pendingCases,
      followUpCases
    });

    setRecentCases(myCases.slice(0, 10));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav style={{background: 'linear-gradient(to right, #6366f1, #9333ea)'}} className="shadow-lg">
        <div className="px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-white">My Dashboard</h1>
              <p className="text-white text-sm mt-1" style={{opacity: 0.8}}>Welcome back, {user.name}</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate("/cases")}
                className="bg-white/20 text-white px-4 py-2 rounded-md hover:bg-white/30 transition"
              >
                View All Cases
              </button>
              <button
                onClick={() => navigate("/activity-log")}
                className="bg-white/20 text-white px-4 py-2 rounded-md hover:bg-white/30 transition"
              >
                Activity Log
              </button>
              <span className="text-white font-medium">
                {user.name} ({user.role})
              </span>
              <button
                onClick={logout}
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="p-6">

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <KpiCard label="Total Cases" value={stats.totalCases} color="blue" />
        <KpiCard label="Resolved Cases" value={stats.resolvedCases} color="green" />
        <KpiCard label="Pending Cases" value={stats.pendingCases} color="yellow" />
        <KpiCard label="Follow-up Cases" value={stats.followUpCases} color="orange" />
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold">My Recent Cases</h2>
        </div>
        <div className="p-4">
          {recentCases.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p className="text-lg mb-2">No cases assigned yet</p>
              <p className="text-sm">Your assigned cases will appear here</p>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="text-left border-b">
                  <th className="pb-3 font-semibold">Loan ID</th>
                  <th className="pb-3 font-semibold">Customer</th>
                  <th className="pb-3 font-semibold">Amount</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 font-semibold">Created</th>
                  <th className="pb-3 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {recentCases.map((caseItem) => (
                  <tr key={caseItem.id} className="border-b hover:bg-gray-50">
                    <td className="py-3">{caseItem.id}</td>
                    <td>{caseItem.customer}</td>
                    <td>₹{caseItem.amount.toLocaleString()}</td>
                    <td>
                      <span
                        className={`px-2 py-1 rounded text-sm ${
                          caseItem.status === "CLOSED"
                            ? "bg-green-100 text-green-600"
                            : caseItem.status === "RESOLVED"
                            ? "bg-blue-100 text-blue-600"
                            : caseItem.status === "FOLLOW_UP"
                            ? "bg-orange-100 text-orange-600"
                            : "bg-yellow-100 text-yellow-600"
                        }`}
                      >
                        {caseItem.status}
                      </span>
                    </td>
                    <td className="text-gray-600">
                      {new Date(caseItem.createdAt).toLocaleDateString()}
                    </td>
                    <td>
                      <button
                        onClick={() => navigate("/cases")}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {recentCases.length > 0 && (
            <div className="mt-4 text-center">
              <button
                onClick={() => navigate("/cases")}
                className="text-blue-600 hover:underline"
              >
                View All Cases →
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Performance Overview</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Resolution Rate</span>
              <span className="font-semibold">
                {stats.totalCases > 0
                  ? Math.round((stats.resolvedCases / stats.totalCases) * 100)
                  : 0}
                %
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-600 h-2 rounded-full"
                style={{
                  width: `${
                    stats.totalCases > 0
                      ? (stats.resolvedCases / stats.totalCases) * 100
                      : 0
                  }%`,
                }}
              ></div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="space-y-2">
            <button
              onClick={() => navigate("/cases")}
              className="w-full text-left px-4 py-2 bg-blue-50 hover:bg-blue-100 rounded text-blue-700 font-medium"
            >
              Manage Cases
            </button>
            <button
              onClick={() => navigate("/activity-log")}
              className="w-full text-left px-4 py-2 bg-purple-50 hover:bg-purple-100 rounded text-purple-700 font-medium"
            >
              View Activity Log
            </button>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}

function KpiCard({ label, value, color }) {
  const colorClasses = {
    blue: "bg-blue-50 border-blue-200 text-blue-800",
    green: "bg-green-50 border-green-200 text-green-800",
    yellow: "bg-yellow-50 border-yellow-200 text-yellow-800",
    orange: "bg-orange-50 border-orange-200 text-orange-800",
  };

  return (
    <div className={`${colorClasses[color]} border-2 p-5 rounded-xl text-center`}>
      <h3 className="text-sm font-medium mb-2 opacity-75">{label}</h3>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  );
}
