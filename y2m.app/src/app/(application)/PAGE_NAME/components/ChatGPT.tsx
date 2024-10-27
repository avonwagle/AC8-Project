'use client'; // This marks the component as a Client Component

import React, { useState } from 'react';

export const ChatGPT = () => {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return; // Prevent empty submissions
    setLoading(true);

    try {
      const res = await fetch('/api/chatgpt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      if (!res.ok) {
        throw new Error(`Error: ${res.status}`);
      }

      const data = await res.json();
      setResponse(data.message || 'No response from server.');
      setPrompt(''); // Clear input field after successful submission
    } catch (error) {
      setResponse('Error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Chat with GPT</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Ask me anything..."
          required
          style={styles.input}
          disabled={loading} // Disable input while loading
        />
        <button type="submit" style={styles.button} disabled={loading}>
          {loading ? 'Sending...' : 'Send'}
        </button>
      </form>
      {response && (
        <div style={styles.responseContainer}>
          <h3 style={styles.responseHeading}>Response:</h3>
          <p style={styles.responseText}>{response}</p>
        </div>
      )}
    </div>
  );
};

// Basic inline styles with correct TypeScript typing
const styles: { [key: string]: React.CSSProperties } = {
  container: {
    maxWidth: '600px',
    margin: '0 auto',
    padding: '20px',
    border: '1px solid #ccc',
    borderRadius: '10px',
    backgroundColor: '#f9f9f9',
  },
  heading: {
    textAlign: 'center',
    color: '#333',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  input: {
    width: '100%',
    padding: '10px',
    marginBottom: '10px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    fontSize: '16px',
  },
  button: {
    padding: '10px 20px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
  },
  responseContainer: {
    marginTop: '20px',
    padding: '10px',
    backgroundColor: '#e9e9e9',
    borderRadius: '5px',
  },
  responseHeading: {
    marginBottom: '10px',
    color: '#444',
  },
  responseText: {
    color: '#555',
  },
};
