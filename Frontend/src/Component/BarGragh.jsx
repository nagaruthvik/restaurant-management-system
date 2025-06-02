import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
} from "chart.js";
import { Line } from "react-chartjs-2";
import axios from "axios";

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip
);

export default function WeeklyLineChart({ type = "daily" }) {
  const [labels, setLabels] = useState([]);
  const [dataValues, setDataValues] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_KEY}order/revenue-summary?type=${type}`
        );
        const summary = res.data.summary || [];
        let newLabels = [];
        let newData = [];
        if (type === "daily") {
          newLabels = summary.map((item) => {
            const d = new Date(item._id.year, item._id.month - 1, item._id.day);
            return d.toLocaleDateString("en-US", { weekday: "short" });
          });
        } else if (type === "monthly") {
          newLabels = summary.map((item) => {
            const d = new Date(item._id.year, item._id.month - 1, 1);
            return d.toLocaleDateString("en-US", { month: "short" });
          });
        } else if (type === "yearly") {
          newLabels = summary.map((item) => `${item._id.year}`);
        }
        newData = summary.map((item) => item.totalRevenue);
        setLabels(newLabels);
        setDataValues(newData);
      } catch (err) {
        setLabels([]);
        setDataValues([]);
      }
    }
    fetchData();
  }, [type]);

  const data = {
    labels,
    datasets: [
      {
        label: "Revenue",
        data: dataValues,
        fill: false,
        borderColor: "#222",
        tension: 0.4,
        pointRadius: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        display: false,
        beginAtZero: true,
      },
      x: {
        grid: { display: false },
        ticks: {
          color: "#222",
          font: {
            size: 12,
            family: "sans-serif",
          },
        },
      },
    },
    plugins: {
      legend: { display: false },
    },
  };

  const backgroundPlugin = {
    id: "customBackground",
    beforeDraw: (chart) => {
      const { ctx, chartArea } = chart;
      if (!chartArea) return;

      const totalBars = chart.data.labels.length || 1;
      const fullBarWidth = (chartArea.right - chartArea.left) / totalBars;
      const barWidth = fullBarWidth * 0.6; 

      ctx.save();

      chart.data.labels.forEach((_, i) => {
        const x =
          chartArea.left + i * fullBarWidth + (fullBarWidth - barWidth) / 2; 
        ctx.fillStyle = i % 2 === 0 ? "lightgrey" : "grey";
        ctx.fillRect(
          x,
          chartArea.top,
          barWidth,
          chartArea.bottom - chartArea.top
        );
      });

      ctx.restore();
    },
  };

  return (
    <div
      style={{
        height: "180px",
        padding: "1rem",
        background: "#f3f8f6",
        borderRadius: "12px",
        boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
      }}
    >
      <Line data={data} options={options} plugins={[backgroundPlugin]} />
    </div>
  );
}
