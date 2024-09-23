import React from 'react';
import axios from 'axios';
import './Product.css';
import { useNavigate } from 'react-router-dom';

function ProductComponent({ product }) {
  const { _id, name, MFD, type, product: productType, date, quantity } = product; // Rename product to productType
  const navigate = useNavigate();

  const deleteHandler = async () => {
    const userConfirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );
    if (userConfirmed) {
      try {
        await axios.delete(`http://localhost:5000/products/${_id}`);
        window.alert("Product deleted successfully!");
        navigate('/productdetails');
      } catch (error) {
        console.error('Error deleting product:', error);
        window.alert('Failed to delete the product. Please try again.');
      }
    }
  };

  const updateHandler = () => {
    navigate(`/updateproduct/${_id}`);
  };

  return (
    <div className="container">
      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th className="header">Name</th>
              <th className="header">MFD</th>
              <th className="header">Type</th>
              <th className="header">Product</th>
              <th className="header">Date</th>
              <th className="header">Quantity</th>
              <th className="header">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid #ddd' }}>
              <td className="cell">{name}</td>
              <td className="cell">{MFD}</td>
              <td className="cell">{type}</td>
              <td className="cell">{productType}</td> {/* Use the renamed productType */}
              <td className="cell">{date}</td>
              <td className="cell">{quantity}</td>
              <td className="cell">
                <button className="delete-button" onClick={deleteHandler}>
                  Delete
                </button>
                <button className="button" onClick={updateHandler}>
                  Update
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ProductComponent;
