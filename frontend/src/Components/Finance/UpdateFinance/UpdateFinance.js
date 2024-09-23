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
      <div className="container">
        <div className="single-card">
          <form className="expense-form" onSubmit={handleSubmit}>
            <div className="form-header">
              <h1> Update </h1>
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
                <label htmlFor="transactionType" className="label-title">Transaction Type *</label>
                <select
                  id="transactionType"
                  name="transactionType"
                  className="form-input"
                  onChange={handleChange}
                  value={Inputs.transactionType}
                  required
                >
                  <option value="" disabled>Select Your Transaction Type</option>
                  <option value="Bank">Bank</option>
                  <option value="Card">Card</option>
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
                <button type="submit" className="btn">Conform Update</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default UpdateFinance;