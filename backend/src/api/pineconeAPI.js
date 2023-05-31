import axios from "axios";

const pineconeServiceUrl = `${process.env.PINECONE_ADDRESS}:${process.env.PINECONE_PORT}`;

const pineconeAPI = {
  async getConversationFromPinecone(userName, message, topK) {
    console.log("Pinecone: getting conversation for message:", `'${message}'`);
    try {
      const response = await axios.post(`${pineconeServiceUrl}/query`, {
        userName: userName,
        message: message,
        topK: topK,
      });
      // TODO: This log should really be coming from the Pinecone service, not here
      console.log(
        `Pinecone: Top ${topK} conversation matches:`,
        response.data.matches
          .map(
            (match) => `
      metadata: ${JSON.stringify(match.metadata)}
      score: ${match.score}`
          )
          .join("\n")
      );
      if (
        response.data.matches.length === 0 ||
        response.data.matches[0]["score"] < process.env.PINECONE_THRESHOLD
      ) {
        console.log("Pinecone: no conversation found");
        return null;
      }
      console.log("Pinecone: conversation found: ", response.data.matches[0]);
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
