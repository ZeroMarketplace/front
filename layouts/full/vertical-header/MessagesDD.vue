<script setup lang="ts">
import {notifications} from '@/_mockApis/headerData';
import { IconInbox as InboxIcon } from '@tabler/icons-vue';
</script>
<template>
    <!-- ---------------------------------------------- -->
    <!-- Messages DD -->
    <!-- ---------------------------------------------- -->
    <v-menu :close-on-content-click="false" class="messages_popup">
        <template v-slot:activator="{ props }">
            <v-btn icon class="bg-lightinfo mr-sm-3 mr-2 custom-hover-primary" flat v-bind="props" size="small">
                <v-badge color="info" content="3" offset-x="-5" offset-y="-8">
                        <InboxIcon stroke-width="2" size="20" class="text-info"/>
                    </v-badge>
                </v-btn>
        </template>
        <v-sheet rounded="lg" width="385" elevation="10" class="mt-5 dropdown-box">
            <div class="px-8 pb-4 pt-6">
                <div class="d-flex align-center">
                    <h6 class="text-h5 font-weight-semibold">Messages</h6>
                    <v-chip color="info" variant="flat" size="x-small" class="text-white ml-4" rounded="sm">5 New</v-chip>
                </div>
            </div>
            <perfect-scrollbar style="height: 300px">
                <v-list class="py-0 theme-list" lines="two">
                    <v-list-item v-for="item in notifications" :key="item.title" :value="item" color="primary" class="py-4 px-8">
                        <template v-slot:prepend>
                            <v-avatar size="45" class="mr-3">
                                <v-img :src="item.avatar" width="45" :alt="item.avatar" />
                            </v-avatar>
                        </template>
                        <div>
                            <h6 class="text-h6 font-weight-medium mb-1">{{ item.title }}</h6>
                        </div>
                        <p class="text-subtitle-1 font-weight-medium text-grey100 mb-1">{{ item.subtitle }}</p>
                        <p class="text-subtitle-2 font-weight-medium text-grey100">{{ item.time }}</p>
                    </v-list-item>
                    <v-divider></v-divider>
                </v-list>
            </perfect-scrollbar>
            <div class="py-4 px-6 text-center">
                <v-btn color="primary" size="large" block>See all Messages</v-btn>
            </div>
        </v-sheet>
    </v-menu>
</template>
