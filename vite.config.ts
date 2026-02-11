import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";

export default defineConfig({
  base: "/isekai114514/",
  plugins: [vue()],
  resolve: {
    alias: {
      "@": path.resolve("./src"),
    },
  },
});
