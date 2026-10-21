import { auth } from "./firebase";
const API = import.meta.env.VITE_API;
export async function api(path, opts = {}) {
  const token = await auth.currentUser.getIdToken();
  const r = await fetch(API + path, { ...opts, headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: opts.body && JSON.stringify(opts.body) });
  if (!r.ok) throw new Error((await r.json()).error || r.statusText);
  return r.json();
}
export const API_URL = API;
