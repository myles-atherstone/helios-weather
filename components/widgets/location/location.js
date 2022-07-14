export default function Location({ location, hours, minutes, period }) {
  const primaryLocation = location.substring(0, location.indexOf(','));
  const secondaryLocation = location.substring(location.indexOf(',') + 2);

  return (
    <div className="location-widget">
      <div className="location-container">
        <h1 className="primary-location">{primaryLocation}</h1>
        <h2 className="secondary-location">{secondaryLocation}</h2>
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
