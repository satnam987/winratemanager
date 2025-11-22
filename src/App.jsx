import React, { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import TradeForm from './components/TradeForm';
import TradeList from './components/TradeList';

function App() {
  const [trades, setTrades] = useState(() => {
    const saved = localStorage.getItem('trades');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('trades', JSON.stringify(trades));
  }, [trades]);

  const addTrade = async (trade) => {
    // 1. Update Local State (Immediate UI update)
    setTrades([trade, ...trades]);

    // 2. Send to Google Sheets (Background)
    try {
      const response = await fetch('/api/save-trade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(trade),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(`Google Sheets Error: ${data.message || 'Unknown error'}\nDetails: ${data.error || ''}`);
        console.warn('Failed to save to Google Sheets', data);
      } else {
        // Optional: Notify success
        // alert('Saved to Google Sheet!'); 
      }
    } catch (error) {
      console.error('Error saving to sheet:', error);
      alert(`Network Error: ${error.message}`);
    }
  };

  const deleteTrade = (id) => {
    setTrades(trades.filter(t => t.id !== id));
  };

  return (
    <div className="container">
      <header style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <h1 style={{
          fontSize: '2.5rem',
          background: 'linear-gradient(to right, #fff, #a0a0a0)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          WinRate Manager
        </h1>
      </header>

      <Dashboard trades={trades} />
      <TradeForm onAddTrade={addTrade} />
      <TradeList trades={trades} onDeleteTrade={deleteTrade} />
    </div>
  );
}

export default App;
