import joblib
import pandas as pd

model = joblib.load("traffic_model.pkl")

waiting_cars = float(input("Enter waiting cars: "))
average_speed = float(input("Enter average speed: "))
congestion = float(input("Enter congestion percentage: "))

data = pd.DataFrame([[waiting_cars, average_speed, congestion]], columns=[
    "waiting_cars", "average_speed", "congestion"
])

prediction = model.predict(data)[0]

if prediction == 1:
    print("\n🚦 Prediction: HIGH CONGESTION")
else:
    print("\n✅ Prediction: LOW CONGESTION")