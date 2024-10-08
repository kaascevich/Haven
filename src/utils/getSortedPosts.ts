import type { CollectionEntry } from "astro:content";
import postFilter from "@utils/postFilter";

const getPostSortIndex = ({ data }: CollectionEntry<"blog">) =>
  Math.floor(new Date(data.modified ?? data.published).getTime() / 1000);

const getSortedPosts = (posts: CollectionEntry<"blog">[]) => posts
  .filter(postFilter)
  .sort((a, b) => getPostSortIndex(b) - getPostSortIndex(a));

export default getSortedPosts;
