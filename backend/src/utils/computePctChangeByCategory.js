export function computePctChangeByCategory(data) {
  if (!Array.isArray(data)) {
    throw new Error("Expected data to be an array");
  }

  const byCat = data.reduce((acc, { week, category, count }) => {
    acc[category] = acc[category] || [];
    acc[category].push({ week, count });
    return acc;
  }, {});

  const result = {};
  for (const [cat, arr] of Object.entries(byCat)) {
    arr.sort((a, b) => a.week.localeCompare(b.week));
    result[cat] = arr.map((d, i) => {
      if (i === 0) return { ...d, pctChange: null };
      const prev = arr[i - 1].count;
      const pct = prev === 0 ? null : ((d.count - prev) / prev) * 100;
      return { ...d, pctChange: parseFloat(pct.toFixed(1)) };
    });
  }
  return result;
}
