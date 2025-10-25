<template>
  <v-card class="spike-card" elevation="10">
    <v-card-item>
      <!-- Summary Cards Section -->
      <div class="overflow-x-responsive">
        <v-row class="d-flex flex-nowrap">
          <v-col cols="12" md="3" sm="6">
            <div :class="[
              'pa-6 d-flex ga-3 align-center cursor-pointer rounded-xl',
              { 'bg-bglight': statusFilter === 'all' }
            ]" @click="setStatusFilter('all')">
              <v-avatar size="56" class="border border-md border-primary">
                <Icon icon="solar:box-minimalistic-linear" height="25" class="text-primary" />
              </v-avatar>
              <div>
                <h6 class="text-h6">همه محصولات</h6>
                <p class="text-14 lh-normal">{{ totalCount }} محصول</p>
              </div>
            </div>
          </v-col>
          <v-col cols="12" md="3" sm="6">
            <div :class="[
              'pa-6 d-flex ga-3 align-center cursor-pointer rounded-xl',
              { 'bg-bglight': statusFilter === 'active' }
            ]" @click="setStatusFilter('active')">
              <v-avatar size="56" class="border border-md border-success">
                <Icon icon="solar:check-circle-linear" height="25" class="text-success" />
              </v-avatar>
              <div>
                <h6 class="text-h6">فعال</h6>
                <p class="text-14 lh-normal">{{ activeCount }} محصول</p>
              </div>
            </div>
          </v-col>
          <v-col cols="12" md="3" sm="6">
            <div :class="[
              'pa-6 d-flex ga-3 align-center cursor-pointer rounded-xl',
              { 'bg-bglight': statusFilter === 'inactive' }
            ]" @click="setStatusFilter('inactive')">
              <v-avatar size="56" class="border border-md border-error">
                <Icon icon="solar:close-circle-linear" height="25" class="text-error" />
              </v-avatar>
              <div>
                <h6 class="text-h6">غیرفعال</h6>
                <p class="text-14 lh-normal">{{ inactiveCount }} محصول</p>
              </div>
            </div>
          </v-col>
          <v-col cols="12" md="3" sm="6">
            <div :class="[
              'pa-6 d-flex ga-3 align-center cursor-pointer rounded-xl',
              { 'bg-bglight': statusFilter === 'variants' }
            ]" @click="setStatusFilter('variants')">
              <v-avatar size="56" class="border border-md border-info">
                <Icon icon="solar:layers-linear" height="25" class="text-info" />
              </v-avatar>
              <div>
                <h6 class="text-h6">با تنوع</h6>
                <p class="text-14 lh-normal">{{ variantsCount }} محصول</p>
              </div>
            </div>
          </v-col>
        </v-row>
      </div>

      <!-- Search and Actions -->
      <div class="d-sm-flex justify-space-between align-center my-7">
        <v-sheet width="255" class="mb-lg-0 mb-4">
          <v-text-field v-model="searchValue" label="جستجوی محصول" variant="outlined" hide-details class="w-100"
            density="compact">
            <template v-slot:prepend-inner>
              <Icon icon="solar:magnifer-linear" height="18" width="25" />
            </template>
          </v-text-field>
        </v-sheet>
        <v-btn color="primary" rounded="pill" flat to="/products/create">
          محصول جدید
        </v-btn>
      </div>

      <!-- Loading -->
      <Loading :loading="loading" />

      <!-- Data Table -->
      <v-table class="spike-table month-table" v-if="!loading && filteredList.length">
        <template v-slot:default>
          <thead>
            <tr>
              <th class="text-subtitle-1 font-weight-semibold">تصویر</th>
              <th class="text-subtitle-1 font-weight-semibold">نام محصول</th>
              <th class="text-subtitle-1 font-weight-semibold">دسته‌بندی</th>
              <th class="text-subtitle-1 font-weight-semibold">برند</th>
              <th class="text-subtitle-1 font-weight-semibold">قیمت</th>
              <th class="text-subtitle-1 font-weight-semibold">وضعیت</th>
              <th class="text-subtitle-1 font-weight-semibold text-center">عملیات</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in filteredList" :key="item._id" class="month-item">
              <td>
                <ProductImage :file="item.files && item.files[0] ? item.files[0] : undefined" :size="50" />
              </td>
              <td class="text-14 font-weight-semibold">{{ item.name }}</td>
              <td class="text-14">
                <v-chip class="spike-chip" v-if="item._categories && item._categories.length" size="small"
                  variant="tonal" color="info">
                  {{ item._categories.length }} دسته
                </v-chip>
              </td>
              <td class="text-14">{{ item._brand?.title || '-' }}</td>
              <td class="text-14">
                <span v-if="item.price">{{ formatters.price(item.price.store) }} تومان</span>
                <span v-else-if="item.variants && item.variants.length">
                  {{ getProductPriceRange(item) }}
                </span>
                <span v-else>-</span>
              </td>
              <td>
                <v-chip class="spike-chip" rounded="pill" :color="item.status === 1 ? 'success' : 'error'"
                  variant="tonal" size="small" label>
                  {{ item.status === 1 ? 'فعال' : 'غیرفعال' }}
                </v-chip>
              </td>
              <td>
                <div class="text-center">
                  <v-menu>
                    <template v-slot:activator="{ props }">
                      <v-btn icon variant="text" v-bind="props" size="small">
                        <Icon icon="solar:menu-dots-bold" height="20" />
                      </v-btn>
                    </template>
                    <v-list density="compact" min-width="200">
                      <v-list-item @click="$router.push(`/products/edit/${item._id}`)">
                        <template v-slot:prepend>
                          <Icon icon="solar:pen-linear" height="18" class="text-success me-3" />
                        </template>
                        <v-list-item-title>ویرایش</v-list-item-title>
                      </v-list-item>

                      <v-list-item @click="handleCopyProduct(item)">
                        <template v-slot:prepend>
                          <Icon icon="solar:copy-linear" height="18" class="text-info me-3" />
                        </template>
                        <v-list-item-title>کپی</v-list-item-title>
                      </v-list-item>

                      <v-list-item @click="handleToggleStatus(item)">
                        <template v-slot:prepend>
                          <Icon :icon="item.status === 1 ? 'solar:eye-closed-linear' : 'solar:eye-linear'" height="18"
                            :class="item.status === 1 ? 'text-warning me-3' : 'text-primary me-3'" />
                        </template>
                        <v-list-item-title>
                          {{ item.status === 1 ? 'غیرفعال کردن' : 'فعال کردن' }}
                        </v-list-item-title>
                      </v-list-item>

                      <v-divider />

                      <v-list-item @click="handleDeleteProduct(item._id)" class="text-error">
                        <template v-slot:prepend>
                          <Icon icon="solar:trash-bin-minimalistic-linear" height="18" class="text-error me-3" />
                        </template>
                        <v-list-item-title>حذف</v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                </div>
              </td>
            </tr>
          </tbody>
        </template>
      </v-table>

      <!-- Pagination -->
      <v-pagination v-if="pageCount > 1" class="mt-5" active-color="secondary" v-model="page" :length="pageCount"
        rounded="circle" />

      <!-- Empty List Alert -->
      <EmptyList :list="filteredList" :loading="loading" />
    </v-card-item>
  </v-card>

  <!-- Confirmation Dialog -->
  <v-dialog v-model="showConfirmation" max-width="500px">
    <v-card>
      <v-card-title class="pa-4 bg-primary">حذف محصول</v-card-title>
      <v-card-text class="pt-4">
        <h5 class="text-16">آیا از حذف این محصول اطمینان دارید؟</h5>
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" class="px-4" variant="flat" rounded="pill" @click="confirmDelete">
          بله، حذف شود
        </v-btn>
        <v-btn color="error" variant="flat" rounded="pill" class="px-4 text-white" @click="showConfirmation = false">
          انصراف
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useNuxtApp } from '#app';
import { Icon } from '@iconify/vue';
import Loading from '~/components/Loading.vue';
import EmptyList from '~/components/EmptyList.vue';
import ProductImage from '~/components/products/ProductImage.vue';
import { formatters } from '~/utils/formatters';

