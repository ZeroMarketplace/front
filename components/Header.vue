<template>
  <v-container class="bg-white px-1 px-md-16 border-0-md" fluid>
    <!--  Top Bar  -->
    <v-row>
      <!--  Name And Logo  -->
      <v-col class="pt-2 pb-0 pt-md-5">
        <!--   Menu Icon   -->
        <v-btn
          class="d-inline-block mt-n10 d-md-none mr-1 rounded-lg"
          variant="text"
          size="small"
          @click="navigationMenu = true"
          icon
        >
          <v-icon>mdi-menu</v-icon>
        </v-btn>

        <!--   Navigation Menu     -->
        <v-navigation-drawer
          v-model="navigationMenu"
          class="d-md-none bg-grey-darken-3"
          elevation="24"
        >
        </v-navigation-drawer>

        <!--   Logo     -->
        <NuxtLink to="/">
          <v-img
            class="mt-n2 w-75 d-none d-md-inline-block"
            src="/img/TypoLogo.svg"
            max-height="60"
            max-width="75"
          >
          </v-img>
        </NuxtLink>

        <NuxtLink class="d-inline-block mx-2 w-50 h-8" to="/">
          <v-img class="d-md-none" max-width="40" max-height="50" src="/img/logo.svg" />
        </NuxtLink>

        <!--        <h2 class="d-none d-md-inline font-weight-bold">فروشگاه زیرو</h2>-->
        <!--        <p class="d-md-none d-inline-block font-weight-bold mt-1 mr-2">فروشگاه زیرو</p>-->
      </v-col>

      <!--  Search    -->
      <v-col class="pb-3 d-none d-md-inline">
        <v-text-field
          class="border rounded-xl px-4 pb-2 w-100"
          variant="plain"
          density="compact"
          label="جستجو"
          append-inner-icon="mdi-magnify"
          rounded
          hide-details
        ></v-text-field>
      </v-col>

      <!--  Icons    -->
      <v-col class="pt-1 pb-0 pt-md-4 text-end">
        <!--   Profile     -->
        <v-btn
          class="d-none d-md-inline mx-1 px-2"
          variant="text"
          height="50"
          @click="openProfile"
        >
          <p>پروفایل</p>
          <v-icon class="mr-2" size="large">mdi-account-outline</v-icon>
        </v-btn>

        <v-btn
          class="d-md-none rounded-lg"
          variant="text"
          size="small"
          @click="openProfile"
          icon
        >
          <v-icon>mdi-account-outline</v-icon>
        </v-btn>

        <Login ref="login" />

        <!--   Cart     -->
        <v-btn class="d-none d-md-inline mx-1 px-2" variant="text" height="50">
          <v-row>
            <v-col class="text-right">
              <p class="textSmall">سبد خرید</p>
              <p class="text-pink mx-1 my-2 textSmall">(4)</p>
              <p class="font-weight-thin mt-n1">۴ عدد</p>
            </v-col>
            <v-col class="mt-3 mr-n5">
              <v-icon size="large">mdi-cart-outline</v-icon>
            </v-col>
          </v-row>
        </v-btn>

        <v-btn
          class="d-md-none mx-1 rounded-lg"
          variant="text"
          size="small"
          icon
        >
          <v-icon>mdi-cart-outline</v-icon>
        </v-btn>
      </v-col>
    </v-row>

    <v-divider class="d-none d-md-block mt-3"></v-divider>
    <!--  Category   -->
    <v-menu
      transition="slide-y-transition"
      close-on-content-click="false"
      max-height="400px"
      min-height="400px"
      open-on-hover
    >
      <div class="top-black-border"></div>
      <!-- Activator Button -->
      <template v-slot:activator="{ props }">
        <v-btn
          v-bind="props"
          variant="text"
          prepend-icon="mdi-shape-plus-outline"
          class="mt-2 d-none d-md-inline-flex"
        >
          دسته بندی
        </v-btn>
      </template>

      <!-- Mega Menu -->
      <v-card class="mega-menu" flat max-height="400px" min-height="400px">
        <v-container fluid class="px-1" max-height="400px" min-height="380px">
          <v-row class="pl-0">
            <!-- First Column: Main Items -->
            <v-col cols="2" class="pa-0 max-height-360">
              <v-list nav class="py-0 pr-0">
                <v-list-item
                  v-for="(item, index) in items"
                  :key="index"
                  @mouseenter="hoveredItem = item"
                  :class="[
                    { 'hoverable-item': hoveredItem?.title === item.title },
                    'd-flex',
                    'flex-row',
                  ]"
                >
                  <v-list-item-title>
                    <div class="d-flex justify-space-between w-100">
                      <div class="d-flex ga-3 pa-3">
                        <span class="mdi mdi-content-cut"></span>
                        <p class="text-body-2">{{ item.title }}</p>
                      </div>
                    </div>
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </v-col>
            <v-col cols="1" class="pa-0 max-height-360">
              <v-list nav class="pa-0">
                <v-list-item
                  v-for="(item, index) in items"
                  :key="index"
                  @mouseenter="hoveredItem = item"
                  class="px-0 py-2"
                >
                  <v-list-item-title class="px-0">
                    <span
                      v-show="hoveredItem.title == item.title"
                      class="mdi mdi-chevron-double-left text-subtitle-1"
                    ></span>
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </v-col>

            <!-- Second Column: Submenu with Two-Column Wrap -->
            <v-col cols="4" class="pr-0 max-height-360">
              <div class="submenu-columns" v-if="hoveredItem?.children">
                <div
                  v-for="(group, groupIndex) in hoveredItem.children"
                  :key="groupIndex"
                  class="submenu-group"
                >
                  <div class="d-flex ga-3 mb-1">
                    <span
                      class="mdi mdi-circle text-pink text-subtitle-2"
                    ></span>
                    <p class="submenu-header text-body-2 text-no-wrap">
                      {{ group.header }}
                    </p>
                  </div>

                  <Nuxtlink
                    v-for="(subItem, subIndex) in group.items"
                    :key="subIndex"
                  >
                    <p class="submenu-item">{{ subItem }}</p>
                  </Nuxtlink>
                </div>
              </div>
            </v-col>

            <!-- Third Column: Image Section -->
            <v-col cols="5" class="d-flex max-height-360">
              <v-row>
                <v-col cols="6" class="d-flex flex-column ga-6">
                  <v-row class="justify-end py-1 pl-6">
                    <v-img
                      v-if="hoveredItem?.image"
                      :src="hoveredItem.image"
                      cover
                      max-height="165px"
                      class="CategoryImage max-width-80"
                    ></v-img>
                  </v-row>
                  <v-row class="justify-end py-1 pl-6 mt-0">
                    <v-img
                      v-if="hoveredItem?.image"
                      :src="hoveredItem.image"
                      cover
                      max-height="165px"
                      class="CategoryImage max-width-80"
                    ></v-img>
                  </v-row>
                </v-col>
                <v-col cols="6" class="pa-1 d-flex justify-end">
                  <v-img
                    v-if="hoveredItem?.image"
                    :src="hoveredItem.image"
                    class="h-100 w-100 CategoryImage"
                    cover
                    max-height="350px"
                  ></v-img>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-container>
      </v-card>
    </v-menu>

    <!--  Contact us   -->
    <v-btn
      class="mt-2 d-none d-md-inline-flex"
      prepend-icon="mdi-phone-in-talk-outline"
      variant="text"
    >
      ارتباط با ما
    </v-btn>

    <!--  About us   -->
    <v-btn
      class="mt-2 d-none d-md-inline-flex"
      prepend-icon="mdi-information-slab-circle-outline"
      variant="text"
    >
      درباره ما
    </v-btn>
  </v-container>
