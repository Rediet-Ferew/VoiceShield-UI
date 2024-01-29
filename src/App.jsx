// App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"; // Import BrowserRouter
import ThreatPredictionVoice from "./components/ThreatPredictionVoice";
import ThreatPredictionText from "./components/ThreatPredictionText";
import Sidebar from "./components/SideBar";

function App() {
  return (
    <Router>
      <div className="flex font-playfair-500">
        <Sidebar />
        <div className="p-4">
          <h1 className="text-5xl text-indigo-500 font-bold font-playfair mt-4">
            VoiceShield
          </h1>
          <Routes>
            <Route path="/audio" element={<ThreatPredictionVoice />} />
            <Route path="/text" element={<ThreatPredictionText />} />
          </Routes>
          {/* <ThreatPredictionVoice /> */}
        </div>
      </div>
    </Router>
  );
}

export default App;
