import SunBox from './sun-box';

export default function Sun({
  sunriseTime,
  sunsetTime,
  currentDate,
  timezoneOffset,
}) {
  return (
    <div className="sun-widget">
      <span className="title">Sunrise & Sunset</span>
      <SunBox
        type={'SUNRISE'}
        time={sunriseTime}
        currentDate={currentDate}
        timezoneOffset={timezoneOffset}
      />
      <SunBox
        type={'SUNSET'}
        time={sunsetTime}
        currentDate={currentDate}
        timezoneOffset={timezoneOffset}
      />
    </div>
  );
}
