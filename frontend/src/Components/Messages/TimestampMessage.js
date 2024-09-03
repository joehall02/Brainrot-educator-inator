import React, { useState, useEffect } from "react";
import "./Message.css";
import { generateVoiceover, splitVoiceover } from "../../apiServices";

const TimestampMessage = ({ script, handleTimestampButtonPress, scrollToBottom }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const audioFilePath = "/api/audio_files/voiceover.mp3";

  // Function to handle the button press
  const handleButtonPress = async () => {
    setIsButtonDisabled(true); // Disable the button

    // Get the timestamps from the input fields
    const introEnd = document.getElementById("intro-end").value;
    const q1Start = document.getElementById("q1-start").value;
    const q1End = document.getElementById("q1-end").value;
    const a1Start = document.getElementById("a1-start").value;
    const a1End = document.getElementById("a1-end").value;
    const q2Start = document.getElementById("q2-start").value;
    const q2End = document.getElementById("q2-end").value;
    const a2Start = document.getElementById("a2-start").value;
    const a2End = document.getElementById("a2-end").value;
    const q3Start = document.getElementById("q3-start").value;
    const q3End = document.getElementById("q3-end").value;
    const a3Start = document.getElementById("a3-start").value;
    const a3End = document.getElementById("a3-end").value;
    const outroStart = document.getElementById("outro-start").value;

    // Create an object with the timestamps
    const timestamps = {
      IntroE: introEnd,
      Q1S: q1Start,
      Q1E: q1End,
      A1S: a1Start,
      A1E: a1End,
      Q2S: q2Start,
      Q2E: q2End,
      A2S: a2Start,
      A2E: a2End,
      Q3S: q3Start,
      Q3E: q3End,
      A3S: a3Start,
      A3E: a3End,
      OutroS: outroStart,
    };

    // Call the splitVoiceover function with the timestamps
    await splitVoiceover(timestamps);

    // Call the handleTimestampButtonPress function passed in as a prop
    handleTimestampButtonPress();
  };

  // Generate the voiceover when the component mounts
  useEffect(() => {
    const fetchVoiceover = async () => {
      // If the script is passed in, generate the voiceover
      if (script && script !== "") {
        try {
          await generateVoiceover(script); // Call api to generate voiceover
        } catch (error) {
          console.error("Error generating voiceover:", error);
        } finally {
          setIsLoading(false); // Set loading status to false
        }
      } else {
        // If the script is not passed in, set loading status to false
        setIsLoading(false); // Set loading status to false
      }
    };

    fetchVoiceover(); // Call the fetchVoiceover function
  }, [script]); // Fetch voiceover when the script changes

  // Scroll to the bottom of the chat window when the component updates
  useEffect(() => {
    scrollToBottom();
  }, [isLoading]);

  return (
    <div>
      <div className="d-flex justify-content-start">
        {/* If the audio doesnt exist, display message. If it does, show timestamp message */}
        <div className="chatbot-message text-white w-100">
          {isLoading ? (
            <p>Loading...</p>
          ) : (
            <>
              <p className="fw-bold">Input the timestamps below:</p>
              {/* Audio controls for the voiceover */}
              <audio controls className="w-100">
                <source src={audioFilePath} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
              {/* Input for the intro */}
              <div className="d-flex flex-column mb-3">
                <p className="fw-bold mb-1">Intro:</p>
                <label htmlFor="intro-end" className="form-label">
                  End:
                </label>
                <input type="text" id="intro-end" className="form-control" style={{ maxWidth: "60px" }} placeholder="0:00" />
              </div>

              {/* Input for question 1 */}
              <div className="d-flex flex-column mb-3">
                <p className="fw-bold mb-0">Question 1:</p>
                <div className="d-flex justify-content-between">
                  <div className="d-flex align-items-center">
                    <p className="mt-4 me-2">Q:</p>
                    <div className="me-2">
                      <label htmlFor="q1-start" className="form-label">
                        Start:
                      </label>
                      <input type="text" id="q1-start" className="form-control" style={{ maxWidth: "60px" }} placeholder="0:00" />
                    </div>
                    <div>
                      <label htmlFor="q1-end" className="form-label">
                        End:
                      </label>
                      <input type="text" id="q1-end" className="form-control" style={{ maxWidth: "60px" }} placeholder="0:00" />
                    </div>
                  </div>
                  <div className="d-flex align-items-center">
                    <p className="mt-4 me-2">A:</p>
                    <div className="me-2">
                      <label htmlFor="a1-start" className="form-label">
                        Start:
                      </label>
                      <input type="text" id="a1-start" className="form-control" style={{ maxWidth: "60px" }} placeholder="0:00" />
                    </div>
                    <div>
                      <label htmlFor="a1-end" className="form-label">
                        End:
                      </label>
                      <input type="text" id="a1-end" className="form-control" style={{ maxWidth: "60px" }} placeholder="0:00" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Input for question 2 */}
              <div className="d-flex flex-column mb-3">
                <p className="fw-bold mb-0">Question 2:</p>
                <div className="d-flex justify-content-between">
                  <div className="d-flex align-items-center">
                    <p className="mt-4 me-2">Q:</p>
                    <div className="me-2">
                      <label htmlFor="q2-start" className="form-label">
                        Start:
                      </label>
                      <input type="text" id="q2-start" className="form-control" style={{ maxWidth: "60px" }} placeholder="0:00" />
                    </div>
                    <div>
                      <label htmlFor="q2-end" className="form-label">
                        End:
                      </label>
                      <input type="text" id="q2-end" className="form-control" style={{ maxWidth: "60px" }} placeholder="0:00" />
                    </div>
                  </div>
                  <div className="d-flex align-items-center">
                    <p className="mt-4 me-2">A:</p>
                    <div className="me-2">
                      <label htmlFor="a2-start" className="form-label">
                        Start:
                      </label>
                      <input type="text" id="a2-start" className="form-control" style={{ maxWidth: "60px" }} placeholder="0:00" />
                    </div>
                    <div>
                      <label htmlFor="a2-end" className="form-label">
                        End:
                      </label>
                      <input type="text" id="a2-end" className="form-control" style={{ maxWidth: "60px" }} placeholder="0:00" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Input for question 3 */}
              <div className="d-flex flex-column mb-3">
                <p className="fw-bold mb-0">Question 3:</p>
                <div className="d-flex justify-content-between">
                  <div className="d-flex align-items-center">
                    <p className="mt-4 me-2">Q:</p>
                    <div className="me-2">
                      <label htmlFor="q3-start" className="form-label">
                        Start:
                      </label>
                      <input type="text" id="q3-start" className="form-control" style={{ maxWidth: "60px" }} placeholder="0:00" />
                    </div>
                    <div>
                      <label htmlFor="q3-end" className="form-label">
                        End:
                      </label>
                      <input type="text" id="q3-end" className="form-control" style={{ maxWidth: "60px" }} placeholder="0:00" />
                    </div>
                  </div>
                  <div className="d-flex align-items-center">
                    <p className="mt-4 me-2">A:</p>
                    <div className="me-2">
                      <label htmlFor="a3-start" className="form-label">
                        Start:
                      </label>
                      <input type="text" id="a3-start" className="form-control" style={{ maxWidth: "60px" }} placeholder="0:00" />
                    </div>
                    <div>
                      <label htmlFor="a3-end" className="form-label">
                        End:
                      </label>
                      <input type="text" id="a3-end" className="form-control" style={{ maxWidth: "60px" }} placeholder="0:00" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Input for the outro */}
              <div className="d-flex flex-column mb-3">
                <p className="fw-bold mb-1">Outro:</p>
                <label htmlFor="intro-end" className="form-label">
                  Start:
                </label>
                <input type="text" id="outro-start" className="form-control" style={{ maxWidth: "60px" }} placeholder="0:00" />
              </div>

              {/* Button to submit the timestamps */}
              <button className="btn px-4 border-white text-white btn-secondary w-100" onClick={() => handleButtonPress()} disabled={isButtonDisabled}>
                Submit
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TimestampMessage;
