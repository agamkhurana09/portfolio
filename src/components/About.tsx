import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import setSplitText from "./utils/splitText";
import "./styles/About.css";

const aboutData = {
  title: "About Me",
  paragraph:
    "I'm Agam, a full-stack and Gen AI developer from Delhi. I build products end to end: React and Node up front, RAG pipelines and LLMs behind them. I'm doing a B.Tech at MAIT alongside a BS in Data Science from IIT Madras, and I've shipped DocMind, BandUp and Sinct along the way.",
};

const About = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize reveal animation
    setSplitText();

    // Fallback: 3 seconds past the section entering the viewport, guarantee final state is fully visible
    let fallbackTimer: ReturnType<typeof setTimeout> | null = null;
    const enterTrigger = ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top bottom",
      once: true,
      onEnter: () => {
        fallbackTimer = setTimeout(() => {
          if (containerRef.current) {
            const textEls = containerRef.current.querySelectorAll(
              ".title, .para, .title *, .para *"
            );
            gsap.set(textEls, {
              opacity: 1,
              visibility: "visible",
              y: 0,
              yPercent: 0,
              clearProps: "opacity,visibility,transform",
            });
          }
        }, 3000);
      },
    });

    let observer: IntersectionObserver | null = null;
    if (typeof IntersectionObserver !== "undefined" && containerRef.current) {
      observer = new IntersectionObserver(
        (entries) => {
          if (entries[0]?.isIntersecting) {
            if (!fallbackTimer) {
              fallbackTimer = setTimeout(() => {
                if (containerRef.current) {
                  const textEls = containerRef.current.querySelectorAll(
                    ".title, .para, .title *, .para *"
                  );
                  gsap.set(textEls, {
                    opacity: 1,
                    visibility: "visible",
                    y: 0,
                    yPercent: 0,
                    clearProps: "opacity,visibility,transform",
                  });
                }
              }, 3000);
            }
            observer?.disconnect();
          }
        },
        { threshold: 0.05 }
      );
      observer.observe(containerRef.current);
    }

    return () => {
      if (fallbackTimer) clearTimeout(fallbackTimer);
      enterTrigger.kill();
      if (observer) observer.disconnect();
    };
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
