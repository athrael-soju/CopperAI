import express from "express";
import { v4 as uuidv4 } from "uuid";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

import pineconeAPI from "../api/pineconeAPI.js";
import backendAPI from "../api/backendAPI.js";

let conversationList;

const router = express.Router();

async function ProcessDocument(
  userName,
  userType,
  section,
  parentSectionTitle = "",
  level = 1
) {
  let newObject = {
    id: uuidv4(),
    username: userName,
    usertype: userType,
    message: `${level === 0 ? "Document" : "Section"}: ${
      section.id
    }. Title: ${section.title}`,
    response: `Description: ${section.description}`,
    date: `Date: ${new Date()}.`,
  };

  if (parentSectionTitle !== "") {
    newObject.response += ` Related to: ${parentSectionTitle}`;
  }

  // Add newObject to the conversation list
  conversationList.push(newObject);

  // Process the subsections
  if (section.subsections) {
    newObject.response += " Subsections: ";
    for (let i = 0; i < section.subsections.length; i++) {
      newObject.response += section.subsections[i].title;
      if (i < section.subsections.length - 1) {
        newObject.response += ", ";
      }
      ProcessDocument(
        userName,
        userType,
        section.subsections[i],
        section.title,
        level + 1
      );
    }
  }

  // Process the sections
  if (section.sections) {
    newObject.response += " Sections: ";
    for (let i = 0; i < section.sections.length; i++) {
      newObject.response += section.sections[i].title;
      if (i < section.sections.length - 1) {
        newObject.response += ", ";
      }
      ProcessDocument(
        userName,
        userType,
        section.sections[i],
        section.title,
        level + 1
      );
    }
  }
}

async function sendConversationsToPineconeAPI(conversationList) {
  const pineconeInjestRoute = `${process.env.PINECONE_ADDRESS}:${process.env.PINECONE_PORT}${process.env.PINECONE_INJEST_ROUTE}`;
  let pineconeResponse;
  try {
    pineconeResponse = await pineconeAPI.injestConversationsInPinecone(
      pineconeInjestRoute,
      conversationList
    );
    return pineconeResponse;
  } catch (err) {
    console.error(`Data-Injest - Error: ${err.message}`);
    return false;
  }
}

async function sendConversationsToBackEndAPI(conversationList) {
  const backendInjestRoute = `${process.env.SERVER_ADDRESS}:${process.env.SERVER_PORT}${process.env.SERVER_INJEST_ROUTE}`;
  let backendResponse;
  try {
    backendResponse = await backendAPI.injestConversationsInMongoDB(
      backendInjestRoute,
      conversationList
    );
    return backendResponse;
  } catch (err) {
    console.error(`Data-Injest - Error: ${err.message}`);
    return false;
  }
}

router.post("/", async (req, res) => {
  try {
    const userName = req.body.username;
    const userType = req.body.usertype;
    let document = JSON.parse(req.files.document.data.toString());

    conversationList = [];
    console.log("Data-Injest - Generating Conversation List from Document...");
    await ProcessDocument(userName, userType, document);

    console.log(
      "Data-Injest - Conversation List Generated Successfully",
      conversationList
    );

    let data = JSON.stringify(conversationList);

    fs.writeFile("./src/data/conversationList.json", data, (err) => {
      if (err) throw err;
      console.log("Data written to file");
    });
    console.log(process.cwd());
    res.status(200).json({
      message: `Data-Injest - Conversations Injested Successfully to: conversationList.json `,
    });
    // let apiResponse = await sendConversationsToPineconeAPI(conversationList);
    // if (!apiResponse.message.includes("Error")) {
    //   apiResponse = await sendConversationsToBackEndAPI(conversationList);
    //   if (!apiResponse.message.includes("Error")) {
    //     res.status(200).json({
    //       message:
    //         "Data-Injest - Conversations Injested Successfully to both Pinecone and MongoDB",
    //     });
    //   }
    // } else {
    //   res.status(500).json({
    //     message:
    //       "Data-Injest - Conversations Failed to Injest to both Pinecone and MongoDB",
    //   });
    // }
  } catch (err) {
    console.error(`Data-Injest - Error: ${err.message}`);
    res.status(500).json({
      message: `Data-Injest - Error: ${err.message}`,
    });
  }
});

router.get("/", async (req, res) => {
  res.status(200).json({
    message: `You've reached the /injest data-injest route, running on port: ${process.env.DATA_INJEST_PORT}`,
  });
});

export default router;
