import {defineStore} from "pinia";

export const useUserStore = defineStore('user', {
    state() {
        return {
            firstName    : '',
            lastName     : '',
            role         : 'user',
        }
    },
    // persist: true
});