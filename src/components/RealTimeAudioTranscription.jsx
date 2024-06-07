import React, { useState, useEffect } from 'react';

const RealTimeAudioTranscription = () => {
  const [recording, setRecording] = useState(false);
  const [logMessages, setLogMessages] = useState([]);
  const [transcript, setTranscript] = useState('');
  const [recordedChunks, setRecordedChunks] = useState([]);

  useEffect(() => {
    let recognition;

    const logMessage = (message) => {
      setLogMessages((prevMessages) => [...prevMessages, message]);
    };

    const updateTranscript = (newTranscript) => {
      setTranscript((prevTranscript) => prevTranscript + ' ' + newTranscript);
    };

    const startRecording = () => {
      if (!recording) {
        recognition = new window.webkitSpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'am-ET';

        recognition.onstart = () => {
          logMessage('Recording started...');
          setRecording(true);
        };

        recognition.onresult = (event) => {
          let interimTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              const finalTranscript = event.results[i][0].transcript;
              updateTranscript(finalTranscript);
            } else {
              interimTranscript += event.results[i][0].transcript;
            }
          }
          logMessage('Interim transcript: ' + interimTranscript);
          if (interimTranscript.trim() !== '') {
            updateTranscript(interimTranscript);
          }
        };

        recognition.onerror = (event) => {
          logMessage('Error occurred during recording: ' + event.error);
        };

        recognition.onend = () => {
          logMessage('Recording stopped.');
          setRecording(false);
        };

        recognition.start();
      }
    };

    const stopRecording = () => {
      if (recording) {
        recognition.stop();
      }
    };

    const saveText = () => {
      const blob = new Blob([transcript], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = 'transcript.txt';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    };

    const saveAudio = () => {
      const blob = new Blob(recordedChunks, { type: 'audio/wav' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = 'recorded_audio.wav';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    };

    return () => {
      if (recognition) {
        recognition.stop();
      }
    };
  }, [recording, transcript, recordedChunks]);

  return (
    <div className="">
      <h1>Real-time Audio Transcription</h1>
      <div >
        {logMessages.map((message, index) => (
          <div key={index}>{message}</div>
        ))}
      </div>
      <textarea value={transcript} readOnly />
      <button  onClick={startRecording} disabled={recording}>
        Start Recording
      </button>
      <button onClick={stopRecording} disabled={!recording}>
        Stop Listening
      </button>
      <button onClick={saveText}>
        Save Text
      </button>
      <button onClick={saveAudio}>
        Save Audio
      </button>
    </div>
  );
};

export default RealTimeAudioTranscription;
