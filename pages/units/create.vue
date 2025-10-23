<template>
  <v-card class="spike-card" elevation="10">
    <v-card-item>
      <h5 class="text-20 mb-7">افزودن واحد جدید</h5>

      <v-form ref="formRef" v-model="valid" validate-on="submit lazy" @submit.prevent="submitForm">
        <div class="bg-bglight mt-6 pa-6 rounded-md">
          <v-row>
            <v-col cols="12" md="6">
              <v-label class="font-weight-semibold pb-2">عنوان واحد</v-label>
              <v-text-field v-model="form.title" :rules="rules" required hide-details
                placeholder="عنوان واحد را وارد کنید" />
            </v-col>
          </v-row>
        </div>

        <div class="d-flex align-center justify-end ga-3">
          <v-btn flat color="primary" type="submit" :loading="loading" class="mt-6" rounded="pill">
            ذخیره واحد
          </v-btn>
          <v-btn flat color="error" to="/units" class="mt-6 text-white" rounded="pill">
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
  title: ''
});

const rules = [(v) => !!v || 'این فیلد الزامی است'];

// Methods
const submitForm = async () => {
  const { valid: isValid } = await formRef.value.validate();

  if (isValid) {
    loading.value = true;
    try {
      await useApiService.post('units', {
        title: form.value.title
      });
      $notify('واحد با موفقیت ایجاد شد', 'success');
      router.push('/units');
    } catch (error) {
      $notify('مشکلی در ایجاد واحد پیش آمد', 'error');
    } finally {
      loading.value = false;
    }
  }
};
</script>
