/**
 * Agent Service
 * Handles all agent-related API operations
 */

import baseApiService from './baseApiService';
import mockDataService from './mockData';

class AgentService {
  constructor() {
    this.endpoint = '/agents';
  }

  /**
   * Get all agents
   * @returns {Promise<Array>} List of agents
   */
  async getAgents() {
    try {
      // In production, this would make a real API call
      // const response = await baseApiService.get(this.endpoint);
      // return response.data;

      // For now, use mock data
      return await mockDataService.getAgents();
    } catch (error) {
      console.error('Error fetching agents:', error);
      throw error;
    }
  }

  /**
   * Get agent by ID
   * @param {number} id - Agent ID
   * @returns {Promise<Object>} Agent object
   */
  async getAgentById(id) {
    try {
      const agents = await this.getAgents();
      const agent = agents.find(a => a.id === id);

      if (!agent) {
        throw new Error(`Agent with id ${id} not found`);
      }

      return agent;
    } catch (error) {
      console.error(`Error fetching agent ${id}:`, error);
      throw error;
    }
  }

  /**
   * Create new agent
   * @param {Object} agentData - Agent data
   * @returns {Promise<Object>} Created agent
   */
  async createAgent(agentData) {
    try {
      // In production:
      // const response = await baseApiService.post(this.endpoint, agentData);
      // return response.data;

      return await mockDataService.addAgent(agentData);
    } catch (error) {
      console.error('Error creating agent:', error);
      throw error;
    }
  }

  /**
   * Update agent
   * @param {number} id - Agent ID
   * @param {Object} updates - Updates to apply
   * @returns {Promise<Object>} Updated agent
   */
  async updateAgent(id, updates) {
    try {
      // In production:
      // const response = await baseApiService.put(`${this.endpoint}/${id}`, updates);
      // return response.data;

      return await mockDataService.updateAgent(id, updates);
    } catch (error) {
      console.error(`Error updating agent ${id}:`, error);
      throw error;
    }
  }

  /**
   * Delete agent
   * @param {number} id - Agent ID
   * @returns {Promise<void>}
   */
  async deleteAgent(id) {
    try {
      // In production:
      // await baseApiService.delete(`${this.endpoint}/${id}`);

      return await mockDataService.deleteAgent(id);
    } catch (error) {
      console.error(`Error deleting agent ${id}:`, error);
      throw error;
    }
  }

  /**
   * Get agent performance metrics
   * @param {number} id - Agent ID
   * @returns {Promise<Object>} Performance metrics
   */
  async getAgentPerformance(id) {
    try {
      const agent = await this.getAgentById(id);

      return {
        id: agent.id,
        name: agent.name,
        totalCases: agent.cases,
        recoveryRate: agent.recovery,
        avgCasesPerDay: (agent.cases / 30).toFixed(2)
      };
    } catch (error) {
      console.error(`Error fetching performance for agent ${id}:`, error);
      throw error;
    }
  }

  /**
   * Search agents by name or email
   * @param {string} query - Search query
   * @returns {Promise<Array>} Matching agents
   */
  async searchAgents(query) {
    try {
      const agents = await this.getAgents();
      const lowerQuery = query.toLowerCase();

      return agents.filter(a =>
        a.name.toLowerCase().includes(lowerQuery) ||
        a.email.toLowerCase().includes(lowerQuery)
      );
    } catch (error) {
      console.error(`Error searching agents with query "${query}":`, error);
      throw error;
    }
  }

  /**
   * Get top performing agents
   * @param {number} limit - Number of agents to return
   * @returns {Promise<Array>} Top performing agents
   */
  async getTopPerformers(limit = 5) {
    try {
      const agents = await this.getAgents();

      return agents
        .sort((a, b) => b.recovery - a.recovery)
        .slice(0, limit);
    } catch (error) {
      console.error('Error fetching top performers:', error);
      throw error;
    }
  }
}

// Create singleton instance
const agentService = new AgentService();
export default agentService;
