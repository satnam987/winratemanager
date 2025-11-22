import React from 'react';
import './Dashboard.css';

function Dashboard({ trades }) {
    const totalTrades = trades.length;
    const wins = trades.filter(t => t.result === 'WIN').length;
    const losses = trades.filter(t => t.result === 'LOSS').length;
    const winRate = totalTrades > 0 ? Math.round((wins / totalTrades) * 100) : 0;

    return (
        <div className="dashboard-grid">
            <div className="glass-panel stat-card main-stat">
                <h3>Win Rate</h3>
                <div className="win-rate-display">
                    <span className={`rate-value ${winRate >= 50 ? 'good' : 'bad'}`}>
                        {winRate}%
                    </span>
                </div>
            </div>

            <div className="glass-panel stat-card">
                <h3>Total Trades</h3>
                <p className="stat-value">{totalTrades}</p>
            </div>

            <div className="glass-panel stat-card">
                <h3>Wins</h3>
                <p className="stat-value text-green">{wins}</p>
            </div>

            <div className="glass-panel stat-card">
                <h3>Losses</h3>
                <p className="stat-value text-red">{losses}</p>
            </div>
        </div>
    );
}

export default Dashboard;
