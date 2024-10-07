import React from 'react';
import '../../Stocks/Stock.css';
import { Link } from 'react-router-dom';
import axios from "axios";
import { useNavigate } from 'react-router-dom';

function Medicine(props) {
  const { _id, stockID, name, animal, type, EXD, quantity, unitPrice, unit, instructions } = props.medicine;

  const history = useNavigate();

  const deleteHandler = async () => {
    await axios.delete(`http://localhost:5000/stocks/${_id}`)
      .then(() => {
        window.location.reload(); // Force a full page reload
      });
  };

  const handleMessage = () => {
    // Create the WhatsApp Chat URL
    const phoneNumber = "94772224268";
    const message = `Low Medicine stock alert: The stock for ${name} is running low. Please restock soon.`;
    const WhatsAppUrl = `https://web.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(
      message
    )}`;

    // Open the whatsapp chat in new window
    window.open(WhatsAppUrl, "_blank");
  }

  // Calculate Total Price
  const totalPrice = quantity * unitPrice;

  return (
    <div className="stock-container"> 
      <h1 className='small-heading'>Medicine Details</h1>
      <br />
      <p><b>ID : </b>{stockID}</p>
      <p><b>Name: </b>{name}</p>
      <p><b>Animal : </b>{animal}</p>
      <p><b>Stock type : </b>{type}</p>
      <p><b>Entry Date : </b>{EXD}</p>
      <p><b>Quantity : </b>{quantity} {unit}</p>
      <p><b>Unit Price :</b> Rs.{unitPrice}</p>
      <p><b>Total Price : </b>Rs. {totalPrice}</p>
      <p><b>Instructions : </b>{instructions}</p>
      <br/>
      <Link to={`/medicinedetails/${_id}`}>
        <button className="s-update-button">Update</button>
      </Link>
      <button className="s-delete-button" onClick={deleteHandler}>Delete</button>
      <button className="s-low-stock-button" onClick={handleMessage}>Send Low Stock Alert</button>
    </div>
  );
}

export default Medicine;
