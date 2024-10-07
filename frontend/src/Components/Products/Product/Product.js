import React from 'react';
import axios from 'axios';
import './Product.css';
import { useNavigate } from 'react-router-dom';

function ProductComponent({ product }) {
  // Destructure the product object to get the required fields
  const { _id, type, product: productName, price, MFD, EXP, quantity, Totalprice } = product;
  const navigate = useNavigate();

  // Calculate total price if not provided by the backend
  const calculatedTotalPrice = price && quantity ? (price * quantity).toFixed(2) : 'N/A';

  // Handler for deleting the product
  const deleteHandler = async () => {
    const userConfirmed = window.confirm("Are you sure you want to delete this product?");
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

  // Handler for updating the product
  const updateHandler = () => {
    navigate(`/updateproduct/${_id}`);
  };

  return (
    <div className="container">
      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th className="header">ID</th>
              <th className="header">Type</th>
              <th className="header">Product</th>
              <th className="header">Price</th>
              <th className="header">MFD</th>
              <th className="header">EXP</th>
              <th className="header">Quantity</th>
              <th className="header">Total Price</th>
              <th className="header">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid #ddd' }}>
              <td className="cell">{_id}</td> {/* Display unique ID */}
              <td className="cell">{type}</td> {/* Display type */}
              <td className="cell">{productName}</td> {/* Display product name */}
              <td className="cell">{price !== undefined ? price.toFixed(2) : 'N/A'}</td> {/* Display price */}
              <td className="cell">{MFD ? new Date(MFD).toLocaleDateString() : 'N/A'}</td> {/* Format MFD date if present */}
              <td className="cell">{EXP ? new Date(EXP).toLocaleDateString() : 'N/A'}</td> {/* Format EXP date if present */}
              <td className="cell">{quantity}</td> {/* Display quantity */}
              <td className="cell">{Totalprice !== undefined ? Totalprice.toFixed(2) : calculatedTotalPrice}</td> {/* Display Total Price */}
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
