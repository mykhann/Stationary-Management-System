from flask import Flask, jsonify
from pymongo import MongoClient
import pandas as pd
from prophet import Prophet
from datetime import datetime, timedelta
from apscheduler.schedulers.background import BackgroundScheduler
import logging
import numpy as np

app = Flask(__name__)

data_store = {}

# MongoDB configuration
MONGO_URI = "mongodb+srv://37181:PguuWu7oSsTqjUK7@chaibackend.cnq4lhz.mongodb.net"
DB_NAME = "Stationary-Management"

# Forecast parameters
HISTORY_WEEKS = 8
FUTURE_WEEKS = 1
INTERVAL_WIDTH = 0.95
# Fallback bounds factor
FALLBACK_FACTOR = 0.2  # 20%

# Scheduler setup
scheduler = BackgroundScheduler()
logging.getLogger("apscheduler").setLevel(logging.ERROR)

@app.route("/forecast", methods=["GET"])
def get_forecast():
    return jsonify(data_store)

def run_forecast():
    global data_store
    client = MongoClient(MONGO_URI)
    db = client[DB_NAME]

    start_date = datetime.now() - timedelta(weeks=HISTORY_WEEKS)
    pipeline = [
        {"$match": {"createdAt": {"$gte": start_date}}},
        {"$unwind": "$orderItems"},
        {"$lookup": {
            "from": "items",
            "localField": "orderItems.item",
            "foreignField": "_id",
            "as": "itemDetails"
        }},
        {"$unwind": "$itemDetails"},
        {"$project": {"category": "$itemDetails.category", "quantity": "$orderItems.quantity", "createdAt": 1}},
        {"$addFields": {"week": {"$isoWeek": "$createdAt"}, "year": {"$isoWeekYear": "$createdAt"}}},
        {"$group": {
            "_id": {"category": "$category", "week": "$week", "year": "$year"},
            "total": {"$sum": "$quantity"},
            "ds": {"$min": "$createdAt"}
        }},
        {"$sort": {"_id.year": 1, "_id.week": 1}}
    ]
    results = list(db.orders.aggregate(pipeline))

    records = [{"category": r["_id"]["category"], "ds": r["ds"], "y": r["total"]} for r in results]
    df = pd.DataFrame(records)
    if df.empty:
        data_store = {"message": "No forecast data available"}
        return

    forecasts = {}
    for cat, grp in df.groupby("category"):
        df_cat = grp.sort_values("ds")[['ds','y']]
        if len(df_cat) < 2:
            continue

        model = Prophet(interval_width=INTERVAL_WIDTH,
                        weekly_seasonality=False,
                        yearly_seasonality=False,
                        daily_seasonality=False)
        model.fit(df_cat)

        future = model.make_future_dataframe(periods=FUTURE_WEEKS, freq='W')
        forecast_df = model.predict(future)
        row = forecast_df.iloc[-1]
        yhat = float(row['yhat'])
        lower = float(row['yhat_lower'])
        upper = float(row['yhat_upper'])

        # Fallback if lower == upper or invalid
        if np.isclose(lower, upper):
            lower = yhat * (1 - FALLBACK_FACTOR)
            upper = yhat * (1 + FALLBACK_FACTOR)

        forecasts[cat] = [{
            'week': future['ds'].iloc[-1].strftime('%Y-%m-%d'),
            'forecast': round(yhat, 1),
            'lower': round(max(0, lower), 1),
            'upper': round(max(0, upper), 1)
        }]

    data_store = forecasts
    print(f"[Forecast] updated at {datetime.now().isoformat()}")

if __name__ == '__main__':
    scheduler.add_job(run_forecast, 'cron', day_of_week='sun', hour=0, minute=0)
    scheduler.start()
    run_forecast()
    app.run(port=5001, debug=True)
