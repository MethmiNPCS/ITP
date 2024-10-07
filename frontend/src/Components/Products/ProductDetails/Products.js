import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Nav from '../Nav/Nav';
import '../Product/Product.css';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Link } from "react-router-dom";
import { Bar } from 'react-chartjs-2';
import Chart from 'chart.js/auto';

const URL = "http://localhost:5000/products"; // API URL for fetching products

function Products() {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [noResults, setNoResults] = useState(false);
    const [showChart, setShowChart] = useState(false); // State to toggle chart visibility

    // Fetch products from API
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

    // Initial fetch on component mount
    useEffect(() => {
        fetchHandler().then((data) => {
            setProducts(data.products || []);
            setNoResults((data.products || []).length === 0);
        });
    }, []);

    // Handle search functionality
    const handleSearch = () => {
        fetchHandler().then((data) => {
            const filteredProducts = (data.products || []).filter((product) =>
                Object.values(product).some((field) =>
                    field?.toString().toLowerCase().includes(searchQuery.toLowerCase())
                )
            );
            setProducts(filteredProducts);
            setNoResults(filteredProducts.length === 0);
        });
    };

    // Handle delete functionality
    const deleteHandler = async (_id) => {
        const userConfirmed = window.confirm("Are you sure you want to delete this product?");
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

    // Handle update functionality (navigate to another page)
    const updateHandler = (_id) => {
        navigate(`/updateproduct/${_id}`);
    };

    // Utility function to format date in 'YYYY-MM-DD' format
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return 'N/A'; // Handle invalid dates
        return date.toISOString().split('T')[0];
    };

    // Generate PDF report of products with frame
    const generatePDF = () => {
        if (products.length === 0) {
            window.alert("No products available to generate the report.");
            return;
        }

        const userConfirmed = window.confirm("Are you sure you want to download the report?");
        if (!userConfirmed) return;

        const doc = new jsPDF();
        const currentDate = new Date().toISOString().split('T')[0];

        // Add border/frame to each page
        const addFrame = () => {
            doc.setDrawColor(0, 0, 0); // Set frame color (black)
            doc.setLineWidth(1); // Set frame thickness
            doc.rect(10, 10, doc.internal.pageSize.getWidth() - 20, doc.internal.pageSize.getHeight() - 20, 'S'); // Create a rectangle border
        };

        // Add header to each page
        const addHeader = () => {
            doc.setFontSize(16);
            doc.text("Products Report", 105, 30, { align: 'center' }); // Centered header title
            doc.setFontSize(12);
            doc.text(`Generated on: ${currentDate}`, 14, 40); // Date below header on the left side
        };

        // Add footer to each page
        const addFooter = (pageNum) => {
            const pageHeight = doc.internal.pageSize.getHeight();
            doc.setFontSize(10);
            doc.text(`Page ${pageNum}`, doc.internal.pageSize.getWidth() - 20, pageHeight - 10, { align: 'right' }); // Footer page number on the right
        };

        // Custom function to add header and footer on each page
        const addPageElements = (pageNum) => {
            addFrame();
            addHeader();
            addFooter(pageNum);
        };

        // Call this function initially for the first page
        addPageElements(1);

        // Add logo (optional)
        const logo = new Image();
        logo.src = "/favicon.ico"; // Path to your logo
        logo.onload = () => {
            const logoWidth = 30; // Adjust logo width
            const logoHeight = 30; // Adjust logo height
            const logoX = (doc.internal.pageSize.getWidth() - logoWidth) / 2; // Center horizontally
            doc.addImage(logo, "ICO", logoX, 15, logoWidth, logoHeight); // Add logo below header

            // Add table
            doc.autoTable({
                startY: 60, // Start the table lower to make space for title, date, and logo
                head: [['ID', 'Type', 'Product', 'Price', 'MFD', 'EXP', 'Quantity', 'Total Price']],
                body: products.map((item) => {
                    return [
                        item._id || '',
                        item.type || '',
                        item.product || '',
                        item.price !== undefined && item.price !== null ? item.price.toFixed(2) : 'N/A',
                        formatDate(item.MFD),
                        formatDate(item.EXP),
                        item.quantity || '',
                        item.TotalPrice !== undefined && item.TotalPrice !== null ? item.TotalPrice.toFixed(2) : (item.price * item.quantity).toFixed(2) // Calculate Total Price if not present
                    ];
                }),
                didDrawPage: (data) => {
                    const pageNum = doc.internal.getCurrentPageInfo().pageNumber;
                    addPageElements(pageNum); // Add frame and header/footer for each new page
                }
            });

            // Save the PDF with a file name that includes the current date
            doc.save(`products_report_${currentDate}.pdf`);
        };
    };

    // Chart data and options
    const chartData = {
        labels: products.map(product => product.product || 'Unknown Product'),
        datasets: [
            {
                label: 'Product Prices',
                data: products.map(product => product.price || 0),
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }
        ]
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                display: true,
                position: 'top'
            }
        }
    };

    return (
        <center>
            <div>
                <Nav /><br />
                <h3>PRODUCT DETAILS</h3><br /><br />

                {/* Centered Search Container */}
                <center>
                    <div className="flex justify-center items-center mb-5">
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="p-2 border border-gray-300 rounded-md w-3/5" // Tailwind styles for the input
                        />
                        <button
                            onClick={handleSearch}
                            className="p-2 ml-3 rounded-md bg-green-700 text-white" // Tailwind styles for the button
                        >
                            Search
                        </button>
                    </div>
                </center>

                {/* Chart Button */}
                <center>
                    <button
                        onClick={() => setShowChart(!showChart)}
                        className="p-2 rounded-md bg-blue-600 text-white mb-5"
                    >
                        {showChart ? "Hide Chart" : "Show Chart"}
                    </button>
                </center>

                {/* Display Chart */}
                {showChart && (
                    <div>
                        <h4>Product Prices Chart</h4>
                        <Bar data={chartData} options={chartOptions} />
                    </div>
                )}

                {/* Product Table */}
                <table>
                    <thead>
                        <tr>
                            <th className="header">ID</th>
                            <th className="header">Type</th>
                            <th className="header">Product</th>
                            <th className="header">Price</th>
                            <th className="header">MFD</th>
                            <th className="header">EXP</th>
                            <th className="header">Quantity</th>
                            <th className="header">Total Price</th>
                            <th className="header">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {noResults ? (
                            <tr>
                                <td colSpan="9">No products found</td>
                            </tr>
                        ) : (
                            products.length > 0 ? (
                                products.map((product) => {
                                    const { _id, MFD, type, product: productType, EXP, quantity, price, TotalPrice } = product;
                                    return (
                                        <tr key={_id}>
                                            <td className="cell">{_id || ''}</td>
                                            <td className="cell">{type || ''}</td>
                                            <td className="cell">{productType || ''}</td>
                                            <td className="cell">{price !== undefined ? price.toFixed(2) : 'N/A'}</td>
                                            <td className="cell">{formatDate(MFD)}</td>
                                            <td className="cell">{formatDate(EXP)}</td>
                                            <td className="cell">{quantity || ''}</td>
                                            <td className="cell">{TotalPrice !== undefined ? TotalPrice.toFixed(2) : (price * quantity).toFixed(2)}</td> {/* Total price display */}
                                            <td className="cell">
                                                <div className="action-buttons">
                                                    <button className="delete-button" onClick={() => deleteHandler(_id)}>
                                                        DELETE
                                                    </button>
                                                    <button className="update-button" onClick={() => updateHandler(_id)}>
                                                        UPDATE
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan="9">No products found</td>
                                </tr>
                            )
                        )}
                    </tbody>
                </table>

                <br />
                <button onClick={generatePDF} className="generate-report-button">
                    Generate PDF Report
                </button>
            </div>
        </center>
    );
}

export default Products;
