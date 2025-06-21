import Order from "../model/order.model.js";

export async function fetchWeeklyCategoryTotals(weeks = 8) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - weeks * 7);

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

 
  return raw.map(doc => {
    const { category, week, year } = doc._id;
    return {
      category,
      week: `${year}-W${String(week).padStart(2, "0")}`,
      count: doc.total
    };
  });
}
