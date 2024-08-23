import "./Chatbot.css";
import Message from "../Message/Message";
import { generateQuestions, generateScript, generateVoiceover, splitVoiceover } from "../../apiServices";

const Chatbot = () => {
  return (
    <div className="d-flex justify-content-center">
      {/* Chatbot background */}
      <div className="d-flex col-10 col-lg-6 justify-content-center shadow-lg chatbot-background">
        {/* Chatbot container */}
        <div className="d-flex flex-column col-10 overflow-auto">
          {/* Conversation title */}
          <div className="py-4 col-12">
            <h5 className="text-white fw-bold text-center">Brainrot-educator-inator</h5>
          </div>

          <Message isUser={false} text={"What topic should I base the questions on?"} />
          <Message isUser={true} text={"1980's Movies"} />

          {/* Chatbot input */}
          <div className="mt-auto col-12 mb-3">
            <input type="text" className="form-control text-white" placeholder="Type your response here" style={{ backgroundColor: "#808080" }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
