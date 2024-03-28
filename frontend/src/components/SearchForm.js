// src/components/SearchForm.js
import React, { useState } from "react";

const SearchForm = ({ onSubmit }) => {
  const [vehicleNumber, setVehicleNumber] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(vehicleNumber);
  };

  return (
    <div className="row justify-content-center">
      <div className="col-md-6">
        <form onSubmit={handleSubmit}>
          <div className="input-group mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Enter Vehicle Number"
              value={vehicleNumber}
              onChange={(e) => setVehicleNumber(e.target.value)}
              required
            />
            <div className="input-group-append">
              <button className="btn btn-primary" type="submit">
                Search
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SearchForm;
