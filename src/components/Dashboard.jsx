import React, { useState } from 'react';
import './Dashboard.css';

function Dashboard({ trades }) {
    const [filter, setFilter] = useState('Live');
    const [pairFilter, setPairFilter] = useState('All');

    const typeFilteredTrades = trades.filter(t => t.tradeType === filter);

    const filteredTrades = pairFilter === 'All'
        ? typeFilteredTrades
        : typeFilteredTrades.filter(t => t.pair === pairFilter);

    const actualTrades = filteredTrades.filter(t => t.result !== 'NO ENTRY');
    const noEntries = filteredTrades.filter(t => t.result === 'NO ENTRY').length;

    const totalTrades = actualTrades.length;
    const wins = actualTrades.filter(t => t.result === 'WIN').length;
    const losses = actualTrades.filter(t => t.result === 'LOSS').length;
    const winRate = totalTrades > 0 ? Math.round((wins / totalTrades) * 100) : 0;

    const calculateStreaks = () => {
        if (actualTrades.length === 0) {
            return {
                currentStreak: 0,
                bestStreak: 0,
                currentStreakDates: null,
                bestStreakDates: null
            };
        }

        const sortedTrades = [...actualTrades].sort((a, b) => new Date(b.date) - new Date(a.date));

        let currentStreak = 0;
        let currentStreakStart = null;
        let currentStreakEnd = null;

        let bestStreak = 0;
        let bestStreakStart = null;
        let bestStreakEnd = null;

        let tempStreak = 0;
        let tempStart = null;
        let tempEnd = null;

        for (let i = 0; i < sortedTrades.length; i++) {
            if (sortedTrades[i].result === 'WIN') {
                if (currentStreak === 0) {
                    currentStreakEnd = sortedTrades[i].date;
                }
                currentStreak++;
                currentStreakStart = sortedTrades[i].date;
            } else {
                break;
            }
        }

        for (let i = 0; i < sortedTrades.length; i++) {
            if (sortedTrades[i].result === 'WIN') {
                if (tempStreak === 0) {
                    tempEnd = sortedTrades[i].date;
                }
                tempStreak++;
                tempStart = sortedTrades[i].date;

                if (tempStreak > bestStreak) {
                    bestStreak = tempStreak;
                    bestStreakStart = tempStart;
                    bestStreakEnd = tempEnd;
                }
            } else {
                tempStreak = 0;
                tempStart = null;
                tempEnd = null;
            }
        }

        return {
            currentStreak,
            bestStreak,
            currentStreakDates: currentStreak > 0 ? {
                start: currentStreakStart,
                end: currentStreakEnd
            } : null,
            bestStreakDates: bestStreak > 0 ? {
                start: bestStreakStart,
                end: bestStreakEnd
            } : null
        };
    };

    const streaks = calculateStreaks();

    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleDateString('nl-NL', { day: '2-digit', month: '2-digit' });
    };

    return (
        <div className="dashboard">
            <div className="trade-type-filter glass-panel">
                <button
                    className={`filter-btn ${filter === 'Live' ? 'active' : ''}`}
                    onClick={() => setFilter('Live')}
                >
                    🟢 Live Trades
                </button>
                <button
                    className={`filter-btn ${filter === 'Backtest' ? 'active' : ''}`}
                    onClick={() => setFilter('Backtest')}
                    <div className="stat-value win-rate">{winRate}%</div>
                </div>

                <div className="stat-card">
                    <div className="stat-label">Total Trades</div>
                    <div className="stat-value">{totalTrades}</div>
                </div>

                <div className="stat-card">
                    <div className="stat-label">Wins</div>
                    <div className="stat-value wins">{wins}</div>
                </div>

                <div className="stat-card">
                    <div className="stat-label">Losses</div>
                    <div className="stat-value losses">{losses}</div>
                </div>

                <div className="stat-card">
                    <div className="stat-label">No Entry</div>
                    <div className="stat-value no-entry">{noEntries}</div>
                </div>
            </div>

            <div className="streak-card glass-panel">
                <h3>🔥 Winstreaks</h3>
                <div className="streak-grid">
                    <div className="streak-item">
                        <div className="streak-label">Huidige Streak</div>
                        <div className="streak-value current">{streaks.currentStreak}</div>
                        {streaks.currentStreakDates && (
                            <div className="streak-dates">
                                {formatDate(streaks.currentStreakDates.start)} - {formatDate(streaks.currentStreakDates.end)}
                            </div>
                        )}
                    </div>

                    <div className="streak-divider"></div>

                    <div className="streak-item">
                        <div className="streak-label">Beste Streak</div>
                        <div className="streak-value best">{streaks.bestStreak}</div>
                        {streaks.bestStreakDates && (
                            <div className="streak-dates">
                                {formatDate(streaks.bestStreakDates.start)} - {formatDate(streaks.bestStreakDates.end)}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div >
    );
}

export default Dashboard;
