import "./Dashboard.scss";

import { useEffect, useRef } from "react";

import Contact from "../Contact/Contact";
import Module from "../Module/Module";
import Profile from "../Profile/Profile";
import Projects from "../Projects/Projects";
import Stack from "../Stack/Stack";
import Terminal from "../Terminal/Terminal";

const Dashboard = ({ active = true }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (active && containerRef.current) {
      containerRef.current.scrollTop = 0;
    }
  }, [active]);
  return (
    <div
      ref={containerRef}
      className={`dashboard-container ${active ? "visible" : ""}`}
    >
      <div className="grid-background"></div>
      <div className="main-grid">
        <Module
          title="PILOT_PROFILE // ADMIN"
          className="area-profile"
          delay={100}
        >
          <Profile />
        </Module>

        <Module
          title="SYSTEM_RESOURCES // STACK"
          className="area-stack"
          delay={200}
        >
          <Stack />
        </Module>

        <Module
          title="ACTIVE_DEPLOYMENTS"
          className="area-projects"
          delay={300}
        >
          <Projects />
        </Module>

        <Module
          title="SYSTEM_LOGS // TERMINAL"
          className="area-terminal"
          delay={400}
        >
          <Terminal />
        </Module>

        <Module title="COMM_LINK" className="area-contact" delay={500}>
          <Contact />
        </Module>
      </div>
    </div>
  );
};

export default Dashboard;
