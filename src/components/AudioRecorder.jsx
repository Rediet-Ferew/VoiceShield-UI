import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';

const Recorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordings, setRecordings] = useState([]);
  const audioRef = useRef(null);

  useLayoutEffect(() => {
    // Request microphone permission on component mount
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then((stream) => {
      
        audioRef.current.srcObject = stream;
        
       
      })
      .catch((error) => console.error(error));
  }, []);

  const startRecording = () => {
    setIsRecording(true);
    
    const mediaRecorder = new MediaRecorder(audioRef.current.captureStream());

  // Create a new Blob for each 5-second audio chunk
    let audioBlob;
    const intervalId = setInterval(() => {
      if (isRecording) {
        mediaRecorder.stop();
        mediaRecorder.ondataavailable = (event) => {
          audioBlob = URL.createObjectURL(event.data);
          setRecordings([...recordings, audioBlob]); // Add new chunk to recordings
          sendAudioChunk(audioBlob); // Send chunk to backend for processing
          mediaRecorder.start(5000); // Restart recording for next chunk
        };
      }
    }, 5000); // Interval every 5 seconds

    mediaRecorder.start(5000); // Start recording for the first chunk

    // Cleanup on stop recording
    return () => {
      clearInterval(intervalId);
      mediaRecorder.stop();
    };
  
    
  };

  const stopRecording = () => {
    setIsRecording(false);
  };

  const sendAudioChunk = async (audioBlob) => {
    try {
      const formData = new FormData();
      formData.append('audio', new Blob([audioBlob], { type: 'audio/wav' })); // Convert to WAV

      const response = await fetch('https://threat-detection-final-year.onrender.com/api/v2/predict/audio', {
        method: 'POST',
        body: formData,
      });

      // Handle backend response (optional):
      const responseData = await response.json();
      console.log(responseData);

    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <button onClick={isRecording ? stopRecording : startRecording}>
        {isRecording ? 'Stop Recording' : 'Start Recording'}
      </button>
      {recordings.length > 0 && (
        <ul>
          {recordings.map((recording, index) => (
            <li key={index}>
              <audio src={recording} controls /> (5 seconds)
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Recorder;
