import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import {MdHourglassEmpty} from 'react-icons/md'
import {TiWarning, TiTickOutline} from 'react-icons/ti'

const VoiceRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordings, setRecordings] = useState([]);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);
  const [predictionResult, setPredictionResult] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isRecording) {
      startRecording();
      startTimer();
    } else {
      stopRecording();
    }

    return () => {
      clearInterval(timerRef.current);
    };
  }, [isRecording]);

  useEffect(() => {
    console.log(recordings); // Print recordings whenever it changes
    // Send recordings to backend URL
    if (recordings.length > 0) {
      sendRecordings();
    }
  }, [recordings]);

  const startRecording = () => {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then((stream) => {
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;

        mediaRecorder.ondataavailable = (e) => {
          chunksRef.current.push(e.data);
        };

        mediaRecorder.start();
      })
      .catch((error) => console.error('Error accessing microphone:', error));
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      saveAudioSegment();
      chunksRef.current = []; // Clear the chunks
    }
  };

  const startTimer = () => {
    timerRef.current = setInterval(() => {
      saveAudioSegment();
      chunksRef.current = []; // Clear the chunks after each interval
      stopRecording();
      setTimeout(startRecording, 10); // Restart recording after a very short delay
    }, 10000); // Save every 10 seconds
  };

  const saveAudioSegment = () => {
    if (chunksRef.current.length > 0) {
      const blob = new Blob(chunksRef.current, { type: 'audio/wav' });
      const audioFile = new File([blob], `recording_${recordings.length + 1}.wav`, { type: 'audio/wav' });
      setRecordings([...recordings, audioFile]);
    }
  };

  const handleStartRecording = () => {
    setIsRecording(true);
  };

  const handleStopRecording = () => {
    setIsRecording(false);
  };

  const sendRecordings = async () => {
    if (recordings.length === 0) return; // Check if there are actual recordings before sending

    const formData = new FormData();

    // Append each recorded audio file to FormData
    recordings.forEach((audioFile, index) => {
      formData.append('audio', audioFile);
      
    });

    try {
      const response = await axios.post('https://voiceshield-fastapi.onrender.com/api/v3/newAudioApi', formData, {
        headers: {
          'Content-Type': 'multipart/form-data' // Set appropriate content type header
        }
      });
      console.log('Recordings sent successfully:', response.data);
      setPredictionResult(response.data)
    } catch (error) {
      console.error('Error sending recordings:', error);
    } finally {
      // Clear recordings after sending
      setLoading(false);
      setRecordings([]);
    }
  };

  return (
    <div>
      <button onClick={handleStartRecording} disabled={isRecording}>
        Start Recording
      </button>
      <button onClick={handleStopRecording} disabled={!isRecording}>
        Stop Recording
      </button>
      <div>
        <h2>Recordings:</h2>
        <ul>
          {recordings.map((recording, index) => (
            <li key={index}>
              <audio controls src={URL.createObjectURL(recording)} />
            </li>
          ))}
        </ul>
      </div>
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
              <div className="hover:border border-green-600 p-4 rounded-md transition-all duration-300 ease-in-out">
                <p className="text-green-600 font-bold flex items-center font-poppins">
                  No Threat <TiTickOutline />
                </p>
                <p className="font-poppins">
                  The predicted probability that this audio might be in this
                  category is{" "}
                  {(parseFloat(predictionResult.confidence) * 100).toFixed(2)}%
                </p>
              </div>
            ) : (
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

export default VoiceRecorder;
