export default function Location({
  name,
  region,
  country,
  hours,
  minutes,
  period,
}) {
  return (
    <div className="location-widget">
      <div className="location-container">
        <h1 className="primary-location">{name}</h1>
        <h2 className="secondary-location">{`${region}, ${country}`}</h2>
      </div>
      <div className="time-container">
        <span className="time">
          {hours}:{minutes}
        </span>
        <span className="period"> {period}</span>
      </div>
    </div>
  );
}
