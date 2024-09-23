import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Nav from '../Nav/Nav';
import '../Product/Product.css';
import { useReactToPrint } from 'react-to-print';
import { useNavigate } from 'react-router-dom';

const URL = "http://localhost:5000/products";

function Products() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [noResults, setNoResults] = useState(false);
  const componentsRef = useRef();

  const fetchHandler = async () => {
    try {
      const response = await axios.get(URL);
      console.log("API Response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching products:", error);
      return { products: [] };
    }
  };

  useEffect(() => {
    fetchHandler().then((data) => {
      setProducts(data.products || []);
    });
  }, []);

  const handlePrint = useReactToPrint({
    content: () => componentsRef.current,
    documentTitle: "Product Report",
    onAfterPrint: () => {
      alert("Product Report Successfully Downloaded!");
      setIsLoading(false);
    },
    onBeforeGetContent: () => {
      setIsLoading(true);
    },
  });

  const handleSearch = () => {
    fetchHandler().then((data) => {
      const filteredProducts = data.products.filter((product) =>
        Object.values(product).some((field) =>
          field.toString().toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
      setProducts(filteredProducts);
      setNoResults(filteredProducts.length === 0);
    });
  };

  const deleteHandler = async (_id) => {
    const userConfirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );
    if (userConfirmed) {
      try {
        await axios.delete(`http://localhost:5000/products/${_id}`);
        window.alert("Product deleted successfully!");
        setProducts(products.filter(product => product._id !== _id));
      } catch (error) {
        console.error('Error deleting product:', error);
        window.alert('Failed to delete the product. Please try again.');
      }
    }
  };

  const updateHandler = (_id) => {
    navigate(`/updateproduct/${_id}`);
  };

  return (
    <center>
      <div>
        <Nav /><br />
        <h1>Product Details</h1><br /><br />
        
        {/* Search Input */}
        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            padding: "10px",
            marginBottom: "20px",
            borderRadius: "3px",
            border: "1px solid #ccc",
            width: "60%",
          }}
        />
        <button
          onClick={handleSearch}
          style={{
            padding: "10px 10px",
            marginLeft: "10px",
            borderRadius: "4px",
            backgroundColor: "#00712D",
            color: "#fff",
            border: "none",
            cursor: "pointer",
          }}
        >
          Search
        </button>

        {/* Product List */}
        <table>
          <thead>
            <tr>
              <th className="header">Name</th>
              <th className="header">MFD</th>
              <th className="header">Type</th>
              <th className="header">Product</th>
              <th className="header">Date</th>
              <th className="header">Quantity</th>
              <th className="header">Actions</th>
            </tr>
          </thead>
          <tbody>
            {noResults ? (
              <tr>
                <td colSpan="7">No products found</td>
              </tr>
            ) : (
              products.length > 0 ? (
                products.map((product, i) => {
                  const { _id, name, MFD, type, product: productType, date, quantity } = product; // Destructure here
                  return (
                    <tr key={i}>
                      <td className="cell">{name}</td>
                      <td className="cell">{new Date(MFD).toISOString().split('T')[0]}</td>
                      <td className="cell">{type}</td>
                      <td className="cell">{productType}</td>
                      <td className="cell">{new Date(date).toISOString().split('T')[0]}</td>
                      <td className="cell">{quantity}</td>
                      <td className="cell">
                        <button className="delete-button" onClick={() => deleteHandler(_id)}>
                          Delete
                        </button>
                        <button className="button" onClick={() => updateHandler(_id)}>
                          Update
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="7">No products found</td>
                </tr>
              )
            )}
          </tbody>
        </table>
        <div ref={componentsRef}></div>

        {/* Download Button */}
        <button
          className="download-button"
          onClick={handlePrint}
          disabled={isLoading}
          style={{
            padding: "12px 24px",
            backgroundColor: "#00712D",
            color: "white",
            border: "none",
            borderRadius: "5px",
            fontSize: "16px",
            cursor: "pointer",
            marginTop: "20px",
          }}
        >
          {isLoading ? "Generating Report..." : "Download Report"}
        </button>
      </div>
    </center>
  );
}

export default Products;
