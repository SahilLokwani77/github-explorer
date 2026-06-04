const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const routes = require("./routes");

const app = express();
const PORT = process.env.PORT || 4000;

// Security headers
app.use(helmet());

// CORS — allow the React dev server and production frontend
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://lambent-marshmallow-c9510b.netlify.app",
  process.env.CLIENT_ORIGIN,
].filter(Boolean);
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. curl, Postman) in development
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  })
);

app.use(express.json());

// Health check
app.get("/health", (_req, res) => res.json({ status: "ok" }));

// API routes
app.use("/api", routes);

// Global error handler — always returns structured JSON
app.use((err, _req, res, _next) => {
  const status = err.statusCode || 500;
  const message = err.message || "Internal server error";
  res.status(status).json({ error: message });
});

// 404 for unmatched routes
app.use((_req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

module.exports = app; // exported for testing
