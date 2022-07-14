export default function Location({ location }) {
  const primaryLocation = location.substring(0, location.indexOf(','));
  const secondaryLocation = location.substring(location.indexOf(',') + 2);

  return (
    <div className="location-widget">
      <h1 className="primary-location">{primaryLocation}</h1>
      <h2 className="secondary-location">{secondaryLocation}</h2>
    </div>
  );
}
