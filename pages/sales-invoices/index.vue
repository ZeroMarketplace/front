<template>
  <v-card class="spike-card" elevation="10">
    <v-card-item>
      <!-- Summary Cards Section -->
      <div class="overflow-x-responsive">
        <v-row class="d-flex flex-nowrap">
          <v-col cols="12" md="4" sm="6">
            <div :class="[
              'pa-6 d-flex ga-3 align-center cursor-pointer rounded-xl',
              { 'bg-bglight': statusFilter === 'all' },
            ]" @click="setStatusFilter('all')">
              <v-avatar size="56" class="border border-md border-primary">
                <Icon icon="solar:bill-list-linear" height="25" class="text-primary" />
              </v-avatar>
              <div>
                <h6 class="text-h6">همه فاکتورها</h6>
                <p class="text-14 lh-normal">{{ totalCount }} فاکتور</p>
              </div>
            </div>
          </v-col>
          <v-col cols="12" md="4" sm="6">
            <div :class="[
              'pa-6 d-flex ga-3 align-center cursor-pointer rounded-xl',
              { 'bg-bglight': statusFilter === 'Completed' },
            ]" @click="setStatusFilter('Completed')">
              <v-avatar size="56" class="border border-md border-success">
                <Icon icon="solar:check-circle-linear" height="25" class="text-success" />
              </v-avatar>
              <div>
                <h6 class="text-h6">تکمیل شده</h6>
                <p class="text-14 lh-normal">{{ completedCount }} فاکتور</p>
              </div>
            </div>
          </v-col>
          <v-col cols="12" md="4" sm="6">
            <div :class="[
              'pa-6 d-flex ga-3 align-center cursor-pointer rounded-xl',
              { 'bg-bglight': statusFilter === 'Paid' },
            ]" @click="setStatusFilter('Paid')">
              <v-avatar size="56" class="border border-md border-info">
                <Icon icon="solar:wallet-money-linear" height="25" class="text-info" />
              </v-avatar>
              <div>
                <h6 class="text-h6">پرداخت شده</h6>
                <p class="text-14 lh-normal">{{ paidCount }} فاکتور</p>
              </div>
            </div>
          </v-col>
        </v-row>
      </div>

      <!-- Search and Actions -->
      <div class="d-sm-flex justify-space-between align-center my-7">
        <v-sheet width="255" class="mb-lg-0 mb-4">
          <v-text-field v-model="searchValue" label="جستجوی فاکتور" variant="outlined" hide-details class="w-100"
            density="compact">
            <template v-slot:prepend-inner>
              <Icon icon="solar:magnifer-linear" height="18" width="25" />
            </template>
          </v-text-field>
        </v-sheet>
        <v-btn color="primary" rounded="pill" flat to="/sales-invoices/create">فاکتور فروش جدید</v-btn>
      </div>

      <Loading :loading="loading" />

      <v-table class="spike-table month-table" v-if="!loading && filteredList.length">
        <template v-slot:default>
          <thead>
            <tr>
              <th class="text-subtitle-1 font-weight-semibold">کد فاکتور</th>
              <th class="text-subtitle-1 font-weight-semibold">مشتری</th>
              <th class="text-subtitle-1 font-weight-semibold">تاریخ</th>
              <th class="text-subtitle-1 font-weight-semibold">مبلغ (تومان)</th>
              <th class="text-subtitle-1 font-weight-semibold text-center">عملیات</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in filteredList" :key="item._id">
              <td class="text-14 font-weight-semibold">{{ item.code }}</td>
              <td class="text-14">{{ item._customer?.fullName || "-" }}</td>
              <td class="text-14">{{ item.dateTimeJalali }}</td>
              <td class="text-14">{{ formatters.price(item.total) }}</td>
              <td>
                <div class="d-flex ga-3 align-center justify-center">
                  <RouterLink :to="`/sales-invoices/edit/${item._id}`">
                    <v-avatar color="lightsuccess" size="32">
                      <Icon icon="solar:pen-linear" class="text-success" height="18" />
                    </v-avatar>
                    <v-tooltip activator="parent" location="bottom">ویرایش</v-tooltip>
                  </RouterLink>
                  <RouterLink to="" @click.stop="handleDelete(item._id)">
                    <v-avatar color="lighterror" size="32">
                      <Icon icon="solar:trash-bin-minimalistic-linear" class="text-error" height="18" />
                    </v-avatar>
                    <v-tooltip activator="parent" location="bottom">حذف</v-tooltip>
                  </RouterLink>
                </div>
              </td>
            </tr>
          </tbody>
        </template>
      </v-table>

      <v-pagination v-if="pageCount > 1" class="mt-5" active-color="secondary" v-model="page" :length="pageCount"
        rounded="circle" />
      <EmptyList :list="filteredList" :loading="loading" />
    </v-card-item>
  </v-card>

  <v-dialog v-model="showConfirmation" max-width="500px">
    <v-card>
      <v-card-title class="pa-4 bg-primary">حذف فاکتور فروش</v-card-title>
      <v-card-text class="pt-4">
        <h5 class="text-16">
          آیا از حذف این فاکتور اطمینان دارید؟
        </h5>
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" class="px-4" variant="flat" rounded="pill" @click="confirmDelete">بله، حذف شود</v-btn>
        <v-btn color="error" variant="flat" rounded="pill" class="px-4 text-white"
          @click="showConfirmation = false">انصراف</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, onMounted, computed, watch } from "vue";
