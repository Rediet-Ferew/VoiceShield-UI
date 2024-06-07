import React, { useState, useRef, useEffect } from 'react';

const AudioRecordSave = () => {
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioChunks, setAudioChunks] = useState([]);
  const [recording, setRecording] = useState(false);
  const audioRef = useRef(null);

  // Start recording audio
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      
      let timeStarted = null;
      let chunks = [];

      recorder.ondataavailable = (e) => {
        console.log(e.data);
        chunks.push(e.data);
        if (timeStarted === null) {
          timeStarted = Date.now();
        } else if (Date.now() - timeStarted >= 10000) { // Check if 10 seconds have passed
          setAudioChunks(prevChunks => [...prevChunks, new Blob(chunks, { type: 'audio/wav' })]);
          saveAudioSegment();
          chunks = []; // Reset chunks
          timeStarted = Date.now(); // Reset timeStarted
        }
      };

      recorder.start();
      setMediaRecorder(recorder);
      setRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  // Stop recording audio
  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
      setRecording(false);
    }
  };

  // Save audio segment
  const saveAudioSegment = () => {
    if (audioChunks.length > 0) {
      const lastChunk = audioChunks[audioChunks.length - 1];
      const url = URL.createObjectURL(lastChunk);
      const a = document.createElement('a');
      document.body.appendChild(a);
      a.style = 'display: none';
      a.href = url;
      a.download = `recording_${new Date().toISOString()}.wav`;
      a.click();
      window.URL.revokeObjectURL(url);
      setAudioChunks(prevChunks => prevChunks.slice(0, -1)); // Remove the saved chunk
    }
  };

  // Effect to save audio segment every 10 seconds
  // useEffect(() => {
  //   let saveInterval;

  //   if (recording) {
  //     saveInterval = setInterval(() => {
  //       saveAudioSegment();
  //     }, 10000); // Save every 10 seconds
  //   }

  //   return () => {
  //     clearInterval(saveInterval);
  //   };
  // }, [recording, audioChunks]); // Run effect when recording or audioChunks change

  return (
    <div>
      <audio ref={audioRef} controls />
      {!recording ? (
        <button onClick={startRecording}>Start Recording</button>
      ) : (
        <button onClick={stopRecording}>Stop Recording</button>
      )}
    </div>
  );
};

export default AudioRecordSave;
