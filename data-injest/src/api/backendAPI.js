import axios from "axios";

const backendAPI = {
  async injestConversationsInMongoDB(backendInjestRoute, conversationList) {
    console.log(`Backend - Sending Conversation List to Backend API...`);
    try {
      const response = await axios.post(backendInjestRoute, {
        conversationList: conversationList,
      });
      console.log(
        `Backend: Conversation List Sent Successfully: ${response.data}`
      );
      return response.data;
    } catch (error) {
      console.error(
        `Backend - Error Sending Conversation List: ${error.message}`
      );
      return `Backend - Error Sending Conversation List: ${error.message}`;
    }
  },
};

export default backendAPI;
