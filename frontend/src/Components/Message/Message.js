import "./Message.css";

const Message = ({ isUser, text, audiosrc }) => {
  const messageStyle = isUser ? "user-message" : "chatbot-message";
  const justifyContent = isUser ? "justify-content-end" : "justify-content-start";

  return (
    <div className={`d-flex ${justifyContent}`}>
      <div className={`${messageStyle} text-white`}>
        <p>{text}</p>
      </div>
    </div>
  );
};

export default Message;
