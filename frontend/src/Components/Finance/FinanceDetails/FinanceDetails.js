
import React, { useState, useEffect } from 'react';
import Nav from '../Nav/Nav';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf'; // Import jsPDF
import 'jspdf-autotable'; // Import for table auto-formatting
import './FD.css';

const financeURL = "http://localhost:5000/finance";
const salaryURL = "http://localhost:5000/salaries"; // URL for salary data
const stockURL = "http://localhost:5000/stocks"; // URL for stock data

// Fetch handler with improved error handling
const fetchFinanceData = async () => {
  try {
    const response = await axios.get(financeURL);
    console.log("Finance API Response", response.data);
    return response.data || { finance: [] }; // Ensure a valid structure
  } catch (error) {
    console.error("Error fetching finance data:", error);
    return { finance: [] }; // Return an empty structure in case of an error
  }
};

const fetchSalaryData = async () => {
  try {
    const response = await axios.get(salaryURL);
    console.log("Salary API Response", response.data);
    return response.data || { salaries: [] }; // Ensure a valid structure
  } catch (error) {
    console.error("Error fetching salary data:", error);
    return { salaries: [] }; // Return an empty structure in case of an error
  }
};

const fetchStockData = async () => {
  try {
    const response = await axios.get(stockURL);
    console.log("Stock API Response", response.data);
    return response.data || { stocks: [] }; // Ensure a valid structure
  } catch (error) {
    console.error("Error fetching stock data:", error);
    return { stocks: [] }; // Return an empty structure in case of an error
  }
};

