import React, { useState } from 'react';
import Nav from '../Nav/Nav'; 
import axios from 'axios';
import farm2 from '../../img/farm.jpg'; // Ensure this path is correct

function AddProduct() {
    const [inputs, setInputs] = useState({
        name: "",
        MFD: "",
        type: "",
        date: "",
        quantity: "",
    });

    const [products, setProducts] = useState([]); // State to hold the list of products

    const animalProducts = ['Cheese', 'Butter', 'Yoghurt', 'Fresh Milk', 'Egg', 'Meat - Beef', 'Meat - Chicken', 'Meat - Pork'];
    const plantationProducts = ['Coconut', 'Timber', 'Nut'];

    const handleChange = (e) => {
        setInputs((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            await sendRequest();
            // Add the new product to the list
            setProducts((prevProducts) => [...prevProducts, inputs]);
            window.alert("Product added successfully!");
            // Clear the inputs
            setInputs({ name: "", MFD: "", type: "", date: "", quantity: "" });
        } catch (error) {
            console.error("Error:", error);
            window.alert("Failed to add product. Please try again.");
        }
    };

    const sendRequest = async () => {
        try {
            await axios.post("http://localhost:5000/products", {
                name: inputs.name,
                MFD: inputs.MFD,
                type: inputs.type,
                date: inputs.date,
                quantity: inputs.quantity,
            });
        } catch (error) {
            throw new Error(error.response ? error.response.data : error.message);
        }
    };

    return (
        <div style={styles.pageContainer}>
            <Nav />
            <div style={styles.container}>
                <div style={styles.formContainer}>
                    <h1 style={styles.title}>Add Product</h1>
                    <form onSubmit={handleSubmit} style={styles.form}>
                        <div style={styles.formGroup}>
                            <label htmlFor="name" style={styles.label}>Product Name</label>
                            <input 
                                type="text" 
                                name="name" 
                                onChange={handleChange} 
                                value={inputs.name} 
                                required 
                                style={styles.input} 
                            />
                        </div>

                        <div style={styles.formGroup}>
                            <label htmlFor="MFD" style={styles.label}>MFD</label>
                            <input 
                                type="text" 
                                name="MFD" 
                                onChange={handleChange} 
                                value={inputs.MFD} 
                                required 
                                style={styles.input} 
                            />
                        </div>

                        <div style={styles.formGroup}>
                            <label htmlFor="type" style={styles.label}>Category</label>
                            <select 
                                name="type" 
                                onChange={handleChange} 
                                value={inputs.type} 
                                required 
                                style={styles.select} 
                            >
                                <option value="">Select Type</option>
                                <option value="Animal">Animal</option>
                                <option value="Plantation">Plantation</option>
                            </select>
                        </div>

                        {inputs.type && (
                            <div style={styles.formGroup}>
                                <label htmlFor="productName" style={styles.label}>Select Product</label>
                                <select 
                                    name="productName" 
                                    onChange={handleChange} 
                                    value={inputs.name} 
                                    required 
                                    style={styles.select} 
                                >
                                    <option value="">Select Product</option>
                                    {(inputs.type === 'Animal' ? animalProducts : plantationProducts).map((product) => (
                                        <option key={product} value={product}>{product}</option>
                                    ))}
                                </select>
                            </div>
                        )}

                        <div style={styles.formGroup}>
                            <label htmlFor="date" style={styles.label}>Date</label>
                            <input 
                                type="date" 
                                name="date" 
                                onChange={handleChange} 
                                value={inputs.date} 
                                required 
                                style={styles.input} 
                            />
                        </div>

                        <div style={styles.formGroup}>
                            <label htmlFor="quantity" style={styles.label}>Quantity</label>
                            <input 
                                type="number" 
                                name="quantity" 
                                onChange={handleChange} 
                                value={inputs.quantity} 
                                required 
                                style={styles.input} 
                            />
                        </div>

                        <button type="submit" style={styles.submitButton}>Add Product</button>
                    </form>

                    {/* Table to display all products */}
                    {products.length > 0 && (
                        <table style={styles.table}>
                            <thead>
                                <tr>
                                    <th style={styles.th}>Product Name</th>
                                    <th style={styles.th}>MFD</th>
                                    <th style={styles.th}>Type</th>
                                    <th style={styles.th}>Date</th>
                                    <th style={styles.th}>Quantity</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map((product, index) => (
                                    <tr key={index}>
                                        <td style={styles.td}>{product.name}</td>
                                        <td style={styles.td}>{product.MFD}</td>
                                        <td style={styles.td}>{product.type}</td>
                                        <td style={styles.td}>{product.date}</td>
                                        <td style={styles.td}>{product.quantity}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
}

const styles = {
    pageContainer: {
        backgroundImage: `url(${farm2})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px',
        width: '100%',
    },
    formContainer: {
        padding: '50px',
        borderRadius: '8px',
        boxShadow: '0 8px 26px rgba(0, 0, 0, 0.9)',
        maxWidth: '600px',
        width: '100%',
        color: 'white',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
    },
    title: {
        textAlign: 'center',
        fontSize: '24px',
        marginBottom: '30px',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
    },
    formGroup: {
        display: 'flex',
        flexDirection: 'column',
    },
    label: {
        marginBottom: '8px',
        fontWeight: 'bold',
    },
    input: {
        padding: '10px',
        fontSize: '16px',
        border: '1px solid #fff',
        borderRadius: '5px',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        color: '#000',
    },
    select: {
        padding: '10px',
        fontSize: '16px',
        border: '1px solid #fff',
        borderRadius: '5px',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        color: '#000',
    },
    submitButton: {
        padding: '12px',
        border: 'none',
        borderRadius: '5px',
        backgroundColor: '#16423C',
        color: 'white',
        fontSize: '16px',
        cursor: 'pointer',
    },
    table: {
        marginTop: '20px',
        width: '100%',
        borderCollapse: 'collapse',
        color: 'white',
    },
    th: {
        border: '1px solid #fff',
        padding: '10px',
        backgroundColor: '#16423C',
    },
    td: {
        border: '1px solid #fff',
        padding: '10px',
    },
};

export default AddProduct;
