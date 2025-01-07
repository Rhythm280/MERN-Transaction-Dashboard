import React from 'react';
import { Bar } from 'react-chartjs-2';

const BarChart = ({ chartData }) => {
    const data = {
        labels: chartData.map((range) => `${range._id[0]}-${range._id[1]}`),
        datasets: [
            {
                label: 'Number of Items',
                data: chartData.map((range) => range.count),
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
            },
        ],
    };

    return (
        <div>
            <h2>Price Range Distribution</h2>
            <Bar data={data} />
        </div>
    );
};

export default BarChart;