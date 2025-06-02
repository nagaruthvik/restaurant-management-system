import React, { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import axios from "axios";

ChartJS.register(ArcElement, Tooltip, Legend);

const colors = ["#2f2f2f", "#7a7a7a", "#bfbfbf"];
const labels = ["Take Away", "Served", "Dine in"];

export default function CompactDonutBar({ type = "daily" }) {
  const [values, setValues] = useState([0, 0, 0]);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_KEY}order/summary?type=${type}`
        );
        const { takeaway = 0, served = 0, dineIn = 0 } = res.data;
        setValues([takeaway, served, dineIn]);
      } catch (err) {
        setValues([0, 0, 0]);
      }
    }
    fetchData();
  }, [type]);

  console.log(values);
  console.log(type)

  const donutData = {
    labels,
    datasets: [
      {
        data: values,
        backgroundColor: colors,
        borderWidth: 0,
      },
    ],
  };

  const donutOptions = {
    cutout: "70%",
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: function (context) {
            return `${context.label}: ${context.formattedValue}`;
          },
        },
      },
    },
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        backgroundColor: "#f3f8f6",
        padding: "1.5rem",
        borderRadius: "12px",
        width: "fit-content",
      }}
    >
      <div style={{ width: "120px", height: "80px" }}>
        <Doughnut data={donutData} options={donutOptions} />
      </div>
      <div style={{ marginLeft: "2rem" }}>
        {labels.map((label, i) => (
          <div key={i} style={{ marginBottom: "0.1rem" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "14px",
                color: "#777",
                marginBottom: "4px",
              }}
            >
              <span>{label}</span>
              <span>({values[i]})</span>
            </div>
            <div
              style={{
                backgroundColor: "#fff",
                height: "6px",
                borderRadius: "10px",
                width: "150px",
              }}
            >
              <div
                style={{
                  width: `${
                    values[i] ? (values[i] / Math.max(...values, 1)) * 100 : 0
                  }%`,
                  backgroundColor: colors[i],
                  height: "100%",
                  borderRadius: "10px",
                }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
