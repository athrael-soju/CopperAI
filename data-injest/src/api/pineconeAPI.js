import axios from "axios";

const pineconeAPI = {
  async injestConversationsInPinecone(pineconeInjestRoute, conversationList) {
    console.log(
      `Pinecone - Sending Conversation List for external document...`
    );
    try {      
      const response = await axios.post(pineconeInjestRoute, {
        conversationList: conversationList,
      });

      console.log(`Pinecone: Conversation List Sent Successfully`);
      return response.data;
    } catch (error) {
      console.error(
        `Pinecone: Error Sending Conversation List: \n${error.message}`
      );
      return `Pinecone - Error Sending Conversation List: \n${error.message}`;
    }
  },
};

export default pineconeAPI;
