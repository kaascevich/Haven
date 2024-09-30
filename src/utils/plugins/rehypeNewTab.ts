import type { RehypePlugin } from '@astrojs/markdown-remark';
import { visit } from 'unist-util-visit';
import type { Element } from 'hast';

export default function rehypeNewTab({ domain = "" }): RehypePlugin {
  return tree => visit(tree, 'element', (e: Element) => {
    if (
      e.tagName === 'a' &&
      e.properties?.href &&
      e.properties.href.toString().startsWith('http') &&
      !e.properties.href.toString().startsWith(domain)
    ) {
      e.properties!['target'] = '_blank';
    }
  });
};
