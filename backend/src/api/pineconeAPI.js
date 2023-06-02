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
      if (
        response.data.matches.length === 0
        // If there exists a history it should always be returned.
        //|| response.data.matches[0]["score"] < process.env.PINECONE_THRESHOLD
      ) {
        console.log(`Pinecone - No Conversation Retrieved.`);
        return null;
      } else {
        console.log(
          `Pinecone - Top ${topK} Conversations Retrieved. Retrieving Topmost one: ${response.data.matches
            .map(
              (match) => `
              userName: ${match.metadata.userName}
              summarizedHistory: ${match.metadata.summarizedHistory}
              score: ${match.score}`
            )
            .join("\n")}`
        );
        return response.data.matches[0].metadata.summarizedHistory;
      }
    } catch (error) {
      console.error(
        `Pinecone - Error Retrieving Conversation: \n${error.message}`
      );
      return `Pinecone - Error Retrieving Conversation: \n${error.message}`;
    }
  },

  async storeConversationToPinecone(userName, message, summarizedHistory) {
    console.log(`Pinecone - Storing Conversation History for message...`);
    try {
      await axios.post(`${pineconeServiceUrl}/upsert`, {
        userName: userName,
        message: message,
        summarizedHistory: summarizedHistory,
      });
      console.log(`Pinecone: Conversation Stored`);
    } catch (error) {
      console.error(
        `Pinecone: Error Storing Conversation: \n${error.message}`
      );
      return `Pinecone - Error Storing Conversation: \n${error.message}`;
    }
  },
};

export default pineconeAPI;
