import React, { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import TradeForm from './components/TradeForm';
import TradeList from './components/TradeList';
import Charts from './components/Charts';

function App() {
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load trades from Google Sheets on mount
  useEffect(() => {
    const loadTrades = async () => {
      try {
        const response = await fetch('/api/load-trades');
        if (response.ok) {
          const data = await response.json();
          setTrades(data.trades || []);
        }
      } catch (error) {
        console.error('Failed to load trades:', error);
        // Fallback to localStorage if API fails
        const saved = localStorage.getItem('trades');
        if (saved) {
          setTrades(JSON.parse(saved));
        }
      } finally {
        setLoading(false);
      }
    };

    loadTrades();
  }, []);

  // Save to localStorage whenever trades change
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('trades', JSON.stringify(trades));
    }
  }, [trades, loading]);

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

      const contentType = response.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") === -1) {
        alert("Note: Saving to Google Sheets only works on the LIVE website (Vercel), not on localhost.\nPlease deploy and test there.");
        return;
      }

      const data = await response.json();

      if (!response.ok) {
        alert(`Google Sheets Error: ${data.message || 'Unknown error'}\nDetails: ${data.error || ''}\nDebug: ${data.debug || ''}`);
        console.warn('Failed to save to Google Sheets', data);
      }
    } catch (error) {
      console.error('Error saving to sheet:', error);
      alert(`Network Error: ${error.message}`);
    }
  };

  const deleteTrade = (id) => {
    setTrades(trades.filter(t => t.id !== id));
  };

  if (loading) {
    return (
      <div className="container" style={{ textAlign: 'center', marginTop: '5rem' }}>
        <h2>Loading trades...</h2>
      </div>
    );
  }

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
      <Charts trades={trades} />
      <TradeForm onAddTrade={addTrade} />
      <TradeList trades={trades} onDeleteTrade={deleteTrade} />
    </div>
  );
}

export default App;
