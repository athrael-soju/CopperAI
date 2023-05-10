import axios from "axios";

const redisURL = `${process.env.REDIS_URI}`;
const redisAPI = {
  async getConversationFromRedis(message) {
    console.log("Redis: getting conversation for message:", `'${message}'`);
    const response = await axios.post(`${redisURL}/get`, {
      message: message,
    });
    console.log("Redis: conversation query response:", response.data);
    return response.data.matches[0]["metadata"]["messageResponse"];
  },

  async storeConversationToRedis(message, messageResponse) {
    console.log("Redis: storing conversation for message");
    await axios.post(`${redisURL}/put`, {
      message,
      messageResponse,
    });
    console.log("Pinecone: conversation stored");
  },
};

export default redisAPI;
