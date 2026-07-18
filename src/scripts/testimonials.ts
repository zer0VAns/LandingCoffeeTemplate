  import gsap from 'gsap';
  import { ScrollTrigger } from 'gsap/ScrollTrigger';

  gsap.registerPlugin(ScrollTrigger);
export function initTestimonialsAnimations() {

  gsap.from('.testimonial-card', {
    y: 30,
    opacity: 0,
    duration: 0.8,
    ease: 'power3.out',
    stagger: 0.15,
    scrollTrigger: {
      trigger: '.testimonial-grid',
      start: 'top 80%',
      toggleActions: 'play none none reverse',
    },
  });

}