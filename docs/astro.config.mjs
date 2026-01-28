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
            { label: "Getting Started", slug: "guides/getting-started" },
            { label: "Core Concepts", slug: "guides/concepts" },
            { label: "Initializing Payments", slug: "guides/payments" },
            { label: "Error Handling", slug: "guides/error-handling" },
            {
              label: "Providers",
              items: [
                { label: "Paystack", slug: "guides/paystack" },
                { label: "Flutterwave", slug: "guides/flutterwave" },
                { label: "Hubtel", slug: "guides/hubtel" },
                { label: "Moolre", slug: "guides/moolre" },
                { label: "LibertePay", slug: "guides/libertepay" },
              ],
            },
            { label: "Examples", slug: "guides/example" },
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
