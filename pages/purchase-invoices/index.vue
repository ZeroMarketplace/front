<template>
  <v-card class="spike-card" elevation="10">
    <v-card-item>
      <!-- Summary Cards Section -->
      <div class="overflow-x-responsive">
        <v-row class="d-flex flex-nowrap">
          <v-col cols="12" md="3" sm="6">
            <div
              :class="[
                'pa-6 d-flex ga-3 align-center cursor-pointer rounded-xl',
                { 'bg-bglight': statusFilter === 'all' },
              ]"
              @click="setStatusFilter('all')"
            >
              <v-avatar size="56" class="border border-md border-primary">
                <Icon
                  icon="solar:document-text-linear"
                  height="25"
                  class="text-primary"
                />
              </v-avatar>
              <div>
                <h6 class="text-h6">همه فاکتورها</h6>
                <p class="text-14 lh-normal">{{ totalCount }} فاکتور</p>
              </div>
            </div>
          </v-col>
          <v-col cols="12" md="3" sm="6">
            <div
              :class="[
                'pa-6 d-flex ga-3 align-center cursor-pointer rounded-xl',
                { 'bg-bglight': statusFilter === 'Approved' },
              ]"
              @click="setStatusFilter('Approved')"
            >
              <v-avatar size="56" class="border border-md border-success">
                <Icon
                  icon="solar:check-circle-linear"
                  height="25"
                  class="text-success"
                />
              </v-avatar>
              <div>
                <h6 class="text-h6">تایید شده</h6>
                <p class="text-14 lh-normal">{{ approvedCount }} فاکتور</p>
              </div>
            </div>
          </v-col>
          <v-col cols="12" md="3" sm="6">
            <div
              :class="[
                'pa-6 d-flex ga-3 align-center cursor-pointer rounded-xl',
                { 'bg-bglight': statusFilter === 'Pending Approval' },
              ]"
              @click="setStatusFilter('Pending Approval')"
            >
              <v-avatar size="56" class="border border-md border-warning">
                <Icon
                  icon="solar:clock-circle-linear"
                  height="25"
                  class="text-warning"
                />
              </v-avatar>
              <div>
                <h6 class="text-h6">در انتظار</h6>
                <p class="text-14 lh-normal">{{ pendingCount }} فاکتور</p>
              </div>
            </div>
          </v-col>
          <v-col cols="12" md="3" sm="6">
            <div
              :class="[
                'pa-6 d-flex ga-3 align-center cursor-pointer rounded-xl',
                { 'bg-bglight': statusFilter === 'Paid' },
              ]"
              @click="setStatusFilter('Paid')"
            >
              <v-avatar size="56" class="border border-md border-info">
                <Icon
                  icon="solar:wallet-money-linear"
                  height="25"
                  class="text-info"
                />
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
          <v-text-field
            v-model="searchValue"
            label="جستجوی فاکتور"
            variant="outlined"
            hide-details
            class="w-100"
            density="compact"
          >
            <template v-slot:prepend-inner>
              <Icon icon="solar:magnifer-linear" height="18" width="25" />
            </template>
          </v-text-field>
        </v-sheet>
        <v-btn
          color="primary"
          rounded="pill"
          flat
          to="/purchase-invoices/create"
        >
          فاکتور جدید
        </v-btn>
      </div>

      <!-- Loading -->
      <Loading :loading="loading" />

      <!-- Data Table -->
      <v-table class="spike-table month-table" v-if="!loading && filteredList.length">
        <template v-slot:default>
          <thead>
            <tr>
              <th class="text-14 text-no-wrap">کد فاکتور</th>
              <th class="text-14 text-no-wrap">تامین کننده</th>
              <th class="text-14 text-no-wrap">تاریخ</th>
              <th class="text-14 text-no-wrap">مبلغ (تومان)</th>
              <th class="text-14 text-no-wrap">انبار</th>
              <th class="text-14 text-no-wrap">وضعیت</th>
              <th class="text-14 text-no-wrap text-center">عملیات</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in filteredList" :key="item._id">
              <td class="text-14 font-weight-semibold">{{ item.code }}</td>
              <td class="text-14">{{ item._supplier?.fullName || "-" }}</td>
              <td class="text-14">{{ item.dateTimeJalali }}</td>
              <td class="text-14">{{ formatters.price(item.total) }}</td>
              <td class="text-14">{{ item._warehouse?.title || "-" }}</td>
              <td>
                <v-chip
                  rounded="pill"
                  :color="getStatusColor(item.status)"
                  variant="flat"
                  size="small"
                  label
                >
                  {{ getStatusLabel(item.status) }}
                </v-chip>
              </td>
              <td>
                <div class="d-flex ga-3 align-center justify-center">
                  <RouterLink :to="`/purchase-invoices/edit/${item._id}`">
                    <v-avatar color="lightsuccess" size="32">
                      <Icon
                        icon="solar:pen-linear"
                        class="text-success"
                        height="18"
                      />
                    </v-avatar>
                    <v-tooltip activator="parent" location="bottom"
                      >ویرایش فاکتور</v-tooltip
                    >
                  </RouterLink>

                  <RouterLink
                    to=""
                    @click.stop="handleDeleteInvoice(item._id)"
                    class="cursor-pointer"
                  >
                    <v-avatar color="lighterror" size="32">
                      <Icon
                        icon="solar:trash-bin-minimalistic-linear"
                        class="text-error"
                        height="18"
                      />
                    </v-avatar>
                    <v-tooltip activator="parent" location="bottom"
                      >حذف فاکتور</v-tooltip
                    >
                  </RouterLink>
                </div>
              </td>
            </tr>
          </tbody>
        </template>
      </v-table>

      <!-- Pagination -->
      <v-pagination
        v-if="pageCount > 1"
        class="mt-5"
        active-color="secondary"
        v-model="page"
        :length="pageCount"
        rounded="circle"
      />

      <!-- Empty List Alert -->
      <EmptyList :list="filteredList" :loading="loading" />
    </v-card-item>
  </v-card>

  <!-- Confirmation Dialog -->
  <v-dialog v-model="showConfirmation" max-width="500px">
    <v-card>
      <v-card-title class="pa-4 bg-primary">حذف فاکتور خرید</v-card-title>
      <v-card-text class="pt-4">
        <h5 class="text-16">آیا از حذف این فاکتور اطمینان دارید؟</h5>
      </v-card-text>
      <v-card-actions>
        <v-btn
          color="primary"
          class="px-4"
          variant="flat"
          rounded="pill"
          @click="confirmDelete"
        >
          بله، حذف شود
        </v-btn>
        <v-btn
          color="error"
          variant="flat"
          rounded="pill"
          class="px-4"
          @click="showConfirmation = false"
        >
          انصراف
        </v-btn>
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

