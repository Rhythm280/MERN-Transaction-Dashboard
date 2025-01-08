import React from 'react';

const Statistics = ({ statistics }) => {
    return (
        <div>
            <h2>Statistics</h2>
            {statistics && statistics.totalSale !== undefined ? (
                <>
                    <p>Total Sales: ${statistics.totalSale.toFixed(2)}</p>
                    <p>Total Transactions: {statistics.totalSold}</p>
                </>
            ) : (
                <p>No statistics available.</p>
            )}
        </div>
    );
};

export default Statistics;