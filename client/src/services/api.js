import axios from 'axios';

const api = {
    getTransactions: async ({ month, page, search }) => {
        const params = { month, page, search };
        const response = await axios.get('/api/transactions', { params });
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