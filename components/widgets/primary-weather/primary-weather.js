import { useState } from 'react';

export default function PrimaryWeather({
  temperature,
  weatherMain,
  weatherDescription,
  icon,
}) {
  const [temperatureScale, setTemperatureScale] = useState('C');

  const kelvinToCelsius = (k) => {
    console.log('KK', k);
    console.log('KK', k - 273.15);
    return (k - 273.15).toFixed(0);
  };

  const kelvinToFahrenheit = (k) => {
    return (1.8 * (k - 273) + 32).toFixed(0);
  };

  const titleCase = (str) => {
    var splitStr = str.toLowerCase().split(' ');
    for (var i = 0; i < splitStr.length; i++) {
      splitStr[i] =
        splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
    }
    return splitStr.join(' ');
  };

  let displayTemperature = temperature;

  if (temperatureScale === 'C') {
    displayTemperature = kelvinToCelsius(temperature);
  } else if (temperatureScale === 'F') {
    displayTemperature = kelvinToFahrenheit(temperature);
  }

  return (
    <div className="primary-weather-widget">
      <div className="icon-toggle-container">
        <div className="icon-wrapper">
          <img src={`/images/${icon}.png`} />
        </div>
        <div className="temperature-scale-toggle">
          <span
            className={temperatureScale === 'C' ? 'toggle on' : 'toggle off'}
            onClick={() => setTemperatureScale('C')}
          >
            °C
          </span>
          <span> / </span>
          <span
            className={temperatureScale === 'F' ? 'toggle on' : 'toggle off'}
            onClick={() => setTemperatureScale('F')}
          >
            °F
          </span>
        </div>
      </div>
      <div className="details">
        <div className="temperature">
          <span>{displayTemperature}</span>
          <span className="degree-symbol">° </span>
          <span>{temperatureScale}</span>
        </div>
        <div className="description">
          <span className="main">{weatherMain}</span>
          <span className="sub">{titleCase(weatherDescription)}</span>
        </div>
      </div>
    </div>
  );
}
