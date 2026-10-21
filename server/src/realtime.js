import { Server } from "socket.io";
import { verify } from "./middleware/auth.js";
import Message from "./models/Message.js";
import { handleFor } from "./services/crypto.js";

const ROOMS = ["General", "Late nights", "Cravings"];
export function attachRealtime(http, origin) {
  const io = new Server(http, { cors: { origin } });
  io.use(async (socket, next) => {
    try { socket.uid = (await verify(socket.handshake.auth.token)).uid; next(); }
    catch { next(new Error("unauthenticated")); }
  });
  io.on("connection", socket => {
    const handle = handleFor(socket.uid); let stamps = [];
    socket.on("join", async room => {
      if (!ROOMS.includes(room)) return;
      socket.rooms.forEach(x => x !== socket.id && socket.leave(x));
      socket.join(room);
      const recent = await Message.find({ room }).sort("-createdAt").limit(50).lean();
      socket.emit("history", recent.reverse());
    });
    socket.on("msg", async ({ room, text }) => {
      const now = Date.now(); stamps = stamps.filter(t => now - t < 10000);
      if (stamps.length >= 5 || !ROOMS.includes(room) || typeof text !== "string") return;
      text = text.trim().slice(0, 300); if (!text) return; stamps.push(now);
      const m = await Message.create({ room, handle, text });
      io.to(room).emit("msg", m.toObject());
    });
  });
}
