import React, { useState } from "react";
import axios from "axios";
import { TiTickOutline, TiWarning } from "react-icons/ti";
// import { IoWarningOutline } from "react-icons/io5";
import { MdHourglassEmpty } from "react-icons/md";

const ThreatPredictionText = () => {
  const [inputText, setInputText] = useState("");
  const [predictionResult, setPredictionResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState("model1"); // Default model

  const handleInputChange = (e) => {
    setInputText(e.target.value);
  };

  const handleModelChange = (e) => {
    setSelectedModel(e.target.value);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      // Define the API endpoint based on the selected model
      let apiEndpoint =
        selectedModel === "model1"
          ? "https://threat-detection-final-year.onrender.com/api/v1/predict/text"
          : "https://threat-detection-final-year.onrender.com/api/v2/predict/text";

      // Make a POST request to the selected API endpoint
      const response = await axios.post(apiEndpoint, { text: inputText });
      console.log(response.data);
      setPredictionResult(response.data);
    } catch (error) {
      console.error("Error predicting threat:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-screen mt-24">
      <label className="mb-4 relative w-full">
        <textarea
          value={inputText}
          onChange={handleInputChange}
          className="w-full h-56 ml-16 border-2 border-purple-600 rounded-md focus:outline-none focus:border-blue-500 p-4 resize-none"
          placeholder="Type your text here"
          style={{ width: "75%" }}
        />
      </label>
      
      <div className="flex items-center">
        {/* Dropdown for model selection */}
        <select
          value={selectedModel}
          onChange={handleModelChange}
          className="mr-8 mt-6 bg-white text-gray-500 px-4 py-2 rounded-md focus:outline-none focus:shadow-outline-blue border-4"
        >
          <option value="model1">Model 1</option>
          <option value="model2">Model 2</option>
        </select>

        {/* Go button */}
        <button
          onClick={handleSubmit}
          className="font-poppins w-32 text-lg bg-gradient-to-b from-purple-950 to-purple-600 text-white px-8 py-2 rounded-2xl hover:bg-blue-700 focus:outline-none focus:shadow-outline-blue mt-10 my-4 mr-32"
        >
          Go
        </button>
      </div>

      {loading ? (
        <div className="mt-4">
        <MdHourglassEmpty className="font-bold text-blue-500 animate-spin mr-10" />
        <p className="text-blue-500 font-bold mt-2 font-poppins text-center">Loading...</p>
      </div>
      ) : (
        predictionResult !== null && (
          <div className="mt-4">
            
            {predictionResult.predicted_class === "0" ? (
              
              <div
              className="hover:border border-green-600 p-4 rounded-md transition-all duration-300 ease-in-out"
            >
              <p className="text-green-600 font-bold flex items-center font-poppins">
                No Threat <TiTickOutline />
              </p>
              <p className="font-poppins">
                The predicted probability that this sentence might not be a threat
                is{" "}
                {(
                  100 -
                  parseFloat(predictionResult.confidence) * 100
                ).toFixed(2)}
                %
              </p>
            </div>
            ) : (
              // <p>Threat Found</p>
              <div
                className="hover:border border-yellow-600 p-4 rounded-md transition-all duration-300 ease-in-out"
              >
                <p className="text-yellow-600 font-bold flex items-center font-poppins">
                  Threat Detected <TiWarning />
                </p>
                <p className="font-poppins">
                  The predicted probability that this sentence might be a threat
                  is{" "}
                  {(parseFloat(predictionResult.confidence) * 100).toFixed(2)}%
                </p>
              </div>
            )}
          </div>
        )
      )

      
      }
    </div>
  );
};

export default ThreatPredictionText;
