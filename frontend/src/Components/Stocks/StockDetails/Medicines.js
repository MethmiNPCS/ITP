import React, { useState, useEffect, useRef } from 'react';
import Nav from '../Nav/Nav';
import axios from 'axios';
import Medicine from '../Stock/Medicine'; // Adjust the path if needed
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
      const pageHeight = 295; // A4 height in mm
      const imgHeight = canvas.height * imgWidth / canvas.width;
      let heightLeft = imgHeight;

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
           <div className="no-foods-message">
             Not Found
           </div>
         </div>
      ) : (
        <div className="stock-grid" ref={componentsRef}>
          {filteredMedicines.length > 0 ? (
            filteredMedicines.map((medicine, i) => (
              <div key={medicine._id} className={`stock-item ${i % 2 === 0 ? 'left' : 'right'}`}>
                <Medicine medicine={medicine} />
              </div>
            ))
          ) : (
            <div className="centered-box">
              <div className="no-medicines-message">
                No Medicines Available<br/> <br/>
                <Link to="/addmedicine" className="add-food-button">ADD NEW ITEM</Link>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Medicines;
