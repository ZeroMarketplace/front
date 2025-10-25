<template>
    <v-card class="spike-card" elevation="10">
        <v-card-item>
            <div class="d-flex justify-space-between align-center mb-6">
                <h5 class="text-20">افزودن حساب جدید</h5>
                <v-btn color="error" variant="flat" rounded="pill" to="/accounts">
                    <Icon icon="solar:arrow-right-linear" height="18" class="ml-2" />
                    بازگشت به لیست
                </v-btn>
            </div>

            <div class="bg-bglight pa-6 rounded-md">
                <accounts-add-account @exit="handleExit" @refresh="handleRefresh" />
            </div>
        </v-card-item>
    </v-card>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { Icon } from '@iconify/vue';

// Page meta
definePageMeta({
    layout: 'admin-spike',
    middleware: 'auth',
    requiresAuth: true,
    requiresRole: 'admin'
});

const router = useRouter();

const handleExit = () => {
    router.push('/accounts');
};

const handleRefresh = () => {
    router.push('/accounts');
};
</script>