</template>

<script setup>
const user = useCookie("user");

const { data: categoriesResponse } = await useAsyncData(
  "header-categories",
  async () => {
    try {
      return await useApiService.get("/categories/menu");
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      return [];
    }
  },
  {
    default: () => [],
    server: true,
  }
);

const items = categoriesResponse.value || [];

const hoveredItem = ref(items[0] || null);

const openProfile = () => {
  if (user.value) {
    switch (user.value.role) {
      case "admin":
        navigateTo("/admin-dashboard");
        break;
      case "user":
        navigateTo("/dashboard");
        break;
    }
  } else {
    navigateTo("/login");
  }
};
</script>

<style scoped>
.textSmall {
  font-size: 0.85em;
  display: inline-block;
}
.mega-menu {
  min-width: 900px;
  background-color: white;
  padding: 16px;
  z-index: 1000;
  border-radius: 20px !important;
}

.hoverable-item {
  background-color: #f4f4f4;
  cursor: pointer;
  border-radius: 10px !important;
}

/* 2 columns, grouped headers stay together */
.submenu-columns {
  column-count: 2;
  column-gap: 24px;
}

.submenu-group {
  break-inside: avoid;
  margin-bottom: 1rem;
}

.submenu-header {
  color: #000000;
}

.submenu-item {
  margin: 0 0 0.25rem 0;
  color: #42424299;
  cursor: pointer;
  padding: 4px;
  font-size: 13px;
  font-weight: 400;
  padding-right: 26px;
}

.submenu-item:hover {
  cursor: pointer;
  color: #424242;
}
:deep(.v-list-item__content) {
  width: 100%;
}
.CategoryImage {
  border-radius: 14px;
}
.max-width-80 {
  max-width: 80%;
}
:deep(.v-overlay__content) {
  width: 90% !important;
  top: 170px !important;
  right: 70px !important;
}
.top-black-border {
  width: 100px;
  height: 2px;
  position: absolute;
  background: black;
  z-index: 10000;
  right: 3%;
}
:deep(.v-list-item--density-default) {
  min-height: 48px !important;
  height: 48px !important;
  max-height: 48px !important;
}
.max-height-360 {
  max-height: 360px !important;
  min-height: 360px !important;
}
</style>
