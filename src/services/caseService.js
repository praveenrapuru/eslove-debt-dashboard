/**
 * Case Service
 * Handles all case-related API operations
 */

import baseApiService from './baseApiService';
import mockDataService from './mockData';

class CaseService {
  constructor() {
    this.endpoint = '/cases';
  }

  /**
   * Get all cases
   * @returns {Promise<Array>} List of cases
   */
  async getCases() {
    try {
      // In production, this would make a real API call
      // const response = await baseApiService.get(this.endpoint);
      // return response.data;

      // For now, use mock data
      const cases = await mockDataService.getCases();
      return cases;
    } catch (error) {
      console.error('Error fetching cases:', error);
      throw error;
    }
  }

  /**
   * Get case by ID
   * @param {string} id - Case ID
   * @returns {Promise<Object>} Case object
   */
  async getCaseById(id) {
    try {
      const cases = await this.getCases();
      const caseItem = cases.find(c => c.id === id);

      if (!caseItem) {
        throw new Error(`Case with id ${id} not found`);
      }

      return caseItem;
    } catch (error) {
      console.error(`Error fetching case ${id}:`, error);
      throw error;
    }
  }

  /**
   * Get cases by agent ID
   * @param {number} agentId - Agent ID
   * @returns {Promise<Array>} List of cases
   */
  async getCasesByAgent(agentId) {
    try {
      return await mockDataService.getCasesByAgent(agentId);
    } catch (error) {
      console.error(`Error fetching cases for agent ${agentId}:`, error);
      throw error;
    }
  }

  /**
   * Get unassigned cases
   * @returns {Promise<Array>} List of unassigned cases
   */
  async getUnassignedCases() {
    try {
      return await mockDataService.getUnassignedCases();
    } catch (error) {
      console.error('Error fetching unassigned cases:', error);
      throw error;
    }
  }

  /**
   * Update case
   * @param {string} id - Case ID
   * @param {Object} updates - Updates to apply
   * @returns {Promise<Object>} Updated case
   */
  async updateCase(id, updates) {
    try {
      // In production:
      // const response = await baseApiService.put(`${this.endpoint}/${id}`, updates);
      // return response.data;

      return await mockDataService.updateCase(id, updates);
    } catch (error) {
      console.error(`Error updating case ${id}:`, error);
      throw error;
    }
  }

  /**
   * Assign case to agent
   * @param {string} caseId - Case ID
   * @param {number} agentId - Agent ID
   * @returns {Promise<Object>} Updated case
   */
  async assignCase(caseId, agentId) {
    try {
      // In production:
      // const response = await baseApiService.post(`${this.endpoint}/${caseId}/assign`, { agentId });
      // return response.data;

      return await mockDataService.assignCase(caseId, agentId);
    } catch (error) {
      console.error(`Error assigning case ${caseId} to agent ${agentId}:`, error);
      throw error;
    }
  }

  /**
   * Unassign case from agent
   * @param {string} caseId - Case ID
   * @returns {Promise<Object>} Updated case
   */
  async unassignCase(caseId) {
    try {
      // In production:
      // const response = await baseApiService.post(`${this.endpoint}/${caseId}/unassign`);
      // return response.data;

      return await mockDataService.unassignCase(caseId);
    } catch (error) {
      console.error(`Error unassigning case ${caseId}:`, error);
      throw error;
    }
  }

  /**
   * Filter cases by status
   * @param {string} status - Status to filter by
   * @returns {Promise<Array>} Filtered cases
   */
  async getCasesByStatus(status) {
    try {
      const cases = await this.getCases();
      return cases.filter(c => c.status === status);
    } catch (error) {
      console.error(`Error filtering cases by status ${status}:`, error);
      throw error;
    }
  }

  /**
   * Search cases by customer name or loan ID
   * @param {string} query - Search query
   * @returns {Promise<Array>} Matching cases
   */
  async searchCases(query) {
    try {
      const cases = await this.getCases();
      const lowerQuery = query.toLowerCase();

      return cases.filter(c =>
        c.customer.toLowerCase().includes(lowerQuery) ||
        c.id.toLowerCase().includes(lowerQuery)
      );
    } catch (error) {
      console.error(`Error searching cases with query "${query}":`, error);
      throw error;
    }
  }
}

// Create singleton instance
const caseService = new CaseService();
export default caseService;
