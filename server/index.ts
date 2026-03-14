import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/auth";
import reminderRoutes from "./routes/reminders";
import familyRoutes from "./routes/family";
import notificationRoutes from "./routes/notifications";
import locationRoutes from "./routes/locations";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = parseInt(process.env.PORT || "5000", 10);
const isDev = process.env.NODE_ENV !== "production";

app.use(cors());
app.use(express.json());

app.use("/api", authRoutes);
app.use("/api/reminders", reminderRoutes);
app.use("/api/family", familyRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/locations", locationRoutes);

if (isDev) {
  const { createProxyMiddleware } = await import("http-proxy-middleware");
  app.use(
    createProxyMiddleware({
      target: "http://localhost:5173",
      changeOrigin: true,
      ws: true,
    })
  );
} else {
  const distPath = path.resolve(__dirname, "../dist/public");
  app.use(express.static(distPath));
  app.get(/(.*)/, (_req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
}

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT} (${isDev ? "development" : "production"})`);
});

export default app;
