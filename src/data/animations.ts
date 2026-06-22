export interface AnimationItem {
  id: string;
  name: string;
  componentName: string;
  route: string;
  bgColor: string;
  textColor: string;
  description: string;
  tiltClass: string;
}

export const animations: AnimationItem[] = [
  {
    id: "01",
    name: "Flip Cards",
    componentName: "FlipCards",
    route: "/components/FlipCards",
    bgColor: "bg-wtf-green",
    textColor: "text-white",
    description:
      "Interactive fanning cards and scroll-pinned cards flipping in 3D perspective space.",
    tiltClass: "tilt-left",
  },
  {
    id: "02",
    name: "3D Carousel",
    componentName: "Carousel3D",
    route: "/components/Carousel3D",
    bgColor: "bg-wtf-yellow",
    textColor: "text-black",
    description:
      "Interactive 3D mathematical wheel rotation with pointer drag inertia, keyboard navigation, and GSAP details panel expansion.",
    tiltClass: "tilt-left-lg",
  },
  {
    id: "03",
    name: "Skill Fit",
    componentName: "SkillFit",
    route: "/components/SkillFit",
    bgColor: "bg-wtf-green",
    textColor: "text-white",
    description:
      "Premium candidate profile showcase animation with vertical ScrollTrigger pinning and technology staggers.",
    tiltClass: "tilt-left",
  },
  {
    id: "04",
    name: "Page Transition",
    componentName: "PageTransition",
    route: "/components/PageTransition",
    bgColor: "bg-wtf-yellow",
    textColor: "text-black",
    description:
      "Premium stacked page-peel scroll animation where color-themed sections slide up and overlap with dynamic skewing.",
    tiltClass: "tilt-right",
  },
  {
    id: "05",
    name: "Horizontal Cards",
    componentName: "HorizontalCards",
    route: "/components/HorizontalCards",
    bgColor: "bg-wtf-blue",
    textColor: "text-white",
    description:
      "Premium horizontal scroll layout where colorful Neo-Brutalist cards slide, float, enter from the bottom, and exit off the top of the viewport.",
    tiltClass: "tilt-left-lg",
  },
  {
    id: "06",
    name: "Circular Scatter",
    componentName: "CircularScatter",
    route: "/components/CircularScatter",
    bgColor: "bg-wtf-orange",
    textColor: "text-white",
    description:
      "Circular loop scatter animation where cards stack one-by-one at screen center, then scatter to the outer edges with hero text centered.",
    tiltClass: "tilt-right",
  },
  {
    id: "07",
    name: "Fluid Cursor",
    componentName: "FluidCursor",
    route: "/components/FluidCursor",
    bgColor: "bg-wtf-purple",
    textColor: "text-white",
    description:
      "Custom elastic lagging cursor reticle that snaps, morphs, and hugs button boundaries.",
    tiltClass: "tilt-left",
  },
  {
    id: "08",
    name: "Blueprint",
    componentName: "Blueprint",
    route: "/components/Blueprint",
    bgColor: "bg-wtf-purple",
    textColor: "text-white",
    description:
      "Premium page-load exploding cards and text scramble animation matching the layout of blueprintapps.io.",
    tiltClass: "tilt-left",
  },
  {
    id: "09",
    name: "Scroll Cards",
    componentName: "ScrollCards",
    route: "/components/ScrollCards",
    bgColor: "bg-wtf-orange",
    textColor: "text-white",
    description:
      "Vertical scroll-pinned stacked cards container utilizing y-transform parallax staggers.",
    tiltClass: "tilt-right",
  },
  {
    id: "10",
    name: "Scroll Tags",
    componentName: "ScrollTags",
    route: "/components/ScrollTags",
    bgColor: "bg-wtf-green",
    textColor: "text-white",
    description:
      "Interactive scroll-triggered tags that fly into a grid board container from all offscreen directions.",
    tiltClass: "tilt-left",
  },
  {
    id: "11",
    name: "Orbit Gallery",
    componentName: "OrbitGallery",
    route: "/components/OrbitGallery",
    bgColor: "bg-wtf-blue",
    textColor: "text-white",
    description:
      "Premium scroll-driven layout where orbiting abstract cards converge into a sleek horizontal timeline.",
    tiltClass: "tilt-right",
  },
  {
    id: "12",
    name: "Gravity Drop",
    componentName: "GravityDrop",
    route: "/components/GravityDrop",
    bgColor: "bg-wtf-orange",
    textColor: "text-white",
    description:
      "Staggered letters falling down onto a shelf collider with realistic physics bounce.",
    tiltClass: "tilt-right",
  },
  {
    id: "13",
    name: "String Line",
    componentName: "StringLine",
    route: "/components/StringLine",
    bgColor: "bg-wtf-yellow",
    textColor: "text-black",
    description:
      "ScrollTriggered SVG network line drawing tracking node proximity scale offsets.",
    tiltClass: "tilt-right",
  },
  {
    id: "14",
    name: "Border Reveal",
    componentName: "BorderReveal",
    route: "/components/BorderReveal",
    bgColor: "bg-wtf-red",
    textColor: "text-white",
    description:
      "Premium horizontal text scroll where letters fly in and out from top/bottom screen borders.",
    tiltClass: "tilt-right-lg",
  },
  {
    id: "15",
    name: "Kinetic Text",
    componentName: "KineticText",
    route: "/components/KineticText",
    bgColor: "bg-wtf-purple",
    textColor: "text-white",
    description:
      "Interactive kinetic text sandbox showcasing liquid wave, character scramble, and magnetic motion.",
    tiltClass: "tilt-left",
  },
  {
    id: "16",
    name: "Magnetic Dock",
    componentName: "MagneticDock",
    route: "/components/MagneticDock",
    bgColor: "bg-wtf-orange",
    textColor: "text-white",
    description:
      "Premium floating menu bar where buttons pull dynamically toward the user's cursor.",
    tiltClass: "tilt-right",
  },
  {
    id: "17",
    name: "Bento Grid",
    componentName: "BentoGrid",
    route: "/components/BentoGrid",
    bgColor: "bg-wtf-green",
    textColor: "text-white",
    description:
      "Neo-Brutalist bento box card grid with 3D perspective mouse tilt, spring physics recovery, and vector crosshairs.",
    tiltClass: "tilt-right-lg",
  },
  {
    id: "18",
    name: "Accordion",
    componentName: "Accordion",
    route: "/components/Accordion",
    bgColor: "bg-wtf-blue",
    textColor: "text-white",
    description:
      "Vertical accordion showcase where selection morphs page background color and staggers content.",
    tiltClass: "tilt-right",
  },
  {
    id: "19",
    name: "Reveal Text",
    componentName: "RevealText",
    route: "/components/RevealText",
    bgColor: "bg-wtf-purple",
    textColor: "text-white",
    description:
      "Premium line-by-line text reveal using SplitText masks with staggered choreography.",
    tiltClass: "tilt-left",
  },

  {
    id: "20",
    name: "Tabs Motion",
    componentName: "TabsMotion",
    route: "/components/TabsMotion",
    bgColor: "bg-wtf-green",
    textColor: "text-white",
    description:
      "Animated tab navigation with sliding indicator pill and directional content crossfade transitions.",
    tiltClass: "tilt-left",
  },

  {
    id: "21",
    name: "Parallax Hero",
    componentName: "ParallaxHero",
    route: "/components/ParallaxHero",
    bgColor: "bg-wtf-orange",
    textColor: "text-white",
    description:
      "Multi-layer parallax hero with SplitText character scatter entrance and scroll-driven depth motion.",
    tiltClass: "tilt-left",
  },

  {
    id: "22",
    name: "Morphing Text",
    componentName: "MorphingText",
    route: "/components/MorphingText",
    bgColor: "bg-wtf-purple",
    textColor: "text-white",
    description:
      "Smooth auto-cycling text morphing animation with SVG threshold filter and color-coded word transitions.",
    tiltClass: "tilt-right",
  },
];
