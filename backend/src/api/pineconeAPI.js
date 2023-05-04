import axios from "axios";

const pineconeServiceUrl = `${process.env.PINECONE_ADDRESS}:${process.env.PINECONE_PORT}`;

export async function getConversation(message, topK = 5) {
  console.log("Pinecone: getting conversation for message:", `'${message}'`);
  const response = await axios.post(`${pineconeServiceUrl}/query`, {
    message: message,
    topK: topK,
  });
  console.log("Pinecone: conversation query response:", response.data);
  if (
    response.data.matches.length === 0 ||
    response.data.matches[0]["score"] < 0.95
  ) {
    console.log("Pinecone: no conversation found");
    return null;
  }
  console.log("Pinecone: conversation found");
  return response.data.matches[0]["metadata"]["messageResponse"];
}

export async function storeConversation(message, messageResponse) {
  console.log("Pinecone: storing conversation for message");
  await axios.post(`${pineconeServiceUrl}/upsert`, {
    message,
    messageResponse,
  });
  console.log("Pinecone: conversation stored");
}
