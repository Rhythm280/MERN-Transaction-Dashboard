import axios from 'axios';

const api = {

    getTransactions: async () => {
        const response = await axios.get('/api/transactions');
        return response.data;
    },

    getStatistics: async ({ month }) => {
        const params = { month };
        const response = await axios.get('/api/statistics', { params });
        return response.data;
    },

    getBarChartData: async ({ month }) => {
        const params = { month };
        const response = await axios.get('/api/bar-chart', { params });
        return response.data;
    },
};

export default api;