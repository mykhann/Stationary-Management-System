import express from "express";
import "dotenv/config";
import path from "path";
import cookieParser from "cookie-parser";
import cors from "cors";

import connectDB from "./src/database/db.js";
import userRoutes from "./src/routes/user.route.js";
import itemRoutes from "./src/routes/item.route.js";
import supplierRoutes from "./src/routes/supplier.route.js";
import orderRoutes from "./src/routes/order.route.js";
import analyticsRoutes from "./src/routes/analytics.routes.js";

const app = express();

// production
const _dirname = path.resolve();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// CORS (unchanged)
const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
};
app.use(cors(corsOptions));

// Routes
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/item", itemRoutes);
app.use("/api/v1/supplier", supplierRoutes);
app.use("/api/v1/order", orderRoutes);
app.use("/api/v1/analytics", analyticsRoutes);

// production frontend serve
app.use(express.static(path.join(_dirname, "/frontend/dist")));

app.get("*", (_, res) => {
  res.sendFile(path.join(_dirname, "frontend", "dist", "index.html"));
});

// Database connection
connectDB();

app.listen(process.env.PORT, () => {
  console.log(`connection established on port ${process.env.PORT}`);
});
