<script setup lang="ts">
import { notifications } from '@/_mockApis/headerData';
import { Icon } from '@iconify/vue';
</script>
<template>
    <!-- ---------------------------------------------- -->
    <!-- notifications DD -->
    <!-- ---------------------------------------------- -->
    <v-menu :close-on-content-click="false" class="notification_popup">
        <template v-slot:activator="{ props }">

            <v-btn icon flat v-bind="props" size="small" class="custom-hover-primary">

                <div class="position-realtive">
                    <div class="notify">
                        <span class="heartbit"></span> <span class="point"></span>
                    </div>
                    <Icon icon="solar:bell-bing-line-duotone" height="24" width="24" />
                </div>
            </v-btn>

        </template>
        <v-sheet rounded="lg" width="385" elevation="10" class="mt-5 dropdown-box">
            <div class="px-8 pb-4 pt-6">
                <div class="d-flex align-center">
                    <h6 class="text-h5 font-weight-semibold">Notifications</h6>
                    <v-chip color="primary" variant="flat" size="x-small" class="text-white ml-4" rounded="xl">5
                        New</v-chip>
                </div>
            </div>
            <perfect-scrollbar style="height:300px">
                <v-list class="py-0 theme-list" lines="two">
                    <v-list-item v-for="item in notifications" :key="item.title" :value="item" color="primary"
                        class="py-4 px-8">
                        <template v-slot:prepend>
                            <v-avatar size="48">
                                <v-img :src="item.avatar" width="48" :alt="item.avatar" />
                            </v-avatar>
                        </template>
                        <div>
                            <h6 class="text-h6 font-weight-medium mb-1">{{ item.title }}</h6>
                        </div>
                        <p class="text-subtitle-1 font-weight-medium text-grey100">{{ item.subtitle }}</p>
                    </v-list-item>
                    <v-divider></v-divider>
                </v-list>
            </perfect-scrollbar>
            <div class="py-4 px-6 text-center">
                <v-btn color="primary" size="large" rounded="pill" block>See all Notifications</v-btn>
            </div>
        </v-sheet>
    </v-menu>
</template>
