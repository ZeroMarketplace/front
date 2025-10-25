<template>
  <v-card elevation="10">
    <v-card-item>
      <div class="d-flex justify-space-between align-center mb-6">
        <h5 class="text-20">ویرایش فاکتور خرید</h5>
        <v-btn color="error" variant="flat" rounded="pill" to="/purchase-invoices">
          <Icon icon="solar:arrow-right-linear" height="18" class="ml-2" />
          بازگشت به لیست
        </v-btn>
      </div>

      <Loading :loading="loading" />

      <div v-if="!loading" class="bg-bglight pa-6 rounded-md">
        <AddPurchaseInvoice ref="formRef" @exit="handleExit" @refresh="handleRefresh" />
      </div>
    </v-card-item>
  </v-card>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useNuxtApp } from "#app";
import { Icon } from "@iconify/vue";
import AddPurchaseInvoice from "~/components/purchase-invoices/AddPurchaseInvoice.vue";
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
    const data = await useApiService.get(
      `purchase-invoices/${route.params.id}`
    );
    if (data && formRef.value) {
      formRef.value.setEdit(data);
    }
  } catch (error) {
    $notify("مشکلی در بارگذاری داده‌ها پیش آمد", "error");
    router.push("/purchase-invoices");
  } finally {
    loading.value = false;
  }
};

const handleExit = () => {
  router.push("/purchase-invoices");
};

const handleRefresh = () => {
  // Optionally refresh data or perform other actions
};

onMounted(() => {
  loadData();
});
</script>
