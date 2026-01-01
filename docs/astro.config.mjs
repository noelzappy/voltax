import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import starlightTypeDoc, { typeDocSidebarGroup } from "starlight-typedoc";

// https://astro.build/config
export default defineConfig({
  integrations: [
    starlight({
      title: "Voltax",
      social: [
        {
          label: "GitHub",
          href: "https://github.com/noelzappy/voltax",
          icon: "github",
        },
      ],
      plugins: [
        starlightTypeDoc({
          entryPoints: ["../packages/node/src/index.ts"],
          tsconfig: "../packages/node/tsconfig.json",
          output: "reference",
        }),
      ],
      sidebar: [
        {
          label: "Guides",
          items: [
            // Each item here is one entry in the navigation menu.
            { label: "Getting Started", link: "/guides/getting-started/" },
          ],
        },
        typeDocSidebarGroup,
      ],
      expressiveCode: {
        // Expressive Code is enabled by default in Starlight
        // You can configure it here if needed
        themes: ["github-dark", "github-light"],
      },
    }),
  ],
});
