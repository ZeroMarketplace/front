import {defineStore} from "pinia";

export const useNotifierStore = defineStore('notifier', {
    state() {
        return {
            show : false,
            text : '',
            color: ''
        }
    }
});