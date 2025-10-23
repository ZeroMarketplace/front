<template>
  <v-card class="spike-card" elevation="10">
    <v-card-item>
      <!-- Header -->
      <div class="d-flex justify-space-between align-center mb-6">
        <h5 class="text-20">ایجاد فاکتور خرید</h5>
        <v-btn color="error" variant="flat" rounded="pill" to="/purchase-invoices">
          <Icon icon="solar:arrow-right-linear" height="18" class="ml-2" />
          بازگشت به لیست
        </v-btn>
      </div>

      <v-form ref="formRef" validate-on="submit lazy" @submit.prevent="submitForm">
        <!-- Invoice Details Section -->
        <div class="bg-bglight pa-6 rounded-md mb-6">
          <h6 class="text-h6 mb-4">جزئیات فاکتور</h6>

          <v-row>
            <v-col cols="12" md="6">
              <v-label class="font-weight-semibold pb-2">شناسه فاکتور</v-label>
              <v-text-field v-model="form.invoiceId" variant="outlined" density="comfortable" placeholder="PO-102"
                readonly hide-details />
            </v-col>

            <v-col cols="12" md="6">
              <v-label class="font-weight-semibold pb-2">تاریخ</v-label>
              <v-text-field v-model="form.date" variant="outlined" density="comfortable" placeholder="انتخاب تاریخ"
                hide-details />
            </v-col>
          </v-row>
        </div>

        <!-- Supplier/Company Section -->
        <div class="bg-bglight pa-6 rounded-md mb-6">
          <v-row>
            <v-col cols="12" md="4">
              <h6 class="text-h6 mb-3">خریدار</h6>
              <v-text-field v-model="form.buyerName" variant="outlined" density="comfortable"
                placeholder="نام شرکت خریدار" hide-details class="mb-3" />
              <v-textarea v-model="form.buyerAddress" variant="outlined" density="comfortable" placeholder="آدرس خریدار"
                rows="3" hide-details />
            </v-col>

            <v-col cols="12" md="4">
              <h6 class="text-h6 mb-3">تامین کننده</h6>
              <v-text-field v-model="form.supplierName" variant="outlined" density="comfortable"
                placeholder="نام تامین کننده" hide-details class="mb-3" />
              <v-textarea v-model="form.supplierAddress" variant="outlined" density="comfortable"
                placeholder="آدرس تامین کننده" rows="3" hide-details />
            </v-col>

            <v-col cols="12" md="4">
              <h6 class="text-h6 mb-3">وضعیت</h6>
              <v-select v-model="form.status" :items="statusOptions" variant="outlined" density="comfortable"
                placeholder="انتخاب وضعیت" hide-details class="mb-3" />

              <v-label class="font-weight-semibold pb-2">انبار</v-label>
              <v-select v-model="form.warehouse" :items="warehouseOptions" variant="outlined" density="comfortable"
                placeholder="انتخاب انبار" hide-details />
            </v-col>
          </v-row>
        </div>

        <!-- Items Section -->
        <div class="bg-bglight pa-6 rounded-md mb-6">
          <div class="d-flex justify-space-between align-center mb-4">
            <h6 class="text-h6">اقلام فاکتور</h6>
            <v-btn color="primary" variant="outlined" size="small" @click="addItem" prepend-icon="mdi-plus">
              افزودن قلم
            </v-btn>
          </div>

          <!-- Items Table -->
          <v-table class="spike-table">
            <thead>
              <tr>
                <th class="text-subtitle-1 font-weight-semibold">نام قلم</th>
                <th class="text-subtitle-1 font-weight-semibold">قیمت واحد</th>
                <th class="text-subtitle-1 font-weight-semibold">تعداد</th>
                <th class="text-subtitle-1 font-weight-semibold">مجموع</th>
                <th class="text-subtitle-1 font-weight-semibold text-center">عملیات</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in form.items" :key="index" class="month-item">
                <td>
                  <v-text-field v-model="item.name" variant="outlined" density="compact" placeholder="نام قلم"
                    hide-details />
                </td>
                <td>
                  <v-text-field v-model="item.unitPrice" variant="outlined" density="compact" type="number"
                    placeholder="0" hide-details @input="calculateItemTotal(index)" />
                </td>
                <td>
                  <v-text-field v-model="item.units" variant="outlined" density="compact" type="number" placeholder="0"
                    hide-details @input="calculateItemTotal(index)" />
                </td>
                <td>
                  <span class="font-weight-semibold">{{ formatPrice(item.total) }}</span>
                </td>
                <td class="text-center">
                  <v-btn color="error" variant="text" size="small" icon @click="removeItem(index)">
                    <Icon icon="solar:trash-bin-minimalistic-linear" height="18" />
                  </v-btn>
                </td>
              </tr>

              <!-- Empty state -->
              <tr v-if="form.items.length === 0">
                <td colspan="5" class="text-center py-8 text-grey">
                  هیچ قلمی اضافه نشده است
                </td>
              </tr>
            </tbody>
          </v-table>
        </div>

        <!-- Totals Section -->
        <div class="bg-bglight pa-6 rounded-md mb-6">
          <v-row>
            <v-col cols="12" md="8">
              <!-- Additional Notes -->
              <v-label class="font-weight-semibold pb-2">یادداشت‌ها</v-label>
              <v-textarea v-model="form.notes" variant="outlined" density="comfortable"
                placeholder="یادداشت‌های اضافی..." rows="3" hide-details />
            </v-col>
            <v-col cols="12" md="4">
              <div class="text-end">
                <div class="d-flex justify-space-between mb-2">
                  <span>جمع کل:</span>
                  <span class="font-weight-semibold">{{ formatPrice(totals.subtotal) }}</span>
                </div>
                <div class="d-flex justify-space-between mb-2">
                  <span>مالیات:</span>
                  <span class="font-weight-semibold">{{ formatPrice(totals.tax) }}</span>
                </div>
                <div class="d-flex justify-space-between mb-2">
                  <span>تخفیف:</span>
                  <span class="font-weight-semibold">{{ formatPrice(totals.discount) }}</span>
                </div>
                <v-divider class="my-2" />
                <div class="d-flex justify-space-between">
                  <span class="text-h6">مجموع نهایی:</span>
                  <span class="text-h6 font-weight-bold text-primary">{{ formatPrice(totals.grandTotal) }}</span>
                </div>
              </div>
            </v-col>
          </v-row>
        </div>

        <!-- Action Buttons -->
        <div class="d-flex justify-end ga-3">
          <v-btn color="success" variant="flat" rounded="pill" type="submit" :loading="loading" class="text-white">
            ذخیره فاکتور
          </v-btn>
          <v-btn color="error" variant="flat" rounded="pill" to="/purchase-invoices" class="text-white">
            انصراف
          </v-btn>
        </div>
      </v-form>
    </v-card-item>
  </v-card>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useNuxtApp } from "#app";
