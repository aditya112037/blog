import type { CarouselSlide, HomeShowcase, RailCard } from "./types";

export const fallbackHomeShowcase: HomeShowcase = {
  visualBannerSlides: [],
  railCards: [],
  gallerySlides: [],
  spotlightSlides: [],
  captionSlides: [],
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

  const normalized = slides.reduce<RailCard[]>((acc, slide) => {
      if (!slide || typeof slide !== "object") return acc;
      const item = slide as Record<string, unknown>;
      const candidateUrls = Array.isArray(item.images)
        ? item.images
            .map((image) => {
              if (!image || typeof image !== "object") return null;
              const media = image as Record<string, unknown>;
              return typeof media.imageUrl === "string" && media.imageUrl.length > 0 ? media.imageUrl : null;
            })
            .filter((imageUrl): imageUrl is string => imageUrl !== null)
        : [];

      if (
        typeof item.label !== "string" ||
        item.label.length === 0 ||
        candidateUrls.length === 0
      ) {
        return acc;
      }

      const label = item.label;

      candidateUrls.forEach((imageUrl, imageIndex) => {
        acc.push({
          _key:
            typeof item._key === "string"
              ? `${item._key}-${imageIndex}`
              : `${label}-${imageIndex}`,
          label,
          stars: typeof item.stars === "number" ? Math.max(1, Math.min(5, Math.round(item.stars))) : undefined,
          imageUrl,
          link: typeof item.link === "string" ? item.link : undefined,
        });
      });

      return acc;
    }, []);

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
