<template>
  <div class="dashboardMenu bg-grey-darken-3 w-100 h-100">
    <!-- Logo -->
    <div class="pa-5 text-center">
      <NuxtLink to="/">
        <v-img src="/img/logo.svg" width="50" height="50" alt="Logo" style="object-fit: contain;" />

      </NuxtLink>
    </div>

    <!-- Sidebar Menu -->
    <div class="scrollnavbar">
      <v-list class="pa-4 bg-grey-darken-3" nav>
        <template v-for="(item, i) in sidebarMenu" :key="i">
          <!-- Header -->
          <v-list-subheader 
            v-if="item.header" 
            class="text-overline text-white font-weight-bold mt-4 mb-2 px-3"
          >
            {{ item.header }}
          </v-list-subheader>

          <!-- Menu Item without children -->
          <v-list-item
            v-else-if="!item.children"
            :to="item.to"
            rounded="lg"
            class="mb-1 px-3"
            color="primary"
          >
            <template v-slot:prepend>
              <v-icon size="20">{{ `mdi-${item.icon}` }}</v-icon>
            </template>
            <v-list-item-title class="text-body-2 font-weight-medium">
              {{ item.title }}
            </v-list-item-title>
          </v-list-item>

          <!-- Menu Item with children -->
          <v-list-group v-else :value="item.title" fluid>
            <template v-slot:activator="{ props }">
              <v-list-item 
                v-bind="props" 
                rounded="lg" 
                class="mb-1 px-3"
              >
                <template v-slot:prepend>
                  <v-icon size="20">{{ `mdi-${item.icon}` }}</v-icon>
                </template>
                <v-list-item-title class="text-body-2 font-weight-medium">
                  {{ item.title }}
                </v-list-item-title>
              </v-list-item>
            </template>

            <v-list-item
              v-for="(child, j) in item.children"
              :key="j"
              :to="child.to"
              rounded="lg"
              class="mb-1 mr-8"
              color="primary"
            >
              <template v-slot:prepend>
                <v-icon size="6" class="ml-2">mdi-circle</v-icon>
              </template>
              <v-list-item-title class="text-body-2">
                {{ child.title }}
              </v-list-item-title>
            </v-list-item>
          </v-list-group>
        </template>
      </v-list>

      <v-divider class="my-4 mx-4"></v-divider>

      <!-- Logout Button -->
      <v-list class="pa-4 bg-grey-darken-3" nav>
        <v-list-item 
          @click="logout" 
          rounded="lg" 
          class="logout-btn px-3"
        >
          <template v-slot:prepend>
            <v-icon size="20" color="error">mdi-power</v-icon>
          </template>
          <v-list-item-title class="text-body-2 font-weight-medium text-error">
            خروج از پنل
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '~/store/user';
import sidebarItem from '~/layouts/full/vertical-sidebar/sidebarItem';

const router = useRouter();
const userStore = useUserStore();
const sidebarMenu = ref(sidebarItem);

const logout = async () => {
  const user = useCookie('user');
  const token = useCookie('token');
  
  user.value = null;
  token.value = null;
  
  userStore.$reset();
  
  // Use navigateTo with external option to force a full page reload
  await navigateTo('/login', { external: true });
};
</script>

<style scoped>
.dashboardMenu {
  min-height: 100vh;
}

.scrollnavbar {
  height: calc(100vh - 150px);
  overflow-y: auto;
  overflow-x: hidden;
}

.scrollnavbar::-webkit-scrollbar {
  width: 7px;
}

.scrollnavbar::-webkit-scrollbar-track {
  background: transparent;
}

.scrollnavbar::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  transition: background-color 0.2s;
}

.scrollnavbar::-webkit-scrollbar-thumb:hover {
  background-color: rgba(255, 255, 255, 0.3);
}

/* Sidebar menu styling */
:deep(.v-list-item) {
  min-height: 44px !important;
  margin-bottom: 2px;
}

:deep(.v-list-item__prepend) {
  margin-inline-end: 12px !important;
}

:deep(.v-list-item--active) {
  background-color: rgba(var(--v-theme-primary), 0.15) !important;
  color: rgb(var(--v-theme-primary)) !important;
}

:deep(.v-list-item--active .v-icon) {
  color: rgb(var(--v-theme-primary)) !important;
}

:deep(.v-list-item:hover) {
  background-color: rgba(255, 255, 255, 0.05) !important;
}

:deep(.v-list-group__items .v-list-item) {
  padding-inline-start: 16px !important;
}

:deep(.v-list-subheader) {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding-top: 16px;
  padding-bottom: 8px;
}

.logout-btn {
  border: 1px solid rgba(var(--v-theme-error), 0.3);
}

.logout-btn:hover {
  background-color: rgba(var(--v-theme-error), 0.15) !important;
}
</style>
