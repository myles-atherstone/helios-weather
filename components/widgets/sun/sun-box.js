import formatDate from '../../../util/dateHelper';

export default function SunBox({ type, time, currentDate, timezoneOffset }) {
  const sunriseIcon = 'sunrise.png';
  const sunsetIcon = 'sunset.png';

  const date = new Date((time + timezoneOffset) * 1000);
  const dateValues = formatDate(date);

  const hours = dateValues[3];
  const minutes = dateValues[4];
  const period = dateValues[7];

  const dateDiff = date - currentDate;
  const hourDiff = dateDiff / (60 * 60 * 1000);
  const minDiff = dateDiff / (60 * 1000);
  const hourReadable = Math.floor(Math.abs(hourDiff));
  const minReadable = Math.floor(minDiff - 60 * Math.floor(hourDiff));

  let timeToInText;
  if (dateDiff > 0) {
    if (hourReadable > 0) {
      timeToInText = `In ${hourReadable} hours`;
    } else {
      timeToInText = `In ${minReadable} minutes`;
    }
  } else if (dateDiff < 0) {
    if (hourReadable > 0) {
      timeToInText = `${hourReadable} hours ago`;
    } else {
      timeToInText = `In ${minReadable} minutes`;
    }
  } else {
  }

  return (
    <div className="sunbox-widget">
      <div className="icon-time-container">
        <img
          className="icon"
          src={
            type === 'SUNRISE'
              ? `/images/${sunriseIcon}`
              : `/images/${sunsetIcon}`
          }
        />
        <div className="type-time-container">
          <span className="type">
            {type === 'SUNRISE' ? 'Sunrise' : 'Sunset'}
          </span>
          <span className="time-container">
            <span className="time">
              {hours}:{minutes}
            </span>
            <span className="period"> {period}</span>
          </span>
        </div>
      </div>
      <div className="time-to-in-container">{timeToInText}</div>
    </div>
  );
}
