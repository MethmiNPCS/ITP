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
        <div id="aadd-order-container">
            <Nav />
            <br />
            <h1 id="aadd-order-header">Add Order</h1>

            <form id="aadd-order-form" onSubmit={handleSubmit}>
                <label id="aorder-id-label">Order ID</label>
                <br />
                <input id="aorder-id-input" type="text" value="Auto-generated" disabled />
                <br /><br />

                <label id="aorder-type-label">Order Type</label>
                <br />
                <input
                    id="aorder-type-food"
                    type="radio"
                    name="orderType"
                    value="Food"
                    checked={inputs.orderType === "Food"}
                    onChange={handleChange}
                    required
                /> Food
                <input
                    id="aorder-type-medicine"
                    type="radio"
                    name="orderType"
                    value="Medicine"
                    checked={inputs.orderType === "Medicine"}
                    onChange={handleChange}
                    required
                /> Medicine
                {errors.orderType && <p id="aorder-type-error">{errors.orderType}</p>}
                <br /><br />

                <label id="aorder-items-label">Order Items</label>
                <br />
                {inputs.items.map((item, index) => (
                    <div key={index} id={`aorder-item-${index}`} className="aorder-item">
                        <input
                            id={`aorder-item-name-${index}`}
                            type="text"
                            name="orderItem"
                            value={item.orderItem}
                            onChange={(e) => handleItemChange(index, e)}
                            placeholder="Item Name"
                            required
                        />
                        {errors[`orderItem-${index}`] && <p id={`aorder-item-error-${index}`} className="aerror-message">{errors[`orderItem-${index}`]}</p>}
                        <input
                            id={`aorder-item-quantity-${index}`}
                            type="number"
                            name="quantity"
                            value={item.quantity}
                            onChange={(e) => handleItemChange(index, e)}
                            placeholder="Quantity"
                            required
                        />
                        {errors[`quantity-${index}`] && <p id={`aorder-item-quantity-error-${index}`} className="aerror-message">{errors[`quantity-${index}`]}</p>}
                        <select
                            id={`aorder-item-unit-${index}`}
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
                            <button id={`aremove-item-button-${index}`} type="button" onClick={() => removeItemField(index)}>-</button>
                        )}
                    </div>
                ))}
                <button id="aadd-item-button" type="button" onClick={addItemField}>+</button>
                {errors.items && <p id="aorder-items-error">{errors.items}</p>}
                <br /><br />

                <label id="asupplier-label">Supplier</label>
                <br />
                <select id="asupplier-select" name="selected" value={selectedSupplier} onChange={handleSupplierChange} required>
                    <option value="">Select Supplier</option>
                    {suppliers.map(supplier => (
                        <option key={supplier.supplierID} value={supplier.supplierName}>
                            {supplier.supplierName}
                        </option>
                    ))}
                </select>
                {errors.supplier && <p id="asupplier-error">{errors.supplier}</p>}
                <br /><br />

                <label id="adescription-label">Description</label>
                <br />
                <textarea
                    id="adescription-textarea"
                    name="description"
                    value={inputs.description}
                    onChange={handleChange}
                    placeholder="Order Description"
                ></textarea>
                {errors.description && <p id="adescription-error">{errors.description}</p>}
                <br /><br />

                <label id="astatus-label">Status</label>
                <br />
                <input id="astatus-input" type="text" value="Pending" disabled />
                <br /><br />

                <button id="asubmit-order-button" type="submit">Submit Order</button>
            </form>
        </div>
    );
}

export default AddOrder;
