import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
  base: "/isekai114514/",
  resolve: {
    alias: {
      "@": path.resolve("./src"),
    },
  },
});
