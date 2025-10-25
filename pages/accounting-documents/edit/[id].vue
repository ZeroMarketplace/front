<template>
  <v-card class="spike-card" elevation="10">
    <v-card-item>
      <div class="d-flex justify-space-between align-center mb-6">
        <h5 class="text-20">ویرایش سند حسابداری</h5>
        <v-btn color="error" variant="flat" rounded="pill" to="/accounting-documents">
          <Icon icon="solar:arrow-right-linear" height="18" class="ml-2" />
          بازگشت به لیست
        </v-btn>
      </div>

      <div class="bg-bglight pa-6 rounded-md">
        <AddAccountingDocument ref="formRef" @exit="handleExit" @refresh="handleRefresh" />
      </div>
    </v-card-item>
  </v-card>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useNuxtApp } from '#app';
import { Icon } from '@iconify/vue';
import AddAccountingDocument from '~/components/accounting-documents/AddAccountingDocument.vue';

definePageMeta({
  layout: 'admin-spike',
  middleware: 'auth',
  requiresAuth: true,
  requiresRole: 'admin'
});

const route = useRoute();
const router = useRouter();
const { $notify } = useNuxtApp();
const formRef = ref(null);

const loadDocument = async () => {
  try {
    const documentId = route.params.id;

    // Wait for component to be mounted
    await nextTick();

    if (formRef.value) {
      // The setEdit method will fetch the data itself
      await formRef.value.setEdit({ _id: documentId });
    }
  } catch (error) {
    $notify('مشکلی در بارگذاری اطلاعات سند پیش آمد', 'error');
    router.push('/accounting-documents');
  }
};

const handleExit = () => {
  router.push('/accounting-documents');
};

const handleRefresh = () => {
  // Optionally refresh data
};

onMounted(() => {
  loadDocument();
});
</script>
