import Chatbot from "./Components/Chatbot/Chatbot";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

function App() {
  return (
    <div className="d-flex align-items-center justify-content-center vh-100 animated-background">
      <div className="container">
        <Chatbot />
      </div>
    </div>
  );
}

export default App;
