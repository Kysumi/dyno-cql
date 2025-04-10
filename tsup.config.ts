import { defineConfig } from "tsup";

export default defineConfig({
  clean: true,
  dts: true,
  outDir: "dist",
  entry: {
    "operators/comparison": "src/operators/comparison.ts",
    "operators/logical": "src/operators/logical.ts",
    "operators/spatial": "src/operators/spatial.ts",
    "operators/text": "src/operators/text.ts",
    "query-builder": "src/query-builder.ts",
  },
});
