// app.config.ts

import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "@tanstack/react-start/config";

var app_config_default = defineConfig({
  tsr: {
    routesDirectory: "./src/routes",
    generatedRouteTree: "./src/routeTree.gen.ts",
    autoCodeSplitting: true,
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
export { app_config_default as default };