function FinanceDetails() {
  const [finance, setFinance] = useState([]);
  const [salaries, setSalaries] = useState([]); // State to store salary data
  const [stocks, setStocks] = useState([]); // State to store stock data
  const [searchTerm, setSearchTerm] = useState(''); // State to store search input
  const navigate = useNavigate();

  useEffect(() => {
    const getFinanceData = async () => {
      const financeData = await fetchFinanceData();
      if (financeData.finance && Array.isArray(financeData.finance)) {
        setFinance(financeData.finance);
      } else {
        setFinance([]);
      }
    };

    const getSalaryData = async () => {
      const salaryData = await fetchSalaryData();
      if (salaryData.salaries && Array.isArray(salaryData.salaries)) {
        setSalaries(salaryData.salaries);
      } else {
        setSalaries([]);
      }
    };

    const getStockData = async () => {
      const stockData = await fetchStockData();
      if (stockData.stocks && Array.isArray(stockData.stocks)) {
        setStocks(stockData.stocks);
      } else {
        setStocks([]);
      }
    };

    getFinanceData();
    getSalaryData();
    getStockData();
  }, []);

  const deleteFinanceHandler1 = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/finance/${id}`);
      setFinance(finance.filter(item => item._id !== id));
    } catch (error) {
      console.error("Error deleting finance record:", error);
    }
  };

  const deleteSalaryHandler2 = async (nic) => {
    try {
      await axios.delete(`http://localhost:5000/salaries/${nic}`);
      setSalaries(salaries.filter(item => item.employeeNIC !== nic));
    } catch (error) {
      console.error("Error deleting salary record:", error);
    }
  };

  const filteredFinance = finance.filter(item => item.transactionType === 'Expense');
  const totalFinanceAmount = filteredFinance.reduce((sum, item) => sum + item.amount, 0);
  const totalSalaryAmount = salaries.reduce((sum, salary) => sum + salary.totalSalary, 0);
  const totalStockAmount = stocks.reduce((sum, stock) => sum + stock.totalPrice, 0);
  const totalAmount = totalFinanceAmount + totalSalaryAmount + totalStockAmount;

  const combinedData = [
    ...filteredFinance,
    ...salaries.map(salary => ({
      _id: salary.employeeNIC,
      date: salary.payDate,
      transactionType: 'Salary Payment',
      category: 'Salary',
      amount: salary.totalSalary
    })),
    ...stocks.map(stock => ({
      _id: stock.stockID,
      date: stock.EXD,
      transactionType: 'Perches Item',
      category: stock.type,
      amount: stock.totalPrice
    }))
  ];

  const filteredSearchResults = combinedData.filter(item =>
    item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.transactionType.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.date.includes(searchTerm)
  );

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text("Finance Report", 14, 16);
    doc.autoTable({
      startY: 20,
      head: [['ID', 'Date', 'Type', 'Category', 'Amount']],
      body: filteredSearchResults.map(item => [
        item._id,
        new Date(item.date).toLocaleDateString('en-CA'),
        item.transactionType,
        item.category,
        item.amount
      ])
    });
    doc.setFontSize(11); 
    doc.text(`Total Finance Amount: Rs. ${totalFinanceAmount}`, 14, doc.autoTable.previous.finalY + 10);
    doc.text(`Total Salary Amount: Rs. ${totalSalaryAmount}`, 14, doc.autoTable.previous.finalY + 20);
    doc.text(`Total Stock Amount: Rs. ${totalStockAmount}`, 14, doc.autoTable.previous.finalY + 30);
    doc.text(`Total Amount: Rs. ${totalAmount}`, 14, doc.autoTable.previous.finalY + 40);
    doc.save('finance-report.pdf');
  };

  return (
    <div>
      <Nav />
      <center><h1 className="I-h1">Finance Details</h1></center>
      
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by category, type, or date..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <div className="I-table-wrapper">
        <table className="fl-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Date</th>
              <th>Type</th>
              <th>Category</th>
              <th>Amount</th>
              <th>Update Details</th>
              <th>Delete Details</th>
            </tr>
          </thead>
          <tbody>
            {filteredSearchResults.length > 0 ? (
              filteredSearchResults.map((item) => (
                <tr key={item._id}>
                  <td>{item._id}</td>
                  <td>{new Date(item.date).toLocaleDateString('en-CA')}</td>
                  <td>{item.transactionType}</td>
                  <td>{item.category}</td>
                  <td style={{ textAlign: 'Right' }}>Rs. {item.amount}</td>
                  <td>
                    {item.transactionType !== 'Perches Item' && item.transactionType !== 'Salary Payment' && (
                      <Link to={`/updatefinance/${item._id}`}>
                        <button className="I-but_up">Update</button>
                      </Link>
                    )}
                  </td>
                  <td>
                    {item.transactionType !== 'Perches Item' && item.transactionType !== 'Salary Payment' && (
                      <button className="I-but" onClick={() => deleteFinanceHandler1(item._id)}>Delete</button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center' }}>No records found</td>
              </tr>
            )}
            <tr>
              <td></td>
              <td></td>
              <td></td>
              <td style={{ textAlign: 'left', }}><strong>Total Finance Amount:</strong></td>
              <td style={{ textAlign: 'right' }}><strong>Rs. {totalFinanceAmount}</strong></td>
            </tr>
            <tr>
              <td></td>
              <td></td>
              <td></td>
              <td style={{ textAlign: 'left'  }}><strong>Total Salary Amount:</strong></td>
              <td style={{ textAlign: 'right' }}><strong>Rs. {totalSalaryAmount}</strong></td>
              
            </tr>
            <tr>
              <td></td>
              <td></td>
              <td></td>
              <td style={{ textAlign: 'left' }}><strong>Total Stock Amount:</strong></td>
              <td style={{ textAlign: 'right' }}><strong>Rs. {totalStockAmount}</strong></td>
              
            </tr>
            <tr>
              <td></td>
              <td></td>
              <td></td>
              <td  style={{ textAlign: 'left' }}><strong>Total Amount:</strong></td>
              <td style={{ textAlign: 'right' }}><strong>Rs. {totalAmount}</strong></td>
            </tr>
          </tbody>
        </table>
        <center>
          <button className="I-but" onClick={generatePDF}>Generate Report</button>
        </center>
        
      </div>
    </div>
  );
}

export default FinanceDetails;
