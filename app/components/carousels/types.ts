export type CarouselSlide = {
  _key?: string;
  title?: string;
  eyebrow?: string;
  description?: string;
  buttonLabel?: string;
  buttonLink?: string;
  imageUrl: string;
};

export type RailCard = {
  _key?: string;
  label: string;
  stars: number;
  imageUrl: string;
  link?: string;
};

export type HomeShowcase = {
  visualBannerSlides: CarouselSlide[];
  railCards: RailCard[];
  gallerySlides: CarouselSlide[];
  spotlightSlides: CarouselSlide[];
  captionSlides: CarouselSlide[];
};
