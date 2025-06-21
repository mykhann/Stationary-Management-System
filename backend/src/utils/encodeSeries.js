import * as ss from 'simple-statistics'; 


export function encodeSeries(series) {
  return series.map((d, i) => ({ x: i + 1, y: d.count }));
}

export function forecastLinear(series) {
  const points = series.map(p => [p.x, p.y]);
  const { m, b } = ss.linearRegression(points);
  return parseFloat((m * (series.length + 1) + b).toFixed(1));
}

export function forecastExpSmooth(series, α = 0.3) {
  let S = series[0].y;
  for (let i = 1; i < series.length; i++) {
    S = α * series[i].y + (1 - α) * S;
  }
  return parseFloat(S.toFixed(1));
}
