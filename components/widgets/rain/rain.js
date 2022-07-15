import RainMeter from './rain-meter';

export default function Rain({ forecasts, displayNumber }) {
  const rainMeters = [];

  for (let i = 0; i < displayNumber; i++) {
    const forecast = forecasts[i];
    rainMeters.push(
      <RainMeter
        unixTime={forecast.unixTime}
        timezoneOffset={forecast.timezoneOffset}
        rainChance={forecast.rainChance}
      />
    );
  }

  return (
    <div className="rain-widget">
      <span className="title">Chance of rain</span>
      {rainMeters}
    </div>
  );
}
