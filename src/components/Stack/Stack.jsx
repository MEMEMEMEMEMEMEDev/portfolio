import "./Stack.scss";
import { useState } from "react";
import { createPortal } from "react-dom";
import { TECH_DATA } from "../../data/tech_data";

const Stack = () => {
  const [selectedTech, setSelectedTech] = useState(null);

  return (
    <>
      <div className="stack-grid">
        {Object.keys(TECH_DATA).map((key) => (
          <div
            key={key}
            className={`skill-chip ${selectedTech === key ? "active" : ""}`}
            onClick={() => setSelectedTech(key)}
          >
            <span className="dot"></span>
            {key}
          </div>
        ))}
      </div>

      {selectedTech &&
        createPortal(
          <div
            className="cyber-modal-overlay"
            onClick={() => setSelectedTech(null)}
          >
            <div
              className="cyber-modal-window"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <span className="modal-title">
                  {">>"} TECH_ANALYSIS: {selectedTech}
                </span>
                <button
                  className="close-btn"
                  onClick={() => setSelectedTech(null)}
                >
                  [CLOSE]
                </button>
              </div>

              <div className="modal-content">
                <div className="stats-row">
                  <div className="stat">
                    <span className="label">LEVEL:</span>
                    <span className="value highlight">
                      {TECH_DATA[selectedTech].level}
                    </span>
                  </div>
                  <div className="stat">
                    <span className="label">TIME:</span>
                    <span className="value">{TECH_DATA[selectedTech].exp}</span>
                  </div>
                </div>

                <div className="separator"></div>

                <div className="desc-block">
                  <span className="cmd-prompt">{">"}</span>
                  <p className="description">{TECH_DATA[selectedTech].desc}</p>
                </div>
              </div>

              <div className="modal-footer">
                <span className="sys-msg">STATUS: OK</span>
                <span className="blink-cursor">_</span>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
};

export default Stack;
