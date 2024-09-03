import React, { useState, useEffect } from "react";
import "./Message.css";

const SplitVoiceoverMessage = ({ handleSplitVoiceoverButtonPress }) => {
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  // Audio paths
  const introAudioPath = "/api/audio_files/intro.mp3";
  const q1AudioPath = "/api/audio_files/q1.mp3";
  const q2AudioPath = "/api/audio_files/q2.mp3";
  const q3AudioPath = "/api/audio_files/q3.mp3";
  const a1AudioPath = "/api/audio_files/a1.mp3";
  const a2AudioPath = "/api/audio_files/a2.mp3";
  const a3AudioPath = "/api/audio_files/a3.mp3";
  const outroAudioPath = "/api/audio_files/outro.mp3";

  const handleButtonPress = (response) => {
    handleSplitVoiceoverButtonPress(response);
    setIsButtonDisabled(true);
  };

  return (
    <div className="d-flex justify-content-start">
      <div className="chatbot-message text-white w-100">
        <p className="fw-bold">Are you happy with the split voiceover?:</p>

        {/* Intro audio */}
        <p className="fw-bold">Intro:</p>
        <audio controls className="w-100">
          <source src={introAudioPath} type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>

        {/* Q1 audio */}
        <p className="fw-bold">Question 1:</p>
        <audio controls className="w-100">
          <source src={q1AudioPath} type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>

        {/* A1 audio */}
        <p className="fw-bold">Answer 1:</p>
        <audio controls className="w-100">
          <source src={a1AudioPath} type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>

        {/* Q2 audio */}
        <p className="fw-bold">Question 2:</p>
        <audio controls className="w-100">
          <source src={q2AudioPath} type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>

        {/* A2 audio */}
        <p className="fw-bold">Answer 2:</p>
        <audio controls className="w-100">
          <source src={a2AudioPath} type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>

        {/* Q3 audio */}
        <p className="fw-bold">Question 3:</p>
        <audio controls className="w-100">
          <source src={q3AudioPath} type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>

        {/* A3 audio */}
        <p className="fw-bold">Answer 3:</p>
        <audio controls className="w-100">
          <source src={a3AudioPath} type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>

        {/* Outro audio */}
        <p className="fw-bold">Outro:</p>
        <audio controls className="w-100">
          <source src={outroAudioPath} type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>

        <div className="d-flex w-100 mt-3">
          <button className="btn px-4 flex-grow-1 border-white text-white btn-secondary me-1" onClick={() => handleButtonPress("Yes")} disabled={isButtonDisabled}>
            Yes
          </button>
          <button className="btn px-4 flex-grow-1 border-white text-white btn-danger me-1" onClick={() => handleButtonPress("No")} disabled={isButtonDisabled}>
            No
          </button>
        </div>
      </div>
    </div>
  );
};

export default SplitVoiceoverMessage;
