
<img src="header.svg" width="800" height="400">

</p>
<h3 align="center">Copper AI</h3>

<div align="center">

[![Status](https://img.shields.io/badge/status-active-success.svg)]()
[![GitHub Issues](https://img.shields.io/github/issues/kylelobo/The-Documentation-Compendium.svg)](https://github.com/athrael-soju/CopperAI/issues)
[![GitHub Pull Requests](https://img.shields.io/github/issues-pr/kylelobo/The-Documentation-Compendium.svg)](https://github.com/athrael-soju/CopperAI/pulls)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE.md)

</div>

---

<p align="center"> Copper AI is a Voice to Voice Web Application that leverages the latest LLM Technologies to deliver a hands free user experience.
    <br> 
</p>

## 📝 Table of Contents

- [Problem Statement](#problem_statement)
- [Idea / Solution](#idea)
- [Dependencies / Limitations](#limitations)
- [Future Scope](#future_scope)
- [Getting Started](#getting_started)
- [Usage](#usage)
- [Technology Stack](#tech_stack)
- [Authors](#authors)
- [Acknowledgments](#acknowledgments)
- [Contribute](#contribute)

## 🧐 Problem Statement <a name = "problem_statement"></a>

Professionals across various fields often confront unfamiliar or intricate situations, leading to inefficiencies and reduced customer satisfaction. Traditional solutions can be cumbersome, especially when professionals need hands-on interaction.

## 💡 Idea / Solution <a name = "idea"></a>

CopperAI offers a hands-free, voice-to-voice interaction system with a Large Language Model (LLM). Using voice commands, professionals can get instant guidance, troubleshooting steps, or relevant information without diverting their attention. Features:
- Fully voiced, hands free interaction.
- Persistent, multi user Vector based memory.
- The Ability to ingest and interact with custom documents, or even books.
- The ability to adjust its persona and response type based on user profile and professional aptitude.

## ⛓️ Dependencies / Limitations <a name = "limitations"></a>

 - **Dependencies**: Next.js, OpenAI, LangChain, Pinecone, MongoDB, Google Cloud Text-to-Speech, ElevenLabs and more.
 - **Limitations**: Potential limitations could relate to the accuracy of voice recognition, the need for an active internet connection

## 🚀 Future Scope <a name = "future_scope"></a>

Future enhancements could include integrating more advanced LLMs, expanding voice command capabilities, and supporting additional languages.

## 🏁 Getting Started <a name = "getting_started"></a>

These instructions will guide you on setting up CopperAI on your local machine for development.

### Prerequisites

- Ensure you have Node.js, MongoDB, and other related dependencies installed. 
- Copy your .env.public file to .env.local and populate required environment variables.
```
# OpenAI - Required
NEXT_PUBLIC_OPENAI_API_MODEL= 
NEXT_PUBLIC_OPENAI_API_KEY=

# Auth - Required
NEXTAUTH_URL="http://localhost:3000"
GOOGLE_ID= // Google Authentication
GOOGLE_SECRET= // Google Authentication

# TTS - google | elevenlabs - Optional
NEXT_PUBLIC_TTS_PROVIDER="google" // Default

# Google Cloud TTS - Optional
NEXT_PUBLIC_GOOGLE_CLOUD_TTS_ENCODING=MP3
NEXT_PUBLIC_GOOGLE_CLOUD_TTS_API_KEY=""

# Eleven Labs TTS - Optional
NEXT_PUBLIC_ELEVENLABS_TTS_API_KEY=
NEXT_PUBLIC_ELEVENLABS_TTS_VOICE_ID_IRIS=
NEXT_PUBLIC_ELEVENLABS_TTS_VOICE_ID_JUDE=

# MongoDB - Required
MONGODB_URI="mongodb://admin:secret@localhost:27017/myapp?authSource=admin" //Default

# Pinecone - Required
NEXT_PUBLIC_PINECONE_API_KEY=
NEXT_PUBLIC_PINECONE_ENVIRONMENT=
NEXT_PUBLIC_PINECONE_NAMESPACE=
NEXT_PUBLIC_PINECONE_INDEX=
NEXT_PUBLIC_PINECONE_SIMILARITY_CUTOFF=0.75
NEXT_PUBLIC_PINECONE_TOPK=1

# Langchain - Optional
NEXT_PUBLIC_LANGCHAIN_ENABLED="false" // If not enabled, application will use the OpenAI completion API
NEXT_PUBLIC_LANGCHAIN_CHUNK_SIZE=2000 // Customize as needed
NEXT_PUBLIC_LANGCHAIN_OVERLAP_SIZE=0.2 // Customize as needed
NEXT_PUBLIC_USE_CHAT_HISTORY="false" // Customize as needed
NEXT_PUBLIC_USE_CHAT_TEMPERATURE=0 // Customize as needed
NEXT_PUBLIC_USE_DOC_TEMPERATURE=0 // Customize as needed
NEXT_PUBLIC_RETURN_SOURCE_DOCS="false" // Customize as needed

# Speechly Polyfill - Required
NEXT_PUBLIC_SPEECHLY_APP_ID=
```

### Installing

Clone the repository and install the required packages.
```
git clone https://github.com/athrael-soju/CopperAI.git
cd CopperAI
npm install
```

## 🎈 Usage <a name="usage"></a>

After setting up, run `npm run dev` to launch the application. Visit `http://localhost:3000` to access CopperAI.

## ⛏️ Tech Stack <a name = "tech_stack"></a>

- [Next.js](https://nextjs.org/) - Web Framework
- [Docker](https://www.docker.com/) - Containerization and deployment.
- [ReactJs](https://react.dev/) - Web Framework for frontend service.
- [NodeJs](https://nodejs.org/en/) - Server Environment for backend and pinecone services.
- [OpenAI API](https://openai.com/blog/introducing-chatgpt-and-whisper-apis) - ChatGPT model integration for chatbot functionality.
- [Google TTS](https://cloud.google.com/text-to-speech/) - Converts text into natural-sounding speech in a variety of languages and voices.
- [Langchain](https://js.langchain.com/docs/) - Framework for developing applications powered by language models.

## ✍️ Authors <a name = "authors"></a>

- [@athrael-soju](https://github.com/athrael-soju) - Idea & Initial work

## 🎉 Acknowledgments <a name = "acknowledgments"></a>

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Contribute <a name = "contribute"></a>
- Fork the repo
- Make your changes
- Submit a pull request
- I'll review it and merge it

<!-- 
<p align="center">
  <a href="https://www.youtube.com/watch?v=AdtQZ7iXkQ0" target="_blank" rel="noopener">
 <img src="https://github.com/athrael-soju/whisperChat/blob/main/Landing-s.png" alt="Project logo"></a> 
</p>
<div align="center">

[![Status](https://img.shields.io/badge/status-active-success.svg)]()
[![GitHub Issues](https://img.shields.io/github/issues/athrael-soju/whisperChat)](https://github.com/athrael-soju/whisperChat/issues)
[![GitHub Pull Requests](https://img.shields.io/github/issues-pr/athrael-soju/whisperChat)](https://img.shields.io/github/issues-pr/athrael-soju/whisperChat)
[![License](https://img.shields.io/badge/license-GNU%20GPL-blue.svg)](/LICENSE)

</div>
