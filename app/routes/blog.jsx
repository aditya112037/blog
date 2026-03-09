import { Form, Link, redirect, useActionData, useLoaderData, useNavigation } from "react-router";

function slugify(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function getBodyText(body = []) {
  if (!Array.isArray(body)) return "";
  return body
    .flatMap((block) => (Array.isArray(block?.children) ? block.children : []))
    .map((child) => child?.text ?? "")
    .join(" ")
    .trim();
}

export async function loader({ request }) {
  const { getPosts } = await import("../lib/sanity.server");
  const posts = await getPosts();
  const url = new URL(request.url);
  const editId = url.searchParams.get("edit");
  const editPost = posts.find((post) => post._id === editId) || null;

  return { posts, editPost };
}

export async function action({ request }) {
  const { createPost, deletePost, updatePost } = await import("../lib/sanity.server");
  const formData = await request.formData();
  const intent = formData.get("intent");
  const id = String(formData.get("id") || "");
  const title = String(formData.get("title") || "").trim();
  const slugInput = String(formData.get("slug") || "").trim();
  const content = String(formData.get("content") || "").trim();
  const slug = slugify(slugInput || title);

  if (intent === "delete") {
    if (!id) return { error: "Post id is required for delete." };
    await deletePost(id);
    return redirect("/blog");
  }

  if (!title || !slug || !content) {
    return { error: "Title, slug/title, and content are required." };
  }

  if (intent === "update") {
    if (!id) return { error: "Post id is required for update." };
    await updatePost({ id, title, slug, content });
    return redirect("/blog");
  }

  await createPost({ title, slug, content });
  return redirect("/blog");
}

export default function Blog() {
  const { posts, editPost } = useLoaderData();
  const actionData = useActionData();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const isEditing = Boolean(editPost);

  return (
    <main className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3 mb-0">Blog</h1>
        <Link className="btn btn-outline-dark btn-sm" to="/">
          Home
        </Link>
      </div>

      <section className="card shadow-sm mb-4">
        <div className="card-body">
          <h2 className="h5 card-title">{isEditing ? "Edit Blog Post" : "Create Blog Post"}</h2>
          <Form method="post" className="row g-3">
            <input type="hidden" name="intent" value={isEditing ? "update" : "create"} />
            <input type="hidden" name="id" value={editPost?._id || ""} />

            <div className="col-12">
              <label className="form-label">Title</label>
              <input
                className="form-control"
                type="text"
                name="title"
                defaultValue={editPost?.title || ""}
                placeholder="Enter blog title"
                required
              />
            </div>

            <div className="col-12">
              <label className="form-label">Slug (optional)</label>
              <input
                className="form-control"
                type="text"
                name="slug"
                defaultValue={editPost?.slug || ""}
                placeholder="auto-generated-from-title"
              />
            </div>

            <div className="col-12">
              <label className="form-label">Content</label>
              <textarea
                className="form-control"
                name="content"
                rows={5}
                defaultValue={getBodyText(editPost?.body)}
                placeholder="Write your blog content..."
                required
              />
            </div>

            <div className="col-12 d-flex gap-2">
              <button className="btn btn-dark" type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : isEditing ? "Update Post" : "Create Post"}
              </button>
              {isEditing && (
                <Link className="btn btn-outline-secondary" to="/blog">
                  Cancel Edit
                </Link>
              )}
            </div>
          </Form>
        </div>
      </section>

      {actionData?.error && (
        <div className="alert alert-danger" role="alert">
          {actionData.error}
        </div>
      )}

      <section className="row g-4">
        {posts.length === 0 && <p className="text-muted">No posts found.</p>}
        {posts.map((post) => (
          <div className="col-12 col-md-6 col-lg-4" key={post._id}>
            <article className="card h-100 shadow-sm">
              {post.imageUrl && (
                <img
                  src={post.imageUrl}
                  alt={post.title}
                  className="card-img-top"
                />
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
                  <Link className="btn btn-outline-secondary btn-sm" to={`/blog?edit=${post._id}`}>
                    Edit
                  </Link>
                  <Form method="post" onSubmit={(e) => !window.confirm("Delete this post?") && e.preventDefault()}>
                    <input type="hidden" name="intent" value="delete" />
                    <input type="hidden" name="id" value={post._id} />
                    <button className="btn btn-outline-danger btn-sm" type="submit" disabled={isSubmitting}>
                      Delete
                    </button>
                  </Form>
                </div>
              </div>
            </article>
          </div>
        ))}
      </section>
    </main>
  );
}
