import React from 'react';
import { useLocation } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import Nav from '../Nav/Nav';

function Salary() {
  const location = useLocation();
  const { BasicSalary = 0, Bonus = 0 } = location.state || {}; // Default to 0 if not provided

  // Check if BasicSalary is a valid number
  if (typeof BasicSalary !== 'number' || isNaN(BasicSalary)) {
    return <p>Error: Invalid salary data.</p>;
  }

  // Calculate EPF, ETF, and Net Salary
  const EPF = BasicSalary * 0.08; // Example: 8% of BasicSalary
  const ETF = BasicSalary * 0.03; // Example: 3% of BasicSalary
  const NetSalary = BasicSalary + Bonus - (EPF + ETF); // Net Salary calculation

  // Get current date
  const currentDate = new Date().toLocaleDateString(); // Format: MM/DD/YYYY

  // Function to generate PDF report
  const generatePdf = () => {
    const doc = new jsPDF();
  
    // Add logo after it has loaded
    const logo = new Image();
    logo.src = "/favicon.ico"; // Path to your logo
    logo.onload = () => {
      const logoWidth = 30; // Adjust logo width
      const logoHeight = 30; // Adjust logo height
      const logoX = (doc.internal.pageSize.getWidth() - logoWidth) / 2; // Center horizontally
      doc.addImage(logo, "ICO", logoX, 10, logoWidth, logoHeight);
  
      // Add report title
      doc.setFontSize(24); // Set font size for the title
      doc.setTextColor(50, 50, 50); // Set a dark gray color for the title
      doc.text('Salary Report', doc.internal.pageSize.getWidth() / 2, 50, { align: 'center' }); // Center title
  
      // Add separator line below the title
      doc.setDrawColor(200, 200, 200); // Set line color
      doc.setLineWidth(1); // Set line width
      doc.line(10, 55, doc.internal.pageSize.getWidth() - 10, 55); // Draw line
  
      // Set font size for the details
      doc.setFontSize(12); // Set font size for the body text
      doc.setTextColor(100, 100, 100); // Set a lighter gray color for the body text
      const margin = 10; // Margin from the left
      const startY = 65; // Starting vertical position for details
      const lineHeight = 10; // Line height for each text line
  
      // Add report text
      doc.text(`Payment Date: ${currentDate}`, margin, startY);
      doc.text(`Basic Salary: Rs. ${BasicSalary.toFixed(2)}`, margin, startY + lineHeight);
      doc.text(`EPF: Rs. ${EPF.toFixed(2)}`, margin, startY + lineHeight * 2);
      doc.text(`ETF: Rs. ${ETF.toFixed(2)}`, margin, startY + lineHeight * 3);
      doc.text(`Bonus: Rs. ${Bonus.toFixed(2)}`, margin, startY + lineHeight * 4);
      doc.text(`Net Salary: Rs. ${NetSalary.toFixed(2)}`, margin, startY + lineHeight * 5);
  
      doc.save('salary-report.pdf'); // Save the PDF with a filename
    };
  };
  

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <Nav />
      <div className="bg-white shadow-lg rounded-lg p-6 max-w-lg mx-auto mt-4">
        <h2 className="text-2xl font-bold mb-4 text-gray-800 border-b-2 border-gray-300 pb-2">Salary Details</h2>
        <p className="text-gray-600">Payment Date: <span className="font-semibold text-gray-800">{currentDate}</span></p>
        <div className="mt-4">
          <p className="text-gray-600">Basic Salary: <span className="font-semibold text-gray-800">Rs. {BasicSalary.toFixed(2)}</span></p>
          <p className="text-gray-600">EPF: <span className="font-semibold text-gray-800">Rs. {EPF.toFixed(2)}</span></p>
          <p className="text-gray-600">ETF: <span className="font-semibold text-gray-800">Rs. {ETF.toFixed(2)}</span></p>
          <p className="text-gray-600">Bonus: <span className="font-semibold text-gray-800">Rs. {Bonus.toFixed(2)}</span></p>
          <p className="text-lg font-semibold text-gray-800 mt-2">Net Salary: <span className="text-green-600">Rs. {NetSalary.toFixed(2)}</span></p>
        </div>
        
        {/* Button to generate PDF */}
        <button
          onClick={generatePdf}
          className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded transition duration-300"
        >
          Generate PDF Report
        </button>
      </div>
    </div>
  );
}

export default Salary;
