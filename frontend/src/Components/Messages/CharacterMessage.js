import React, { useState, useEffect } from "react";
import "./Message.css";
import { generateScript } from "../../apiServices";

const CharacterMessage = ({ handleCharacterSelection }) => {
  const [isDisabled, setIsDisabled] = useState(false);

  const handleButtonPress = (character) => {
    handleCharacterSelection(character);
    setIsDisabled(true);
  };

  return (
    <div>
      <div className="d-flex justify-content-start">
        <div className="chatbot-message text-white">
          <p>Choose a character</p>
          <div className="d-flex flex-column w-100">
            <button className="btn btn px-4 my-1 flex-grow-1 border-white text-white btn-secondary" onClick={() => handleButtonPress("Spongebob")} disabled={isDisabled}>
              Spongebob
            </button>
            <button className="btn btn px-4 my-1 flex-grow-1 border-white text-white btn-secondary" onClick={() => handleButtonPress("Homelander")} disabled={isDisabled}>
              Homelander
            </button>
            <button className="btn btn px-4 my-1 flex-grow-1 border-white text-white btn-secondary" onClick={() => handleButtonPress("Andrew Tate")} disabled={isDisabled}>
              Andrew Tate
            </button>
            <button className="btn btn px-4 my-1 flex-grow-1 border-white text-white btn-secondary" onClick={() => handleButtonPress("Peter Griffin")} disabled={isDisabled}>
              Peter Griffin
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CharacterMessage;
