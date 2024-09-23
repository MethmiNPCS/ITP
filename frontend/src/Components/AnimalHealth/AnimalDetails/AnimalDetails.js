import React, { useEffect, useState } from "react";
import Nav from "../Nav/Nav";
import axios from "axios";
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

  useEffect(() => {
    fetchHandler(URL).then((data) => setAnimals(data.animals));
    fetchHandler(TREATMENTS_URL).then((data) => setTreatments(data.treatments));
  }, []);

  const [searchQuery, setSearchQuery] = useState("");
  const [noResults, setNoResults] = useState(false);

  const handleSearch = () => {
    fetchHandler(URL).then((data) => {
      const filteredAnimals = data.animals.filter((animal) =>
        Object.values(animal).some((field) =>
          field.toString().toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
      setAnimals(filteredAnimals);
      setNoResults(filteredAnimals.length === 0); 
    });
  };

  return (
    <div className="animal-details-container">
      <Nav />
      <h1 className="animal-details-header">Animal Details Page</h1>

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
          <p>No Animal Details found</p>
        </div>
      ) : (
        <div>
          {animals &&
            animals.map((animal, i) => (
              <div key={i} className="animal-container">
                <Animal animal={animal} treatments={treatments} />
              </div>
            ))}
        </div>
      )}
    </div>
  );
}

export default AnimalDetails;
