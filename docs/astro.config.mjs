// @ts-check
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));

// https://astro.build/config
export default defineConfig({
  vite: {
    resolve: {
      alias: {
        "@": resolve(__dirname, "src"),
      },
    },
  },
  integrations: [
    starlight({
      title: "Magang Inventory Barang Docs",
      // social: [
      //   {
      //     icon: "github",
      //     label: "GitHub",
      //     href: "https://github.com/arseniow777/magang-inventory-barang",
      //   },
      // ],
      sidebar: [
        {
          label: "Overview",
          autogenerate: { directory: "overview" },
        },
        {
          label: "Backend",
          autogenerate: { directory: "backend" },
        },
        {
          label: "Frontend",
          autogenerate: { directory: "frontend" },
        },
        {
          label: "Integrasi",
          autogenerate: { directory: "integrasi" },
        },
        {
          label: "Reference",
          autogenerate: { directory: "reference" },
        },
      ],
    }),
  ],
});
