<template>
  <v-card class="spike-card" elevation="10">
    <v-card-item>
      <h5 class="text-20 mb-7">ویرایش انبار</h5>

      <v-form ref="formRef" v-model="valid" validate-on="submit lazy" @submit.prevent="submitForm"
        v-if="!loading && form._id">
        <div class="bg-bglight mt-6 pa-6 rounded-md">
          <v-row>
            <v-col cols="12" md="4">
              <v-label class="font-weight-semibold pb-2">عنوان انبار</v-label>
              <v-text-field v-model="form.title" :rules="rules" required hide-details
                placeholder="عنوان انبار را وارد کنید" />
            </v-col>

            <v-col cols="12" md="4">
              <v-label class="font-weight-semibold pb-2">تنظیمات</v-label>
              <div class="d-flex ga-4 mt-2">
                <v-checkbox v-model="form.onlineSales" label="فروش آنلاین" hide-details color="primary" />
                <v-checkbox v-model="form.retail" label="خرده فروشی" hide-details color="primary" />
              </div>
            </v-col>
          </v-row>
        </div>

        <div class="d-flex align-center justify-end ga-3">
          <v-btn flat color="success" type="submit" :loading="submitting" class="mt-6 text-white" rounded="pill">
            ذخیره تغییرات
          </v-btn>
          <v-btn flat color="error" to="/warehouses" class="mt-6 text-white" rounded="pill">
            انصراف
          </v-btn>
        </div>
      </v-form>

      <div v-else class="text-center py-10">
        <v-progress-circular indeterminate color="primary" />
      </div>
    </v-card-item>
  </v-card>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useNuxtApp } from '#app';

// Page meta
definePageMeta({
  layout: 'admin-spike',
  middleware: 'auth',
  requiresAuth: true,
  requiresRole: 'admin'
});

// State
const formRef = ref(null);
const valid = ref(false);
const loading = ref(true);
const submitting = ref(false);
const route = useRoute();
const router = useRouter();
const { $notify } = useNuxtApp();

const form = ref({
  _id: null,
  title: '',
  onlineSales: false,
  retail: false
});

const rules = [(v) => !!v || 'این فیلد الزامی است'];

// Methods
const getWarehouse = async () => {
  loading.value = true;
  try {
    const warehouseId = route.params.id;
    const data = await useApiService.get(`warehouses/${warehouseId}`);
    form.value = {
      _id: data._id,
      title: data.title,
      onlineSales: data.onlineSales || false,
      retail: data.retail || false
    };
  } catch (error) {
    $notify('مشکلی در بارگذاری اطلاعات انبار پیش آمد', 'error');
    router.push('/warehouses');
  } finally {
    loading.value = false;
  }
};

const submitForm = async () => {
  const { valid: isValid } = await formRef.value.validate();

  if (isValid) {
    submitting.value = true;
    try {
      await useApiService.put(`warehouses/${form.value._id}`, {
        title: form.value.title,
        onlineSales: form.value.onlineSales,
        retail: form.value.retail
      });
      $notify('انبار با موفقیت ویرایش شد', 'success');
      router.push('/warehouses');
    } catch (error) {
      $notify('مشکلی در ویرایش انبار پیش آمد', 'error');
    } finally {
      submitting.value = false;
    }
  }
};

// Watchers
watch(
  () => route.params.id,
  (newId) => {
    if (newId) {
      getWarehouse();
    }
  },
  { immediate: true }
);
</script>
