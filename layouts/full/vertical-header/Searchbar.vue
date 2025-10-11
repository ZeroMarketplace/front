<script setup>
import { IconSearch as SearchIcon } from '@tabler/icons-vue';
import { searchSugg } from '@/_mockApis/headerData';
import { Icon } from '@iconify/vue';
</script>

<template>
    <!-- ---------------------------------------------- -->
    <!-- search1 -->
    <!-- ------------------------------------------------>
    <v-menu :close-on-content-click="false" class="search_popup">
        <template v-slot:activator="{ props }">
            <div class="" v-bind="props">
                <div class="hidden-md-and-down">
                    <div class="d-flex align-center flex-fill border border-borderColor header-search rounded-pill px-5 " style="border: 1px solid #DEE6F4 !important;">
                        <Icon icon="solar:magnifer-linear" height="22" width="22" />
                        <v-text-field variant="plain" density="compact"
                            class="position-relative pt-0 ml-3 custom-placeholer-color" placeholder="Try to searching ..."
                            single-line hide-details>
                        </v-text-field>
                    </div>
                </div>
                <v-btn icon variant="text" class="custom-hover-primary ml-sm-3 search hidden-md-and-up" size="small">
                    <Icon icon="solar:magnifer-linear" height="22" width="22" />
                </v-btn>
            </div>

        </template>
        <v-sheet width="360" elevation="10" rounded="md">
            <h5 class="text-h5 mt-4 px-5 pb-4">Quick Page Links</h5>
            <div style="height: 380px">
                <v-list class="pt-0 pb-5" lines="two">
                    <v-list-item :value="item" v-for="(item, index) in searchSugg" :key="index" :to="item.href"
                        color="primary" class="px-5 py-2">
                        <h6 class="text-subtitle-1 font-weight-medium mb-1">{{ item.title }}</h6>
                        <p class="text-subtitle-2 text-medium-emphasis">{{ item.href }}</p>
                    </v-list-item>
                </v-list>
            </div>
        </v-sheet>
    </v-menu>
</template>
