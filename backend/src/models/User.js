import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  userdomain: { type: String, required: true, unique: false },
  email: { type: String, required: true, unique: true },
  birthdate: { type: Date, required: true },
  password: { type: String, required: true },
  firstLogin: { type: Boolean, default: true },
});

const User = mongoose.model("User", userSchema);

export default User;
