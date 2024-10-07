import React, { useEffect, useState } from 'react';
import Nav from '../Nav/Nav';
import './SupplierDetails.css';


function SupplierDetails() {
  const [suppliers, setSuppliers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Fetch suppliers from the backend
    const fetchSuppliers = async () => {
      try {
        const response = await fetch('http://localhost:5000/suppliers'); // Adjust the API endpoint as needed
        const data = await response.json();
        setSuppliers(data.suppliers);
      } catch (err) {
        console.error('Failed to fetch suppliers', err);
      }
    };

    fetchSuppliers();
  }, []);

  // Function to handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Filter suppliers based on search query
  const filteredSuppliers = suppliers.filter((supplier) =>
    supplier.supplierName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className='pt-16'>
    <div id="supplier-details">
      <Nav />
      <br />
      <div id="supplier-container">
        <h1 id="supplier-header">Suppliers</h1>

        {/* Search bar */}
        <div id="search-container">
          <input
            id="search-input"
            type="text"
            placeholder="Search Suppliers"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>

        {filteredSuppliers.length > 0 ? (
          <table id="supplier-table">
            <thead>
              <tr id="table-header-row">
                <th id="supplier-id-header">Supplier ID</th>
                <th id="supplier-name-header">Supplier Name</th>
                <th id="supplier-type-header">Supplier Type</th>
                <th id="supplier-email-header">Email</th>
                <th id="supplier-phone-header">Phone</th>
              </tr>
            </thead>
            <tbody id="supplier-table-body">
              {filteredSuppliers.map((supplier) => (
                <tr key={supplier.supplierID} id={`supplier-row-${supplier.supplierID}`}>
                  <td>{supplier.supplierID}</td>
                  <td>{supplier.supplierName}</td>
                  <td>{supplier.supplierType}</td>
                  <td>{supplier.supplierEmail}</td>
                  <td>{supplier.supplierPhone}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p id="no-results-message">No search results found</p>
        )}
      </div>
    </div>
    </div>
  );
}

export default SupplierDetails;
