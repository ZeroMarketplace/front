<template>
  <div class="notifier-container">
    <transition-group name="slide-y">
      <v-alert v-for="notification in list" v-show="notification.show" :key="notification._id"
        :color="notification.color" variant="flat" class="spike-alert mb-3" closable
        @click:close="closeNotification(notification._id)" elevation="6" border="start" border-color="white">
        <template v-slot:prepend>
          <Icon :icon="getIcon(notification.color)" height="24" class="notification-icon" color="white" />
        </template>
        <div class="text-body-1 font-weight-medium notification-text">{{ notification.text }}</div>
      </v-alert>
    </transition-group>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { Icon } from '@iconify/vue';
import { useNotifierStore } from '~/store/notifier';

const count = ref(0);
const list = ref([]);

const getIcon = (color) => {
  const icons = {
    success: 'solar:check-circle-linear',
    error: 'solar:close-circle-linear',
    warning: 'solar:danger-triangle-linear',
    info: 'solar:info-circle-linear'
  };
  return icons[color] || 'solar:info-circle-linear';
};

const closeNotification = (id) => {
  const notification = list.value.find(n => n._id === id);
  if (notification) {
    notification.show = false;
    // Remove from list after animation
    setTimeout(() => {
      const index = list.value.findIndex(n => n._id === id);
      if (index > -1) {
        list.value.splice(index, 1);
      }
    }, 300);
  }
};

onMounted(() => {
  const notifierStore = useNotifierStore();
  notifierStore.$onAction(({ name, args }) => {
    if (name === 'addNotification') {
      count.value++;
      const _id = count.value;
      const notification = {
        _id,
        show: true,
        text: args[0],
        color: args[1]
      };
      list.value.push(notification);
      setTimeout(() => {
        closeNotification(_id);
      }, 3000);
    }
  }, true);
});
</script>

<style scoped>
.notifier-container {
  position: fixed;
  bottom: 20px;
  left: 20px;
  right: 20px;
  display: flex;
  flex-direction: column;
  z-index: 9999 !important;
  pointer-events: none;
  max-width: 500px;
  color: white;
}

.spike-alert {
  pointer-events: auto;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15) !important;
  border-radius: 8px !important;
}

.notification-icon {
  color: white !important;
}

.notification-text {
  color: white !important;
}

/* Make close button white */
.spike-alert :deep(.v-alert__close) {
  color: white !important;
  opacity: 0.9;
}

.spike-alert :deep(.v-alert__close:hover) {
  opacity: 1;
}

/* Transition animati
.slide-y-enter-active,
.slide-y-leave-active {
  transition: all 0.3s ease;
}

.slide-y-enter-from {
  opacity: 0;
  transform: translateY(30px);
}

.slide-y-leave-to {
  opacity: 0;
  transform: translateY(-30px);
}

/* RTL support */
[dir='rtl'] .notifier-container {
  left: auto;
  right: 20px;
}

@media (max-width: 600px) {
  .notifier-container {
    left: 10px;
    right: 10px;
    max-width: none;
  }

  [dir='rtl'] .notifier-container {
    left: 10px;
    right: 10px;
  }
}
</style>
