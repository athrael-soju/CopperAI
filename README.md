<p align="center">
  <a href="https://youtu.be/sKZhZ-gwTqY" target="_blank" rel="noopener">
 <img src="https://github.com/athrael-soju/whisperChat/blob/main/Landing-s.png" alt="Project logo"></a> 
</p>
<div align="center">

[![Status](https://img.shields.io/badge/status-active-success.svg)]()
[![GitHub Issues](https://img.shields.io/github/issues/athrael-soju/whisperChat)](https://github.com/athrael-soju/whisperChat/issues)
[![GitHub Pull Requests](https://img.shields.io/github/issues-pr/athrael-soju/whisperChat)](https://img.shields.io/github/issues-pr/athrael-soju/whisperChat)
[![License](https://img.shields.io/badge/license-GNU%20GPL-blue.svg)](/LICENSE)

</div>

---

## 📝 Table of Contents

- [About](#about)
- [Architecture](#architecture)
- [Getting Started](#getting_started)
- [Deployment](#deployment)
- [Usage](#usage)
- [Built Using](#built_using)
- [Authors](#authors)
- [Acknowledgments](#acknowledgement)
- [Want to Contribute?](#contribute)

## 🧐 About <a name = "about"></a>

WhisperChat is an advanced voice assistant for efficient communication, personalized context-aware interaction, persistent memory, and tailored data interpretation.". Features include:

- Fully voiced, hands free interaction, using the OpenAI whisper API for speech to text, as well as the Google cloud API text to speech.
- Persistent, multi user memory, with the ability to injest and interact with custom documents.
- The ability to adjust its persona and response type based on user profile and professional aptitude.

## 🏗️ Architecture <a name = "architecture"></a>

Notes:

- Pinecone can be turned off via feature flag in .env of the backend Service.

![whisperChat](https://github.com/athrael-soju/whisperChat/assets/25455658/becbb819-bd4c-4529-88f5-e390a280cabd)

## 🏁 Getting Started <a name = "getting_started"></a>

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See [deployment](#deployment) for notes on how to deploy the project on a live system.

### Prerequisites

- Software/Libraries:

  ```
  - Docker 4.16 with Docker Compose V2 enabled
  - Node.js 18+
  - React.js 18+
  - MongoDB 5.0+ (can be run in Docker)
  ```

- Credentials:
  - [OpenAI API key](https://platform.openai.com/account/api-keys) (You can get some free credits upon account creation)
  - [Google Cloud TTS API key](https://cloud.google.com/text-to-speech) (You get some allowance with a free account creation)
  - [Pinecone API key](https://www.pinecone.io/) (There maybe a waitlist for a free account)

### Installing

- Clone the repository:
  ```
  git clone https://github.com/athrael-soju/whisperChat.git'
  ```
- Create API keys for:

  ```
  - OpenAI API key
  - Google Gloud Service Account JSON credentials
  - Pinecone API key
  ```

- Set Environment Variables for each service:

  - Rename frontend/.env.local to frontend/.env and set the values:

  ```
  # OpenAI
  OPENAI_API_KEY='YOUR_API_KEY'
  # Backend
  SERVER_PORT=5000 - Adjust as needed
  SERVER_ADDRESS='http://localhost' - Adjust as needed
  SERVER_MESSAGE_ENDPOINT='/message'
  SERVER_SPEAK_ENDPOINT='/speak'
  SERVER_LOGIN_ENDPOINT='/auth/login'
  SERVER_REGISTER_ENDPOINT='/auth/register'
  SERVER_GUEST_ENDPOINT='/auth/guest'
  AUDIO_DB_SENSITIVITY='-55' - Adjust as needed
  ```

  - Rename backend/.env.local to backend/.env and set values:

  ```
  NODE_ENV="dev"
  SERVER_PORT=5000 - Adjust as needed
  # OpenAI
  OPENAI_ENABLED=true - Setting this to false will respond with a generic message. Used for testing.
  OPENAI_API_KEY="YOUR_API_KEY"
  OPENAI_API_MODEL="gpt-3.5-turbo"
  # Model Load Parameters
  DIRECTIVE_ENABLED=false
  MODEL_DIRECTIVE="directive" - Choose a directive from the list of directives in the backend/src/data folder
  # Google Cloud TTS
  GOOGLE_CLOUD_TTS_LANGUAGE="en-US" - Adjust as needed
  GOOGLE_CLOUD_TTS_NAME="en-US-Neural2-J" - Adjust as needed
  GOOGLE_CLOUD_TTS_GENDER="MALE" - Adjust as needed
  GOOGLE_CLOUD_TTS_ENCODING="MP3" - Adjust as needed
  # DB & Cache
  MONGO_URI="mongodb://admin:secret@mongodb:27017/myapp?authSource=admin" - Adjust as needed
  # Secrets
  JWT_SECRET="secret"
  # Pinecone Vector Search
  PINECONE_ENABLED=false - Adjust as needed
  PINECONE_API_KEY="YOUR_API_KEY"
  PINECONE_ADDRESS="http://pinecone"
  PINECONE_PORT=4000 - Adjust as needed
  PINECONE_TOPK=5 - Adjust as needed
  PINECONE_THRESHOLD=0.95 - Adjust as needed
  ```

  - If you choose to use Pinecone, Rename pinecone/.env.local to pinecone/.env and set values:

  ```
  # OpenAI
  OPENAI_API_KEY="YOUR_API_KEY"
  # Pinecone Vector Search
  PINECONE_API_KEY="YOUR_API_KEY"
  PINECONE_ADDRESS="http://pinecone" - Adjust as needed
  PINECONE_PORT=4000 - Adjust as needed
  PINECONE_ENVIRONMENT="YOUR_PINECONE_ENV"
  PINECONE_NAMESPACE="default" - Adjust as needed
  PINECONE_INDEX="whisper-index" - Adjust as needed
  ```

  - Additionally, replace backend/credentials/google.api.local.json with backend/credentials/google.api.json and copy/paste your google cloud JSON credentials there

- Start Mongodb Docker container (if you don't have it installed locally):

  ```
  docker run -d -p 27017:27017 --name mongodb mongo:latest
  ```

- Run npm install in each service folder (frontend, backend, pinecone):

  ```
  cd frontend / backend / pinecone
  npm install
  ```

- Alternatively, you can run them all with Docker (after running npm start once in the frontend to init the env.js file)

  ```
  docker-compose up --build -d using the docker-compose.yml file
  docker-compose up --build -d frontend for frontend only
  docker-compose up --build -d backend for backend only
  docker-compose up --build -d pinecone for pinecone only
  ```

You should be able to access the application at http://localhost:3000 (or whichever port you set in the frontend\.env file)

## 🎈 Usage <a name="usage"></a>

- Once deployed, login as guest, or create a basic account.
  Voice Chat:
  - Record allows the user to initiate continuous discussion.
  - Pause will pause recording, but pressing Record again will resume it.
  - Stop will stop the ongoing discussion.
    Text Chat:
  - This can be achieved by sending a request to the endpoints directly, via Postman.
  - A sample POST message can be send to localhost:5000/message and contain form-data (username, message) and the response will be returned to the body.

## 🚀 Deployment <a name = "deployment"></a>

- No Deployments currently available.

## ⛏️ Built Using <a name = "built_using"></a>

- [Docker](https://www.docker.com/) - Containerization and deployment.
- [ReactJs](https://react.dev/) - Web Framework for frontend service.
- [NodeJs](https://nodejs.org/en/) - Server Environment for backend and pinecone services.
- [OpenAI Whisper API](https://openai.com/blog/introducing-chatgpt-and-whisper-apis) - ChatGPT and Whisper model integration for chatbot functionality.
- [Google TTS](https://cloud.google.com/text-to-speech/) - Converts text into natural-sounding speech in a variety of languages and voices.
- [Whisper Hook by chengsokdara](https://github.com/chengsokdara/use-whisper) - React Hook for OpenAI Whisper API with speech recorder, real-time transcription and silence removal functionality.
- [Langchain](https://js.langchain.com/docs/) - Framework for developing applications powered by language models.

## ✍️ Authors <a name = "authors"></a>

- [@athrael-soju](https://github.com/athrael-soju) - Idea & Initial work

## 🎉 Acknowledgements <a name = "acknowledgement"></a>

- [Whisper Hook by chengsokdara](https://github.com/chengsokdara/use-whisper)

## Want to Contribute? <a name = "contribute"></a>

- Fork the repo
- Make your changes
- Submit a pull request
- I'll review it and merge it
