import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import getSortedPosts from "@utils/getSortedPosts";
import { SITE } from "@config";
import { markdown } from "@astropub/md";

export async function GET() {
  const posts = await getCollection("blog");
  const sortedPosts = getSortedPosts(posts);

  const items = await Promise.all(sortedPosts.map(async ({ body, data, slug }) => ({
    link: `posts/${slug}/`,
    title: data.title,
    author: SITE.author,
    description: data.description,
    pubDate: new Date(data.modified ?? data.published),
    categories: data.tags,
    content: (await markdown(body)).toString(),
  })));

  return rss({
    title: SITE.title,
    description: SITE.description,
    site: SITE.website,
    trailingSlash: false,
    items,
  });
}
