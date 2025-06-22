// services/api.js

const API_BASE_URL = 'http://localhost:8000/api/v1';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Generic fetch method with error handling
  async fetchWithErrorHandling(url, options = {}) {
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `HTTP Error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Prediction endpoints
  async predictProductivity(inputData) {
    return this.fetchWithErrorHandling(`${this.baseURL}/predict`, {
      method: 'POST',
      body: JSON.stringify(inputData),
    });
  }

  async explainPrediction(inputData) {
    return this.fetchWithErrorHandling(`${this.baseURL}/explain`, {
      method: 'POST',
      body: JSON.stringify(inputData),
    });
  }

  async getModelStatus() {
    return this.fetchWithErrorHandling(`${this.baseURL}/model-status`);
  }

  // Feedback endpoints
  async submitFeedback(feedbackData) {
    return this.fetchWithErrorHandling(`${this.baseURL}/feedback`, {
      method: 'POST',
      body: JSON.stringify(feedbackData),
    });
  }

  async getFeedbackStats() {
    return this.fetchWithErrorHandling(`${this.baseURL}/feedback-stats`);
  }

  // Combined method for getting prediction with explanation
  async getPredictionWithExplanation(inputData) {
    try {
      const [prediction, explanation] = await Promise.all([
        this.predictProductivity(inputData),
        this.explainPrediction(inputData),
      ]);

      return {
        prediction,
        explanation,
      };
    } catch {
      // If explanation fails, try to get at least the prediction
      const prediction = await this.predictProductivity(inputData);
      return {
        prediction,
        explanation: null,
        error: 'Explanation failed to load',
      };
    }
  }

  // Health check
  async healthCheck() {
    return this.fetchWithErrorHandling(`${this.baseURL.replace('/api/v1', '')}/health`);
  }
}

// Create singleton instance
const apiService = new ApiService();

export default apiService;

// Export individual methods for direct usage
export const {
  predictProductivity,
  explainPrediction,
  getModelStatus,
  submitFeedback,
  getFeedbackStats,
  getPredictionWithExplanation,
  healthCheck,
} = apiService;