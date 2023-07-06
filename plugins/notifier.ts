import pinia from "~/plugins/pinia";
import {useNotifierStore} from "~/store/notifier";

export default defineNuxtPlugin(nuxtApp => {

    // You can alternatively use this format, which comes with automatic type support
    return {
        provide: {
            showMessage: (content: any, color: any, string = '') => {
                const notifierStore = useNotifierStore();
                notifierStore.$patch({
                    show: true,
                    text: content,
                    color: color
                });
            }
        }
    }
})