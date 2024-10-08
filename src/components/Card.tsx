import { slugifyStr } from "@utils/slugify";
import Timestamp from "@components/Timestamp";
import type { CollectionEntry } from "astro:content";

export interface Props {
  href?: string,
  frontmatter: CollectionEntry<"blog">["data"],
  secHeading?: boolean,
}

export default function Card({ href, frontmatter, secHeading = true }: Props) {
  const { title, published, modified, description } = frontmatter;

  const headerProps = {
    style: { viewTransitionName: slugifyStr(title) },
    className: "text-lg font-medium decoration-wavy hover:underline",
  };

  return (
    <li className="my-6">
      <a
        href={href}
        className="inline-block text-lg font-medium text-skin-accent decoration-wavy underline-offset-4 focus-visible:no-underline focus-visible:underline-offset-0"
      >{
        secHeading
          ? <h2 {...headerProps}>{title}</h2>
          : <h3 {...headerProps}>{title}</h3>
      }</a>
      <Timestamp published={published} modified={modified}/>
      <p>{description}</p>
    </li>
  );
}
