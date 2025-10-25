<template>
  <v-card class="spike-card" elevation="10">
    <v-card-item>
      <h5 class="text-20 mb-7">ویرایش محصول</h5>

      <v-form ref="formRef" v-model="valid" validate-on="submit lazy" @submit.prevent="submitForm"
        v-if="!loading && form._id">
        <!-- Basic Information -->
        <div class="bg-bglight mt-6 pa-6 rounded-md">
          <h6 class="text-h6 mb-4">
            <Icon icon="solar:info-circle-linear" class="me-2" />
            مشخصات کلی
          </h6>
          <v-row>
            <v-col cols="12" md="4">
              <v-label class="font-weight-semibold pb-2">نام محصول</v-label>
              <v-text-field v-model="form.name" :rules="rules" required hide-details
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
              <v-text-field v-model="form.barcode" :rules="rules" required hide-details placeholder="بارکد محصول" />
            </v-col>

            <v-col cols="12" md="4">
              <v-label class="font-weight-semibold pb-2">ایران کد (اختیاری)</v-label>
              <v-text-field v-model="form.iranCode" hide-details placeholder="ایران کد" />
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
              <v-label class="font-weight-semibold pb-2">آپلود تصاویر جدید</v-label>
              <v-file-input v-model="newImages" color="primary" label="فایل‌های تصویر را اینجا رها کنید یا کلیک کنید"
                placeholder="انتخاب تصاویر" prepend-icon="mdi-camera" variant="outlined" accept="image/*" chips multiple
                show-size hide-details>
                <template v-slot:selection="{ fileNames }">
                  <template v-for="(fileName, index) in fileNames" :key="fileName">
                    <v-chip v-if="index < 3" color="primary" size="small" label class="me-2">
                      {{ fileName }}
                    </v-chip>
                    <span v-else-if="index === 3" class="text-overline text-grey-darken-3 mx-2">
                      +{{ newImages.length - 3 }} تصویر دیگر
                    </span>
                  </template>
                </template>
              </v-file-input>
              <p class="text-caption text-grey mt-2">
                فرمت‌های مجاز: JPG, PNG, GIF - حداکثر حجم هر فایل: 5MB
              </p>
            </v-col>

            <!-- New Image Preview -->
            <v-col v-if="newImagePreviews.length > 0" cols="12">
              <v-label class="font-weight-semibold pb-2">پیش‌نمایش تصاویر جدید</v-label>
              <v-row>
                <v-col v-for="(preview, index) in newImagePreviews" :key="'new-' + index" cols="6" sm="4" md="3" lg="2">
                  <v-card class="position-relative" elevation="2">
                    <v-img :src="preview" aspect-ratio="1" cover class="rounded" />
                    <v-btn icon size="x-small" color="error" class="position-absolute" style="top: 4px; right: 4px;"
                      @click="removeNewImage(index)">
                      <Icon icon="solar:close-circle-bold" height="20" />
                    </v-btn>
                  </v-card>
                </v-col>
              </v-row>
            </v-col>

            <!-- Existing Images -->
            <v-col v-if="form.images && form.images.length > 0" cols="12">
              <v-label class="font-weight-semibold pb-2">تصاویر موجود</v-label>
              <v-row>
                <v-col v-for="(image, index) in form.images" :key="'existing-' + index" cols="6" sm="4" md="3" lg="2">
                  <v-card class="position-relative" elevation="2">
                    <v-img :src="image" aspect-ratio="1" cover class="rounded" />
                    <v-btn icon size="x-small" color="error" class="position-absolute" style="top: 4px; right: 4px;"
                      @click="removeExistingImage(index)">
                      <Icon icon="solar:trash-bin-minimalistic-linear" height="20" />
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
              <v-text-field v-model="form.weight" type="number" hide-details placeholder="وزن به گرم" />
            </v-col>

            <v-col cols="12" md="3">
              <v-label class="font-weight-semibold pb-2">طول (سانتی‌متر)</v-label>
              <v-text-field v-model="form.dimensions.length" type="number" hide-details placeholder="طول" />
            </v-col>

            <v-col cols="12" md="3">
              <v-label class="font-weight-semibold pb-2">عرض (سانتی‌متر)</v-label>
              <v-text-field v-model="form.dimensions.width" type="number" hide-details placeholder="عرض" />
            </v-col>

            <v-col cols="12" md="3">
              <v-label class="font-weight-semibold pb-2">برچسب‌ها</v-label>
              <v-text-field v-model="form.tags" hide-details placeholder="با - جدا کنید" />
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
              <v-text-field v-model="form.title" :rules="rules" required hide-details
                placeholder="عنوان نمایشی محصول" />
            </v-col>

            <v-col cols="12">
              <v-label class="font-weight-semibold pb-2">توضیحات</v-label>
              <v-textarea v-model="form.content" hide-details placeholder="توضیحات کامل محصول" rows="4" />
            </v-col>
          </v-row>
        </div>

        <div class="d-flex align-center justify-end ga-3">
          <v-btn flat color="success" type="submit" :loading="submitting" class="mt-6 text-white text-shadow"
            rounded="pill">
            ذخیره تغییرات
          </v-btn>
          <v-btn flat color="error" to="/products" class="mt-6 text-white" rounded="pill">
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
import { Icon } from '@iconify/vue';
import CategoryInput from '~/components/categories/CategoryInput.vue';
import BrandInput from '~/components/brands/BrandInput.vue';
import UnitInput from '~/components/units/UnitInput.vue';

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
const newImages = ref([]);
const newImagePreviews = ref([]);

