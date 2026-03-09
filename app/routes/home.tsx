import { Link } from "react-router";

export function meta() {
  return [
    { title: "Home" },
    { name: "description", content: "Blog frontend home page" },
  ];
}

export default function Home() {
  return (
    <main style={{ maxWidth: 960, margin: "0 auto", padding: "1rem" }}>
      <h1>Home Page</h1>
      <p>Welcome to your blog frontend.</p>
      <Link to="/blog">Go to Blog</Link>
    </main>
  );
}
