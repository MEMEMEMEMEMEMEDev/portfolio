import "./Contact.scss";

const Contact = () => {
  return (
    <div className="contact-links">
      <a
        href="https://github.com/MEMEMEMEMEMEMEDev"
        target="_blank"
        rel="noopener noreferrer"
        className="cyber-btn"
      >
        GITHUB
      </a>

      <a
        href="https://cl.linkedin.com/in/marcelo-huenchupan-884420208"
        target="_blank"
        rel="noopener noreferrer"
        className="cyber-btn"
      >
        LINKEDIN
      </a>

      <a href="mailto:marccelohuenchupan@gmail.com" className="cyber-btn">
        EMAIL_ME
      </a>
    </div>
  );
};

export default Contact;
