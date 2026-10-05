import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import "./styles/About.css";

gsap.registerPlugin(ScrollTrigger, SplitText);

const aboutData = {
  title: "About Me",
  paragraph:
    "I'm Agam, a full-stack and Gen AI developer from Delhi. I build products end to end: React and Node up front, RAG pipelines and LLMs behind them. I'm doing a B.Tech at MAIT alongside a BS in Data Science from IIT Madras, and I've shipped DocMind, BandUp and Sinct along the way.",
};

const About = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Fallback: 3 seconds after mount/loader ends, ensure About text is visible at opacity 1
    const fallbackTimer = setTimeout(() => {
      if (containerRef.current) {
        const textEls = containerRef.current.querySelectorAll(
          ".title, .para, .title *, .para *"
        );
        gsap.set(textEls, {
          opacity: 1,
          visibility: "visible",
          clearProps: "visibility",
        });
        ScrollTrigger.refresh();
      }
    }, 3000);

    return () => clearTimeout(fallbackTimer);
  }, []);

  return (
    <div className="about-section" id="about" ref={containerRef}>
      <div className="about-me">
        <h3 className="title">{aboutData.title}</h3>
        <p className="para">{aboutData.paragraph}</p>
      </div>
    </div>
  );
};

export default About;