const form = ref({
  _id: null,
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
  variants: [],
  properties: [],
  images: [],
  fileNames: [] // Original filenames from backend
});

const rules = [(v) => !!v || 'این فیلد الزامی است'];

// Methods
const generateNewImagePreviews = () => {
  newImagePreviews.value = [];
  if (newImages.value && newImages.value.length > 0) {
    newImages.value.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        newImagePreviews.value.push(e.target.result);
      };
      reader.readAsDataURL(file);
    });
  }
};

const removeNewImage = (index) => {
  newImages.value.splice(index, 1);
  newImagePreviews.value.splice(index, 1);
  $notify('تصویر جدید حذف شد', 'info');
};

const removeExistingImage = async (index) => {
  try {
    const fileName = form.value.fileNames[index];

    // Extract just the filename from the path (e.g., "/public/products/image.jpg" -> "image.jpg")
    // Or use the full path if that's what the backend expects
    const fileNameOnly = fileName.split('/').pop();

    const { $axios } = useNuxtApp();
    await $axios.delete(`products/${form.value._id}/files/${fileNameOnly}`);

    form.value.images.splice(index, 1);
    form.value.fileNames.splice(index, 1);
    $notify('تصویر حذف شد', 'success');
  } catch (error) {
    console.error('Error deleting image:', error);
    $notify('مشکلی در حذف تصویر پیش آمد', 'error');
  }
};

const uploadNewImages = async (productId) => {
  if (!newImages.value || newImages.value.length === 0) {
    return;
  }

  const formData = new FormData();
  newImages.value.forEach((file) => {
    formData.append('files', file);
  });

  try {
    $notify('در حال بارگذاری تصاویر...', 'info');

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

const getProduct = async () => {
  loading.value = true;
  try {
    const productId = route.params.id;
    const data = await useApiService.get(`products/${productId}`);

    // Convert file names to full URLs
    const config = useRuntimeConfig();
    const imageUrls = data.files ? data.files.map(fileName => config.public.STATICS_URL + fileName) : [];

    form.value = {
      _id: data._id,
      name: data.name,
      _categories: data._categories || [],
      _brand: data._brand,
      _unit: data._unit,
      barcode: data.barcode,
      iranCode: data.iranCode || '',
      weight: data.weight || '',
      dimensions: data.dimensions || { length: '', width: '' },
      tags: data.tags || '',
      title: data.title || '',
      content: data.content || '',
      variants: data.variants || [],
      properties: data.properties || [],
      images: imageUrls,
      fileNames: data.files || [] // Keep original filenames for deletion
    };
  } catch (error) {
    $notify('مشکلی در بارگذاری اطلاعات محصول پیش آمد', 'error');
    router.push('/products');
  } finally {
    loading.value = false;
  }
};

const submitForm = async () => {
  const { valid: isValid } = await formRef.value.validate();

  if (isValid) {
    submitting.value = true;
    try {
      await useApiService.put(`products/${form.value._id}`, {
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
        variants: form.value.variants,
        properties: form.value.properties
      });

      $notify('محصول با موفقیت ویرایش شد', 'success');

      // Upload new images if any
      if (newImages.value && newImages.value.length > 0) {
        await uploadNewImages(form.value._id);
      }

      router.push('/products');
    } catch (error) {
      $notify('مشکلی در ویرایش محصول پیش آمد', 'error');
    } finally {
      submitting.value = false;
    }
  }
};

// Watchers
watch(() => newImages.value, () => {
  generateNewImagePreviews();
}, { deep: true });

watch(
  () => route.params.id,
  (newId) => {
    if (newId) {
      getProduct();
    }
  },
  { immediate: true }
);
</script>
