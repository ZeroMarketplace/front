<template>
    <v-card class="spike-card" elevation="10">
        <v-card-item>
            <div class="d-flex justify-space-between align-center mb-6">
                <h5 class="text-20">جزئیات سند حسابداری</h5>
                <div class="d-flex ga-2">
                    <v-btn color="primary" variant="flat" rounded="pill"
                        :to="`/accounting-documents/edit/${route.params.id}`">
                        <Icon icon="solar:pen-linear" height="18" class="ml-2" />
                        ویرایش
                    </v-btn>
                    <v-btn color="error" variant="flat" rounded="pill" to="/accounting-documents">
                        <Icon icon="solar:arrow-right-linear" height="18" class="ml-2" />
                        بازگشت
                    </v-btn>
                </div>
            </div>

            <Loading :loading="loading" />

            <div v-if="!loading && document" class="bg-bglight pa-6 rounded-md">
                <!-- Document Information -->
                <div class="mb-6">
                    <h6 class="text-h6 mb-4">
                        <Icon icon="solar:info-circle-linear" class="me-2" />
                        مشخصات سند
                    </h6>
                    <v-row>
                        <v-col cols="12" md="4">
                            <div class="mb-2">
                                <span class="font-weight-semibold">کد سند:</span>
                                <span class="mr-2">{{ document.code || '-' }}</span>
                            </div>
                        </v-col>
                        <v-col cols="12" md="4">
                            <div class="mb-2">
                                <span class="font-weight-semibold">تاریخ:</span>
                                <span class="mr-2">{{ formatDate(document.dateTime) }}</span>
                            </div>
                        </v-col>
                        <v-col cols="12" md="4">
                            <div class="mb-2">
                                <span class="font-weight-semibold">وضعیت:</span>
                                <v-chip :color="document.status ? 'success' : 'error'" size="small" class="mr-2"
                                    rounded="pill">
                                    {{ document.status ? 'فعال' : 'غیرفعال' }}
                                </v-chip>
                            </div>
                        </v-col>
                        <v-col cols="12" v-if="document.description">
                            <div class="mb-2">
                                <span class="font-weight-semibold">توضیحات:</span>
                                <p class="mt-2">{{ document.description }}</p>
                            </div>
                        </v-col>
                    </v-row>
                </div>

                <v-divider class="my-6" />

                <!-- Accounts Involved -->
                <div>
                    <h6 class="text-h6 mb-4">
                        <Icon icon="solar:wallet-linear" class="me-2" />
                        حساب‌های درگیر
                    </h6>

                    <v-table class="spike-table">
                        <thead>
                            <tr>
                                <th class="text-subtitle-1 font-weight-semibold">حساب</th>
                                <th class="text-subtitle-1 font-weight-semibold">توضیحات</th>
                                <th class="text-subtitle-1 font-weight-semibold text-center">بدهکار</th>
                                <th class="text-subtitle-1 font-weight-semibold text-center">بستانکار</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(account, index) in document.accountsInvolved" :key="index">
                                <td class="text-subtitle-1">
                                    {{ getAccountName(account._account) }}
                                </td>
                                <td class="text-subtitle-1">{{ account.description || '-' }}</td>
                                <td class="text-subtitle-1 text-center bg-red-lighten-5">
                                    {{ formatNumber(account.debit) }}
                                </td>
                                <td class="text-subtitle-1 text-center bg-green-lighten-5">
                                    {{ formatNumber(account.credit) }}
                                </td>
                            </tr>
                            <tr class="font-weight-bold bg-bglight">
                                <td colspan="2" class="text-subtitle-1 text-center">جمع کل</td>
                                <td class="text-subtitle-1 text-center bg-red-lighten-5">{{ formatNumber(totalDebit) }}
                                </td>
                                <td class="text-subtitle-1 text-center bg-green-lighten-5">{{ formatNumber(totalCredit)
                                    }}</td>
                            </tr>
                        </tbody>
                    </v-table>

                    <div v-if="!isBalanced" class="mt-4">
                        <v-alert color="warning" variant="tonal">
                            <div class="d-flex align-center">
                                <Icon icon="solar:danger-triangle-linear" height="24" class="me-2" />
                                <span>اختلاف: {{ formatNumber(difference) }} تومان</span>
                            </div>
                        </v-alert>
                    </div>
                </div>

                <!-- Files Section -->
                <div v-if="document.files && document.files.length > 0" class="mt-6">
                    <v-divider class="my-6" />
                    <h6 class="text-h6 mb-4">
                        <Icon icon="solar:gallery-linear" class="me-2" />
                        پیوست‌ها
                    </h6>
                    <v-row>
                        <v-col v-for="(file, index) in document.files" :key="index" cols="6" sm="4" md="3" lg="2">
                            <v-card elevation="2">
                                <v-img :src="getFileUrl(file)" aspect-ratio="1" cover class="rounded" />
                            </v-card>
                        </v-col>
                    </v-row>
                </div>
            </div>

            <EmptyList v-if="!loading && !document" />
        </v-card-item>
    </v-card>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useNuxtApp } from '#app';
import { Icon } from '@iconify/vue';
import Loading from '~/components/Loading.vue';
import EmptyList from '~/components/EmptyList.vue';

definePageMeta({
    layout: 'admin-spike',
    middleware: 'auth',
    requiresAuth: true,
    requiresRole: 'admin'
});

const route = useRoute();
const router = useRouter();
const { $notify } = useNuxtApp();
const config = useRuntimeConfig();
const loading = ref(true);
const document = ref(null);

const totalDebit = computed(() => {
    if (!document.value?.accountsInvolved) return 0;
    return document.value.accountsInvolved.reduce((sum, acc) => sum + (Number(acc.debit) || 0), 0);
});

const totalCredit = computed(() => {
    if (!document.value?.accountsInvolved) return 0;
    return document.value.accountsInvolved.reduce((sum, acc) => sum + (Number(acc.credit) || 0), 0);
});

const difference = computed(() => {
    return Math.abs(totalDebit.value - totalCredit.value);
});

const isBalanced = computed(() => {
    return totalDebit.value === totalCredit.value;
});

const formatDate = (dateTime) => {
    if (!dateTime) return '-';
    try {
        const date = new Date(dateTime);
        return new Intl.DateTimeFormat('fa-IR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    } catch {
        return dateTime;
    }
};

const formatNumber = (num) => {
    if (!num && num !== 0) return '-';
    return new Intl.NumberFormat('fa-IR').format(num);
};

const getAccountName = (accountId) => {
    // This would ideally fetch from a store or API
    // For now, just return the ID
    return accountId || '-';
};

const getFileUrl = (fileName) => {
    if (!fileName) return '';
    return config.public.STATICS_URL + fileName;
};

const loadDocument = async () => {
    loading.value = true;
    try {
        const documentId = route.params.id;
        const data = await useApiService.get(`accounting-documents/${documentId}`);
        document.value = data;
    } catch (error) {
        $notify('مشکلی در بارگذاری اطلاعات سند پیش آمد', 'error');
        router.push('/accounting-documents');
    } finally {
        loading.value = false;
    }
};

onMounted(() => {
    loadDocument();
});
</script>

<style scoped lang="scss">
@import '@/assets/scss/spike-theme.scss';
</style>
