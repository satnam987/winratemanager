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

      if (!response.ok) {
        console.warn('Failed to save to Google Sheets');
      }
    } catch (error) {
      console.error('Error saving to sheet:', error);
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
