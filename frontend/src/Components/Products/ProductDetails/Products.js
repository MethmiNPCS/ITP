import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Nav from '../Nav/Nav';
import '../Product/Product.css';
import { useReactToPrint } from 'react-to-print';
import Product from '../Product/Product';

const URL = "http://localhost:5000/products";

function Products() {
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

  return (
    <center>
      <div>
        <Nav /><br></br>
        <h1>Product Details </h1><br></br><br></br>
<center></center>
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
        <div ref={componentsRef}>
          {noResults ? (
            <p>No products found</p>
          ) : (
            products.length > 0 ? (
              products.map((product, i) => (
                <div key={i}>
                  <Product product={product} />
                </div>
              ))
            ) : (
              <p>No products found</p>
            )
          )}
        </div>

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
