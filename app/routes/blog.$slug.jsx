import { Link, useLoaderData } from "react-router";
import { PortableText } from "@portabletext/react";

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

  return (
    <article className="container py-4" style={{ maxWidth: 960 }}>
      <p>
        <Link className="btn btn-outline-dark btn-sm" to="/blog">
          Back to Blog
        </Link>
      </p>

      <h1 className="h2 mt-3">{post.title}</h1>
      <p className="text-muted">{new Date(post.publishedAt).toLocaleDateString()}</p>

      {post.imageUrl && (
        <img
          src={post.imageUrl}
          alt={post.title}
          style={{ maxWidth: "100%", height: "auto" }}
        />
      )}

      <div className="mt-4">
        <PortableText value={post.body} />
      </div>
    </article>
  );
}
