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

    return jsonify({"prediction": result})

if __name__ == "__main__":
    app.run(debug=True)