import { useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import "./App.css";

function App() {
  const [waitingCars, setWaitingCars] = useState("");
  const [averageSpeed, setAverageSpeed] = useState("");
  const [congestion, setCongestion] = useState("");

  const [result, setResult] = useState("");
  const [waitingTime, setWaitingTime] = useState("");
  const [recommendation, setRecommendation] = useState("");
  const [action, setAction] = useState("");
  const [history, setHistory] = useState([]);

  const risk = Number(congestion || 0);

  const getSeverity = () => {
    if (risk >= 85) return "CRITICAL";
    if (risk >= 70) return "HIGH";
    if (risk >= 40) return "MEDIUM";
    return "LOW";
  };

  const predictTraffic = async () => {
    try {
      const response = await axios.post("http://127.0.0.1:5000/predict", {
        waiting_cars: Number(waitingCars),
        average_speed: Number(averageSpeed),
        congestion: Number(congestion),
      });

      const prediction = response.data.prediction;
      const delay = response.data.estimated_waiting_time;
      const signal = response.data.signal_recommendation;
      const controller = response.data.controller_action;

      setResult(prediction);
      setWaitingTime(delay);
      setRecommendation(signal);
      setAction(controller);

      setHistory((prev) => [
        ...prev,
        {
          name: `Test ${prev.length + 1}`,
          waitingCars: Number(waitingCars),
          speed: Number(averageSpeed),
          congestion: Number(congestion),
          delay: Number(delay),
          type: prediction,
          time: new Date().toLocaleTimeString(),
        },
      ]);
    } catch (err) {
      console.error(err);
      alert("Cannot connect to Flask API");
    }
  };

  const downloadReport = () => {
    const doc = new jsPDF();

    doc.setFontSize(24);
    doc.text("SimTraffic AI", 20, 20);

    doc.setFontSize(18);
    doc.text("Traffic Prediction Report", 20, 35);
    doc.line(20, 42, 190, 42);

    doc.setFontSize(13);
    doc.text(`Prediction: ${result}`, 20, 60);
    doc.text(`Traffic Severity: ${getSeverity()}`, 20, 75);
    doc.text(`Congestion Risk: ${risk}%`, 20, 90);
    doc.text(`Estimated Delay: ${waitingTime} minutes`, 20, 105);

    doc.text("Signal Recommendation:", 20, 125);
    doc.text(recommendation, 25, 135);

    doc.text("Traffic Management Recommendation:", 20, 155);
    doc.text(action, 25, 165);

    doc.text(`Generated: ${new Date().toLocaleString()}`, 20, 190);

    doc.save("SimTraffic_AI_Report.pdf");
  };

  const highCount = history.filter(
    (item) => item.type === "HIGH CONGESTION"
  ).length;

  const lowCount = history.filter(
    (item) => item.type === "LOW CONGESTION"
  ).length;

  const averageCongestion =
    history.length > 0
      ? (
          history.reduce((sum, item) => sum + item.congestion, 0) /
          history.length
        ).toFixed(1)
      : 0;

  const averageDelay =
    history.length > 0
      ? (
          history.reduce((sum, item) => sum + item.delay, 0) /
          history.length
        ).toFixed(1)
      : 0;

  const highestCongestion =
    history.length > 0
      ? Math.max(...history.map((item) => item.congestion))
      : 0;

  const lowestSpeed =
    history.length > 0 ? Math.min(...history.map((item) => item.speed)) : 0;

  const pieData = [
    { name: "High", value: highCount },
    { name: "Low", value: lowCount },
  ];

  const barData = history.map((item) => ({
    name: item.name,
    congestion: item.congestion,
    delay: item.delay,
  }));

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

            <div className="severity-box">
              <h3>🚨 Traffic Severity Meter</h3>

              <div className="risk-line">
                <span>{getSeverity()}</span>
                <span>{risk}% Risk</span>
              </div>

              <div className="progress">
                <div
                  className="progress-fill"
                  style={{ width: `${risk}%` }}
                ></div>
              </div>
            </div>

            <div className="recommendation-box">
              <h3>⏱ Estimated Delay</h3>
              <p>{waitingTime} minutes</p>

              <h3>🚦 Signal Recommendation</h3>
              <p>{recommendation}</p>

              <h3>🧭 Traffic Management Recommendation</h3>
              <p>{action}</p>
            </div>

            <button className="download-btn" onClick={downloadReport}>
              📄 Download Report
            </button>
          </div>
        )}

        {history.length > 0 && (
          <div className="analysis-section">
            <h2>📊 Interactive Analysis Dashboard</h2>

            <div className="summary-grid">
              <div className="summary-card">
                <h3>{averageCongestion}%</h3>
                <p>Average Congestion</p>
              </div>

              <div className="summary-card">
                <h3>{averageDelay} min</h3>
                <p>Average Delay</p>
              </div>

              <div className="summary-card">
                <h3>{highestCongestion}%</h3>
                <p>Highest Congestion</p>
              </div>

              <div className="summary-card">
                <h3>{lowestSpeed}</h3>
                <p>Lowest Speed</p>
              </div>
            </div>

            <div className="stats-grid">
              <div>
                <h3>{history.length}</h3>
                <p>Total Predictions</p>
              </div>

              <div>
                <h3>{highCount}</h3>
                <p>High Congestion</p>
              </div>

              <div>
                <h3>{lowCount}</h3>
                <p>Low Congestion</p>
              </div>
            </div>

            <div className="chart-box">
              <h3>Congestion Level Summary</h3>

              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={80}
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    <Cell fill="#dc2626" />
                    <Cell fill="#16a34a" />
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="chart-box">
              <h3>Congestion and Delay History</h3>

              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={barData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="congestion"
                    fill="#2563eb"
                    name="Congestion %"
                  />
                  <Bar dataKey="delay" fill="#f97316" name="Delay (min)" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="history-table">
              <h2>📜 Prediction History</h2>

              <table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Prediction</th>
                    <th>Delay</th>
                    <th>Congestion</th>
                    <th>Speed</th>
                    <th>Time</th>
                  </tr>
                </thead>

                <tbody>
                  {history.map((item, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{item.type}</td>
                      <td>{item.delay} min</td>
                      <td>{item.congestion}%</td>
                      <td>{item.speed}</td>
                      <td>{item.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;