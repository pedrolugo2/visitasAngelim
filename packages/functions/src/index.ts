import { initializeApp } from "firebase-admin/app";
import { onRequest } from "firebase-functions/v2/https";

initializeApp();

// Health check endpoint
export const api = onRequest((req, res) => {
  res.json({ status: "ok", message: "Visitas Angelim API" });
});

// Visit booking function
export { bookVisit } from "./bookVisit";

// Scheduled functions
export { sendVisitReminders } from "./scheduledFunctions/sendVisitReminders";

// Firestore triggers
export { onVisitUpdate } from "./triggers/onVisitUpdate";
