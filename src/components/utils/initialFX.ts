import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { smoother } from "../Navbar";
import setSplitText from "./splitText";

gsap.registerPlugin(SplitText, ScrollTrigger);

export function initialFX() {
  document.body.style.overflowY = "auto";

  try {
    if (smoother && typeof smoother.paused === "function") {
      smoother.paused(false);
    }
  } catch (err) {
    console.warn("Error unpausing smoother:", err);
  }

  try {
    const mainEl = document.getElementsByTagName("main")[0];
    if (mainEl) {
      mainEl.classList.add("main-active");
    }

    gsap.to("body", {
      backgroundColor: "#0b080c",
      duration: 0.5,
      delay: 1,
    });

    const landingText = SplitText.create(
      [".landing-info h3", ".landing-intro h2", ".landing-intro h1"],
      {
        type: "chars,lines",
        mask: "lines",
        autoSplit: true,
      }
    );
    if (landingText.chars && landingText.chars.length) {
      gsap.from(landingText.chars, {
        opacity: 0,
        y: 80,
        filter: "blur(5px)",
        duration: 1.2,
        ease: "power3.inOut",
        stagger: 0.025,
        delay: 0.3,
        clearProps: "opacity,filter",
      });
    }

    const landingText2 = SplitText.create(".landing-h2-info", {
      type: "chars,lines",
      mask: "lines",
      autoSplit: true,
    });
    if (landingText2.chars && landingText2.chars.length) {
      gsap.from(landingText2.chars, {
        opacity: 0,
        y: 80,
        filter: "blur(5px)",
        duration: 1.2,
        ease: "power3.inOut",
        stagger: 0.025,
        delay: 0.3,
        clearProps: "opacity,filter",
      });
    }

    gsap.fromTo(
      ".landing-info-h2",
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        duration: 1.2,
        ease: "power1.inOut",
        y: 0,
        delay: 0.8,
        clearProps: "opacity",
      }
    );

    gsap.fromTo(
      [".header", ".icons-section", ".nav-fade"],
      { opacity: 0 },
      {
        opacity: 1,
        duration: 1.2,
        ease: "power1.inOut",
        delay: 0.1,
        clearProps: "opacity",
      }
    );

    const landingText3 = SplitText.create(".landing-h2-info-1", {
      type: "chars,lines",
      mask: "lines",
      autoSplit: true,
    });
    const landingText4 = SplitText.create(".landing-h2-1", {
      type: "chars,lines",
      mask: "lines",
      autoSplit: true,
    });
    const landingText5 = SplitText.create(".landing-h2-2", {
      type: "chars,lines",
      mask: "lines",
      autoSplit: true,
    });

    if (
      landingText2.chars &&
      landingText3.chars &&
      landingText2.chars.length &&
      landingText3.chars.length
    ) {
      LoopText(landingText2, landingText3);
    }
    if (
      landingText4.chars &&
      landingText5.chars &&
      landingText4.chars.length &&
      landingText5.chars.length
    ) {
      LoopText(landingText4, landingText5);
    }

    // Initialize SplitText for About & other sections now that the loader has ended
    setSplitText();
    ScrollTrigger.refresh();

    // Fallback: 3 seconds after loader ends, guarantee About text is fully visible
    setTimeout(() => {
      const aboutElements = document.querySelectorAll(
        ".about-section, .about-me, .about-me .title, .about-me .para, .about-me *"
      );
      gsap.set(aboutElements, {
        opacity: 1,
        visibility: "visible",
        clearProps: "visibility",
      });
      ScrollTrigger.refresh();
    }, 3000);
  } catch (err) {
    console.warn("initialFX animation error:", err);
  }
}

function LoopText(Text1: any, Text2: any) {
  var tl = gsap.timeline({ repeat: -1, repeatDelay: 1 });
  const delay = 4;
  const delay2 = delay * 2 + 1;

  tl.fromTo(
    Text2.chars,
    { opacity: 0, y: 80 },
    {
      opacity: 1,
      duration: 1.2,
      ease: "power3.inOut",
      y: 0,
      stagger: 0.1,
      delay: delay,
    },
    0
  )
    .fromTo(
      Text1.chars,
      { y: 80 },
      {
        duration: 1.2,
        ease: "power3.inOut",
        y: 0,
        stagger: 0.1,
        delay: delay2,
      },
      1
    )
    .fromTo(
      Text1.chars,
      { y: 0 },
      {
        y: -80,
        duration: 1.2,
        ease: "power3.inOut",
        stagger: 0.1,
        delay: delay,
      },
      0
    )
    .to(
      Text2.chars,
      {
        y: -80,
        duration: 1.2,
        ease: "power3.inOut",
        stagger: 0.1,
        delay: delay2,
      },
      1
    );
}
