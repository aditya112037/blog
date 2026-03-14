import type { CarouselSlide, HomeShowcase, RailCard } from "./types";

export const fallbackHomeShowcase: HomeShowcase = {
  visualBannerSlides: [
    {
      _key: "visual-1",
      imageUrl:
        "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1600&q=80",
      buttonLink: "/blog",
    },
    {
      _key: "visual-2",
      imageUrl:
        "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1600&q=80",
      buttonLink: "/blog",
    },
    {
      _key: "visual-3",
      imageUrl:
        "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1600&q=80",
      buttonLink: "/blog",
    },
  ],
  railCards: [
    {
      _key: "rail-1",
      label: "Minimal desk story",
      stars: 5,
      imageUrl:
        "https://images.unsplash.com/photo-1496307042754-b4aa456c4a2d?auto=format&fit=crop&w=900&q=80",
      link: "/blog",
    },
    {
      _key: "rail-2",
      label: "Team moodboard",
      stars: 4,
      imageUrl:
        "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=900&q=80",
      link: "/blog",
    },
    {
      _key: "rail-3",
      label: "Studio corner",
      stars: 5,
      imageUrl:
        "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=900&q=80",
      link: "/blog",
    },
    {
      _key: "rail-4",
      label: "Workspace pulse",
      stars: 4,
      imageUrl:
        "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=80",
      link: "/blog",
    },
    {
      _key: "rail-5",
      label: "Late-night draft",
      stars: 5,
      imageUrl:
        "https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=900&q=80",
      link: "/blog",
    },
  ],
  gallerySlides: [
    {
      _key: "gallery-1",
      imageUrl:
        "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80",
      buttonLink: "/blog",
    },
    {
      _key: "gallery-2",
      imageUrl:
        "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&w=1600&q=80",
      buttonLink: "/blog",
    },
    {
      _key: "gallery-3",
      imageUrl:
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80",
      buttonLink: "/blog",
    },
  ],
  spotlightSlides: [
    {
      _key: "spotlight-1",
      eyebrow: "Spotlight",
      title: "Stories shaped like campaigns",
      description: "Use Sanity to manage the image, the supporting text, and where the button should send visitors.",
      buttonLabel: "Read more",
      buttonLink: "/blog",
      imageUrl:
        "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1600&q=80",
    },
    {
      _key: "spotlight-2",
      eyebrow: "Feature",
      title: "Images stay fixed even with mixed uploads",
      description: "Each slide frame uses a fixed height and cover fit so portrait and landscape uploads stay visually consistent.",
      buttonLabel: "Open blog",
      buttonLink: "/blog",
      imageUrl:
        "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1600&q=80",
    },
  ],
  captionSlides: [
    {
      _key: "caption-1",
      eyebrow: "Story frame",
      title: "City notes",
      description: "A softer caption strip that can be edited directly in Sanity.",
      buttonLabel: "Explore",
      buttonLink: "/blog",
      imageUrl:
        "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80",
    },
    {
      _key: "caption-2",
      eyebrow: "Story frame",
      title: "Field journal",
      description: "Use this section for captions, labels, and action buttons.",
      buttonLabel: "See posts",
      buttonLink: "/blog",
      imageUrl:
        "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&w=1600&q=80",
    },
  ],
};

function normalizeSlides(slides: unknown, fallback: HomeShowcase["visualBannerSlides"]) {
  if (!Array.isArray(slides) || slides.length === 0) return fallback;

  const normalized = slides
    .map((slide) => {
      if (!slide || typeof slide !== "object") return null;
      const item = slide as Record<string, unknown>;
      if (typeof item.imageUrl !== "string" || item.imageUrl.length === 0) return null;
      const normalizedSlide: CarouselSlide = {
        _key: typeof item._key === "string" ? item._key : undefined,
        title: typeof item.title === "string" ? item.title : undefined,
        eyebrow: typeof item.eyebrow === "string" ? item.eyebrow : undefined,
        description: typeof item.description === "string" ? item.description : undefined,
        buttonLabel: typeof item.buttonLabel === "string" ? item.buttonLabel : undefined,
        buttonLink: typeof item.buttonLink === "string" ? item.buttonLink : undefined,
        imageUrl: item.imageUrl,
      };
      return normalizedSlide;
    })
    .filter((slide): slide is CarouselSlide => slide !== null);

  return normalized.length > 0 ? normalized : fallback;
}

function normalizeRailCards(slides: unknown, fallback: HomeShowcase["railCards"]) {
  if (!Array.isArray(slides) || slides.length === 0) return fallback;

  const normalized = slides
    .map((slide) => {
      if (!slide || typeof slide !== "object") return null;
      const item = slide as Record<string, unknown>;
      if (
        typeof item.label !== "string" ||
        item.label.length === 0 ||
        typeof item.imageUrl !== "string" ||
        item.imageUrl.length === 0
      ) {
        return null;
      }

      const normalizedCard: RailCard = {
        _key: typeof item._key === "string" ? item._key : undefined,
        label: item.label,
        stars: typeof item.stars === "number" ? Math.max(1, Math.min(5, Math.round(item.stars))) : 5,
        imageUrl: item.imageUrl,
        link: typeof item.link === "string" ? item.link : undefined,
      };
      return normalizedCard;
    })
    .filter((slide): slide is RailCard => slide !== null);

  return normalized.length > 0 ? normalized : fallback;
}

export function normalizeHomeShowcase(showcase: unknown): HomeShowcase {
  if (!showcase || typeof showcase !== "object") {
    return fallbackHomeShowcase;
  }

  const item = showcase as Record<string, unknown>;

  return {
    visualBannerSlides: normalizeSlides(item.visualBannerSlides, fallbackHomeShowcase.visualBannerSlides),
    railCards: normalizeRailCards(item.railCards, fallbackHomeShowcase.railCards),
    gallerySlides: normalizeSlides(item.gallerySlides, fallbackHomeShowcase.gallerySlides),
    spotlightSlides: normalizeSlides(item.spotlightSlides, fallbackHomeShowcase.spotlightSlides),
    captionSlides: normalizeSlides(item.captionSlides, fallbackHomeShowcase.captionSlides),
  };
}
