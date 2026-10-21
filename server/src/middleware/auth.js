import admin from "firebase-admin";
admin.initializeApp({ credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)) });
export const verify = token => admin.auth().verifyIdToken(token);
export async function requireAuth(req, res, next) {
  const t = (req.headers.authorization || "").replace(/^Bearer /, "");
  try { req.uid = (await verify(t)).uid; next(); }
  catch { res.status(401).json({ error: "unauthenticated" }); }
}
