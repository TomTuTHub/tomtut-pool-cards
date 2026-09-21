import resolve from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";
import { readFileSync, readdirSync } from "node:fs";
import { createHash } from "node:crypto";

/*
 * Bild-Version: Paketversion + Hash ueber alle ausgelieferten PNGs. Landet als
 * ?v=… an jeder Bild-URL (src/shared/assets.js, ASSET_VERSION).
 */
const assetVersion = () => {
  const pkg = JSON.parse(readFileSync("package.json", "utf8"));
  const h = createHash("sha256");
  for (const f of readdirSync("dist").filter((x) => x.endsWith(".png")).sort()) {
    h.update(f);
    h.update(readFileSync("dist/" + f));
  }
  return `${pkg.version}-${h.digest("hex").slice(0, 8)}`;
};

const assetVersionPlugin = () => ({
  name: "asset-version",
  transform(code, id) {
    if (!id.endsWith("/src/shared/assets.js")) return null;
    return { code: code.replace('"__ASSET_VERSION__"', JSON.stringify(assetVersion())), map: null };
  },
});

export default {
  input: "src/tomtut-pool-cards.js",
  output: {
    file: "dist/tomtut-pool-cards.js",
    format: "es",
  },
  plugins: [
    assetVersionPlugin(),
    resolve(),
    terser({
      format: { comments: /^!/ },
    }),
  ],
};
