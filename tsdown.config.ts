import { defineConfig } from "tsdown";

export default defineConfig({
  entry: ["./src/index.ts"],
  exports: true,
  format: ["esm", "cjs"],
  minify: true,
  shims: true,
  target: "es2020",
});
