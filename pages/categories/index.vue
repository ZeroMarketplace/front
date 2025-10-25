<template>
  <v-card class="spike-card" elevation="10">
    <v-card-item>
      <!-- Summary Cards Section -->
      <div class="overflow-x-responsive">
        <v-row class="d-flex flex-nowrap">
          <v-col cols="12" md="4" sm="6">
            <div :class="[
              'pa-6 d-flex ga-3 align-center cursor-pointer rounded-xl',
              { 'bg-bglight': statusFilter === 'all' }
            ]" @click="setStatusFilter('all')">
              <v-avatar size="56" class="border border-md border-primary">
                <Icon icon="solar:folder-with-files-linear" height="25" class="text-primary" />
              </v-avatar>
              <div>
                <h6 class="text-h6">همه دسته‌بندی‌ها</h6>
                <p class="text-14 lh-normal">{{ totalCount }} دسته</p>
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
                <p class="text-14 lh-normal">{{ activeCount }} دسته</p>
              </div>
            </div>
          </v-col>
          <v-col cols="12" md="4" sm="6">
            <div :class="[
              'pa-6 d-flex ga-3 align-center cursor-pointer rounded-xl',
              { 'bg-bglight': statusFilter === 'inactive' }
            ]" @click="setStatusFilter('inactive')">
              <v-avatar size="56" class="border border-md border-error">
                <Icon icon="solar:close-circle-linear" height="25" class="text-error" />
              </v-avatar>
              <div>
                <h6 class="text-h6">غیرفعال</h6>
                <p class="text-14 lh-normal">{{ inactiveCount }} دسته</p>
              </div>
            </div>
          </v-col>
        </v-row>
      </div>

      <!-- Search and Actions -->
      <div class="d-sm-flex justify-space-between align-center my-7">
        <v-sheet width="255" class="mb-lg-0 mb-4">
          <v-text-field v-model="searchValue" label="جستجوی دسته‌بندی" variant="outlined" hide-details class="w-100"
            density="compact">
            <template v-slot:prepend-inner>
              <Icon icon="solar:magnifer-linear" height="18" width="25" />
            </template>
          </v-text-field>
        </v-sheet>
        <v-btn color="primary" rounded="pill" flat to="/categories/create">
          دسته‌بندی جدید
        </v-btn>
      </div>

      <!-- Loading -->
      <Loading :loading="loading" />

      <!-- Hierarchical List -->
      <div v-if="!loading && filteredList.length" class="category-list">
        <CategoryTreeItem v-for="item in filteredList" :key="item._id" :item="item" @toggle-status="handleToggleStatus"
          @delete="handleDeleteCategory" @add-child="handleAddChild" />
      </div>

      <!-- Empty List Alert -->
      <EmptyList :list="filteredList" :loading="loading" />
    </v-card-item>
  </v-card>

  <!-- Confirmation Dialog -->
  <v-dialog v-model="showConfirmation" max-width="500px">
    <v-card>
      <v-card-title class="pa-4 bg-primary">حذف دسته‌بندی</v-card-title>
      <v-card-text class="pt-4">
        <h5 class="text-16">آیا از حذف این دسته‌بندی اطمینان دارید؟</h5>
        <p class="text-14 text-muted mt-2">توجه: زیردسته‌های این دسته نیز حذف خواهند شد.</p>
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
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
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
const showConfirmation = ref(false);
const categoryIdToDelete = ref(null);
const router = useRouter();
const { $notify } = useNuxtApp();

// Computed
const countCategories = (categories) => {
  let count = categories.length;
  categories.forEach((cat) => {
    if (cat.children && cat.children.length) {
      count += countCategories(cat.children);
    }
  });
  return count;
};

const countByStatus = (categories, status) => {
  let count = 0;
  categories.forEach((cat) => {
    if (cat.status === status) count++;
    if (cat.children && cat.children.length) {
      count += countByStatus(cat.children, status);
    }
  });
  return count;
};

const totalCount = computed(() => countCategories(list.value));
const activeCount = computed(() => countByStatus(list.value, 1));
const inactiveCount = computed(() => countByStatus(list.value, 2));

const filterCategories = (categories) => {
  return categories.filter((cat) => {
    // Status filter
    let matchesStatus = true;
    if (statusFilter.value === 'active') {
      matchesStatus = cat.status === 1;
    } else if (statusFilter.value === 'inactive') {
      matchesStatus = cat.status === 2;
    }

    // Search filter
    let matchesSearch = true;
    if (searchValue.value) {
      matchesSearch = cat.title?.toLowerCase().includes(searchValue.value.toLowerCase());
    }

    // Filter children recursively
    if (cat.children && cat.children.length) {
      cat.children = filterCategories(cat.children);
    }

    return matchesStatus && matchesSearch;
  });
};

const filteredList = computed(() => {
  return filterCategories(JSON.parse(JSON.stringify(list.value)));
});

// Methods
const setStatusFilter = (status) => {
  statusFilter.value = status;
};

const filter = () => {
  const search = new URLSearchParams();
  search.set('statuses', [1, 2]);
  return search;
};

const getCategories = async () => {
  loading.value = true;
  try {
    const data = await useApiService.get('categories?' + filter());
    list.value = data.list || [];
  } catch (error) {
    $notify('مشکلی در بارگذاری داده‌ها پیش آمد', 'error');
  } finally {
    loading.value = false;
  }
};

const handleToggleStatus = async (item) => {
  const newStatus = item.status === 1 ? 2 : 1;
  try {
    await useApiService.patch(`categories/${item._id}/status`, { status: newStatus });
    $notify('وضعیت با موفقیت تغییر کرد', 'success');
    await getCategories();
  } catch (error) {
    $notify('مشکلی در تغییر وضعیت پیش آمد', 'error');
  }
};

const handleDeleteCategory = (categoryId) => {
  categoryIdToDelete.value = categoryId;
  showConfirmation.value = true;
};

const handleAddChild = (parentId, parentTitle) => {
  router.push({
    path: '/categories/create',
    query: { parent: parentId, parentTitle: parentTitle }
  });
};

const confirmDelete = async () => {
  if (categoryIdToDelete.value) {
    try {
      await useApiService.remove(`categories/${categoryIdToDelete.value}`);
      $notify('دسته‌بندی با موفقیت حذف شد', 'success');
      await getCategories();
    } catch (error) {
      $notify('مشکلی در حذف دسته‌بندی پیش آمد', 'error');
    } finally {
      categoryIdToDelete.value = null;
      showConfirmation.value = false;
    }
  }
};

// Lifecycle
onMounted(() => {
  getCategories();
});
</script>

<style scoped>
.overflow-x-responsive {
  overflow-x: auto;
}

.category-list {
  margin: 0 20px;
}
</style>