import { Icon } from "@iconify/vue";

definePageMeta({
  layout: "admin-spike",
  middleware: "auth",
  requiresAuth: true,
  requiresRole: "admin",
});

const router = useRouter();
const { $notify } = useNuxtApp();
const formRef = ref(null);
const loading = ref(false);

// Form data
const form = ref({
  invoiceId: `PO-${Date.now().toString().slice(-6)}`,
  date: new Date().toLocaleDateString('fa-IR'),
  buyerName: 'شرکت خریدار',
  buyerAddress: 'آدرس شرکت خریدار',
  supplierName: '',
  supplierAddress: '',
  status: 'pending',
  warehouse: '',
  notes: '',
  items: []
});

// Status options for purchase invoices
const statusOptions = [
  { title: 'در انتظار', value: 'pending' },
  { title: 'تأیید شده', value: 'approved' },
  { title: 'ارسال شده', value: 'sent' },
  { title: 'دریافت شده', value: 'received' },
  { title: 'پرداخت شده', value: 'paid' },
  { title: 'لغو شده', value: 'cancelled' }
];

// Warehouse options
const warehouseOptions = [
  { title: 'انبار مرکزی', value: 'main' },
  { title: 'انبار فرعی', value: 'secondary' },
  { title: 'انبار خرده فروشی', value: 'retail' }
];

// Computed totals
const totals = computed(() => {
  const subtotal = form.value.items.reduce((sum, item) => sum + (item.total || 0), 0);
  const tax = subtotal * 0.09; // 9% tax
  const discount = subtotal * 0.05; // 5% discount
  const grandTotal = subtotal + tax - discount;

  return {
    subtotal,
    tax,
    discount,
    grandTotal
  };
});

// Methods
const addItem = () => {
  form.value.items.push({
    name: '',
    unitPrice: 0,
    units: 1,
    total: 0
  });
};

const removeItem = (index) => {
  form.value.items.splice(index, 1);
};

const calculateItemTotal = (index) => {
  const item = form.value.items[index];
  item.total = (item.unitPrice || 0) * (item.units || 0);
};

const formatPrice = (price) => {
  return new Intl.NumberFormat('fa-IR').format(price || 0);
};

const submitForm = async () => {
  loading.value = true;
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    const invoiceData = {
      ...form.value,
      totals: totals.value
    };

    // Here you would call your API
    // await useApiService.post('purchase-invoices', invoiceData);

    $notify('فاکتور خرید با موفقیت ایجاد شد', 'success');
    router.push('/purchase-invoices');
  } catch (error) {
    $notify('مشکلی در ایجاد فاکتور پیش آمد', 'error');
  } finally {
    loading.value = false;
  }
};

// Initialize with one empty item
addItem();
</script>
