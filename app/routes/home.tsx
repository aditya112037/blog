import { useLoaderData } from "react-router";

import {
  BannerHighlightCarousel,
  CaptionStoryCarousel,
  EditorialSpotlightCarousel,
  InfiniteReviewRail,
  normalizeHomeShowcase,
} from "../components/carousels";

export async function loader() {
  const { getHomeShowcase } = await import("../lib/sanity.server");
  const showcase = await getHomeShowcase();
  return { showcase: normalizeHomeShowcase(showcase) };
}

export function meta() {
  return [
    { title: "Home" },
    { name: "description", content: "Blog frontend home page" },
  ];
}

export default function Home() {
  const { showcase } = useLoaderData<typeof loader>();

  return (
    <main className="container py-5">
      <section>
        {showcase.visualBannerSlides.length > 0 ? <BannerHighlightCarousel slides={showcase.visualBannerSlides} /> : null}
        {showcase.railCards.length > 0 ? <InfiniteReviewRail cards={showcase.railCards} /> : null}
        {showcase.spotlightSlides.length > 0 ? (
          <EditorialSpotlightCarousel slides={showcase.spotlightSlides} />
        ) : null}
        {showcase.captionSlides.length > 0 ? <CaptionStoryCarousel slides={showcase.captionSlides} /> : null}
      </section>
    </main>
  );
}
