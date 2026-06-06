import { defineConfig } from "tsup";
export default defineConfig({
    entry: ["src/index.ts"],
    format: "esm", // matches your "type": "module"
    target: "es2023", // matches your tsconfig target
    clean: true, // wipe dist/ before build
    dts: false, // no declarations needed for a server app
    splitting: false, // single-file output (sensible for Express)
    sourcemap: true,
    outDir: "dist",
});
