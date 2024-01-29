// App.js
import React from "react";
import { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"; // Import BrowserRouter
import ThreatPredictionVoice from "./components/ThreatPredictionVoice";
import ThreatPredictionText from "./components/ThreatPredictionText";
import Sidebar from "./components/SideBar";

function App() {
  const [selectedComponent, setSelectedComponent] = useState("voice");

  const handleButtonClick = (component) => {
    setSelectedComponent(component);
  };

  return (
    <Router>
      <div className="flex font-playfair-500">
        <Sidebar />
        <div className="flex font-playfair-500">
      <div className="p-4">
        <h1 className="text-5xl text-indigo-500 font-bold font-playfair mt-4">
          VoiceShield
        </h1>
        <div className="my-4 flex justify-items-end">
          <button
            className={`mr-4 py-2 px-4 ${
              selectedComponent === "voice"
                ? "bg-blue-500 text-white"
                : "bg-gray-300 text-gray-700"
            }`}
            onClick={() => handleButtonClick("voice")}
          >
            Voice Prediction
          </button>
          <button
            className={`py-2 px-4 ${
              selectedComponent === "text"
                ? "bg-blue-500 text-white"
                : "bg-gray-300 text-gray-700"
            }`}
            onClick={() => handleButtonClick("text")}
          >
            Text Prediction
          </button>
        </div>
        {selectedComponent === "voice" ? (
          <ThreatPredictionVoice />
        ) : (
          <ThreatPredictionText />
        )}
      </div>
    </div>
      </div>
    </Router>
  );
}

export default App;