// Page meta
definePageMeta({
  layout: 'admin-spike',
  middleware: 'auth',
  requiresAuth: true,
  requiresRole: 'admin'
});

// State
const list = ref([]);
const loading = ref(true);
const searchValue = ref('');
const statusFilter = ref('all');
const page = ref(1);
const perPage = ref(10);
const pageCount = ref(1);
const showConfirmation = ref(false);
const productIdToDelete = ref(null);
const router = useRouter();
const { $notify } = useNuxtApp();

// Computed
const totalCount = computed(() => list.value.length);
const activeCount = computed(() => list.value.filter((item) => item.status === 1).length);
const inactiveCount = computed(() => list.value.filter((item) => item.status === 2).length);
const variantsCount = computed(() => list.value.filter((item) => item.variants && item.variants.length > 0).length);

const filteredList = computed(() => {
  let filtered = [...list.value];

  // Filter by status
  if (statusFilter.value === 'active') {
    filtered = filtered.filter((item) => item.status === 1);
  } else if (statusFilter.value === 'inactive') {
    filtered = filtered.filter((item) => item.status === 2);
  } else if (statusFilter.value === 'variants') {
    filtered = filtered.filter((item) => item.variants && item.variants.length > 0);
  }

  // Filter by search
  if (searchValue.value) {
    filtered = filtered.filter((item) =>
      item.name?.toLowerCase().includes(searchValue.value.toLowerCase())
    );
  }

  return filtered;
});

