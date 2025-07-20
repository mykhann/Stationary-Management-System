import Order from "../model/order.model.js";

export async function fetchWeeklyCategoryTotals(weeks = 8) {
  // Align to Monday of current ISO week (using local time)
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const dayOfWeek = now.getDay(); // Sunday = 0, Monday = 1, ..., Saturday = 6
  // Calculate days to subtract to get Monday
  const diffToMonday = (dayOfWeek + 6) % 7;
  const thisMonday = new Date(now);
  thisMonday.setDate(now.getDate() - diffToMonday);

  // Calculate start date (N weeks back) and end date (start of next week) to include current week
  const startDate = new Date(thisMonday);
  startDate.setDate(thisMonday.getDate() - weeks * 7);

  const nextMonday = new Date(thisMonday);
  nextMonday.setDate(thisMonday.getDate() + 7);
  const endDate = nextMonday; // include current (maybe incomplete) week

  const raw = await Order.aggregate([
    {
      $match: {
        createdAt: {
          $gte: startDate,
          $lt: endDate
        }
      }
    },
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
        week: { $isoWeek: { date: "$createdAt", timezone: "Asia/Karachi" } },
        year: { $isoWeekYear: { date: "$createdAt", timezone: "Asia/Karachi" } }
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

  return raw.map(doc => {
    const { category, week, year } = doc._id;
    return {
      category,
      week: `${year}-W${String(week).padStart(2, "0")}`,
      count: doc.total
    };
  });
}
