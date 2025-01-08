import React from 'react';

const Statistics = ({ statistics }) => {
    return (
        <div>
            <h2>Statistics</h2>
            <p>Total Sales: ${statistics.totalSale ? statistics.totalSale.toFixed(2) : 'N/A'}</p>
            <p>Total Sold Items: {statistics.totalSold}</p>
            <p>Total Not Sold Items: {statistics.totalNotSold}</p>
        </div>
    );
};

export default Statistics;