// Page meta
definePageMeta({
  layout: "admin-spike",
  middleware: "auth",
  requiresAuth: true,
  requiresRole: "admin",
});

// State
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

// Computed
const totalCount = computed(() => list.value.length);
const approvedCount = computed(
  () => list.value.filter((item) => item.status === "Approved").length
);
const pendingCount = computed(
  () => list.value.filter((item) => item.status === "Pending Approval").length
);
const paidCount = computed(
  () => list.value.filter((item) => item.status === "Paid").length
);

const filteredList = computed(() => {
  let filtered = [...list.value];

  // Filter by status
  if (statusFilter.value !== "all") {
    filtered = filtered.filter((item) => item.status === statusFilter.value);
  }

  // Filter by search
  if (searchValue.value) {
    filtered = filtered.filter(
      (item) =>
        item.code?.toLowerCase().includes(searchValue.value.toLowerCase()) ||
        item._supplier?.fullName
          ?.toLowerCase()
          .includes(searchValue.value.toLowerCase())
    );
  }

  return filtered;
});

// Methods
const setStatusFilter = (status) => {
  statusFilter.value = status;
};

const getStatusColor = (status) => {
  const colors = {
    Draft: "grey",
    "Pending Approval": "warning",
    Approved: "success",
    Processing: "info",
    "Partially Received": "warning",
    Completed: "success",
    Unpaid: "grey",
    "Partially Paid": "warning",
    Paid: "success",
    Cancelled: "error",
    Returned: "error",
    "On Hold": "warning",
  };
  return colors[status] || "grey";
};

const getStatusLabel = (status) => {
  const labels = {
    Draft: "پیش نویس",
    "Pending Approval": "در انتظار تایید",
    Approved: "تایید شده",
    Processing: "در حال تامین",
    "Partially Received": "دریافت جزئی",
    Completed: "کامل شده",
    Unpaid: "پرداخت نشده",
    "Partially Paid": "پرداخت جزئی",
    Paid: "پرداخت شده",
    Cancelled: "باطل شده",
    Returned: "مرجوع شده",
    "On Hold": "معلق",
  };
  return labels[status] || status;
};

const filter = () => {
  const search = new URLSearchParams();
  search.set("perPage", perPage.value);
  search.set("page", page.value);
  return search;
};

const getPurchaseInvoices = async () => {
  loading.value = true;
  try {
    const data = await useApiService.get("purchase-invoices?" + filter());
    list.value = data.list || [];
    pageCount.value = Math.ceil(data.total / perPage.value);
    $notify("فاکتورهای خرید با موفقیت بارگذاری شدند", "success");
  } catch (error) {
    $notify("مشکلی در بارگذاری داده‌ها پیش آمد", "error");
  } finally {
    loading.value = false;
  }
};

const handleDeleteInvoice = (invoiceId) => {
  invoiceIdToDelete.value = invoiceId;
  showConfirmation.value = true;
};

const confirmDelete = async () => {
  if (invoiceIdToDelete.value) {
    try {
      await useApiService.remove(
        `purchase-invoices/${invoiceIdToDelete.value}`
      );
      $notify("فاکتور با موفقیت حذف شد", "success");
      await getPurchaseInvoices();
    } catch (error) {
      $notify("مشکلی در حذف فاکتور پیش آمد", "error");
    } finally {
      invoiceIdToDelete.value = null;
      showConfirmation.value = false;
    }
  }
};

// Watchers
watch(page, () => {
  getPurchaseInvoices();
});

// Lifecycle
onMounted(() => {
  getPurchaseInvoices();
});
</script>

<style scoped>
.overflow-x-responsive {
  overflow-x: auto;
}
</style>
