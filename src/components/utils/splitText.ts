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

    if (window.innerWidth < 900) {
      // On mobile, revert any split and ensure text is immediately visible
      paras.forEach((para) => {
        if (para._splitAnim) para._splitAnim.kill();
        if (para._splitInstance) para._splitInstance.revert();
        gsap.set(para, { opacity: 1, visibility: "visible", y: 0, clearProps: "all" });
      });
      titles.forEach((title) => {
        if (title._splitAnim) title._splitAnim.kill();
        if (title._splitInstance) title._splitInstance.revert();
        gsap.set(title, { opacity: 1, visibility: "visible", y: 0, clearProps: "all" });
      });
      return;
    }

    const TriggerStart = window.innerWidth <= 1024 ? "top 80%" : "top 75%";

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
          type: "words,lines",
          mask: "lines",
          autoSplit: true,
          onSplit(self: any) {
            const targets =
              self.lines && self.lines.length
                ? self.lines
                : self.words && self.words.length
                ? self.words
                : [para];

            const anim = gsap.from(targets, {
              scrollTrigger: {
                trigger:
                  para.closest(".about-section") || para.parentElement || para,
                start: TriggerStart,
                toggleActions: "play pause resume none",
              },
              opacity: 0,
              y: 50,
              duration: 1,
              ease: "power3.out",
              stagger: 0.04,
              clearProps: "opacity",
              onComplete: () => {
                gsap.set(targets, {
                  opacity: 1,
                  visibility: "visible",
                  clearProps: "opacity,visibility",
                });
              },
            });
            para._splitAnim = anim;
            return anim;
          },
        });
      } catch (e) {
        console.warn("SplitText error on para:", e);
        gsap.set(para, { opacity: 1, visibility: "visible", clearProps: "opacity,visibility" });
      }
    });

    titles.forEach((title) => {
      try {
        if (title._splitAnim) {
          title._splitAnim.kill();
        }
        if (title._splitInstance) {
          title._splitInstance.revert();
        }

        title._splitInstance = SplitText.create(title, {
          type: "chars,lines",
          mask: "lines",
          autoSplit: true,
          onSplit(self: any) {
            const targets =
              self.chars && self.chars.length
                ? self.chars
                : self.lines && self.lines.length
                ? self.lines
                : [title];

            const anim = gsap.from(targets, {
              scrollTrigger: {
                trigger:
                  title.closest(".about-section") ||
                  title.closest(".whatIDO") ||
                  title.parentElement ||
                  title,
                start: TriggerStart,
                toggleActions: "play pause resume none",
              },
              opacity: 0,
              y: 40,
              duration: 0.8,
              ease: "power2.out",
              stagger: 0.02,
              clearProps: "opacity",
              onComplete: () => {
                gsap.set(targets, {
                  opacity: 1,
                  visibility: "visible",
                  clearProps: "opacity,visibility",
                });
              },
            });
            title._splitAnim = anim;
            return anim;
          },
        });
      } catch (e) {
        console.warn("SplitText error on title:", e);
        gsap.set(title, { opacity: 1, visibility: "visible", clearProps: "opacity,visibility" });
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
