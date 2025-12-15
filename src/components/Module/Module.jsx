import "./Module.scss";

const Module = ({ title, className, delay, children }) => (
  <div
    className={`cyber-module ${className}`}
    style={{ animationDelay: `${delay}ms` }}
  >
    <span className="corner top-left"></span>
    <span className="corner top-right"></span>
    <span className="corner bottom-left"></span>
    <span className="corner bottom-right"></span>

    <div className="module-header">
      <div className="status-light"></div>
      <h3 className="module-title">{title}</h3>
      <div className="header-deco">
        <div className="scan-bar"></div>
      </div>
    </div>

    <div className="module-content">{children}</div>
  </div>
);

export default Module;
