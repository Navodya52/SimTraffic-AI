from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd

app = Flask(__name__)
CORS(app)

model = joblib.load("traffic_model.pkl")


@app.route("/")
def home():
    return "SimTraffic AI API is Running!"


@app.route("/predict", methods=["POST"])
def predict():
    data = request.json

    waiting_cars = float(data["waiting_cars"])
    average_speed = float(data["average_speed"])
    congestion = float(data["congestion"])

    input_data = pd.DataFrame(
        [[waiting_cars, average_speed, congestion]],
        columns=["waiting_cars", "average_speed", "congestion"]
    )

    prediction = model.predict(input_data)[0]
    result = "HIGH CONGESTION" if prediction == 1 else "LOW CONGESTION"

    estimated_waiting_time = round((waiting_cars * 0.15) + (congestion * 0.03), 1)

    if congestion >= 85:
        signal_recommendation = "Extend green signal time by 35 seconds"
        controller_action = "Critical traffic condition. Give immediate priority to this road."
    elif congestion >= 70:
        signal_recommendation = "Increase green signal time by 25 seconds"
        controller_action = "Priority should be given to the highly congested road."
    elif congestion >= 40:
        signal_recommendation = "Maintain normal signal timing with close monitoring"
        controller_action = "Monitor traffic flow and prepare for signal adjustment."
    else:
        signal_recommendation = "No signal extension required"
        controller_action = "Traffic flow is currently stable."

    return jsonify({
        "prediction": result,
        "estimated_waiting_time": estimated_waiting_time,
        "signal_recommendation": signal_recommendation,
        "controller_action": controller_action
    })


if __name__ == "__main__":
    app.run(debug=True)