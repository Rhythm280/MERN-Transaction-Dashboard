import React, { useRef, useEffect } from 'react';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const BarChart = ({ chartData }) => {
    const chartRef = useRef(null);

    useEffect(() => {
        if (chartRef.current) {
            const oldChartInstance = chartRef.current.getContext('2d').chart;
            if (oldChartInstance) {
                oldChartInstance.destroy();
            }
        }

        if (chartData && chartData.length > 0) {
            const labels = chartData.map((range) => `${range._id[0]}-${range._id[1]}`);
            const data = chartData.map((range) => range.count);

            const chartInstance = new ChartJS(chartRef.current, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [
                        {
                            label: 'Number of Items',
                            data: data,
                            backgroundColor: 'rgba(75, 192, 192, 0.6)',
                        },
                    ],
                },
                options: {
                    scales: {
                        x: {
                            type: 'category', // Use CategoryScale for labels
                        },
                        y: {
                            type: 'linear', // Use LinearScale for the y-axis (if needed)
                        },
                    },
                },
            });
        }
    }, [chartData]);

    return (
        <div>
            <h2>Price Range Distribution</h2>
            <canvas ref={chartRef} />
        </div>
    );
};

export default BarChart;