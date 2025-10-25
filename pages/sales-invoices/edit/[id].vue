<template>
  <v-card class="spike-card" elevation="10">
    <v-card-item>
      <div class="d-flex justify-space-between align-center mb-6">
        <h5 class="text-20">ویرایش فاکتور فروش</h5>
        <v-btn color="error" variant="flat" rounded="pill" to="/sales-invoices">
          <Icon icon="solar:arrow-right-linear" height="18" class="ml-2" />
          بازگشت به لیست
        </v-btn>
      </div>

      <Loading :loading="loading" />

      <div v-if="!loading" class="bg-bglight pa-6 rounded-md">
        <AddSalesInvoice ref="formRef" @exit="handleExit" @refresh="handleRefresh" />
      </div>
    </v-card-item>
  </v-card>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useNuxtApp } from "#app";
import { Icon } from "@iconify/vue";
import AddSalesInvoice from "~/components/sales-invoices/AddSalesInvoice.vue";
import Loading from "~/components/Loading.vue";

definePageMeta({
  layout: "admin-spike",
  middleware: "auth",
  requiresAuth: true,
  requiresRole: "admin",
});

const router = useRouter();
const route = useRoute();
const { $notify } = useNuxtApp();
const formRef = ref(null);
const loading = ref(true);

const loadData = async () => {
  loading.value = true;
  try {
    const data = await useApiService.get(`sales-invoices/${route.params.id}`);
    if (data && formRef.value) {
      formRef.value.setEdit(data);
    }
  } catch (error) {
    $notify("مشکلی در بارگذاری داده‌ها پیش آمد", "error");
    router.push("/sales-invoices");
  } finally {
    loading.value = false;
  }
};

const handleExit = () => {
  router.push("/sales-invoices");
};

const handleRefresh = () => {
  // Optionally refresh data or perform other actions
};

onMounted(() => {
  loadData();
});
</script>
