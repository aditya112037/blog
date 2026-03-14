import { useLoaderData } from "react-router";

import {
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
        <InfiniteReviewRail cards={showcase.railCards} />
        <EditorialSpotlightCarousel slides={showcase.spotlightSlides} />
        <CaptionStoryCarousel slides={showcase.captionSlides} />
      </section>
    </main>
  );
}
