import "./styles/About.css";

const aboutData = {
  title: "About Me",
  paragraph:
    "I'm Agam, a full-stack and Gen AI developer from Delhi. I build products end to end: React and Node up front, RAG pipelines and LLMs behind them. I'm doing a B.Tech at MAIT alongside a BS in Data Science from IIT Madras, and I've shipped DocMind, BandUp and Sinct along the way.",
};

const About = () => {
  return (
    <div className="about-section" id="about">
      <div className="about-me">
        <h3 className="title">{aboutData.title}</h3>
        <p className="para">{aboutData.paragraph}</p>
      </div>
    </div>
  );
};

export default About;
