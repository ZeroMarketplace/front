<template>
  <v-card class="spike-card" elevation="10">
    <v-card-item>
      <h5 class="text-20 mb-7">ویرایش واحد</h5>

      <v-form ref="formRef" v-model="valid" validate-on="submit lazy" @submit.prevent="submitForm"
        v-if="!loading && form._id">
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
          <v-btn flat color="success" type="submit" :loading="submitting" class="mt-6 text-white" rounded="pill">
            ذخیره تغییرات
          </v-btn>
          <v-btn flat color="error" to="/units" class="mt-6 text-white" rounded="pill">
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
  title: ''
});

const rules = [(v) => !!v || 'این فیلد الزامی است'];

// Methods
const getUnit = async () => {
  loading.value = true;
  try {
    const unitId = route.params.id;
    const data = await useApiService.get(`units/${unitId}`);
    form.value = {
      _id: data._id,
      title: data.title
    };
  } catch (error) {
    $notify('مشکلی در بارگذاری اطلاعات واحد پیش آمد', 'error');
    router.push('/units');
  } finally {
    loading.value = false;
  }
};

const submitForm = async () => {
  const { valid: isValid } = await formRef.value.validate();

  if (isValid) {
    submitting.value = true;
    try {
      await useApiService.put(`units/${form.value._id}`, {
        title: form.value.title
      });
      $notify('واحد با موفقیت ویرایش شد', 'success');
      router.push('/units');
    } catch (error) {
      $notify('مشکلی در ویرایش واحد پیش آمد', 'error');
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
      getUnit();
    }
  },
  { immediate: true }
);
</script>
