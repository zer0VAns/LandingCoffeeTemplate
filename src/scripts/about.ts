import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function initAboutAnimations() {
  const section = document.querySelector<HTMLElement>("#sobre-nosotros");
  if (!section) return;

  const photoWrap = section.querySelector<HTMLElement>(".about-photo");
  const photoFrame = section.querySelector<HTMLElement>(".about-photo-frame");
  const photoImg =
    photoFrame?.querySelector<HTMLImageElement>("img") ?? null;

  const badge = section.querySelector<HTMLElement>(".about-badge");
  const heading = section.querySelector<HTMLElement>(".about-heading");
  const copies = gsap.utils.toArray<HTMLElement>(".about-copy", section);
  const stats = gsap.utils.toArray<HTMLElement>(".about-stat", section);
  const accent = section.querySelector<HTMLElement>(".about-stats-accent");

  if (
    !photoWrap ||
    !photoFrame ||
    !photoImg ||
    !badge ||
    !heading ||
    copies.length === 0
  ) {
    return;
  }

  ScrollTrigger.getAll().forEach((trigger) => {
    if (trigger.trigger === section) trigger.kill();
  });

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
            if (!chunk.trim()) {
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

    const headingWords = wrapWords(heading);

    if (reduceMotion) {
      if (accent) gsap.set(accent, { scaleX: 1 });
      return;
    }

    gsap.set(photoFrame, {
      clipPath: "inset(0 100% 0 0)",
    });

    gsap.set(photoWrap, {
      transformPerspective: 1000,
      transformStyle: "preserve-3d",
    });

    gsap.set(photoImg, {
      scale: 1.15,
      transformOrigin: "center center",
    });

    gsap.set(badge, {
      scale: 0,
      opacity: 0,
      rotate: -12,
      transformOrigin: "bottom right",
    });

    gsap.set(headingWords, {
      yPercent: 110,
    });

    gsap.set(copies, {
      opacity: 0,
      y: 24,
    });

    if (accent) {
      gsap.set(accent, {
        scaleX: 0,
        transformOrigin: "left center",
      });
    }

    const tl = gsap.timeline({
      defaults: {
        ease: "expo.out",
      },

      scrollTrigger: {
        trigger: section,
        start: "top 70%",
        once: true,
      },
    });

    tl.to(
      photoFrame,
      {
        clipPath: "inset(0 0% 0 0)",
        duration: 1.1,
      },
      0
    )

      .to(
        photoImg,
        {
          scale: 1,
          duration: 1.3,
          ease: "power3.out",
        },
        0
      )

      .to(
        headingWords,
        {
          yPercent: 0,
          duration: 0.8,
          stagger: 0.05,
        },
        0.35
      )

      .to(
        copies,
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.15,
          ease: "power3.out",
        },
        0.55
      )

      .to(
        badge,
        {
          scale: 1,
          opacity: 1,
          rotate: 0,
          duration: 0.6,
          ease: "back.out(1.8)",
        },
        0.75
      );

    if (accent) {
      tl.to(
        accent,
        {
          scaleX: 1,
          duration: 0.8,
          ease: "power3.out",
        },
        0.95
      );
    }

    stats.forEach((stat, i) => {
      const value = stat.querySelector<HTMLElement>(".about-stat-value");

      if (!value) return;

      const original = value.textContent?.trim() ?? "";

      const match = original.match(/^([\d.]+)(.*)$/);

      if (!match) return;

      const target = Number(match[1]);

      const suffix = match[2];

      const counter = {
        value: 0,
      };

      value.textContent = `0${suffix}`;

      tl.to(
        counter,
        {
          value: target,
          duration: 1,

          ease: "power2.out",

          onUpdate() {
            value.textContent =
              Math.round(counter.value).toString() + suffix;
          },
        },
        1 + i * 0.12
      );
    });
  }, section);

  window.addEventListener(
    "load",
    () => ScrollTrigger.refresh(),
    { once: true }
  );

  return () => ctx.revert();
}