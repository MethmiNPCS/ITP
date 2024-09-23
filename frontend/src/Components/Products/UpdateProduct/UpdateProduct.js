import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './UpdateProduct.css'; // Import the CSS file

function UpdateProduct() {
    const [inputs, setInputs] = useState({
        name: '',
        MFD: '',
        type: '',
        product: '',
        date: '',
        quantity: 0,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { id } = useParams();

    // Define the product options for each type
    const productOptions = {
        Animal: ["Cheese", "Butter", "Yoghurt","Frsh Milk","Egg","Meet-Beef","Meet-Chiken","Meet-Pork"],
        Plantation: ["Coconut", "Timber","Nut"],
    };

    useEffect(() => {
        const fetchHandler = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/products/${id}`);
                if (res.data && res.data.product) {
                    setInputs(res.data.product);
                } else {
                    setError('No product data found');
                }
            } catch (err) {
                setError('Error fetching product data. Please try again later.');
            }
        };
        fetchHandler();
    }, [id]);

    const sendRequest = async () => {
        try {
            setLoading(true);
            await axios.put(`http://localhost:5000/products/${id}`, {
                name: String(inputs.name),
                MFD: new Date(inputs.MFD).toISOString(),
                type: String(inputs.type),
                product: String(inputs.product),  // Update product selection
                date: new Date(inputs.date).toISOString(),
                quantity: Number(inputs.quantity),
            });
            window.alert('Product updated successfully!');
        } catch (err) {
            setError('Error updating product. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setInputs((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!inputs.name || !inputs.MFD || !inputs.type || !inputs.product || !inputs.date || inputs.quantity <= 0) {
            setError('Please fill out all fields correctly.');
            return;
        }

        try {
            await sendRequest();
            navigate('/productdetails');
        } catch (error) {
            console.error('Error during form submission:', error);
        }
    };

    return (
        <div className="image-container">
            <div className="form-container">
                <h1 className="title">Update Product</h1>
                {error && <p className="error">{error}</p>}
                <form onSubmit={handleSubmit} className="form">
                    <div className="form-group">
                        <label htmlFor="name" className="label">Product Name</label>
                        <input
                            type="text"
                            name="name"
                            id="name"
                            onChange={handleChange}
                            value={inputs.name}
                            required
                            className="input"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="MFD" className="label">Manufacturing Date (MFD)</label>
                        <input
                            type="date"
                            name="MFD"
                            id="MFD"
                            onChange={handleChange}
                            value={inputs.MFD.substring(0, 10)}
                            required
                            className="input"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="type" className="label">Type</label>
                        <select
                            name="type"
                            id="type"
                            onChange={handleChange}
                            value={inputs.type}
                            required
                            className="input"
                        >
                            <option value="">Select Type</option>
                            <option value="Animal">Animal</option>
                            <option value="Plantation">Plantation</option>
                        </select>
                    </div>

                    {inputs.type && (
                        <div className="form-group">
                            <label htmlFor="product" className="label">Product</label>
                            <select
                                name="product"
                                id="product"
                                onChange={handleChange}
                                value={inputs.product}
                                required
                                className="input"
                            >
                                <option value="">Select Product</option>
                                {productOptions[inputs.type]?.map((option) => (
                                    <option key={option} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    <div className="form-group">
                        <label htmlFor="date" className="label">Expiration Date</label>
                        <input
                            type="date"
                            name="date"
                            id="date"
                            onChange={handleChange}
                            value={inputs.date.substring(0, 10)}
                            required
                            className="input"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="quantity" className="label">Quantity</label>
                        <input
                            type="number"
                            name="quantity"
                            id="quantity"
                            onChange={handleChange}
                            value={inputs.quantity}
                            required
                            className="input"
                        />
                    </div>

                    <button type="submit" disabled={loading} className={loading ? "loading-button" : "submit-button"}>
                        {loading ? 'Updating...' : 'Update Product'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default UpdateProduct;
