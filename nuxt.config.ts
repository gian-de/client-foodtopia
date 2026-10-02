// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  css: ["~/assets/css/main.css"],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  modules: ["@pinia/nuxt"],
  runtimeConfig: {
    public: {
      productionApiUrl:
        process.env.BASE_API_URL || "https://api.foodiestopia.com",
      developmentApiUrl:
        process.env.BASE_API_URL_DEVELOPMENT || "http://localhost:5001",
    },
  },
});
