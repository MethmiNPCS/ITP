import React, { useState } from 'react';
import Nav from '../Nav/Nav';
import './Add.css';
import { useNavigate } from "react-router";
import axios from "axios";

function AddFinance() {
  const navigate = useNavigate();
  const [Inputs, setInputs] = useState({
    amount: "",
    category: "",
    transactionType: "",
    date: ""
  });

  const handleChange = (e) => {
    setInputs((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(Inputs);
    try {
      await sendRequest();
      window.alert("Success!");

      // Navigate based on transactionType
      if (Inputs.transactionType === "Income") {
        navigate("/incomedetails");
      } else if (Inputs.transactionType === "Expense") {
        navigate("/financedetails");
      }

    } catch (error) {
      console.error('Error saving data:', error.response ? error.response.data : error.message);
    }
  };

  const sendRequest = async () => {
    try {
      const response = await axios.post("http://localhost:5000/finance", {
        amount: Number(Inputs.amount),
        category: String(Inputs.category),
        transactionType: String(Inputs.transactionType),
        date: new Date(Inputs.date).toISOString(),
      });
      console.log('Data saved successfully:', response.data);
    } catch (error) {
      console.error('Error saving data:', error.response ? error.response.data : error.message);
    }
  };

  return (
    <div>
      <Nav />
      <br />
      <div className="container">
        <div className="single-card">
          <form className="expense-form" onSubmit={handleSubmit}>
            <div className="form-header">
              <h1>Add New Expense / Income </h1>
            </div>
            <div className="form-body">
              <div className="form-group">
                <label htmlFor="amount" className="label-title">Amount *</label>
                <input
                  type="number"
                  id="amount"
                  name="amount"
                  className="form-input"
                  onChange={handleChange}
                  value={Inputs.amount}
                  placeholder="Enter the amount"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="category" className="label-title">Category *</label>
                <select
                  id="category"
                  name="category"
                  className="form-input"
                  onChange={handleChange}
                  value={Inputs.category}
                  required
                >
                  <option value="" disabled>Select Your Category</option>
                  <option value="Utilities">Utilities</option>
                  <option value="Food">Food</option>
                  <option value="Medicine">Medicine</option>
                  <option value="Salary">Salary</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="transactionType" className="label-title"> Type *</label>
                <select
                  id="transactionType"
                  name="transactionType"
                  className="form-input"
                  onChange={handleChange}
                  value={Inputs.transactionType}
                  required
                >
                  <option value="" disabled>Select Your Type</option>
                  <option value="Income">Income</option>
                  <option value="Expense">Expense</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="date" className="label-title">Entry Date *</label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  className="form-input"
                  onChange={handleChange}
                  value={Inputs.date}
                  required
                />
              </div>
            </div>
            <div className="form-footer">
              <div className="btn-container">
                <button type="submit" className="btn">Add Expense</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddFinance;