// Methods
const setStatusFilter = (status) => {
  statusFilter.value = status;
};

const filter = () => {
  const search = new URLSearchParams();
  search.set('perPage', perPage.value);
  search.set('page', page.value);
  search.set('statuses', [1, 2]);
  return search;
};

const getProducts = async () => {
  loading.value = true;
  try {
    const data = await useApiService.get('products?' + filter());
    list.value = data.list || [];
    pageCount.value = Math.ceil(data.total / perPage.value);
    // Don't show notification on successful load - only on errors
  } catch (error) {
    $notify('مشکلی در بارگذاری داده‌ها پیش آمد', 'error');
  } finally {
    loading.value = false;
  }
};

const getProductPriceRange = (item) => {
  let min = 0, max = 0;

  item.variants.forEach((variant) => {
    if (variant.price) {
      if (min === 0) min = variant.price.store;
      if (variant.price.store >= max) max = variant.price.store;
      if (variant.price.store <= min) min = variant.price.store;
    }
  });

  if (min === 0 && max === 0) {
    return 'قیمت ندارد';
  } else if (min === max) {
    return `${formatters.price(min)} تومان`;
  } else {
    return `از ${formatters.price(min)} تا ${formatters.price(max)} تومان`;
  }
};

const handleToggleStatus = async (item) => {
  const newStatus = item.status === 1 ? 2 : 1;
  try {
    await useApiService.patch(`products/${item._id}/status`, { status: newStatus });
    $notify('وضعیت با موفقیت تغییر کرد', 'success');
    await getProducts();
  } catch (error) {
    $notify('مشکلی در تغییر وضعیت پیش آمد', 'error');
  }
};

const handleCopyProduct = (item) => {
  router.push({
    path: '/products/create',
    query: { copy: item._id }
  });
};

const handleDeleteProduct = (productId) => {
  productIdToDelete.value = productId;
  showConfirmation.value = true;
};

const confirmDelete = async () => {
  if (productIdToDelete.value) {
    try {
      await useApiService.remove(`products/${productIdToDelete.value}`);
      $notify('محصول با موفقیت حذف شد', 'success');
      await getProducts();
    } catch (error) {
      $notify('مشکلی در حذف محصول پیش آمد', 'error');
    } finally {
      productIdToDelete.value = null;
      showConfirmation.value = false;
    }
  }
};

// Watchers
watch(page, () => {
  getProducts();
});

// Lifecycle
onMounted(() => {
  getProducts();
});
</script>

<style scoped>
.overflow-x-responsive {
  overflow-x: auto;
}
</style>
