import { useEffect, useState } from "react";
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "./firebase";
import CheckIn from "./pages/CheckIn";
import Insights from "./pages/Insights";
import Community from "./pages/Community";

function Login() {
  const [email, setEmail] = useState(""), [pw, setPw] = useState(""), [err, setErr] = useState("");
  const go = fn => () => fn(auth, email, pw).catch(e => setErr(e.message));
  return (<div style={{ maxWidth: 340, margin: "80px auto" }}>
    <h1>Refrain</h1>
    <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} style={{ width: "100%" }} />
    <input placeholder="Password" type="password" value={pw} onChange={e => setPw(e.target.value)} style={{ width: "100%", margin: "8px 0" }} />
    <button onClick={go(signInWithEmailAndPassword)}>Sign in</button>{" "}
    <button onClick={go(createUserWithEmailAndPassword)}>Create account</button>
    <p style={{ color: "#b3453f" }}>{err}</p></div>);
}

export default function App() {
  const [user, setUser] = useState(undefined), [tab, setTab] = useState("checkin");
  useEffect(() => onAuthStateChanged(auth, setUser), []);
  if (user === undefined) return null;
  if (!user) return <Login />;
  const Page = { checkin: CheckIn, insights: Insights, community: Community }[tab];
  return (<div style={{ maxWidth: 720, margin: "0 auto", padding: 16, fontFamily: "system-ui" }}>
    <header style={{ display: "flex", justifyContent: "space-between" }}><h1>Refrain</h1><button onClick={() => signOut(auth)}>Sign out</button></header>
    <nav>{["checkin", "insights", "community"].map(t => <button key={t} onClick={() => setTab(t)} disabled={t === tab}>{t}</button>)}</nav>
    <Page />
    <p style={{ fontSize: 13 }}>In crisis? Contact local emergency services. In India, Tele-MANAS is 14416.</p></div>);
}
