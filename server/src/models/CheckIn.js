import mongoose from "mongoose";
const s = new mongoose.Schema({
  uid: { type: String, index: true, required: true },
  mood: Number, craving: Number, stress: Number, sleep: Number,
  triggers: [String], noteEnc: String, risk: Number,
  createdAt: { type: Date, default: Date.now },
});
s.index({ uid: 1, createdAt: -1 });
export default mongoose.model("CheckIn", s);
