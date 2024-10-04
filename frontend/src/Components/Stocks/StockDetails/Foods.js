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
  
    const pdf = new jsPDF();
  
    // Add titles
    pdf.setFontSize(16);
    const title = "National Seminary Farm";
    const subtitle = "Inventory Report";
    const pageWidth = pdf.internal.pageSize.getWidth();
  
    // Center title
    const titleWidth = pdf.getStringUnitWidth(title) * pdf.internal.getFontSize() / pdf.internal.scaleFactor;
    pdf.text(title, (pageWidth - titleWidth) / 2, 20); // Centered title
  
    // Center subtitle
    const subtitleWidth = pdf.getStringUnitWidth(subtitle) * pdf.internal.getFontSize() / pdf.internal.scaleFactor;
    pdf.text(subtitle, (pageWidth - subtitleWidth) / 2, 30); // Centered subtitle
  
    // Add a table
    const startY = 40; // Starting position for the table
    const columnHeaders = ["Stock ID", "Name", "Animal", "Stock Type", "Entry Date", "Quantity", "Unit Price", "Total Price", "Instructions"];
    const columns = columnHeaders.length;
  
    // Set the column width and row height
    const columnWidth = (pageWidth - 30) / (columns); // Default width for all columns
    const rowHeight = 10; // Default row height for better spacing
  
    // Add column headers
    pdf.setFontSize(10);
    pdf.setTextColor(255, 255, 255);
    pdf.setFillColor(0, 128, 0); // Green background
    pdf.rect(10, startY, pageWidth - 20, rowHeight, 'F'); // Header background
  
    columnHeaders.forEach((header, index) => {
      // Center text in header
      const headerX = 10 + index * columnWidth + columnWidth / 2;
      pdf.text(header, headerX, startY + (rowHeight / 2), { align: "center" }); // Centered header
    });
  
    // Add rows
    pdf.setTextColor(0); // Reset to black text
  
    let currentY = startY + rowHeight + 5; // Start position for the first data row (5 units below the header)
    filteredFoods.forEach((food) => {
      const y = currentY; // Calculate the Y position for each row
      const maxWidth = columnWidth - 5; // Reduced padding for max width
  
      // Wrap instructions with a maximum width
      const instructionLines = pdf.splitTextToSize(food.instructions, maxWidth);
      
      // Write each column's data
      pdf.text(food.stockID, 10 + 5, y); // Column 1 (with padding)
      pdf.text(food.name, 10 + columnWidth + 5, y, { maxWidth }); // Column 2 (with word wrapping and padding)
      pdf.text(food.animal, 10 + 2 * columnWidth + 5, y); // Column 3 (with padding)
      pdf.text(food.type, 10 + 3 * columnWidth + 5, y); // Column 4 (with padding)
      pdf.text(food.EXD, 10 + 4 * columnWidth + 5, y); // Column 5 (with padding)
      pdf.text(`${food.quantity} ${food.unit}`, 10 + 5 * columnWidth + 5, y); // Column 6 (with padding)
      pdf.text(`Rs. ${food.unitPrice}`, 10 + 6 * columnWidth + 5, y); // Column 7 (with padding)
      pdf.text(`Rs. ${food.quantity * food.unitPrice}`, 10 + 7 * columnWidth + 5, y); // Column 8 (with padding)
  
      // Draw instructions and adjust Y position accordingly
      instructionLines.forEach((line, index) => {
        pdf.text(line, 10 + 8 * columnWidth + 5, y + index * rowHeight); // Column 9 (with padding)
      });
  
      // Draw horizontal line below the entire content of the row
      const totalRowHeight = rowHeight * Math.max(1, instructionLines.length) + 5; // Calculate total height needed for the row
  
      // Adjust the current Y position based on the number of lines for instructions
      currentY += totalRowHeight; // Update the current Y position for the next row
    });
  
    pdf.save("medicine_report.pdf");
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
