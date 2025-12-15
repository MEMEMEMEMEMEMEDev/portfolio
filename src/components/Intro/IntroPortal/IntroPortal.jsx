import "./IntroPortal.scss";
import { useEffect, useState } from "react";

const IntroPortal = ({ visible, isExiting, onSequenceFinish }) => {
  const [internalState, setInternalState] = useState({
    label: "SYSTEM BOOTING...",
    status: "loading",
  });

  useEffect(() => {
    if (visible) {
      const timerReady = setTimeout(() => {
        setInternalState({ label: "SYSTEM READY", status: "idle" });
      }, 2000);

      const timerAccess = setTimeout(() => {
        setInternalState({ label: "ACCESSING CORE...", status: "loading" });
      }, 3500);

      const timerSuccess = setTimeout(() => {
        setInternalState({ label: "ACCESS GRANTED", status: "success" });
      }, 5000);

      const timerFinish = setTimeout(() => {
        if (onSequenceFinish) onSequenceFinish();
      }, 6000);

      return () => {
        clearTimeout(timerReady);
        clearTimeout(timerAccess);
        clearTimeout(timerSuccess);
        clearTimeout(timerFinish);
      };
    }
  }, [visible, onSequenceFinish]);

  if (!visible && !isExiting) return null;

  return (
    <div
      className={`intro-portal-wrapper 
        ${visible ? "is-visible" : ""} 
        ${isExiting ? "is-exiting" : ""} 
      `}
    >
      <div className={`portal-display ${internalState.status}`}>
        <span className="bracket bracket-left"></span>
        <span className="bracket bracket-right"></span>

        <div className="content">
          <span className="label" key={internalState.label}>
            {internalState.label}
          </span>
          <span className="status-indicator"></span>
        </div>

        <div className="active-fill"></div>

        {internalState.status === "loading" && (
          <div className="loading-bar"></div>
        )}
      </div>

      <div className="meta-status">
        {internalState.label === "SYSTEM BOOTING..." && "CHECKING INTEGRITY..."}
        {internalState.label === "SYSTEM READY" && "INITIALIZING PROTOCOLS..."}
        {internalState.label === "ACCESSING CORE..." &&
          "VERIFYING BIOMETRICS..."}
        {internalState.status === "success" && "WELCOME USER"}
      </div>
    </div>
  );
};

export default IntroPortal;
