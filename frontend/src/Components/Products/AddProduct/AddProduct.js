import React, { useState } from 'react';
import Nav from '../Nav/Nav'; 
import axios from 'axios';
import farm2 from '../../img/farm.jpg'; // Ensure this path is correct
import { useNavigate } from 'react-router-dom';

function AddProduct() {
    const [inputs, setInputs] = useState({
        name: "",
        MFD: "",
        type: "",
        product: "",
        date: "",
        quantity: "",
    });
    const navigate = useNavigate();

    const productOptions = {
        Animal: ["Cheese", "Butter", "Yoghurt","Fresh Milk","Egg","Meat-Beef","Meat-Chicken","Meat-Pork"],
        Plantation: ["Coconut", "Timber","Nut"],
    };

    const handleChange = (e) => {
        setInputs((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); 
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formattedMFD = formatDate(inputs.MFD);
        const formattedDate = formatDate(inputs.date);

        try {
            await sendRequest({
                ...inputs,
                MFD: formattedMFD,
                date: formattedDate,
            });
            window.alert("Product added successfully!");
            setInputs({ name: "", MFD: "", type: "", product: "", date: "", quantity: "" });
            navigate("/productdetails"); // Navigate to product details after adding
        } catch (error) {
            console.error("Error:", error);
            window.alert("Failed to add product. Please try again.");
        }
    };

    const sendRequest = async (formattedInputs) => {
        try {
            await axios.post("http://localhost:5000/products", {
                name: formattedInputs.name,
                MFD: formattedInputs.MFD,
                type: formattedInputs.type,
                product: formattedInputs.product,
                date: formattedInputs.date,
                quantity: formattedInputs.quantity,
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
                            <label htmlFor="MFD" style={styles.label}>Manufacturing Date</label>
                            <input 
                                type="date" 
                                name="MFD" 
                                onChange={handleChange} 
                                value={inputs.MFD} 
                                required 
                                style={styles.input} 
                            />
                        </div>

                        <div style={styles.formGroup}>
                            <label htmlFor="type" style={styles.label}>Type</label>
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
                                <label htmlFor="product" style={styles.label}>Product</label>
                                <select 
                                    name="product" 
                                    onChange={handleChange} 
                                    value={inputs.product} 
                                    required 
                                    style={styles.select}
                                >
                                    <option value="">Select Product</option>
                                    {productOptions[inputs.type].map((prod, index) => (
                                        <option key={index} value={prod}>
                                            {prod}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

                        <div style={styles.formGroup}>
                            <label htmlFor="date" style={styles.label}>Expiry Date</label>
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
                </div>
            </div>
        </div>
    );
}

const styles = {
    // Style definitions here
};

export default AddProduct;
