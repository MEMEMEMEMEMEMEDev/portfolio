import "./Projects.scss";

import { useState } from "react";
import { createPortal } from "react-dom";
import { PROJECTS_DATA } from "../../data/projects_data";

const Projects = () => {
  const [selectedProject, setSelectedProject] = useState(null);

  const getStatusColor = (status) => {
    if (status === "RUNNING") return "#00ffaa";
    if (status === "DEV") return "#cba136";
    return "#ff4444";
  };

  return (
    <>
      <div className="projects-list">
        {PROJECTS_DATA.map((project) => (
          <div
            key={project.id}
            className={`project-item ${
              project.status === "RUNNING" ? "active" : "dev"
            }`}
            onClick={() => setSelectedProject(project)}
          >
            <div className="p-header">
              <span className="p-name">{project.name}</span>
              <span
                className="p-status"
                style={{ color: getStatusColor(project.status) }}
              >
                <span className="dot"></span> {project.status}
              </span>
            </div>
            <p className="p-desc">{project.desc.substring(0, 60)}...</p>
          </div>
        ))}
      </div>

      {selectedProject &&
        createPortal(
          <div
            className="cyber-modal-overlay"
            onClick={() => setSelectedProject(null)}
          >
            <div
              className="cyber-modal-window"
              onClick={(e) => e.stopPropagation()}
              style={{
                borderColor: getStatusColor(selectedProject.status),
              }}
            >
              <div className="modal-header">
                <div className="title-group">
                  <span className="protocol">PROTOCOL:</span>
                  <span className="p-id">{selectedProject.name}</span>
                </div>
                <button
                  className="close-btn"
                  onClick={() => setSelectedProject(null)}
                >
                  [ABORT]
                </button>
              </div>

              <div className="modal-content">
                <div className="meta-row">
                  <span className="label">TYPE:</span>
                  <span className="value">{selectedProject.type}</span>
                </div>

                <div className="separator"></div>

                <p className="full-desc">
                  <span className="prompt">{">"}</span> {selectedProject.desc}
                </p>

                <div className="tech-stack-mini">
                  {selectedProject.tags.map((tag) => (
                    <span key={tag} className="mini-chip">
                      {tag}
                    </span>
                  ))}
                </div>

                {selectedProject.status === "DEV" && (
                  <div className="dev-progress-container">
                    <div className="progress-label">
                      COMPILING: {selectedProject.progress}%
                    </div>
                    <div className="progress-track">
                      <div
                        className="progress-bar"
                        style={{ width: `${selectedProject.progress}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>

              <div className="modal-footer">
                {selectedProject.status === "RUNNING" ? (
                  <a
                    href={selectedProject.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="action-btn running"
                  >
                    [ ESTABLISH_UPLINK ]
                  </a>
                ) : (
                  <button className="action-btn dev" disabled>
                    [ DEPLOYMENT_PENDING ]
                  </button>
                )}
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
};

export default Projects;
