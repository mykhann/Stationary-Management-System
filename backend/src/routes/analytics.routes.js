// src/routes/analytics.routes.js

import express from "express";
import {
  computePctChangeByCategory,
  fillMissingWeeks
} from "../utils/computePctChangeByCategory.js";

import { fetchWeeklyCategoryTotals } from "../utils/fetchWeeklyCategoryTotals.js";
import axios from "axios";

const router = express.Router();

// Descriptive Analytics Route
router.get("/descriptive", async (req, res, next) => {
  try {
    const weeks = parseInt(req.query.weeks) || 8;
    const raw = await fetchWeeklyCategoryTotals(weeks);

    const filled = fillMissingWeeks(raw); // Only fill ONCE
    const descriptive = computePctChangeByCategory(filled);

    res.json(descriptive);
  } catch (err) {
    next(err);
  }
});

// Predictive Analytics Route
router.get("/predictive", async (req, res) => {
  try {
    const response = await axios.get("http://localhost:5001/forecast");
    res.json(response.data);
  } catch (err) {
    res.status(500).json({
      error: "Error fetching forecast",
      details: err.message
    });
  }
});

export default router;
