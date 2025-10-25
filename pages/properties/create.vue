<template>
  <v-card class="spike-card" elevation="10">
    <v-card-item>
      <h5 class="text-20 mb-7">افزودن ویژگی جدید</h5>

      <v-form ref="formRef" v-model="valid" validate-on="submit lazy" @submit.prevent="submitForm">
        <div class="bg-bglight mt-6 pa-6 rounded-md">
          <v-row>
            <v-col cols="12" md="6">
              <v-label class="font-weight-semibold pb-2">عنوان ویژگی</v-label>
              <v-text-field v-model="form.title" :rules="rules" required hide-details
                placeholder="عنوان ویژگی را وارد کنید" />
            </v-col>

            <v-col cols="12" md="6">
              <v-label class="font-weight-semibold pb-2">تنظیمات</v-label>
              <v-checkbox v-model="form.variant" label="ایجاد تنوع" hide-details color="primary" class="mt-2" />
            </v-col>
          </v-row>
        </div>

        <!-- Values Section -->
        <div class="bg-bglight mt-6 pa-6 rounded-md">
          <div class="d-flex justify-space-between align-center mb-4">
            <v-label class="font-weight-semibold">مقادیر ویژگی</v-label>
            <v-btn color="primary" size="small" rounded="pill" flat @click="addValue" prepend-icon="mdi-plus">
              افزودن مقدار
            </v-btn>
          </div>

          <v-row v-for="(valueItem, index) in form.values" :key="index" class="mb-3">
            <v-col cols="12" md="5">
              <v-label class="font-weight-semibold pb-2 text-12">عنوان</v-label>
              <v-text-field v-model="valueItem.title" :rules="rules" required hide-details placeholder="مثال: قرمز"
                density="compact" />
            </v-col>

            <v-col cols="12" md="5">
              <v-label class="font-weight-semibold pb-2 text-12">مقدار (اختیاری)</v-label>
              <v-text-field v-model="valueItem.value" hide-details placeholder="مثال: #FF0000" density="compact" />
            </v-col>

            <v-col cols="12" md="2" class="d-flex align-end">
              <v-btn color="error" size="small" icon variant="text" @click="deleteValue(index)"
                :disabled="form.values.length === 1">
                <Icon icon="solar:trash-bin-minimalistic-linear" height="20" />
              </v-btn>
            </v-col>
          </v-row>
        </div>

        <div class="d-flex align-center justify-end ga-3">
          <v-btn flat color="primary" type="submit" :loading="loading" class="mt-6" rounded="pill">
            ذخیره ویژگی
          </v-btn>
          <v-btn flat color="error" to="/properties" class="mt-6 text-white" rounded="pill">
            انصراف
          </v-btn>
        </div>
      </v-form>
    </v-card-item>
  </v-card>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useNuxtApp } from '#app';
import { Icon } from '@iconify/vue';

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
const loading = ref(false);
const router = useRouter();
const { $notify } = useNuxtApp();

const form = ref({
  title: '',
  variant: false,
  values: [
    {
      title: '',
      value: ''
    }
  ]
});

const rules = [(v) => !!v || 'این فیلد الزامی است'];

// Methods
const addValue = () => {
  form.value.values.push({
    title: '',
    value: ''
  });
  $notify('مقدار جدید اضافه شد', 'info');
};

const deleteValue = (index) => {
  if (form.value.values.length > 1) {
    form.value.values.splice(index, 1);
    $notify('مقدار حذف شد', 'info');
  }
};

const submitForm = async () => {
  const { valid: isValid } = await formRef.value.validate();

  if (isValid) {
    loading.value = true;
    try {
      await useApiService.post('properties', form.value);
      $notify('ویژگی با موفقیت ایجاد شد', 'success');
      router.push('/properties');
    } catch (error) {
      $notify('مشکلی در ایجاد ویژگی پیش آمد', 'error');
    } finally {
      loading.value = false;
    }
  }
};
</script>
