import React, { useState, useEffect } from 'react';
import Nav from '../Nav/Nav';
import axios from 'axios';
import './UpdateProduct.css';
import { useNavigate, useParams } from 'react-router-dom';

function UpdateProduct() {
  const [inputs, setInputs] = useState({
    type: '',
    product: '',
    price: 0,
    MFD: '',
    EXP: '',
    quantity: 0
  });
  const [totalPrice, setTotalPrice] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const { id } = useParams(); // Get product ID from URL parameters

  // Defined product prices for auto-calculation
  const productPrices = {
    'Cheese one box': 850,
    'Butter - onepack(50g)': 500,
    'Yoghurt - (1)': 50,
    'Fresh Milk - (1)': 450,
    'Egg - (1)': 25,
    'Meat-Beef one pack': 2600,
    'Meat-Chicken one pack': 900,
    'Meat-Pork one pack': 2700,
    'Coconut': 50,
    'Tea': 200,
    'Nut': 300,
  };

  // Product options based on the type
  const productOptions = {
    Animal: ['Cheese one box', 'Butter - onepack(50g)', 'Yoghurt - (1)', 'Fresh Milk - (1)', 'Egg - (1)', 'Meat-Beef one pack', 'Meat-Chicken one pack', 'Meat-Pork one pack'],
    Plantation: ['Coconut', 'Tea', 'Nut'],
  };

  // Fetch product data on mount
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/products/${id}`);
        const productData = response.data.product; // Assuming the product data is under product

        // Set fetched product data to inputs state
        setInputs({
          type: productData.type,
          product: productData.product,
          price: productData.price,
          MFD: productData.MFD.substring(0, 10), // Ensure the date is in YYYY-MM-DD format
          EXP: productData.EXP.substring(0, 10),
          quantity: productData.quantity
        });
      } catch (error) {
        console.error('Error fetching product:', error);
        setErrorMessage('Failed to fetch product data. Please try again.');
      }
    };

    fetchProduct();
  }, [id]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    const parsedValue = name === 'quantity' ? Number(value) : value;

    setInputs((prevState) => ({
      ...prevState,
      [name]: parsedValue,
    }));

    // Auto-set the price based on the selected product
    if (name === 'product') {
      const newPrice = productPrices[value] || 0;
      setInputs((prevState) => ({
        ...prevState,
        price: newPrice,
      }));
    }

    // Reset EXP if MFD changes
    if (name === 'MFD') {
      setInputs((prevState) => ({
        ...prevState,
        EXP: '', // Clear the EXP field whenever MFD changes
      }));
    }
  };

  // Update total price whenever price or quantity changes
  useEffect(() => {
    const calculatedTotalPrice = inputs.price * inputs.quantity;
    setTotalPrice(calculatedTotalPrice);
  }, [inputs.price, inputs.quantity]);

  // Format date to YYYY-MM-DD
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Get minimum expiry date based on manufacturing date
  const getMinExpiryDate = (mfd) => {
    if (!mfd) return '';
    const mfdDate = new Date(mfd);
    mfdDate.setDate(mfdDate.getDate() + 1);
    return formatDate(mfdDate.toISOString());
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    const formattedMFD = formatDate(inputs.MFD);
    const formattedEXP = formatDate(inputs.EXP);

    // Ensure the expiry date is after the manufacturing date
    if (new Date(formattedEXP) <= new Date(formattedMFD)) {
      setErrorMessage('Expiry date must be after the manufacturing date.');
      return;
    }

    try {
      await sendRequest({
        ...inputs,
        MFD: formattedMFD,
        EXP: formattedEXP,
      });
      window.alert('Product updated successfully!');
      navigate('/productdetails');
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('Failed to update product. Please try again.');
    }
  };

  // Send request to the backend
  const sendRequest = async (formattedInputs) => {
    console.log('Payload to be sent:', formattedInputs); // Log the payload
    try {
      await axios.put(`http://localhost:5000/products/${id}`, {
        type: formattedInputs.type,
        product: formattedInputs.product,
        price: Number(formattedInputs.price),
        MFD: formattedInputs.MFD,
        EXP: formattedInputs.EXP,
        quantity: Number(formattedInputs.quantity),
        Totalprice: Number(formattedInputs.price) * Number(formattedInputs.quantity),
      });
    } catch (error) {
      console.error("Failed to update product:", error.response ? error.response.data : error.message);
      throw new Error(error.response ? error.response.data : error.message);
    }
  };

  return (
    <div className="p-page-container">
      <Nav />
      <div className="p-container">
        <div className="p-form-container">
          <h1 className="p-title">UPDATE PRODUCT</h1>
          <form onSubmit={handleSubmit} className="p-form">
            <div className="p-form-group">
              <label htmlFor="type" className="p-label">Type</label>
              <select
                name="type"
                onChange={handleChange}
                value={inputs.type}
                required
                className="select"
                style={{ width: '550px', height: '40px' }} // Updated style for consistency
              >
                <option value="">Select Type</option>
                <option value="Animal">Animal</option>
                <option value="Plantation">Plantation</option>
              </select>
            </div>

            {inputs.type && (
              <div className="p-form-group">
                <label htmlFor="product" className="p-label">Product</label>
                <select
                  name="product"
                  onChange={handleChange}
                  value={inputs.product}
                  required
                  className="select"
                  style={{ width: '550px', height: '40px' }}
                >
                  <option value="">Select Product</option>
                  {productOptions[inputs.type]?.map((prod, index) => (
                    <option key={index} value={prod}>
                      {prod}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="p-form-group">
              <label htmlFor="price" className="p-label">Price</label>
              <input
                type="number"
                name="price"
                onChange={handleChange}
                value={inputs.price}
                required
                className="input"
                min="0"
                readOnly // Price is read-only as it's auto-set based on product selection
              />
            </div>

            <div className="p-form-group">
              <label htmlFor="MFD" className="p-label">Manufacturing Date</label>
              <input
                type="date"
                name="MFD"
                onChange={handleChange}
                value={inputs.MFD}
                required
                className="input"
              />
            </div>

            <div className="p-form-group">
              <label htmlFor="EXP" className="p-label">Expiry Date</label>
              <input
                type="date"
                name="EXP"
                onChange={handleChange}
                value={inputs.EXP}
                required
                className="input"
                min={getMinExpiryDate(inputs.MFD)}
              />
            </div>

            <div className="p-form-group">
              <label htmlFor="quantity" className="p-label">Quantity</label>
              <input
                type="number"
                name="quantity"
                onChange={handleChange}
                value={inputs.quantity}
                required
                className="input"
                min="0"
              />
            </div>

            <div className="p-form-group">
              <label className="p-label">Total Price</label>
              <input
                type="text"
                value={totalPrice}
                readOnly
                className="input"
              />
            </div>

            {errorMessage && (
              <p className="error-message">{errorMessage}</p>
            )}

            <button type="submit" className="submit-button">UPDATE PRODUCT</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default UpdateProduct;
