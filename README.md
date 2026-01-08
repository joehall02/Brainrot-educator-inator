# Brainrot Educator-inator

An AI-powered web app that generates "brainrot"-style TikTok quiz videos. Users provide a topic and choose from several characters; the app then uses OpenAI to generate quiz questions and a character-specific script, ElevenLabs to synthesize the voiceover, and MoviePy to assemble a gameplay-style video with countdowns, labels, and answer reveals.

---

## Description

Brainrot Educator-inator turns any topic into a TikTok quiz. The flow is:

1. User enters a topic in the React frontend.
2. Flask backend calls OpenAI (GPT-4o) to generate three short Q&A pairs.
3. Backend calls OpenAI again to produce a 60s script in the voice of the chosen character, injecting "brainrot" words from `brainrot_words.txt`.
4. ElevenLabs generates a character voiceover for the script.
5. Timestamps are used to split the voiceover into clips.
6. Pre-provided gameplay/background assets and character art are composited with labels, countdown bars, and a follow animation to create a final TikTok-ready video.

The final video and intermediate audio files are written under `video_files/` and are served by the Flask API.

---

## Prerequisites

- **Accounts & API keys**
  - OpenAI account and API key (GPT-4o access)
  - ElevenLabs account and API key
  - Configured ElevenLabs voices for the supported characters
- **Local tooling**
  - Node.js 18+ and npm (for the React frontend)
  - Python 3.12+ (or compatible version) and `pip`
  - `ffmpeg` and ImageMagick installed (required for MoviePy video/audio processing)
- **Assets**
  - `brainrot_words.txt` at the project root containing one brainrot word/phrase per line
  - Video/audio assets in `video_files/` (paths expected by `services.py`):
    - `video_files/gameplay.mp4`
    - `video_files/countdown_bar.mov`
    - `video_files/follow_animation.mov`
    - `video_files/characters/andrew_tate.png`
    - `video_files/characters/homelander.png`
    - `video_files/characters/peter_griffin.png`
    - `video_files/characters/spongebob.png`
    - `video_files/audio/countdown.mp3`
    - `video_files/audio/music.mp3`

> Note: When building via Docker, the Dockerfile also installs `ffmpeg`, ImageMagick, Ghostscript, and fonts for you.

---

## Tech Stack

- **Frontend**
  - React 18 (Create React App)
  - Bootstrap 5

- **Backend**
  - Flask

- **AI & Audio**
  - OpenAI GPT-4o (via `openai` Python SDK)
  - ElevenLabs TTS (via `elevenlabs` Python SDK)

- **Build & Deployment**
  - Multi-stage Dockerfile (Node + Python) that builds the React app and serves it via Flask

---

## Features

- Generate three difficulty-graded quiz questions and answers for any topic
- Create character-specific scripts that mimic:
  - Homelander
  - Peter Griffin
  - Andrew Tate
  - Spongebob
- Inject configurable "brainrot" words into the script from `brainrot_words.txt`
- Generate AI voiceovers using ElevenLabs with per-character voice IDs and tuning parameters
- Split the main voiceover into subclips using user-provided timestamps
- Compose a final TikTok-style video with:
  - Gameplay background
  - Countdown bar overlays
  - Character artwork and follow animation
  - Color-coded answer labels (Easy / Medium / Hard)
- Serve generated audio and video files via REST endpoints

---

## Backend: Setup & Run

The backend is a Flask app defined in `app.py` and uses `services.py` for all AI/video logic.

### 1. Create a virtual environment and install dependencies

From the project root:

```bash
python3 -m venv .venv
source .venv/bin/activate  # Windows: .venv\\Scripts\\activate
pip install -r requirements.txt
```

### 2. Set up required folders

Make sure these folders exist so audio/video files can be written:

```bash
mkdir -p video_files/audio
mkdir -p video_files/characters
```

(Place your gameplay, countdown, music, and character image assets under `video_files/` as listed in **Prerequisites**.)

### 3. Configure environment variables

Create a `.env` file in the project root (see **Env Example** below) or export the variables in your shell.

### 4. Run the Flask backend

```bash
python app.py
```

The backend will start on `http://localhost:5001`.

---

## Frontend: Setup & Run

The frontend is a Create React App located in `frontend/`.

### 1. Install dependencies

```bash
cd frontend
npm install
```

### 2. Development mode

If you want to run the CRA dev server:

```bash
npm start
```

- This starts the React app on `http://localhost:3000`.
- API calls (in `frontend/src/apiServices.js`) are made to `/api/...` and rely on the CRA `proxy` configured in `frontend/package.json`. In Docker, this points to a backend service named `backend` on port 5001.
- For local dev without Docker, you may need to adjust the `proxy` in `frontend/package.json` to `http://localhost:5001` so requests are forwarded correctly.

### 3. Production build (served by Flask)

To serve the React app directly from Flask (`app.py` uses `frontend/build` as its static folder):

```bash
cd frontend
npm run build
cd ..
python app.py
```

Flask will then serve the built React app from the root route (`/`).

---

## Env Example

Create a `.env` file in the project root with at least the following variables set:

```env
# OpenAI
OPENAI_API_KEY=your-openai-api-key

# ElevenLabs
ELEVEN_LABS_API_KEY=your-elevenlabs-api-key

# ElevenLabs voice IDs for each character
ANDREW_TATE_VOICE_ID=your-andrew-tate-voice-id
HOMELANDER_VOICE_ID=your-homelander-voice-id
PETER_GRIFFIN_VOICE_ID=your-peter-griffin-voice-id
SPONGEBOB_VOICE_ID=your-spongebob-voice-id
```

---

## Docker Build & Run (Recommended)

A multi-stage Dockerfile is provided at the project root.

### Build the image

```bash
docker build -t brainrot-educator-inator .
```

### Run the container

Make sure you pass the required environment variables and mount any local `video_files` and asset directories you need:

```bash
docker run \
  -p 5001:5001 \
  -e OPENAI_API_KEY=your-openai-key \
  -e ELEVEN_LABS_API_KEY=your-elevenlabs-key \
  -e HOMELANDER_VOICE_ID=your-homelander-voice-id \
  -e PETER_GRIFFIN_VOICE_ID=your-peter-griffin-voice-id \
  -e ANDREW_TATE_VOICE_ID=your-andrew-tate-voice-id \
  -e SPONGEBOB_VOICE_ID=your-spongebob-voice-id \
  brainrot-educator-inator
```

The container exposes port `5001` by default.

---

> You can obtain the voice IDs from the ElevenLabs dashboard for each configured voice. Make sure each character has a matching configured voice; otherwise voiceover generation will fail.