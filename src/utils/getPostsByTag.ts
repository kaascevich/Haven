import type { CollectionEntry } from "astro:content";
import getSortedPosts from "@utils/getSortedPosts";
import { slugifyAll } from "@utils/slugify";

const getPostsByTag = (posts: CollectionEntry<"blog">[], tag: string) =>
  getSortedPosts(
    posts.filter(post => slugifyAll(post.data.tags).includes(tag))
  );

export default getPostsByTag;
