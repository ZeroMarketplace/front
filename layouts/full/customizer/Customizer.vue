<script setup lang="ts">
import { ref } from 'vue';
import { useTheme } from 'vuetify';
import { useCustomizerStore } from '@/stores/customizer';
import {IconCheck as CheckIcon}from '@tabler/icons-vue';

import { Icon } from '@iconify/vue';

const customizer = useCustomizerStore();

// themes color options
const themeColors = ref([
    {
        name: 'BLUE_THEME',
        bg: 'themeBlue'
    },
    {
        name: 'AQUA_THEME',
        bg: 'themeAqua'
    },
    {
        name: 'PURPLE_THEME',
        bg: 'themePurple'
    },
    {
        name: 'GREEN_THEME',
        bg: 'themeGreen'
    },
    {
        name: 'CYAN_THEME',
        bg: 'themeCyan'
    },
    {
        name: 'ORANGE_THEME',
        bg: 'themeOrange'
    }
]);

// Dark Theme Colors
const DarkthemeColors = ref([
    { name: 'DARK_BLUE_THEME', bg: 'themeDarkBlue' },
    { name: 'DARK_AQUA_THEME', bg: 'themeDarkAqua' },
    { name: 'DARK_PURPLE_THEME', bg: 'themeDarkPurple' },
    { name: 'DARK_GREEN_THEME', bg: 'themeDarkGreen' },
    { name: 'DARK_CYAN_THEME', bg: 'themeDarkCyan' },
    { name: 'DARK_ORANGE_THEME', bg: 'themeDarkOrange' }
]);
</script>

<!------------------------------------->
<!-- Customizer -->
<!------------------------------------->
<template>
    
        <div class="pa-6">
            <h5 class="text-h5">Settings</h5>
        </div>
        <v-divider></v-divider>
        <ClientOnly>
            <perfect-scrollbar style="height: calc(100vh - 90px)">
                <div class="pa-6">
                <h6 class="text-h6 mb-2">Sidebar Layout</h6>
                <v-btn-toggle v-model="customizer.setHorizontalLayout" color="primary" class="my-2 btn-group-custom gap-3" rounded="0" group>
                    <v-btn :value="false" variant="text" elevation="10" class="rounded-xl">
                        <Icon icon="solar:slider-vertical-minimalistic-linear" height="22" width="22" size="22" class="mr-2 icon" />
                         Vertical
                    </v-btn>
                    <v-btn :value="true" variant="text" elevation="10" class="rounded-xl">
                        <Icon icon="solar:slider-minimalistic-horizontal-outline" height="22" width="22" size="22" class="mr-2 icon" /> Horizontal
                    </v-btn>
                </v-btn-toggle>

                <!------Theme Direction------>
                <h6 class="text-h6 mt-8 mb-5">Theme Direction</h6>
                <v-btn-toggle v-model="customizer.setRTLLayout" color="primary" class="my-2 btn-group-custom gap-3" rounded="0" group>
                    <v-btn :value="false" variant="text" elevation="10" class="rounded-xl">
                        <Icon icon="solar:align-left-linear" height="22" width="22" size="22" class="mr-2 icon" /> LTR
                    </v-btn>
                    <v-btn :value="true" variant="text" elevation="10" class="rounded-xl">
                        <Icon icon="solar:align-right-linear" height="22" width="22" size="22" class="mr-2 icon" /> RTL
                    </v-btn>
                </v-btn-toggle>


                <h6 class="text-h6 mt-8 mb-5">Theme Color</h6>

                <v-item-group mandatory v-model="customizer.actTheme" class="ml-n2 v-row">
                    <v-col cols="4" v-for="theme in themeColors" :key="theme.name" class="pa-2">
                        <v-item v-slot="{ isSelected, toggle }" :value="theme.name">
                            <v-sheet
                                rounded="xl"
                                class="border cursor-pointer d-block text-center px-5 py-4 hover-btns"
                                elevation="10"
                                @click="toggle"
                            >
                                <v-avatar :class="theme.bg" size="25">
                                    <CheckIcon color="white" size="18" v-if="isSelected" />
                                </v-avatar>
                            </v-sheet>
                        </v-item>
                    </v-col>
                </v-item-group>
                <h6 class="text-h6 mt-11 mb-5">Theme Dark Color</h6>
                
                <v-item-group mandatory v-model="customizer.actTheme" class="ml-n2 v-row">
                    <v-col cols="4" v-for="theme in DarkthemeColors" :key="theme.name" class="pa-2">
                        <v-item v-slot="{ isSelected, toggle }" :value="theme.name">
                            <v-sheet
                                rounded="xl"
                                class="border cursor-pointer d-block text-center px-5 py-4 hover-btns"
                                elevation="10"
                                @click="toggle"
                            >
                                <v-avatar :class="theme.bg" size="25">
                                    <CheckIcon color="white" size="18" v-if="isSelected" />
                                </v-avatar>
                            </v-sheet>
                        </v-item>
                    </v-col>
                </v-item-group>
                <h6 class="text-h6 mt-11 mb-2">Container Option</h6>
                <v-btn-toggle v-model="customizer.boxed" color="primary" class="my-2 btn-group-custom gap-3" rounded="0" group>
                    <v-btn :value="true" variant="text" elevation="10" class="rounded-xl">
                        <Icon icon="solar:cardholder-linear" height="22" width="22" size="22" class="mr-2 icon" />
                        Boxed
                    </v-btn>
                    <v-btn :value="false" variant="text" elevation="10" class="rounded-xl">
                        <Icon icon="solar:scanner-linear" height="22" width="22" size="22" class="mr-2 icon" />
                        Full
                    </v-btn>
                </v-btn-toggle>
                <!---Horizontal demo hide this option --->
                <v-sheet v-if="customizer.setHorizontalLayout != true">
                <h6 class="text-h6 mt-11 mb-2">Sidebar Type</h6>
                <v-btn-toggle v-model="customizer.mini_sidebar" color="primary" class="my-2 btn-group-custom gap-3" rounded="0" group>
                    <v-btn :value="false" variant="text" elevation="10" class="rounded-xl">
                        <Icon icon="solar:sidebar-minimalistic-outline" height="22" width="22" size="22" class="mr-2 icon" />
                        Full
                    </v-btn>
                    <v-btn :value="true" variant="text" elevation="10" class="rounded-xl">
                        <Icon icon="solar:siderbar-outline" height="22" width="22" size="22" class="mr-2 icon" />
                        Collapse
                    </v-btn>
                </v-btn-toggle>
                </v-sheet>
                <h6 class="text-h6 mt-11 mb-2">Card with</h6>
                <v-btn-toggle v-model="customizer.setBorderCard" color="primary" class="my-2 btn-group-custom gap-3" rounded="0" group>
                    <v-btn :value="false" variant="text" elevation="10" class="rounded-xl">
                        <Icon icon="solar:library-broken" height="22" width="22" size="22" class="mr-2 icon" />
                        Shadow
                    </v-btn>
                    <v-btn :value="true" variant="text" elevation="10" class="rounded-xl">
                        
                        <Icon icon="solar:box-outline" height="22" width="22" size="22" class="mr-2 icon" />
                        Border
                    </v-btn>
                </v-btn-toggle>
            </div>
            </perfect-scrollbar>
        </ClientOnly>
   
</template>

<style lang="scss"></style>
