import "./Intro.scss";

import { useEffect, useRef, useState } from "react";
import { useWebGL } from "./WebGL/useWebGL";
import { vertexShaderSource, fragmentShaderSource } from "./WebGL/shaders";
import AegisLogo from "../AegisLogo/AegisLogo";
import IntroPortal from "./IntroPortal/IntroPortal";

export default function Intro({ onIntroComplete }) {
  const canvasRef = useRef(null);
  const [isExiting, setIsExiting] = useState(false);
  const [showPortal, setShowPortal] = useState(false);

  useWebGL(canvasRef, vertexShaderSource, fragmentShaderSource);

  useEffect(() => {
    const timer = setTimeout(() => setShowPortal(true), 500);
    return () => clearTimeout(timer);
  }, []);

  const handlePortalSequenceFinish = () => {
    setIsExiting(true);
    setTimeout(() => {
      if (onIntroComplete) onIntroComplete();
    }, 1000);
  };

  return (
    <div className="container">
      <canvas ref={canvasRef} />

      <div className="intro">
        <div className="logo">
          <AegisLogo subtitle="SYSTEMS_ARCHITECT" isExiting={isExiting} />

          <div className="button">
            <IntroPortal
              visible={showPortal}
              isExiting={isExiting}
              onSequenceFinish={handlePortalSequenceFinish}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
