import React, { useRef, useEffect } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = ({ chartData }) => {
    const chartRef = useRef(null);

    useEffect(() => {
        if (chartRef.current) {
            const oldChartInstance = chartRef.current.getContext('2d').chart;
            if (oldChartInstance) {
                oldChartInstance.destroy();
            }
        }

        if (chartData && chartData.length > 0) {
            new ChartJS(chartRef.current, {
                type: 'pie',
                data: {
                    labels: chartData.map((category) => category._id),
                    datasets: [
                        {
                            data: chartData.map((category) => category.count),
                            backgroundColor: [
                                'rgba(255, 99, 132, 0.6)',
                                'rgba(54, 162, 235, 0.6)',
                                'rgba(255, 206, 86, 0.6)',
                                'rgba(75, 192, 192, 0.6)',
                                'rgba(153, 102, 255, 0.6)',
                                'rgba(255, 159, 64, 0.6)',
                            ],
                        },
                    ],
                },
            });
        }
    }, [chartData]);

    return (
        <div>
            <h2>Category Distribution</h2>
            <canvas ref={chartRef} />
        </div>
    );
};

export default PieChart;