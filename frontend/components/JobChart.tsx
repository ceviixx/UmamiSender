'use client';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

const JobLineChart = ({ jobData }) => {
  const labels = jobData.map((entry) => entry.date);

  const data = {
    labels,
    datasets: [
      {
        label: 'Success',
        data: jobData.map((entry) => entry.success),
        borderColor: '#4caf50',
        backgroundColor: '#4caf50',
        tension: 0.3,
        fill: false,
      },
      {
        label: 'Failed',
        data: jobData.map((entry) => entry.failed),
        borderColor: '#f44336',
        backgroundColor: '#f44336',
        tension: 0.3,
        fill: false,
      },
      {
        label: 'Skipped',
        data: jobData.map((entry) => entry.skipped),
        borderColor: '#ff9800',
        backgroundColor: '#ff9800',
        tension: 0.3,
        fill: false,
      },
    ],
  };

  const options = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      mode: 'index',
      intersect: false,
    },
  },
  scales: {
    x: {
      title: {
        display: false,
        text: 'Date',
      },
    },
    y: {
      beginAtZero: true,
      ticks: {
        stepSize: 1,
        callback: function (value) {
          return Number.isInteger(value) ? value : null;
        },
      },
      title: {
        display: false,
        text: 'Count',
      },
    },
  },
};



  return <Line data={data} options={options} />;
};

export default JobLineChart;
