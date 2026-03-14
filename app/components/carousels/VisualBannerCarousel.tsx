import type { CarouselSlide } from "./types";

type Props = {
  slides: CarouselSlide[];
};

function renderSlideLink(slide: CarouselSlide) {
  const href = slide.buttonLink || "/blog";
  const label = slide.title || "Open slide";

  return (
    <a href={href} className="visual-slide-link" aria-label={label}>
      <img src={slide.imageUrl} alt={label} className="w-100 visual-banner-image" />
    </a>
  );
}

export function VisualBannerCarousel({ slides }: Props) {
  const carouselId = "visualBannerCarousel";

  return (
    <section className="showcase-block">
      <div id={carouselId} className="carousel slide carousel-fade" data-bs-ride="carousel">
        <div className="carousel-indicators banner-indicators">
          {slides.map((slide, index) => (
            <button
              key={slide._key || index}
              type="button"
              data-bs-target={`#${carouselId}`}
              data-bs-slide-to={index}
              className={index === 0 ? "active" : undefined}
              aria-current={index === 0 ? "true" : undefined}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        <div className="carousel-inner overflow-hidden rounded-5 shadow-lg">
          {slides.map((slide, index) => (
            <div key={slide._key || index} className={`carousel-item ${index === 0 ? "active" : ""}`}>
              {renderSlideLink(slide)}
            </div>
          ))}
        </div>

        <button
          className="carousel-control-prev banner-arrow"
          type="button"
          data-bs-target={`#${carouselId}`}
          data-bs-slide="prev"
        >
          <span className="carousel-control-prev-icon" aria-hidden="true" />
          <span className="visually-hidden">Previous</span>
        </button>
        <button
          className="carousel-control-next banner-arrow"
          type="button"
          data-bs-target={`#${carouselId}`}
          data-bs-slide="next"
        >
          <span className="carousel-control-next-icon" aria-hidden="true" />
          <span className="visually-hidden">Next</span>
        </button>
      </div>
    </section>
  );
}
