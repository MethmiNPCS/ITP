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

    html2canvas(componentsRef.current).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();

      const imgWidth = 210; // A4 width in mm
      const imgHeight = canvas.height * imgWidth / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save("medicine_report.pdf");
    });
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
      <div className='header-container'>
        <button onClick={handlePrint} className="download-button">Download Report</button>
        <h1 className='centered-heading'>Available Medicines</h1>

        <div className="flex items-center justify-center p-4">
          <input
            onChange={handleSearchChange}
            value={searchQuery}
            type="text"
            name="search"
            placeholder="Search Medicines"
            className="w-full md:w-3/4 lg:w-2/3 px-6 py-3 text-gray-700 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-lg transition duration-300 ease-in-out"
          />
        </div>
      </div>

      {noResults ? (
        <div className="centered-box">
          <div className="no-medicines-message">
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
