import { useRef, useState, useEffect, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { MdArrowOutward } from "react-icons/md";
import { FaGithub } from "react-icons/fa6";
import WorkImage from "./WorkImage";
import "./styles/Work.css";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// ----------------------------------------------------
// Projects Data Array
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

// Duplicate projects for seamless infinite marquee loop
const duplicatedProjects = [...projects, ...projects];

const BASE_SPEED = 60; // Base speed in px/s

interface WorkCardProps {
  project: ProjectItem;
  index: number;
}

const WorkCard = ({ project, index }: WorkCardProps) => {
  const [isCardHovered, setIsCardHovered] = useState(false);

  return (
    <div
      className="work-card"
      onMouseEnter={() => setIsCardHovered(true)}
      onMouseLeave={() => setIsCardHovered(false)}
    >
      <div className="work-card-media">
        <WorkImage
          image={project.image}
          alt={project.title}
          video={project.video}
          link={project.liveUrl !== "#" ? project.liveUrl : project.githubUrl}
          title={project.title}
          category={project.category}
          isCardHovered={isCardHovered}
        />
      </div>

      <div className="work-card-content">
        <div className="work-meta">
          <span className="work-screen-badge">0{index + 1}</span>
          <span className="work-category-tag">{project.category}</span>
        </div>

        <h3 className="work-project-title">{project.title}</h3>
        <p className="work-project-description">{project.description}</p>

        <div className="work-tools-group">
          <span className="work-tools-label">Tools &amp; Features</span>
          <p className="work-tools-text">{project.tools}</p>
        </div>

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
  );
};

const Work = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const [isDragging, setIsDragging] = useState(false);

  // Marquee state refs
  const xPosRef = useRef(0);
  const loopWidthRef = useRef(0);
  const isDraggingRef = useRef(false);
  const hasMovedRef = useRef(false);
  const startXRef = useRef(0);
  const lastXRef = useRef(0);
  const lastTimeRef = useRef(0);
  const momentumVelocityRef = useRef(0);
  const speedRef = useRef({ value: BASE_SPEED });
  const scrollBoostRef = useRef(0);

  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Measure exact distance between Card 0 and Card 4 (one complete set)
  const updateLoopWidth = useCallback(() => {
    if (!trackRef.current) return;
    const cards = trackRef.current.querySelectorAll<HTMLElement>(".work-card");
    if (cards.length >= 8) {
      const dist = cards[4].offsetLeft - cards[0].offsetLeft;
      if (dist > 50) {
        loopWidthRef.current = dist;
      } else {
        const r0 = cards[0].getBoundingClientRect();
        const r4 = cards[4].getBoundingClientRect();
        const fallbackDist = r4.left - r0.left;
        if (fallbackDist > 50) {
          loopWidthRef.current = fallbackDist;
        }
      }
    }
  }, []);

  // Update speed based on prefers-reduced-motion
  useEffect(() => {
    if (prefersReducedMotion) {
      speedRef.current.value = 0;
    }
  }, [prefersReducedMotion]);

  // Recalibrate trigger positions and dimensions after layout, fonts/images load & Experience height changes
  useEffect(() => {
    const handleRefresh = () => {
      updateLoopWidth();
      ScrollTrigger.sort();
      ScrollTrigger.refresh();
    };

    window.addEventListener("load", handleRefresh);
    window.addEventListener("resize", handleRefresh);
    if (document.fonts) {
      document.fonts.ready.then(handleRefresh);
    }

    // ResizeObserver on trackRef to compute loop width after layout, never at mount
    let trackObserver: ResizeObserver | null = null;
    if (trackRef.current && typeof ResizeObserver !== "undefined") {
      trackObserver = new ResizeObserver(() => {
        updateLoopWidth();
      });
      trackObserver.observe(trackRef.current);
    }

    // Listen for image loads to recompute loop width
    const handleImgLoad = () => {
      updateLoopWidth();
      ScrollTrigger.refresh();
    };
    const imgs = trackRef.current?.querySelectorAll("img");
    imgs?.forEach((img) => {
      if (img.complete) return;
      img.addEventListener("load", handleImgLoad, { once: true });
      img.addEventListener("error", handleImgLoad, { once: true });
    });

    const careerSection = document.querySelector(".career-section");
    let resizeObserver: ResizeObserver | null = null;
    if (careerSection && window.ResizeObserver) {
      resizeObserver = new ResizeObserver(() => {
        handleRefresh();
      });
      resizeObserver.observe(careerSection);
    }

    // Keep Lenis connected if available
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

    // Fallback: sets all cards to opacity 1 if they are still hidden 2 seconds after the section mounts
    const fallbackTimer = setTimeout(() => {
      if (trackRef.current) {
        const cards = trackRef.current.querySelectorAll<HTMLElement>(".work-card");
        cards.forEach((card) => {
          const comp = window.getComputedStyle(card);
          if (comp.opacity === "0" || parseFloat(comp.opacity) < 0.1) {
            gsap.set(card, {
              opacity: 1,
              y: 0,
              clearProps: "opacity,transform",
            });
          }
        });
      }
    }, 2000);

    return () => {
      window.removeEventListener("load", handleRefresh);
      window.removeEventListener("resize", handleRefresh);
      clearTimeout(fallbackTimer);
      if (trackObserver) {
        trackObserver.disconnect();
      }
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
  }, [updateLoopWidth]);

  // Drag and Pointer interaction handlers
  const onPointerMove = useCallback((e: PointerEvent) => {
    if (!isDraggingRef.current) return;

    const dx = e.clientX - lastXRef.current;
    const now = performance.now();
    const dt = (now - lastTimeRef.current) / 1000;

    if (Math.abs(e.clientX - startXRef.current) > 6) {
      hasMovedRef.current = true;
    }

    xPosRef.current += dx;

    // Immediately wrap and apply transform for zero latency
    if (loopWidthRef.current > 0) {
      const wrapped = gsap.utils.wrap(-loopWidthRef.current, 0, xPosRef.current);
      xPosRef.current = wrapped;
      if (trackRef.current) {
        gsap.set(trackRef.current, { x: wrapped, force3D: true });
      }
    }

    if (dt > 0.008) {
      const v = dx / dt;
      momentumVelocityRef.current =
        momentumVelocityRef.current * 0.3 + v * 0.7;
      lastXRef.current = e.clientX;
      lastTimeRef.current = now;
    }
  }, []);

  const onPointerUp = useCallback((e: PointerEvent) => {
    if (!isDraggingRef.current) return;

    isDraggingRef.current = false;
    setIsDragging(false);

    window.removeEventListener("pointermove", onPointerMove);
    window.removeEventListener("pointerup", onPointerUp);
    window.removeEventListener("pointercancel", onPointerUp);

    // If mouse was stationary for a moment before release, drop momentum
    if (performance.now() - lastTimeRef.current > 120) {
      momentumVelocityRef.current = 0;
    } else {
      momentumVelocityRef.current = Math.max(
        -2500,
        Math.min(2500, momentumVelocityRef.current)
      );
    }

    // Check if cursor is still over viewport on pointer up
    if (viewportRef.current) {
      const rect = viewportRef.current.getBoundingClientRect();
      const isInside =
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom;

      if ((!isInside || e.pointerType === "touch") && !prefersReducedMotion) {
        gsap.to(speedRef.current, {
          value: BASE_SPEED,
          duration: 0.8,
          ease: "power2.out",
          overwrite: "auto",
        });
      }
    }

    // Delay clearing hasMoved so click capture can intercept clicks
    if (hasMovedRef.current) {
      setTimeout(() => {
        hasMovedRef.current = false;
      }, 60);
    }
  }, [onPointerMove, prefersReducedMotion]);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0 && e.pointerType === "mouse") return;

    if (loopWidthRef.current <= 0) {
      updateLoopWidth();
    }

    isDraggingRef.current = true;
    setIsDragging(true);
    hasMovedRef.current = false;
    startXRef.current = e.clientX;
    lastXRef.current = e.clientX;
    lastTimeRef.current = performance.now();
    momentumVelocityRef.current = 0;

    try {
      (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    } catch {}

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("pointercancel", onPointerUp);
  };

  // Hover handlers for the marquee track
  const handleMouseEnter = () => {
    if (prefersReducedMotion) return;
    gsap.to(speedRef.current, {
      value: 0,
      duration: 0.6,
      ease: "power2.out",
      overwrite: "auto",
    });
  };

  const handleMouseLeave = () => {
    if (prefersReducedMotion || isDraggingRef.current) return;
    gsap.to(speedRef.current, {
      value: BASE_SPEED,
      duration: 0.8,
      ease: "power2.out",
      overwrite: "auto",
    });
  };

  // Click capture prevents link clicks during drag gestures
  const handleClickCapture = (e: React.MouseEvent) => {
    if (hasMovedRef.current) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  useGSAP(
    () => {
      // 1. Entrance animation: cards fade and slide up once when section enters viewport
      const cards = trackRef.current?.querySelectorAll<HTMLElement>(".work-card");
      if (cards && cards.length > 0) {
        gsap.fromTo(
          cards,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            stagger: 0.08,
            ease: "power2.out",
            immediateRender: false,
            clearProps: "opacity,transform",
            scrollTrigger: {
              trigger: "#work",
              start: "top 80%",
              once: true,
            },
          }
        );
      }

      // Continuous ticker loop for smooth auto-scroll, momentum, and scroll boost
      const tick = (_time: number, deltaTime: number) => {
        const dt = Math.min(deltaTime / 1000, 0.1);
        let loopWidth = loopWidthRef.current;

        if (!loopWidth || loopWidth <= 0) {
          updateLoopWidth();
          loopWidth = loopWidthRef.current;
          if (!loopWidth || loopWidth <= 0) return;
        }

        if (isDraggingRef.current) {
          return;
        }

        // Apply drag momentum with exponential decay
        if (Math.abs(momentumVelocityRef.current) > 0.5) {
          xPosRef.current += momentumVelocityRef.current * dt;
          momentumVelocityRef.current *= Math.pow(0.92, dt * 60);
          if (Math.abs(momentumVelocityRef.current) <= 0.5) {
            momentumVelocityRef.current = 0;
          }
        }

        // Read page scroll velocity from ScrollTrigger or Lenis to briefly accelerate the marquee
        let scrollVel = 0;
        if (!prefersReducedMotion) {
          try {
            const st = ScrollTrigger as any;
            if (typeof st.getVelocity === "function") {
              scrollVel = Math.abs(st.getVelocity());
            } else if ((window as any).lenis?.velocity) {
              scrollVel = Math.abs((window as any).lenis.velocity);
            }
          } catch {}
        }

        const targetBoost = prefersReducedMotion
          ? 0
          : Math.min(scrollVel * 0.12, 320);
        scrollBoostRef.current +=
          (targetBoost - scrollBoostRef.current) * Math.min(1, 10 * dt);

        const currentSpeed = speedRef.current.value + scrollBoostRef.current;
        xPosRef.current -= currentSpeed * dt;

        // Wrap around seamlessly
        const wrappedX = gsap.utils.wrap(-loopWidth, 0, xPosRef.current);
        xPosRef.current = wrappedX;

        if (trackRef.current) {
          gsap.set(trackRef.current, { x: wrappedX, force3D: true });
        }
      };

      gsap.ticker.add(tick);

      return () => {
        gsap.ticker.remove(tick);
      };
    },
    { scope: sectionRef }
  );

  return (
    <section id="work" ref={sectionRef}>
      <div className="work-header">
        <h2>
          My <span>Work</span>
        </h2>
      </div>

      <div
        className={`work-carousel-viewport ${isDragging ? "is-dragging" : ""}`}
        ref={viewportRef}
        onPointerDown={handlePointerDown}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClickCapture={handleClickCapture}
      >
        <div className="work-track" ref={trackRef}>
          {duplicatedProjects.map((project, idx) => (
            <WorkCard
              key={`${project.id}-${idx}`}
              project={project}
              index={idx % projects.length}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Work;
