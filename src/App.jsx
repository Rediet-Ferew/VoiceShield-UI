// App.js
import React from "react";
import { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"; // Import BrowserRouter
import ThreatPredictionVoice from "./components/ThreatPredictionVoice";
import ThreatPredictionText from "./components/ThreatPredictionText";
import Sidebar from "./components/SideBar";
import VoiceRecorder from "./components/VoiceRecorder";
import RealTimeAudioTranscription from "./components/RealTimeAudioTranscription";
import AudioTranscriptionComponent from "./components/AudioTranscriptionComponent";
// import AudioRecordSave from "./components/AudioRecordSave";
// import AudioRecorder from "./components/AudioRecorder";
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

            <div>
              <button
                className={`py-2 px-4 ${
                  selectedComponent === "real"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-300 text-gray-700"
                }`}
                onClick={() => handleButtonClick("real")}
              >
                Real time Prediction
              </button>
            </div>
            <div>
              <button
                className={`py-2 px-4 ${
                  selectedComponent === "transcribe"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-300 text-gray-700"
                }`}
                onClick={() => handleButtonClick("transcribe")}
              >
                Real time Prediction with Transcription
              </button>
            </div>
            {/* <div>
              <button
                className={`py-2 px-4 ${
                  selectedComponent === "transcribe"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-300 text-gray-700"
                }`}
                onClick={() => handleButtonClick("transcribe")}
              >
                Real time Audio Transcription
              </button>
            </div> */}

            {selectedComponent === "voice" ? (
              <ThreatPredictionVoice />
            ) : selectedComponent === "text" ? (
              <ThreatPredictionText />
            ) : selectedComponent === "transcribe" ? (
              <AudioTranscriptionComponent />
            ) : (
              <VoiceRecorder />
            )}
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
