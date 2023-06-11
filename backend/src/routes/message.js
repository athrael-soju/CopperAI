import express from "express";
import pineconeAPI from "../api/pineconeAPI.js";
import openaiAPI from "../api/openaiAPI.js";
import Conversation from "../models/Conversation.js";
import langChainAPI from "../api/langChainAPI.js";

const router = express.Router();

export async function initDirective(username, directive, role) {
  await sendMessage(username, directive, role);
}

async function getSimplifiedHistory(userName) {
  console.log("Backend - Retrieving User Message History...");
  try {
    // init conv passing user prompt prior to sumarization.
    const newConversation = new Conversation({
      username: userName,
      message: `${message}`,
      response: null,
      date: new Date(),
    });
    //  Something like this. Double check in mongoose API.
    const objectId = newConversation.objectId;
    await newConversation.save();

    // Get 10 most recent conversations, including current prompt. Possibly return record Object ID to use later to amend, adding the response.
    let conversationHistory = await Conversation.find({ username: userName })
      .sort({ date: -1 })
      .limit(10)
      .exec();
    const retrievedHistoryRecords = conversationHistory?.length;
    console.log(
      `Backend - User Message History retrieved: {${retrievedHistoryRecords}} records`
    );
    // Since we just created a record, this will be unnecessary
    // if (!retrievedHistoryRecords || retrievedHistoryRecords < 1) {
    //   conversationHistory = [];
    // }
    let messageNumber = retrievedHistoryRecords;
    // Simplify latest records retrieved.
    let simplifiedHistory = conversationHistory
      .map(
        (conversation) => `
        prompt ${messageNumber--}: '${conversation.message}'
        response: '${conversation.response}'
        date: ${conversation.date}
        `
      )
      .join("\n");
    return { simplifiedHistory: simplifiedHistory, objectId: objectId };
  } catch (err) {
    console.error(
      `Backend - Failed to Retrieve User Message History: \n${err.message}`
    );
    return { simplifiedHistory: null, objectId: objectId };
  }
}

async function sendMessage(userName, message, role = "user") {
  console.log(`Backend - Preparing to Send Message: \n${message}`);
  try {
    //  Maybe woth considering to embed a simplified history instead and only summarize before sending to OpenAI, thus improving perf by reducin the summarizations from 2, to 1.
    let { simplifiedHistory, objectId } = await getSimplifiedHistory(userName);
    let openaiResponse = null;
    let messages = [];
    let pineconeResponse = "";
    // Simplify the check for flags, or remove them
    if (process.env.PINECONE_ENABLED === "true") {
      console.log(`Backend - Pinecone enabled. Retrieving Conversation...`);
      // message is already part of the summary, so no need to pass.
      pineconeResponse = await pineconeAPI.getConversationFromPinecone(
        userName,
        simplifiedHistory,
        process.env.PINECONE_TOPK
      );

      if (pineconeResponse?.length > 0) {
        //  Do we want to send the summary as is, or reduce to data only needed to respond to current prompt?
        //  This is more of a conversation, than information retrieval, so...

        //  Pass simplifiedHistory over summarized. This could improve match %
        // Doublecheck the text.
        let summarizedPineconeResponse =
          await langChainAPI.summarizeConversation(pineconeResponse);
        console.log("summarizedPineconeResponse: " + summarizedPineconeResponse);
        //  Might want to consider a new template to only retain needed information to respond to prompt.
        messages.push({
          role: "system",
          content: summarizedPineconeResponse,
        });
      }
    }

    if (process.env.OPENAI_ENABLED === "true") {
      messages.push({
        role: role,
        content: message,
      });
      //  2 messages, both congtaining the latest user Message. Needed?
      openaiResponse = await openaiAPI.generateResponseFromOpenAI(
        messages,
        userName
      );
    } else {
      openaiResponse = `Backend - OpenAI is currently disabled. Using default response: ${Math.random()}`;
    }

    if (openaiResponse) {
      //  Append response to existing conversation, using previously retrieved ObjectID.
      let latestConversation = await Conversation.find({ _id: objectId });
      latestConversation.response = openaiResponse;
      await latestConversation.save();
      console.log("Backend - Saved conversation to MongoDB");
    }
    // We no longer need to re-summarize, as we are using the simplifiedHistory.
    // summarizedHistory = await getSummarizedUserHistory(userName);

    if (process.env.PINECONE_ENABLED === "true") {
      await pineconeAPI.storeConversationToPinecone(
        userName,
        // message, - Should no longer be needed.
        simplifiedHistory  //TODO: Must make sure the top record now contains the respone.
      );
    }

    return openaiResponse;
  } catch (err) {
    console.log(`Backend - Error with Request: ${err}`);
  }
}

router.get("/", (req, res) => {
  res.status(200).json({
    message: `You've reached the /message server route, running on port ${process.env.SERVER_PORT}`,
  });
});

router.post("/", async (req, res) => {
  let role = "user",
    userName = req.body.username,
    message = req.body.message;
  const response = await sendMessage(userName, message, role);
  res.json({ message: response });
});

export default router;
