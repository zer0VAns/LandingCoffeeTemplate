import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function initMenuAnimations() {
  const section = document.querySelector<HTMLElement>("#menu");

  if (!section) return;

  ScrollTrigger.getAll().forEach((trigger) => {
    if (trigger.trigger === section) {
      trigger.kill();
    }
  });

  const ctx = gsap.context(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top 90%",
        once: true, 
      },
    });

    tl.from(".menu-subtitle", {
      opacity: 0,
      y: 20,
      duration: 0.5,
    })
      .from(
        ".menu-title",
        {
          opacity: 0,
          y: 40,
          duration: 0.8,
          ease: "power3.out",
        },
        "-=0.2"
      )
      .from(
        ".menu-description",
        {
          opacity: 0,
          y: 20,
          duration: 0.6,
        },
        "-=0.3"
      )
      .from(
        ".menu-card",
        {
          opacity: 0,
          y: 35,
          scale: 0.96,
          duration: 0.5,
          stagger: 0.08,
          ease: "power2.out",
          clearProps: "opacity,transform",
        },
        "-=0.2"
      )
      .from(
        ".menu-button",
        {
          opacity: 0,
          y: 20,
          duration: 0.5,
          clearProps: "opacity,transform",
        },
        "-=0.2"
      );


    section.querySelectorAll<HTMLElement>(".menu-card").forEach((card) => {
      const icon = card.querySelector(".menu-icon");
      const title = card.querySelector(".menu-name");
      const price = card.querySelector(".menu-price");

      card.addEventListener("mouseenter", () => {
        gsap.to(card, {
          y: -10,
          scale: 1.03,
          duration: 0.3,
          overwrite: "auto",
        });

        if (icon) {
          gsap.to(icon, {
            scale: 1.2,
            rotate: 8,
            duration: 0.3,
            overwrite: "auto",
          });
        }

        if (title) {
          gsap.to(title, {
            color: "#A67C52",
            duration: 0.2,
          });
        }

        if (price) {
          gsap.fromTo(
            price,
            { scale: 1 },
            {
              scale: 1.15,
              duration: 0.25,
              repeat: 1,
              yoyo: true,
            }
          );
        }
      });

      card.addEventListener("mouseleave", () => {
        gsap.to(card, {
          y: 0,
          scale: 1,
          duration: 0.3,
          overwrite: "auto",
        });

        if (icon) {
          gsap.to(icon, {
            scale: 1,
            rotate: 0,
            duration: 0.3,
            overwrite: "auto",
          });
        }

        if (title) {
          gsap.to(title, {
            color: "",
            duration: 0.2,
          });
        }
      });
    });

    gsap.to(".menu-icon", {
      y: -5,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      duration: 2,
      stagger: 0.2,
    });
  }, section);

  ScrollTrigger.refresh();

  return () => ctx.revert();
}