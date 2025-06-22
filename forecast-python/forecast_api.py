from flask import Flask, jsonify
from pymongo import MongoClient
import pandas as pd
from prophet import Prophet
from datetime import datetime, timedelta
from apscheduler.schedulers.background import BackgroundScheduler
import logging

app = Flask(__name__)

# Store forecast results globally
forecast_data = {}

def run_forecast():
    global forecast_data

    client = MongoClient("mongodb+srv://37181:PguuWu7oSsTqjUK7@chaibackend.cnq4lhz.mongodb.net")
    db = client["Stationary-Management"]

    start_date = datetime.now() - timedelta(weeks=8)

    pipeline = [
        {"$match": {"createdAt": {"$gte": start_date}}},
        {"$unwind": "$orderItems"},
        {
            "$lookup": {
                "from": "items",
                "localField": "orderItems.item",
                "foreignField": "_id",
                "as": "itemDetails"
            }
        },
        {"$unwind": "$itemDetails"},
        {
            "$project": {
                "category": "$itemDetails.category",
                "quantity": "$orderItems.quantity",
                "createdAt": 1
            }
        },
        {
            "$addFields": {
                "week": {"$isoWeek": "$createdAt"},
                "year": {"$isoWeekYear": "$createdAt"}
            }
        },
        {
            "$group": {
                "_id": {
                    "category": "$category",
                    "week": "$week",
                    "year": "$year"
                },
                "total": {"$sum": "$quantity"},
                "date": {"$min": "$createdAt"}
            }
        },
        {"$sort": {"_id.year": 1, "_id.week": 1}}
    ]

    results = list(db.orders.aggregate(pipeline))

    data = [
        {
            "category": doc["_id"]["category"],
            "ds": doc["date"],
            "y": doc["total"]
        }
        for doc in results
    ]

    df = pd.DataFrame(data)

    if df.empty or "category" not in df.columns:
        forecast_data = {"message": "No forecast data available"}
        return

    forecasts = {}

    for category in df["category"].unique():
        df_cat = df[df["category"] == category][["ds", "y"]].sort_values("ds")

        if len(df_cat) >= 2:
            model = Prophet()
            model.fit(df_cat)
            future = model.make_future_dataframe(periods=1, freq="W")  # Predict only 1 week
            forecast = model.predict(future)

            row = forecast.tail(1).iloc[0]  # Get last forecast row
            forecasts[category] = [{
                "week": row["ds"].strftime("%Y-%m-%d"),
                "forecast": round(max(0, row["yhat"]), 1),
                "lower": round(max(0, row["yhat_lower"]), 1),
                "upper": round(max(0, row["yhat_upper"]), 1)
            }]

    forecast_data = forecasts
    print("Forecast updated at", datetime.now())

@app.route("/forecast", methods=["GET"])
def get_forecast():
    return jsonify(forecast_data)

if __name__ == "__main__":
    scheduler = BackgroundScheduler()
    scheduler.add_job(run_forecast, trigger='cron', day_of_week='sun', hour=0, minute=0)
    scheduler.start()

    run_forecast()  # Run once at startup

    logging.getLogger("apscheduler").setLevel(logging.ERROR)

    app.run(debug=True, port=5001)
