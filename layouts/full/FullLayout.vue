<script setup lang="ts">
import VerticalSidebarVue from "./vertical-sidebar/VerticalSidebar.vue";
import VerticalHeaderVue from "./vertical-header/VerticalHeader.vue";
import HorizontalHeader from "./horizontal-header/HorizontalHeader.vue";
import HorizontalSidebar from "./horizontal-sidebar/HorizontalSidebar.vue";
import Customizer from "./customizer/Customizer.vue";
import { useCustomizerStore } from "../../stores/customizer";


const customizer = useCustomizerStore();
</script>

<template>
  <!-----RTL LAYOUT------->
  <v-locale-provider v-if="customizer.setRTLLayout" rtl>
    <v-app :theme="customizer.actTheme" :class="[
      customizer.actTheme,
      customizer.mini_sidebar ? 'mini-sidebar' : '',
      customizer.setHorizontalLayout ? 'horizontalLayout' : 'verticalLayout',
      customizer.setBorderCard ? 'cardBordered' : '',
    ]">
      <v-theme-provider theme="spikeLight">
        <!---Customizer location left side--->
        <v-navigation-drawer app temporary elevation="10" location="left" v-model="customizer.Customizer_drawer"
          width="320" class="left-customizer">
          <!-- <Customizer /> -->
        </v-navigation-drawer>
        <VerticalSidebarVue v-if="!customizer.setHorizontalLayout" />
        <div :class="customizer.boxed ? 'maxWidth' : 'full-header'">
          <VerticalHeaderVue v-if="!customizer.setHorizontalLayout" />
        </div>
        <div :class="customizer.boxed ? 'maxWidth' : 'full-header'">
          <HorizontalHeader v-if="customizer.setHorizontalLayout" />
        </div>
        <HorizontalSidebar v-if="customizer.setHorizontalLayout" />

        <v-main>
          <div class="rtl-lyt mb-3 hr-layout">
            <v-container fluid class="page-wrapper px-sm-5 px-4 pt-12 ">
              <div>
                <div :class="customizer.boxed ? 'maxWidth' : ''">
                  <NuxtPage />
                </div>
              </div>
            </v-container>
          </div>
        </v-main>

        <!-- Notification System -->
        <Notifier />
      </v-theme-provider>
    </v-app>
  </v-locale-provider>



</template>
<style lang="scss">
@import "../../assets/scss/layout/_rtl";
@import "../../assets/scss/layout/_topbar";
</style>
