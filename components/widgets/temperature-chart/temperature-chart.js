import { Line } from 'react-chartjs-2';
import formatDate from '../../../util/dateHelper';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function TemperatureChart({ forecasts, temperatureScale }) {
  const labels = [];
  const temperatureData = [];

  const months = {
    '01': 'January',
    '02': 'February',
    '03': 'March',
    '04': 'April',
    '05': 'May',
    '06': 'June',
    '07': 'July',
    '08': 'August',
    '09': 'September',
    10: 'October',
    11: 'November',
    12: 'December',
  };

  const kelvinToCelsius = (k) => {
    return (k - 273.15).toFixed(0);
  };

  const kelvinToFahrenheit = (k) => {
    return (1.8 * (k - 273) + 32).toFixed(0);
  };

  forecasts.forEach((forecast) => {
    const date = new Date((forecast.unixTime + forecast.timezoneOffset) * 1000);
    const dateValues = formatDate(date);

    labels.push(
      `${months[dateValues[1]]} ${dateValues[2]} — ${dateValues[3]} ${
        dateValues[7]
      }`
    );

    if (temperatureScale === 'C') {
      temperatureData.push(kelvinToCelsius(forecast.main.temp));
    } else if (temperatureScale === 'F') {
      temperatureData.push(kelvinToFahrenheit(forecast.main.temp));
    }
  });

  const options = {
    responsive: true,
    scales: {
      x: {
        ticks: {
          color: '#b6b6b6',
          font: { family: 'poppins' },
          maxTicksLimit: 25,
        },
      },
      y: {
        ticks: {
          color: '#b6b6b6',
          font: { family: 'poppins' },
          callback: function (value, index, ticks) {
            return value + '°';
          },
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
      tooltip: {
        displayColors: false,
        padding: { top: 17, right: 14, bottom: 14, left: 14 },
        titleMarginBottom: 0,
        titleFont: {
          family: 'poppins',
          size: '20px',
          weight: 'normal',
        },
        bodySpacing: 0,
        bodyFont: {
          family: 'poppins',
          size: '16px',
        },
        callbacks: {
          label: function (context) {
            console.log('ccc', context);
            return (
              context.dataset.label +
              ': ' +
              context.dataset.data[context.dataIndex] +
              '°'
            );
          },
        },
      },
    },
  };

  const data = {
    labels,
    datasets: [
      {
        label: 'Temperature',
        data: temperatureData,
        borderColor: '#76c8ff',
        backgroundColor: '#5dade2',
        cubicInterpolationMode: 'monotone',
      },
    ],
  };

  console.log(data);

  return (
    <div className="temperature-chart">
      <Line options={options} data={data} />
    </div>
  );
}
