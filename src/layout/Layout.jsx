import "./Layout.scss";
import { useState } from "react";

import Intro from "../components/Intro/Intro";
import Dashboard from "../components/Dashboard/Dashboard";

export default function Layout() {
  const [introFinished, setIntroFinished] = useState(false);

  return (
    <div className="layout">
      <div className="layer-dashboard">
        <Dashboard active={introFinished} />
      </div>

      {!introFinished && (
        <div className="layer-intro">
          <Intro onIntroComplete={() => setIntroFinished(true)} />
        </div>
      )}
    </div>
  );
}
