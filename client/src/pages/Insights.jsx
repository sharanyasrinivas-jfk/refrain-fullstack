import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { api } from "../api";

export default function Insights() {
  const [d, setD] = useState(null);
  useEffect(() => { api("/api/insights").then(setD); }, []);
  if (!d) return <p>Loading…</p>;
  if (d.daily.length < 2) return <p>Save a few check-ins to see trends.</p>;
  return (<div>
    <h2>Risk trend</h2>
    <ResponsiveContainer width="100%" height={200}><LineChart data={d.daily}>
      <XAxis dataKey="_id" /><YAxis domain={[0, 10]} /><Tooltip /><Line dataKey="risk" stroke="#1f6f78" strokeWidth={2} /></LineChart></ResponsiveContainer>
    <h2>Top triggers</h2>
    <ResponsiveContainer width="100%" height={160}><BarChart data={d.triggers}><XAxis dataKey="_id" /><YAxis allowDecimals={false} /><Bar dataKey="n" fill="#1f6f78" /></BarChart></ResponsiveContainer>
    <h2>Insights</h2><ul>{d.insights.map((i, k) => <li key={k}>{i}</li>)}</ul></div>);
}
