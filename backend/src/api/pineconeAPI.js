import axios from "axios";

const pineconeServiceUrl = `${process.env.PINECONE_ADDRESS}:${process.env.PINECONE_PORT}`;

const pineconeAPI = {
  async getConversationFromPinecone(
    userName,
    message,
    summarizedHistory,
    topK
  ) {
    console.log(`Pinecone - Sending Message to Pinecone Query API...`);
    try {
      const response = await axios.post(`${pineconeServiceUrl}/query`, {
        userName: userName,
        message: message,
        summarizedHistory,
        topK: topK,
      });
      if (!response.data.matches) {
        console.log(`Pinecone - No Conversation Retrieved.`);
        return null;
      } else {
        console.log(`Pinecone - Top ${topK} Conversations Retrieved`);
        return response.data.matches[0].metadata.summarizedHistory;
      }
    } catch (error) {
      console.error(
        `Pinecone - Error Retrieving Conversation: \n${error.message}`
      );
      return `Pinecone - Error Retrieving Conversation: \n${error.message}`;
    }
  },

  async storeConversationToPinecone(userName, summarizedHistory) {
    console.log(`Pinecone - Storing Conversation History for message...`);
    try {
      await axios.post(`${pineconeServiceUrl}/upsert`, {
        userName: userName,
        summarizedHistory: summarizedHistory,
      });
      console.log(`Pinecone: Conversation Stored`);
    } catch (error) {
      console.error(`Pinecone: Error Storing Conversation: \n${error.message}`);
      return `Pinecone - Error Storing Conversation: \n${error.message}`;
    }
  },
};

export default pineconeAPI;
