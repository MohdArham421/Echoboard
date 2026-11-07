import axios from 'axios';
import { API_URL } from '../config';

export const generateCaptionAPI = async (draft, tone) => {
  const { data } = await axios.post(`${API_URL}/ai/generate-caption`, { draft, tone });
  return data.suggestions;
};