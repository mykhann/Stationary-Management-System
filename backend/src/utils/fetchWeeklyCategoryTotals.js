// src/utils/fetchWeeklyCategoryTotals.js

import Order from "../model/order.model.js";

export async function fetchWeeklyCategoryTotals(weeks = 8) {
  // Align startDate to Monday of the (current week - weeks)
  const startDate = new Date();
  startDate.setUTCHours(0, 0, 0, 0);
  startDate.setUTCDate(startDate.getUTCDate() - (weeks * 7));

  const day = startDate.getUTCDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  const diffToMonday = (day === 0 ? -6 : 1) - day;
  startDate.setUTCDate(startDate.getUTCDate() + diffToMonday);

  const raw = await Order.aggregate([
    { $match: { createdAt: { $gte: startDate } } },
    { $unwind: "$orderItems" },
    {
      $lookup: {
        from: "items",
        localField: "orderItems.item",
        foreignField: "_id",
        as: "itemDetails"
      }
    },
    { $unwind: "$itemDetails" },
    {
      $project: {
        category: "$itemDetails.category",
        quantity: "$orderItems.quantity",
        createdAt: 1
      }
    },
    {
      $addFields: {
        week: { $isoWeek: "$createdAt" },
        year: { $isoWeekYear: "$createdAt" }
      }
    },
    {
      $group: {
        _id: {
          category: "$category",
          year: "$year",
          week: "$week"
        },
        total: { $sum: "$quantity" }
      }
    },
    { $sort: { "_id.year": 1, "_id.week": 1 } }
  ]);

  console.log("[fetchWeeklyCategoryTotals] Weeks included:", weeks);
  console.log("[fetchWeeklyCategoryTotals] Aligned start date (ISO week start):", startDate.toISOString());
  console.log("[fetchWeeklyCategoryTotals] Raw aggregation result sample:", raw.slice(-3));

  return raw.map(doc => {
    const { category, week, year } = doc._id;
    return {
      category,
      week: `${year}-W${String(week).padStart(2, "0")}`,
      count: doc.total
    };
  });
}
