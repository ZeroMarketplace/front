<template>
  <v-card class="spike-card" elevation="10">
    <v-card-item>
      <h5 class="text-20 mb-7">{{ copyMode ? 'کپی محصول' : 'افزودن محصول جدید' }}</h5>

      <v-form ref="formRef" v-model="valid" validate-on="submit lazy" @submit.prevent="submitForm">
        <!-- Basic Information -->
        <div class="bg-bglight mt-6 pa-6 rounded-md">
          <h6 class="text-h6 mb-4">
            <Icon icon="solar:info-circle-linear" class="me-2" />
            مشخصات کلی
          </h6>
          <v-row>
            <v-col cols="12" md="4">
              <v-label class="font-weight-semibold pb-2">نام محصول</v-label>
              <v-text-field v-model="form.name" :rules="rules" required hide-details variant="outlined"
                placeholder="نام محصول را وارد کنید" />
            </v-col>

            <v-col cols="12" md="4">
              <v-label class="font-weight-semibold pb-2">دسته‌بندی</v-label>
              <CategoryInput v-model="form._categories" :rules="[rules.requiredMultipleSelect]" multiple chips />
            </v-col>

            <v-col cols="12" md="4">
              <v-label class="font-weight-semibold pb-2">برند</v-label>
              <BrandInput v-model="form._brand" :rules="[rules.requiredSelect]" />
            </v-col>

            <v-col cols="12" md="4">
              <v-label class="font-weight-semibold pb-2">واحد</v-label>
              <UnitInput v-model="form._unit" :rules="[rules.requiredSelect]" />
            </v-col>

            <v-col cols="12" md="4">
              <v-label class="font-weight-semibold pb-2">بارکد</v-label>
              <v-text-field v-model="form.barcode" :rules="rules" required hide-details variant="outlined"
                color="blue-lighten-1" style="border-color: black !important; outline-color: black !important; "
                placeholder="بارکد محصول" />
            </v-col>

            <v-col cols="12" md="4">
              <v-label class="font-weight-semibold pb-2">ایران کد (اختیاری)</v-label>
              <v-text-field v-model="form.iranCode" hide-details variant="outlined" placeholder="ایران کد" />
            </v-col>
          </v-row>
        </div>

        <!-- Product Images -->
        <div class="bg-bglight mt-6 pa-6 rounded-md">
          <h6 class="text-h6 mb-4">
            <Icon icon="solar:gallery-linear" class="me-2" />
            تصاویر محصول
          </h6>
          <v-row>
            <v-col cols="12">
              <v-label class="font-weight-semibold pb-2">آپلود تصاویر</v-label>
              <v-file-input v-model="form.images" label="فایل‌های تصویر را اینجا رها کنید یا کلیک کنید"
                placeholder="انتخاب تصاویر" prepend-icon="mdi-camera" variant="outlined" accept="image/*" chips multiple
                show-size hide-details>
                <template v-slot:selection="{ fileNames }">
                  <template v-for="(fileName, index) in fileNames" :key="fileName">
                    <v-chip v-if="index < 3" color="primary" size="small" label class="me-2">
                      {{ fileName }}
                    </v-chip>
                    <span v-else-if="index === 3" class="text-overline text-grey-darken-3 mx-2">
                      +{{ form.images.length - 3 }} تصویر دیگر
                    </span>
                  </template>
                </template>
              </v-file-input>
              <p class="text-caption text-grey mt-2">
                فرمت‌های مجاز: JPG, PNG, GIF - حداکثر حجم هر فایل: 5MB
              </p>
            </v-col>

            <!-- Image Preview -->
            <v-col v-if="imagePreviews.length > 0" cols="12">
              <v-label class="font-weight-semibold pb-2">پیش‌نمایش تصاویر</v-label>
              <v-row>
                <v-col v-for="(preview, index) in imagePreviews" :key="index" cols="6" sm="4" md="3" lg="2">
                  <v-card class="position-relative" elevation="2">
                    <v-img :src="preview" aspect-ratio="1" cover class="rounded" />
                    <v-btn icon size="x-small" color="error" class="position-absolute" style="top: 4px; right: 4px;"
                      @click="removeImage(index)">
                      <Icon icon="solar:close-circle-bold" height="20" />
                    </v-btn>
                  </v-card>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </div>

        <!-- Physical Properties -->
        <div class="bg-bglight mt-6 pa-6 rounded-md">
          <h6 class="text-h6 mb-4">
            <Icon icon="solar:box-linear" class="me-2" />
            مشخصات فیزیکی
          </h6>
          <v-row>
            <v-col cols="12" md="3">
              <v-label class="font-weight-semibold pb-2">وزن (گرم)</v-label>
              <v-text-field v-model="form.weight" type="number" hide-details variant="outlined"
                placeholder="وزن به گرم" />
            </v-col>

            <v-col cols="12" md="3">
              <v-label class="font-weight-semibold pb-2">طول (سانتی‌متر)</v-label>
              <v-text-field v-model="form.dimensions.length" type="number" hide-details variant="outlined"
                placeholder="طول" />
            </v-col>

            <v-col cols="12" md="3">
              <v-label class="font-weight-semibold pb-2">عرض (سانتی‌متر)</v-label>
              <v-text-field v-model="form.dimensions.width" type="number" hide-details variant="outlined"
                placeholder="عرض" />
            </v-col>

            <v-col cols="12" md="3">
              <v-label class="font-weight-semibold pb-2">برچسب‌ها</v-label>
              <v-text-field v-model="form.tags" hide-details variant="outlined" placeholder="با - جدا کنید" />
            </v-col>
          </v-row>
        </div>

        <!-- Text Content -->
        <div class="bg-bglight mt-6 pa-6 rounded-md">
          <h6 class="text-h6 mb-4">
            <Icon icon="solar:text-linear" class="me-2" />
            محتوای متنی
          </h6>
          <v-row>
            <v-col cols="12" md="6">
              <v-label class="font-weight-semibold pb-2">عنوان محصول</v-label>
              <v-text-field v-model="form.title" :rules="rules" required hide-details variant="outlined"
                placeholder="عنوان نمایشی محصول" />
            </v-col>

            <v-col cols="12">
              <v-label class="font-weight-semibold pb-2">توضیحات</v-label>
              <v-textarea v-model="form.content" hide-details variant="outlined" placeholder="توضیحات کامل محصول"
                rows="4" />
            </v-col>
          </v-row>
        </div>

        <div class="d-flex align-center justify-end ga-3">
          <v-btn flat color="primary" type="submit" :loading="loading" class="mt-6" rounded="pill">
            ذخیره محصول
          </v-btn>
          <v-btn flat color="error" to="/products" class="mt-6 text-white" rounded="pill">
            انصراف
          </v-btn>
        </div>
      </v-form>
    </v-card-item>
  </v-card>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useNuxtApp } from '#app';
