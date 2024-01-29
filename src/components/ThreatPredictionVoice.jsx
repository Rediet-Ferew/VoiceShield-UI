import React, { useState } from "react";
import axios from "axios";
import { BsFillFileEarmarkMusicFill } from "react-icons/bs";
import { MdHourglassEmpty } from "react-icons/md";
import { TiTickOutline } from "react-icons/ti";
import { TiWarning } from "react-icons/ti";
// import {IoWarningOutline} from 'react-icons/io';

const ThreatPredictionVoice = () => {
  const [audioFile, setAudioFile] = useState(null);
  const [predictionResult, setPredictionResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState("default"); // Default model

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setAudioFile(file);
  };

  const handleUpload = async () => {
    if (!audioFile) {
      alert("Please select a voice file");
      return;
    }

    try {
      setLoading(true);

      // Prepare FormData to send the file and selected model
      const formData = new FormData();
      formData.append("audio", audioFile);
      formData.append("selectedModel", selectedModel);

      // Define API endpoint based on the selected model

      let apiEndpoint = "https://threat-detection-final-year.onrender.com/api/v1/predict/audio"
      if (selectedModel === "model1") {
        apiEndpoint = "https://threat-detection-final-year.onrender.com/api/v1/predict/audio"
      }
      else if (selectedModel === 'model2') {
        apiEndpoint = "https://threat-detection-final-year.onrender.com/api/v2/predict/audio"
      }
      else {
        apiEndpoint = "https://threat-detection-final-year.onrender.com/api/v3/predict/audio"
      }

 

      // Send the voice file and selected model to the prediction API
      const response = await axios.post(apiEndpoint, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Set the prediction result
      setPredictionResult(response.data);
    } catch (error) {
      console.error("Error predicting threat:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBoxClick = () => {
    // Trigger file input click when box is clicked
    document.getElementById("fileInput").click();
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    setAudioFile(file);
  };

  const handleModelChange = (e) => {
    setSelectedModel(e.target.value);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full mt-24 rounded-xl shadow-lg border-2 px-24 py-12 bg-slate-300 ml-52">
      <label className="mb-4 relative">
        <p className="mb-4 text-center font-bold">UPLOAD AND ATTACH FILE</p>
        <div
          className="border-2 p-8 cursor-pointer hover:shadow-slate-500 bg-white rounded-xl p-10 my-4"
          onClick={handleBoxClick}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <BsFillFileEarmarkMusicFill className="mx-auto w-16 h-16 my-4" />
          <p className="text-gray-500">
            {audioFile
              ? audioFile.name
              : "Click to upload or drag and drop a file"}
          </p>
        </div>
        <input
          type="file"
          id="fileInput"
          accept="audio/*"
          onChange={handleFileChange}
          className="mb-2 hidden"
        />
        <div className="flex justify-center">
          <select
            onChange={handleModelChange}
            className="mr-4 bg-white text-gray-500 px-4 py-2 rounded-md focus:outline-none focus:shadow-outline-blue"
          >
            <option value="model1">Model 1</option>
            <option value="model2">Model 2</option>
            <option value="model3">Model 3</option>
          </select>
          <button
            onClick={handleUpload}
            className="ml-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:shadow-outline-blue"
          >
            Predict
          </button>
        </div>
      </label>

      {loading ? (
        <div className="mt-4">
          <MdHourglassEmpty className="font-bold text-blue-500 animate-spin ml-4" />
          <p className="text-blue-500 font-bold mt-2 font-poppins text-center">
            Loading...
          </p>
        </div>
      ) : (
        predictionResult !== null && (
          <div className="mt-4">
            {predictionResult.predicted_class === "0" ? (
              // <p>No threat</p>
              <div className="hover:border border-green-600 p-4 rounded-md transition-all duration-300 ease-in-out">
                <p className="text-green-600 font-bold flex items-center font-poppins">
                  No Threat <TiTickOutline />
                </p>
                <p className="font-poppins">
                  The predicted probability that this audio might be a
                  threat is{" "}
                  {(
                    100 -
                    parseFloat(predictionResult.confidence) * 100
                  ).toFixed(2)}
                  %
                </p>
              </div>
            ) : (
              // <p>Threat Found</p>
              <div className="hover:border border-yellow-600 p-4 rounded-md transition-all duration-300 ease-in-out">
                <p className="text-yellow-600 font-bold flex items-center font-poppins">
                  Threat Detected <TiWarning />
                </p>
                <p className="font-poppins">
                  The predicted probability that this audio might be a threat is{" "}
                  {(parseFloat(predictionResult.confidence) * 100).toFixed(2)}%
                </p>
              </div>
            )}
          </div>
        )
      )}
    </div>
  );
};

export default ThreatPredictionVoice;
