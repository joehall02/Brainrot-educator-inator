// Function to fetch questions from the api
export const generateQuestions = async (topic) => {
  try {
    const response = await fetch("/api/questions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ topic }),
    });
    if (!response.ok) {
      throw new Error("Failed to generate questions");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
};

// Function to fetch the video script from the api
export const generateScript = async (character) => {
  try {
    const response = await fetch("/api/script", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ character }),
    });
    if (!response.ok) {
      throw new Error("Failed to generate script");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
};

// Function to create the AI voiceover
export const generateVoiceover = async (script) => {
  try {
    const response = await fetch("/api/voiceover", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ script }),
    });
    if (!response.ok) {
      throw new Error("Failed to create voiceover");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
};

// Function to split the voiceover into smaller audio clips
export const splitVoiceover = async (timestamps) => {
  try {
    const response = await fetch("/api/timestamps", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ timestamps }),
    });
    if (!response.ok) {
      throw new Error("Failed to split voiceover");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
};

// Function to generate the video
// export const generateVideo = async () => {
//   try {
//     const response = await fetch("api/video")
//   }
// }
