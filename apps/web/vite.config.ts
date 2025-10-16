import tailwindcss from "@tailwindcss/vite";
import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";
import "dotenv/config";

export default defineConfig({
  plugins: [tailwindcss(), sveltekit()],
  server: {
    allowedHosts: process.env.ALLOWED_HOSTS?.split(" ") ?? [],
    host: process.env.HOST,
    port: (() => {
      const port = parseInt(process.env.PORT ?? "");

      if (isNaN(port)) return undefined;
      return port;
    })(),
  },
});
