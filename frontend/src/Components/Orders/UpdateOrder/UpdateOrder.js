import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Nav from '../Nav/Nav';
import './UpdateOrder.css'
import { useParams, useNavigate } from 'react-router-dom';

function UpdateOrder() {
    const [inputs, setInputs] = useState({});
    const [suppliers, setSuppliers] = useState([]);
    const [selectedSupplier, setSelectedSupplier] = useState('');
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();
    const { orderID } = useParams();

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/orders/${orderID}`);
                setInputs(response.data.order);
                setSelectedSupplier(response.data.order.supplier || '');
            } catch (err) {
                console.error("Error fetching order:", err);
            }
        };

        const fetchSuppliers = async () => {
            try {
                const response = await axios.get('http://localhost:5000/suppliers');
                setSuppliers(response.data.suppliers);
            } catch (err) {
                console.error("Error fetching suppliers:", err);
            }
        };

        fetchOrder();
        fetchSuppliers();
    }, [orderID]);

    const handleItemChange = (index, e) => {
        const { name, value } = e.target;
        const newItems = [...inputs.items];
        newItems[index] = { ...newItems[index], [name]: value };
        setInputs({ ...inputs, items: newItems });
    };

    const removeItemField = (index) => {
        const newItems = inputs.items.filter((_, i) => i !== index);
        setInputs({ ...inputs, items: newItems });
    };

    const addItemField = () => {
        setInputs((prevInputs) => ({
            ...prevInputs,
            items: [...prevInputs.items, { orderItem: '', quantity: '', unit: 'g' }],
        }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setInputs({ ...inputs, [name]: value });
    };

    const handleSupplierChange = (e) => {
        setSelectedSupplier(e.target.value);
    };

    const validateForm = () => {
        let isValid = true;
        const newErrors = {};

        if (!inputs.items.length) {
            newErrors.items = "At least one item is required.";
            isValid = false;
        }

        inputs.items.forEach((item, index) => {
            if (!item.quantity) {
                newErrors[`quantity-${index}`] = "Quantity is required.";
                isValid = false;
            } else if (isNaN(item.quantity) || parseFloat(item.quantity) <= 0) {
                newErrors[`quantity-${index}`] = "Enter a valid quantity";
                isValid = false;
            }
        });

        setErrors(newErrors);
        return isValid;
    };

    const sendRequest = async () => {
        try {
            await axios.put(`http://localhost:5000/orders/${orderID}`, {
                items: inputs.items.map(item => ({
                    ...item,
                    orderItem: item.orderItem, // Ensure item names are included
                })),
                description: inputs.description,
            });
        } catch (err) {
            console.error("Error updating order:", err);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            sendRequest().then(() => navigate('/orderdetails'));
        }
    };

    const handleCancel = () => {
        navigate('/vieworder');
    };

    return (
        <div className='pt-20'>
        <div id="uupdate-order-container">
            <Nav />
            <br/>
            <h1 id="uupdate-order-title">Update Order</h1>
            <form id="uupdate-order-form" onSubmit={handleSubmit} style={{maxWidth: 790}}>
                <label id="uorder-id-label">Order ID</label>
                <br />
                <input id="uorder-id-input" type="text" value={orderID} disabled />
                <br /><br />

                <label id="uorder-type-label">Order Type</label>
                <br />
                <input
                    id="uorder-type-food"
                    type="radio"
                    name="orderType"
                    value="Food"
                    checked={inputs.orderType === "Food"}
                    disabled
                /> Food
                <input
                    id="uorder-type-medicine"
                    type="radio"
                    name="orderType"
                    value="Medicine"
                    checked={inputs.orderType === "Medicine"}
                    disabled
                /> Medicine
                <br /><br />

                <label id="uorder-items-label">Order Items</label>
                <br />
                {inputs.items && inputs.items.map((item, index) => (
                    <div key={index} id={`uorder-item-row-${index}`} style={{ display: 'flex', alignItems: 'center' }}>
                        <input
                            id={`uorder-item-name-${index}`}
                            type="text"
                            name="orderItem"
                            value={item.orderItem}
                            disabled
                            placeholder="Item Name"
                        />
                        <input
                            id={`uorder-item-quantity-${index}`}
                            type="number"
                            name="quantity"
                            value={item.quantity}
                            onChange={(e) => handleItemChange(index, e)}
                            placeholder="Quantity"
                            required
                            style={{ marginLeft: '10px' }}
                        />
                        {errors[`quantity-${index}`] && <p id={`uorder-error-quantity-${index}`} style={{ color: 'red', marginLeft: '10px' }}>{errors[`quantity-${index}`]}</p>}
                        <select
                            id={`uorder-item-unit-${index}`}
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
                            <button id={`uremove-item-button-${index}`} type="button" onClick={() => removeItemField(index)} style={{ marginLeft: '10px' }}>-</button>
                        )}
                    </div>
                ))}
                <button id="uadd-item-button" type="button" onClick={addItemField} style={{ marginTop: '10px', fontSize: '20px' }}>+</button>
                {errors.items && <p id="uorder-error-items" style={{ color: 'red' }}>{errors.items}</p>}
                <br /><br />

                <label id="usupplier-label">Supplier</label>
                <br />
                <input id="usupplier-input" type="text" value={selectedSupplier} disabled />
                <br /><br />

                <label id="udescription-label">Description</label>
                <br />
                <textarea
                    id="udescription-input"
                    name="description"
                    value={inputs.description}
                    onChange={handleChange}
                    placeholder="Order Description"
                ></textarea>
                {errors.description && <p id="udescription-error" style={{ color: 'red' }}>{errors.description}</p>}
                <br /><br />

                <label id="ustatus-label">Status</label>
                <br />
                <input id="ustatus-input" type="text" value="Pending" disabled />
                <br /><br />

                <button id="uupdate-order-button" type="submit">Update Order</button>
                <button id="ucancel-order-button" type="button" onClick={handleCancel}>Cancel</button>
            </form>
        </div>
        </div>
    );
}

export default UpdateOrder;
