import React, { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import TradeForm from './components/TradeForm';
import TradeList from './components/TradeList';
import Charts from './components/Charts';
import './App.css';

function App() {
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard'); // dashboard, log, analytics, history
  const [historyPairFilter, setHistoryPairFilter] = useState('All');

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

  useEffect(() => {
    if (!loading) {
      localStorage.setItem('trades', JSON.stringify(trades));
    }
  }, [trades, loading]);

  const addTrade = async (trade) => {
    setTrades([trade, ...trades]);

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
      } else {
        // Success notification
        alert('✅ Trade saved successfully!');
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
          WebkitTextFillColor: 'transparent',
          marginBottom: '1.5rem'
        }}>
          WinRate Manager
        </h1>

        {/* Tab Navigation */}
        <div className="tab-nav">
          <button
            className={`tab-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            📊 Dashboard
          </button>
          <button
            className={`tab-btn ${activeTab === 'log' ? 'active' : ''}`}
            onClick={() => setActiveTab('log')}
          >
            ➕ Log Trade
          </button>
          <button
            className={`tab-btn ${activeTab === 'analytics' ? 'active' : ''}`}
            onClick={() => setActiveTab('analytics')}
          >
            📈 Analytics
          </button>
          <button
            className={`tab-btn ${activeTab === 'history' ? 'active' : ''}`}
            onClick={() => setActiveTab('history')}
          >
            📜 History
          </button>
        </div>
      </header>

      {/* Dashboard Tab */}
      {activeTab === 'dashboard' && (
        <div className="tab-content">
          <Dashboard trades={trades} />
        </div>
      )}

      {/* Log Trade Tab */}
      {activeTab === 'log' && (
        <div className="tab-content">
          <TradeForm onAddTrade={addTrade} />
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div className="tab-content">
          <Charts trades={trades} />
        </div>
      )}

      {/* History Tab */}
      {activeTab === 'history' && (
        <div className="tab-content">
          <div>
            <div className="history-pair-filter glass-panel">
              <button
                className={`filter-btn ${historyPairFilter === 'All' ? 'active' : ''}`}
                onClick={() => setHistoryPairFilter('All')}
              >
                📊 All Pairs
              </button>
              <button
                className={`filter-btn ${historyPairFilter === 'NQ' ? 'active' : ''}`}
                onClick={() => setHistoryPairFilter('NQ')}
              >
                📈 NQ
              </button>
              <button
                className={`filter-btn ${historyPairFilter === 'GBP/USD' ? 'active' : ''}`}
                onClick={() => setHistoryPairFilter('GBP/USD')}
              >
                💷 GBP/USD
              </button>
              <button
                className={`filter-btn ${historyPairFilter === 'XAU/USD' ? 'active' : ''}`}
                onClick={() => setHistoryPairFilter('XAU/USD')}
              >
                🥇 XAU/USD
              </button>
            </div>
            <TradeList
              trades={historyPairFilter === 'All' ? trades : trades.filter(t => t.pair === historyPairFilter)}
              onDeleteTrade={deleteTrade}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
