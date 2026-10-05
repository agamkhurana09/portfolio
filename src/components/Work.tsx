import { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { MdArrowOutward } from "react-icons/md";
import { FaGithub } from "react-icons/fa6";
import WorkImage from "./WorkImage";
import "./styles/Work.css";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// ----------------------------------------------------
// Projects Data Array (Editable at top of file)
// ----------------------------------------------------
interface ProjectItem {
  id: string;
  title: string;
  category: string;
  description: string;
  tools: string;
  liveUrl: string;
  githubUrl: string;
  image: string;
  video?: string;
}

const projects: ProjectItem[] = [
  {
    id: "docmind",
    title: "DocMind",
    category: "AI / Mobile",
    description:
      "Personal knowledge OS with vector document search, contextual indexing, and fast conversational Q&A.",
    tools: "React Native, Expo, TypeScript, Groq",
    liveUrl: "https://github.com/agamkhurana09/DocMind",
    githubUrl: "https://github.com/agamkhurana09/DocMind",
    image: "/projects/docmind.webp",
    video: "/projects/docmind.webm",
  },
  {
    id: "bandup",
    title: "BandUp",
    category: "EdTech / Web",
    description:
      "IELTS prep platform featuring automated AI evaluation of essay responses with rubric scoring.",
    tools: "Next.js, TypeScript, Tailwind, Zustand, Anthropic",
    liveUrl: "https://bandup-sepia.vercel.app",
    githubUrl: "https://github.com/agamkhurana09/BandUp",
    image: "/projects/bandup.webp",
    video: "/projects/bandup.webm",
  },
  {
    id: "sinct",
    title: "Sinct",
    category: "E-commerce",
    description:
      "Storefront with integrated payments, automated orders, and customer email alerts.",
    tools: "Next.js, TypeScript, Tailwind, Razorpay, Resend",
    liveUrl: "https://sinct.vercel.app",
    githubUrl: "https://github.com/agamkhurana09/sinct-website",
    image: "/projects/sinct.webp",
    video: "/projects/sinct.webm",
  },
  {
    id: "portfolio",
    title: "Portfolio",
    category: "Creative / Frontend / 3D / GSAP",
    description:
      "3D avatar, physics-based tech stack and GSAP scroll animations",
    tools: "React, GSAP, Three.js, Lenis",
    liveUrl: "#",
    githubUrl: "https://github.com/agamkhurana09",
    image: "/projects/portfolio.webp",
    video: "/projects/portfolio.webm",
  },
];

const Work = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // Recalibrate trigger positions after fonts/images load & Experience height changes, connect Lenis
  useEffect(() => {
    const handleRefresh = () => {
      ScrollTrigger.sort();
      ScrollTrigger.refresh();
    };

    window.addEventListener("load", handleRefresh);
    if (document.fonts) {
      document.fonts.ready.then(handleRefresh);
    }

    // Observe Experience section height changes to ensure trigger positions never become stale
    const careerSection = document.querySelector(".career-section");
    let resizeObserver: ResizeObserver | null = null;
    if (careerSection && window.ResizeObserver) {
      resizeObserver = new ResizeObserver(() => {
        ScrollTrigger.sort();
        ScrollTrigger.refresh();
      });
      resizeObserver.observe(careerSection);
    }

    // Keep Lenis connected: lenis.on('scroll', ScrollTrigger.update) and gsap.ticker driving lenis.raf
    const lenis = (window as any).lenis;
    let tickerCallback: ((time: number) => void) | null = null;
    if (lenis) {
      lenis.on("scroll", ScrollTrigger.update);
      tickerCallback = (t: number) => {
        lenis.raf(t * 1000);
      };
      gsap.ticker.add(tickerCallback);
      gsap.ticker.lagSmoothing(0);
    }

    return () => {
      window.removeEventListener("load", handleRefresh);
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
      if (lenis) {
        lenis.off?.("scroll", ScrollTrigger.update);
        if (tickerCallback) {
          gsap.ticker.remove(tickerCallback);
        }
      }
    };
  }, []);

  useGSAP(
    () => {
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      const mm = gsap.matchMedia();

      // Desktop: Single pinned ScrollTrigger timeline
      mm.add("(min-width: 901px)", () => {
        const screens =
          containerRef.current?.querySelectorAll<HTMLElement>(".work-screen");
        if (!screens || screens.length === 0) return;

        // Project 1 must be fully visible and static when the pin starts
        screens.forEach((screen, i) => {
          if (i === 0) {
            gsap.set(screen, { opacity: 1, y: 0, pointerEvents: "auto" });
          } else {
            gsap.set(screen, { opacity: 0, y: 30, pointerEvents: "none" });
          }
        });

        // Determine pinType: use "transform" if an ancestor has transform (e.g. #smooth-content), else "fixed"
        let hasTransformedAncestor = false;
        let p = containerRef.current?.parentElement;
        while (p && p !== document.body) {
          const style = window.getComputedStyle(p);
          if (
            style.transform !== "none" ||
            style.perspective !== "none" ||
            style.filter !== "none"
          ) {
            hasTransformedAncestor = true;
            break;
          }
          p = p.parentElement;
        }

        const pinType =
          (window as any).smoother ||
          (window as any).ScrollSmoother?.get?.() ||
          hasTransformedAncestor
            ? "transform"
            : "fixed";

        // ONE ScrollTrigger on Work section root
        const tl = gsap.timeline({
          scrollTrigger: {
            id: "work",
            trigger: containerRef.current,
            start: "top top",
            end: () => "+=" + (projects.length - 1) * window.innerHeight,
            pin: true,
            pinSpacing: true,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            pinType: pinType,
            onUpdate: (self) => {
              // Active index computed exclusively from this trigger's progress. At progress 0 -> shows 01 / 04
              const idx = Math.min(
                projects.length - 1,
                Math.floor(self.progress * projects.length)
              );
              setActiveIndex(idx);
            },
          },
        });

        // Total timeline duration = projects.length - 1 (e.g. 3 units for 4 projects)
        // Project 1 stays visible and static at the moment pin starts (time 0)
        // Transitions to 2, 3, 4 happen in sequence: 01 → 02 → 03 → 04
        for (let i = 0; i < screens.length - 1; i++) {
          const current = screens[i];
          const next = screens[i + 1];
          const transitionStart = i + 0.25;
          const transitionDuration = 0.75;

          if (!prefersReducedMotion) {
            tl.to(
              current,
              {
                opacity: 0,
                y: -30,
                duration: transitionDuration,
                ease: "power1.inOut",
                pointerEvents: "none",
              },
              transitionStart
            ).to(
              next,
              {
                opacity: 1,
                y: 0,
                duration: transitionDuration,
                ease: "power1.inOut",
                pointerEvents: "auto",
              },
              transitionStart
            );
          } else {
            tl.to(
              current,
              {
                opacity: 0,
                duration: transitionDuration,
                pointerEvents: "none",
              },
              transitionStart
            ).to(
              next,
              {
                opacity: 1,
                duration: transitionDuration,
                pointerEvents: "auto",
              },
              transitionStart
            );
          }
        }

        // Ensure triggers are sorted in section order (Experience, Work, TechStack)
        ScrollTrigger.sort();
      });

      // Mobile: Natural vertical stack
      mm.add("(max-width: 900px)", () => {
        const screens =
          containerRef.current?.querySelectorAll<HTMLElement>(".work-screen");
        if (screens) {
          screens.forEach((screen) => {
            gsap.set(screen, { opacity: 1, y: 0, pointerEvents: "auto" });
          });
        }
      });

      return () => {
        mm.revert();
      };
    },
    { scope: containerRef }
  );

  return (
    <div className="work-section" id="work" ref={containerRef}>
      <div className="work-container section-container">
        {/* Sticky Header with Title and Global Progress */}
        <div className="work-header">
          <h2>
            My <span>Work</span>
          </h2>
          <div className="work-progress-indicator">
            <span className="current-num">0{activeIndex + 1}</span>
            <span className="separator">/</span>
            <span className="total-num">0{projects.length}</span>
          </div>
        </div>

        {/* Pinned Screens Area (Desktop) / Vertical Stack (Mobile) */}
        <div className="work-screens-viewport">
          {projects.map((project, index) => (
            <div
              className={`work-screen ${index === activeIndex ? "is-active" : ""}`}
              key={project.id}
            >
              <div className="work-screen-inner">
                {/* Big Media Card (16:10) */}
                <div className="work-media-side">
                  <WorkImage
                    image={project.image}
                    alt={project.title}
                    video={project.video}
                    link={project.liveUrl || project.githubUrl}
                    title={project.title}
                    category={project.category}
                  />
                </div>

                {/* Details Card */}
                <div className="work-details-side">
                  <div className="work-meta">
                    <span className="work-screen-badge">
                      0{index + 1} / 0{projects.length}
                    </span>
                    <span className="work-category-tag">{project.category}</span>
                  </div>

                  <h3 className="work-project-title">{project.title}</h3>
                  <p className="work-project-description">
                    {project.description}
                  </p>

                  <div className="work-tools-group">
                    <span className="work-tools-label">Tools &amp; Features</span>
                    <p className="work-tools-text">{project.tools}</p>
                  </div>

                  {/* Live and GitHub action buttons */}
                  <div className="work-action-buttons">
                    {project.liveUrl && project.liveUrl !== "#" && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="work-btn work-btn-live"
                        data-cursor="disable"
                      >
                        <span>Live Demo</span>
                        <MdArrowOutward />
                      </a>
                    )}
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="work-btn work-btn-github"
                        data-cursor="disable"
                      >
                        <FaGithub />
                        <span>GitHub</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Work;
