import type { CarouselSlide } from "./types";

type Props = {
  slides: CarouselSlide[];
};

function chunkSlides(slides: CarouselSlide[]) {
  const groups: CarouselSlide[][] = [];
  for (let index = 0; index < slides.length; index += 3) {
    groups.push(slides.slice(index, index + 3));
  }
  return groups;
}

function renderTile(slide: CarouselSlide, index: number) {
  const href = slide.buttonLink || "/blog";
  const label = slide.title || `Gallery slide ${index + 1}`;
  const tileClass = index === 0 ? "gallery-tile gallery-tile-large" : "gallery-tile";

  return (
    <a href={href} className={tileClass} key={slide._key || `${label}-${index}`} aria-label={label}>
      <img src={slide.imageUrl} alt={label} className="gallery-tile-image" />
    </a>
  );
}

export function GalleryMosaicCarousel({ slides }: Props) {
  const carouselId = "galleryMosaicCarousel";
  const groups = chunkSlides(slides.length >= 3 ? slides : [...slides, ...slides, ...slides].slice(0, 3));

  return (
    <section className="showcase-block">
      <div id={carouselId} className="carousel slide" data-bs-ride="carousel">
        <div className="carousel-indicators banner-indicators">
          {groups.map((group, index) => (
            <button
              key={`${group[0]?._key || index}`}
              type="button"
              data-bs-target={`#${carouselId}`}
              data-bs-slide-to={index}
              className={index === 0 ? "active" : undefined}
              aria-current={index === 0 ? "true" : undefined}
              aria-label={`Go to gallery ${index + 1}`}
            />
          ))}
        </div>

        <div className="carousel-inner overflow-hidden rounded-5 shadow-lg">
          {groups.map((group, index) => (
            <div key={group[0]?._key || index} className={`carousel-item ${index === 0 ? "active" : ""}`}>
              <div className="gallery-mosaic-slide">
                <div className="gallery-mosaic-grid">
                  {group.map((slide, groupIndex) => renderTile(slide, groupIndex))}
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
