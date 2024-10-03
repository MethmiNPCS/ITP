import React, { useState, useEffect, useRef } from 'react';
import Nav from '../Nav/Nav';
import axios from 'axios';
import Food from '../Stock/Food';
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
      const pageHeight = 295; 
      const imgHeight = canvas.height * imgWidth / canvas.width;
      let heightLeft = imgHeight;

      const position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

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
        <div className="stock-grid" ref={ComponentsRef}>
          {filteredFoods.length > 0 ? (
            filteredFoods.map((food, i) => (
              <div key={food._id} className={`stock-item ${i % 2 === 0 ? 'left' : 'right'}`}>
                <Food food={food} />
              </div>
            ))
          ) : (
            <div className="centered-box">
              <div className="no-foods-message">
                No Foods Available <br/> <br/>
                <Link to="/addfood" className="add-food-button">ADD NEW ITEM</Link>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Foods;
