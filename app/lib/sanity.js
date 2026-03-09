import { createClient } from "@sanity/client"
import imageUrlBuilder from "@sanity/image-url"

const projectId = "5w0ao4zv"
const dataset = "production"
const apiVersion = "2026-03-04"

const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true
})

const builder = imageUrlBuilder(client)

export const urlFor = (source) => builder.image(source)

export const getPosts = () =>
  client.fetch(`
    *[_type == "post"] | order(publishedAt desc){
      _id,
      title,
      "slug": slug.current,
      publishedAt,
      image,
      body
    }
  `)

export const getPostBySlug = (slug) =>
  client.fetch(
    `
    *[_type == "post" && slug.current == $slug][0]{
      _id,
      title,
      "slug": slug.current,
      publishedAt,
      image,
      body
    }
    `,
    { slug }
  )
