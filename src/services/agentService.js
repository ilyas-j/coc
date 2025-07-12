import api from './api';

export const agentService = {
  donnerAvisMarchandise: async (avisData) => {
    const response = await api.post('/agent/avis-marchandise', avisData);
    return response.data;
  }
};