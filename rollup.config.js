import resolve from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";

export default {
  input: "src/tomtut-pool-cards.js",
  output: {
    file: "dist/tomtut-pool-cards.js",
    format: "es",
  },
  plugins: [
    resolve(),
    terser({
      format: { comments: /^!/ },
    }),
  ],
};
