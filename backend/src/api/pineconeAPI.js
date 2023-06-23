import axios from "axios";

const pineconeServiceUrl = `${process.env.PINECONE_ADDRESS}:${process.env.PINECONE_PORT}`;

const pineconeAPI = {
  async getConversationFromPinecone(userName, userType, message, topK) {
    console.log(`Pinecone - Sending Message to Pinecone Query API...`);
    try {
      const response = await axios.post(`${pineconeServiceUrl}/query`, {
        userName: userName,
        userType: userType,
        message: message,
        topK: topK,
      });
      return response.data;
    } catch (error) {
      console.error(
        `Pinecone - Error Retrieving Conversation: \n${error.message}`
      );
      return `Pinecone - Error Retrieving Conversation: \n${error.message}`;
    }
  },

  async storeConversationToPinecone(newConversation) {
    console.log(`Pinecone - Storing Conversation History for message...`);
    try {
      await axios.post(`${pineconeServiceUrl}/upsert`, {
        newConversation: newConversation,
      });
      console.log(`Pinecone: Conversation Stored Successfully`);
    } catch (error) {
      console.error(`Pinecone: Error Storing Conversation: \n${error.message}`);
      return `Pinecone - Error Storing Conversation: \n${error.message}`;
    }
  },
};

export default pineconeAPI;
