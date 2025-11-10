import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import mockDataService from "../services/mockData";
import activityLogService from "../services/activityLogService";

export default function Agents() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [agents, setAgents] = useState([]);
  const [cases, setCases] = useState([]);
  const [form, setForm] = useState({ name: "", email: "" });
  const [editingAgent, setEditingAgent] = useState(null);
  const [assigningAgent, setAssigningAgent] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const agentsData = await mockDataService.getAgents();
    const casesData = await mockDataService.getCases();
    setAgents(agentsData);
    setCases(casesData);
  };

  const addAgent = async () => {
    if (!form.name || !form.email) return alert("Enter name and email");

    await mockDataService.addAgent(form);

    activityLogService.addLog(
      user.name,
      user.role,
      "created",
      "agent",
      `Created new agent: ${form.name} (${form.email})`
    );

    setForm({ name: "", email: "" });
    loadData();
  };

  const updateAgent = async () => {
    if (!editingAgent.name || !editingAgent.email) return alert("Enter name and email");
    await mockDataService.updateAgent(editingAgent.id, {
      name: editingAgent.name,
      email: editingAgent.email,
    });

    activityLogService.addLog(
      user.name,
      user.role,
      "updated",
      "agent",
      `Updated agent: ${editingAgent.name} (${editingAgent.email})`
    );

    setEditingAgent(null);
    loadData();
  };

  const deleteAgent = async (id) => {
    const agent = agents.find(a => a.id === id);
    if (window.confirm("Delete agent?")) {
      await mockDataService.deleteAgent(id);

      activityLogService.addLog(
        user.name,
        user.role,
        "deleted",
        "agent",
        `Deleted agent: ${agent.name}`
      );

      loadData();
    }
  };

  const assignCase = async (caseId, agentId) => {
    const caseItem = cases.find(c => c.id === caseId);
    const agent = agents.find(a => a.id === agentId);

    await mockDataService.assignCase(caseId, agentId);

    // Log activity
    activityLogService.addLog(
      user.name,
      user.role,
      "assigned",
      "case",
      `Assigned case ${caseId} (${caseItem?.customer}) to ${agent?.name}`
    );

    loadData();
  };

  const unassignCase = async (caseId) => {
    const caseItem = cases.find(c => c.id === caseId);

    await mockDataService.unassignCase(caseId);

    // Log activity
    activityLogService.addLog(
      user.name,
      user.role,
      "unassigned",
      "case",
      `Unassigned case ${caseId} (${caseItem?.customer})`
    );

    loadData();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-gradient-to-r from-green-600 to-teal-700 shadow-lg">
        <div className="px-6 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-white">Agent Management</h1>
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate("/dashboard")}
                className="bg-white/20 text-white px-4 py-2 rounded-md hover:bg-white/30 transition"
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
        <h2 className="font-semibold mb-3">Add New Agent</h2>
        <div className="flex gap-3">
          <input
            placeholder="Agent Name"
            className="border rounded px-3 py-2 flex-1"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <input
            placeholder="Email"
            className="border rounded px-3 py-2 flex-1"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <button onClick={addAgent} className="bg-blue-600 text-white px-4 rounded">
            Add Agent
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white shadow rounded-lg">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-3">Name</th>
              <th>Email</th>
              <th>Cases Assigned</th>
              <th>Recovery %</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {agents.map((a) => (
              <tr key={a.id} className="border-b">
                <td className="p-3">{a.name}</td>
                <td>{a.email}</td>
                <td>{a.cases}</td>
                <td>{a.recovery}%</td>
                <td className="flex gap-2 p-3">
                  <button
                    onClick={() => setEditingAgent({ ...a })}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setAssigningAgent(a)}
                    className="text-green-600 hover:underline"
                  >
                    Assign Cases
                  </button>
                  <button
                    onClick={() => deleteAgent(a.id)}
                    className="text-red-500 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Agent Modal */}
      {editingAgent && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
          <div className="bg-white rounded-lg shadow-lg w-[500px] p-6 relative">
            <button
              onClick={() => setEditingAgent(null)}
              className="absolute right-3 top-2 text-gray-500 text-xl"
            >
              ✕
            </button>
            <h2 className="text-xl font-semibold mb-4">Edit Agent</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  className="border rounded px-3 py-2 w-full"
                  value={editingAgent.name}
                  onChange={(e) =>
                    setEditingAgent({ ...editingAgent, name: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  className="border rounded px-3 py-2 w-full"
                  value={editingAgent.email}
                  onChange={(e) =>
                    setEditingAgent({ ...editingAgent, email: e.target.value })
                  }
                />
              </div>
              <button
                onClick={updateAgent}
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
              >
                Update Agent
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Assign Cases Modal */}
      {assigningAgent && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
          <div className="bg-white rounded-lg shadow-lg w-[700px] p-6 relative max-h-[80vh] overflow-y-auto">
            <button
              onClick={() => setAssigningAgent(null)}
              className="absolute right-3 top-2 text-gray-500 text-xl"
            >
              ✕
            </button>
            <h2 className="text-xl font-semibold mb-4">
              Assign Cases to {assigningAgent.name}
            </h2>

            <h3 className="font-semibold mb-2">Currently Assigned Cases</h3>
            <div className="bg-gray-50 rounded p-3 mb-4 max-h-48 overflow-y-auto">
              {cases.filter((c) => c.agentId === assigningAgent.id).length === 0 ? (
                <p className="text-gray-500 text-sm">No cases assigned yet</p>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left border-b">
                      <th className="pb-2">Loan ID</th>
                      <th>Customer</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cases
                      .filter((c) => c.agentId === assigningAgent.id)
                      .map((c) => (
                        <tr key={c.id} className="border-b">
                          <td className="py-2">{c.id}</td>
                          <td>{c.customer}</td>
                          <td>{c.status}</td>
                          <td>
                            <button
                              onClick={() => unassignCase(c.id)}
                              className="text-red-500 hover:underline text-xs"
                            >
                              Unassign
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              )}
            </div>

            <h3 className="font-semibold mb-2">Available Cases to Assign</h3>
            <div className="bg-gray-50 rounded p-3 max-h-64 overflow-y-auto">
              {cases.filter((c) => c.agentId !== assigningAgent.id).length === 0 ? (
                <p className="text-gray-500 text-sm">All cases are assigned to this agent</p>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left border-b">
                      <th className="pb-2">Loan ID</th>
                      <th>Customer</th>
                      <th>Status</th>
                      <th>Current Agent</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cases
                      .filter((c) => c.agentId !== assigningAgent.id)
                      .map((c) => (
                        <tr key={c.id} className="border-b">
                          <td className="py-2">{c.id}</td>
                          <td>{c.customer}</td>
                          <td>{c.status}</td>
                          <td>{c.agentName || "Unassigned"}</td>
                          <td>
                            <button
                              onClick={() => assignCase(c.id, assigningAgent.id)}
                              className="text-blue-600 hover:underline text-xs"
                            >
                              Assign
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
