import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { VariableSizeList } from "react-window";
import { useAuth } from "../context/AuthContext";
import activityLogService from "../services/activityLogService";

export default function ActivityLog() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [logs, setLogs] = useState([]);
  const [filter, setFilter] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedLogs, setExpandedLogs] = useState(new Set());
  const listRef = useRef(null);

  useEffect(() => {
    loadLogs();
    const interval = setInterval(loadLogs, 5000);
    return () => clearInterval(interval);
  }, []);

  const loadLogs = () => {
    const allLogs = activityLogService.getLogs();
    // console.log('Logs loaded:', allLogs.length);
    setLogs(allLogs);
  };

  const toggleLog = (id, index) => {
    const newExpanded = new Set(expandedLogs);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedLogs(newExpanded);
    if (listRef.current) {
      listRef.current.resetAfterIndex(index);
    }
  };

  const filteredLogs = logs.filter((log) => {
    const matchesFilter = filter === "ALL" || log.entity === filter.toLowerCase();
    const matchesSearch =
      searchTerm === "" ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.user.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getActionColor = (action) => {
    switch (action) {
      case "created":
        return "bg-green-100 text-green-700";
      case "updated":
        return "bg-blue-100 text-blue-700";
      case "deleted":
        return "bg-red-100 text-red-700";
      case "assigned":
        return "bg-purple-100 text-purple-700";
      case "unassigned":
        return "bg-orange-100 text-orange-700";
      case "login":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getActionIcon = (action) => {
    switch (action) {
      case "created":
        return "+";
      case "updated":
        return "↻";
      case "deleted":
        return "×";
      case "assigned":
        return "→";
      case "unassigned":
        return "←";
      default:
        return "•";
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;

    return date.toLocaleString();
  };

  const clearAllLogs = () => {
    if (window.confirm("Are you sure you want to clear all activity logs?")) {
      activityLogService.clearLogs();
      loadLogs();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="shadow-lg" style={{background: 'linear-gradient(90deg, #9333ea 0%, #ec4899 100%)'}}>
        <div style={{padding: '16px 24px'}}>
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-white">Activity Log</h1>
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate(user.role === "ADMIN" ? "/dashboard" : "/agent-dashboard")}
                className="bg-white/20 text-white px-4 py-2 rounded-md hover:bg-white/30"
              >
                ← Back to Dashboard
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

      <div className="bg-white p-4 rounded-lg shadow mb-5">
        <div className="flex gap-3 items-center">
          <input
            type="text"
            placeholder="Search by user or action..."
            className="border rounded px-3 py-2 flex-1"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="border rounded px-3 py-2"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="ALL">All Activities</option>
            <option value="CASE">Cases Only</option>
            <option value="AGENT">Agents Only</option>
          </select>
          <button
            onClick={clearAllLogs}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Clear All
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold">
            Activity Timeline ({filteredLogs.length})
          </h2>
        </div>

        <div className="p-4">
          {filteredLogs.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p className="text-lg mb-2">No activity logs found</p>
              <p className="text-sm">Actions will appear here as they happen</p>
            </div>
          ) : (
            <VariableSizeList
              ref={listRef}
              height={600}
              itemCount={filteredLogs.length}
              itemSize={(index) => {
                return expandedLogs.has(filteredLogs[index].id) ? 320 : 140;
              }}
              width="100%"
              itemData={filteredLogs}
            >
              {({ index, style }) => {
                const log = filteredLogs[index];
                return (
                  <div style={style} className="px-2">
                    <div className="border-l-4 border-blue-500 bg-gray-50 rounded-r-lg p-4 hover:shadow-md transition-shadow mb-3">
                      <div
                        className="flex justify-between items-start cursor-pointer"
                        onClick={() => toggleLog(log.id, index)}
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-2xl">{getActionIcon(log.action)}</span>
                            <span
                              className={`px-3 py-1 rounded-full text-sm font-medium ${getActionColor(
                                log.action
                              )}`}
                            >
                              {log.action.toUpperCase()}
                            </span>
                            <span className="text-gray-500 text-sm">
                              {formatTimestamp(log.timestamp)}
                            </span>
                          </div>
                          <p className="text-gray-800 font-medium">{log.details}</p>
                          <p className="text-gray-500 text-sm mt-1">
                            by <span className="font-medium">{log.user}</span> (
                            {log.role})
                          </p>
                        </div>
                        <button className="text-gray-400 hover:text-gray-600">
                          {expandedLogs.has(log.id) ? "▼" : "▶"}
                        </button>
                      </div>

                      {expandedLogs.has(log.id) && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <div className="grid grid-cols-2 gap-3 text-sm">
                            <div>
                              <span className="text-gray-500">Log ID:</span>
                              <span className="ml-2 font-mono">{log.id}</span>
                            </div>
                            <div>
                              <span className="text-gray-500">Entity Type:</span>
                              <span className="ml-2 font-medium capitalize">
                                {log.entity}
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-500">User:</span>
                              <span className="ml-2 font-medium">{log.user}</span>
                            </div>
                            <div>
                              <span className="text-gray-500">Role:</span>
                              <span className="ml-2 font-medium">{log.role}</span>
                            </div>
                            <div className="col-span-2">
                              <span className="text-gray-500">Full Timestamp:</span>
                              <span className="ml-2 font-mono">
                                {new Date(log.timestamp).toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              }}
            </VariableSizeList>
          )}
        </div>
      </div>
      </div>
    </div>
  );
}
