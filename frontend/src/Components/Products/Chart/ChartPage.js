// src/components/ChartPage.js

import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import Charts from '../Chart/Chart'; // Import the Charts component
import Nav from '../Nav/Nav';

const URL = "http://localhost:5000/products";

const ChartPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const chartRef = useRef(null); // Reference to the chart section for PDF capture

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(URL);
        setProducts(response.data.products || []);
      } catch (error) {
        console.error("Error fetching products:", error);
        setError("Failed to fetch products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Function to handle PDF download
  const downloadPDF = () => {
    const input = chartRef.current; // Get the current reference of the chart section

    // Convert the chart section to an image using html2canvas
    html2canvas(input)
      .then((canvas) => {
        const imgData = canvas.toDataURL('image/png'); // Convert canvas to base64 image
        const pdf = new jsPDF('p', 'mm', 'a4'); // Create a new jsPDF instance

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width; // Scale image height proportionally

        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight); // Add image to PDF
        pdf.save('product-charts.pdf'); // Save the PDF file
      })
      .catch((error) => {
        console.error('Error generating PDF:', error);
      });
  };

  return (
    <div style={{ padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)' }}>
      <Nav />
      <center>
        <h1 style={{ color: '#333' }}>Product Charts</h1> <br></br><br></br>
      </center>

      {loading ? (
        <p style={{ textAlign: 'center', color: '#666' }}>Loading...</p>
      ) : error ? (
        <p style={{ textAlign: 'center', color: 'red' }}>{error}</p>
      ) : (
        <div ref={chartRef} style={{ margin: '20px 0' }}> {/* Reference the chart section for PDF capture */}
          <Charts productData={products} />
        </div>
      )}

      {/* Button to download the PDF */}
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
        <button
          onClick={downloadPDF}
          style={{
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '16px',
            boxShadow: '0 2px 4px rgba(0, 123, 255, 0.2)',
            transition: 'background-color 0.3s, transform 0.3s',
          }}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#0056b3')}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#007bff')}
        >
          Download PDF
        </button>
      </div>
    </div>
  );
};

export default ChartPage;
