import { createClient } from "@sanity/client";

const projectId = "5w0ao4zv";
const dataset = "production";
const apiVersion = "2026-03-04";
const writeToken = process.env.SANITY_API_WRITE_TOKEN;

const readClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
});

const writeClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token: writeToken,
});

export const getPosts = () =>
  readClient.fetch(`
    *[_type == "post"] | order(publishedAt desc){
      _id,
      title,
      "slug": slug.current,
      publishedAt,
      "imageUrl": image.asset->url,
      body
    }
  `);

export const getPostBySlug = (slug) =>
  readClient.fetch(
    `
    *[_type == "post" && slug.current == $slug][0]{
      _id,
      title,
      "slug": slug.current,
      publishedAt,
      "imageUrl": image.asset->url,
      body
    }
    `,
    { slug }
  );

function toPortableTextBlocks(content) {
  return [
    {
      _type: "block",
      style: "normal",
      markDefs: [],
      children: [
        {
          _type: "span",
          marks: [],
          text: content,
        },
      ],
    },
  ];
}

function assertWriteToken() {
  if (!writeToken) {
    throw new Error("Missing SANITY_API_WRITE_TOKEN in server environment.");
  }
}

export async function createPost({ title, slug, content }) {
  assertWriteToken();
  return writeClient.create({
    _type: "post",
    title,
    slug: { _type: "slug", current: slug },
    publishedAt: new Date().toISOString(),
    body: toPortableTextBlocks(content),
  });
}

export async function updatePost({ id, title, slug, content }) {
  assertWriteToken();
  return writeClient
    .patch(id)
    .set({
      title,
      slug: { _type: "slug", current: slug },
      body: toPortableTextBlocks(content),
    })
    .commit();
}

export async function deletePost(id) {
  assertWriteToken();
  return writeClient.delete(id);
}
