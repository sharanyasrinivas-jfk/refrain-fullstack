import { Router } from "express";
import { z } from "zod";
import CheckIn from "../models/CheckIn.js";
import { score, assess, guidance, TRIGGERS } from "../services/risk.js";
import { encrypt, decrypt } from "../services/crypto.js";

const r = Router();
const body = z.object({
  mood: z.number().int().min(1).max(10), craving: z.number().int().min(0).max(10),
  stress: z.number().int().min(0).max(10), sleep: z.number().min(0).max(14),
  triggers: z.array(z.enum(TRIGGERS)).max(8), note: z.string().max(400).optional(),
});

r.post("/", async (req, res) => {
  const p = body.safeParse(req.body);
  if (!p.success) return res.status(400).json({ error: p.error.flatten() });
  const since = new Date(Date.now() - 14 * 864e5);
  const hist = await CheckIn.find({ uid: req.uid, createdAt: { $gte: since } }).sort("createdAt").lean();
  const risk = score(p.data), a = assess(risk, hist);
  await CheckIn.create({ ...p.data, uid: req.uid, risk, noteEnc: encrypt(p.data.note) });
  res.status(201).json({ ...a, guidance: guidance(a, p.data) });
});

r.get("/", async (req, res) => {
  const rows = await CheckIn.find({ uid: req.uid }).sort("-createdAt").limit(60).lean();
  res.json(rows.map(({ noteEnc, uid, ...x }) => ({ ...x, note: decrypt(noteEnc) })));
});

r.delete("/", async (req, res) => { // user-controlled erase
  const { deletedCount } = await CheckIn.deleteMany({ uid: req.uid });
  res.json({ deletedCount });
});
export default r;
