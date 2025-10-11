<script setup>
import { Icon } from '@iconify/vue';
const props = defineProps({ item: Object, level: Number });
</script>

<template>
    <!---Single Item-->
    <router-link :to="`${item.to}`" :class="'navItemLink text-grey200 bg-hover-' + item.BgColor" :color="item.BgColor"
        :disabled="item.disabled">

         <!---Title  -->
         <span class="" v-if="level > 0">
            <div class="z-index-1 d-flex align-center">
                <span class="sublink-dot mr-4"></span>
                <span>{{ $t(item.title) }}</span>
            </div>
        </span>
        <span v-else>
            <span class="icon-box" :class="'text-' + item.BgColor">
                <i class="navIcon">
                    <Icon :icon="'solar:' + item.icon" height="24" width="24" :level="level"
                    :class="'position-relative z-index-2 texthover-' + item.BgColor" />
                </i>
                <span class="z-index-1  ml-3">{{ $t(item.title) }}</span>
            </span>
        </span>
        <!---If Caption-->
        <small v-if="item.subCaption" class="text-caption mt-n1 hide-menu">
            {{ item.subCaption }}
        </small>
        <!---If any chip or label-->
        <template v-if="item.chip">
            <v-chip :color="item.chipColor" :class="'sidebarchip hide-menu ml-auto bg-' + item.BgColor"
                :size="item.chipIcon ? 'small' : 'small'" :variant="item.chipVariant" :prepend-icon="item.chipIcon">
                {{ item.chip }}
            </v-chip>
        </template>
    </router-link>
</template>
