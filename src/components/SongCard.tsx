import type { CollectionEntry } from "astro:content";

export interface Props {
  href?: string;
  frontmatter: CollectionEntry<"songs">["data"];
}

export default function SongCard({ frontmatter }: Props) {
  const { title, composer, source } = frontmatter;

  return (
    <li className="my-6">
      <div className="inline-block text-lg font-medium text-skin-accent">
        <h2 className="text-lg font-medium">{title}</h2>
      </div>

      <p>{composer}</p>

      <audio className="pt-1" src={source} preload="metadata" controls/>
    </li>
  );
}
