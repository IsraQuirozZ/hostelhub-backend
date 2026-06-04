const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const app = express();

// Middlewares globales
app.use(helmet());
app.use(cors());
app.use(express.json());

// Rutas
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/users", require("./routes/user.routes"));
app.use("/api/posts", require("./routes/post.routes"));
app.use("/api/hostels", require("./routes/hostal.routes"));
app.use("/api/reservations", require("./routes/reserva.routes"));

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "HostelHub API running" });
});

// Error handler global
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    status: err.status || "error",
    message: err.message || "Internal server error",
  });
});

module.exports = app;
