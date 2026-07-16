import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function initHeroAnimations() {
  const hero = document.querySelector<HTMLElement>("#inicio");
  if (!hero) return;

  const bg = hero.querySelector<HTMLElement>("#hero-bg");
  const img = bg?.querySelector<HTMLImageElement>("img") ?? null;
  const overlay = bg?.querySelector<HTMLElement>("div") ?? null;
  const curtain = hero.querySelector<HTMLElement>("#hero-curtain");
  const eyebrow = hero.querySelector<HTMLElement>("#hero-eyebrow");
  const title = hero.querySelector<HTMLElement>("#hero-title");
  const buttons = gsap.utils.toArray<HTMLAnchorElement>("#hero-cta a");

  if (!bg || !img || !overlay || !eyebrow || !title || buttons.length === 0) return;

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const ctx = gsap.context(() => {
    const wrapWords = (el: HTMLElement) => {
      const nodes = Array.from(el.childNodes);
      el.innerHTML = "";
      const words: HTMLElement[] = [];

      nodes.forEach((node) => {
        if (node.nodeType === Node.TEXT_NODE) {
          const parts = (node.textContent ?? "").split(/(\s+)/);
          parts.forEach((chunk) => {
            if (chunk.trim() === "") {
              el.appendChild(document.createTextNode(chunk));
              return;
            }
            const mask = document.createElement("span");
            mask.style.display = "inline-block";
            mask.style.overflow = "hidden";
            mask.style.verticalAlign = "top";

            const inner = document.createElement("span");
            inner.style.display = "inline-block";
            inner.textContent = chunk;

            mask.appendChild(inner);
            el.appendChild(mask);
            words.push(inner);
          });
        } else {
          el.appendChild(node); 
        }
      });

      return words;
    };

    const titleWords = wrapWords(title);
    const eyebrowWords = wrapWords(eyebrow);

    if (reduceMotion) {
      gsap.set([...titleWords, ...eyebrowWords, ...buttons], { clearProps: "all" });
      gsap.set(overlay, { opacity: 1 });
      gsap.set(img, { scale: 1 });
      if (curtain) gsap.set(curtain, { display: "none" });
      return;
    }

    gsap.set(img, { scale: 1.18, transformOrigin: "center center" });
    gsap.set(overlay, { opacity: 0.82 });
    gsap.set(titleWords, { yPercent: 110 });
    gsap.set(eyebrowWords, { yPercent: 110 });
    gsap.set(buttons, { opacity: 0, y: 16 });
    if (curtain) gsap.set(curtain, { scaleY: 1, transformOrigin: "bottom" });

    const tl = gsap.timeline({ defaults: { ease: "expo.out" } });

    if (curtain) {
      tl.to(
        curtain,
        {
          scaleY: 0,
          duration: 1,
          ease: "expo.inOut",
          onComplete: () => {
            curtain.style.pointerEvents = "none";
          },
        },
        0
      );
    }

    tl.to(overlay, { opacity: 1, duration: 1.4, ease: "power2.out" }, curtain ? 0.2 : 0)
      .to(
        eyebrowWords,
        { yPercent: 0, duration: 0.7, stagger: 0.04 },
        curtain ? 0.5 : 0.15
      )
      .to(
        titleWords,
        { yPercent: 0, duration: 0.9, stagger: 0.05 },
        curtain ? 0.6 : 0.3
      )
      .to(
        buttons,
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: "power3.out" },
        curtain ? 1.1 : 0.75
      );

    gsap.to(bg, {
      yPercent: 12,
      ease: "none",
      scrollTrigger: {
        trigger: hero,
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    });

    buttons.forEach((button) => {
      const magX = gsap.quickTo(button, "x", { duration: 0.3, ease: "power3" });
      const magY = gsap.quickTo(button, "y", { duration: 0.3, ease: "power3" });

      button.addEventListener("mousemove", (e) => {
        const rect = button.getBoundingClientRect();
        const relX = e.clientX - (rect.left + rect.width / 2);
        const relY = e.clientY - (rect.top + rect.height / 2);
        magX(relX * 0.3);
        magY(relY * 0.3 - 2);
      });

      button.addEventListener("mouseleave", () => {
        magX(0);
        magY(0);
      });
    });
  }, hero);

  window.addEventListener("load", () => ScrollTrigger.refresh(), { once: true });

  return () => ctx.revert();
}