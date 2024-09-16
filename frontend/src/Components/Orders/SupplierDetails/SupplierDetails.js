import React, { useEffect, useState } from 'react';
import Nav from '../Nav/Nav';

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
    <div>
      <Nav />
      <br />
      <div className="supplier-container">
        <h1>Suppliers</h1>
        {/* Search bar */}
        <div className="search-container">
          <input
            type="text"
            placeholder="Search Suppliers"
            value={searchQuery}
            onChange={handleSearchChange}
            className="search-input"
          />
        </div>
        {filteredSuppliers.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Supplier ID</th>
                <th>Supplier Name</th>
                <th>Supplier Type</th>
                <th>Email</th>
                <th>Phone</th>
              </tr>
            </thead>
            <tbody>
              {filteredSuppliers.map((supplier) => (
                <tr key={supplier.supplierID}>
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
          <p>No search results found</p>
        )}
      </div>
    </div>
  );
}

export default SupplierDetails;
