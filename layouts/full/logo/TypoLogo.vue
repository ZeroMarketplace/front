<script setup lang="ts">
import { RouterLink } from 'vue-router';
</script>
<template>
    <div class="logo">
        <RouterLink to="/">
            <img  src="/img/TypoLogo.svg" width="50" height="50" alt="Logo" style="object-fit: contain;" lazy-src transition="fade-transition" eager/>
        </RouterLink>
    </div>
</template>
