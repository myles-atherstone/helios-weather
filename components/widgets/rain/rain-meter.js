import formatDate from '../../../util/dateHelper';

export default function RainMeter({ unixTime, timezoneOffset, rainChance }) {
  const date = new Date((unixTime + timezoneOffset) * 1000);

  const dateValues = formatDate(date);

  return (
    <div className="rain-meter-widget">
      <div className="time">
        {dateValues[3]} {dateValues[7]}
      </div>
      <div className="percent-meter">
        <span className="fill" style={{ width: `${rainChance * 100}%` }}></span>
      </div>
      <div className="percent">{rainChance * 100}%</div>
    </div>
  );
}
