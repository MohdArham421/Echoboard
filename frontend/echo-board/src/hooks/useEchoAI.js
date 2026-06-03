import { useState } from 'react';
import { generateCaptionAPI } from '../api/ai.api';

export const useEchoAI = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getSuggestions = async (draft, tone) => {
    setLoading(true);
    setError(null);
    try {
      const suggestions = await generateCaptionAPI(draft, tone);
      setLoading(false);
      return suggestions;
    } catch (err) {
      setError("EchoAI is having trouble connecting.");
      setLoading(false);
      return [];
    }
  };

  return { getSuggestions, loading, error };
};