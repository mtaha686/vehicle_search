// src/components/VehicleInfo.js
import React from "react";

const VehicleInfo = ({ data, error }) => {
  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  if (!data) {
    return null;
  }

  return (
    <div>
      <h2>Vehicle Record:</h2>
      <div className="table-responsive">
        <table
          className="table"
          style={{
            rowGap: "5px",
          }}
        >
          <tbody>
            {Object.entries(data).map(([key, value]) => (
              <tr key={key}>
                <td style={{ fontSize: " 0.7em" }}>
                  <strong>{key}:</strong>
                </td>
                <td style={{ fontSize: " 0.7em" }}>{value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VehicleInfo;
