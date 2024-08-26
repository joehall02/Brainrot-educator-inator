import React, { useState, useEffect } from "react";
import "./Message.css";
import { generateQuestions } from "../../apiServices";

const QAMessage = ({ topic, scrollToBottom, handleQAButtonPress, messageCount, setMessageCount }) => {
  const [questionsAndAnswers, setQuestionsAndAnswers] = useState([]); // Array of questions and answers
  const [isLoading, setIsLoading] = useState(true); // State to store loading status
  const [isButtonDisabled, setIsButtonDisabled] = useState(false); // State to store button disabled status

  // Function to handle the button press
  const handleButtonPress = (response) => {
    setIsButtonDisabled(true); // Disable the buttons
    handleQAButtonPress(response); // Call the handleQAButtonPress function with the response
  };

  // Fetch questions and answers from the api using the topic
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const data = await generateQuestions(topic); // Fetch questions from the api
        setQuestionsAndAnswers(data); // Set the questions and answers to the fetched data
      } catch (error) {
        console.error("Error fetching questions:", error);
        setQuestionsAndAnswers([]); // Set questions and answers to an empty array in case of an error
      } finally {
        setIsLoading(false); // Set loading status to false after fetching questions
      }
    };

    fetchQuestions(); // Call the fetchQuestions function
  }, [topic]); // Fetch questions whenever the topic changes

  // Scroll to the bottom of the chat window when the component updates
  useEffect(() => {
    scrollToBottom();
    if (questions[0] === "Please provide a topic for the questions.") {
      // If the topic is invalid, decrement the message count
      setMessageCount(messageCount - 1);
    }
  }, [isLoading]);

  // Separate the questions and answers from the fetched data, check if the data is an array before filtering, if not, set questions and answers to empty arrays
  const questions = Array.isArray(questionsAndAnswers) ? questionsAndAnswers.filter((item, index) => index % 2 === 0) : [];
  const answers = Array.isArray(questionsAndAnswers) ? questionsAndAnswers.filter((item, index) => index % 2 !== 0) : [];

  return (
    <div className={"d-flex justify-content-start"}>
      <div className={"chatbot-message text-white"}>
        {/* If loading, show a loading message, if the topic is invalid show a message, if questions are 
        loaded, show the questions and answers, if not, show a failed to load message */}
        {isLoading ? (
          <p>Loading questions...</p>
        ) : questions[0] === "Please provide a topic for the questions." ? (
          <p>Please provide a topic for the questions.</p>
        ) : questions.length > 0 ? (
          <>
            <p className="fw-bold">Are you happy with the following questions and answers?:</p>
            {questions.map((question, index) => (
              <div key={index}>
                <p>{question}</p>
                <p>{answers[index]}</p>
              </div>
            ))}
            <div className="d-flex w-100">
              <button className="btn px-4 flex-grow-1 border-white text-white btn-secondary me-2" onClick={() => handleButtonPress("Yes")} disabled={isButtonDisabled}>
                Yes
              </button>
              <button className="btn px-4 flex-grow-1 border-white text-white btn-danger" onClick={() => handleButtonPress("No")} disabled={isButtonDisabled}>
                No
              </button>
            </div>
          </>
        ) : (
          <p>Failed to load questions</p>
        )}
      </div>
    </div>
  );
};

export default QAMessage;
