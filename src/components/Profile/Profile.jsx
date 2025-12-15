import "./Profile.scss";

const Profile = () => (
  <div className="profile-layout">
    <div className="id-column">
      <div className="avatar-section">
        <div className="glitch-avatar">
          <span className="initials">MH</span>
        </div>
        <div className="status-badge">
          <span className="dot"></span> SYSTEM_ONLINE
        </div>
      </div>

      <div className="identity-block">
        <h2 className="pilot-name">Marcelo Huenchupan</h2>
        <div className="pilot-role">Software Developer</div>
        <div className="pilot-id">ID: EVA01-CL</div>
      </div>

      <div className="specs-grid">
        <div className="spec-row">
          <span className="label">AGE:</span> <span className="val">26</span>
        </div>
        <div className="spec-row">
          <span className="label">BASE:</span>{" "}
          <span className="val">STGO_CL</span>
        </div>
        <div className="spec-row">
          <span className="label">EXP:</span>{" "}
          <span className="val">04_YRS</span>
        </div>
      </div>
    </div>

    <div className="bio-column">
      <div className="bio-header">
        <span className="hash">#</span> OPERATOR_LOG
        <div className="line"></div>
      </div>

      <p className="bio-text">
        Soy un Desarrollador Full Stack con un enfoque visceral hacia la{" "}
        <span className="highlight">profundidad técnica</span>. Me motiva el
        desafío de construir desde los cimientos y entender el núcleo del
        software para crear soluciones a medida cuando el rendimiento lo exige.
        <br />
        <br />
        Sin embargo, combino esta pasión con un{" "}
        <span className="highlight">pragmatismo estratégico</span>: sé discernir
        cuándo es necesario reinventar la rueda para ganar eficiencia y cuándo
        es más inteligente apalancar servicios en la nube. He llevado este
        equilibrio a{" "}
        <span className="highlight">escenarios de misión crítica</span>,
        gestionando aplicaciones que sirven a miles de usuarios, asegurando
        siempre la mejor relación entre innovación técnica y estabilidad.
      </p>

      <div className="bio-footer">
        <div className="tag">TYPE: AUTODIDACT</div>
        <div className="tag">CORE: VANILLA_JS</div>
        <div className="tag">OPS: BARE_METAL</div>
        <div className="tag">FOCUS: BUILDER</div>
      </div>
    </div>
  </div>
);

export default Profile;
