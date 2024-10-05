import React, { useState, useEffect } from 'react';
import Nav from '../Nav/Nav';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import './FD.css';
import jsPDF from 'jspdf'; // Import jsPDF
import 'jspdf-autotable'; // Import for table auto-formatting

const URL = "http://localhost:5000/finance";
const ProductURL = "http://localhost:5000/products";

// Fetch handler for finance data with improved error handling
const fetchHandler = async () => {
  try {
    const response = await axios.get(URL);
    console.log("API Response (Finance)", response.data);
    return response.data || { finance: [] }; // Ensure a valid structure
  } catch (error) {
    console.error("Error fetching finance data:", error);
    return { finance: [] };  // Return an empty structure in case of an error
  }
};

// Fetch handler for product data
const productFetchHandler = async () => {
  try {
    const response = await axios.get(ProductURL);
    console.log("API Response (Products)", response.data);
    return response.data || { products: [] }; // Ensure a valid structure
  } catch (error) {
    console.error("Error fetching product data:", error);
    return { products: [] };  // Return an empty structure in case of an error
  }
};

function IncomeDetails() {
  const [finance, setFinance] = useState([]);
  const [products, setProducts] = useState([]); // Add products state
  const [searchTerm, setSearchTerm] = useState(''); // Add searchTerm state
  const navigate = useNavigate();

  // Fetch finance and product data when the component loads
  useEffect(() => {
    const fetchData = async () => {
      const financeData = await fetchHandler();
      const productData = await productFetchHandler();

      if (financeData.finance && Array.isArray(financeData.finance)) {
        console.log("...Finances", financeData.finance);
        setFinance(financeData.finance);
      } else {
        console.warn("Unexpected finance data structure:", financeData);
        setFinance([]);  // Set empty array if structure is unexpected
      }

      if (productData.products && Array.isArray(productData.products)) {
        console.log("...Products", productData.products); // Log product data
        setProducts(productData.products); // Update the state with product data
      } else {
        console.warn("Unexpected product data structure:", productData);
        setProducts([]);  // Set empty array if structure is unexpected
      }
    };

    fetchData();
  }, []);

  const deleteHandler = async (id) => {
    console.log("Deleting finance item with ID:", id);
    try {
      await axios.delete(`http://localhost:5000/finance/${id}`);
      setFinance(prevFinance => prevFinance.filter(item => item._id !== id)); // Safer state update
    } catch (error) {
      console.error("Error deleting finance record:", error);
    }
  };

  // Filter finance items and calculate total finance amount
  const filteredFinance = finance.filter(item => item.transactionType === 'Income');
  const totalFinanceAmount = filteredFinance.reduce((sum, item) => sum + item.amount, 0);

  // Calculate total product price
  const totalProductPrice = products.reduce((sum, product) => sum + (product.Totalprice || 0), 0);

  // Calculate full total amount (finance + product total)
  const fullTotalAmount = totalFinanceAmount + totalProductPrice;

  // Filter finance data based on search input
  const filteredSearchResults = filteredFinance.filter(item =>
    item.category.toLowerCase().includes(searchTerm.toLowerCase()) || // Search by category
    item.transactionType.toLowerCase().includes(searchTerm.toLowerCase()) || // Search by type
    item.date.includes(searchTerm) // Search by date
  );

  // Combine finance data and product data
  const combinedData = [
    ...filteredSearchResults,
    ...products.map(product => ({
      _id: product._id || 'N/A', // Handle missing _id
      date: product.MFD ? product.MFD : 'N/A', // Use 'MFD' as the date field
      transactionType: 'Product Income',
      category: product.type || 'Unknown', // Handle missing category/type
      amount: product.Totalprice || 'Not available', // Use 'Totalprice' for products
    }))
  ];

  console.log("Combined Data:", combinedData); // Log combined data for debugging

  // Function to generate PDF report
  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text("Finance and Product Report", 14, 16);
    doc.autoTable({
      startY: 20,
      head: [['ID', 'Date', 'Type', 'Category', 'Amount']],
      body: combinedData.map(item => [
        item._id,
        item.date ? new Date(item.date).toLocaleDateString('en-CA') : 'N/A', // Format date
        item.transactionType,
        item.category,
        item.amount
      ])
    });

    doc.text(`Total Finance Amount: Rs. ${totalFinanceAmount.toLocaleString()}`, 14, doc.autoTable.previous.finalY + 10);
    doc.text(`Total Product Price: Rs. ${totalProductPrice.toLocaleString()}`, 14, doc.autoTable.previous.finalY + 20);
    doc.text(`Full Total Amount: Rs. ${fullTotalAmount.toLocaleString()}`, 14, doc.autoTable.previous.finalY + 30); // Add full total amount
    doc.save('finance-product-report.pdf');
  };

  return (
    <div>
      <Nav />
      <center>
        <h1 className="I-h1">Income and Product Details</h1> {/* Update title */}
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
            {combinedData.length > 0 ? (
              combinedData.map((item, index) => (
                <tr key={item._id || index}> {/* Use index as fallback for missing _id */}
                  <td>{item._id || 'N/A'}</td>
                  <td>{item.date ? new Date(item.date).toLocaleDateString('en-CA') : 'N/A'}</td>
                  <td>{item.transactionType}</td>
                  <td>{item.category || 'Unknown'}</td>
                  <td style={{ textAlign: 'Right' }}>
                    {item.amount !== 'Not available' ? `Rs. ${Number(item.amount).toLocaleString()}` : item.amount}
                  </td>
                  <td>
                    <Link to={`/updatefinance/${item._id}`}>
                      <button className="I-but_up">Update</button>
                    </Link>
                  </td>
                  <td>
                    <button className="I-but" onClick={() => deleteHandler(item._id)}>Delete</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7">No records found</td>
              </tr>
            )}
            {/* Row for total finance amount */}
            <tr>
              <td colSpan="4" style={{ textAlign: 'right' }}><strong>Total Finance Amount:</strong></td>
              <td style={{ textAlign: 'right' }}><strong>{totalFinanceAmount.toLocaleString()}</strong></td>
              <td colSpan="2"></td>
            </tr>
            {/* Row for total product price */}
            <tr>
              <td colSpan="4" style={{ textAlign: 'right' }}><strong>Total Product Price:</strong></td>
              <td style={{ textAlign: 'right' }}><strong>{totalProductPrice.toLocaleString()}</strong></td>
              <td colSpan="2"></td>
            </tr>
            {/* Row for full total amount */}
            <tr>
              <td colSpan="4" style={{ textAlign: 'right' }}><strong>Full Total Amount:</strong></td>
              <td style={{ textAlign: 'right' }}><strong>{fullTotalAmount.toLocaleString()}</strong></td>
              <td colSpan="2"></td>
            </tr>
          </tbody>
        </table>
      </div>

      <center>
        <button className="I-but" onClick={generatePDF}>Generate Report</button>
      </center>
    </div>
  );
}

export default IncomeDetails;
