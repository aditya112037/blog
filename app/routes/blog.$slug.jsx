import { Link, useLoaderData } from "react-router";
import { PortableText } from "@portabletext/react";
import { useEffect, useMemo, useState } from "react";

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

export default function BlogDetail() {
  const { post } = useLoaderData();
  const fallbackImage = "https://placehold.co/1200x800?text=No+Image";
  const imageUrls = Array.isArray(post.imageUrls) ? post.imageUrls : [];
  const displayImages = imageUrls.length ? imageUrls : [fallbackImage];
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    setSelectedIndex(0);
  }, [post._id]);

  const bodyText = useMemo(() => {
    if (!Array.isArray(post.body)) return "";
    return post.body
      .flatMap((block) => (Array.isArray(block?.children) ? block.children : []))
      .map((child) => child?.text || "")
      .join(" ")
      .trim();
  }, [post.body]);

  return (
    <article className="container py-4">
      <div className="mb-3">
        <Link className="btn btn-outline-dark btn-sm" to="/blog">
          Back to Blog
        </Link>
      </div>

      <div className="row g-4 align-items-start">
        <div className="col-12 col-lg-6">
          <div className="d-flex gap-3">
            <div className="thumb-strip">
              {displayImages.map((imageUrl, imageIndex) => (
                <button
                  key={`${imageUrl}-${imageIndex}`}
                  type="button"
                  className={`thumb-btn ${selectedIndex === imageIndex ? "active" : ""}`}
                  onClick={() => setSelectedIndex(imageIndex)}
                >
                  <img src={imageUrl} alt={`${post.title} ${imageIndex + 1}`} className="thumb-image" />
                </button>
              ))}
            </div>
            <div className="product-frame">
              <img src={displayImages[selectedIndex]} alt={post.title} className="product-main-image" />
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-6">
          <h1 className="h2 mb-2">{post.title}</h1>
          <p className="text-muted mb-3">{new Date(post.publishedAt).toLocaleDateString()}</p>
          <p className="mb-0">{bodyText.slice(0, 220)}...</p>

          <div className="detail-body mt-4">
            <PortableText value={post.body} />
          </div>
        </div>
      </div>
    </article>
  );
}
