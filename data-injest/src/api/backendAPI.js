import axios from "axios";

const backendAPI = {
  async injestConversationsInMongoDB(backendInjestRoute, conversationList) {
    console.log(`Backend - Sending Conversation List for external document...`);
    try {
      const response = await axios.post(backendInjestRoute, {
        conversationList: conversationList,
      });
      console.log(`Backend: Conversation List Sent Successfully`);
      return response.data;
    } catch (error) {
      console.error(
        `Backend - Error Sending Conversation List: \n${error.message}`
      );
      return `Backend - Error Sending Conversation List: \n${error.message}`;
    }
  },
};

export default backendAPI;
