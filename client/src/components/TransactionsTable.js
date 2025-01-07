import React from 'react';

const TransactionsTable = ({ transactions, currentPage, totalPages, totalCount, onPageChange }) => {
    return (
        <div>
            <h2>Transactions</h2>
            <table>
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Description</th>
                        <th>Price</th>
                        <th>Date of Sale</th>
                    </tr>
                </thead>
                <tbody>
                    {transactions.map((transaction) => (
                        <tr key={transaction._id}>
                            <td>{transaction.title}</td>
                            <td>{transaction.description}</td>
                            <td>${transaction.price}</td>
                            <td>{new Date(transaction.dateOfSale).toLocaleDateString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="pagination">
                <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}>Previous</button>
                <span>{currentPage} of {totalPages}</span>
                <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages}>Next</button>
            </div>
            <p>Total Transactions: {totalCount}</p>
        </div>
    );
};

export default TransactionsTable;