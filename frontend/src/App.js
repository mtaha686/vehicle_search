// src/App.js
import React, { useState } from "react";
import SearchForm from "./components/SearchForm";
import VehicleInfo from "./components/VehicleInfo";

const App = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const handleSearch = async (vehicleNumber) => {
    try {
      const response = await fetch("http://localhost:3001/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ vehicleNumber }),
      });
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const jsonData = await response.json();
      if (jsonData.error) {
        setError(jsonData.error);
        setData(null);
      } else {
        setData(jsonData.data);
        setError(null);
      }
    } catch (error) {
      setError("An error occurred");
      setData(null);
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-5">Vehicle Information Search</h1>
      <SearchForm onSubmit={handleSearch} />
      <VehicleInfo data={data} error={error} />
    </div>
  );
};

export default App;
