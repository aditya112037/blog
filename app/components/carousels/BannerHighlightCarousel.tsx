import { Link } from "react-router";

type BannerSlide = {
  id: number;
  image: string;
  eyebrow: string;
  title: string;
  copy: string;
  accent: string;
};

const slides: BannerSlide[] = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1600&q=80",
    eyebrow: "Editor pick",
    title: "Stories shaped like launch campaigns",
    copy:
      "Bold layouts, clean reading paths, and a feature panel that keeps the headline visible while the image fills the frame.",
    accent: "Launch",
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1600&q=80",
    eyebrow: "Fresh drop",
    title: "Creative banners with consistent image framing",
    copy:
      "Every slide uses a fixed media window, so wide or tall uploads stay aligned instead of breaking the banner rhythm.",
    accent: "Feature",
  },
  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1600&q=80",
    eyebrow: "New format",
    title: "Read-more promos built into the carousel",
    copy:
      "The highlighted side column gives each slide a strong CTA without hiding the image under a heavy full-width overlay.",
    accent: "Read",
  },
];

export function BannerHighlightCarousel() {
  const carouselId = "bannerHighlightCarousel";

  return (
    <section className="showcase-block">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <p className="section-kicker mb-1">Carousel one</p>
          <h2 className="section-title mb-0">Banner with highlight column</h2>
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
              key={slide.id}
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
              key={slide.id}
              className={`carousel-item ${index === 0 ? "active" : ""}`}
              data-bs-interval="5000"
            >
              <div className="row g-0 banner-slide">
                <div className="col-lg-8">
                  <div className="banner-image-shell">
                    <img
                      src={slide.image}
                      alt={slide.title}
                      className="w-100 banner-fixed-image"
                    />
                  </div>
                </div>
                <div className="col-lg-4">
                  <div className="banner-copy-panel">
                    <span className="accent-chip">{slide.accent}</span>
                    <p className="text-uppercase small fw-semibold text-secondary mb-2">
                      {slide.eyebrow}
                    </p>
                    <h3 className="display-6 fw-semibold lh-sm mb-3">{slide.title}</h3>
                    <p className="text-secondary mb-4">{slide.copy}</p>
                    <Link className="btn btn-dark rounded-pill px-4" to="/blog">
                      Read more
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
