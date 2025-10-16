<script setup>
import Icon from '../Icon.vue';

const props = defineProps({ item: Object, level: Number });
</script>

<template>

    <div class="mb-0">
    <!---Single Item-->
    <v-list-item
        :to="item.to"
        rounded="lg"
        class=""
        color=""
        :ripple="false"
        :disabled="item.disabled"
        :target="item.type === 'external' ? '_blank' : ''"
    >
        <!---If icon-->
        <template v-slot:prepend >
            <!-- <CircleIcon size="15" stroke-width="1.5"  class="ml-1" width="30" /> -->
            <div class="sublink-dot ml-4"></div>
        </template>
        <v-list-item-title class="ml-4 text-body-1">{{ $t(item.title) }}</v-list-item-title>
        <!---If Caption-->
        <v-list-item-subtitle v-if="item.subCaption" class="text-caption mt-n1 hide-menu">
            {{ item.subCaption }}
        </v-list-item-subtitle>
        
        <!---If any chip or label-->
        <template v-slot:append v-if="item.chip">
            <v-chip
                :color="item.chipColor"
                :class="'sidebarchip hide-menu bg-'+item.chipBgColor"
                :size="item.chipIcon ? 'small' : 'small'"
                :variant="item.chipVariant"
                :prepend-icon="item.chipIcon"
            >
                {{ item.chip }}
            </v-chip>
        </template>
    </v-list-item>

</div>
</template>
