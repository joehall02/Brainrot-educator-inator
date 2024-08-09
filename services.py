import openai
from elevenlabs.client import ElevenLabs
from elevenlabs import Voice, VoiceSettings, save
import os
from dotenv import load_dotenv

# Load the .env file
load_dotenv()

# Set api keys
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
ELEVEN_LABS_API_KEY = os.getenv("ELEVEN_LABS_API_KEY")

# Set voice ids for the characters
ANDREW_TATE_VOICE_ID = os.getenv("ANDREW_TATE_VOICE_ID")
HOMELANDER_VOICE_ID = os.getenv("HOMELANDER_VOICE_ID")
PETER_GRIFFIN_VOICE_ID = os.getenv("PETER_GRIFFIN_VOICE_ID")
SPONGEBOB_VOICE_ID = os.getenv("SPONGEBOB_VOICE_ID")

# Get the brainrot words from the txt file
brainrot_words = open("brainrot_words.txt", "r").read().split("\n")

# Set the API key
openai.api_key = OPENAI_API_KEY

# Function to generate questions based on the topic using OpenAI's GPT-4o model
def get_questions(topic):
    response = openai.chat.completions.create(
        model="gpt-4o", # Using the GPT-4o model
        messages=[ # Custom prompt with instructions on how to generate and display the questions and answers
            {
                "role": "system",
                "content": """You’re going to be provided with a topic, I want you to respond with 5 short questions and short answers
                to each of those questions. The questions need to have a definite answer, make sure the answers are no longer than a few
                words. Make the questions more difficult as they progress, with question 5 being the hardest. Respond with the question on one line,
                then put the answer on a separate line. Do not include any special characters in the questions or answer, only include 
                'Qx:' and 'Ax:' infront of the questions and answers with 'x' being the question number. If something unrelated is provided or 
                something that could not be a topic for questions then ignore it and respond with ‘Please provide a topic for the questions.’"""
            },
            {"role": "user", "content": topic} # Providing the topic to generate questions
        ]
    )

    return response.choices[0].message.content

# Function to generate a script using the questions and character using OpenAI's GPT-4o model
def get_script(questions, character):
    response = openai.chat.completions.create(
        model="gpt-4o" , # Using the GPT-4o model
        messages=[ # Custom prompt with instructions on how to generate and display the script
            {
                "role": "system",
                "content": """You are going to create the script for a 60 second TikTok video, the video involves a character giving a 
                brief intro and then asking the viewer a series of questions, then after 5 seconds revealing the answer. At the end of the script 
                include a short segment telling viewers to follow, like and comment how many questions they got right. The script needs to mimic 
                the style of the provided character. You will also be including ‘Brainrot’ words into the script, next to some of these words 
                will be a definition so that you have more context as to how to insert these words into the script, these words are intended to 
                be funny. You do not need to include every single word only include them if they make sense. You are going to be provided: 
                a list of ‘Brainrot’ words to use in the script, the character you need to mimic and most importantly, a list of the questions 
                and answers to base the video around. Do not include mentions of the timer or 5 second pause. The quiz is not multichoice, 
                do not give the viewer the option between the answer and something else. Do not give stage directions for the character or 
                mention anything about an intro/outro, I only need the script to include what the character says. For each set of questions and 
                answers, write ‘Question x’ and ‘The answer is z’ with x being the question number and z being the answer.               
                """
            },
            { # Providing the brainrot words, character, and questions to generate the script
                "role": "user",
                "content": f"""Brainrot words:
                {brainrot_words}

                Character:
                {character}

                Questions and answers:
                {questions}
                """
            }
        ]
    )

    return response.choices[0].message.content

# Function to generate ai voice over with the script using Eleven Labs API
def get_voiceover(script, character):
    # Create a client object with the API key
    client = ElevenLabs(
        api_key=ELEVEN_LABS_API_KEY
    ) 

    print(script)

    # Define voice settings
    voice_id = ""
    stability = 0
    similarity_boost = 0
    style = 0

    # Set the voice id, stability, similarity boost, and style based on the character
    if character == "Andrew Tate":
        voice_id = ANDREW_TATE_VOICE_ID
        stability = 0.65
        similarity_boost = 0.9
        style = 0.1
    elif character == "Homelander":
        voice_id = HOMELANDER_VOICE_ID
        stability = 0.5
        similarity_boost = 0.75
        style = 0.01
    elif character == "Peter Griffin":
        voice_id = PETER_GRIFFIN_VOICE_ID
        stability = 0.6
        similarity_boost = 0.9
        style = 0.1
    elif character == "Spongebob":
        voice_id = SPONGEBOB_VOICE_ID
        stability = 0.7
        similarity_boost = 0.5
        style = 0.25

    # Generate the voiceover
    audio = client.generate(
        text=script, # Using the script to generate the voiceover
        voice=Voice( # Using the voice settings
            voice_id=voice_id,
            settings = VoiceSettings(stability=stability, similarity_boost=similarity_boost, style=style, use_speaker_boost=True)
        ),
        model="eleven_multilingual_v2" # Using the eleven_multilingual_v2 model
    )

    # Save the voiceover as voiceover.mp3
    save(audio, "voiceover.mp3") 

    return "Voiceover generated successfully"