export default function Sidebar({ children }) {
  return (
    <div className="sidebar">
      <div className="radial-gradient-top"></div>
      <div className="radial-gradient-bottom"></div>
      <div className="content">{children}</div>
    </div>
  );
}
