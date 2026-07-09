import { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [waitingCars, setWaitingCars] = useState("");
  const [averageSpeed, setAverageSpeed] = useState("");
  const [congestion, setCongestion] = useState("");
  const [result, setResult] = useState("");

  const predictTraffic = async () => {
    try {
      const response = await axios.post("http://127.0.0.1:5000/predict", {
        waiting_cars: Number(waitingCars),
        average_speed: Number(averageSpeed),
        congestion: Number(congestion),
      });

      setResult(response.data.prediction);
    } catch (err) {
      console.log(err);
      alert("Cannot connect to Flask API");
    }
  };

  return (
    <div className="app">
      <div className="card">
        <h1>🚦 SimTraffic AI</h1>
        <p className="subtitle">Intelligent Traffic Congestion Prediction</p>

        <input
          type="number"
          placeholder="Waiting Cars"
          value={waitingCars}
          onChange={(e) => setWaitingCars(e.target.value)}
        />

        <input
          type="number"
          placeholder="Average Speed"
          value={averageSpeed}
          onChange={(e) => setAverageSpeed(e.target.value)}
        />

        <input
          type="number"
          placeholder="Congestion %"
          value={congestion}
          onChange={(e) => setCongestion(e.target.value)}
        />

        <button onClick={predictTraffic}>Predict Traffic</button>

        {result && (
          <div className="result">
            <p>Prediction Result</p>
            <h2 className={result === "HIGH CONGESTION" ? "high" : "low"}>
              {result}
            </h2>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;