import React, { useEffect, useState } from "react";
import "../css/MLAlgo.css";

function MLAlgo() {
  const [features, setFeatures] = useState([]);
  const [target, setTarget] = useState("");
  const [regression, setRegression] = useState([]);
  const [selectAlgo, setSelectAlgo] = useState("Linear Regression");
  const [algoType, setAlgoType] = useState("regression");
  const [classification, setClassification] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state
  const [error, setError] = useState(null); // Add error state0
  const [inputValues, setInputValues] = useState([]);
  const [predict,setPredict] = useState();
  const featuresField = ["Feature 1", "Feature 2", "Feature 3"]; // Replace with your feature names

  const fetchRegressionAlog = async () => {
    try {
      const resp = await fetch(
        `http://127.0.0.1:5001/api/regression-classification-algo`
      );
      if (resp.ok) {
        const jsonData = await resp.json();
        setRegression(jsonData.regression);
        setClassification(jsonData.classification);
        setLoading(false); // Set loading to false after data is fetched
      } else {
        setError("Failed to fetch data");
        setLoading(false); // Set loading to false in case of an error
      }
    } catch (error) {
      setError("Error: " + error.message);
      setLoading(false); // Set loading to false in case of an error
    }
  };


  const handleInputChange = (event, index) => {
    const newValue = event.target.value;
    setInputValues((prevValues) => {
      const updatedValues = [...prevValues];
      updatedValues[index] = newValue;
      return updatedValues;
    });
  };

  const predictFun = async() => {
    const url = "http://127.0.0.1:5001/api/mode-predict";
    const data = {
      featureValue:inputValues
    };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const jsonResponse = await response.json();
        setPredict(jsonResponse.predict);
        console.log("Data updated successfully:", jsonResponse);
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

  const modelTrain = async () => {
    const url = "http://127.0.0.1:5001/api/model-train-algo";
    const data = {
      algoType: algoType,
      algo: selectAlgo,
    };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const jsonResponse = await response.json();
        setFeatures(jsonResponse.features);
        setTarget(jsonResponse.target);
        console.log("Data updated successfully:", jsonResponse);
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

  const setSelectedAlgorithm = (e) => {
    setSelectAlgo(e.target.value);
  };

  useEffect(() => {
    fetchRegressionAlog();
  }, []);

  return (
    <>
      <h3>Choose the ML Alogorithm for the ML training</h3>
      <h3>Model Type</h3>
      <select
        className="select-algo-type-mlalgo"
        value={algoType || "regression"}
        onChange={(e) => {
          setAlgoType(e.target.value);
        }}
      >
        <option value="regression">Regression</option>
        <option value="classification">Classification</option>
      </select>
      <h3>Choose Alogorithm for Model Training</h3>
      <select
        className="select-algo-type-mlalgo"
        value={selectAlgo || regression[0]}
        onChange={(e) => {
          setSelectedAlgorithm(e);
        }}
      >
        {algoType === "regression" ? (
          <>
            {regression.map((algo, index) => (
              <option key={index} value={algo}>
                {algo}
              </option>
            ))}
          </>
        ) : (
          <>
            {classification.map((algo, index) => (
              <option key={index} value={algo}>
                {algo}
              </option>
            ))}
          </>
        )}
      </select>
      <button className="train-btn" onClick={() => modelTrain()}>
        Model Train
      </button>
      <br />

      <div className="predict-section">
        <div className="feature-container">
          Features:
          {features.map((item, index) => (
            <div className="feature-flex" key={index}>
              <input
                className="input-feature"
                type="number"
                placeholder={item}
                value={inputValues[index] || ""}
                onChange={(event) => handleInputChange(event, index)}
              />
            </div>
          ))}
        </div>
        <button
          className="predict-btn"
          onClick={() => {
            predictFun();
          }}
        >
          Predict
        </button>
      </div>
      Prediction Value : {predict}
    </>
  );
}

export default MLAlgo;