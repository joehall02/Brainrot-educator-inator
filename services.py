import openai
from elevenlabs.client import ElevenLabs
from elevenlabs import Voice, VoiceSettings, save
import os
from moviepy.editor import AudioFileClip, CompositeAudioClip, VideoFileClip
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
                "content": """You’re going to be provided with a topic, I want you to respond with 3 short questions and short answers
                to each of those questions. The questions need to have a definite answer, make sure the answers are no longer than a few
                words. Make the questions more difficult as they progress, with question 3 being the hardest. Respond with the question on one line,
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
                answers, write ‘Question x’ and ‘The answer is z’ with x being the question number and z being the answer. After reading the brief intro, 
                reading each question and reading each answer, include '<breaktime="2s" />' to indicate a pause.              
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

    # Save the voiceover as voiceover.mp3 in the video_files folder
    save(audio, "video_files/voiceover.mp3") 

    return "Voiceover generated successfully"

# Function to parse the timestamp into seconds
def parse_timestamp(timestamp):
    minutes, seconds = map(int, timestamp.split(":")) # Split the timestamp into minutes and seconds
    return minutes * 60 + seconds # Convert the timestamp into seconds

# Function to split the voiceover into sections based on the timestamps
def split_voiceover(timestamps):
    # Load the voiceover
    voiceover = AudioFileClip("video_files/voiceover.mp3")

    # Parse the timestamps into seconds
    intro_start = 0
    intro_end = parse_timestamp(timestamps["IntroE"])
    q1_start = parse_timestamp(timestamps["Q1S"])
    q1_end = parse_timestamp(timestamps["Q1E"])
    a1_start = parse_timestamp(timestamps["A1S"])
    a1_end = parse_timestamp(timestamps["A1E"])
    q2_start = parse_timestamp(timestamps["Q2S"])
    q2_end = parse_timestamp(timestamps["Q2E"])
    a2_start = parse_timestamp(timestamps["A2S"])
    a2_end = parse_timestamp(timestamps["A2E"])
    q3_start = parse_timestamp(timestamps["Q3S"])
    q3_end = parse_timestamp(timestamps["Q3E"])
    a3_start = parse_timestamp(timestamps["A3S"])
    a3_end = parse_timestamp(timestamps["A3E"])
    outro_start = parse_timestamp(timestamps["OutroS"])
    outro_end = voiceover.duration

    # Create subclips
    intro = voiceover.subclip(intro_start, intro_end)
    q1 = voiceover.subclip(q1_start, q1_end)
    a1 = voiceover.subclip(a1_start, a1_end)
    q2 = voiceover.subclip(q2_start, q2_end)
    a2 = voiceover.subclip(a2_start, a2_end)
    q3 = voiceover.subclip(q3_start, q3_end)
    a3 = voiceover.subclip(a3_start, a3_end)
    outro = voiceover.subclip(outro_start, outro_end)

    # Write the subclips to files
    intro.write_audiofile("video_files/audio/intro.mp3")
    q1.write_audiofile("video_files/audio/q1.mp3")
    a1.write_audiofile("video_files/audio/a1.mp3")
    q2.write_audiofile("video_files/audio/q2.mp3")
    a2.write_audiofile("video_files/audio/a2.mp3")
    q3.write_audiofile("video_files/audio/q3.mp3")
    a3.write_audiofile("video_files/audio/a3.mp3")
    outro.write_audiofile("video_files/audio/outro.mp3")

    return "Voiceover split successfully"


# Function to create a video using the timestamps
def create_video(questions):
    # Load the background video
    background_video = VideoFileClip("video_files/gameplay.mp4")

    # Load the audio files
    intro_audio = AudioFileClip("video_files/audio/intro.mp3")
    q1_audio = AudioFileClip("video_files/audio/q1.mp3")
    a1_audio = AudioFileClip("video_files/audio/a1.mp3")
    q2_audio = AudioFileClip("video_files/audio/q2.mp3")
    a2_audio = AudioFileClip("video_files/audio/a2.mp3")
    q3_audio = AudioFileClip("video_files/audio/q3.mp3")
    a3_audio = AudioFileClip("video_files/audio/a3.mp3")
    outro_audio = AudioFileClip("video_files/audio/outro.mp3")
    countdown_audio = AudioFileClip("video_files/audio/countdown.mp3")
    background_music = AudioFileClip("video_files/audio/music.mp3")

    # Calculate the start times for each audio clip
    q1_start = intro_audio.duration + 1 # Add 1 second to stop audio overlap
    countdown1_start = q1_start + q1_audio.duration
    a1_start = countdown1_start + countdown_audio.duration
    q2_start = a1_start + a1_audio.duration
    countdown2_start = q2_start + q2_audio.duration
    a2_start = countdown2_start + countdown_audio.duration
    q3_start = a2_start + a2_audio.duration
    countdown3_start = q3_start + q3_audio.duration
    a3_start = countdown3_start + countdown_audio.duration
    outro_start = a3_start + a3_audio.duration

    # Set the audio clips to start at the correct times
    intro_audio = intro_audio.set_start(0)
    q1_audio = q1_audio.set_start(q1_start)
    countdown1_audio = countdown_audio.set_start(countdown1_start)
    a1_audio = a1_audio.set_start(a1_start)
    q2_audio = q2_audio.set_start(q2_start)
    countdown2_audio = countdown_audio.set_start(countdown2_start)
    a2_audio = a2_audio.set_start(a2_start)
    q3_audio = q3_audio.set_start(q3_start)
    countdown3_audio = countdown_audio.set_start(countdown3_start)
    a3_audio = a3_audio.set_start(a3_start)
    outro_audio = outro_audio.set_start(outro_start)

    # Combine the audio clips into a single audio track
    final_audio = CompositeAudioClip([intro_audio, q1_audio, countdown1_audio, a1_audio, q2_audio, countdown2_audio, a2_audio, q3_audio, countdown3_audio, a3_audio, outro_audio])

    # Clip the background video to the length of the audio
    background_video = background_video.subclip(0, final_audio.duration)

    # Loop background music to the length of the video
    background_music = background_music.set_duration(background_video.duration).volumex(0.05) # Adjusts the volume of the background music

    # Combine the background music with the final audio
    final_audio_with_music = CompositeAudioClip([final_audio, background_music])

    # Set the final audio to the background video
    final_video = background_video.set_audio(final_audio_with_music)

    # Save the final video
    final_video.write_videofile("video_files/final_video.mp4", codec="libx264", audio_codec="aac")

    return "Video created successfully"