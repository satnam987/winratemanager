import React, { useMemo } from 'react';
import {
    LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import './Charts.css';

const COLORS = {
    green: '#00ff9d',
    red: '#ff4d4d',
    blue: '#00d2ff',
    purple: '#9d00ff',
    yellow: '#ffcc00'
};

function Charts({ trades }) {
    // Calculate Win Rate Over Time (cumulative)
    const winRateOverTime = useMemo(() => {
        if (trades.length === 0) return [];

        const sorted = [...trades].sort((a, b) => new Date(a.date) - new Date(b.date));
        let wins = 0;
        let total = 0;

        return sorted.map(trade => {
            total++;
            if (trade.result === 'WIN') wins++;
            return {
                date: new Date(trade.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                winRate: Math.round((wins / total) * 100)
            };
        });
    }, [trades]);

    // Buy vs Sell Performance
    const buyVsSell = useMemo(() => {
        const buyTrades = trades.filter(t => t.type === 'BUY');
        const sellTrades = trades.filter(t => t.type === 'SELL');

        const buyWins = buyTrades.filter(t => t.result === 'WIN').length;
        const sellWins = sellTrades.filter(t => t.result === 'WIN').length;

        return [
            {
                type: 'BUY',
                winRate: buyTrades.length > 0 ? Math.round((buyWins / buyTrades.length) * 100) : 0,
                total: buyTrades.length
            },
            {
                type: 'SELL',
                winRate: sellTrades.length > 0 ? Math.round((sellWins / sellTrades.length) * 100) : 0,
                total: sellTrades.length
            }
        ];
    }, [trades]);

    // Strategy Breakdown
    const strategyData = useMemo(() => {
        const strategyMap = {};

        trades.forEach(trade => {
            const strategy = trade.strategy || 'No Strategy';
            if (!strategyMap[strategy]) {
                strategyMap[strategy] = { wins: 0, losses: 0 };
            }
            if (trade.result === 'WIN') {
                strategyMap[strategy].wins++;
            } else {
                strategyMap[strategy].losses++;
            }
        });

        return Object.keys(strategyMap).map(strategy => ({
            name: strategy,
            wins: strategyMap[strategy].wins,
            losses: strategyMap[strategy].losses,
            winRate: Math.round((strategyMap[strategy].wins /
                (strategyMap[strategy].wins + strategyMap[strategy].losses)) * 100)
        }));
    }, [trades]);

    // RSI Context Distribution
    const rsiData = useMemo(() => {
        const rsiMap = {};

        trades.forEach(trade => {
            const rsi = trade.rsi || 'No RSI Data';
            if (!rsiMap[rsi]) {
                rsiMap[rsi] = { wins: 0, losses: 0 };
            }
            if (trade.result === 'WIN') {
                rsiMap[rsi].wins++;
            } else {
                rsiMap[rsi].losses++;
            }
        });

        return Object.keys(rsiMap).map(rsi => ({
            name: rsi,
            wins: rsiMap[rsi].wins,
            losses: rsiMap[rsi].losses
        }));
    }, [trades]);

    // Pair Performance
    const pairData = useMemo(() => {
        const pairMap = {};

        trades.forEach(trade => {
            const pair = trade.pair || 'NQ';
            if (!pairMap[pair]) {
                pairMap[pair] = { wins: 0, losses: 0 };
            }
            if (trade.result === 'WIN') {
                pairMap[pair].wins++;
            } else if (trade.result === 'LOSS') {
                pairMap[pair].losses++;
            }
        });

        return Object.keys(pairMap).map(pair => ({
            pair,
            wins: pairMap[pair].wins,
            losses: pairMap[pair].losses,
            winRate: Math.round((pairMap[pair].wins /
                (pairMap[pair].wins + pairMap[pair].losses)) * 100)
        }));
    }, [trades]);

    if (trades.length === 0) {
        return (
            <div className="glass-panel charts-container">
                <h2>Analytics</h2>
                <p className="empty-message">Add some trades to see analytics!</p>
            </div>
        );
    }

    return (
        <div className="charts-container">
            <h2 style={{ marginBottom: '2rem', textAlign: 'center' }}>📊 Analytics</h2>

            <div className="charts-grid">
                {/* Win Rate Over Time */}
                <div className="glass-panel chart-card">
                    <h3>Win Rate Over Time</h3>
                    <ResponsiveContainer width="100%" height={400}>
                        <LineChart data={winRateOverTime}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                            <XAxis dataKey="date" stroke="#a0a0a0" />
                            <YAxis stroke="#a0a0a0" domain={[0, 100]} />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }}
                                labelStyle={{ color: '#fff' }}
                            />
                            <Line
                                type="monotone"
                                dataKey="winRate"
                                stroke={COLORS.blue}
                                strokeWidth={3}
                                dot={{ fill: COLORS.blue, r: 4 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Buy vs Sell */}
                <div className="glass-panel chart-card">
                    <h3>Buy vs Sell Performance</h3>
                    <ResponsiveContainer width="100%" height={400}>
                        <BarChart data={buyVsSell}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                            <XAxis dataKey="type" stroke="#a0a0a0" />
                            <YAxis stroke="#a0a0a0" domain={[0, 100]} />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }}
                                labelStyle={{ color: '#fff' }}
                            />
                            <Bar dataKey="winRate" fill={COLORS.green} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Strategy Breakdown */}
                <div className="glass-panel chart-card">
                    <h3>Strategy Win Rate</h3>
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={strategyData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                            <XAxis dataKey="name" stroke="#a0a0a0" />
                            <YAxis stroke="#a0a0a0" />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }}
                                labelStyle={{ color: '#fff' }}
                            />
                            <Legend />
                            <Bar dataKey="wins" fill={COLORS.green} />
                            <Bar dataKey="losses" fill={COLORS.red} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Pair Performance */}
                <div className="glass-panel chart-card">
                    <h3>Trading Pair Performance</h3>
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={pairData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                            <XAxis dataKey="pair" stroke="#a0a0a0" />
                            <YAxis stroke="#a0a0a0" />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }}
                                labelStyle={{ color: '#fff' }}
                            />
                            <Legend />
                            <Bar dataKey="wins" fill={COLORS.green} />
                            <Bar dataKey="losses" fill={COLORS.red} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* RSI Context */}
                <div className="glass-panel chart-card">
                    <h3>RSI Context Performance</h3>
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={rsiData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                            <XAxis dataKey="name" stroke="#a0a0a0" />
                            <YAxis stroke="#a0a0a0" />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }}
                                labelStyle={{ color: '#fff' }}
                            />
                            <Legend />
                            <Bar dataKey="wins" fill={COLORS.green} />
                            <Bar dataKey="losses" fill={COLORS.red} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}

export default Charts;
