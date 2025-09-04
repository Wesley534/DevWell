import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Chatbot = ({ userId, mood, sessionDuration }) => {
  const [messages, setMessages] = useState([]);

  const fetchSnackSuggestion = async () => {
    try {
      const response = await axios.post('http://localhost:8000/suggest-snack', {
        user_id: userId,
        mood,
        session_duration: sessionDuration,
      });
      setMessages([...messages, {
        sender: 'bot',
        text: `Feeling ${mood || 'good'}? Try this: ${response.data.suggestion}!`,
      }]);
    } catch (error) {
      setMessages([...messages, { sender: 'bot', text: 'Oops, no snack ideas right now!' }]);
    }
  };

  // Proactive suggestion every hour
  useEffect(() => {
    const interval = setInterval(fetchSnackSuggestion, 3600000); // 1 hour
    return () => clearInterval(interval);
  }, [userId, mood, sessionDuration]);

  return (
    <div style={{ maxWidth: '400px', margin: '20px' }}>
      <button onClick={fetchSnackSuggestion}>Get Snack/Drink Idea</button>
      <div style={{ maxHeight: '200px', overflowY: 'auto', marginTop: '10px' }}>
        {messages.map((msg, idx) => (
          <p key={idx} style={{ color: msg.sender === 'bot' ? '#007bff' : '#000' }}>
            <strong>{msg.sender}:</strong> {msg.text}
          </p>
        ))}
      </div>
    </div>
  );
};

export default Chatbot;