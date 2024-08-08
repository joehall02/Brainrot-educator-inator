import openai
import os
from dotenv import load_dotenv

# Load the .env file
load_dotenv()

brainrot_words = open("brainrot_words.txt", "r").read().split("\n")

# Set the API key
openai.api_key = os.getenv("OPENAI_API_KEY")

# Function to generate questions based on the topic
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

# Function to generate a script using the questions and character
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

