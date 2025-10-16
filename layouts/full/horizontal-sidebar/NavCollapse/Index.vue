<script setup>
import NavItem from '../NavItem/Index.vue';
// import Icon from '../../vertical-sidebar/Icon.vue';
import { Icon } from '@iconify/vue';
const props = defineProps({ item: Object, level: Number });
</script>

<template>
    <!---Dropdown  -->
    <a :class="'navItemLink rounded-pill cursor-pointer bg-hover-' + item.BgColor" :disabled="item.disabled">
        <!---Icon  -->

        <!---Title  -->
        <span class="" v-if="level > 0">
            <div class="z-index-1 "><span class="sublink-dot mr-4"></span> {{ $t(item.title) }}</div>
        </span>
        <span v-else>
            <span class="icon-box">
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
        <i class="ddIcon ml-2 z-index-1 d-flex align-center">
            <ChevronDownIcon size="15" />
        </i>
    </a>
    <!---Sub Item-->
    <ul :class="`ddMenu ddLevel-${level + 1}`">
        <li v-for="(subitem, i) in item.children" :key="i" v-if="item.children" class="navItem">
            <Index :item="subitem" v-if="subitem.children" :level="level + 1" />
            <NavItem :item="subitem" :level="level + 1" v-else></NavItem>
        </li>
    </ul>
    <!---End Item Sub Header --></template>
