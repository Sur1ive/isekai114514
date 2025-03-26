import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
  base: "/otherworld114514/",
  resolve: {
    alias: {
      "@": path.resolve("./src"),
    },
  },
});
