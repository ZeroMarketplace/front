<template>
    <v-card class="spike-card" elevation="10">
        <v-card-item>
            <h5 class="text-20 mb-7">مدیریت حساب‌ها</h5>

            <!-- Summary Cards -->
            <v-row class="d-flex flex-nowrap">
                <v-col cols="10" md="3" sm="6">
                    <div class="pa-6 d-flex ga-3 align-center cursor-pointer rounded-xl"
                        :class="activeFilter === 'all' ? 'bg-bglight' : 'bg-containerBg'" @click="setFilter('all')">
                        <v-avatar size="56" class="border border-md border-primary">
                            <Icon icon="solar:wallet-linear" height="25" class="text-primary" />
                        </v-avatar>
                        <div>
                            <h6 class="text-h6">همه حساب‌ها</h6>
                            <p class="text-14 lh-normal">{{ totalCounts.all }} حساب</p>
                        </div>
                    </div>
                </v-col>

                <v-col cols="10" md="3" sm="6">
                    <div class="pa-6 d-flex ga-3 align-center cursor-pointer rounded-xl"
                        :class="activeFilter === 'bank' ? 'bg-bglight' : 'bg-containerBg'" @click="setFilter('bank')">
                        <v-avatar size="56" class="border border-md border-info">
                            <Icon icon="solar:bank-linear" height="25" class="text-info" />
                        </v-avatar>
                        <div>
                            <h6 class="text-h6">حساب‌های بانکی</h6>
                            <p class="text-14 lh-normal">{{ totalCounts.bank }} حساب</p>
                        </div>
                    </div>
                </v-col>

                <v-col cols="10" md="3" sm="6">
                    <div class="pa-6 d-flex ga-3 align-center cursor-pointer rounded-xl"
                        :class="activeFilter === 'cash' ? 'bg-bglight' : 'bg-containerBg'" @click="setFilter('cash')">
                        <v-avatar size="56" class="border border-md border-success">
                            <Icon icon="solar:cash-out-linear" height="25" class="text-success" />
                        </v-avatar>
                        <div>
                            <h6 class="text-h6">حساب‌های نقدی</h6>
                            <p class="text-14 lh-normal">{{ totalCounts.cash }} حساب</p>
                        </div>
                    </div>
                </v-col>

                <v-col cols="10" md="3" sm="6">
                    <div class="pa-6 d-flex ga-3 align-center cursor-pointer rounded-xl"
                        :class="activeFilter === 'other' ? 'bg-bglight' : 'bg-containerBg'" @click="setFilter('other')">
                        <v-avatar size="56" class="border border-md border-warning">
                            <Icon icon="solar:settings-linear" height="25" class="text-warning" />
                        </v-avatar>
                        <div>
                            <h6 class="text-h6">سایر حساب‌ها</h6>
                            <p class="text-14 lh-normal">{{ totalCounts.other }} حساب</p>
                        </div>
                    </div>
                </v-col>
            </v-row>

            <!-- Search and Actions -->
            <div class="d-sm-flex justify-space-between align-center my-7">
                <v-sheet width="255" class="mb-lg-0 mb-4">
                    <v-text-field v-model="searchValue" label="جستجوی حساب..." variant="outlined" hide-details
                        density="compact">
                        <template v-slot:prepend-inner>
                            <Icon icon="solar:magnifer-linear" height="18" width="25" />
                        </template>
                    </v-text-field>
                </v-sheet>
                <v-btn color="primary" rounded="pill" flat to="/accounts/create">
                    حساب جدید
                </v-btn>
            </div>

            <!-- Loading -->
            <Loading :loading="loading" />

            <!-- Data Table -->
            <v-table class="spike-table month-table" v-if="!loading && filteredList.length">
                <template v-slot:default>
                    <thead>
                        <tr>
                            <th class="text-subtitle-1 font-weight-semibold">نوع</th>
                            <th class="text-subtitle-1 font-weight-semibold">عنوان</th>
                            <th class="text-subtitle-1 font-weight-semibold">موجودی</th>
                            <th class="text-subtitle-1 font-weight-semibold">پیش‌فرض</th>
                            <th class="text-subtitle-1 font-weight-semibold text-center">عملیات</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="item in filteredList" :key="item._id" class="month-item">
                            <td>
                                <div class="d-flex align-center ga-2">
                                    <v-avatar size="32" :color="getTypeColor(item.type)">
                                        <Icon :icon="getTypeIcon(item.type)" height="18"
                                            :class="getTypeTextColor(item.type)" />
                                    </v-avatar>
                                    <v-chip class="spike-chip" :color="getTypeColor(item.type)" variant="tonal"
                                        size="small" label>
                                        {{ getTypeLabel(item.type) }}
                                    </v-chip>
                                </div>
                            </td>
                            <td class="text-subtitle-1">{{ item.title || 'بدون عنوان' }}</td>
                            <td class="text-subtitle-1 font-weight-semibold">{{ formatters.price(item.balance) }} تومان
                            </td>
                            <td>
                                <v-chip class="spike-chip" :color="item.defaultFor ? 'warning' : 'grey'" variant="tonal"
                                    size="small" label>
                                    {{ item.defaultFor ? 'پیش‌فرض' : 'عادی' }}
                                </v-chip>
                            </td>
                            <td>
                                <div class="d-flex ga-3 align-center justify-center">
                                    <RouterLink :to="`/accounts/edit/${item._id}`" v-if="item.type !== 'system'">
                                        <v-avatar color="lightsuccess" size="32">
                                            <Icon icon="solar:pen-linear" class="text-success" height="18" />
                                        </v-avatar>
                                        <v-tooltip activator="parent" location="bottom">
                                            ویرایش
                                        </v-tooltip>
                                    </RouterLink>

                                    <RouterLink to="" @click.stop="handleSetDefault(item)"
                                        v-if="item.type !== 'system'">
                                        <v-avatar :color="item.defaultFor ? 'lightwarning' : 'lightprimary'" size="32">
                                            <Icon :icon="item.defaultFor ? 'solar:star-bold' : 'solar:star-linear'"
                                                :class="item.defaultFor ? 'text-warning' : 'text-primary'"
                                                height="18" />
                                        </v-avatar>
                                        <v-tooltip activator="parent" location="bottom">
                                            {{ item.defaultFor ? 'حذف پیش‌فرض' : 'تنظیم پیش‌فرض' }}
                                        </v-tooltip>
                                    </RouterLink>

                                    <RouterLink to="" @click.stop="handleDelete(item._id)"
                                        v-if="item.type !== 'system'">
                                        <v-avatar color="lighterror" size="32">
                                            <Icon icon="solar:trash-bin-minimalistic-linear" class="text-error"
                                                height="18" />
                                        </v-avatar>
                                        <v-tooltip activator="parent" location="bottom">
                                            حذف
                                        </v-tooltip>
                                    </RouterLink>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </template>
            </v-table>

            <!-- Pagination -->
            <v-pagination v-if="pageCount > 1" class="mt-5" v-model="page" :length="pageCount" rounded="circle" />

            <!-- Empty List -->
            <EmptyList :list="filteredList" :loading="loading" />

            <!-- Delete Confirmation Dialog -->
            <v-dialog v-model="showDeleteDialog" max-width="400">
                <v-card>
                    <v-card-title class="text-h6">تأیید حذف</v-card-title>
                    <v-card-text>
                        آیا از حذف این حساب اطمینان دارید؟ این عمل قابل بازگشت نیست.
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer />
                        <v-btn color="grey" variant="text" @click="showDeleteDialog = false">
                            انصراف
                        </v-btn>
                        <v-btn color="error" variant="flat" @click="confirmDelete">
                            حذف
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </v-card-item>
    </v-card>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useNuxtApp } from "#app";
