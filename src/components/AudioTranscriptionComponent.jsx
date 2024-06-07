import React from "react";

const AudioTranscriptionComponent = () => {
  const htmlContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Real-time Audio Transcription</title>
            <style>
                body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f1f1f1;
        }

        .container {
            max-width: 800px;
            margin: 20px auto;
            padding: 20px;
            background-color: #fff;
            border-radius: 8px;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        }

        h1 {
            text-align: center;
            color: #333;
        }

        #log {
            padding: 10px;
            border: 1px solid #ccc;
            border-radius: 4px;
            background-color: #f9f9f9;
            margin-bottom: 10px;
            height: 200px;
            overflow-y: auto;
        }

        #transcript {
            width: 100%;
            height: 100px;
            margin-bottom: 10px;
            padding: 10px;
            border: 1px solid #ccc;
            border-radius: 4px;
            background-color: #f9f9f9;
            resize: none;
        }

        button {
            margin-top: 10px;
            padding: 10px 20px;
            background-color: #4CAF50;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        }

        button:hover {
            background-color: #45a049;
        }
            </style>
        </head>
        <body>
            <div class="container">
        <h1>Real-time Audio Transcription</h1>
        <div id="log"></div>
        <textarea id="transcript" placeholder="Transcription will appear here..." readonly></textarea>
        <button id="startBtn" onclick="startRecording()">Start Recording</button>
        <button id="stopBtn" onclick="stopRecording()" disabled>Stop Listening</button>
        <button id="saveTextBtn" onclick="saveText()">Save Text</button>
        <button id="saveAudioBtn" onclick="saveAudio()">Save Audio</button>
    </div>

    <script>
        var recognition;
        var recording = false;
        var logElem = document.getElementById('log');
        var outputElem = document.getElementById('output');
        var transcriptElem = document.getElementById('transcript');
        var finalTranscript = ''; // Variable to store the final transcript
        var mediaRecorder;
        var recordedChunks = [];

        // Function to log messages
        function logMessage(message) {
            var logEntry = document.createElement('div');
            logEntry.textContent = message;
            logElem.appendChild(logEntry);
        }

        // Function to update transcript
        function updateTranscript(transcript) {
            finalTranscript += transcript + ' '; // Concatenate the transcribed text
            transcriptElem.value = finalTranscript;
        }

        // Function to start recording
        function startRecording() {
            if (!recording) {
                navigator.mediaDevices.getUserMedia({ audio: true })
                    .then(function (stream) {
                        recognition = new webkitSpeechRecognition();
                        recognition.continuous = true;
                        recognition.interimResults = true;
                        recognition.lang = 'am-ET';

                        recognition.onstart = function () {
                            logMessage('Recording started...');
                            document.getElementById('startBtn').disabled = true;
                            document.getElementById('stopBtn').disabled = false;
                            recording = true;
                        };

                        recognition.onresult = function (event) {
                            var interimTranscript = '';
                            for (var i = event.resultIndex; i < event.results.length; ++i) {
                                if (event.results[i].isFinal) {
                                    var finalTranscript = event.results[i][0].transcript;
                                    updateTranscript(finalTranscript); // Update the transcript with final result
                                } else {
                                    interimTranscript += event.results[i][0].transcript;
                                }
                            }
                            logMessage('Interim transcript: ' + interimTranscript);
                        };

                        recognition.onerror = function (event) {
                            logMessage('Error occurred during recording: ' + event.error);
                        };

                        recognition.onend = function () {
                            logMessage('Recording stopped.');
                            document.getElementById('startBtn').disabled = false;
                            document.getElementById('stopBtn').disabled = true;
                            recording = false;
                        };

                        recognition.start();

                        mediaRecorder = new MediaRecorder(stream);
                        mediaRecorder.ondataavailable = function (e) {
                            recordedChunks.push(e.data);
                        };
                        mediaRecorder.start();
                    })
                    .catch(function (err) {
                        logMessage('Unable to access microphone:' + err);
                    });
            }
        }

        // Function to stop recording
        function stopRecording() {
            if (recording) {
                recognition.stop();
                mediaRecorder.stop();
                logMessage('MediaRecorder stopped.');
            }
        }

        // Function to save text
        function saveText() {
            var blob = new Blob([finalTranscript], { type: 'text/plain' });
            var url = URL.createObjectURL(blob);
            var a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = 'transcript.txt';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
        }

        // Function to save audio
        function saveAudio() {
            var blob = new Blob(recordedChunks, { type: 'audio/wav' });
            var url = URL.createObjectURL(blob);
            var a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = 'recorded_audio.wav';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
        }
    </script>
        </body>
        </html>
    `;

  return (
    <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
    // <div>Hello World</div>
  );
};

export default AudioTranscriptionComponent;
