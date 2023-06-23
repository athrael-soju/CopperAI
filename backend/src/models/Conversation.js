import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: false },
  usertype: { type: String, required: true, unique: false },
  message: { type: String, required: true, unique: false },
  response: { type: String, required: true, unique: false },
  date: { type: Date, default: Date.now, unique: false },
});

const Conversation = mongoose.model("Conversation", conversationSchema);

export default Conversation;