import { Icon } from "@iconify/vue";

definePageMeta({
    layout: "admin-spike",
    middleware: "auth",
    requiresAuth: true,
    requiresRole: "admin",
});

// State
const loading = ref(true);
const list = ref([]);
const searchValue = ref("");
const activeFilter = ref("all");
const showDeleteDialog = ref(false);
const deleteId = ref(null);
const { $notify } = useNuxtApp();
const page = ref(1);
const perPage = ref(10);
const pageCount = ref(1);

// Computed
const filteredList = computed(() => {
    let filtered = list.value;

    // Filter by search
    if (searchValue.value) {
        filtered = filtered.filter(item =>
            item.title?.toLowerCase().includes(searchValue.value.toLowerCase())
        );
    }

    // Filter by type
    if (activeFilter.value !== "all") {
        if (activeFilter.value === "other") {
            filtered = filtered.filter(item =>
                !["bank", "cash"].includes(item.type)
            );
        } else {
            filtered = filtered.filter(item => item.type === activeFilter.value);
        }
    }

    return filtered;
});

const totalCounts = computed(() => {
    return {
        all: list.value.length,
        bank: list.value.filter(item => item.type === "bank").length,
        cash: list.value.filter(item => item.type === "cash").length,
        other: list.value.filter(item => !["bank", "cash"].includes(item.type)).length,
    };
});

