<template>
  <v-card class="spike-card" elevation="10">
    <v-card-item>
      <div class="d-flex justify-space-between align-center mb-6">
        <h5 class="text-20">افزودن فاکتور خرید جدید</h5>
        <v-btn
          color="error"
          variant="flat"
          rounded="pill"
          to="/purchase-invoices"
        >
          <Icon icon="solar:arrow-right-linear" height="18" class="ml-2" />
          بازگشت به لیست
        </v-btn>
      </div>

      <div class="bg-bglight pa-6 rounded-md">
        <AddPurchaseInvoice
          ref="formRef"
          @exit="handleExit"
          @refresh="handleRefresh"
        />
      </div>
    </v-card-item>
  </v-card>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { Icon } from "@iconify/vue";
import AddPurchaseInvoice from "~/components/purchase-invoices/AddPurchaseInvoice.vue";

definePageMeta({
  layout: "admin-spike",
  middleware: "auth",
  requiresAuth: true,
  requiresRole: "admin",
});

const router = useRouter();
const formRef = ref(null);

const handleExit = () => {
  router.push("/purchase-invoices");
};

const handleRefresh = () => {
  // Optionally refresh data or perform other actions
};
</script>
