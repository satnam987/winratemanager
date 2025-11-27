import React, { useState, useMemo } from 'react';
import './TradeForm.css';

function TradeForm({ onAddTrade }) {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    type: 'BUY',
    result: 'WIN',
    rsi: '',
    comment: '',
    strategy: '',
    tradeType: 'Live',
    pair: 'S&P500',
    rsiTimeframes: {
      '15min': { context: null, direction: null, rsi1530: '' },
      '30min': { context: null, direction: null, rsi1530: '' },
      '45min': { context: null, direction: null, rsi1530: '' },
      '1h': { context: null, direction: null, rsi1530: '' },
      '2h': { context: null, direction: null, rsi1530: '' }
    }
  });

  // Calculate counts of equal and unequal
  const rsiCounts = useMemo(() => {
    const counts = { gelijk: 0, ongelijk: 0 };
    Object.values(formData.rsiTimeframes).forEach(tf => {
      if (tf.context === 'gelijk') counts.gelijk++;
      else if (tf.context === 'ongelijk') counts.ongelijk++;
    });
    return counts;
  }, [formData.rsiTimeframes]);

  const handleRsiContextChange = (timeframe, value) => {
    setFormData(prev => ({
      ...prev,
      rsiTimeframes: {
        ...prev.rsiTimeframes,
        [timeframe]: {
          ...prev.rsiTimeframes[timeframe],
          context: prev.rsiTimeframes[timeframe].context === value ? null : value
        }
      }
    }));
  };

  const handleRsiDirectionChange = (timeframe, value) => {
    setFormData(prev => ({
      ...prev,
      rsiTimeframes: {
        ...prev.rsiTimeframes,
        [timeframe]: {
          ...prev.rsiTimeframes[timeframe],
          direction: prev.rsiTimeframes[timeframe].direction === value ? null : value
        }
      }
    }));
  };

  const handleRsi1530Change = (timeframe, value) => {
    setFormData(prev => ({
      ...prev,
      rsiTimeframes: {
        ...prev.rsiTimeframes,
        [timeframe]: {
          ...prev.rsiTimeframes[timeframe],
          rsi1530: value
        }
      }
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddTrade({ ...formData, id: Date.now() });
    setFormData(prev => ({
      ...prev,
      rsi: '',
      comment: '',
      strategy: '',
      tradeType: 'Live',
      pair: 'S&P500',
      rsiTimeframes: {
        '15min': { context: null, direction: null, rsi1530: '' },
        '30min': { context: null, direction: null, rsi1530: '' },
        '45min': { context: null, direction: null, rsi1530: '' },
        '1h': { context: null, direction: null, rsi1530: '' },
        '2h': { context: null, direction: null, rsi1530: '' }
      }
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
            <label className={`radio-btn ${formData.result === 'NO ENTRY' ? 'active no-entry' : ''}`}>
              <input
                type="radio"
                name="result"
                value="NO ENTRY"
                checked={formData.result === 'NO ENTRY'}
                onChange={e => setFormData({ ...formData, result: e.target.value })}
              />
              NO ENTRY
            </label>
          </div>
        </div>

        <div className="form-group full-width">
          <label>RSI Context (Multi-Timeframe)</label>
          <div className="rsi-timeframes-container">
            {/* Counters */}
            <div className="rsi-counters">
              <div className="rsi-counter gelijk">
                <span className="counter-label">✓ Gelijk:</span>
                <span className="counter-value">{rsiCounts.gelijk}</span>
              </div>
              <div className="rsi-counter ongelijk">
                <span className="counter-label">✗ Ongelijk:</span>
                <span className="counter-value">{rsiCounts.ongelijk}</span>
              </div>
            </div>

            {/* Timeframe Buttons */}
            <div className="rsi-timeframes-grid">
              {['15min', '30min', '45min', '1h', '2h'].map(timeframe => (
                <div key={timeframe} className="rsi-timeframe-item">
                  <div className="timeframe-header">
                    <span className="timeframe-label">{timeframe}</span>
                    <input
                      type="text"
                      placeholder="RSI 15:30"
                      className="rsi-1530-input"
                      value={formData.rsiTimeframes[timeframe].rsi1530}
                      onChange={(e) => handleRsi1530Change(timeframe, e.target.value)}
                    />
                  </div>

                  <div className="rsi-controls">
                    {/* Gelijk/Ongelijk Buttons */}
                    <div className="rsi-btn-group">
                      <button
                        type="button"
                        className={`rsi-btn gelijk ${formData.rsiTimeframes[timeframe].context === 'gelijk' ? 'active' : ''}`}
                        onClick={() => handleRsiContextChange(timeframe, 'gelijk')}
                      >
                        Gelijk
                      </button>
                      <button
                        type="button"
                        className={`rsi-btn ongelijk ${formData.rsiTimeframes[timeframe].context === 'ongelijk' ? 'active' : ''}`}
                        onClick={() => handleRsiContextChange(timeframe, 'ongelijk')}
                      >
                        Ongelijk
                      </button>
                    </div>

                    {/* Buy/Sell Buttons */}
                    <div className="rsi-btn-group">
                      <button
                        type="button"
                        className={`rsi-btn buy ${formData.rsiTimeframes[timeframe].direction === 'buy' ? 'active' : ''}`}
                        onClick={() => handleRsiDirectionChange(timeframe, 'buy')}
                      >
                        Buy
                      </button>
                      <button
                        type="button"
                        className={`rsi-btn sell ${formData.rsiTimeframes[timeframe].direction === 'sell' ? 'active' : ''}`}
                        onClick={() => handleRsiDirectionChange(timeframe, 'sell')}
                      >
                        Sell
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
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
            <label className={`radio-btn ${formData.tradeType === 'Live' ? 'active live' : ''}`}>
              <input
                type="radio"
                name="tradeType"
                value="Live"
                checked={formData.tradeType === 'Live'}
                onChange={e => setFormData({ ...formData, tradeType: e.target.value })}
              />
              🟢 Live
            </label>
            <label className={`radio-btn ${formData.tradeType === 'Backtest' ? 'active backtest' : ''}`}>
              <input
                type="radio"
                name="tradeType"
                value="Backtest"
                checked={formData.tradeType === 'Backtest'}
                onChange={e => setFormData({ ...formData, tradeType: e.target.value })}
              />
              🔬 Backtest
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

      {/* RSI Quick Copy Helper */}
      <div className="rsi-helper-panel">
        <h3>📋 RSI Teksten (Kopieer & Plak)</h3>
        <div className="rsi-helper-grid">
          <div className="rsi-helper-item">
            <span className="rsi-label">BUY OVERBOUGHT:</span>
            <input
              type="text"
              readOnly
              value="MONDJE WAS OPEN NAAR BUY, RSI OVERBOUGHT"
              onClick={(e) => e.target.select()}
            />
          </div>
          <div className="rsi-helper-item">
            <span className="rsi-label">SELL OVERBOUGHT:</span>
            <input
              type="text"
              readOnly
              value="MONDJE OPEN NAAR SELL, RSI OVERBOUGHT"
              onClick={(e) => e.target.select()}
            />
          </div>
          <div className="rsi-helper-item">
            <span className="rsi-label">BUY OVERSOLD:</span>
            <input
              type="text"
              readOnly
              value="MONDJE WAS OPEN NAAR BUY, RSI OVERSOLD"
              onClick={(e) => e.target.select()}
            />
          </div>
          <div className="rsi-helper-item">
            <span className="rsi-label">SELL OVERSOLD:</span>
            <input
              type="text"
              readOnly
              value="MONDJE OPEN NAAR SELL, RSI OVERSOLD"
              onClick={(e) => e.target.select()}
            />
          </div>
        </div>
      </div>
    </form>
  );
}

export default TradeForm;
