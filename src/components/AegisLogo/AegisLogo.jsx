import "./AegisLogo.scss";

const AegisLogo = ({ subtitle = "INFRASTRUCTURE", isExiting }) => {
  return (
    <div className={`aegis-logo-container ${isExiting ? "is-exiting" : ""}`}>
      <div className="scan-line"></div>

      <div className="symbol-container">
        <div className="triada">
          <div className="edge edge-left"></div>
          <div className="edge edge-right"></div>
          <div className="core-gem"></div>
        </div>
      </div>

      <div className="logotype">
        <h1 className="hero-text" data-text="AEGIS">
          AEGIS
        </h1>
      </div>

      <div className="meta-bar">
        <div className="deco-line"></div>
        <div className="meta-content">
          <span className="hash">///</span>
          <span className="label">{subtitle}</span>
          <span className="coords">EVA.01</span>
        </div>
        <div className="deco-line"></div>
      </div>
    </div>
  );
};

export default AegisLogo;
