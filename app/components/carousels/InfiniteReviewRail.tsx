import type { RailCard } from "./types";

type Props = {
  cards: RailCard[];
};

function renderStars(count: number) {
  return Array.from({ length: 5 }, (_, index) => (
    <span key={`${count}-${index}`} className={index < count ? "star-filled" : "star-muted"}>
      {"\u2605"}
    </span>
  ));
}

export function InfiniteReviewRail({ cards }: Props) {
  const repeatedCards = [...cards, ...cards];

  return (
    <section className="showcase-block">
      <div className="infinite-rail-wrap">
        <div className="infinite-rail-track">
          {repeatedCards.map((card, index) => (
            <article
              className="review-box shadow-sm"
              key={`${card._key || card.label}-${index}`}
              aria-label={card.label}
            >
              <a href={card.link || "/blog"} className="review-box-link">
                <img src={card.imageUrl} alt={card.label} className="review-box-image" />
                <div className="review-box-body">
                  <div className="rating-row">{renderStars(card.stars)}</div>
                  <p className="mb-0 fw-semibold">{card.label}</p>
                </div>
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
