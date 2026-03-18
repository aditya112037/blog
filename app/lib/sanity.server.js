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
      excerpt,
      "imageUrls": coalesce(images[].asset->url, []),
      body,
      "contentSections": coalesce(contentSections[]{
        _key,
        label,
        "imageUrl": image.asset->url,
        body
      }, [])
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
      excerpt,
      storyDetailsTitle,
      "storyDetails": coalesce(storyDetails, []),
      "imageUrls": coalesce(images[].asset->url, []),
      body,
      "contentSections": coalesce(contentSections[]{
        _key,
        label,
        "imageUrl": image.asset->url,
        body
      }, []),
      "sidebarCards": coalesce(sidebarCards[]{
        _key,
        label,
        title,
        body,
        linkLabel,
        linkHref,
        "imageUrl": image.asset->url
      }, [])
    }
    `,
    { slug }
  );

export const getHomeShowcase = () =>
  readClient.fetch(`
    *[_type == "homeShowcase" && _id == "homeShowcase"][0]{
      "visualBannerSlides": coalesce(visualBannerSlides[]{
        _key,
        title,
        eyebrow,
        description,
        buttonLabel,
        buttonLink,
        "imageUrl": coalesce(image.asset->url, imageUrl)
      }, []),
      "railCards": coalesce(railCards[]{
        _key,
        label,
        stars,
        link,
        "images": coalesce(images[]{
          "imageUrl": coalesce(image.asset->url, imageUrl)
        }, [])
      }, []),
      "gallerySlides": coalesce(gallerySlides[]{
        _key,
        title,
        eyebrow,
        description,
        buttonLabel,
        buttonLink,
        "imageUrl": coalesce(image.asset->url, imageUrl)
      }, []),
      "spotlightSlides": coalesce(spotlightSlides[]{
        _key,
        title,
        eyebrow,
        description,
        buttonLabel,
        buttonLink,
        "imageUrl": coalesce(image.asset->url, imageUrl)
      }, []),
      "captionSlides": coalesce(captionSlides[]{
        _key,
        title,
        eyebrow,
        description,
        buttonLabel,
        buttonLink,
        "imageUrl": coalesce(image.asset->url, imageUrl)
      }, [])
    }
  `);

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
