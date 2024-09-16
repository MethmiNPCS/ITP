import React, { useState, useEffect } from 'react';
import Nav from '../Nav/Nav';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function AddOrder() {
    const navigate = useNavigate();
    const [inputs, setInputs] = useState({
        orderType: "",
        items: [{ orderItem: "", quantity: "", unit: "g" }],
        description: ""
    });
    const [errors, setErrors] = useState({});
    const [suppliers, setSuppliers] = useState([]);
    const [selectedSupplier, setSelectedSupplier] = useState('');

    useEffect(() => {
        if (inputs.orderType) {
            axios.get(`http://localhost:5000/suppliers/type/${inputs.orderType}`)
                .then(response => {
                    setSuppliers(response.data.suppliers);
                })
                .catch(error => {
                    console.error("Error fetching suppliers", error);
                });
        } else {
            setSuppliers([]);
        }
    }, [inputs.orderType]);

    const handleChange = (e) => {
        setInputs((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    const handleItemChange = (index, e) => {
        const { name, value } = e.target;
        const newItems = [...inputs.items];
        newItems[index][name] = value;
        setInputs({ ...inputs, items: newItems });

        setErrors((prevErrors) => ({
            ...prevErrors,
            [`${name}-${index}`]: ''
        }));
    };

    const addItemField = () => {
        setInputs((prevState) => ({
            ...prevState,
            items: [...prevState.items, { orderItem: "", quantity: "", unit: "g" }]
        }));
    };

    const removeItemField = (index) => {
        const newItems = [...inputs.items];
        newItems.splice(index, 1);
        setInputs({ ...inputs, items: newItems });
    };

    const handleSupplierChange = (e) => {
        setSelectedSupplier(e.target.value);
    };

    const validateForm = () => {
        const newErrors = {};

        if (!inputs.orderType) {
            newErrors.orderType = "Order type is required.";
        }

        inputs.items.forEach((item, index) => {
            if (!item.orderItem) {
                newErrors[`orderItem-${index}`] = "Item name is required.";
            }
            if (!item.quantity || isNaN(item.quantity) || item.quantity <= 0) {
                newErrors[`quantity-${index}`] = "Valid quantity is required.";
            }
        });

        if (inputs.items.length === 0) {
            newErrors.items = "At least one item is required.";
        }

        if (inputs.description && inputs.description.length < 5) {
            newErrors.description = "Description should be at least 5 characters long.";
        }

        if (!selectedSupplier) {
            newErrors.supplier = "Supplier is required.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            sendRequest().then(() => navigate('/orderdetails'));
        }
    };

    const sendRequest = async () => {
        await axios.post("http://localhost:5000/orders", {
            orderType: inputs.orderType,
            items: inputs.items,
            description: inputs.description,
            supplier: selectedSupplier,
            orderDate: new Date().toISOString(),
            status: "Pending",
        }).then(res => res.data);
    };

    return (
        <div>
            <Nav />
            <br/>
            <h1>Add Order</h1>

            <form onSubmit={handleSubmit}>
                <label>Order ID</label>
                <br />
                <input type="text" value="Auto-generated" disabled />
                <br /><br />

                <label>Order Type</label>
                <br />
                <input
                    type="radio"
                    name="orderType"
                    value="Food"
                    checked={inputs.orderType === "Food"}
                    onChange={handleChange}
                    required
                /> Food
                <input
                    type="radio"
                    name="orderType"
                    value="Medicine"
                    checked={inputs.orderType === "Medicine"}
                    onChange={handleChange}
                    required
                /> Medicine
                {errors.orderType && <p style={{ color: 'red' }}>{errors.orderType}</p>}
                <br /><br />

                <label>Order Items</label>
                <br />
                {inputs.items.map((item, index) => (
                    <div key={index} style={{ display: 'flex', alignItems: 'center' }}>
                        <input
                            type="text"
                            name="orderItem"
                            value={item.orderItem}
                            onChange={(e) => handleItemChange(index, e)}
                            placeholder="Item Name"
                            required
                        />
                        {errors[`orderItem-${index}`] && <p style={{ color: 'red', marginLeft: '10px' }}>{errors[`orderItem-${index}`]}</p>}
                        <input
                            type="number"
                            name="quantity"
                            value={item.quantity}
                            onChange={(e) => handleItemChange(index, e)}
                            placeholder="Quantity"
                            required
                            style={{ marginLeft: '10px' }}
                        />
                        {errors[`quantity-${index}`] && <p style={{ color: 'red', marginLeft: '10px' }}>{errors[`quantity-${index}`]}</p>}
                        <select
                            name="unit"
                            value={item.unit}
                            onChange={(e) => handleItemChange(index, e)}
                            style={{ marginLeft: '10px' }}
                        >
                            <option value="g">g</option>
                            <option value="kg">kg</option>
                            <option value="tons">tons</option>
                            <option value="ml">ml</option>
                            <option value="l">l</option>
                        </select>
                        {index > 0 && (
                            <button type="button" onClick={() => removeItemField(index)} style={{ marginLeft: '10px' }}>-</button>
                        )}
                    </div>
                ))}
                <button type="button" onClick={addItemField} style={{ marginTop: '10px', fontSize: '20px' }}>+</button>
                {errors.items && <p style={{ color: 'red' }}>{errors.items}</p>}
                <br /><br />

                <label>Supplier</label>
                <br />
                <select name = "selected" value={selectedSupplier} onChange={handleSupplierChange} required>
                    <option value="">Select Supplier</option>
                    {suppliers.map(supplier => (
                        <option key={supplier.supplierID} value={supplier.supplierName}>
                            {supplier.supplierName}
                        </option>
                    ))}
                </select>
                {errors.supplier && <p style={{ color: 'red' }}>{errors.supplier}</p>}
                <br /><br />

                <label>Description</label>
                <br />
                <textarea
                    name="description"
                    value={inputs.description}
                    onChange={handleChange}
                    placeholder="Order Description"
                ></textarea>
                {errors.description && <p style={{ color: 'red' }}>{errors.description}</p>}
                <br /><br />

                <label>Status</label>
                <br />
                <input type="text" value="Pending" disabled />
                <br /><br />

                <button type="submit">Submit Order</button>
            </form>
        </div>
    );
}

export default AddOrder;
