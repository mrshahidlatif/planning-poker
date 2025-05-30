// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",

  devtools: { enabled: true },
  css: ["~/assets/css/main.css"],
  vite: {
    plugins: [tailwindcss()],
  },
  app: {
    head: {
      title: "Agile Work Estimation Poker",
      htmlAttrs: {
        lang: "en",
      },
      link: [
        { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
        { rel: "canonical", href: "https://estimate.ukkaab.com" },
      ],
      meta: [
        {
          name: "description",
          content:
            "Estimate user stories and collaborate with your agile team using our free planning poker tool.",
        },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { name: "robots", content: "index, follow" },

        // Open Graph
        {
          property: "og:title",
          content: "Estimate Poker - Agile Planning Made Easy",
        },
        {
          property: "og:description",
          content:
            "Estimate user stories and collaborate with your agile team using our free planning poker tool.",
        },
        {
          property: "og:image",
          content: "https://estimate.ukkaab.com/preview.png",
        },
        { property: "og:url", content: "https://estimate.ukkaab.com" },
        { property: "og:type", content: "website" },

        // Twitter
        { name: "twitter:card", content: "summary_large_image" },
        {
          name: "twitter:title",
          content: "Estimate Poker - Agile Planning Made Easy",
        },
        {
          name: "twitter:description",
          content:
            "Estimate user stories and collaborate with your agile team using our free planning poker tool.",
        },
        {
          name: "twitter:image",
          content: "https://estimate.ukkaab.com/preview.png",
        },
      ],
    },
  },

  modules: [
    "@nuxt/content",
    "@nuxt/eslint",
    "@nuxt/fonts",
    "@nuxt/icon",
    "@nuxt/image",
    "@nuxt/scripts",
    "@nuxt/test-utils",
    "@nuxt/ui",
  ],

  runtimeConfig: {
    public: {
      webSocketUrl: process.env.NUXT_PUBLIC_WEB_SOCKET_URL,
    },
  },
});
