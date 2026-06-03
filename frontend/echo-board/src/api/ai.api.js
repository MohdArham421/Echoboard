import axios from 'axios';

// Assuming you have an axios instance configured with your base URL
const API_URL = '/api/ai';

export const generateCaptionAPI = async (draft, tone) => {
  const { data } = await axios.post(`${API_URL}/generate-caption`, { draft, tone });
  return data.suggestions;
};