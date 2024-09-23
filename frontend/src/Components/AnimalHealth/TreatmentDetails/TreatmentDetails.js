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
  useEffect(() => {
    fetchHandler().then((data) => setTreatments(data.treatments));
  }, []);

  const [searchQuery, setSearchQuery] = useState("");
  const [noResults, setNoResults] = useState(false);

  const handleSearch = () => {
    fetchHandler(URL).then((data) => {
      const filteredTreatments = data.treatments.filter((treatment) =>
        Object.values(treatment).some((field) =>
          field.toString().toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
      setTreatments(filteredTreatments);
      setNoResults(filteredTreatments.length === 0); 
    });
  };


  return (
    <div className="animal-details-container">
      <Nav />
      <h1 className="animal-details-header">Treatment Details Page</h1>

      <div className="search-container">
        <input
          onChange={(e) => setSearchQuery(e.target.value)}
          type="text"
          name="search"
          placeholder="Search"
        />
        <button class="search-button" onClick={handleSearch}>Search</button>
      </div>

      {noResults ? (
        <div>
          <p>No Treatment Plan found</p>
        </div>
      ) : (
      <div>
        {treatments &&
          treatments.map((treatment, i) => (
            <div key={i} className="animal-container">
              <Treatment treatment={treatment} />
            </div>
          ))}
      </div>
      )}
    </div>
  );
}

export default TreatmentDetails;
