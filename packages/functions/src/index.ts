import { onRequest } from "firebase-functions/v2/https";

export const api = onRequest((req, res) => {
  res.json({ status: "ok", message: "Visitas Angelim API" });
});
