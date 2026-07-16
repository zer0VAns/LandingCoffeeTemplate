import { initMenuAnimations } from "./menu";
import { initLocationAnimations } from "./location";
import { initHeroAnimations } from "./hero";

document.addEventListener("DOMContentLoaded", () => {
  initMenuAnimations();
  initLocationAnimations();
  initHeroAnimations();
});