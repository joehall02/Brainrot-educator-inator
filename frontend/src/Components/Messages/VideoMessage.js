import React, { useState, useEffect } from "react";
import "./Message.css";
import { generateVideo } from "../../apiServices";

const VideoMessage = ({ videoPath, scrollToBottom }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Function to render the video
    const fetchVideo = async () => {
      try {
        await generateVideo();
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false); // Set isLoading to false when the video is rendered
      }
    };

    fetchVideo(); // Call the fetchVideo function
  }, []); // Empty dependency array to run the effect only once

  useEffect(() => {
    scrollToBottom();
  }, [isLoading]);

  return (
    <div className="d-flex justify-content-start">
      <div className="chatbot-message text-white w-100">
        {isLoading ? (
          <p>Video is rendering...</p>
        ) : (
          <>
            <p className="fw-bold">Here is your video:</p>
            <video src={videoPath} controls style={{ maxWidth: "100%" }}></video>
          </>
        )}
      </div>
    </div>
  );
};

export default VideoMessage;
