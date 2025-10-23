<template>
  <v-card class="spike-card" elevation="10">
    <v-card-item>
      <h5 class="text-20 mb-7">ویرایش دسته‌بندی</h5>

      <v-form ref="formRef" v-model="valid" validate-on="submit lazy" @submit.prevent="submitForm"
        v-if="!loading && form._id">
        <div class="bg-bglight mt-6 pa-6 rounded-md">
          <v-row>
            <v-col cols="12" md="4">
              <v-label class="font-weight-semibold pb-2">عنوان دسته‌بندی</v-label>
              <v-text-field v-model="form.title" :rules="rules" required hide-details
                placeholder="عنوان دسته‌بندی را وارد کنید" />
            </v-col>

            <v-col cols="12" md="4">
              <v-label class="font-weight-semibold pb-2">درصد سود</v-label>
              <v-text-field v-model="form.profitPercent" type="number" hide-details
                placeholder="درصد سود را وارد کنید" />
            </v-col>

            <v-col cols="12" md="4">
              <v-label class="font-weight-semibold pb-2">ویژگی‌ها</v-label>
              <PropertyInput v-model="form._properties" multiple chips />
            </v-col>
          </v-row>
        </div>

        <div class="d-flex align-center justify-end ga-3">
          <v-btn flat color="success" type="submit" :loading="submitting" class="mt-6 text-white" rounded="pill">
            ذخیره تغییرات
          </v-btn>
          <v-btn flat color="error" to="/categories" class="mt-6 text-white" rounded="pill">
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
import PropertyInput from '~/components/properties/PropertyInput.vue';

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
  profitPercent: 0,
  _properties: []
});

const rules = [(v) => !!v || 'این فیلد الزامی است'];

// Methods
const getCategory = async () => {
  loading.value = true;
  try {
    const categoryId = route.params.id;
    const data = await useApiService.get(`categories/${categoryId}`);
    form.value = {
      _id: data._id,
      title: data.title,
      profitPercent: data.profitPercent || 0,
      _properties: data._properties || []
    };
  } catch (error) {
    $notify('مشکلی در بارگذاری اطلاعات دسته‌بندی پیش آمد', 'error');
    router.push('/categories');
  } finally {
    loading.value = false;
  }
};

const submitForm = async () => {
  const { valid: isValid } = await formRef.value.validate();

  if (isValid) {
    submitting.value = true;
    try {
      await useApiService.put(`categories/${form.value._id}`, {
        title: form.value.title,
        profitPercent: Number(form.value.profitPercent),
        _properties: form.value._properties
      });
      $notify('دسته‌بندی با موفقیت ویرایش شد', 'success');
      router.push('/categories');
    } catch (error) {
      $notify('مشکلی در ویرایش دسته‌بندی پیش آمد', 'error');
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
      getCategory();
    }
  },
  { immediate: true }
);
</script>
