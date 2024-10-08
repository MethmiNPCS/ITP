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
    const pageHeight = doc.internal.pageSize.getHeight();
    let currentY = 60;

    // Add logo
    const logo = new Image();
    logo.src = "/favicon.ico"; // Path to your logo
    logo.onload = () => {
      const logoWidth = 30; // Adjust logo width
      const logoHeight = 30; // Adjust logo height
      const logoX = (doc.internal.pageSize.getWidth() - logoWidth) / 2; // Center horizontally
      doc.addImage(logo, "ICO", logoX, 10, logoWidth, logoHeight);

      doc.setFontSize(18);
      const title = "Animal Report";
      const titleWidth = doc.getTextWidth(title);
      const titleX = (doc.internal.pageSize.getWidth() - titleWidth) / 2; // Center horizontally
      doc.text(title, titleX, 50);

      currentY = 70; // Reset Y after title

      animals.forEach((animal) => {
        doc.setFontSize(14);

        const addNewPageIfNeeded = () => {
          if (currentY > pageHeight - 30) {
            doc.addPage();
            currentY = 20;
          }
        };

        // Add animal details
        doc.text(`Animal ID: ${animal.animalID}`, 10, currentY);
        currentY += 10;
        addNewPageIfNeeded();

        doc.text(`Animal Type: ${animal.animalType}`, 10, currentY);
        currentY += 10;
        addNewPageIfNeeded();

        doc.text(`Gender: ${animal.gender}`, 10, currentY);
        currentY += 10;
        addNewPageIfNeeded();

        doc.text(`Date of Birth: ${new Date(animal.dateOfBirth).toLocaleDateString()}`, 10, currentY);
        currentY += 10;
        addNewPageIfNeeded();

        doc.text(`Weight: ${animal.weight}`, 10, currentY);
        currentY += 10;
        addNewPageIfNeeded();

        doc.text(`Breeding Status: ${animal.breedingStatus}`, 10, currentY);
        currentY += 10;
        addNewPageIfNeeded();

        doc.text(`Health Status: ${animal.healthStatus}`, 10, currentY);
        currentY += 10;
        addNewPageIfNeeded();

        doc.text(`Health Condition: ${animal.healthCondition}`, 10, currentY);
        currentY += 10;
        addNewPageIfNeeded();

        // Find treatment descriptions
        const treatmentDescriptions = animal.treatmentIDs.map(id => {
          const treatment = treatments.find(t => t.treatmentID === id);
          return treatment ? treatment.planDescription : "No description available";
        });

        // Add treatment descriptions, one per line
        doc.text("Treatment Plans:", 10, currentY);
        currentY += 10;
        addNewPageIfNeeded();

        treatmentDescriptions.forEach((description) => {
          doc.text(`- ${description}`, 10, currentY);
          currentY += 10;
          addNewPageIfNeeded();
        });

        currentY += 10; // Add extra space after treatment info
        addNewPageIfNeeded();
      });

      // Save the PDF
      doc.save("animal_report.pdf");
    };
  };

  // Function to refresh the list of animals
  const refreshAnimals = () => {
    fetchAnimals();
  };

  return (
    <div className="pt-24"><Nav />
    <div className="animal-details-container">
      <h1 className="animal-details-header" style={{ fontWeight: 'bold', fontSize: '28px' }}>Animal Details Page</h1>

      <div className="animal-search-container">
        <input
          className="animal-search-input"
          onChange={(e) => setSearchQuery(e.target.value)}
          type="text"
          name="search"
          placeholder="Search"
        />
        <button className="animal-search-button" onClick={handleSearch}>
          Search
        </button>
      </div>

      {noResults ? (
        <div className="animal-no-results-container">
          <p className="animal-no-results-message">No Animal Details found</p>
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
      <button className="animal-download-report-button" onClick={handleDownloadPDF}>
        Download Report
      </button>
    </div>
    </div>
  );
}

export default AnimalDetails;
