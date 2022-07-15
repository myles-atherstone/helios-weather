export default function DataBox({ title, data, unit, icon }) {
  return (
    <div className="data-box-widget">
      <img className="icon" src={icon} />
      <div className="data-container">
        <span className="title">{title}</span>
        <span className="data">
          {data}
          {unit}
        </span>
      </div>
    </div>
  );
}
