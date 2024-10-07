import React, { useState, useEffect } from 'react';
import Nav from '../Nav/Nav';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import './FD.css';

const financeURL = "http://localhost:5000/finance";
const salaryURL = "http://localhost:5000/employees";
const stockURL = "http://localhost:5000/stocks";

const fetchFinanceData = async () => {
  try {
    const response = await axios.get(financeURL);
    return response.data || { finance: [] };
  } catch (error) {
    console.error("Error fetching finance data:", error);
    return { finance: [] };
  }
};

const fetchSalaryData = async () => {
  try {
    const response = await axios.get(salaryURL);
    return response.data || { employees: [] };
  } catch (error) {
    console.error("Error fetching salary data:", error);
    return { employees: [] };
  }
};

const fetchStockData = async () => {
  try {
    const response = await axios.get(stockURL);
    return response.data || { stocks: [] };
  } catch (error) {
    console.error("Error fetching stock data:", error);
    return { stocks: [] };
  }
};

function FinanceDetails() {
  const [finance, setFinance] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [stocks, setStocks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const getFinanceData = async () => {
      const financeData = await fetchFinanceData();
      setFinance(financeData.finance || []);
    };

    const getSalaryData = async () => {
      const salaryData = await fetchSalaryData();
      setEmployees(salaryData.employees || []);
    };

    const getStockData = async () => {
      const stockData = await fetchStockData();
      setStocks(stockData.stocks || []);
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

  const deleteEmployeeHandler = async (nic) => {
    try {
      await axios.delete(`http://localhost:5000/employees/${nic}`);
      setEmployees(employees.filter(item => item.NIC !== nic));
    } catch (error) {
      console.error("Error deleting employee record:", error);
    }
  };

  const totalSalaryAmount = employees.reduce((sum, employee) => sum + employee.NetSalary, 0);
  const totalStockAmount = stocks.reduce((sum, stock) => sum + stock.totalPrice, 0);

  const combinedData = [
    ...finance,
    ...employees.map(employee => ({
      _id: employee.NIC,
      date: 'n/a',
      transactionType: 'Salary Payment',
      category: 'Salary',
      amount: employee.NetSalary
    })),
    ...stocks.map(stock => ({
      _id: stock.stockID,
      date: stock.EXD,
      transactionType: 'Purchase Item',
      category: stock.type,
      amount: stock.totalPrice
    }))
  ];

  const filteredSearchResults = combinedData.filter(item =>
    item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.transactionType.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.date.includes(searchTerm)
  );

  // Calculate total amount and total by category
  const totalAmount = filteredSearchResults.reduce((sum, item) => sum + item.amount, 0);
  
  // Calculate total by category
  const totalByCategory = {};
  filteredSearchResults.forEach(item => {
    if (!totalByCategory[item.category]) {
      totalByCategory[item.category] = 0;
    }
    totalByCategory[item.category] += item.amount;
  });

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text("Finance Report", 14, 16);
    doc.autoTable({
      startY: 20,
      head: [['ID', 'Date', 'Type', 'Category', 'Amount']],
      body: filteredSearchResults.map(item => [
        item._id,
        item.date === 'n/a' ? 'N/A' : new Date(item.date).toLocaleDateString('en-CA'),
        item.transactionType,
        item.category,
        item.amount
      ])
    });
    doc.setFontSize(11);
    doc.text(`Total Amount: Rs. ${totalAmount}`, 14, doc.autoTable.previous.finalY + 10);
    doc.text(`Total Salary Amount: Rs. ${totalSalaryAmount}`, 14, doc.autoTable.previous.finalY + 20);
    doc.text(`Total Stock Amount: Rs. ${totalStockAmount}`, 14, doc.autoTable.previous.finalY + 30);
    doc.save('finance-report.pdf');
  };

  return (
    <div className="pt-4">
      <Nav />
      <center><h1 className="I-h1">Finance Details</h1></center>
      
      <div className="f-search-bar">
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
                  <td>{item.date === 'n/a' ? 'N/A' : new Date(item.date).toLocaleDateString('en-CA')}</td>
                  <td>{item.transactionType}</td>
                  <td>{item.category}</td>
                  <td style={{ textAlign: 'Right' }}>Rs. {item.amount}</td>
                  <td>
                    {item.transactionType !== 'Purchase Item' && item.transactionType !== 'Salary Payment' && (
                      <Link to={`/updatefinance/${item._id}`}>
                        <button className="I-but_up">Update</button>
                      </Link>
                    )}
                  </td>
                  <td>
                    {item.transactionType !== 'Purchase Item' && item.transactionType !== 'Salary Payment' && (
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
              <td style={{ textAlign: 'left' }}><strong>Total Salary Amount:</strong></td>
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
              <td style={{ textAlign: 'left' }}><strong>Total Amount:</strong></td>
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
