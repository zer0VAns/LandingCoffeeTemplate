  import gsap from 'gsap';
  import { ScrollTrigger } from 'gsap/ScrollTrigger';

  gsap.registerPlugin(ScrollTrigger);
export function initCTAAnimations() {
  gsap.from('.cta-box', {
    scale: 0.85,
    opacity: 0,
    duration: 0.8,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '.cta-section',
      start: 'top 75%',
      toggleActions: 'play none none reverse',
    },
  });}
