import { useState } from "react";
import { api } from "../api";
const TRIG = ["Stress","Boredom","Loneliness","Late night","Social setting","Low mood","Conflict","Payday"];
const SL = [["mood","Mood",1,10],["craving","Craving",0,10],["stress","Stress",0,10],["sleep","Sleep (h)",0,12]];

export default function CheckIn() {
  const [f, setF] = useState({ mood: 6, craving: 3, stress: 4, sleep: 7, triggers: [], note: "" });
  const [res, setRes] = useState(null), [err, setErr] = useState("");
  const tog = t => setF(x => ({ ...x, triggers: x.triggers.includes(t) ? x.triggers.filter(y => y !== t) : [...x.triggers, t] }));
  const submit = () => api("/api/checkins", { method: "POST", body: f }).then(setRes).catch(e => setErr(e.message));
  return (<div>
    {SL.map(([k, l, a, b]) => (<label key={k} style={{ display: "block" }}>{l}: {f[k]}
      <input type="range" min={a} max={b} step={k === "sleep" ? .5 : 1} value={f[k]} onChange={e => setF({ ...f, [k]: +e.target.value })} style={{ width: "100%" }} /></label>))}
    <div>{TRIG.map(t => <button key={t} aria-pressed={f.triggers.includes(t)} onClick={() => tog(t)}
      style={{ margin: 3, fontWeight: f.triggers.includes(t) ? 700 : 400 }}>{t}</button>)}</div>
    <textarea placeholder="Private note (stored encrypted)" maxLength={400} value={f.note} onChange={e => setF({ ...f, note: e.target.value })} style={{ width: "100%" }} />
    <button onClick={submit}>Save check-in</button> <span style={{ color: "#b3453f" }}>{err}</span>
    {res && (<div><h2>{res.risk.toFixed(1)} · {res.level}</h2>
      {res.earlyWarning && <p><b>Early warning:</b> you're trending above your own baseline ({res.baseline}).</p>}
      <ul>{res.guidance.map((g, i) => <li key={i}>{g}</li>)}</ul></div>)}
  </div>);
}
