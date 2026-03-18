import { Link, useLoaderData } from "react-router";
import { PortableText } from "@portabletext/react";
import { useEffect, useState } from "react";

function extractText(blocks = []) {
  if (!Array.isArray(blocks)) return "";
  return blocks
    .flatMap((block) => (Array.isArray(block?.children) ? block.children : []))
    .map((child) => child?.text || "")
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
}

function buildSections(blocks = []) {
  if (!Array.isArray(blocks) || blocks.length === 0) return [];

  const chunkSize = 3;
  const sections = [];

  for (let index = 0; index < blocks.length; index += chunkSize) {
    sections.push(blocks.slice(index, index + chunkSize));
  }

  return sections;
}

function buildLegacySections(post, displayImages) {
  const sections = buildSections(post.body);
  return sections.map((sectionBlocks, index) => ({
    _key: `legacy-${post._id}-${index}`,
    label: `Chapter ${String(index + 1).padStart(2, "0")}`,
    imageUrl: displayImages[(index + 1) % displayImages.length],
    body: sectionBlocks,
  }));
}

function formatDate(value) {
  if (!value) return "";
  return new Date(value).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export async function loader({ params }) {
  const { getPostBySlug } = await import("../lib/sanity.server");
  if (!params.slug) {
    throw new Response("Missing slug", { status: 400 });
  }

  const post = await getPostBySlug(params.slug);
  if (!post) {
    throw new Response("Post not found", { status: 404 });
  }

  return { post };
}

export function meta({ data }) {
  const post = data?.post;
  return [
    { title: post ? `${post.title} | Blog` : "Blog" },
    {
      name: "description",
      content: post ? extractText(post.body).slice(0, 160) : "Blog article",
    },
  ];
}

export default function BlogDetail() {
  const { post } = useLoaderData();
  const fallbackImage = "https://placehold.co/1400x900?text=Editorial+Story";
  const imageUrls = Array.isArray(post.imageUrls) ? post.imageUrls : [];
  const displayImages = imageUrls.length ? imageUrls : [fallbackImage];
  const contentSections =
    Array.isArray(post.contentSections) && post.contentSections.length > 0
      ? post.contentSections
      : buildLegacySections(post, displayImages);
  const introSource =
    (typeof post.excerpt === "string" && post.excerpt.trim()) ||
    extractText(contentSections[0]?.body || post.body);
  const sidebarImages = displayImages.slice(1, 5);
  const storyDetails =
    Array.isArray(post.storyDetails) && post.storyDetails.length > 0
      ? post.storyDetails
      : [`${contentSections.length} reading blocks`, `${displayImages.length} visuals`, "Long scroll layout"];
  const sidebarCards =
    Array.isArray(post.sidebarCards) && post.sidebarCards.length > 0
      ? post.sidebarCards
      : sidebarImages.map((imageUrl, index) => ({
          _key: `fallback-sidebar-${index}`,
          label: `Visual note ${index + 1}`,
          title: "",
          body: "A supporting frame from the same story, placed in the rail to keep the page feeling alive while the article continues to scroll.",
          imageUrl,
        }));
  const leadSections = contentSections.slice(0, 2);
  const remainingSections = contentSections.slice(2);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    setActiveImageIndex(0);
  }, [post._id]);

  return (
    <article className="story-page">
      <header
        className="story-hero"
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(7, 18, 31, 0.22) 0%, rgba(7, 18, 31, 0.82) 100%), url(${displayImages[0]})`,
        }}
      >
        <div className="container">
          <div className="story-hero-top">
            <Link className="story-back-link" to="/blog">
              All Posts
            </Link>
          </div>
          <div className="story-hero-copy">
            <p className="story-kicker">Feature story</p>
            <h1 className="story-hero-title">{post.title}</h1>
            <p className="story-hero-summary">
              {introSource.slice(0, 260)}
              {introSource.length > 260 ? "..." : ""}
            </p>
            <div className="story-meta-row">
              <span>{formatDate(post.publishedAt)}</span>
              <span>Continuous editorial scroll</span>
            </div>
          </div>
        </div>
      </header>

      <main className="container story-shell">
        <div className="story-grid">
          <div className="story-main">
            {displayImages.length > 1 ? (
              <section className="story-gallery-strip">
                {displayImages.map((imageUrl, imageIndex) => (
                  <button
                    key={`${imageUrl}-${imageIndex}`}
                    type="button"
                    className={`story-gallery-thumb ${activeImageIndex === imageIndex ? "active" : ""}`}
                    onClick={() => setActiveImageIndex(imageIndex)}
                  >
                    <img src={imageUrl} alt={`${post.title} preview ${imageIndex + 1}`} />
                  </button>
                ))}
              </section>
            ) : null}

            <figure className="story-feature-frame">
              <img src={displayImages[activeImageIndex]} alt={post.title} className="story-feature-image" />
            </figure>

            <section className="story-intro-card">
              <p className="story-section-label">Opening note</p>
              <p className="story-drop-copy">{introSource.slice(0, 420)}</p>
            </section>

            {leadSections.map((section, sectionIndex) => {
              const imageUrl = section.imageUrl || displayImages[(sectionIndex + 1) % displayImages.length];

              return (
                <section className="story-flow-block" key={section._key || `${post._id}-lead-${sectionIndex}`}>
                  <figure className="story-inline-image-block">
                    <img src={imageUrl} alt={`${post.title} section ${sectionIndex + 1}`} />
                  </figure>
                  <div className="story-text-panel">
                    <p className="story-section-label">
                      {section.label || `Chapter ${String(sectionIndex + 1).padStart(2, "0")}`}
                    </p>
                    <div className="story-richtext">
                      <PortableText value={section.body} />
                    </div>
                  </div>
                </section>
              );
            })}

            {remainingSections.length > 0 ? (
              <section className="story-longform-stack">
                {remainingSections.map((sectionBlocks, sectionIndex) => {
                  const absoluteIndex = sectionIndex + leadSections.length;
                  const imageUrl =
                    sectionBlocks.imageUrl || displayImages[(absoluteIndex + 1) % displayImages.length];

                  return (
                    <div className="story-longform-item" key={sectionBlocks._key || `${post._id}-section-${absoluteIndex}`}>
                      <figure className="story-inline-image-block">
                        <img src={imageUrl} alt={`${post.title} section ${absoluteIndex + 1}`} />
                      </figure>
                      <div className="story-text-panel">
                        <p className="story-section-label">
                          {sectionBlocks.label || `Chapter ${String(absoluteIndex + 1).padStart(2, "0")}`}
                        </p>
                        <div className="story-richtext">
                          <PortableText value={sectionBlocks.body} />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </section>
            ) : null}
          </div>

          <aside className="story-sidebar">
            <div className="story-sidebar-card">
              <p className="story-sidebar-label">Story details</p>
              <h2>{post.storyDetailsTitle || "Inside this article"}</h2>
              <div className="story-sidebar-meta">
                {storyDetails.map((detail, index) => (
                  <span key={`${detail}-${index}`}>{detail}</span>
                ))}
              </div>
            </div>

            {sidebarCards.map((card, index) => (
              <article className="story-sidebar-card story-sidebar-visual" key={card._key || `${post._id}-sidebar-${index}`}>
                {card.imageUrl ? <img src={card.imageUrl} alt={`${post.title} sidebar visual ${index + 1}`} /> : null}
                <div>
                  <p className="story-sidebar-label">{card.label || `Visual note ${index + 1}`}</p>
                  {card.title ? <h3 className="story-sidebar-title">{card.title}</h3> : null}
                  {card.body ? <p className="story-sidebar-copy">{card.body}</p> : null}
                  {card.linkLabel && card.linkHref ? (
                    <a className="story-sidebar-link" href={card.linkHref}>
                      {card.linkLabel}
                    </a>
                  ) : null}
                </div>
              </article>
            ))}
          </aside>
        </div>
      </main>
    </article>
  );
}
