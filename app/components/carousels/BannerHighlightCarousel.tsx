import { Link } from "react-router";

import type { CarouselSlide } from "./types";

type Props = {
  slides: CarouselSlide[];
};

export function BannerHighlightCarousel({ slides }: Props) {
  const carouselId = "bannerHighlightCarousel";

  return (
    <section className="showcase-block">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <p className="section-kicker mb-1">Carousel one</p>
          <h2 className="section-title mb-0">Editable banner showcase</h2>
        </div>
        <Link className="btn btn-outline-dark btn-sm rounded-pill px-3" to="/blog">
          Browse blog
        </Link>
      </div>

      <div
        id={carouselId}
        className="carousel slide carousel-fade banner-highlight-carousel"
        data-bs-ride="carousel"
      >
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
            <div
              key={slide._key || index}
              className={`carousel-item ${index === 0 ? "active" : ""}`}
              data-bs-interval="5000"
            >
              <div className="row g-0 banner-slide">
                <div className="col-lg-8">
                  <div className="banner-image-shell">
                    <img
                      src={slide.imageUrl}
                      alt={slide.title || "Banner slide"}
                      className="w-100 banner-fixed-image"
                    />
                  </div>
                </div>
                <div className="col-lg-4">
                  <div className="banner-copy-panel">
                    <span className="accent-chip">{slide.eyebrow || "Featured"}</span>
                    {slide.eyebrow ? (
                      <p className="text-uppercase small fw-semibold text-secondary mb-2">{slide.eyebrow}</p>
                    ) : null}
                    <h3 className="display-6 fw-semibold lh-sm mb-3">
                      {slide.title || "Update this banner from Sanity"}
                    </h3>
                    <p className="text-secondary mb-4">
                      {slide.description ||
                        "Use Home Showcase in Sanity to control the image, title, text, and button for this banner."}
                    </p>
                    <Link className="btn btn-dark rounded-pill px-4" to={slide.buttonLink || "/blog"}>
                      {slide.buttonLabel || "Read more"}
                    </Link>
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