import { useNuxtApp } from "#app";
import { Icon } from "@iconify/vue";
import Loading from "~/components/Loading.vue";
import EmptyList from "~/components/EmptyList.vue";
import { formatters } from "~/utils/formatters";

definePageMeta({
  layout: "admin-spike",
  middleware: "auth",
  requiresAuth: true,
  requiresRole: "admin",
});

const list = ref([]);
const loading = ref(true);
const searchValue = ref("");
const statusFilter = ref("all");
const page = ref(1);
const perPage = ref(10);
const pageCount = ref(1);
const showConfirmation = ref(false);
const invoiceIdToDelete = ref(null);
const { $notify } = useNuxtApp();

const totalCount = computed(() => list.value.length);
const completedCount = computed(
  () => list.value.filter((item) => item.status === "Completed").length
);
const paidCount = computed(
  () => list.value.filter((item) => item.status === "Paid").length
);

const filteredList = computed(() => {
  let filtered = [...list.value];
  if (statusFilter.value !== "all")
    filtered = filtered.filter((item) => item.status === statusFilter.value);
  if (searchValue.value)
    filtered = filtered.filter(
      (item) =>
        item.code?.toLowerCase().includes(searchValue.value.toLowerCase()) ||
        item._customer?.fullName
          ?.toLowerCase()
          .includes(searchValue.value.toLowerCase())
    );
  return filtered;
});

const setStatusFilter = (status) => {
  statusFilter.value = status;
};

const filter = () => {
  const search = new URLSearchParams();
  search.set("perPage", perPage.value);
  search.set("page", page.value);
  return search;
};

const getSalesInvoices = async () => {
  loading.value = true;
  try {
    const data = await useApiService.get("sales-invoices?" + filter());
    list.value = data.list || [];
    pageCount.value = Math.ceil(data.total / perPage.value);
    $notify("فاکتورهای فروش با موفقیت بارگذاری شدند", "success");
  } catch (error) {
    $notify("مشکلی در بارگذاری داده‌ها پیش آمد", "error");
  } finally {
    loading.value = false;
  }
};

const handleDelete = (invoiceId) => {
  invoiceIdToDelete.value = invoiceId;
  showConfirmation.value = true;
};

const confirmDelete = async () => {
  if (invoiceIdToDelete.value) {
    try {
      await useApiService.remove(`sales-invoices/${invoiceIdToDelete.value}`);
      $notify("فاکتور با موفقیت حذف شد", "success");
      await getSalesInvoices();
    } catch (error) {
      $notify("مشکلی در حذف فاکتور پیش آمد", "error");
    } finally {
      invoiceIdToDelete.value = null;
      showConfirmation.value = false;
    }
  }
};

watch(page, () => {
  getSalesInvoices();
});
onMounted(() => {
  getSalesInvoices();
});
</script>

<style scoped>
.overflow-x-responsive {
  overflow-x: auto;
}
</style>
