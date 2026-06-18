export interface AnimationItem {
  id: string;
  name: string;
  route: string;
  bgColor: string;
  textColor: string;
  description: string;
  tiltClass: string;
}

export const animations: AnimationItem[] = [
  {
    id: "01",
    name: "Gravity Drop",
    route: "/01-gravity-drop",
    bgColor: "bg-wtf-orange",
    textColor: "text-white",
    description:
      "Staggered letters falling down onto a shelf collider with realistic physics bounce.",
    tiltClass: "tilt-right",
  },
  {
    id: "02",
    name: "Scroll Tags",
    route: "/02-scroll-tags-assembly",
    bgColor: "bg-wtf-green",
    textColor: "text-white",
    description:
      "Interactive scroll-triggered tags that fly into a grid board container from all offscreen directions.",
    tiltClass: "tilt-left",
  },
  {
    id: "03",
    name: "Border Reveal",
    route: "/03-inward-outward-border-reveal",
    bgColor: "bg-wtf-red",
    textColor: "text-white",
    description:
      "Premium horizontal text scroll where letters fly in and out from top/bottom screen borders.",
    tiltClass: "tilt-right-lg",
  },
  {
    id: "04",
    name: "Horizontal Cards",
    route: "/04-horizontal-cards-showcase",
    bgColor: "bg-wtf-blue",
    textColor: "text-white",
    description:
      "Premium horizontal scroll layout where colorful Neo-Brutalist cards slide, float, enter from the bottom, and exit off the top of the viewport.",
    tiltClass: "tilt-left-lg",
  },
  {
    id: "05",
    name: "Page Transition",
    route: "/05-page-change-animation",
    bgColor: "bg-wtf-yellow",
    textColor: "text-black",
    description:
      "Premium stacked page-peel scroll animation where color-themed sections slide up and overlap with dynamic skewing.",
    tiltClass: "tilt-right",
  },
  {
    id: "06",
    name: "Kinetic Text",
    route: "/06-kinetic-typography",
    bgColor: "bg-wtf-purple",
    textColor: "text-white",
    description:
      "Interactive kinetic text sandbox showcasing liquid wave, character scramble, and magnetic motion.",
    tiltClass: "tilt-left",
  },
  {
    id: "07",
    name: "Orbit Gallery",
    route: "/07-scroll-orbit-gallery",
    bgColor: "bg-wtf-blue",
    textColor: "text-white",
    description:
      "Premium scroll-driven layout where orbiting abstract cards converge into a sleek horizontal timeline.",
    tiltClass: "tilt-right",
  },
  {
    id: "08",
    name: "Blueprint",
    route: "/08-blueprint-scatter",
    bgColor: "bg-wtf-purple",
    textColor: "text-white",
    description:
      "Premium page-load exploding cards and text scramble animation matching the layout of blueprintapps.io.",
    tiltClass: "tilt-left",
  },
  {
    id: "09",
    name: "Circular Scatter",
    route: "/09-circular-scatter",
    bgColor: "bg-wtf-orange",
    textColor: "text-white",
    description:
      "Circular loop scatter animation where cards stack one-by-one at screen center, then scatter to the outer edges with hero text centered.",
    tiltClass: "tilt-right",
  },
  {
    id: "10",
    name: "Skill Fit",
    route: "/10-screen-skill-fit",
    bgColor: "bg-wtf-green",
    textColor: "text-white",
    description:
      "Premium candidate profile showcase animation with vertical ScrollTrigger pinning and technology staggers.",
    tiltClass: "tilt-left",
  },
  {
    id: "11",
    name: "Magnetic Dock",
    route: "/11-magnetic-dock",
    bgColor: "bg-wtf-orange",
    textColor: "text-white",
    description:
      "Premium floating menu bar where buttons pull dynamically toward the user's cursor.",
    tiltClass: "tilt-right",
  },
  {
    id: "12",
    name: "Fluid Cursor",
    route: "/12-fluid-cursor",
    bgColor: "bg-wtf-purple",
    textColor: "text-white",
    description:
      "Custom elastic lagging cursor reticle that snaps, morphs, and hugs button boundaries.",
    tiltClass: "tilt-left",
  },
  {
    id: "13",
    name: "Bento Grid",
    route: "/13-bento-grid-flip",
    bgColor: "bg-wtf-green",
    textColor: "text-white",
    description:
      "Neo-Brutalist bento box card grid with 3D perspective mouse tilt, spring physics recovery, and vector crosshairs.",
    tiltClass: "tilt-right-lg",
  },
  {
    id: "14",
    name: "3D Carousel",
    route: "/14-3d-carousel",
    bgColor: "bg-wtf-yellow",
    textColor: "text-black",
    description:
      "Interactive 3D mathematical wheel rotation with pointer drag inertia, keyboard navigation, and GSAP details panel expansion.",
    tiltClass: "tilt-left-lg",
  },
  {
    id: "15",
    name: "Accordion",
    route: "/15-morphing-accordion",
    bgColor: "bg-wtf-blue",
    textColor: "text-white",
    description:
      "Vertical accordion showcase where selection morphs page background color and staggers content.",
    tiltClass: "tilt-right",
  },
  {
    id: "16",
    name: "Scroll Cards",
    route: "/16-scroll-cards-01",
    bgColor: "bg-wtf-orange",
    textColor: "text-white",
    description:
      "Vertical scroll-pinned stacked cards container utilizing y-transform parallax staggers.",
    tiltClass: "tilt-right",
  },

  {
    id: "17",
    name: "Flip Cards",
    route: "/17-showup-cards",
    bgColor: "bg-wtf-green",
    textColor: "text-white",
    description:
      "Interactive fanning cards and scroll-pinned cards flipping in 3D perspective space.",
    tiltClass: "tilt-left",
  },
  {
    id: "18",
    name: "String Line",
    route: "/18-string-line",
    bgColor: "bg-wtf-yellow",
    textColor: "text-black",
    description:
      "ScrollTriggered SVG network line drawing tracking node proximity scale offsets.",
    tiltClass: "tilt-right",
  },
];
