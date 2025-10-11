export default defineNuxtPlugin((nuxtApp) => {
  // Simple i18n mock - just returns the key
  nuxtApp.vueApp.config.globalProperties.$t = (key: string) => key;
  nuxtApp.vueApp.config.globalProperties.$i18n = {
    locale: 'en'
  };
});
