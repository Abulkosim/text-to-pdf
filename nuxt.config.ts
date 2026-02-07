// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  css: ["@/assets/css/main.css"],
  app: {
    head: {
      title: "Ouru Text to PDF",
      meta: [
        { name: "description", content: "Convert Ouru text to polished PDF or Word with clean, professional settings." },
        { name: "viewport", content: "width=device-width, initial-scale=1" }
      ],
      link: [
        { rel: "icon", type: "image/svg+xml", href: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><path fill='%23111' d='M6 2h8l6 6v14H6V2zm8 1.5V8h4.5L14 3.5z'/></svg>" }
      ]
    }
  }
});
