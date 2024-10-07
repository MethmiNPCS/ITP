import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Nav from '../Nav/Nav';
import '../Product/Product.css';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Link } from "react-router-dom";

const URL = "http://localhost:5000/products"; // API URL for fetching products

function Products() {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [noResults, setNoResults] = useState(false);

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

    // Generate PDF report of products
    const generatePDF = () => {
        if (products.length === 0) {
            window.alert("No products available to generate the report.");
            return;
        }

        const userConfirmed = window.confirm("Are you sure you want to download the report?");
        if (!userConfirmed) return;

        const doc = new jsPDF();
        doc.text("Products Report", 14, 16);

        doc.autoTable({
            startY: 20,
            head: [['ID', 'Type', 'Product', 'Price', 'MFD', 'EXP', 'Quantity', 'Total Price']],
            body: products.map((item) => {
                return [
                    item.name || '', // Use the desired order
                    item.type || '',
                    item.product || '',
                    item.price !== undefined && item.price !== null ? item.price.toFixed(2) : 'N/A', // Format Price
                    formatDate(item.MFD), // Format MFD date
                    formatDate(item.EXP), // Format EXP date
                    item.quantity || '',
                    item.TotalPrice !== undefined && item.TotalPrice !== null ? item.TotalPrice.toFixed(2) : 'N/A' // Format TotalPrice
                ];
            })
        });

        doc.save("products_report.pdf");
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
                                    const { _id, MFD, type, product: productType, EXP, quantity, price } = product;
                                    const TotalPrice = price !== undefined && quantity ? (price * quantity).toFixed(2) : 'N/A'; // Calculate Total Price
                                    return (
                                        <tr key={_id}>
                                            <td className="cell">{_id || ''}</td>
                                            <td className="cell">{type || ''}</td>
                                            <td className="cell">{productType || ''}</td>
                                            <td className="cell">{price !== undefined ? price.toFixed(2) : 'N/A'}</td> {/* Display Price */}
                                            <td className="cell">{formatDate(MFD)}</td> {/* Display formatted MFD */}
                                            <td className="cell">{formatDate(EXP)}</td> {/* Display formatted EXP */}
                                            <td className="cell">{quantity || ''}</td>
                                            <td className="cell">{TotalPrice}</td> {/* Display Total Price */}
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

                {/* Download Report Button */}
                <button
                    className="download-button"
                    onClick={generatePDF}
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
                    DOWNLOAD REPORT
                </button>

                <button className="but-chart">      
                    <Link to="/chartpage" className="nav-link">
                        CHART
                    </Link>
                </button>
            </div>
        </center>
    );
}

export default Products;
