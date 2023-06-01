import axios from "axios";

const pineconeServiceUrl = `${process.env.PINECONE_ADDRESS}:${process.env.PINECONE_PORT}`;

const pineconeAPI = {
  async getConversationFromPinecone(userName, message, topK) {
    console.log(
      `Pinecone - Sending Message to Pinecone Query API: \n${message}\n`
    );
    try {
      const response = await axios.post(`${pineconeServiceUrl}/query`, {
        userName: userName,
        message: message,
        topK: topK,
      });
      if (
        response.data.matches.length === 0
        // If there exists a history it should always be returned.
        //|| response.data.matches[0]["score"] < process.env.PINECONE_THRESHOLD
      ) {
        console.log("Pinecone: no conversation found");
        return null;
      }
      console.log(
        "Pinecone: conversation found: ",
        response.data.matches[0].metadata
      );
      return response.data.matches[0]["metadata"]["message"];
    } catch (error) {
      console.log("Pinecone: error getting conversation:", error);
      return "Pinecone: error getting conversation";
    }
  },

  async storeConversationToPinecone(userName, message, summarizedHistory) {
    console.log("Pinecone: storing conversation history for message");
    try {
      await axios.post(`${pineconeServiceUrl}/upsert`, {
        userName: userName,
        message: message,
        summarizedHistory: summarizedHistory,
      });
      console.log("Pinecone: conversation stored");
    } catch (error) {
      console.log("Pinecone: error storing conversation:", error.message);
      return "Pinecone: error storing conversation";
    }
  },
};

export default pineconeAPI;