// Methods
const getAccounts = async () => {
    loading.value = true;
    try {
        const data = await useApiService.get("accounts");
        list.value = data.list || data;
        pageCount.value = Math.ceil((data.total || data.length) / perPage.value);
        $notify("حساب‌ها با موفقیت بارگذاری شدند", "success");
    } catch (error) {
        $notify("مشکلی در بارگذاری داده‌ها پیش آمد", "error");
    } finally {
        loading.value = false;
    }
};

const setFilter = (filter) => {
    activeFilter.value = filter;
};

const getTypeIcon = (type) => {
    const icons = {
        bank: "solar:bank-linear",
        cash: "solar:cash-out-linear",
        expense: "solar:minus-circle-linear",
        income: "solar:add-circle-linear",
        system: "solar:settings-linear"
    };
    return icons[type] || "solar:wallet-linear";
};

const getTypeColor = (type) => {
    const colors = {
        bank: "info",
        cash: "success",
        expense: "error",
        income: "success",
        system: "secondary"
    };
    return colors[type] || "primary";
};

const getTypeTextColor = (type) => {
    const colors = {
        bank: "text-info",
        cash: "text-success",
        expense: "text-error",
        income: "text-success",
        system: "text-secondary"
    };
    return colors[type] || "text-primary";
};

const getTypeLabel = (type) => {
    const labels = {
        bank: "بانکی",
        cash: "نقدی",
        expense: "هزینه",
        income: "درآمد",
        system: "سیستمی"
    };
    return labels[type] || "نامشخص";
};

const handleSetDefault = async (item) => {
    try {
        await useApiService.put(`accounts/default/${item._id}`, {});
        $notify("تنظیمات پیش‌فرض با موفقیت تغییر کرد", "success");
        await getAccounts();
    } catch (error) {
        $notify("مشکلی در تغییر تنظیمات پیش‌فرض پیش آمد", "error");
    }
};

const handleDelete = (id) => {
    deleteId.value = id;
    showDeleteDialog.value = true;
};

const confirmDelete = async () => {
    try {
        await useApiService.remove(`accounts/${deleteId.value}`);
        $notify("حساب با موفقیت حذف شد", "success");
        await getAccounts();
    } catch (error) {
        $notify("مشکلی در حذف حساب پیش آمد", "error");
    } finally {
        showDeleteDialog.value = false;
        deleteId.value = null;
    }
};

// Watch
watch(page, () => {
    getAccounts();
});

// Lifecycle
onMounted(() => {
    getAccounts();
});
</script>