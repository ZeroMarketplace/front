<template>
  <v-locale-provider rtl>
    <v-app>
      <!-- Sidebar -->
      <v-navigation-drawer
        v-model="drawer"
        :rail="miniSidebar"
        rail-width="75"
        mobile-breakpoint="lg"
        app
        class="leftSidebar"
        elevation="0"
      >
        <!-- Logo -->
        <div class="pa-5 text-center">
          <NuxtLink to="/">
            <img 
              src="/img/logo.png" 
              :width="miniSidebar ? 50 : 110" 
              height="50"
              alt="Logo"
            />
          </NuxtLink>
        </div>

        <!-- Sidebar Menu -->
        <div class="scrollnavbar">
          <v-list class="pa-4" nav>
            <template v-for="(item, i) in sidebarMenu" :key="i">
              <!-- Header -->
              <v-list-subheader 
                v-if="item.header" 
                class="text-overline text-medium-emphasis font-weight-bold mt-4 mb-2"
                :class="miniSidebar ? 'text-center px-0' : 'px-3'"
              >
                {{ miniSidebar ? '—' : item.header }}
              </v-list-subheader>

              <!-- Menu Item without children -->
              <v-list-item
                v-else-if="!item.children"
                :to="item.to"
                rounded="lg"
                class="mb-1"
                color="primary"
                :class="miniSidebar ? 'px-2' : 'px-3'"
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
                    class="mb-1"
                    :class="miniSidebar ? 'px-2' : 'px-3'"
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
          <v-list class="pa-4" nav>
            <v-list-item 
              @click="logout" 
              rounded="lg" 
              class="logout-btn"
              :class="miniSidebar ? 'px-2' : 'px-3'"
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
      </v-navigation-drawer>

      <!-- Header -->
      <v-app-bar elevation="0" height="70" class="topbar">
        <v-btn
          class="hidden-lg-and-up mr-2"
          icon
          @click="drawer = !drawer"
          size="small"
          variant="text"
        >
          <v-icon>mdi-menu</v-icon>
        </v-btn>

        <v-btn
          class="hidden-md-and-down mr-2"
          icon
          @click="toggleMiniSidebar"
          size="small"
          variant="text"
        >
          <v-icon>mdi-menu</v-icon>
        </v-btn>

        <v-spacer></v-spacer>

        <!-- User Info -->
        <div class="d-flex align-center ml-4">
          <div class="text-left ml-3 d-none d-sm-block">
            <h6 class="text-subtitle-1 font-weight-medium mb-n1">
              {{ user.firstName }} {{ user.lastName }}
            </h6>
            <span class="text-caption text-medium-emphasis">مدیر فروشگاه</span>
          </div>
          <v-avatar color="primary" size="40">
            <span class="text-subtitle-1 font-weight-bold">{{ userInitials }}</span>
          </v-avatar>
        </div>
      </v-app-bar>

      <!-- Main Content -->
      <v-main>
        <v-container fluid class="page-wrapper pa-6">
          <slot />
        </v-container>
      </v-main>

      <!-- Notifier -->
      <Notifier />
    </v-app>
  </v-locale-provider>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '~/store/user';
import { useCustomizerStore } from '~/stores/customizer';
import sidebarItem from './full/vertical-sidebar/sidebarItem';

const router = useRouter();
const userStore = useUserStore();
const customizerStore = useCustomizerStore();

const drawer = ref(true);
const miniSidebar = ref(customizerStore.mini_sidebar);
const sidebarMenu = ref(sidebarItem);

const user = computed(() => ({
  firstName: userStore.firstName || '',
  lastName: userStore.lastName || ''
}));

const userInitials = computed(() => {
  const first = user.value.firstName?.charAt(0) || '';
  const last = user.value.lastName?.charAt(0) || '';
  return (first + last).toUpperCase() || 'A';
});

const toggleMiniSidebar = () => {
  miniSidebar.value = !miniSidebar.value;
  customizerStore.SET_MINI_SIDEBAR(miniSidebar.value);
};

const logout = () => {
  const userCookie = useCookie('user');
  const tokenCookie = useCookie('token');
  
  userCookie.value = null;
  tokenCookie.value = null;
  
  userStore.$reset();
  router.push('/login');
};

onMounted(() => {
  // Sync with customizer store
  miniSidebar.value = customizerStore.mini_sidebar;
});
</script>

<style scoped>
.leftSidebar {
  border-left: 1px solid rgb(var(--v-theme-borderColor));
  box-shadow: none !important;
  background-color: rgb(var(--v-theme-surface));
}

.topbar {
  border-bottom: 1px solid rgb(var(--v-theme-borderColor));
  background-color: rgb(var(--v-theme-surface));
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
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  transition: background-color 0.2s;
}

.scrollnavbar::-webkit-scrollbar-thumb:hover {
  background-color: rgba(0, 0, 0, 0.3);
}

.page-wrapper {
  min-height: calc(100vh - 70px);
  background-color: rgb(var(--v-theme-grey100));
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
  background-color: rgb(var(--v-theme-lightprimary)) !important;
  color: rgb(var(--v-theme-primary)) !important;
}

:deep(.v-list-item--active .v-icon) {
  color: rgb(var(--v-theme-primary)) !important;
}

:deep(.v-list-item:hover) {
  background-color: rgb(var(--v-theme-hoverColor)) !important;
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
  border: 1px solid rgba(var(--v-theme-error), 0.2);
}

.logout-btn:hover {
  background-color: rgba(var(--v-theme-error), 0.08) !important;
}
</style>
