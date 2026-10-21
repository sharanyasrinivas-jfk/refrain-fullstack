import { Router } from "express";
import CheckIn from "../models/CheckIn.js";
const r = Router();

r.get("/", async (req, res) => {
  const match = { $match: { uid: req.uid, createdAt: { $gte: new Date(Date.now() - 60 * 864e5) } } };
  const [daily, triggers, sleep] = await Promise.all([
    CheckIn.aggregate([match, { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
      risk: { $avg: "$risk" }, craving: { $avg: "$craving" } } }, { $sort: { _id: 1 } }]),
    CheckIn.aggregate([match, { $unwind: "$triggers" }, { $group: { _id: "$triggers", n: { $sum: 1 } } },
      { $sort: { n: -1 } }, { $limit: 5 }]),
    CheckIn.aggregate([match, { $group: { _id: { $lt: ["$sleep", 6] }, craving: { $avg: "$craving" }, n: { $sum: 1 } } }]),
  ]);
  const low = sleep.find(s => s._id === true), ok = sleep.find(s => s._id === false);
  const insights = [];
  if (low?.n >= 2 && ok?.n >= 2 && low.craving - ok.craving >= 1)
    insights.push(`Craving averages ${low.craving.toFixed(1)} after under 6 hours of sleep versus ${ok.craving.toFixed(1)} otherwise.`);
  if (triggers[0]) insights.push(`Most frequent trigger: ${triggers[0]._id} (${triggers[0].n} check-ins).`);
  res.json({ daily, triggers, insights });
});
export default r;
