import { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import "./styles/Career.css";

gsap.registerPlugin(ScrollTrigger, useGSAP);

interface StatItem {
  value: number;
  suffix?: string;
  label: string;
}

interface CareerItem {
  role: string;
  company: string;
  date: string;
  bullets: string[];
  skills: string[];
}

const statsData: StatItem[] = [
  { value: 4, suffix: "+", label: "Projects Shipped" },
  { value: 1, suffix: "", label: "Internship" },
  { value: 15, suffix: "+", label: "Technologies" },
];

const experienceData: CareerItem[] = [
  {
    role: "SDE Intern",
    company: "Clannco",
    date: "Jun 6 – Jul 17, 2026",
    bullets: [
      "Engineered automated full-stack workflows replacing repetitive operational processes.",
      "Integrated AI automation systems with modern web applications and responsive UI.",
      "Collaborated on production systems with clean API design and end-to-end reliability.",
    ],
    skills: ["React", "Node.js", "AI Automation", "REST APIs", "TypeScript"],
  },
  {
    role: "Founder & Full Stack Engineer",
    company: "Sinct",
    date: "2025 – Present",
    bullets: [
      "Architected and shipped an e-commerce platform with automated order workflows.",
      "Integrated Razorpay payment gateway and transactional email system via Resend.",
      "Designed full frontend and backend architecture using Next.js and Tailwind CSS.",
    ],
    skills: ["Next.js", "TypeScript", "Tailwind CSS", "Razorpay", "Resend"],
  },
  {
    role: "Creator & Lead Developer",
    company: "DocMind",
    date: "2025 – 2026",
    bullets: [
      "Engineered a personal knowledge OS with vector document search and conversational Q&A.",
      "Implemented low-latency LLM inference pipelines using Groq and custom retrieval.",
      "Shipped cross-platform mobile client with React Native and Expo.",
    ],
    skills: ["React Native", "Expo", "TypeScript", "Groq", "RAG"],
  },
  {
    role: "Full Stack & AI Developer",
    company: "BandUp",
    date: "2025 – 2026",
    bullets: [
      "Developed an IELTS prep application with automated AI evaluation of essay responses.",
      "Connected Anthropic Claude models for structured rubric scoring and instant feedback.",
      "Built dynamic assessment UI flows and reactive state management with Zustand.",
    ],
    skills: ["Next.js", "TypeScript", "Tailwind CSS", "Zustand", "Anthropic"],
  },
];

const educationData: CareerItem[] = [
  {
    role: "B.Tech CST",
    company: "Maharaja Agrasen Institute of Technology",
    date: "2024 – Present",
    bullets: [
      "Specializing in Computer Science & Technology with a focus on engineering principles.",
      "Building practical software systems, algorithms, and full-stack development projects.",
      "Active participant in technical student communities and developer hackathons.",
    ],
    skills: ["Data Structures", "Algorithms", "Software Engineering", "Full-Stack"],
  },
  {
    role: "BS Data Science & Applications",
    company: "IIT Madras",
    date: "Now",
    bullets: [
      "Studying data science, machine learning models, and statistical foundations.",
      "Applying Python, SQL, and data analysis to document search and evaluation systems.",
      "Bridging machine learning research concepts with real-world full-stack applications.",
    ],
    skills: ["Python", "Machine Learning", "Data Analysis", "SQL", "LLMs"],
  },
];

const Career = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<"experience" | "education">(
    "experience"
  );
  const isTransitioningRef = useRef(false);

  const currentList =
    activeTab === "experience" ? experienceData : educationData;

  useEffect(() => {
    const handleRefresh = () => {
      ScrollTrigger.refresh();
    };

    window.addEventListener("load", handleRefresh);
    if (document.fonts) {
      document.fonts.ready.then(handleRefresh);
    }
    return () => {
      window.removeEventListener("load", handleRefresh);
    };
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 60);
    return () => clearTimeout(timer);
  }, [activeTab]);

  const handleTabChange = (tab: "experience" | "education") => {
    if (tab === activeTab || isTransitioningRef.current) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion || !contentRef.current) {
      setActiveTab(tab);
      setTimeout(() => ScrollTrigger.refresh(), 50);
      return;
    }

    isTransitioningRef.current = true;
    gsap.to(contentRef.current, {
      opacity: 0,
      y: -12,
      duration: 0.22,
      ease: "power2.in",
      onComplete: () => {
        setActiveTab(tab);
        requestAnimationFrame(() => {
          if (contentRef.current) {
            gsap.fromTo(
              contentRef.current,
              { opacity: 0, y: 12 },
              {
                opacity: 1,
                y: 0,
                duration: 0.3,
                ease: "power2.out",
                onComplete: () => {
                  isTransitioningRef.current = false;
                  ScrollTrigger.refresh();
                },
              }
            );
          } else {
            isTransitioningRef.current = false;
            ScrollTrigger.refresh();
          }
        });
      },
    });
  };

  useGSAP(
    () => {
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      // 1. Stat Counters animation
      const statEls =
        containerRef.current?.querySelectorAll<HTMLElement>(".stat-count");
      if (statEls) {
        statEls.forEach((el) => {
          const target = parseFloat(el.getAttribute("data-target") || "0");
          if (prefersReducedMotion) {
            el.innerText = target.toString();
            return;
          }
          const counterObj = { count: 0 };
          gsap.to(counterObj, {
            count: target,
            duration: 1.6,
            ease: "power2.out",
            scrollTrigger: {
              trigger: el,
              start: "top 85%",
              once: true,
            },
            onUpdate: () => {
              el.innerText = Math.round(counterObj.count).toString();
            },
          });
        });
      }

      // 2. Timeline glowing line animation
      const timelineLine =
        containerRef.current?.querySelector<HTMLElement>(".career-timeline");
      if (timelineLine) {
        if (prefersReducedMotion) {
          gsap.set(timelineLine, { maxHeight: "100%", opacity: 1 });
        } else {
          gsap.fromTo(
            timelineLine,
            { maxHeight: "0%", opacity: 0.4 },
            {
              maxHeight: "100%",
              opacity: 1,
              ease: "none",
              scrollTrigger: {
                trigger: ".career-info",
                start: "top 75%",
                end: "bottom 75%",
                scrub: 0.5,
                invalidateOnRefresh: true,
              },
            }
          );
        }
      }

      // 3. Stagger career items
      const infoBoxes =
        containerRef.current?.querySelectorAll<HTMLElement>(".career-info-box");
      if (infoBoxes && !prefersReducedMotion) {
        infoBoxes.forEach((box) => {
          gsap.fromTo(
            box,
            { opacity: 0, y: 25 },
            {
              opacity: 1,
              y: 0,
              duration: 0.5,
              ease: "power2.out",
              scrollTrigger: {
                trigger: box,
                start: "top 88%",
                toggleActions: "play none none reverse",
              },
            }
          );
        });
      }
    },
    { scope: containerRef, dependencies: [activeTab] }
  );

  return (
    <div className="career-section section-container" ref={containerRef}>
      <div className="career-container">
        <h2>
          My career <span>&</span>
          <br /> experience
        </h2>

        {/* 3 Animated Stat Counters */}
        <div className="career-stats">
          {statsData.map((stat, idx) => (
            <div className="career-stat-card" key={idx}>
              <div className="career-stat-number">
                <span className="stat-count" data-target={stat.value}>
                  0
                </span>
                {stat.suffix && (
                  <span className="stat-suffix">{stat.suffix}</span>
                )}
              </div>
              <div className="career-stat-label">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Experience / Education Tabs */}
        <div className="career-tabs-wrapper">
          <div className="career-tabs" role="tablist">
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "experience"}
              className={`career-tab-btn ${
                activeTab === "experience" ? "active" : ""
              }`}
              onClick={() => handleTabChange("experience")}
              data-cursor="disable"
            >
              Experience
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "education"}
              className={`career-tab-btn ${
                activeTab === "education" ? "active" : ""
              }`}
              onClick={() => handleTabChange("education")}
              data-cursor="disable"
            >
              Education
            </button>
          </div>
        </div>

        {/* Timeline with vertical progress line & dot */}
        <div className="career-info" ref={contentRef}>
          <div className="career-timeline">
            <div className="career-dot"></div>
          </div>

          {currentList.map((item, idx) => (
            <div className="career-info-box" key={`${item.company}-${idx}`}>
              <div className="career-info-in">
                <div className="career-role">
                  <h4>{item.role}</h4>
                  <h5>{item.company}</h5>
                </div>
                <h3>{item.date}</h3>
              </div>

              <div className="career-details">
                <ul className="career-bullets">
                  {item.bullets.map((bullet, bIdx) => (
                    <li key={bIdx}>{bullet}</li>
                  ))}
                </ul>
                <div className="career-chips">
                  {item.skills.map((skill, sIdx) => (
                    <span className="career-chip" key={sIdx}>
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Career;
