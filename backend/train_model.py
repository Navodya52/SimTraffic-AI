import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, confusion_matrix, classification_report
import joblib

# Load dataset
df = pd.read_csv("../dataset/traffic_data.csv")

print(df.head())

# ----------------------------
# Create AI Label
# ----------------------------

df["traffic_level"] = df["congestion"].apply(
    lambda x: 1 if x > 70 else 0
)

# Features
X = df[
    [
        "waiting_cars",
        "average_speed",
        "congestion"
    ]
]

# Target
y = df["traffic_level"]

# Split
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42
)

# Model
model = RandomForestClassifier(
    n_estimators=100,
    random_state=42
)

# Train
model.fit(X_train, y_train)

# Predict
pred = model.predict(X_test)

# Accuracy
acc = accuracy_score(y_test, pred)

print("\nAccuracy:", acc)

print("\nConfusion Matrix")
print(confusion_matrix(y_test, pred))

print("\nClassification Report")
print(classification_report(y_test, pred))

# Save model
joblib.dump(model, "traffic_model.pkl")

print("\nModel saved successfully!")