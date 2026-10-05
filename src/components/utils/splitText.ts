import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(SplitText, ScrollTrigger);

interface SplitElement extends HTMLElement {
  _splitInstance?: any;
  _splitAnim?: gsap.core.Animation;
}

let isRefreshListenerAttached = false;

export default function setSplitText() {
  try {
    ScrollTrigger.config({ ignoreMobileResize: true });

    const paras = document.querySelectorAll<SplitElement>(".para");
    const titles = document.querySelectorAll<SplitElement>(".title");

    const TriggerStart = "top 80%";
    const ToggleActions = "play none none reverse";

    // Title ("ABOUT ME" label) reveal: words/chars with mask
    titles.forEach((title) => {
      try {
        if (title._splitAnim) {
          title._splitAnim.kill();
        }
        if (title._splitInstance) {
          title._splitInstance.revert();
        }

        title._splitInstance = SplitText.create(title, {
          type: "words,chars",
          mask: "words",
          autoSplit: true,
          onSplit(self: any) {
            const targets =
              self.chars && self.chars.length
                ? self.chars
                : self.words && self.words.length
                ? self.words
                : [title];

            const anim = gsap.fromTo(
              targets,
              { opacity: 0, y: 35 },
              {
                opacity: 1,
                y: 0,
                duration: 0.7,
                ease: "power3.out",
                stagger: 0.02,
                clearProps: "opacity,transform",
                scrollTrigger: {
                  trigger:
                    title.closest(".about-section") ||
                    title.closest(".about-me") ||
                    title.parentElement ||
                    title,
                  start: TriggerStart,
                  toggleActions: ToggleActions,
                },
              }
            );
            title._splitAnim = anim;
            return anim;
          },
        });
      } catch (e) {
        console.warn("SplitText error on title:", e);
        gsap.set(title, { opacity: 1, visibility: "visible", clearProps: "opacity,visibility" });
      }
    });

    // Paragraph reveal: line by line (yPercent 100 to 0 inside mask: "lines", opacity 0 to 1, stagger 0.08, ease power3.out)
    paras.forEach((para) => {
      try {
        if (para._splitAnim) {
          para._splitAnim.kill();
        }
        if (para._splitInstance) {
          para._splitInstance.revert();
        }

        para.classList.add("visible");

        para._splitInstance = SplitText.create(para, {
          type: "lines",
          mask: "lines",
          autoSplit: true,
          onSplit(self: any) {
            const targets =
              self.lines && self.lines.length
                ? self.lines
                : [para];

            const anim = gsap.fromTo(
              targets,
              { yPercent: 100, opacity: 0 },
              {
                yPercent: 0,
                opacity: 1,
                duration: 0.9,
                ease: "power3.out",
                stagger: 0.08,
                clearProps: "opacity,transform",
                scrollTrigger: {
                  trigger:
                    para.closest(".about-section") ||
                    para.closest(".about-me") ||
                    para.parentElement ||
                    para,
                  start: TriggerStart,
                  toggleActions: ToggleActions,
                },
              }
            );
            para._splitAnim = anim;
            return anim;
          },
        });
      } catch (e) {
        console.warn("SplitText error on para:", e);
        gsap.set(para, { opacity: 1, visibility: "visible", clearProps: "opacity,visibility" });
      }
    });

    if (!isRefreshListenerAttached) {
      isRefreshListenerAttached = true;
      ScrollTrigger.addEventListener("refresh", () => {
        // Trigger positions refreshed
      });
    }
  } catch (err) {
    console.warn("setSplitText error:", err);
  }
}
