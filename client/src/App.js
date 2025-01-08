import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; 
import TransactionsTable from './components/TransactionsTable';
import Statistics from './components/Statistics';
import BarChart from './components/BarChart';
import './styles/App.css';
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
    const fetchData = async () => {
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

        const [statisticsResponse, barChartResponse] = await Promise.all([
          api.getStatistics({ month: selectedMonth }),
          api.getBarChartData({ month: selectedMonth }),
        ]);

        setStatistics(statisticsResponse.data);
        setBarChartData(barChartResponse.data);

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
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
    <Router>
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
    </Router>
  );
}

export default App;