import { defineConfig } from "vite";
import { resolve } from "path";
import preact from "@preact/preset-vite";
import makeManifest from "./scripts/make-manifest";

const src = resolve(__dirname, "src");
const assetsDir = resolve(src, "assets");
const outDir = resolve(__dirname, "dist");
const publicDir = resolve(__dirname, "public");

console.log(resolve(src, "content", "index.ts"));

export default defineConfig({
  resolve: {
    alias: {
      "@src": src,
      "@assets": assetsDir,
    },
  },
  plugins: [makeManifest(), preact()],
  publicDir,
  build: {
    outDir,
    rollupOptions: {
      input: {
        inject: resolve(src, "inject", "index.ts"),
        content: resolve(src, "content", "index.ts"),
        background: resolve(src, "background", "index.ts"),
        popup: resolve(src, "popup", "index.html"),
      },
      output: {
        entryFileNames: (chunk: any) => {
          return `src/${chunk.name}/index.js`;
        },
      },
    },
  },
});
