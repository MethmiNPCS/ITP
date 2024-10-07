import React from 'react';
import { Link } from 'react-router-dom';
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import '../Finance/Finance.css'

function Finance({ finance }) {
  const { _id, amount, date, category, transactionType } = finance;
  const navigate = useNavigate();

  // Delete handler with a more efficient page update (avoiding full reload)
  const deleteHandler = async () => {
    try {
      await axios.delete(`http://localhost:5000/finance/${_id}`);
      // Instead of a full reload, navigate back or trigger a state change if necessary
      navigate(0);  // Navigate back to refresh component
    } catch (error) {
      console.error("Error deleting finance record:", error);
    }
  };

   return (
    <div class>
      <table >
        <tbody>
          <tr>
            <td>{_id}</td>
            <td>{date}</td>
            <td>{transactionType}</td>
            <td>{category}</td>
            <td>{amount}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}


export default Finance;
