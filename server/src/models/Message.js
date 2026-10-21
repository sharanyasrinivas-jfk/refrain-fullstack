import mongoose from "mongoose";
const s = new mongoose.Schema({
  room: { type: String, index: true }, handle: String, text: String,
  createdAt: { type: Date, default: Date.now, expires: 60 * 60 * 24 * 30 },
});
export default mongoose.model("Message", s);
