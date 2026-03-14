import type { CarouselSlide } from "./types";

type Props = {
  slides: CarouselSlide[];
};

export function CaptionStoryCarousel({ slides }: Props) {
  const carouselId = "captionStoryCarousel";

  return (
    <section className="showcase-block">
      <div id={carouselId} className="carousel slide caption-story-carousel" data-bs-ride="carousel">
        <div className="carousel-indicators">
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
              <div className="caption-slide-shell">
                <img
                  src={slide.imageUrl}
                  alt={slide.title || "Caption slide"}
                  className="w-100 caption-fixed-image"
                />
                <div className="caption-card">
                  {slide.eyebrow ? (
                    <p className="text-uppercase small fw-semibold mb-2 text-light-emphasis">
                      {slide.eyebrow}
                    </p>
                  ) : null}
                  {slide.title ? <h3 className="h2 mb-2">{slide.title}</h3> : null}
                  {slide.description ? <p className="mb-3 text-secondary">{slide.description}</p> : null}
                  {slide.buttonLabel && slide.buttonLink ? (
                    <a href={slide.buttonLink} className="btn btn-outline-dark btn-sm rounded-pill px-3">
                      {slide.buttonLabel}
                    </a>
                  ) : null}
                </div>
              </div>
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
