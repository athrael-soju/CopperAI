import axios from "axios";

const pineconeServiceUrl = `${process.env.PINECONE_ADDRESS}:${process.env.PINECONE_PORT}`;

export async function getConversation(message, topK = 5) {
  console.log("Getting conversation for message:", `'${message}'`);
  const response = await axios.post(`${pineconeServiceUrl}/query`, {
    message: message,
    topK: topK,
  });
  console.log("Conversation response:", response.data);
  if (
    response.data.matches.length === 0 ||
    response.data.matches[0]["score"] < 0.95
  ) {
    console.log("No conversation found");
    return null;
  }
  console.log("Conversation found:", response.data.matches[0]);
  return response.data.matches[0]["metadata"]["messageResponse"];
}

export async function storeConversation(message, messageResponse) {
  console.log("Storing conversation for message:", message);
  await axios.post(`${pineconeServiceUrl}/upsert`, {
    message,
    messageResponse,
  });
  console.log("Conversation stored");
}
