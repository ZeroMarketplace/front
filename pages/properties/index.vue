<template>
  <v-card class="spike-card" elevation="10">
    <v-card-item>
      <!-- Summary Cards Section -->
      <!-- <div class="overflow-x-responsive">
        <v-row class="d-flex flex-nowrap">
          <v-col cols="12" md="4" sm="6">
            <div :class="[
              'pa-6 d-flex ga-3 align-center cursor-pointer rounded-xl',
              { 'bg-bglight': statusFilter === 'all' }
            ]" @click="setStatusFilter('all')">
              <v-avatar size="56" class="border border-md border-primary">
                <Icon icon="solar:settings-linear" height="25" class="text-primary" />
              </v-avatar>
              <div>
                <h6 class="text-h6">همه ویژگی‌ها</h6>
                <p class="text-14 lh-normal">{{ totalCount }} ویژگی</p>
              </div>
            </div>
          </v-col>
          <v-col cols="12" md="4" sm="6">
            <div :class="[
              'pa-6 d-flex ga-3 align-center cursor-pointer rounded-xl',
              { 'bg-bglight': statusFilter === 'active' }
            ]" @click="setStatusFilter('active')">
              <v-avatar size="56" class="border border-md border-success">
                <Icon icon="solar:check-circle-linear" height="25" class="text-success" />
              </v-avatar>
              <div>
                <h6 class="text-h6">فعال</h6>
                <p class="text-14 lh-normal">{{ activeCount }} ویژگی</p>
              </div>
            </div>
          </v-col>
          <v-col cols="12" md="4" sm="6">
            <div :class="[
              'pa-6 d-flex ga-3 align-center cursor-pointer rounded-xl',
              { 'bg-bglight': statusFilter === 'variant' }
            ]" @click="setStatusFilter('variant')">
              <v-avatar size="56" class="border border-md border-info">
                <Icon icon="solar:layers-linear" height="25" class="text-info" />
              </v-avatar>
              <div>
                <h6 class="text-h6">ایجاد تنوع</h6>
                <p class="text-14 lh-normal">{{ variantCount }} ویژگی</p>
              </div>
            </div>
          </v-col>
        </v-row>
      </div> -->

      <!-- Search and Actions -->
      <div class="d-sm-flex justify-space-between align-center my-4">
        <v-sheet width="255" class="mb-lg-0 mb-4">
          <v-text-field v-model="searchValue" label="جستجوی ویژگی" variant="outlined" hide-details class="w-100"
            density="compact">
            <template v-slot:prepend-inner>
              <Icon icon="solar:magnifer-linear" height="18" width="25" />
            </template>
          </v-text-field>
        </v-sheet>
        <v-btn color="primary" rounded="pill" flat to="/properties/create">
          ویژگی جدید
        </v-btn>
      </div>

      <!-- Loading -->
      <Loading :loading="loading" />

      <!-- Data Table -->
      <v-table class="spike-table month-table" v-if="!loading && filteredList.length">
        <template v-slot:default>
          <thead>
            <tr>
              <th class="text-subtitle-1 font-weight-semibold">عنوان</th>
              <th class="text-subtitle-1 font-weight-semibold">ایجاد تنوع</th>
              <th class="text-subtitle-1 font-weight-semibold">تعداد مقادیر</th>
              <th class="text-subtitle-1 font-weight-semibold">وضعیت</th>
              <th class="text-subtitle-1 font-weight-semibold text-center">عملیات</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in filteredList" :key="item._id">
              <td class="text-14 font-weight-semibold">{{ item.title }}</td>
              <td>
                <v-chip class="spike-chip" rounded="pill" :color="item.variant ? 'info' : 'grey'" variant="tonal"
                  size="small" label>
                  {{ item.variant ? 'بله' : 'خیر' }}
                </v-chip>
              </td>
              <td class="text-14">{{ item.values?.length || 0 }} مقدار</td>
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
                      <v-list-item @click="$router.push(`/properties/edit/${item._id}`)">
                        <template v-slot:prepend>
                          <Icon icon="solar:pen-linear" height="18" class="text-success me-3" />
                        </template>
                        <v-list-item-title>ویرایش</v-list-item-title>
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

                      <v-list-item @click="handleDeleteProperty(item._id)" class="text-error">
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
      <v-card-title class="pa-4 bg-primary">حذف ویژگی</v-card-title>
      <v-card-text class="pt-4">
        <h5 class="text-16">آیا از حذف این ویژگی اطمینان دارید؟</h5>
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
import { useNuxtApp } from '#app';
import { Icon } from '@iconify/vue';
import Loading from '~/components/Loading.vue';
import EmptyList from '~/components/EmptyList.vue';

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
const propertyIdToDelete = ref(null);
const { $notify } = useNuxtApp();

// Computed
const totalCount = computed(() => list.value.length);
const activeCount = computed(() => list.value.filter((item) => item.status === 1).length);
const variantCount = computed(() => list.value.filter((item) => item.variant).length);

const filteredList = computed(() => {
  let filtered = [...list.value];

  // Filter by status
  if (statusFilter.value === 'active') {
    filtered = filtered.filter((item) => item.status === 1);
  } else if (statusFilter.value === 'variant') {
    filtered = filtered.filter((item) => item.variant);
  }

  // Filter by search
  if (searchValue.value) {
    filtered = filtered.filter((item) =>
      item.title?.toLowerCase().includes(searchValue.value.toLowerCase())
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

const getProperties = async () => {
  loading.value = true;
  try {
    const data = await useApiService.get('properties?' + filter());
    list.value = data.list || [];
    pageCount.value = Math.ceil(data.total / perPage.value);
  } catch (error) {
    $notify('مشکلی در بارگذاری داده‌ها پیش آمد', 'error');
  } finally {
    loading.value = false;
  }
};

const handleToggleStatus = async (item) => {
  const newStatus = item.status === 1 ? 2 : 1;
  try {
    await useApiService.patch(`properties/${item._id}/status`, { status: newStatus });
    $notify('وضعیت با موفقیت تغییر کرد', 'success');
    await getProperties();
  } catch (error) {
    $notify('مشکلی در تغییر وضعیت پیش آمد', 'error');
  }
};

const handleDeleteProperty = (propertyId) => {
  propertyIdToDelete.value = propertyId;
  showConfirmation.value = true;
};

const confirmDelete = async () => {
  if (propertyIdToDelete.value) {
    try {
      await useApiService.remove(`properties/${propertyIdToDelete.value}`);
      $notify('ویژگی با موفقیت حذف شد', 'success');
      await getProperties();
    } catch (error) {
      $notify('مشکلی در حذف ویژگی پیش آمد', 'error');
    } finally {
      propertyIdToDelete.value = null;
      showConfirmation.value = false;
    }
  }
};

// Watchers
watch(page, () => {
  getProperties();
});

// Lifecycle
onMounted(() => {
  getProperties();
});
</script>

<style scoped>
.overflow-x-responsive {
  overflow-x: auto;
}
</style>
