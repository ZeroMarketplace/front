import {defineStore} from "pinia";

export const useNotifierStore = defineStore('notifier', {
    state() {
        return {
            count: 0,
            list : []
        }
    },
    actions: {
        addNotification(text, color) {
            this.count += 1;
            this.list.push({
                _id  : this.count,
                show : true,
                text : text,
                color: color
            });
        }
    }
});
