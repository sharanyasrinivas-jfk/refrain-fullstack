export const TRIGGERS = ["Stress","Boredom","Loneliness","Late night","Social setting","Low mood","Conflict","Payday"];
const clamp = (x, a, b) => Math.min(b, Math.max(a, x));
const mean = a => (a.length ? a.reduce((x, y) => x + y, 0) / a.length : 0);

export function score({ mood, craving, stress, sleep, triggers }) {
  const sleepDebt = Math.max(0, 7 - sleep) / 7 * 10, trig = Math.min(triggers.length, 4) / 4 * 10;
  return clamp(.34 * craving + .22 * stress + .18 * (10 - mood) + .12 * sleepDebt + .14 * trig, 0, 10);
}
export const level = r => (r < 3.5 ? "steady" : r < 6 ? "watch" : "high");

// Compare today to the person's own recent baseline, not to a population.
export function assess(current, history14) {
  const base = history14.map(h => h.risk), mu = mean(base);
  const sd = Math.sqrt(mean(base.map(x => (x - mu) ** 2))) || 1;
  const z = base.length >= 5 ? (current - mu) / sd : 0;
  const last3 = [...history14.slice(-2).map(h => h.risk), current];
  const rising = last3.length === 3 && last3[0] < last3[1] && last3[1] < last3[2] && current >= 4;
  return { risk: current, level: level(current), z: +z.toFixed(2), baseline: +mu.toFixed(2),
    spike: z >= 1.5, earlyWarning: rising || z >= 1.5 };
}

const TIPS = {
  Stress: "Box breathing: 4 in, 4 hold, 4 out, 4 hold, five rounds.",
  Boredom: "Fill the next hour with something hands-on: a walk, a chore, a game.",
  Loneliness: "Join a community room or message one person you trust.",
  "Late night": "Set a hard wind-down time and keep your phone out of the bedroom.",
  "Social setting": "Decide your exit line before you go.",
  "Low mood": "Get daylight and eat before you decide anything.",
  Conflict: "Delay big decisions 24 hours. Write it down, then walk.",
  Payday: "Move money to a separate account the moment you're paid.",
};
export function guidance(a, input) {
  const g = [];
  if (a.level === "high") g.push("Reach out to someone now. Put distance between you and access today.");
  else if (a.level === "watch") g.push("Plan the next few hours. If an urge hits, wait ten minutes before deciding.");
  else g.push("You're steady. Keep the routines that got you here.");
  if (a.earlyWarning) g.push("Your score is climbing against your own baseline. Tighten your routine and tell your support person.");
  input.triggers.slice(0, 2).forEach(t => TIPS[t] && g.push(`${t}: ${TIPS[t]}`));
  if (input.sleep < 6) g.push("Under 6 hours of sleep amplifies cravings. Protect tonight's sleep.");
  return g;
}
