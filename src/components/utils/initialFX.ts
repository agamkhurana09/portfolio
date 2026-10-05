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
        type: "words,chars",
        mask: "words",
        autoSplit: true,
      }
    );
    if (landingText.chars && landingText.chars.length) {
      gsap.fromTo(
        landingText.chars,
        { opacity: 0, y: 40, filter: "blur(4px)" },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 1.1,
          ease: "power3.out",
          stagger: 0.02,
          delay: 0.3,
          clearProps: "opacity,filter,transform",
        }
      );
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

    const landingText4 = SplitText.create(".landing-h2-1", {
      type: "words,chars",
      mask: "words",
      autoSplit: true,
    });
    const landingText5 = SplitText.create(".landing-h2-2", {
      type: "words,chars",
      mask: "words",
      autoSplit: true,
    });
    const landingText2 = SplitText.create(".landing-h2-info", {
      type: "words,chars",
      mask: "words",
      autoSplit: true,
    });
    const landingText3 = SplitText.create(".landing-h2-info-1", {
      type: "words,chars",
      mask: "words",
      autoSplit: true,
    });

    // Reveal visible words cleanly
    const initialActiveChars = [
      ...(landingText4.chars || []),
      ...(landingText2.chars || []),
    ];
    if (initialActiveChars.length) {
      gsap.fromTo(
        initialActiveChars,
        { opacity: 0, y: 40, filter: "blur(4px)" },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 1.1,
          ease: "power3.out",
          stagger: 0.02,
          delay: 0.5,
          clearProps: "opacity,filter,transform",
        }
      );
    }

    // Initialize alternate words hidden
    const initialHiddenChars = [
      ...(landingText5.chars || []),
      ...(landingText3.chars || []),
    ];
    if (initialHiddenChars.length) {
      gsap.set(initialHiddenChars, {
        opacity: 0,
        y: 60,
      });
    }

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
  } catch (err) {
    console.warn("initialFX animation error:", err);
  }
}

function LoopText(Text1: any, Text2: any) {
  const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.8 });
  const hold = 3.5;
  const dur = 0.75;

  tl.to(
    Text1.chars,
    {
      y: -60,
      opacity: 0,
      duration: dur,
      ease: "power3.inOut",
      stagger: 0.02,
    },
    `+=${hold}`
  )
    .fromTo(
      Text2.chars,
      { y: 60, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: dur,
        ease: "power3.out",
        stagger: 0.02,
        clearProps: "transform",
      },
      "<0.1"
    )
    .to(
      Text2.chars,
      {
        y: -60,
        opacity: 0,
        duration: dur,
        ease: "power3.inOut",
        stagger: 0.02,
      },
      `+=${hold}`
    )
    .fromTo(
      Text1.chars,
      { y: 60, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: dur,
        ease: "power3.out",
        stagger: 0.02,
        clearProps: "transform",
      },
      "<0.1"
    );

  return tl;
}
