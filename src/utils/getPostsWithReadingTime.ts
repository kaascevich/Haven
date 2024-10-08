import type { CollectionEntry } from "astro:content";
import { slugifyStr } from "@utils/slugify";

interface PostData {
  data: {
    title: string,
    minutesRead: string,
  },
}

export const getReadingTime = async () => {
  // Get all posts using glob. This is to get the updated frontmatter
  const globPosts = import.meta.glob<PostData>("../content/blog/*.md");

  // Then, set those frontmatter value in a JS Map with key value pair
  const mapPostData = new Map<string, string>();
  const globPostsValues = Object.values(globPosts);
  await Promise.all(
    globPostsValues.map(async globPost => {
      const { data } = await globPost();
      mapPostData.set(
        slugifyStr(data.title),
        data.minutesRead
      );
    })
  );

  return mapPostData;
};

const getPostsWithReadingTime = async (posts: CollectionEntry<"blog">[]) => {
  const mapPostData = await getReadingTime();
  return posts.map(post => {
    post.data.readingTime = mapPostData.get(slugifyStr(post.data.title));
    return post;
  });
};

export default getPostsWithReadingTime;
