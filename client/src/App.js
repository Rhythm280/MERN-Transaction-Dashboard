import React, { useState, useEffect } from 'react';
import TransactionsTable from './components/TransactionsTable';
import Statistics from './components/Statistics';
import BarChart from './components/BarChart';
import api from './services/api';

function App() {
  const [transactions, setTransactions] = useState([]);
  const [statistics, setStatistics] = useState({});
  const [barChartData, setBarChartData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedMonth, setSelectedMonth] = useState(3); // Default to March (3)
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await api.getTransactions({
          month: selectedMonth,
          page: currentPage,
          search: searchQuery,
        });
        setTransactions(response.data.transactions);
        setCurrentPage(response.data.pagination.page);
        setTotalPages(response.data.pagination.totalPages);
        setTotalCount(response.data.totalCount);
      } catch (error) {
        console.error('Error fetching transactions:', error);
      }
    };

    const fetchStatistics = async () => {
      try {
        const response = await api.getStatistics({ month: selectedMonth });
        setStatistics(response.data);
      } catch (error) {
        console.error('Error fetching statistics:', error);
      }
    };

    const fetchBarChartData = async () => {
      try {
        const response = await api.getBarChartData({ month: selectedMonth });
        setBarChartData(response.data);
      } catch (error) {
        console.error('Error fetching bar chart data:', error);
      }
    };

    fetchTransactions();
    fetchStatistics();
    fetchBarChartData();
  }, [selectedMonth, currentPage, searchQuery]);

  const handleMonthChange = (event) => {
    setSelectedMonth(parseInt(event.target.value));
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  return (
    <div className="App">
      <h1>Transaction Dashboard</h1>
      <div>
        <label htmlFor="monthSelect">Select Month:</label>
        <select id="monthSelect" value={selectedMonth} onChange={handleMonthChange}>
          <option value={1}>January</option>
          <option value={2}>February</option>
          <option value={3}>March</option>
          {/* ... other months */}
        </select>
      </div>
      <div>
        <input 
          type="text" 
          placeholder="Search Transactions" 
          value={searchQuery} 
          onChange={handleSearchChange} 
        />
      </div>
      <TransactionsTable 
        transactions={transactions} 
        currentPage={currentPage} 
        totalPages={totalPages} 
        totalCount={totalCount} 
        onPageChange={handlePageChange} 
      />
      <Statistics statistics={statistics} />
      <BarChart chartData={barChartData} /> 
    </div>
  );
}

export default App;