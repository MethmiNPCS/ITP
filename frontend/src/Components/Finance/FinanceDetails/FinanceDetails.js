import React, { useState, useEffect } from 'react';
import Nav from '../Nav/Nav';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf'; // Import jsPDF
import 'jspdf-autotable'; // Import for table auto-formatting
import './FD.css';

const URL = "http://localhost:5000/finance";

// Fetch handler with improved error handling
const fetchHandler = async () => {
  try {
    const response = await axios.get(URL);
    console.log("API Response", response.data);
    return response.data || { finance: [] }; // Ensure a valid structure
  } catch (error) {
    console.error("Error fetching data:", error);
    return { finance: [] };  // Return an empty structure in case of an error
  }
};

function FinanceDetails() {
  const [finance, setFinance] = useState([]);
  const [searchTerm, setSearchTerm] = useState(''); // State to store search input
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Loading....");
    const getFinanceData = async () => {
      const data = await fetchHandler();
      if (data.finance && Array.isArray(data.finance)) {
        console.log("...Finances", data.finance);
        setFinance(data.finance);
      } else {
        console.warn("Unexpected data structure:", data);
        setFinance([]);  // Set empty array if structure is unexpected
      }
    };

    getFinanceData();
  }, []);

  const deleteHandler = async (id) => {
    console.log("Deleting item with ID:", id);
    try {
      await axios.delete(`http://localhost:5000/finance/${id}`);
      setFinance(finance.filter(item => item._id !== id));
    } catch (error) {
      console.error("Error deleting finance record:", error);
    }
  };

  // Filter finance items and calculate total amount
  const filteredFinance = finance.filter(item => item.transactionType === 'Expense');
  const totalAmount = filteredFinance.reduce((sum, item) => sum + item.amount, 0);

  // Filter data based on search input
  const filteredSearchResults = filteredFinance.filter(item =>
    item.category.toLowerCase().includes(searchTerm.toLowerCase()) || // Search by category
    item.transactionType.toLowerCase().includes(searchTerm.toLowerCase()) || // Search by type
    item.date.includes(searchTerm) // Search by date
  );

  // Function to generate PDF report
  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text("Finance Report", 14, 16);
    doc.autoTable({
      startY: 20,
      head: [['ID', 'Date', 'Type', 'Category', 'Amount']],
      body: filteredSearchResults.map(item => [
        item._id,
        item.date,
        item.transactionType,
        item.category,
        item.amount
      ])
    });
    doc.text(`Total Amount: ${totalAmount}`, 14, doc.autoTable.previous.finalY + 10);
    doc.save('finance-report.pdf');
  };

  return (
    <div>
      <Nav />
      <center>
        <h1>Finance Details</h1>
      </center>
      
      {/* Search Input Field */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by category, type, or date..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)} // Update search term on input change
        />
      </div>
      
      <div className="table-wrapper">
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
              filteredSearchResults.map((financeItem) => (
                <tr key={financeItem._id}>
                  <td>{financeItem._id}</td>
                  <td>{new Date(financeItem.date).toLocaleDateString('en-CA')}</td>
                  <td>{financeItem.transactionType}</td>
                  <td>{financeItem.category}</td>
                  <td style={{ textAlign: 'Right' }}>Rs. {financeItem.amount}</td>
                  <td>
                    <Link to={`/updatefinance/${financeItem._id}`}>
                      <button className="but_up">Update</button>
                    </Link>
                  </td>
                  <td>
                    <button className="but" onClick={() => deleteHandler(financeItem._id)}>Delete</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7">No finance records found</td>
              </tr>
            )}
            {/* Row for total amount */}
            <tr>
              <td colSpan="4" style={{ textAlign: 'right' }}><strong>Total Amount:</strong></td>
              <td><strong>{totalAmount}</strong></td>
              <td colSpan="2"></td>
            </tr>
          </tbody>
        </table>
      </div>
      {/* Button to generate PDF */}
      <center>
        <button className="but" onClick={generatePDF}>Generate Report</button>
      </center>
    </div>
  );
}

export default FinanceDetails;
