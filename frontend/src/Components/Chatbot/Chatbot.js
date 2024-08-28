import React, { useState, useRef, useEffect } from "react";
import "./Chatbot.css";
import Message from "../Messages/Message";
import CharacterMessage from "../Messages/CharacterMessage";
import QAMessage from "../Messages/QAMessage";
import ScriptMessage from "../Messages/ScriptMessage";
import TimestampMessage from "../Messages/TimestampMessage";
import SplitVoiceoverMessage from "../Messages/SplitVoiceoverMessage";
import { generateScript, generateVoiceover, splitVoiceover } from "../../apiServices";

const Chatbot = () => {
  // Array of messages, adding the initial messages
  const [messages, setMessages] = useState([
    { isUser: false, text: "Hello! I am the Brainrot-educator-inator." },
    { isUser: false, text: "What topic should I base the questions on?" },
  ]);

  const [input, setInput] = useState(""); // State to store the input value
  const [messageCount, setMessageCount] = useState(0); // State to store the message count
  const messagesEndRef = useRef(null); // Reference to the last message element

  // Function to handle the input change
  const handleInputChange = (e) => {
    setInput(e.target.value); // Set the input value to the target value
  };

  // Function to handle the user sending a message
  const handleSendMessage = (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent the default behavior of the event

      let newMessage = { isUser: true, text: input }; // Create a new user message

      setMessages([...messages, newMessage]); // Add the user message to the messages array
      setInput(""); // Reset the input value
      setMessageCount(messageCount + 1); // Increment the message count
    }
  };

  // Function to handle the chatbot response
  const handleChatbotResponse = (response) => {
    setMessages([...messages, response]); // Add the chatbot response to the messages
  };

  // Function to handle the QA button presses
  const handleQAButtonPress = (response) => {
    if (response === "Yes") {
      // If the response is Yes move on to the next step
      setMessageCount(messageCount + 1);
    } else if (response === "No") {
      // If the response is No, create new questions
      const lastUserMessage = messages
        .slice() // Copy the messages array
        .reverse() // Reverse the copied array so the last messages are first
        .find((message) => message.isUser); // Find the first message with an isUser value of true

      // If a user message is found, call the handleChatbotResponse function with the topic
      if (lastUserMessage) {
        handleChatbotResponse({ topic: lastUserMessage.text });
      }
    }
  };

  // Function to handle the character selection
  const handleCharacterSelection = (character) => {
    setMessages([...messages, { isUser: true, text: character }]); // Add the character selection to the messages
    setMessageCount(messageCount + 1); // Increment the message count
  };

  // Function to handle the script button presses for yes and no (edit handled in component)
  const handleSciptButtonPress = (response) => {
    if (response === "Yes") {
      setMessageCount(messageCount + 1); // Increment the message count
    } else if (response === "No") {
      console.log("No");
      // If the response is No, create a new script
      const lastUserMessage = messages
        .slice() // Copy the messages array
        .reverse() // Reverse the copied array so the last messages are first
        .find((message) => message.isUser); // Find the first message with an isUser value of true

      // If a user message is found, call the handleChatbotResponse function with the character
      if (lastUserMessage) {
        handleChatbotResponse({ character: lastUserMessage.text, handleSciptButtonPress: handleSciptButtonPress });
      }
    }
  };

  // Function to scroll to the bottom of the chat
  const scrollToBottom = () => {
    messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  };

  // useEffect to scroll to the bottom of the chat whenever the messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // useEffect to handle the chatbot response whenever the message count changes
  useEffect(() => {
    if (messageCount === 1) {
      handleChatbotResponse({ topic: messages[messages.length - 1].text }); // Sends QA message with the topic
    } else if (messageCount === 2) {
      handleChatbotResponse({ handleCharacterSelection: handleCharacterSelection }); // Sends character selection message
    } else if (messageCount === 3) {
      handleChatbotResponse({ character: messages[messages.length - 1].text, handleSciptButtonPress: handleSciptButtonPress }); // Sends script message with the character
    } else if (messageCount === 4) {
      handleChatbotResponse({ script: messages[messages.length - 1].text }); // Sends voiceover message with the script
    }
  }, [messageCount]);

  return (
    <div className="d-flex justify-content-center">
      {/* Chatbot background */}
      <div className="d-flex col-10 col-lg-6 justify-content-center shadow-lg chatbot-background">
        {/* Chatbot container */}
        <div className="d-flex flex-column col-10">
          {/* Header */}
          <div className="py-4 col-12">
            <h5 className="text-white fw-bold text-center">Brainrot-educator-inator</h5>
          </div>

          {/* Messages */}
          <div className="overflow-auto">
            {/* Maps the messages and checks if the message is a user message, QAMessage, 
            CharacterMessage, ScriptMessage, SplitVoiceoverMessage or chatbot message */}
            {messages.map((message, index) => {
              if (message.isUser !== undefined) {
                return <Message key={index} isUser={message.isUser} text={message.text} />;
              } else if (message.topic !== undefined) {
                return (
                  <QAMessage
                    key={index}
                    topic={message.topic}
                    scrollToBottom={scrollToBottom}
                    handleQAButtonPress={handleQAButtonPress}
                    messageCount={messageCount}
                    setMessageCount={setMessageCount}
                  />
                ); // scrollToBottom prop is passed to QAMessage for when questions are fetched
              } else if (message.handleCharacterSelection !== undefined) {
                return <CharacterMessage key={index} handleCharacterSelection={handleCharacterSelection} />;
              } else if (message.handleSciptButtonPress !== undefined) {
                return <ScriptMessage key={index} character={message.character} handleSciptButtonPress={handleSciptButtonPress} scrollToBottom={scrollToBottom} />;
              } else if (message.script !== undefined) {
                return <TimestampMessage key={index} script={message.script} />;
              }
            })}
            <TimestampMessage />
            {/* <CharacterMessage /> */}
            {/* Reference for the bottom of the messages */}
            <div ref={messagesEndRef} />
          </div>

          {/* Chatbot input */}
          <div className="mt-auto col-12 mb-3">
            <input
              type="text"
              className="form-control text-white"
              placeholder="Type your response here"
              style={{ backgroundColor: "#808080" }}
              value={input}
              disabled={messageCount > 0} // Disables the input after the topic is provided
              onChange={handleInputChange}
              onKeyDown={handleSendMessage}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
