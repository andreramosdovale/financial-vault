import { Hono } from "hono";

const app = new Hono().basePath("/api");

app.post("/payments", (c) => {
  return c.json({ message: "Payment processed" });
});

app.get("/health", (c) => {
  return c.json({ status: "ok" });
});

export default app;
