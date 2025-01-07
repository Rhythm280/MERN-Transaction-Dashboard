import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TransactionsTable from './components/TransactionsTable';
import Statistics from './components/Statistics';
import BarChart from './components/BarChart';
import PieChart from './components/PieChart';
import './styles/App.css';

function App() {
  const [transactions, setTransactions] = useState([]);
  const [statistics, setStatistics] = useState({});
  const [barChartData, setBarChartData] = useState([]);
  const [pieChartData, setPieChartData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [search, setSearch] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(3); // Default to March

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/transactions?month=${selectedMonth}&search=${search}&page=${currentPage}`);
        setTransactions(response.data.transactions);
        setCurrentPage(response.data.currentPage);
        setTotalPages(response.data.totalPages);
        setTotalCount(response.data.totalCount);
      } catch (error) {
        console.error('Error fetching transactions:', error);
      }
    };

    fetchData();
  }, [selectedMonth, search, currentPage]);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const response = await axios.get(`/statistics?month=${selectedMonth}`);
        setStatistics(response.data);
      } catch (error) {
        console.error('Error fetching statistics:', error);
      }
    };

    fetchStatistics();
  }, [selectedMonth]);

  useEffect(() => {
    const fetchBarChart = async () => {
      try {
        const response = await axios.get(`/bar-chart?month=${selectedMonth}`);
        setBarChartData(response.data);
      } catch (error) {
        console.error('Error fetching bar chart data:', error);
      }
    };

    fetchBarChart();
  }, [selectedMonth]);

  useEffect(() => {
    const fetchPieChart = async () => {
      try {
        const response = await axios.get(`/pie-chart?month=${selectedMonth}`);
        setPieChartData(response.data);
      } catch (error) {
        console.error('Error fetching pie chart data:', error);
      }
    };

    fetchPieChart();
  }, [selectedMonth]);

  const handleMonthChange = (event) => {
    setSelectedMonth(parseInt(event.target.value));
  };

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="container">
      <h1>MERN Stack Challenge</h1>
      <div className="row">
        <div className="col-md-6">
          <select value={selectedMonth} onChange={handleMonthChange}>
            {months.map((month, index) => (
              <option key={index} value={index + 1}>
                {month}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-6">
          <input type="text" value={search} onChange={handleSearchChange} placeholder="Search..." />
        </div>
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
      <PieChart chartData={pieChartData} />
    </div>
  );
}

export default App;