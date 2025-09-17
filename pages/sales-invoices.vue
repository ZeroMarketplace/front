<template>
  <v-row class="bg-white mr-4 mr-md-1 ml-4 rounded-lg pb-16">
    <!--    Title And Action    -->
    <v-col cols="12">
      <v-row>
        <!--      Title      -->
        <v-col class="mt-2" cols="9">
          <v-icon v-if="action === 'list'" class="mt-1 mr-2" color="grey">
            mdi-receipt-text-outline
          </v-icon>

          <v-icon v-if="action === 'add'" class="mt-1 mr-2" color="green">
            mdi-receipt-text-plus-outline
          </v-icon>

          <v-icon v-if="action === 'edit'" class="mt-1 mr-2" color="warning">
            mdi-receipt-text-outline
          </v-icon>

          <v-label class="font-weight-bold mr-2">
            <span v-if="action === 'list'">فاکتور‌ها</span>
            <span v-if="action === 'add'">افزودن فاکتور</span>
            <span v-if="action === 'edit'">ویرایش فاکتور</span>
          </v-label>
        </v-col>

        <!--     Action       -->
        <v-col class="text-end" cols="3">
          <v-btn class="bg-secondary" size="small" @click="toggleAction" icon>
            <v-icon v-if="action === 'list'"
              >mdi-receipt-text-plus-outline</v-icon
            >
            <v-icon v-if="action === 'edit'">mdi-receipt-text-outline</v-icon>
            <v-icon v-if="action === 'add'">mdi-receipt-text-outline</v-icon>
          </v-btn>
        </v-col>
      </v-row>
      <v-divider class="mt-3"></v-divider>
    </v-col>

    <!--    Add Sales Invoice   -->
    <v-col v-show="action === 'add' || action === 'edit'" cols="12">
      <AddSalesInvoice
        ref="addSalesInvoice"
        @exit="toggleAction"
        @refresh="getSalesInvoices"
      />
    </v-col>

    <!--    sales-invoices List   -->
    <v-col v-show="action === 'list'" class="pb-16" cols="12">
      <!--    loading      -->
      <Loading :loading="loading" />

      <!--    List      -->
      <v-data-table
        class="mt-n5"
        v-if="list.length"
        :loading="loading"
        :headers="listHeaders"
        :items="list"
        :items-per-page="perPage"
        :pageCount="pageCount"
        @update:options="setListOptions"
        sticky
        show-current-page
      >
        <template v-slot:item._customer="{ item }">
          {{ item._customer.fullName }}
        </template>
        <template v-slot:item.total="{ item }">
          {{ formatters.price(item.total) }}
        </template>
        <template v-slot:item.operation="{ item }">
          <!--  Delete   -->
          <v-btn
            class="mx-2"
            color="red"
            size="25"
            @click="setDelete(item)"
            icon
          >
            <v-icon size="15">mdi-delete-outline</v-icon>
          </v-btn>

          <!--  Edit   -->
          <v-btn
            class="mx-2"
            color="secondary"
            size="25"
            @click="setEdit(item)"
            icon
          >
            <v-icon size="15">mdi-pencil</v-icon>
          </v-btn>

          <!--  Edit   -->
          <v-btn
            class="mx-2"
            color="blue"
            size="25"
            @click="setSettlement(item)"
            icon
          >
            <v-icon size="15">mdi-cash-fast</v-icon>
          </v-btn>
        </template>

        <!--      Pagination      -->
        <template v-slot:bottom>
          <v-pagination
            class="mt-5"
            active-color="secondary"
            v-model="page"
            :length="pageCount"
            rounded="circle"
          >
          </v-pagination>
        </template>
      </v-data-table>

      <!--    Empty List Alert      -->
      <EmptyList :list="list" :loading="loading" />
    </v-col>
  </v-row>
</template>

<script setup>
// Importing components
import AddSalesInvoice from "~/components/sales-invoices/AddSalesInvoice.vue";
import { ref, onMounted, watch, nextTick } from "vue";
import { useNuxtApp } from "#app";
import Loading from "~/components/Loading.vue";
import EmptyList from "~/components/EmptyList.vue";
import { formatters } from "~/utils/formatters";

