import { slugifyStr } from "@utils/slugify";
import type { CollectionEntry } from "astro:content";
import postFilter from "@utils/postFilter";

interface Tag {
  tag: string,
  tagName: string,
}

const getUniqueTags = (posts: CollectionEntry<"blog">[]): Tag[] => posts
  .filter(postFilter)
  .flatMap(post => post.data.tags)
  .map(tagName => ({ tag: slugifyStr(tagName), tagName }))
  .filter(
    (value, index, self) =>
      self.findIndex(tag => tag.tag === value.tag) === index
  )
  .sort((tagA, tagB) => tagA.tag.localeCompare(tagB.tag));

export default getUniqueTags;
