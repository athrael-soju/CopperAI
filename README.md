<p align="center">
  <a href="" rel="noopener">
 <img src="https://github.com/athrael-soju/whisperChat/blob/main/Landing-s.png" alt="Project logo"></a>
</p>

<h3 align="center">Project Title</h3>

<div align="center">

[![Status](https://img.shields.io/badge/status-active-success.svg)]()
[![GitHub Issues](https://img.shields.io/github/issues/athrael-soju/whisperChat)](https://github.com/athrael-soju/whisperChat/issues)
[![GitHub Pull Requests](https://img.shields.io/github/issues-pr/athrael-soju/whisperChat)](https://img.shields.io/github/issues-pr/athrael-soju/whisperChat)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](/LICENSE)

</div>

---

<p align="center"> whisperChat is a fully voiced conversational partner.
    <br> 
</p>

## 📝 Table of Contents

- [About](#about)
- [Getting Started](#getting_started)
- [Deployment](#deployment)
- [Usage](#usage)
- [Built Using](#built_using)
- [Authors](#authors)
- [Acknowledgments](#acknowledgement)

## 🧐 About <a name = "about"></a>

WhisperChat is an Open Source application that allows fully voiced conversation with chatGPT. Customization allows:
    - Use of Pinecone for reducing # of API calls to OpenAI API(although its use in conversation is limited)
    - Initialization with a prompt, although with ChatGPT 3.5 Turbo it's not as effective/usable. 
    - ...

## 🏁 Getting Started <a name = "getting_started"></a>

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See [deployment](#deployment) for notes on how to deploy the project on a live system.

### Prerequisites

- Software/Libraries:

    ```
    - Docker 4.16 with Docker Compose V2 enabled
    - Node.js 18+
    - React.js 18+
    ```

- Credentials:
    - [OpenAI API key](https://platform.openai.com/account/api-keys)
    - [Google Cloud TTS API key](https://cloud.google.com/text-to-speech)
    - [Pinecone API key](https://www.pinecone.io/)

### Installing

- Clone the repository:
  ```
  git clone https://github.com/athrael-soju/whisperChat.git'
  ```
- Create API keys for:
    ```
    - OpenAI API key (You can get some free credits upon account creation)
    - Google Gloud Service Account JSON credentials (Again, you get some allowance with a free account creation)
    - Pinecone API key (There's a waitlist for a free account)
    ```

- Set Environment Variables (Your values may vary):

    ```
    - Rename frontend\.env.local to frontend\.env and set the values:
        # OpenAI
        OPENAI_API_KEY='YOUR_API_KEY'
        # Backend
        SERVER_PORT=5000
        SERVER_ADDRESS='http://localhost'
        SERVER_MESSAGE_ENDPOINT='/message'
        SERVER_SPEAK_ENDPOINT='/speak'
        SERVER_LOGIN_ENDPOINT='/auth/login'
        SERVER_REGISTER_ENDPOINT='/auth/register'
        SERVER_GUEST_ENDPOINT='/auth/guest'
        AUDIO_DB_SENSITIVITY='-55' - Adjust as needed
    ```
    ```
    - Rename backend\.env.local to backend\.env and set values:
        - NODE_ENV="dev"
        - SERVER_PORT=5000
        - # OpenAI
        - OPENAI_API_KEY="YOUR_API_KEY"
        - OPENAI_API_MODEL="gpt-3.5-turbo"
        - # Model Load Parameters
        - MODEL_DIRECTIVE="directive"
        - # Google Cloud TTS
        - GOOGLE_CLOUD_TTS_LANGUAGE="en-US"
        - GOOGLE_CLOUD_TTS_NAME="en-US-Neural2-J"	
        - GOOGLE_CLOUD_TTS_GENDER="MALE"
        - GOOGLE_CLOUD_TTS_ENCODING="MP3"
        - # DB & Cache
        - MONGO_URI="mongodb://admin:secret@mongodb:27017/myapp?authSource=admin"
        - # Secrets
        - JWT_SECRET="secret"
        - # Pinecone Vector Search
        - PINECONE_ENABLED=false
        - PINECONE_API_KEY="YOUR_API_KEY"
        - PINECONE_ADDRESS="http://pinecone"
        - PINECONE_PORT=4000
        - PINECONE_TOPK=5
        - PINECONE_THRESHOLD=0.95
    ```
    ```
   - If you choose to use Pinecone, Rename pinecone\.env.local to pinecone\.env and set values:    
        # OpenAI
        OPENAI_API_KEY="YOUR_API_KEY"
        # Pinecone Vector Search
        PINECONE_API_KEY="YOUR_API_KEY"
        PINECONE_ADDRESS="http://pinecone"
        PINECONE_PORT=4000
        PINECONE_ENVIRONMENT="YOUR_PINECONE_ENV"
        PINECONE_NAMESPACE="default"
        PINECONE_INDEX="whisper-index"
    ```
    ```
    - Additionally, replace backend/credentials/google.api.local.json with backend/credentials/google.api.json and copy/paste your google cloud JSON credentials there.
    ```

- Run npm install in each service folder:

  ```
  cd frontend / backend / pinecone
  npm install
  ```

- Alternatively, you can run them all with Docker
  ```
  - docker-compose up --build -d for all services
  ```

You should be able to access the application at http://localhost:3000

## 🎈 Usage <a name="usage"></a>
- Once deployed, login as guest, or create a basic account.
- Record allows the user to initiate continuous discussion.
- Pause will pause recording, but pressing Record again will resume it.
- Stop will stop the ongoing discussion.

## 🚀 Deployment <a name = "deployment"></a>

- No Deployments currently available.

## ⛏️ Built Using <a name = "built_using"></a>

- [Docker](https://www.docker.com/) - Containerization
- [ReactJs](https://react.dev/) - Frontend
- [NodeJs](https://nodejs.org/en/) - backend
- [OpenAI Whisper API](https://openai.com/blog/introducing-chatgpt-and-whisper-apis) - ChatGPT and Whisper model integration.
- [Google TTS](https://cloud.google.com/text-to-speech/) - Converts text into natural-sounding speech.
- [Whisper Hook by chengsokdara](https://github.com/chengsokdara/use-whisper) - React Hook for OpenAI Whisper API with speech recorder, real-time transcription and silence removal.

## ✍️ Authors <a name = "authors"></a>

- [@athrael-soju](https://github.com/athrael-soju) - Idea & Initial work

## 🎉 Acknowledgements <a name = "acknowledgement"></a>
- Your name goes here :)
