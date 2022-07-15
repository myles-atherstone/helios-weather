export default function DateDisplay({ day, month, year }) {
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

  const getDayName = (dateStr) => {
    var date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { weekday: 'long' });
  };

  return (
    <div className="date-display">
      {getDayName(`${month}/${day}/${year}`)}, {months[month]} {day}, {year}
    </div>
  );
}