// Define page metadata
definePageMeta({
  layout: "admin",
  middleware: "auth",
  requiresAuth: true,
  requiresRole: "admin",
});

// Reactive state
const action = ref("list");
const loading = ref(true);
const list = ref([]);
const listHeaders = ref([
  {
    title: "کد فاکتور",
    align: "center",
    key: "code",
    sortable: true,
  },
  {
    title: "مشتری",
    align: "center",
    key: "_customer",
    sortable: false,
  },
  {
    title: "تاریخ",
    key: "dateTimeJalali",
    align: "center",
    sortable: true,
  },
  {
    title: "مبلغ (تومان)",
    key: "total",
    align: "center",
    sortable: true,
  },
  {
    title: "عملیات",
    align: "center",
    key: "operation",
    sortable: false,
  },
]);
const listTotal = ref(0);
const page = ref(1);
const perPage = ref(10);
const pageCount = ref(1);
const sortColumn = ref("");
const sortDirection = ref("");
const addSalesInvoice = ref(null);
const { $notify } = useNuxtApp();

// Methods
// Toggle between page actions
const toggleAction = () => {
  if (action.value === "add" || action.value === "edit") {
    action.value = "list";
  } else {
    action.value = addSalesInvoice.value?.action;
  }
};

// delete a sales invoice
const deleteInvoice = async (item) => {
  // start loading
  item.deleteLoading = true;

  // send the request
  try {
    await useApiService.remove("sales-invoices/" + item._id);
    $notify("عملیات با موفقت انجام شد", "success");
    await getSalesInvoices();
  } catch (error) {
    $notify("مشکلی در عملیات پیش آمد؛ لطفا دوباره تلاش کنید", "error");
  }

  // stop loading
  item.deleteLoading = false;
};

const filter = () => {
  let search = new URLSearchParams();

  // Pagination
  search.set("perPage", perPage.value);
  search.set("page", page.value);

  // Sort
  search.set("sortColumn", sortColumn.value);
  search.set("sortDirection", Number(sortDirection.value));

  return search;
};

const getSalesInvoices = async () => {
  // start loading
  loading.value = true;

  try {
    const data = await useApiService.get("sales-invoices?" + filter());
    // set the list
    list.value = [];
    data.list.forEach((item) => {
      item.setEditLoading = false;
      item.setSettlementLoading = false;
      item.deleteLoading = false;
      list.value.push(item);
    });
    // set list total
    listTotal.value = data.total;
    // calc and set page count
    pageCount.value = Math.ceil(listTotal.value / perPage.value);
  } catch (error) {}

  // stop loading
  loading.value = false;
};

const setEdit = async (item) => {
  item.setEditLoading = true;
  await addSalesInvoice.value?.setEdit(item);
  toggleAction();
  item.setEditLoading = false;
};

const setSettlement = async (item) => {
  item.setSettlementLoading = true;
  await addSalesInvoice.value?.setEdit(item);
  await addSalesInvoice.value?.setSettlement();
  item.setSettlementLoading = false;
  toggleAction();
};

const setDelete = (item) => {
  if (confirm("آیا مطمئن هستید؟")) {
    deleteInvoice(item);
  }
};

const setListOptions = (val) => {
  // Handle dateTime
  if (val && val.sortBy[0]) {
    if (val.sortBy[0].key === "dateTimeJalali") {
      sortColumn.value = "dateTime";
    } else {
      sortColumn.value = val.sortBy[0].key;
    }

    sortDirection.value = val.sortBy[0].order === "desc" ? -1 : 1;

    getSalesInvoices();
  }
};

// Lifecycle hooks
onMounted(() => {
  nextTick(() => {
    getSalesInvoices();
  });
});

// Watchers
watch(page, (val, oldVal) => {
  getSalesInvoices();
});
</script>

<style scoped></style>
