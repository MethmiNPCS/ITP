import React, { useEffect, useRef, useState } from "react";
import Nav from "../Nav/Nav";
import axios from "axios";
import { jsPDF } from "jspdf"; // Import jsPDF
import Animal from "../Animal/Animal";
import "./AnimalDetails.css";

const URL = "http://localhost:5000/animals";
const TREATMENTS_URL = "http://localhost:5000/treatments";

const fetchHandler = async (url) => {
  return await axios.get(url).then((res) => res.data);
};

function AnimalDetails() {
  const [animals, setAnimals] = useState([]);
  const [treatments, setTreatments] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [noResults, setNoResults] = useState(false);

  useEffect(() => {
    fetchAnimals();
    fetchTreatments();
  }, []);

  const fetchAnimals = async () => {
    const data = await fetchHandler(URL);
    setAnimals(data.animals);
  };

  const fetchTreatments = async () => {
    const data = await fetchHandler(TREATMENTS_URL);
    setTreatments(data.treatments);
  };

  const handleSearch = () => {
    fetchAnimals().then(() => {
      const filteredAnimals = animals.filter((animal) =>
        Object.values(animal).some((field) =>
          field.toString().toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
      setAnimals(filteredAnimals);
      setNoResults(filteredAnimals.length === 0);
    });
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    
    // Add logo
    const logo = new Image();
    logo.src = "/favicon.ico"; // Path to your logo
    logo.onload = () => {
      // Center the logo
      const logoWidth = 30; // Adjust logo width
      const logoHeight = 30; // Adjust logo height
      const logoX = (doc.internal.pageSize.getWidth() - logoWidth) / 2; // Center horizontally
      doc.addImage(logo, "ICO", logoX, 10, logoWidth, logoHeight);
  
      // Center the title
      doc.setFontSize(18);
      const title = "Animal Report";
      const titleWidth = doc.getTextWidth(title);
      const titleX = (doc.internal.pageSize.getWidth() - titleWidth) / 2; // Center horizontally
      doc.text(title, titleX, 50);
  
      // Add animal details with even spacing
      let currentY = 60;
      currentY += 10;
      
      // Start position for animal details
      animals.forEach((animal, index) => {
        doc.setFontSize(14);
        doc.text(`Animal ID: ${animal.animalID}`, 10, currentY);
        doc.text(`Animal Type: ${animal.animalType}`, 10, currentY + 5);
        doc.text(`Gender: ${animal.gender}`, 10, currentY + 10);
        doc.text(`Date of Birth: ${new Date(animal.dateOfBirth).toLocaleDateString()}`, 10, currentY + 15);
        doc.text(`Weight: ${animal.weight}`, 10, currentY + 20);
        doc.text(`Breeding Status: ${animal.breedingStatus}`, 10, currentY + 25);
        doc.text(`Health Status: ${animal.healthStatus}`, 10, currentY + 30);
        doc.text(`Health Condition: ${animal.healthCondition}`, 10, currentY + 35);
        
        // Find treatment descriptions
        const treatmentDescriptions = animal.treatmentIDs.map(id => {
          const treatment = treatments.find(t => t.treatmentID === id);
          return treatment ? treatment.planDescription : "No description available";
        }).join(', ');
        doc.text(`Treatment Plans: ${treatmentDescriptions}`, 10, currentY + 40);
  
        // Update currentY for next animal with even spacing
        currentY += 50; // Adjust spacing between animals
      });
  
      doc.save("animal_report.pdf");
    };
  };
  
  // Function to refresh the list of animals
  const refreshAnimals = () => {
    fetchAnimals();
  };

  return (
    <div className="animal-details-container">
      <Nav />
      <h1 className="animal-details-header">Animal Details Page</h1>

      <div className="search-container">
        <input
          className="search-input"
          onChange={(e) => setSearchQuery(e.target.value)}
          type="text"
          name="search"
          placeholder="Search"
        />
        <button className="search-button" onClick={handleSearch}>
          Search
        </button>
      </div>

      {noResults ? (
        <div className="no-results-container">
          <p className="no-results-message">No Animal Details found</p>
        </div>
      ) : (
        <div className="animal-list-container">
          {animals &&
            animals.map((animal, i) => (
              <div key={i} className="animal-container">
                <Animal animal={animal} treatments={treatments} refreshAnimals={refreshAnimals} />
              </div>
            ))}
        </div>
      )}
      <button className="download-report-button" onClick={handleDownloadPDF}>
        Download Report
      </button>
    </div>
  );
}

export default AnimalDetails;
