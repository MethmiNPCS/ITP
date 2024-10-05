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
      <div className="f-container">
        <div className="f-single-card">
          <form className="f-expense-form" onSubmit={handleSubmit}>
            <div className="f-form-header">
              <h1>Add New Expense / Income </h1>
            </div>
            <div className="f-form-body">
              <div className="f-form-group">
                <label htmlFor="amount" className="f-label-title">Amount *</label>
                <input
                  type="number"
                  id="amount"
                  name="amount"
                  className="f-form-input"
                  onChange={handleChange}
                  value={Inputs.amount}
                  placeholder="Enter the amount"
                  required
                />
              </div>
              <div className="f-form-group">
                <label htmlFor="category" className="f-label-title">Category *</label>
                <select
                  id="category"
                  name="category"
                  className="f-form-input"
                  onChange={handleChange}
                  value={Inputs.category}
                  required
                >
                  <option value="" disabled>Select Your Category</option>
                  <option value="Utilities">Utilities</option>
                  <option value="Food">Food</option>
                  <option value="Medicine">Medicine</option>
                  <option value="Salary">Salary</option>
                  <option value="Egg">Egg</option>
                  <option value="Dairy">Dairy</option>
                  <option value="Meat">Meat</option>
                  <option value="Plans">Plans</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="f-form-group">
                <label htmlFor="transactionType" className="f-label-title"> Type *</label>
                <select
                  id="transactionType"
                  name="transactionType"
                  className="f-form-input"
                  onChange={handleChange}
                  value={Inputs.transactionType}
                  required
                >
                  <option value="" disabled>Select Your Type</option>
                  <option value="Income">Income</option>
                  <option value="Expense">Expense</option>
                </select>
              </div>
              <div className="f-form-group">
                <label htmlFor="date" className="f-label-title">Entry Date *</label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  className="f-form-input"
                  onChange={handleChange}
                  value={Inputs.date}
                  required
                />
              </div>
            </div>
            <div className="f-form-footer">
              <div className="f-btn-container">
                <button type="submit" className="f-btn">Add</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddFinance;
