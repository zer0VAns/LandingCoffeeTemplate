import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const BASE_ROTATE = -2;

export function initLocationAnimations() {
  const section = document.querySelector<HTMLElement>("#ubicacion");
  if (!section) return;

  const subtitle = section.querySelector<HTMLElement>(".location-subtitle");
  const title = section.querySelector<HTMLElement>(".location-title");
  const map = section.querySelector<HTMLElement>(".location-map");
  const ticketSet = section.querySelector<HTMLElement>(".ticket-set");
  const waStub = section.querySelector<HTMLElement>(".wa-stub");
  const waIcon = waStub?.querySelector<SVGElement>("svg") ?? null;

  ScrollTrigger.getAll().forEach((trigger) => {
    if (trigger.trigger === section) trigger.kill();
  });

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const ctx = gsap.context(() => {
    if (reduceMotion) {
      gsap.set([subtitle, title, map, ticketSet, waStub], { clearProps: "all" });
      if (ticketSet) gsap.set(ticketSet, { rotate: BASE_ROTATE });
      return;
    }

    if (ticketSet) {
      gsap.set(ticketSet, {
        transformPerspective: 900,
        transformOrigin: "center center",
        rotate: BASE_ROTATE,
      });
    }

    const tl = gsap.timeline({
      defaults: { ease: "power4.out" },
      scrollTrigger: {
        trigger: section,
        start: "top 72%",
        once: true,
      },
    });

    if (subtitle) {
      gsap.set(subtitle, { clipPath: "inset(0 100% 0 0)" });
      tl.to(subtitle, { clipPath: "inset(0 0% 0 0)", duration: 0.6 }, 0);
    }

    if (title) {
      gsap.set(title, { clipPath: "inset(0 0 100% 0)" });
      tl.to(
        title,
        { clipPath: "inset(0 0 0% 0)", duration: 0.9, ease: "expo.out" },
        0.1
      );
    }

    if (map) {
      gsap.set(map, { clipPath: "inset(0 100% 0 0)", scale: 1.06 });
      tl.to(
        map,
        { clipPath: "inset(0 0% 0 0)", scale: 1, duration: 1.1, ease: "expo.out" },
        0.25
      );
    }

    if (ticketSet) {
      gsap.set(ticketSet, { clipPath: "inset(0 0 100% 0)", y: -14 });

      tl.to(
        ticketSet,
        { clipPath: "inset(0 0 0% 0)", duration: 0.5, ease: "steps(5)" },
        0.5
      ).to(
        ticketSet,
        { y: 0, duration: 0.5, ease: "back.out(1.8)" },
        "-=0.15"
      );
    }

    if (waStub) {
      gsap.set(waStub, { y: -6, autoAlpha: 0 });
      tl.to(waStub, { y: 0, autoAlpha: 1, duration: 0.4, ease: "power2.out" }, "-=0.1");
    }
  }, section);

  // --- Interacciones post-entrada ---

  if (ticketSet && !reduceMotion) {
    const rotX = gsap.quickTo(ticketSet, "rotationX", { duration: 0.6, ease: "power3" });
    const rotY = gsap.quickTo(ticketSet, "rotationY", { duration: 0.6, ease: "power3" });
    const lift = gsap.quickTo(ticketSet, "y", { duration: 0.6, ease: "power3" });

    ticketSet.addEventListener("mousemove", (e) => {
      const rect = ticketSet.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;

      rotY(px * 10);
      rotX(py * -10);
      lift(-4);
    });

    ticketSet.addEventListener("mouseleave", () => {
      rotX(0);
      rotY(0);
      lift(0);
    });
  }

  if (waStub && !reduceMotion) {
    const magX = gsap.quickTo(waStub, "x", { duration: 0.35, ease: "power3" });
    const magY = gsap.quickTo(waStub, "y", { duration: 0.35, ease: "power3" });
    const iconScale = waIcon
      ? gsap.quickTo(waIcon, "scale", { duration: 0.35, ease: "power3" })
      : null;

    waStub.addEventListener("mousemove", (e) => {
      const rect = waStub.getBoundingClientRect();
      const relX = e.clientX - (rect.left + rect.width / 2);
      const relY = e.clientY - (rect.top + rect.height / 2);
      magX(relX * 0.25);
      magY(relY * 0.25);
    });

    waStub.addEventListener("mouseenter", () => iconScale?.(1.15));

    waStub.addEventListener("mouseleave", () => {
      magX(0);
      magY(0);
      iconScale?.(1);
    });
  }

  window.addEventListener("load", () => ScrollTrigger.refresh(), { once: true });

  return () => ctx.revert();
}