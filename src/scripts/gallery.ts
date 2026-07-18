  import gsap from 'gsap';
  import { ScrollTrigger } from 'gsap/ScrollTrigger';

  gsap.registerPlugin(ScrollTrigger);
export function initGalleryAnimations() {
  gsap.from('.gallery-item', {
    scale: 0.85,
    opacity: 0,
    duration: 0.8,
    ease: 'power3.out',
    stagger: 0.08,
    scrollTrigger: {
      trigger: '.gallery-grid',
      start: 'top 80%',
      toggleActions: 'play none none reverse',
    },
  });}