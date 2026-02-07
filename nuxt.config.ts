// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  srcDir: "src/",
  modules: ["@nuxt/ui"],
  runtimeConfig: {
    public: {
      siteUrl: "https://ouru.app",
      siteName: "Ouru Text to PDF",
      siteDescription: "Convert Ouru text to polished PDF or Word with clean, professional settings."
    }
  },
  colorMode: {
    preference: "light",
    fallback: "light",
    classSuffix: "",
    storageKey: "ouru-color-mode"
  },
  css: ["~/assets/css/main.css"],
  nitro: {
    prerender: {
      routes: ["/", "/robots.txt", "/sitemap.xml"]
    }
  },
  routeRules: {
    "/robots.txt": { headers: { "cache-control": "public, max-age=3600, s-maxage=3600" } },
    "/sitemap.xml": { headers: { "cache-control": "public, max-age=3600, s-maxage=3600" } }
  },
  app: {
    head: {
      title: "Ouru Text to PDF",
      titleTemplate: "%s | Ouru",
      htmlAttrs: {
        lang: "en"
      },
      meta: [
        { name: "description", content: "Convert Ouru text to polished PDF or Word with clean, professional settings." },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { name: "robots", content: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" },
        { name: "theme-color", content: "#f6f5f2" },
        { name: "format-detection", content: "telephone=no" }
      ],
      link: [
        { rel: "manifest", href: "/site.webmanifest" },
        { rel: "icon", type: "image/svg+xml", href: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><path fill='%23111' d='M6 2h8l6 6v14H6V2zm8 1.5V8h4.5L14 3.5z'/></svg>" }
      ]
    }
  }
});
