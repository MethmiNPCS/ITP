import React, { useState, useEffect, useRef } from 'react';
import Nav from '../Nav/Nav';
import axios from 'axios';
import '../../Stocks/Stock.css';
import { Link } from 'react-router-dom';
import jsPDF from 'jspdf';

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
  
    // Fetch the favicon image as Base64
    const faviconPath = "/favicon.ico"; // path to the favicon in the public folder
    const img = new Image();
    img.src = faviconPath;
  
    img.onload = () => {
      const pdf = new jsPDF();
  
      // Add the favicon image to the PDF
      const imgWidth = 20;  // width of the image
      const imgHeight = 20; // height of the image
      const imgX = 10;      // X coordinate for the image
      const imgY = 20;      // Y coordinate for the image
      pdf.addImage(img, 'PNG', imgX, imgY, imgWidth, imgHeight); // Add favicon to PDF
  
      // Add titles
      pdf.setFontSize(16);
      const title = "NATIONAL SEMINARY FARM";
      const subtitle = "Inventory Report - Animal Foods";
      const pageWidth = pdf.internal.pageSize.getWidth();
  
      // Center title (adjusted to leave space for the logo)
      const titleWidth = pdf.getStringUnitWidth(title) * pdf.internal.getFontSize() / pdf.internal.scaleFactor;
      const titleX = (pageWidth - titleWidth) / 2; // Centered X coordinate for the title
  
      const subtitleWidth = pdf.getStringUnitWidth(subtitle) * pdf.internal.getFontSize() / pdf.internal.scaleFactor;
      const subtitleX = (pageWidth - subtitleWidth) / 2; // Centered X coordinate for the subtitle
  
      // Draw rectangle around logo and titles
      const rectX = 5; // X coordinate for the rectangle
      const rectY = 15; // Y coordinate for the rectangle
      const rectWidth = pageWidth - 10; // Full width, leaving padding
      const rectHeight = 35; // Height enough to contain logo and titles
      pdf.rect(rectX, rectY, rectWidth, rectHeight); // Draw rectangle
  
      // Set bold font for the titles
      pdf.setFont("helvetica", "bold");
  
      // Adjusted Y coordinates for titles
      pdf.text(title, titleX, 30); // Adjusted Y coordinate to align with the logo
      pdf.text(subtitle, subtitleX, 40); // Adjusted Y coordinate for the subtitle
  
      // *** Add Generate Date Below the Subtitle ***
      const generateDate = `Generate Date: ${new Date().toLocaleDateString()}`; // Get the current date
      pdf.setFontSize(10); // Set a smaller font size for the date
      const dateWidth = pdf.getStringUnitWidth(generateDate) * pdf.internal.getFontSize() / pdf.internal.scaleFactor;
      const dateX = (pageWidth - dateWidth) / 2; // Center the date
      pdf.text(generateDate, dateX, 45); // Display the date below the subtitle
  
      // Add a gap between the rectangle and the report content
      const gapAfterRectangle = 10; // Add a 10 units gap after the rectangle
      const startY = rectY + rectHeight + gapAfterRectangle; // Starting Y position for the table after the gap
  
      // Reset font to normal for table content
      pdf.setFont("helvetica", "normal");
  
      // Add a table (logic remains the same)
      const columnHeaders = ["Stock ID", "Name", "Animal", "Stock Type", "Entry Date", "Quantity", "Unit Price", "Total Price"];
      const columns = columnHeaders.length;
  
      const columnWidth = (pageWidth - 30) / columns; // Default width for all columns
      const rowHeight = 10; // Default row height for better spacing
  
      pdf.setFontSize(10);
      pdf.setTextColor(255, 255, 255);
      pdf.setFillColor(0, 128, 0); // Green background
      pdf.rect(10, startY, pageWidth - 20, rowHeight, 'F'); // Header background
  
      columnHeaders.forEach((header, index) => {
        const headerX = 10 + index * columnWidth + columnWidth / 2;
        pdf.text(header, headerX, startY + (rowHeight / 2), { align: "center" });
      });
  
      pdf.setTextColor(0); // Reset to black text
  
      let currentY = startY + rowHeight + 5;
      filteredFoods.forEach((food) => {
        const y = currentY;
        const maxWidth = columnWidth - 5;
  
        pdf.text(food.stockID, 10 + 5, y);
        pdf.text(food.name, 10 + columnWidth + 5, y, { maxWidth });
        pdf.text(food.animal, 10 + 2 * columnWidth + 5, y);
        pdf.text(food.type, 10 + 3 * columnWidth + 5, y);
        pdf.text(food.EXD, 10 + 4 * columnWidth + 5, y);
        pdf.text(`${food.quantity} ${food.unit}`, 10 + 5 * columnWidth + 5, y);
        pdf.text(`Rs. ${food.unitPrice}`, 10 + 6 * columnWidth + 5, y);
        pdf.text(`Rs. ${food.quantity * food.unitPrice}`, 10 + 7 * columnWidth + 5, y);
  
        currentY += rowHeight + 5;
      });
  
      pdf.save("Food_report.pdf");
    };
  
    img.onerror = () => {
      console.error("Failed to load favicon.");
    };
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
    <div className="pt-16">
      <Nav />
      <br/>     
      <div className='header-container flex flex-col md:flex-row justify-between items-center p-6 bg-white-100 rounded-lg mb-6'>
        <button
          onClick={handlePrint}
          className="download-button bg-orange-400 text-white font-semibold px-5 py-3 rounded-lg shadow-md hover:bg-orange-700 transition duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-orange-300"
        >
          Download Report
        </button>

        <h1 className="text-2xl font-bold text-gray-800 mt-4 md:mt-0 md:mx-6">
          AVAILABLE FOOD ITEMS
        </h1>

        <div className="flex items-center justify-center w-full md:w-auto mt-4 md:mt-0">
          <input
            onChange={handleSearchChange}
            value={searchQuery}
            type="text"
            name="search"
            placeholder="Search Foods"
            className="w-full md:w-80 px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-300 ease-in-out"
          />
        </div>
      </div>


      {noResults ? (
        <div className="centered-box flex justify-center items-center min-h-[50vh]">
          <div className="no-foods-message bg-red-200 text-red-800 text-xl font-bold p-6 rounded-lg border-2  border-red-400 shadow-md">
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
