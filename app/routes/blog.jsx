import { Link, useLoaderData } from "react-router";

function getBodyText(body = []) {
  if (!Array.isArray(body)) return "";
  return body
    .flatMap((block) => (Array.isArray(block?.children) ? block.children : []))
    .map((child) => child?.text ?? "")
    .join(" ")
    .trim();
}

export async function loader() {
  const { getPosts } = await import("../lib/sanity.server");
  const posts = await getPosts();
  return { posts };
}

export default function Blog() {
  const { posts } = useLoaderData();
  const fallbackImage = "https://placehold.co/900x450?text=No+Image";

  return (
    <main className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3 mb-0">Blog</h1>
        <Link className="btn btn-outline-dark btn-sm" to="/">
          Home
        </Link>
      </div>

      <section className="row g-4">
        {posts.length === 0 && <p className="text-muted">No posts found.</p>}
        {posts.map((post, index) => {
          const imageUrls = Array.isArray(post.imageUrls) ? post.imageUrls : [];
          const carouselId = `post-carousel-${index}`;

          return (
          <div className="col-12 col-md-6 col-lg-4" key={post._id}>
            <article className="card h-100 shadow-sm">
              {imageUrls.length === 0 && <img src={fallbackImage} className="card-img-top card-media" alt={post.title} />}
              {imageUrls.length === 1 && <img src={imageUrls[0]} alt={post.title} className="card-img-top card-media" />}
              {imageUrls.length > 1 && (
                <div id={carouselId} className="carousel slide" data-bs-ride="carousel">
                  <div className="carousel-inner">
                    {imageUrls.map((imageUrl, imageIndex) => (
                      <div key={`${imageUrl}-${imageIndex}`} className={`carousel-item ${imageIndex === 0 ? "active" : ""}`}>
                        <img
                          src={imageUrl}
                          className="d-block w-100 card-img-top card-media"
                          alt={`${post.title} ${imageIndex + 1}`}
                        />
                      </div>
                    ))}
                  </div>
                  <button className="carousel-control-prev" type="button" data-bs-target={`#${carouselId}`} data-bs-slide="prev">
                    <span className="carousel-control-prev-icon" aria-hidden="true" />
                    <span className="visually-hidden">Previous</span>
                  </button>
                  <button className="carousel-control-next" type="button" data-bs-target={`#${carouselId}`} data-bs-slide="next">
                    <span className="carousel-control-next-icon" aria-hidden="true" />
                    <span className="visually-hidden">Next</span>
                  </button>
                </div>
              )}

              <div className="card-body d-flex flex-column">
                <h2 className="h5 card-title">{post.title}</h2>
                <p className="text-muted small mb-3">
                  {new Date(post.publishedAt).toLocaleDateString()}
                </p>
                <p className="card-text flex-grow-1">{getBodyText(post.body).slice(0, 130)}...</p>

                <div className="d-flex gap-2">
                  <Link className="btn btn-dark btn-sm" to={`/blog/${post.slug}`}>
                    Read
                  </Link>
                </div>
              </div>
            </article>
          </div>
        );
        })}
      </section>
    </main>
  );
}
