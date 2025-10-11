<script setup >
const props = defineProps({
    title: String,
    breadcrumbs: Array ,
    icon: String,
    text: String
});
</script>

<template>
    <v-card class="overflow-hidden mb-7" elevation="0" >
        <v-card-text class="pa-6">
            <div class="d-sm-flex d-block justify-content-between py-0 align-center">
                <h4 class="text-h4 flex-grow-1">{{ title }}</h4>
                <div>
                    <v-breadcrumbs :items="breadcrumbs" class="text-subtitle-1 font-weight-regular pa-0 ml-n1">
                        <template v-slot:divider v-if="breadcrumbs">
                            <v-icon>mdi-circle-small</v-icon>
                        </template>
                        <template v-slot:title="{ item }">
                            <h6 class="text-subtitle-1 font-weight-regular">{{ item.text }}</h6>
                        </template>
                    </v-breadcrumbs>
                </div>
            </div>
        </v-card-text>
    </v-card>
</template>

<style lang="scss">
.page-breadcrumb {
    .v-toolbar {
        background: transparent;
    }
}
</style>
