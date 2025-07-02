// src/utils/computePctChangeByCategory.js

export function fillMissingWeeks(data) {
  const allWeeks = [...new Set(data.map(d => d.week))].sort();
  const allCategories = [...new Set(data.map(d => d.category))];

  const filled = [];

  for (const category of allCategories) {
    const weekMap = Object.fromEntries(
      data
        .filter(d => d.category === category)
        .map(d => [d.week, d.count])
    );

    for (const week of allWeeks) {
      filled.push({
        category,
        week,
        count: weekMap[week] ?? 0
      });
    }
  }

  return filled;
}

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
    if (!Array.isArray(arr) || arr.length === 0) {
      console.log(`[computePctChange] Skipping empty category: ${cat}`);
      continue;
    }

    arr.sort((a, b) => a.week.localeCompare(b.week));

    result[cat] = arr.map((d, i) => {
      if (i === 0) return { ...d, pctChange: null };

      const prev = arr[i - 1].count;
      let pct;

      if (prev === 0) {
        pct = d.count === 0 ? 0 : 100;
      } else {
        pct = ((d.count - prev) / prev) * 100;
      }

      return {
        ...d,
        pctChange: parseFloat(pct.toFixed(1))
      };
    });

    console.log(`[computePctChange] Category: ${cat}`);
    console.table(result[cat]);
  }

  return result;
}
