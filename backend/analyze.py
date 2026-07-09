import pandas as pd
import matplotlib.pyplot as plt

# Read dataset
df = pd.read_csv("../dataset/traffic_data.csv")

print("\n===== DATASET =====")
print(df.head())

print("\n===== STATISTICS =====")
print(df.describe())

print("\n===== CORRELATION =====")
print(df.corr(numeric_only=True))

# Plot congestion over time
plt.figure(figsize=(10,5))
plt.plot(df["tick"], df["congestion"], color="red")
plt.title("Traffic Congestion Over Time")
plt.xlabel("Tick")
plt.ylabel("Congestion")
plt.grid(True)
plt.savefig("congestion_graph.png")
plt.show()

# Plot average speed
plt.figure(figsize=(10,5))
plt.plot(df["tick"], df["average_speed"], color="green")
plt.title("Average Speed Over Time")
plt.xlabel("Tick")
plt.ylabel("Average Speed")
plt.grid(True)
plt.savefig("speed_graph.png")
plt.show()

# Scatter plot
plt.figure(figsize=(7,6))
plt.scatter(df["waiting_cars"], df["congestion"])
plt.xlabel("Waiting Cars")
plt.ylabel("Congestion")
plt.title("Waiting Cars vs Congestion")
plt.grid(True)
plt.savefig("scatter.png")
plt.show()

print("\nGraphs saved successfully!")