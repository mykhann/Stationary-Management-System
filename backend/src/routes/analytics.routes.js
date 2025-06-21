import express from "express";
import { computePctChangeByCategory } from "../utils/computePctChangeByCategory.js";
import { encodeSeries } from "../utils/encodeSeries.js";
import { forecastExpSmooth } from "../utils/encodeSeries.js";
import { forecastLinear } from "../utils/encodeSeries.js";
import { fetchWeeklyCategoryTotals } from "../utils/fetchWeeklyCategoryTotals.js";

const router = express.Router();

//  Descriptive Analytics Route
router.get("/descriptive", async (req, res, next) => {
  try {
    const weeks = parseInt(req.query.weeks) || 8;
    const raw = await fetchWeeklyCategoryTotals(weeks);
      console.log("RAW:", raw)
    const descriptive = computePctChangeByCategory(raw);
    res.json(descriptive);
  } catch (err) {
    next(err);
  }
});

// Predictive Analytics Route
router.get("/predictive", async (req, res, next) => {
  try {
    const weeks = parseInt(req.query.weeks) || 8;
    const raw = await fetchWeeklyCategoryTotals(weeks);
    const descriptive = computePctChangeByCategory(raw);

    const forecasts = {};
    for (const [cat, series] of Object.entries(descriptive)) {
      const encoded = encodeSeries(series);
      forecasts[cat] = {
        linear: forecastLinear(encoded),
        expSmooth: forecastExpSmooth(encoded)
      };
    }

    res.json(forecasts);
  } catch (err) {
    next(err);
  }
});

export default router;
