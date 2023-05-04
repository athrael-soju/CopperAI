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

It's fun!.

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

```
- OpenAI API key: https://platform.openai.com/account/api-keys
- Google Cloud TTS API key: https://cloud.google.com/text-to-speech
```

- Environment Variables:

```
- Rename frontend\.env.local to frontend\.env and set the values:
    - OPENAI_API_KEY=''
    - SERVER_PORT=5000
    - SERVER_ADDRESS='http://localhost'
    - SERVER_MESSAGE_ENDPOINT='/message'
    - SERVER_SPEAK_ENDPOINT='/speak'
    - AUDIO_DB_SENSITIVITY='-45'
- Rename backend\.env.local to backend\.env and set values:
    - SERVER_PORT=5000
    - OPENAI_API_KEY="YOUR_API_KEY"
    - OPENAI_API_MODEL="gpt-3.5-turbo"
    - GOOGLE_CLOUD_TTS_LANGUAGE="en-US"
    - GOOGLE_CLOUD_TTS_NAME="en-US-Neural2-J"
    - GOOGLE_CLOUD_TTS_GENDER="MALE"
    - GOOGLE_CLOUD_TTS_ENCODING="MP3"
```

- rename backend\credentials\google.api.local.json into backend\credentials\google.api.json and paste details of you google service_account key file details

### Installing

- Clone the repository:
  ```
  git clone https://github.com/athrael-soju/whisperChat.git'
  ```
- Run npm install in both backend and frontend folders:

  ```
  cd frontend
  npm install

  cd backend
  npm install
  ```

- Alternatively, you can run with Docker
  ```
  docker-compose up --build -d
  ```

You should be able to access the application at http://localhost:3000

## 🎈 Usage <a name="usage"></a>

- Record allows the user to initiate continuous discussion.
- Pause will pause recording, but pressing Record again will resume it.
- Stop will stop the ongoing discussion.

## 🚀 Deployment <a name = "deployment"></a>

- TODO

## ⛏️ Built Using <a name = "built_using"></a>

- [Docker](https://www.docker.com/) - Containerization
- [ReactJs](https://react.dev/) - Frontend
- [NodeJs](https://nodejs.org/en/) - Backend
- [OpenAI Whisper API](https://openai.com/blog/introducing-chatgpt-and-whisper-apis) - ChatGPT and Whisper model integration.
- [Google TTS](https://cloud.google.com/text-to-speech/) - Converts text into natural-sounding speech.
- [Whisper Hook by chengsokdara](https://github.com/chengsokdara/use-whisper) - React Hook for OpenAI Whisper API with speech recorder, real-time transcription and silence removal.

## ✍️ Authors <a name = "authors"></a>

- [@athrael-soju](https://github.com/athrael-soju) - Idea & Initial work

## 🎉 Acknowledgements <a name = "acknowledgement"></a>

- TODO
