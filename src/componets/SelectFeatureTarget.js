import "../css/SelectFeatureTarget.css";
import Dataframe from "./Dataframe";
import React, { useEffect, useState } from "react";

function SelectFeatureTarget() {
  const [columns, setColumns] = useState([]);
  const [update, setUpdate] = useState(false);
  const [targetfeature, setTargetfeature] = useState("");
  const [selectedFeatures, setSelectedFeatures] = useState([]); // Change this to an array

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const resp = await fetch("http://127.0.0.1:5001/api/encode-columns");
      if (resp.ok) {
        const jsonData = await resp.json();
        setColumns(jsonData.columns);
      }
    } catch (error) {
      // Handle any errors here
      console.error("Error fetching data:", error);
    }
  };

  const setTarget = async (col) => {
    const url = `http://127.0.0.1:5001/api/select-target-feature/${col}`;
    try {
      const resp = await fetch(url);
      if (resp.ok) {
        const jsonData = await resp.json();
        if (jsonData.update) {
          setUpdate(true);
          setTargetfeature(col);
          updateFeature(selectedFeatures, targetfeature);
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const updateFeature = async (sf, tf) => {
    const url = "http://127.0.0.1:5001/api/feature-target";
    const payload = {
      feature: sf,
      target: tf,
    };
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const jsonResponse = await response.json();
        console.log("Fetch Successfully:", jsonResponse);
      } else {
        console.error(
          "Failed to update data:",
          response.status,
          response.statusText
        );
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const addinfeature = (col) => {
    const newSelectedColumns = [...selectedFeatures]; // Create a copy of the array
    newSelectedColumns.push(col);
    setSelectedFeatures(newSelectedColumns);
    updateFeature(selectedFeatures);
    if (selectedFeatures.includes(col)) {
      const updatedSelectedFeatures = selectedFeatures.filter(
        (item) => item !== col
      );
      setSelectedFeatures(updatedSelectedFeatures);
    }
  };

  return (
    <div>
      <h2 className="  mx-2 my-3 font-semibold border-t-2 border-b-2 border-blue-500 p-4 text-3xl" style={{fontFamily : 'ClashGrotesk'}}>Features</h2>
      {columns.map((column, index) => (
        <>
          {column === targetfeature ? (
            ""
          ) : (
            <>
              <button
                className={`p-2 m-1 rounded-sm hover:bg-blue-600 ${
                  selectedFeatures.includes(column)
                    ? "bg-blue-600"
                    : "bg-blue-500"
                }`}
                onClick={() => {
                  addinfeature(column);
                }}
              >
                {column}
              </button>
            </>
          )}
        </>
      ))}

      <h2 className="text-xl mx-2 my-3 font-semibold " style={{fontFamily : 'ClashGrotesk'}}>Target:</h2>
      {columns.map((column, index) => (
        <button
          className={`p-2 m-1 rounded-sm hover:bg-blue-700 ${
            targetfeature === column ? "bg-blue-700" : "bg-blue-500"
          }`}
          onClick={() => {
            setTarget(column);
          }}
          key={index}
        >
          {column}
        </button>
      ))}
      {update && (
        <>
          <h3 className="text-lg mx-3 my-3 font-semibold" style={{fontFamily : 'ClashGrotesk'}}>
            {targetfeature}
          </h3>
        </>
      )}

      <div>
        <div className="container">
          <div className="dataframe-container">
            {selectedFeatures.length === 0 ? (
              ""
            ) : (
              <>
                <div className="text-blue-700 font-mono mx-2">
                  Train Feature (X)
                </div>
                <Dataframe rows={3} cols={selectedFeatures} />
              </>
            )}
          </div>
          <div className="dataframe-container">
            {targetfeature === "" ? (
              ""
            ) : (
              <>
                <div className="text-blue-900 font-mono">Target (Y)</div>
                <Dataframe rows={3} cols={[targetfeature]} />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SelectFeatureTarget;
