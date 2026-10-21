import crypto from "crypto";
const key = () => Buffer.from(process.env.NOTE_KEY, "hex");
export function encrypt(text) {
  if (!text) return "";
  const iv = crypto.randomBytes(12), c = crypto.createCipheriv("aes-256-gcm", key(), iv);
  const enc = Buffer.concat([c.update(text, "utf8"), c.final()]);
  return [iv, c.getAuthTag(), enc].map(b => b.toString("base64")).join(".");
}
export function decrypt(blob) {
  if (!blob) return "";
  const [iv, tag, enc] = blob.split(".").map(s => Buffer.from(s, "base64"));
  const d = crypto.createDecipheriv("aes-256-gcm", key(), iv);
  d.setAuthTag(tag);
  return Buffer.concat([d.update(enc), d.final()]).toString("utf8");
}
export const handleFor = uid =>
  "Quiet" + (parseInt(crypto.createHash("sha256").update(uid).digest("hex").slice(0, 6), 16) % 900 + 100);
