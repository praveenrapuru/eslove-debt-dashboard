// Mock data service to simulate backend API
class MockDataService {
  constructor() {
    this.agents = [
      { id: 1, name: "Ravi Kumar", email: "ravi@example.com", cases: 5, recovery: 72 },
      { id: 2, name: "Priya Patel", email: "priya@example.com", cases: 8, recovery: 68 },
      { id: 3, name: "Arun Jain", email: "arun@example.com", cases: 4, recovery: 50 },
    ];

    this.cases = Array.from({ length: 25 }).map((_, i) => ({
      id: `LN-${1000 + i}`,
      customer: ["Asha Rao", "Vikram Singh", "Neha Sharma", "Ravi Kumar", "Priya Patel"][i % 5],
      phone: ["+91 98765 43210", "+91 98765 43211", "+91 98765 43212", "+91 98765 43213", "+91 98765 43214"][i % 5],
      amount: Math.floor(Math.random() * 50000 + 10000),
      status: ["ASSIGNED", "FOLLOW_UP", "RESOLVED", "CLOSED"][i % 4],
      agentId: (i % 3) + 1,
      agentName: ["Ravi Kumar", "Priya Patel", "Arun Jain"][i % 3],
      createdAt: new Date(Date.now() - i * 86400000).toISOString(),
      paymentHistory: [
        { date: "2025-10-01", amount: Math.floor(Math.random() * 5000 + 1000), status: "Received", method: "UPI" },
        { date: "2025-10-15", amount: Math.floor(Math.random() * 5000 + 1000), status: "Pending", method: "Bank Transfer" },
      ],
      history: [
        { stage: "ASSIGNED", note: "Assigned to agent", date: "2025-11-01" },
        { stage: "FOLLOW_UP", note: "Follow-up call done", date: "2025-11-03" },
      ],
    }));
  }

  // Agent CRUD operations
  getAgents() {
    return Promise.resolve([...this.agents]);
  }

  addAgent(agent) {
    const newAgent = {
      id: Date.now(),
      ...agent,
      cases: 0,
      recovery: 0,
    };
    this.agents.push(newAgent);
    return Promise.resolve(newAgent);
  }

  updateAgent(id, updates) {
    const index = this.agents.findIndex(a => a.id === id);
    if (index !== -1) {
      this.agents[index] = { ...this.agents[index], ...updates };
      return Promise.resolve(this.agents[index]);
    }
    return Promise.reject(new Error("Agent not found"));
  }

  deleteAgent(id) {
    this.agents = this.agents.filter(a => a.id !== id);
    return Promise.resolve();
  }

  // Case operations
  getCases() {
    return Promise.resolve([...this.cases]);
  }

  updateCase(id, updates) {
    const index = this.cases.findIndex(c => c.id === id);
    if (index !== -1) {
      this.cases[index] = { ...this.cases[index], ...updates };
      return Promise.resolve(this.cases[index]);
    }
    return Promise.reject(new Error("Case not found"));
  }

  // Case assignment operations
  assignCase(caseId, agentId) {
    const caseIndex = this.cases.findIndex(c => c.id === caseId);
    const agent = this.agents.find(a => a.id === agentId);

    if (caseIndex !== -1 && agent) {
      // Update case
      this.cases[caseIndex].agentId = agentId;
      this.cases[caseIndex].agentName = agent.name;

      // Update agent case count
      this.updateAgentCaseCount();

      return Promise.resolve(this.cases[caseIndex]);
    }
    return Promise.reject(new Error("Case or Agent not found"));
  }

  unassignCase(caseId) {
    const caseIndex = this.cases.findIndex(c => c.id === caseId);

    if (caseIndex !== -1) {
      this.cases[caseIndex].agentId = null;
      this.cases[caseIndex].agentName = "Unassigned";

      // Update agent case count
      this.updateAgentCaseCount();

      return Promise.resolve(this.cases[caseIndex]);
    }
    return Promise.reject(new Error("Case not found"));
  }

  // Helper to update agent case counts
  updateAgentCaseCount() {
    this.agents.forEach(agent => {
      agent.cases = this.cases.filter(c => c.agentId === agent.id).length;
    });
  }

  // Get cases for specific agent
  getCasesByAgent(agentId) {
    return Promise.resolve(this.cases.filter(c => c.agentId === agentId));
  }

  // Get unassigned cases
  getUnassignedCases() {
    return Promise.resolve(this.cases.filter(c => !c.agentId));
  }
}

// Create singleton instance
const mockDataService = new MockDataService();
export default mockDataService;
