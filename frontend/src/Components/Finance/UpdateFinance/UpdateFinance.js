import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router';
import Nav from '../Nav/Nav';
import '../UpdateFinance/UF.css';

function UpdateFinance() {
  const [Inputs, setInputs] = useState({});
  const history = useNavigate();
  const id = useParams().id;

  useEffect(() => {
    const fetchHandler = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/finance/${id}`);
        console.log("Fetched finance data:", response.data);
        setInputs(response.data.financeItem);
      } catch (error) {
        console.error("Error fetching finance item:", error);
      }
    };
    fetchHandler();
  }, [id]);

  const sendRequest = async () => {
    console.log("Sending update request with:", Inputs); // Log the request data
    try {
      const response = await axios.put(`http://localhost:5000/finance/${id}`, {
        amount: Number(Inputs.amount),
        category: Inputs.category,
        transactionType: Inputs.transactionType,
        date: new Date(Inputs.date).toISOString(),
      });
      return response.data;
    } catch (error) {
      console.error("Error updating finance:", error);
    }
  };

  const handleChange = (e) => {
    setInputs((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendRequest().then(() => history('/financedetails'));
  };

  return (
    <div>
      <Nav /><br />
      <div className="fu-container">
        <div className="fu-single-card">
          <form className="fu-expense-form" onSubmit={handleSubmit}>
            <div className="fu-form-header">
              <h1> Update </h1>
            </div>
            <div className="fu-form-body">
              <div className="fu-form-group">
                <label htmlFor="amount" className="fu-label-title">Amount *</label>
                <input
                  type="number"
                  id="amount"
                  name="amount"
                  className="fu-form-input"
                  onChange={handleChange}
                  value={Inputs.amount}
                  placeholder="Enter the amount"
                  required
                />
              </div>
              <div className="fu-form-group">
                <label htmlFor="category" className="fu-label-title">Category *</label>
                <select
                  id="category"
                  name="category"
                  className="fu-form-input"
                  onChange={handleChange}
                  value={Inputs.category}
                  required
                >
                  <option value="" disabled>Select Your Category</option>
                  <option value="Electricity Bill">Electricity Bill</option>
                  <option value="Water Bill">Water Bill</option>
                  <option value="Petty cash">Petty cash</option>
                  <option value="Additional Salary payment">Additional Salary payment </option>
                  <option value="Welfare">Welfare </option>
                  <option value="Donation">Donation</option>
                  <option value="Tax Payment">Tax Payment</option>
                  <option value="Additional Orders">Additional Orders</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="fu-form-group">
                <label htmlFor="transactionType" className="fu-label-title"> Type *</label>
                <select
                  id="transactionType"
                  name="transactionType"
                  className="fu-form-input"
                  onChange={handleChange}
                  value={Inputs.transactionType}
                  required
                >
                  <option value="" disabled>Select Your Type</option>
                  <option value="Income">Income</option>
                  <option value="Expense">Expense</option>
                </select>
              </div>
              <div className="fu-form-group">
                <label htmlFor="date" className="fu-label-title">Entry Date *</label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  className="fu-form-input"
                  onChange={handleChange}
                  value={Inputs.date}
                  required
                />
              </div>
            </div>
            <div className="fu-form-footer">
              <div className="fu-btn-container">
                <button type="submit" className="fu-btn">Conform</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default UpdateFinance;
