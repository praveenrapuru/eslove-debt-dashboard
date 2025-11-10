// Activity Log Service to track all user actions
class ActivityLogService {
  constructor() {
    this.logs = [];
    this.loadFromStorage();
  }

  // Load logs from localStorage
  loadFromStorage() {
    try {
      const stored = localStorage.getItem('activityLogs');
      if (stored) {
        this.logs = JSON.parse(stored);
      } else {
        // Initialize with some sample data
        this.logs = [
          {
            id: 1,
            timestamp: new Date(Date.now() - 3600000).toISOString(),
            user: "Admin User",
            role: "ADMIN",
            action: "created",
            entity: "agent",
            details: "Added new agent: Ravi Kumar",
          },
          {
            id: 2,
            timestamp: new Date(Date.now() - 7200000).toISOString(),
            user: "Agent User",
            role: "AGENT",
            action: "updated",
            entity: "case",
            details: "Updated case LN-1001 status to FOLLOW_UP",
          },
          {
            id: 3,
            timestamp: new Date(Date.now() - 10800000).toISOString(),
            user: "Admin User",
            role: "ADMIN",
            action: "assigned",
            entity: "case",
            details: "Assigned case LN-1005 to Priya Patel",
          },
        ];
      }
    } catch (error) {
      console.error("Error loading activity logs:", error);
      this.logs = [];
    }
  }

  // Save logs to localStorage
  saveToStorage() {
    try {
      localStorage.setItem('activityLogs', JSON.stringify(this.logs));
    } catch (error) {
      console.error("Error saving activity logs:", error);
    }
  }

  // Add a new activity log
  addLog(user, role, action, entity, details) {
    const log = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      user,
      role,
      action,
      entity,
      details,
    };

    this.logs.unshift(log); // Add to beginning of array
    this.saveToStorage();
    return log;
  }

  // Get all logs
  getLogs() {
    return [...this.logs];
  }

  // Get logs filtered by entity type
  getLogsByEntity(entity) {
    return this.logs.filter(log => log.entity === entity);
  }

  // Get logs filtered by user
  getLogsByUser(userName) {
    return this.logs.filter(log => log.user === userName);
  }

  // Get logs filtered by action
  getLogsByAction(action) {
    return this.logs.filter(log => log.action === action);
  }

  // Get logs within a date range
  getLogsByDateRange(startDate, endDate) {
    return this.logs.filter(log => {
      const logDate = new Date(log.timestamp);
      return logDate >= startDate && logDate <= endDate;
    });
  }

  // Clear all logs
  clearLogs() {
    this.logs = [];
    this.saveToStorage();
  }

  // Get recent logs (last N logs)
  getRecentLogs(limit = 10) {
    return this.logs.slice(0, limit);
  }
}

// Create singleton instance
const activityLogService = new ActivityLogService();
export default activityLogService;
