<script setup lang="ts">
import { RouterLink } from 'vue-router';
</script>
<template>
    <div class="logo">
        <RouterLink to="/">
            <img src="/img/logo.svg" width="30" height="30" alt="Logo" style="object-fit: contain;" eager />
        </RouterLink>
    </div>
</template>
