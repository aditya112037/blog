import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("blog", "routes/blog.jsx"),
  route("blog/:slug", "routes/blog.$slug.jsx"),
] satisfies RouteConfig;
