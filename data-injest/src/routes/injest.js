import express from "express";
import { v4 as uuidv4 } from "uuid";
import dotenv from "dotenv";
dotenv.config();

import pineconeAPI from "../api/pineconeAPI.js";
import backendAPI from "../api/backendAPI.js";

let conversationList;

const router = express.Router();
function iterateSections(userName, userType, section, parentResponse) {
  let newObject = {
    id: uuidv4(),
    username: userName,
    usertype: userType,
    message: `${userName} Data Entry: Section: ${section.id}. Title: ${section.title}`,
    response: `Description: ${section.description}`,
    date: `Date: ${new Date()}`,
  };

  if (section.subsections) {
    newObject.response += "\n";
    for (let subsection of section.subsections) {
      newObject.response += iterateSections(
        userName,
        userType,
        subsection,
        newObject.response
      );
    }
  }

  if (parentResponse) {
    parentResponse = ` Section: ${section.id}. Title: ${section.title}. ${newObject.date}\n`;
  }

  conversationList.push(newObject);
  return parentResponse;
}

async function sendConversationsToAllAPIs(conversationList) {
  const pineconeInjestRoute = `${process.env.PINECONE_ADDRESS}:${process.env.PINECONE_PORT}${process.env.PINECONE_INJEST_ROUTE}`;
  const backendInjestRoute = `${process.env.SERVER_ADDRESS}:${process.env.SERVER_PORT}${process.env.SERVER_INJEST_ROUTE}`;
  let pineconeResponse, backendResponse;

  backendResponse = await backendAPI.injestConversationsInMongoDB(
    backendInjestRoute,
    conversationList
  );
  console.log("Data-Injest - Conversation Injested Successfully to MongoDB");
  //await new Promise(resolve => setTimeout(resolve, 5000));
  pineconeResponse = await pineconeAPI.injestConversationsInPinecone(
    pineconeInjestRoute,
    conversationList
  );
  console.log("Data-Injest - Conversation Injested Successfully to Pinecone");
  return true;
}

router.post("/", async (req, res) => {
  try {
    const userName = req.body.username;
    const userType = req.body.usertype;
    let document = JSON.parse(req.files.document.data.toString());

    conversationList = [];
    console.log("Data-Injest - Generating Conversation List from Document...");
    await Promise.all(
      document.sections.map((section) =>
        iterateSections(userName, userType, section)
      )
    );

    console.log(
      "Data-Injest - Conversation List Generated Successfully",
      conversationList
    );
    let finalResponse = await sendConversationsToAllAPIs(conversationList);
    if (finalResponse) {
      res.status(200).json({
        message:
          "Data-Injest - Conversations Injested Successfully to both Pinecone and MongoDB",
      });
    } else {
      res.status(500).json({
        message:
          "Data-Injest - Conversations Failed to Injest to both Pinecone and MongoDB",
      });
    }
  } catch (err) {
    console.error(`Data-Injest - Error:\n${err.message}`);
    res.status(500).json({
      message: `Data-Injest - Error:\n${err.message}`,
    });
  }
});

router.get("/", async (req, res) => {
  res.status(200).json({
    message: `You've reached the /injest data-injest route, running on port: ${process.env.DATA_INJEST_PORT}`,
  });
});

export default router;
