import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: false },
  message: { type: String, required: true, unique: false },
  response: { type: String, required: false, unique: false },
  date: { type: Date, default: Date.now },
});

const Conversation = mongoose.model("Conversation", conversationSchema);

export default Conversation;
