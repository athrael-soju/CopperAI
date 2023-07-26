const WhisperApi = () => {
  async function transcribeAudio(recordingBlob: Blob) {
    console.log(
      'Frontend - Sending audio to OpenAI Whisper API for transcription...'
    );

    const formData = new FormData();
    formData.append('file', recordingBlob, 'audio.webm');
    await fetch(
      `${process.env.SERVER_ADDRESS}:${process.env.SERVER_PORT}${process.env.SERVER_WHISPER_ENDPOINT}`,
      {
        method: 'POST',
        body: formData,
      }
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(
          'Frontend - Received transcription from OpenAI Whisper API:'
        );
        console.log(data);
        return data;
      })
      .catch((error) => {
        console.error('Error:', error);
        return error;
      });
  }
};

export default WhisperApi;
/*
const transcribeAudio = async (recordingBlob: Blob) => {
  let data = new FormData();
  //const url = URL.createObjectURL(recordingBlob);
  //const audioFile = new Audio(url);
  data.append('file', fs.createReadStream(recordingBlob));
  data.append('model', 'whisper-1');
  data.append('language', 'en');

  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: 'https://api.openai.com/v1/audio/transcriptions',
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'multipart/form-data',
      ...data.getHeaders(),
    },
    data: data,
  };

  try {
    const response = await axios.request(config);
    const data = response.data;

    return { data };
  } catch (error) {
    return {};
  }
};
*/
