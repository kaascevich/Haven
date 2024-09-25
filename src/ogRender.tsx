import { SITE } from "./config";
import type { RenderFunctionInput } from "astro-opengraph-images";

export async function ogRender({ title, description }: RenderFunctionInput): Promise<React.ReactNode> {
  let articleTitle = title.replace(` | ${SITE.title}`, "");

  return Promise.resolve(
    <div style={{
      height: "100%",
      width: "100%",
      display: "flex",
      flexDirection: "column",
      backgroundColor: "#303446",
      padding: "55px 70px",
      color: "#c6d0f5",
      fontFamily: "Iosevka Etoile Web",
      fontSize: 72,
    }}>
      <div style={{ color: "#8caaee" }}>
        {articleTitle}
      </div>
      <div style={{ fontSize: 40 }}>
        {description ?? ""}
      </div>
    </div>
  );
}
