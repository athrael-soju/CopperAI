import axios from "axios";

const pineconeServiceUrl = `${process.env.PINECONE_ADDRESS}:${process.env.PINECONE_PORT}`;

const pineconeAPI = {
  async getConversationFromPinecone(message, topK) {
    console.log("Pinecone: getting conversation for message:", `'${message}'`);
    try {
      const response = await axios.post(`${pineconeServiceUrl}/query`, {
        message: message,
        topK: topK,
      });
      console.log("Pinecone: conversation query response:", response.data);
      if (
        response.data.matches.length === 0 ||
        response.data.matches[0]["score"] < process.env.PINECONE_THRESHOLD
      ) {
        console.log("Pinecone: no conversation found");
        return null;
      }
      console.log("Pinecone: conversation found");
      return response.data.matches[0]["metadata"]["messageResponse"];
    } catch (error) {
      console.log("Pinecone: error getting conversation:", error);
      return "Pinecone: error getting conversation";
    }
  },

  async storeConversationToPinecone(message, summarizedHistory) {
    console.log("Pinecone: storing conversation history for message");
    try {
      await axios.post(`${pineconeServiceUrl}/upsert`, {
        message,
        summarizedHistory,
      });
      console.log("Pinecone: conversation stored");
    } catch (error) {
      console.log("Pinecone: error storing conversation:", error);
      return "Pinecone: error storing conversation";
    }
  },
};

export default pineconeAPI;
