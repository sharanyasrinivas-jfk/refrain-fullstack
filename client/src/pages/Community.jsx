import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { auth } from "../firebase";
import { API_URL } from "../api";

export default function Community() {
  const [room, setRoom] = useState("General"), [msgs, setMsgs] = useState([]), [text, setText] = useState("");
  const sock = useRef(null);
  useEffect(() => {
    let s;
    auth.currentUser.getIdToken().then(token => {
      s = sock.current = io(API_URL, { auth: { token } });
      s.on("history", setMsgs);
      s.on("msg", m => setMsgs(x => [...x, m]));
      s.emit("join", room);
    });
    return () => s?.disconnect();
  }, [room]);
  const send = () => { if (text.trim()) { sock.current.emit("msg", { room, text }); setText(""); } };
  return (<div>
    <select value={room} onChange={e => setRoom(e.target.value)}>{["General", "Late nights", "Cravings"].map(r => <option key={r}>{r}</option>)}</select>
    <div style={{ height: 300, overflowY: "auto", border: "1px solid #ccc", margin: "8px 0", padding: 8 }}>
      {msgs.map(m => <p key={m._id}><b>{m.handle}</b> {m.text}</p>)}</div>
    <input value={text} onChange={e => setText(e.target.value)} onKeyDown={e => e.key === "Enter" && send()} maxLength={300} style={{ width: "75%" }} />
    <button onClick={send}>Send</button></div>);
}
