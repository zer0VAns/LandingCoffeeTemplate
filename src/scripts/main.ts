import { initMenuAnimations } from "./menu";
import { initLocationAnimations } from "./location";
import { initHeroAnimations } from "./hero";
import { initAboutAnimations } from "./about";
import { initCTAAnimations } from "./CTA";
import { initTestimonialsAnimations } from "./testimonials";
import { initGalleryAnimations } from "./gallery";



document.addEventListener("DOMContentLoaded", () => {

  initMenuAnimations();
  initLocationAnimations();
  initAboutAnimations();
  initHeroAnimations();
  initCTAAnimations();
  initTestimonialsAnimations();
  initGalleryAnimations();

});