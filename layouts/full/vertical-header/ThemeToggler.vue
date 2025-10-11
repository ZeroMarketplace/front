<script setup lang="ts">
import { ref } from 'vue';
import { useTheme } from 'vuetify';
import { useCustomizerStore } from '@/stores/customizer';
import { Icon } from '@iconify/vue';
const theme = useTheme();
const customizer = useCustomizerStore();

// template skin color options
const themeColors = ref([
    {
        name: 'BLUE_THEME',
        bg: 'togglethemeBlue'
    },
    {
        name: 'DARK_BLUE_THEME',
        bg: 'togglethemeDarkBlue'
    }
]);
</script>

<template>
    <div class="position-relative">
        <v-item-group mandatory v-model="customizer.actTheme" class="d-flex">
            <div v-for="theme in themeColors" :key="theme.name">
                <v-item v-slot="{ toggle }" :value="theme.name">
                    <v-btn icon :class="theme.bg" class="custom-hover-primary" variant="text" size="small"  @click="toggle">
                        <Icon icon="solar:sun-outline" height="22" width="22" v-if="theme.bg == 'togglethemeBlue'" :class="theme.bg" />
                        <Icon icon="solar:moon-outline" height="22" width="22" v-if="theme.bg == 'togglethemeDarkBlue'" :class="theme.bg" />
                    </v-btn>
                </v-item>
            </div>
        </v-item-group>
    </div>
</template>
