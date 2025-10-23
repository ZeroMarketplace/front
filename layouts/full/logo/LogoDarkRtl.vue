<script setup lang="ts">
import { RouterLink } from 'vue-router';

</script>
<template>
    <div class="logo ">
        <RouterLink to="/">
            <v-img src="/img/logo.svg" width="100" height="50" alt="Logo" contain eager />
        </RouterLink>
    </div>
</template>
