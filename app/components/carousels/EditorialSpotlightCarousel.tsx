import type { CarouselSlide } from "./types";

type Props = {
  slides: CarouselSlide[];
};

export function EditorialSpotlightCarousel({ slides }: Props) {
  const carouselId = "editorialSpotlightCarousel";

  return (
    <section className="showcase-block">
      <div id={carouselId} className="carousel slide" data-bs-ride="carousel">
        <div className="carousel-indicators banner-indicators">
          {slides.map((slide, index) => (
            <button
              key={slide._key || index}
              type="button"
              data-bs-target={`#${carouselId}`}
              data-bs-slide-to={index}
              className={index === 0 ? "active" : undefined}
              aria-current={index === 0 ? "true" : undefined}
              aria-label={`Go to spotlight ${index + 1}`}
            />
          ))}
        </div>

        <div className="carousel-inner overflow-hidden rounded-5 shadow-lg">
          {slides.map((slide, index) => (
            <div key={slide._key || index} className={`carousel-item ${index === 0 ? "active" : ""}`}>
              <div className="row g-0 spotlight-slide">
                <div className="col-lg-7">
                  <img src={slide.imageUrl} alt={slide.title || "Spotlight slide"} className="w-100 spotlight-image" />
                </div>
                <div className="col-lg-5">
                  <div className="spotlight-copy">
                    {slide.eyebrow ? (
                      <p className="section-kicker mb-2">{slide.eyebrow}</p>
                    ) : null}
                    {slide.title ? <h2 className="section-title mb-3">{slide.title}</h2> : null}
                    {slide.description ? <p className="text-secondary mb-4">{slide.description}</p> : null}
                    {slide.buttonLabel && slide.buttonLink ? (
                      <a href={slide.buttonLink} className="btn btn-dark rounded-pill px-4">
                        {slide.buttonLabel}
                      </a>
                    ) : null}
                  </div>
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
