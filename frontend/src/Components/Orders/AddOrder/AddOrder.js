import React, { useState, useEffect } from 'react';
import Nav from '../Nav/Nav';
import './AddOrder.css'
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
        <div id="add-order-container">
            <Nav />
            <br />
            <h1 id="add-order-header">Add Order</h1>

            <form id="add-order-form" onSubmit={handleSubmit}>
                <label id="order-id-label">Order ID</label>
                <br />
                <input id="order-id-input" type="text" value="Auto-generated" disabled />
                <br /><br />

                <label id="order-type-label">Order Type</label>
                <br />
                <input
                    id="order-type-food"
                    type="radio"
                    name="orderType"
                    value="Food"
                    checked={inputs.orderType === "Food"}
                    onChange={handleChange}
                    required
                /> Food
                <input
                    id="order-type-medicine"
                    type="radio"
                    name="orderType"
                    value="Medicine"
                    checked={inputs.orderType === "Medicine"}
                    onChange={handleChange}
                    required
                /> Medicine
                {errors.orderType && <p id="order-type-error">{errors.orderType}</p>}
                <br /><br />

                <label id="order-items-label">Order Items</label>
                <br />
                {inputs.items.map((item, index) => (
                    <div key={index} id={`order-item-${index}`} className="order-item">
                        <input
                            id={`order-item-name-${index}`}
                            type="text"
                            name="orderItem"
                            value={item.orderItem}
                            onChange={(e) => handleItemChange(index, e)}
                            placeholder="Item Name"
                            required
                        />
                        {errors[`orderItem-${index}`] && <p id={`order-item-error-${index}`} className="error-message">{errors[`orderItem-${index}`]}</p>}
                        <input
                            id={`order-item-quantity-${index}`}
                            type="number"
                            name="quantity"
                            value={item.quantity}
                            onChange={(e) => handleItemChange(index, e)}
                            placeholder="Quantity"
                            required
                        />
                        {errors[`quantity-${index}`] && <p id={`order-item-quantity-error-${index}`} className="error-message">{errors[`quantity-${index}`]}</p>}
                        <select
                            id={`order-item-unit-${index}`}
                            name="unit"
                            value={item.unit}
                            onChange={(e) => handleItemChange(index, e)}
                        >
                            <option value="g">g</option>
                            <option value="kg">kg</option>
                            <option value="tons">tons</option>
                            <option value="ml">ml</option>
                            <option value="l">l</option>
                        </select>
                        {index > 0 && (
                            <button id={`remove-item-button-${index}`} type="button" onClick={() => removeItemField(index)}>-</button>
                        )}
                    </div>
                ))}
                <button id="add-item-button" type="button" onClick={addItemField}>+</button>
                {errors.items && <p id="order-items-error">{errors.items}</p>}
                <br /><br />

                <label id="supplier-label">Supplier</label>
                <br />
                <select id="supplier-select" name="selected" value={selectedSupplier} onChange={handleSupplierChange} required>
                    <option value="">Select Supplier</option>
                    {suppliers.map(supplier => (
                        <option key={supplier.supplierID} value={supplier.supplierName}>
                            {supplier.supplierName}
                        </option>
                    ))}
                </select>
                {errors.supplier && <p id="supplier-error">{errors.supplier}</p>}
                <br /><br />

                <label id="description-label">Description</label>
                <br />
                <textarea
                    id="description-textarea"
                    name="description"
                    value={inputs.description}
                    onChange={handleChange}
                    placeholder="Order Description"
                ></textarea>
                {errors.description && <p id="description-error">{errors.description}</p>}
                <br /><br />

                <label id="status-label">Status</label>
                <br />
                <input id="status-input" type="text" value="Pending" disabled />
                <br /><br />

                <button id="submit-order-button" type="submit">Submit Order</button>
            </form>
        </div>
    );
}

export default AddOrder;
