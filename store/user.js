import {defineStore} from "pinia";

export const useUserStore = defineStore('user', {
    state() {
        return {
            firstName    : '',
            lastName     : '',
            authenticated: false,
            role         : 0,
            token        : ''
        }
    },
    persist: true
});