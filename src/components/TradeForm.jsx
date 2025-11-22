import React, { useState } from 'react';
import './TradeForm.css';

function TradeForm({ onAddTrade }) {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    type: 'BUY',
    result: 'WIN',
    rsi: '',
    comment: '',
    strategy: '',
    tradeType: 'Live'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddTrade({ ...formData, id: Date.now() });
    setFormData(prev => ({
      ...prev,
      rsi: '',
      comment: '',
      strategy: '',
      tradeType: 'Live'
    }));
  };

  return (
    <form className="glass-panel trade-form" onSubmit={handleSubmit}>
      <h2>Log New Trade</h2>

      <div className="form-grid">
        <div className="form-group">
          <label>Date</label>
          <input
            type="date"
            value={formData.date}
            onChange={e => setFormData({ ...formData, date: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label>Type</label>
          <div className="radio-group">
            <label className={`radio-btn ${formData.type === 'BUY' ? 'active buy' : ''}`}>
              <input
                type="radio"
                name="type"
                value="BUY"
                checked={formData.type === 'BUY'}
                onChange={e => setFormData({ ...formData, type: e.target.value })}
              />
              BUY
            </label>
            <label className={`radio-btn ${formData.type === 'SELL' ? 'active sell' : ''}`}>
              <input
                type="radio"
                name="type"
                value="SELL"
                checked={formData.type === 'SELL'}
                onChange={e => setFormData({ ...formData, type: e.target.value })}
              />
              SELL
            </label>
          </div>
        </div>

        <div className="form-group">
          <label>Result</label>
          <div className="radio-group">
            <label className={`radio-btn ${formData.result === 'WIN' ? 'active win' : ''}`}>
              <input
                type="radio"
                name="result"
                value="WIN"
                checked={formData.result === 'WIN'}
                onChange={e => setFormData({ ...formData, result: e.target.value })}
              />
              WIN
            </label>
            <label className={`radio-btn ${formData.result === 'LOSS' ? 'active loss' : ''}`}>
              <input
                type="radio"
                name="result"
                value="LOSS"
                checked={formData.result === 'LOSS'}
                onChange={e => setFormData({ ...formData, result: e.target.value })}
              />
              LOSS
            </label>
          </div>
        </div>

        <div className="form-group">
          <label>RSI Context</label>
          <input
            type="text"
            placeholder="e.g. Overbought, Divergence..."
            value={formData.rsi}
            onChange={e => setFormData({ ...formData, rsi: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label>Strategy</label>
          <input
            type="text"
            placeholder="e.g. RSI Divergence, Breakout..."
            value={formData.strategy}
            onChange={e => setFormData({ ...formData, strategy: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label>Trade Type</label>
          <div className="radio-group">
            <label className={`radio-btn ${formData.tradeType === 'Live' ? 'active' : ''}`}>
              <input
                type="radio"
                name="tradeType"
                value="Live"
                checked={formData.tradeType === 'Live'}
                onChange={e => setFormData({ ...formData, tradeType: e.target.value })}
              />
              Live
            </label>
            <label className={`radio-btn ${formData.tradeType === 'Backtest' ? 'active' : ''}`}>
              <input
                type="radio"
                name="tradeType"
                value="Backtest"
                checked={formData.tradeType === 'Backtest'}
                onChange={e => setFormData({ ...formData, tradeType: e.target.value })}
              />
              Backtest
            </label>
          </div>
        </div>

        <div className="form-group full-width">
          <label>Comments</label>
          <textarea
            rows="3"
            placeholder="Trade analysis..."
            value={formData.comment}
            onChange={e => setFormData({ ...formData, comment: e.target.value })}
          />
        </div>
      </div>

      <button type="submit" className="btn btn-primary full-width">Add Trade</button>
    </form>
  );
}

export default TradeForm;
