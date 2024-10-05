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
    const columnWidth = (pageWidth - 30) / columns; // Decreased margin and width to save space
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
    filteredMedicines.forEach((medicine) => {
      const y = currentY; // Calculate the Y position for each row
      const maxWidth = columnWidth - 5; // Reduced padding for max width
  
      // Wrap instructions with a maximum width
      const instructionLines = pdf.splitTextToSize(medicine.instructions, maxWidth);
      
      // Write each column's data
      pdf.text(medicine.stockID, 10 + 5, y); // Column 1 (with padding)
      pdf.text(medicine.name, 10 + columnWidth + 5, y, { maxWidth }); // Column 2 (with word wrapping and padding)
      pdf.text(medicine.animal, 10 + 2 * columnWidth + 5, y); // Column 3 (with padding)
      pdf.text(medicine.type, 10 + 3 * columnWidth + 5, y); // Column 4 (with padding)
      pdf.text(medicine.EXD, 10 + 4 * columnWidth + 5, y); // Column 5 (with padding)
      pdf.text(`${medicine.quantity} ${medicine.unit}`, 10 + 5 * columnWidth + 5, y); // Column 6 (with padding)
      pdf.text(`Rs. ${medicine.unitPrice}`, 10 + 6 * columnWidth + 5, y); // Column 7 (with padding)
      pdf.text(`Rs. ${medicine.quantity * medicine.unitPrice}`, 10 + 7 * columnWidth + 5, y); // Column 8 (with padding)
  
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
    <div>
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
