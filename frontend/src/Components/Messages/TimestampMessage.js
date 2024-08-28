import React, { useState, useEffect } from "react";
import "./Message.css";
import { generateVoiceover, splitVoiceover } from "../../apiServices";

const SplitVoiceoverMessage = ({ script }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const audioFilePath = "http://127.0.0.1:5000/api/audio_files/voiceover.mp3";

  return (
    <div>
      <div className="d-flex justify-content-start">
        <div className="chatbot-message text-white w-100">
          <p className="fw-bold">Input the timestamps below:</p>
          <audio controls className="w-100">
            <source src={audioFilePath} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
          <p className="fw-bold">Intro:</p>
          <div></div>

          <p className="fw-bold">Question 1:</p>
          <div></div>

          <p className="fw-bold">Question 2:</p>
          <div></div>

          <p className="fw-bold">Question 3:</p>
          <div></div>

          <p className="fw-bold">Outro:</p>
          <div></div>
        </div>
      </div>
    </div>
  );
};

export default SplitVoiceoverMessage;
