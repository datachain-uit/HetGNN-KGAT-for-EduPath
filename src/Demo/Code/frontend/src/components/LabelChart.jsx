import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

// Đăng ký các thành phần cần thiết
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const LabelBarChart = ({ labelData }) => {
  const labels = [];
  const percentages = [];

  if (labelData) {
    Object.values(labelData).forEach((item) => {
      labels.push(item.name);
      percentages.push(item.percent);
    });
  }

  const pastelColors = ["#FFB3C1", "#A8D8FF", "#FFF3B0", "#B2F7EF", "#D3C0F9"];
  const backgroundColors = labels.map(
    (_, i) => pastelColors[i % pastelColors.length]
  );

  const data = {
    labels,
    datasets: [
      {
        label: "Proportion (%)",
        data: percentages,
        backgroundColor: backgroundColors,
        borderColor: "#000000",
        borderWidth: 1.5,
        borderRadius: 4,
        barPercentage: 0.6,
        categoryPercentage: 0.5,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
        labels: {
          font: {
            family: "Inter",
            size: 14,
            weight: "bold",
          },
        },
      },
      tooltip: {
        callbacks: {
          label: (ctx) => `${ctx.raw}%`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          callback: (value) => `${value}%`,
          font: {
            family: "Inter",
            size: 12,
          },
        },
        title: {
          display: true,
          text: "Percentage (%)",
          font: {
            family: "Inter",
            size: 14,
            weight: "bold",
          },
        },
      },
      x: {
        ticks: {
          font: {
            family: "Inter",
            size: 12,
          },
        },
        title: {
          display: true,
          text: "Labels",
          font: {
            family: "Inter",
            size: 14,
            weight: "bold",
          },
        },
      },
    },
  };

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h3
        className="label-chart-title"
        style={{ fontFamily: "Inter", fontWeight: "600", marginBottom: "20px" }}
      >
        Label Distribution
      </h3>
      <Bar data={data} options={options} />
    </div>
  );
};

export default LabelBarChart;
