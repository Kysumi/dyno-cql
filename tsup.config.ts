import { defineConfig } from "tsup";

export default defineConfig({
  clean: true,
  dts: true,
  outDir: "dist",
  entry: {
    "operators/comparison": "src/operators/comparison-operators.ts",
    "operators/logical": "src/operators/logical-operators.ts",
    "operators/spatial": "src/operators/spatial-operators.ts",
    "operators/text": "src/operators/text-operators.ts",
    "query-builder": "src/query-builder.ts",
    errors: "src/errors.ts",
  },
});
