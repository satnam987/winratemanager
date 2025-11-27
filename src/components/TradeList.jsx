import React from 'react';
import './TradeList.css';

function TradeList({ trades, onDeleteTrade }) {
    if (trades.length === 0) {
        return (
            <div className="glass-panel empty-state">
                <p>No trades logged yet. Start by adding one above!</p>
            </div>
        );
    }

    return (
        <div className="glass-panel trade-list-container">
            <h3>Trade History</h3>
            <div className="table-responsive">
                <table className="trade-table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Type</th>
                            <th>Result</th>
                            <th>RSI Context</th>
                            <th>Strategy</th>
                            <th>Trade Type</th>
                            <th>Pair</th>
                            <th>Comments</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {trades.map(trade => (
                            <tr key={trade.id} className={`trade-row ${trade.result.toLowerCase()}`}>
                                <td>{new Date(trade.date).toLocaleDateString()}</td>
                                <td>
                                    <span className={`badge ${trade.type.toLowerCase()}`}>
                                        {trade.type}
                                    </span>
                                </td>
                                <td>
                                    <span className={`badge ${trade.result.toLowerCase()}`}>
                                        {trade.result}
                                    </span>
                                </td>
                                <td className="text-secondary">{trade.rsi}</td>
                                <td className="text-secondary">{trade.strategy}</td>
                                <td className="text-secondary">{trade.tradeType}</td>
                                <td>
                                    <span className="badge pair">
                                        {trade.pair || 'S&P500'}
                                    </span>
                                </td>
                                <td className="comment-cell">{trade.comment}</td>
                                <td>
                                    <button
                                        className="btn-icon delete"
                                        onClick={() => onDeleteTrade(trade.id)}
                                        title="Delete Trade"
                                    >
                                        ×
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default TradeList;
