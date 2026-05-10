import { Hono } from "hono";

const app = new Hono();

app.get("/", (c) => c.text("GymPal LINE Bot"));

export default app;
