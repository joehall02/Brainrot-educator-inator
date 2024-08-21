import "./Chatbot.css";

const Chatbot = () => {
  return (
    <div>
      <div className="d-flex justify-content-center mt-3">
        {/* Chatbot background */}
        <div className="d-flex col-12 col-lg-6 mb-4 justify-content-center chatbot-background">
          {/* Chatbot container */}
          <div className="d-flex justify-content-center flex-column col-12 col-lg-10">
            {/* Chatbot messages */}
            <div className="d-flex flex-column col-11 col-lg-12 overflow-auto mx-auto" style={{ maxHeight: "620px" }}>
              {/* Conversation title */}
              <div className="d-flex text-center flex-column py-4 col-12" aria-label="Conversation Title">
                <h5 className="text-white fw-bold mx-auto">Title</h5>
              </div>
            </div>
            {/* Chatbot input */}
            <div className="mt-auto col-11 col-lg-12 mb-3 mx-auto" aria-label="Chatbot Message Input">
              <input type="text" className="form-control text-white" placeholder="Type your response here" style={{ backgroundColor: "#808080" }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
