import React, { useState, useEffect, useRef } from 'react';
import Nav from '../Nav/Nav';
import axios from 'axios';
import '../../Stocks/Stock.css';
import { Link } from 'react-router-dom';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const URL = "http://localhost:5000/stocks";

const fetchHandler = async () => {
  try {
    const response = await axios.get(URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

function Foods() {
  const [foods, setFoods] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredFoods, setFilteredFoods] = useState([]);
  const [noResults, setNoResults] = useState(false);

  useEffect(() => {
    fetchHandler().then((data) => {
      const foodItems = data.stocks.filter(stock => stock.type === 'Food');
      setFoods(foodItems);
      setFilteredFoods(foodItems);
    });
  }, []);

  const ComponentsRef = useRef();

  const generatePDF = () => {
    if (filteredFoods.length === 0) {
      alert("No items available to download");
      return;
    }

    html2canvas(ComponentsRef.current).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();

      const imgWidth = 210; 
      //const pageHeight = 295; 
      const imgHeight = canvas.height * imgWidth / canvas.width;
      //let heightLeft = imgHeight;

      const position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      //heightLeft -= pageHeight;

      pdf.save("food_report.pdf");
    });
  };

  const handlePrint = () => {
    generatePDF();
  };

  const handleSearch = (query) => {
    if (query === "") {
      // Reset to full list when search query is cleared
      setFilteredFoods(foods);
      setNoResults(false);
    } else {
      const results = foods.filter((food) =>
        Object.values(food).some((field) =>
          field.toString().toLowerCase().includes(query.toLowerCase())
        )
      );
      setFilteredFoods(results);
      setNoResults(results.length === 0);
    }
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    handleSearch(query); // Automatically filter as the user types
  };

  // Define the handleDelete function
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this item?");
    if (confirmDelete) {
      try {
        await axios.delete(`${URL}/${id}`);
        setFoods(prevFoods => prevFoods.filter(food => food._id !== id));
        setFilteredFoods(prevFilteredFoods => prevFilteredFoods.filter(food => food._id !== id));
        alert("Item deleted successfully.");
      } catch (error) {
        console.error("Error deleting item:", error);
        alert("Failed to delete the item.");
      }
    }
  };

  // Define the handleMessage function for low stock alerts
  const handleMessage = (name) => {
    // Create the WhatsApp Chat URL
    const phoneNumber = "94772224268";
    const message = `Low Food Stock alert: The stock for ${name} is running low. Please restock soon.`;
    const WhatsAppUrl = `https://web.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(
      message
    )}`;

    // Open the whatsapp chat in new window
    window.open(WhatsAppUrl, "_blank");
  }

  return (
    <div>
      <Nav />
      <br/>
      <div className='header-container'>
        <button onClick={handlePrint} className="download-button">Download Report</button>
        <h1 className='centered-heading'>Available Foods</h1>

        <div className="flex items-center justify-center p-4">
          <input
            onChange={handleSearchChange}
            value={searchQuery}
            type="text"
            name="search"
            placeholder="Search Foods"
            className="w-full md:w-3/4 lg:w-2/3 px-6 py-3 text-gray-700 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 shadow-lg transition duration-300 ease-in-out"
          />
        </div>
      </div>

      {noResults ? (
        <div className="centered-box">
          <div className="no-foods-message">
            Not Found
          </div>
        </div>
      ) : (
        <div ref={ComponentsRef} className="overflow-x-auto">
          <table className="min-w-full mx-auto table-auto border-collapse border border-gray-300 mt-6">
            <thead>
              <tr className="bg-green-500 text-white">
                <th className="border border-gray-300 px-6 py-3 text-center">Stock ID</th>
                <th className="border border-gray-300 px-6 py-3 text-center">Name</th>
                <th className="border border-gray-300 px-6 py-3 text-center">Animal</th>
                <th className="border border-gray-300 px-6 py-3 text-center">Stock Type</th>
                <th className="border border-gray-300 px-6 py-3 text-center">Entry Date</th>
                <th className="border border-gray-300 px-6 py-3 text-center">Quantity</th>
                <th className="border border-gray-300 px-6 py-3 text-center">Unit Price</th>
                <th className="border border-gray-300 px-6 py-3 text-center">Total Price</th>
                <th className="border border-gray-300 px-6 py-3 text-center">Instructions</th>
                <th className="border border-gray-300 px-6 py-3 text-center">Update</th>
                <th className="border border-gray-300 px-6 py-3 text-center">Delete</th>
                <th className="border border-gray-300 px-6 py-3 text-center">Low Stock Alert</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {filteredFoods.length > 0 ? (
                filteredFoods.map((food) => (
                  <tr key={food._id} className="hover:bg-gray-100 transition">
                    <td className="border border-gray-300 px-6 py-3 text-center">{food.stockID}</td>
                    <td className="border border-gray-300 px-6 py-3 text-center">{food.name}</td>
                    <td className="border border-gray-300 px-6 py-3 text-center">{food.animal}</td>
                    <td className="border border-gray-300 px-6 py-3 text-center">{food.type}</td>
                    <td className="border border-gray-300 px-6 py-3 text-center">{food.EXD}</td>
                    <td className="border border-gray-300 px-6 py-3 text-center">{food.quantity} {food.unit}</td>
                    <td className="border border-gray-300 px-6 py-3 text-center">Rs. {food.unitPrice}</td>
                    <td className="border border-gray-300 px-6 py-3 text-center">Rs. {food.quantity * food.unitPrice}</td>
                    <td className="border border-gray-300 px-6 py-3 text-center">{food.instructions}</td>
                    <td className="border border-gray-300 px-6 py-3 text-center">
                      <Link to={`/fooddetails/${food._id}`}>
                        <button className="bg-blue-500 text-white px-4 py-2 rounded">Update</button>
                      </Link>
                    </td>
                    <td className="border border-gray-300 px-6 py-3 text-center">
                      <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600" onClick={() => handleDelete(food._id)}>Delete</button>
                    </td>
                    <td className="border border-gray-300 px-6 py-3 text-center">
                      <button className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600" onClick={() => handleMessage(food.name)}>Send Alert</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="12" className="text-center text-red-500 py-6">
                    No Foods Available <br /> <br />
                    <Link to="/addfood" className="bg-green-500 text-white px-4 py-2 rounded">ADD NEW ITEM</Link>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Foods;
