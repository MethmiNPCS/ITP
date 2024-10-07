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

function Medicines() {
  const [medicines, setMedicines] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredMedicines, setFilteredMedicines] = useState([]);
  const [noResults, setNoResults] = useState(false);
  const componentsRef = useRef();

  useEffect(() => {
    fetchHandler().then((data) => {
      const medicineItems = data.stocks.filter(stock => stock.type === 'Medicine');
      setMedicines(medicineItems);
      setFilteredMedicines(medicineItems);
    });
  }, []);

  const generatePDF = () => {
    if (filteredMedicines.length === 0) {
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
      const subtitle = "Inventory Report - Animal Medicines";
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
  
      // Add a table (Updated: Removed Instructions)
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
      filteredMedicines.forEach((medicine) => {
        const y = currentY;
  
        pdf.text(medicine.stockID, 10 + 5, y);
        pdf.text(medicine.name, 10 + columnWidth + 5, y);
        pdf.text(medicine.animal, 10 + 2 * columnWidth + 5, y);
        pdf.text(medicine.type, 10 + 3 * columnWidth + 5, y);
        pdf.text(medicine.EXD, 10 + 4 * columnWidth + 5, y);
        pdf.text(`${medicine.quantity} ${medicine.unit}`, 10 + 5 * columnWidth + 5, y);
        pdf.text(`Rs. ${medicine.unitPrice}`, 10 + 6 * columnWidth + 5, y);
        pdf.text(`Rs. ${medicine.quantity * medicine.unitPrice}`, 10 + 7 * columnWidth + 5, y);
  
        currentY += rowHeight + 5;
      });
  
      pdf.save("Medicine_report.pdf");
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
      setFilteredMedicines(medicines);
      setNoResults(false);
    } else {
      const results = medicines.filter((medicine) =>
        Object.values(medicine).some((field) =>
          field.toString().toLowerCase().includes(query.toLowerCase())
        )
      );
      setFilteredMedicines(results);
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
        setMedicines(prevMedicines => prevMedicines.filter(medicine => medicine._id !== id));
        setFilteredMedicines(prevFilteredMedicines => prevFilteredMedicines.filter(medicine => medicine._id !== id));
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
    const message = `Low Medicine Stock alert: The stock for ${name} is running low. Please restock soon.`;
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
          AVAILABLE MEDICINE ITEMS
        </h1>

        <div className="flex items-center justify-center w-full md:w-auto mt-4 md:mt-0">
          <input
            onChange={handleSearchChange}
            value={searchQuery}
            type="text"
            name="search"
            placeholder="Search Medicines"
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
        <div ref={componentsRef} className="overflow-x-auto">
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
              {filteredMedicines.length > 0 ? (
                filteredMedicines.map((medicine) => (
                  <tr key={medicine._id} className="hover:bg-gray-100 transition">
                    <td className="border border-gray-300 px-6 py-3 text-center">{medicine.stockID}</td>
                    <td className="border border-gray-300 px-6 py-3 text-center">{medicine.name}</td>
                    <td className="border border-gray-300 px-6 py-3 text-center">{medicine.animal}</td>
                    <td className="border border-gray-300 px-6 py-3 text-center">{medicine.type}</td>
                    <td className="border border-gray-300 px-6 py-3 text-center">{medicine.EXD}</td>
                    <td className="border border-gray-300 px-6 py-3 text-center">{medicine.quantity} {medicine.unit}</td>
                    <td className="border border-gray-300 px-6 py-3 text-center">Rs. {medicine.unitPrice}</td>
                    <td className="border border-gray-300 px-6 py-3 text-center">Rs. {medicine.quantity * medicine.unitPrice}</td>
                    <td className="border border-gray-300 px-6 py-3 text-center">{medicine.instructions}</td>
                    <td className="border border-gray-300 px-6 py-3 text-center">
                      <Link to={`/medicinedetails/${medicine._id}`}>
                        <button className="bg-blue-500 text-white px-4 py-2 rounded">Update</button>
                      </Link>
                    </td>
                    <td className="border border-gray-300 px-6 py-3 text-center">
                      <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600" onClick={() => handleDelete(medicine._id)}>Delete</button>
                    </td>
                    <td className="border border-gray-300 px-6 py-3 text-center">
                      <button className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600" onClick={() => handleMessage(medicine.name)}>Send Alert</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="12" className="text-center text-red-500 py-6">
                    No Medicines Available <br /> <br />
                    <Link to="/addmedicine" className="bg-green-500 text-white px-4 py-2 rounded">Add New Medicine</Link>
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

export default Medicines;