import { Icon } from '@iconify/vue';
import CategoryInput from '~/components/categories/CategoryInput.vue';
import BrandInput from '~/components/brands/BrandInput.vue';
import UnitInput from '~/components/units/UnitInput.vue';
import { rules as validationRules } from '~/utils/validationRules';

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
const copyMode = ref(false);
const router = useRouter();
const route = useRoute();
const { $notify } = useNuxtApp();
const imagePreviews = ref([]);

const form = ref({
  name: '',
  _categories: [],
  _brand: undefined,
  _unit: undefined,
  barcode: '',
  iranCode: '',
  weight: '',
  dimensions: {
    length: '',
    width: ''
  },
  tags: '',
  title: '',
  content: '',
  images: []
});

const rules = [(v) => !!v || 'این فیلد الزامی است'];

// Methods
const generateImagePreviews = () => {
  imagePreviews.value = [];
  if (form.value.images && form.value.images.length > 0) {
    form.value.images.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        imagePreviews.value.push(e.target.result);
      };
      reader.readAsDataURL(file);
    });
  }
};

const removeImage = (index) => {
  form.value.images.splice(index, 1);
  imagePreviews.value.splice(index, 1);
};

const loadProductForCopy = async () => {
  const copyId = route.query.copy;
  if (copyId) {
    copyMode.value = true;
    loading.value = true;
    try {
      const data = await useApiService.get(`products/${copyId}`);
      form.value = {
        name: data.name + ' (کپی)',
        _categories: data._categories || [],
        _brand: data._brand,
        _unit: data._unit,
        barcode: data.barcode + '-copy',
        iranCode: data.iranCode,
        weight: data.weight || '',
        dimensions: data.dimensions || { length: '', width: '' },
        tags: data.tags || '',
        title: data.title || '',
        content: data.content || '',
        images: []
      };
    } catch (error) {
      $notify('مشکلی در بارگذاری محصول پیش آمد', 'error');
      router.push('/products');
    } finally {
      loading.value = false;
    }
  }
};

const uploadImages = async (productId) => {
  if (!form.value.images || form.value.images.length === 0) {
    return;
  }

  const formData = new FormData();
  form.value.images.forEach((file) => {
    formData.append('files', file);
  });

  try {
    // Use axios directly like the old code (handles multipart/form-data properly)
    const { $axios } = useNuxtApp();
    const response = await $axios.post(`products/${productId}/files`, formData);
    return response.data;
  } catch (error) {
    console.error('Error uploading images:', error);
    $notify('مشکلی در بارگذاری تصاویر پیش آمد', 'warning');
    throw error;
  }
};

const submitForm = async () => {
  const { valid: isValid } = await formRef.value.validate();

  if (isValid) {
    loading.value = true;
    try {
      const response = await useApiService.post('products', {
        name: form.value.name,
        _categories: form.value._categories,
        _brand: form.value._brand,
        _unit: form.value._unit,
        barcode: form.value.barcode,
        iranCode: form.value.iranCode,
        weight: Number(form.value.weight) || 0,
        dimensions: form.value.dimensions,
        tags: form.value.tags,
        title: form.value.title,
        content: form.value.content,
        variants: [],
        properties: []
      });

      $notify('محصول با موفقیت ایجاد شد', 'success');

      // Upload images if any
      if (form.value.images && form.value.images.length > 0) {
        await uploadImages(response._id);
      }

      router.push('/products');
    } catch (error) {
      $notify('مشکلی در ایجاد محصول پیش آمد', 'error');
    } finally {
      loading.value = false;
    }
  }
};

// Watch for image changes
watch(() => form.value.images, () => {
  generateImagePreviews();
}, { deep: true });

// Lifecycle
onMounted(() => {
  loadProductForCopy();
});
</script>
