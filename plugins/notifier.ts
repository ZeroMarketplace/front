import { useNotifierStore } from "~/store/notifier";

export default defineNuxtPlugin((nuxtApp) => {
  // You can alternatively use this format, which comes with automatic type support
  return {
    provide: {
      notify: (text: string, color: string) => {
        const notifierStore = useNotifierStore();
        notifierStore.addNotification(text, color);
      },
    },
  };
});
