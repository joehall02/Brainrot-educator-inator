import React, { useState, useEffect } from "react";
import "./Message.css";
import { generateScript } from "../../apiServices";

const ScriptMessage = ({ character, handleSciptButtonPress, scrollToBottom }) => {
  const [script, setScript] = useState(""); // State to store the script
  const [isLoading, setIsLoading] = useState(true); // State to store loading status
  const [isButtonDisabled, setIsButtonDisabled] = useState(false); // State to store button disabled status
  const [isEditing, setIsEditing] = useState(false); // State to store editing status

  // Function to handle the button press
  const handleButtonPress = (response) => {
    if (response === "Edit") {
      setIsEditing(true); // Set editing status to true
      setIsButtonDisabled(false); // Enable the buttons
    } else if (response === "Done") {
      setIsEditing(false); // Set editing status to false
    } else {
      handleSciptButtonPress(response, script); // Call the handleSciptButtonPress function passed in as a prop with the response
      setIsButtonDisabled(true); // Disable the buttons
    }
  };

  // Fetch the script from the api using the selected character
  useEffect(() => {
    const fetchScript = async () => {
      try {
        const data = await generateScript(character); // Fetch script from the api
        setScript(data); // Set the script to the fetched data
      } catch (error) {
        console.error("Error fetching script:", error);
        setScript(""); // Set script to an empty string in case of an error
      } finally {
        setIsLoading(false);
      }
    };

    fetchScript(); // Call the fetchScript function
  }, [character]); // Fetch script when the character changes

  // Scroll to the bottom of the chat window when the component updates
  useEffect(() => {
    scrollToBottom();
  }, [isLoading, isEditing]);

  return (
    <div className="d-flex justify-content-start">
      {/* If not loading, set the width to 100%, allows texarea to take up fill width */}
      <div className={`chatbot-message text-white ${!isLoading ? "w-100" : ""}`}>
        {/* If loading show loading message, if editing the script show that interface, if 
        the script is loaded, show the script, if not then show a failed to load message */}
        {isLoading ? (
          <p>Loading script...</p>
        ) : isEditing ? (
          <>
            <textarea type="text" className="form-control w-100" rows="15" value={script} onChange={(e) => setScript(e.target.value)} style={{ resize: "none" }} />
            <div className="d-flex w-100 mt-2">
              <div className="btn px-4 flex-grow-1 border-white text-white btn-secondary" onClick={() => handleButtonPress("Done")}>
                Done
              </div>
            </div>
          </>
        ) : script ? (
          <>
            <p className="fw-bold">Are you happy with the following script?</p>
            <p>{script}</p>
            <div className="d-flex w-100">
              <button className="btn px-4 flex-grow-1 border-white text-white btn-secondary me-1" onClick={() => handleButtonPress("Yes")} disabled={isButtonDisabled}>
                Yes
              </button>
              <button className="btn px-4 flex-grow-1 border-white text-white btn-danger me-1" onClick={() => handleButtonPress("No")} disabled={isButtonDisabled}>
                No
              </button>
              <button className="btn px-4 flex-grow-1 border-white text-white btn-dark" onClick={() => handleButtonPress("Edit")} disabled={isButtonDisabled}>
                Edit
              </button>
            </div>
          </>
        ) : (
          <p>Failed to load script.</p>
        )}
      </div>
    </div>
  );
};

export default ScriptMessage;
