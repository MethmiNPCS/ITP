import { jsPDF } from "jspdf";
import React, { useEffect, useState } from "react";
import Nav from "../Nav/Nav";
import axios from "axios";
import Treatment from "../Treatment/Treatment";
import "./TreatmentDetails.css";

const URL = "http://localhost:5000/treatments";

const fetchHandler = async () => {
  return await axios.get(URL).then((res) => res.data);
};

function TreatmentDetails() {
  const [treatments, setTreatments] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [noResults, setNoResults] = useState(false);

  useEffect(() => {
    fetchHandler().then((data) => setTreatments(data.treatments));
  }, []);

  const refreshTreatment = async () => {
    const data = await fetchHandler();
    setTreatments(data.treatments);
  };

  const handleSearch = () => {
    fetchHandler().then((data) => {
      const filteredTreatments = data.treatments.filter((treatment) =>
        Object.values(treatment).some((field) =>
          field.toString().toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
      setTreatments(filteredTreatments);
      setNoResults(filteredTreatments.length === 0);
    });
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
  
    // Add logo
    const logo = new Image();
    logo.src = "/favicon.ico"; // Path to your logo
    logo.onload = () => {
      const logoWidth = 30; // Adjust logo width
      const logoHeight = 30; // Adjust logo height
      const logoX = (doc.internal.pageSize.getWidth() - logoWidth) / 2; // Center horizontally
      doc.addImage(logo, "ICO", logoX, 10, logoWidth, logoHeight);
  
      // Center the title
      doc.setFontSize(18);
      const title = "Treatment Plan Report";
      const titleWidth = doc.getTextWidth(title);
      const titleX = (doc.internal.pageSize.getWidth() - titleWidth) / 2; // Center horizontally
      doc.text(title, titleX, 50);
  
      // Add treatment details
      let currentY = 60;
  
      treatments.forEach((treatment) => {
        doc.setFontSize(14);
        doc.text(`Treatment ID: ${treatment.treatmentID}`, 10, currentY);
        doc.text(`Plan Description: ${treatment.planDescription}`, 10, currentY + 5);
        doc.text(`Start Date: ${new Date(treatment.startDate).toLocaleDateString()}`, 10, currentY + 10);
        doc.text(`End Date: ${new Date(treatment.endDate).toLocaleDateString()}`, 10, currentY + 15);
        doc.text(`Treatment Time: ${treatment.treatmentTime || "Not specified"}`, 10, currentY + 20);
        doc.text(`Frequency: ${treatment.frequency || "Not specified"}`, 10, currentY + 25);
        doc.text(`Associated Animal IDs: ${treatment.animalIDs.join(", ") || "None"}`, 10, currentY + 30);
  
        // Add medicines details
        treatment.medicines.forEach((medicine, index) => {
          doc.text(`Medicine Name: ${medicine.name}`, 10, currentY + 35 + index * 5);
          doc.text(`Dose: ${medicine.dose}`, 10, currentY + 40 + index * 5);
        });
  
        // Update currentY for the next treatment
        currentY += 60 + treatment.medicines.length * 5; // Adjust spacing between treatments
      });
  
      doc.save("treatment_plan_report.pdf");
    };
  };

  return (
    <div className="treatment-details-container">
      <Nav />
      <h1 className="treatment-details-header">Treatment Details Page</h1>

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
          <p className="no-results-message">No Treatment Plan found</p>
        </div>
      ) : (
        <div className="treatment-list-container">
          <div className="printable-header">
            <img src="/favicon.ico" alt="Logo" className="report-logo" />
            <h2 className="report-title">Treatment Plan Report</h2>
          </div>
          {treatments.map((treatment, i) => (
            <div key={i} className="treatment-container">
              <Treatment treatment={treatment} refreshTreatment={refreshTreatment} />
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

export default TreatmentDetails;
