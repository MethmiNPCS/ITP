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
    const pageHeight = doc.internal.pageSize.getHeight();
    let currentY = 60; // Start position after logo and title

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

      // Start adding treatments
      currentY = 70; // Adjust starting position after title
      treatments.forEach((treatment) => {
        const addNewPageIfNeeded = () => {
          if (currentY > pageHeight - 20) {
            doc.addPage();
            currentY = 20;
          }
        };

        // Add treatment details
        doc.setFontSize(14);
        doc.text(`Treatment ID: ${treatment.treatmentID}`, 10, currentY);
        currentY += 10;
        addNewPageIfNeeded();

        doc.text(
          `Plan Description: ${treatment.planDescription}`,
          10,
          currentY
        );
        currentY += 10;
        addNewPageIfNeeded();

        doc.text(
          `Start Date: ${new Date(treatment.startDate).toLocaleDateString()}`,
          10,
          currentY
        );
        currentY += 10;
        addNewPageIfNeeded();

        doc.text(
          `End Date: ${new Date(treatment.endDate).toLocaleDateString()}`,
          10,
          currentY
        );
        currentY += 10;
        addNewPageIfNeeded();

        doc.text(
          `Treatment Time(s): ${
            treatment.treatmentTime.join(", ") || "Not specified"
          }`,
          10,
          currentY
        );
        currentY += 10;
        addNewPageIfNeeded();

        doc.text(
          `Associated Animal IDs: ${treatment.animalIDs.join(", ") || "None"}`,
          10,
          currentY
        );
        currentY += 10;
        addNewPageIfNeeded();

        // Add medicines details
        treatment.medicines.forEach((medicine, index) => {
          doc.text(`Medicine Name: ${medicine.name}`, 10, currentY);
          currentY += 10;
          addNewPageIfNeeded();

          doc.text(`Dose: ${medicine.dose}`, 10, currentY);
          currentY += 10;
          addNewPageIfNeeded();
        });

        // Add a separator or some spacing before next treatment
        currentY += 15;
        addNewPageIfNeeded();
      });

      doc.save("treatment_plan_report.pdf");
    };
  };

  return (
    <div className="pt-24"><Nav />
    <div className="treatment-treatment-details-container">
      <h1 className="treatment-treatment-details-header" style={{ fontWeight: 'bold', fontSize: '28px' }}>Treatment Plans</h1>
      <div className="treatment-search-container">
        <input
          type="text"
          placeholder="Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            padding: "10px",
            width: "100%",
            maxWidth: "300px",
            border: "1px solid #ccc",
            borderRadius: "8px",
            marginRight: "10px",
            fontSize: "16px",
            color: "#333",
            boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
            transition: "box-shadow 0.3s ease",
          }}
        />
        <button onClick={handleSearch} className="treatment-search-button">
          Search
        </button>
      </div>

      {noResults && <p>No results found.</p>}
      <div className="treatment-list">
        {treatments.map((treatment) => (
          <Treatment
            key={treatment.treatmentID}
            treatment={treatment}
            onRefresh={refreshTreatment}
          />
        ))}
      </div>
      <button onClick={handleDownloadPDF} className="treatment-download-button">
        Download Report
      </button>
    </div>
    </div>
  );
}

export default TreatmentDetails;
