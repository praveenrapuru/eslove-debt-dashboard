import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { FixedSizeList } from "react-window";
import { useAuth } from "../context/AuthContext";
import CaseModal from "./CaseModal";
import { caseService, activityLogService } from "../services";

export default function Cases() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [cases, setCases] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [sortBy, setSortBy] = useState("date");
  const [selectedCase, setSelectedCase] = useState(null);

  useEffect(() => {
    loadCases();
  }, []);

  const loadCases = async () => {
    try {
      const casesData = await caseService.getCases();
      console.log('Loaded cases:', casesData.length);
      setCases(casesData);
    } catch (error) {
      console.error('Failed to load cases:', error);
      // TODO: show error message to user
    }
  };

  const filteredCases = useMemo(() => {
    return cases
      .filter(
        (c) =>
          (statusFilter === "ALL" || c.status === statusFilter) &&
          (c.customer.toLowerCase().includes(search.toLowerCase()) ||
            c.id.includes(search))
      )
      .sort((a, b) => {
        if (sortBy === "amount") return b.amount - a.amount;
        if (sortBy === "customer") return a.customer.localeCompare(b.customer);
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
  }, [cases, search, statusFilter, sortBy]);

  // TODO: add pagination when we have real API
  const updateCase = async (updated, actionDetails) => {
    try {
      await caseService.updateCase(updated.id, updated);

      if (actionDetails) {
        activityLogService.addLog(
          user.name,
          user.role,
          actionDetails.action,
          "case",
          actionDetails.details
        );
      }

      loadCases();
    } catch (error) {
      console.error('Failed to update case:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-gradient-to-r from-cyan-600 to-blue-700 shadow-lg">
        <div className="px-6" style={{paddingTop: '16px', paddingBottom: '16px'}}>
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold" style={{color: 'white'}}>Case Management</h1>
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate("/agent-dashboard")}
                className="bg-white/20 text-white px-4 py-2 rounded-md hover:bg-white/30 transition"
              >
                ← Back to Dashboard
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
      <div className="flex gap-3 mb-4">
        <input
          className="border rounded px-3 py-2"
          placeholder="Search by Customer or Loan ID"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="border rounded px-3 py-2"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          {["ALL", "ASSIGNED", "FOLLOW_UP", "RESOLVED", "CLOSED"].map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
        <select
          className="border rounded px-3 py-2"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="date">Date</option>
          <option value="amount">Amount</option>
          <option value="customer">Customer</option>
        </select>
      </div>

      {/* Case List with Virtualization */}
      <div className="bg-white shadow rounded-lg">
        <div className="bg-gray-100 text-left grid grid-cols-5 gap-4 p-3 font-semibold border-b">
          <div>Loan ID</div>
          <div>Customer</div>
          <div>Amount</div>
          <div>Status</div>
          <div>Agent</div>
        </div>

        {filteredCases.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p className="text-lg mb-2">No cases found</p>
            <p className="text-sm">Adjust your filters to see more results</p>
          </div>
        ) : (
          <FixedSizeList
            height={500}
            itemCount={filteredCases.length}
            itemSize={60}
            width="100%"
            itemData={filteredCases}
          >
            {({ index, style }) => {
              const c = filteredCases[index];
              return (
                <div
                  style={style}
                  className="grid grid-cols-5 gap-4 p-3 border-b hover:bg-gray-50 cursor-pointer items-center"
                  onClick={() => setSelectedCase(c)}
                >
                  <div>{c.id}</div>
                  <div>{c.customer}</div>
                  <div>₹{c.amount.toLocaleString()}</div>
                  <div>
                    <span
                      className={`px-2 py-1 rounded text-sm ${
                        c.status === "CLOSED"
                          ? "bg-green-100 text-green-600"
                          : c.status === "RESOLVED"
                          ? "bg-blue-100 text-blue-600"
                          : "bg-yellow-100 text-yellow-600"
                      }`}
                    >
                      {c.status}
                    </span>
                  </div>
                  <div>{c.agentName}</div>
                </div>
              );
            }}
          </FixedSizeList>
        )}

        <div className="p-3 bg-gray-50 text-sm text-gray-600 text-center">
          Showing {filteredCases.length} {filteredCases.length === 1 ? 'case' : 'cases'}
        </div>
      </div>

      {selectedCase && (
        <CaseModal
          data={selectedCase}
          onClose={() => setSelectedCase(null)}
          onUpdate={updateCase}
        />
      )}
      </div>
    </div>
  );
}
