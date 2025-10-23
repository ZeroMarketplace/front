<template>
  <v-card class="spike-card" elevation="10">
    <v-card-item>
      <h5 class="text-20 mb-7">افزودن دسته‌بندی جدید</h5>

      <!-- Parent Category Chip -->
      <v-chip v-if="form._parent" class="mb-4" size="default" color="primary" variant="elevated" closable
        @click:close="clearParent">
        دسته والد: {{ form._parentTitle }}
      </v-chip>

      <v-form ref="formRef" v-model="valid" validate-on="submit lazy" @submit.prevent="submitForm">
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
          <v-btn flat color="primary" type="submit" :loading="loading" class="mt-6" rounded="pill">
            ذخیره دسته‌بندی
          </v-btn>
          <v-btn flat color="error" to="/categories" class="mt-6 text-white" rounded="pill">
            انصراف
          </v-btn>
        </div>
      </v-form>
    </v-card-item>
  </v-card>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
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
const loading = ref(false);
const router = useRouter();
const route = useRoute();
const { $notify } = useNuxtApp();

const form = ref({
  title: '',
  profitPercent: 0,
  _parent: null,
  _parentTitle: '',
  _properties: []
});

const rules = [(v) => !!v || 'این فیلد الزامی است'];

// Check if parent is passed via query
if (route.query.parent) {
  form.value._parent = route.query.parent;
  form.value._parentTitle = route.query.parentTitle || 'دسته والد';
}

// Methods
const clearParent = () => {
  form.value._parent = null;
  form.value._parentTitle = '';
};

const submitForm = async () => {
  const { valid: isValid } = await formRef.value.validate();

  if (isValid) {
    loading.value = true;
    try {
      await useApiService.post('categories', {
        title: form.value.title,
        profitPercent: Number(form.value.profitPercent),
        _properties: form.value._properties.length ? form.value._properties : undefined,
        _parent: form.value._parent ?? undefined
      });
      $notify('دسته‌بندی با موفقیت ایجاد شد', 'success');
      router.push('/categories');
    } catch (error) {
      $notify('مشکلی در ایجاد دسته‌بندی پیش آمد', 'error');
    } finally {
      loading.value = false;
    }
  }
};
</script>
