import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
const e = import.meta.env;
export const auth = getAuth(initializeApp({ apiKey: e.VITE_FB_API_KEY, authDomain: e.VITE_FB_AUTH_DOMAIN, projectId: e.VITE_FB_PROJECT_ID }));
