import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SnackSuggestion = ({ userId, mood, sessionDuration }) => {
  const [suggestion, setSuggestion] = useState('');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const fetchSuggestion = async () => {
      try {
        const response = await axios.post('http://localhost:8000/suggest-snack', {
          user_id: userId,
          mood,
          session_duration: sessionDuration,
        });
        setSuggestion(response.data.suggestion);
        setVisible(true);
      } catch (error) {
        console.error('Error fetching suggestion:', error);
      }
    };

    // Fetch suggestion immediately and every hour
    fetchSuggestion();
    const interval = setInterval(fetchSuggestion, 3600000); // 1 hour
    return () => clearInterval(interval);
  }, [userId, mood, sessionDuration]);

  const handleDismiss = () => setVisible(false);

  const logFeedback = async (liked) => {
    try {
      await axios.post('http://localhost:8000/log-feedback', {
        user_id: userId,
        suggestion,
        liked,
      });
      setVisible(false);
    } catch (error) {
      console.error('Error logging feedback:', error);
    }
  };

  if (!visible || !suggestion) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      background: '#f0f0f0',
      padding: '15px',
      borderRadius: '8px',
      boxShadow: '0 0 10px rgba(0,0,0,0.2)',
      maxWidth: '300px',
    }}>
      <p><strong>Snack/Drink Idea:</strong> {suggestion}</p>
      <button onClick={() => logFeedback(true)} style={{ marginRight: '10px' }}>Like</button>
      <button onClick={() => logFeedback(false)} style={{ marginRight: '10px' }}>Dislike</button>
      <button onClick={handleDismiss}>Dismiss</button>
    </div>
  );
};

export default SnackSuggestion;