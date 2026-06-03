import React, { useState } from 'react';
import { useEchoAI } from '../../hooks/useEchoAI';

const CaptionHelper = ({ onSelect, currentDraft }) => {
  const { getSuggestions, loading } = useEchoAI();
  const [options, setOptions] = useState([]);

  const handleEnhance = async () => {
    const suggestions = await getSuggestions(currentDraft, 'creative');
    setOptions(suggestions);
  };

  return (
    <div className="ai-helper-container">
      <button 
        type="button" 
        onClick={handleEnhance} 
        disabled={loading || !currentDraft}
      >
        {loading ? "✨ Thinking..." : "✨ Enhance with EchoAI"}
      </button>

      {options.length > 0 && (
        <div className="suggestions-dropdown">
          {options.map((text, index) => (
            <div 
              key={index} 
              className="suggestion-item" 
              onClick={() => {
                onSelect(text);
                setOptions([]); // Clear options after selection
              }}
            >
              {text}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CaptionHelper;