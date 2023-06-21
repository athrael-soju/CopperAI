import express from "express";
import Conversation from "../models/Conversation.js";
import { v4 as uuidv4 } from "uuid";

const router = express.Router();

async function generateConversation() {
  console.log("Data-Injest - Creating Conversation Objects...");
  try {

  } catch (err) {}
  return conversationHistory;
}

const injestRoute = async () => {
  router.post("/", async (req, res) => {});
  chunkedDataList = [];

  let role = "user",
    userName = req.body.username,
    message = req.body.message;

  let sampleDocList = {
    title: "Technical Specification Document for XYZ Observability Platform",
    user_access_list: ["user1", "user2", "user3"],
    sections: [
      {
        id: 1,
        title: "Introduction",
        type: "section",
        description:
          "This document provides the technical specifications for the XYZ Observability Platform, a SaaS solution that will offer deep insights into the performance and health of complex, distributed software systems.",
      },
      {
        id: 2,
        title: "System Overview",
        type: "section",
        description:
          "The XYZ Observability Platform is a comprehensive, cloud-based solution that provides real-time analytics, dynamic instrumentation, and advanced visualization of software systems. The platform will integrate seamlessly with a wide range of application frameworks, infrastructure components, and third-party services.",
      },
      {
        id: 3,
        title: "Functional Requirements",
        description: "The platform must provide the following functionality:",
        subsections: [
          {
            id: "3.1",
            title: "Data Ingestion",
            type: "subsection",
            description:
              "The platform must ingest telemetry data (logs, metrics, traces) from a variety of sources in real time. It should support both push and pull mechanisms for data ingestion.",
          },
          {
            id: "3.2",
            title: "Data Processing & Analysis",
            type: "subsection",
            description:
              "The platform should provide advanced data processing and querying capabilities. It should support high-cardinality attributes and allow ad-hoc, flexible queries.",
          },
          {
            id: "3.3",
            title: "Data Visualization",
            type: "subsection",
            description:
              "Users should be able to create customizable dashboards featuring charts, graphs, and other data visualizations.",
          },
          {
            id: "3.4",
            title: "Alerting & Notification",
            type: "subsection",
            description:
              "The platform should support configurable alerts based on specific conditions or anomalies in the data. It should integrate with common notification channels (email, Slack, etc.).",
          },
        ],
      },
    ],
  };

  // // Save each chnk to MongoDB
  const id = uuidv4();
  // console.log(`Backend - Id: ${id}`);
    let conversationList = [];

  // await newConversation.save();
  // console.log("Backend - Saved conversation to MongoDB");
  // // Store the conversation to Pinecone
  // await pineconeAPI.storeConversationToPinecone(newConversation);

  sampleDocList.sections.forEach((section) => {
    // Each section will be stored in mongodb and pinecone
    if (section.type === "section") {
      console.log(`Section: ${section.title}`);
      // Each subsection will be stored in mongodb and pinecone
      if (subsections) {
        subsections.forEach((subsection) => {
          console.log(`Subsection: ${subsection.title}`);
          let newSubsectionConversation = generateConversation(subsection.id, subsection.title, subsection.description, subsection.type);
          conversationList.push(newSubsectionConversation);
        });
      }
      let newSectioonConversation = generateConversation(section.id, section.title, section.description, section.type, subsectionSummary);
      conversationList.push(newSubsectionConversation);
    }
  });

  // upsertRequest: {
  //   vectors: [
  //     {
  //       id: newConversation.id,
  //       values: newConversationEmbedding,
  //       metadata: {
  //         id: newConversation.id,
  //         userName: newConversation.username,
  //       },
  //     },
  //   ],
  //   namespace: `default`,
  // },

  return router;
};

router.get("/", (req, res) => {
  res.status(200).json({
    message: `You've reached the /injest data-injest route, running on port: ${process.env.DATA_INJEST_PORT}`,
  });
});

export default injestRoute;
