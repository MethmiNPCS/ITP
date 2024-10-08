import React, { useEffect, useState } from 'react';
import Nav from '../Nav/Nav';
import { Pie, Bar } from 'react-chartjs-2';
import axios from 'axios';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

function AnimalHome() {
  const [animalData, setAnimalData] = useState({
    pie: { labels: [], datasets: [] },
    bar: { labels: [], datasets: [] },
    treatmentPie: { labels: [], datasets: [] },
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAnimalData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/animals');
        const animals = response.data.animals;

        const counts = { cows: 0, pigs: 0, chickens: 0 };
        const genderCounts = { maleCows: 0, femaleCows: 0, malePigs: 0, femalePigs: 0, maleChickens: 0, femaleChickens: 0 };

        animals.forEach(animal => {
          if (animal.animalType === 'Cow') counts.cows++;
          else if (animal.animalType === 'Pig') counts.pigs++;
          else if (animal.animalType === 'Chicken') counts.chickens++;

          if (animal.animalType === 'Cow') {
            if (animal.gender === 'Male') genderCounts.maleCows++;
            else genderCounts.femaleCows++;
          } else if (animal.animalType === 'Pig') {
            if (animal.gender === 'Male') genderCounts.malePigs++;
            else genderCounts.femalePigs++;
          } else if (animal.animalType === 'Chicken') {
            if (animal.gender === 'Male') genderCounts.maleChickens++;
            else genderCounts.femaleChickens++;
          }
        });

        setAnimalData(prevData => ({
          ...prevData,
          pie: {
            labels: ['Cows', 'Pigs', 'Chickens'],
            datasets: [
              {
                data: [counts.cows, counts.pigs, counts.chickens],
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
              },
            ],
          },
          bar: {
            labels: ['Cows', 'Pigs', 'Chickens'],
            datasets: [
              {
                label: 'Male',
                data: [genderCounts.maleCows, genderCounts.malePigs, genderCounts.maleChickens],
                backgroundColor: '#4BC0C0',
              },
              {
                label: 'Female',
                data: [genderCounts.femaleCows, genderCounts.femalePigs, genderCounts.femaleChickens],
                backgroundColor: '#9966FF',
              },
            ],
          },
        }));
      } catch (error) {
        console.error('Error fetching animal data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchTreatmentData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/treatments');
        const treatments = response.data.treatments;

        const treatmentCounts = {};

        treatments.forEach(treatment => {
          treatmentCounts[treatment.treatmentID] = treatment.animalIDs.length; // Count animals per treatment
        });

        setAnimalData(prevData => ({
          ...prevData,
          treatmentPie: {
            labels: Object.keys(treatmentCounts), // Treatment IDs
            datasets: [
              {
                data: Object.values(treatmentCounts), // Number of animals for each treatment
                backgroundColor: ['#FF9F40', '#FF6384', '#36A2EB', '#4BC0C0', '#9966FF'],
              },
            ],
          },
        }));
      } catch (error) {
        console.error('Error fetching treatment data:', error);
      }
    };

    fetchAnimalData();
    fetchTreatmentData();
  }, []);

  return (
    <div className="pt-24" style={{ textAlign: 'center' }}>
      <Nav />
      {isLoading ? (
        <p>Loading charts...</p>
      ) : (
        <>
          <br /><br />
          <div style={{ display: 'flex', justifyContent: 'center', margin: '20px 0' }}>
            <div style={{ width: '400px', marginRight: '200px', textAlign: 'left' }}>
              <h3 style={{ textAlign: 'center', fontWeight: 'bold' }}>Animal Population Overview</h3>
              {animalData.pie.labels.length > 0 ? (
                <Pie data={animalData.pie} />
              ) : (
                <p>No data available for pie chart.</p>
              )}
            </div>
            <div style={{ width: '600px', textAlign: 'left' }}>
              <h3 style={{ textAlign: 'center', fontWeight: 'bold' }}>Gender Distribution Among Livestock</h3>
              {animalData.bar.labels.length > 0 ? (
                <Bar data={animalData.bar} />
              ) : (
                <p>No data available for bar chart.</p>
              )}
            </div>
          </div>
          <br /><br />
          <h3 style={{ textAlign: 'center', fontWeight: 'bold' }}>Animal Treatment Overview</h3>
          {animalData.treatmentPie.labels.length > 0 ? (
            <div style={{ width: '600px', margin: '0 auto' }}>
              <Bar
                data={{
                  labels: animalData.treatmentPie.labels, // Treatment IDs
                  datasets: [
                    {
                      label: 'Number of Animals', // Label for the bar chart
                      data: animalData.treatmentPie.datasets[0].data, // Number of animals for each treatment
                      backgroundColor: ['#FF9F40', '#FF6384', '#36A2EB', '#4BC0C0', '#9966FF'], // Colors for bars
                    },
                  ],
                }}
                options={{
                  scales: {
                    y: {
                      beginAtZero: true, // Ensure the y-axis starts at 0
                    },
                  },
                  plugins: {
                    tooltip: {
                      callbacks: {
                        label: (tooltipItem) => {
                          const treatmentID = animalData.treatmentPie.labels[tooltipItem.dataIndex];
                          const animalCount = animalData.treatmentPie.datasets[0].data[tooltipItem.dataIndex];
                          //return `Treatment ID: ${treatmentID} - Count: ${animalCount}`; // Show treatment ID and count
                          return `${animalCount}`;
                        },
                      },
                    },
                  },
                }}
              />
            </div>
          ) : (
            <p>No data available for treatment bar chart.</p>
          )}
        </>
      )} <br /><br />
    </div>
  );
}

export default AnimalHome;
