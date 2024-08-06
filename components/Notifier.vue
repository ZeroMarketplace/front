<template>
  <div class="notifier-container">
    <v-slide-x-transition v-for="notification in list"
                         :key="notification._id"
                         mode="in-out">
      <v-alert v-show="notification.show"
               class="my-1 text-caption"
               :icon="'$' + notification.color"
               :color="notification.color"
               :text="notification.text"
               min-width="300"
               closable>
      </v-alert>
    </v-slide-x-transition>
  </div>
</template>

<script>
import {defineStore}      from "pinia";
import {useNotifierStore} from "~/store/notifier";

export default {
  data() {
    return {
      count: 0,
      list : []
    }
  },
  mounted() {
    // use notifier store
    const notifierStore = useNotifierStore();
    notifierStore.$onAction(({name, store, args}) => {
      if (name === 'addNotification') {
        this.count++;
        let _id = this.count;
        this.list.push({
          _id  : _id,
          show : true,
          text : args[0],
          color: args[1]
        });

        // set hider
        setTimeout(() => {
          let notification = this.list.find(notification => notification._id === _id);
          notification.show = !notification.show;
        },3000);

      }
    }, true);
  }
}
</script>

<style scoped>
.notifier-container {
  position: fixed;
  bottom: 0;
  left: 0;
  display: flex;
  flex-direction: column;
}
</style>
