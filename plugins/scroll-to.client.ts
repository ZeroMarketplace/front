export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive('scroll-to', {
    mounted(el, binding) {
      el.addEventListener('click', () => {
        const target = binding.value?.el || binding.value;
        if (typeof target === 'string') {
          const element = document.querySelector(target);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }
      });
    }
  });
});
