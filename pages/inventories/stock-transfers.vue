<template>
  <!--   Content     -->
  <v-row class="bg-white mr-4 mr-md-1 ml-4 rounded-lg pb-16">

    <!--    Title And Action    -->
    <v-col cols="12">
      <v-row>
        <!--      Title      -->
        <v-col class="mt-2" cols="9">
          <v-icon v-if="action === 'list'" class="mt-1 mr-2" color="grey">
            mdi-clipboard-list-outline
          </v-icon>

          <v-icon v-if="action === 'add'" class="mt-1 mr-2" color="green">
            mdi-human-dolly
          </v-icon>

          <v-icon v-if="action === 'edit'" class="mt-1 mr-2" color="warning">
            mdi-human-dolly
          </v-icon>

          <v-label class="font-weight-bold mr-2">
            <span v-if="action === 'list'">انتقالات موجودی</span>
            <span v-if="action === 'add'">افزودن انتقال</span>
            <span v-if="action === 'edit'">ویرایش انتقال</span>
          </v-label>
        </v-col>

        <!--     Action       -->
        <v-col class="text-end" cols="3">
          <v-btn class="bg-secondary"
                 size="small"
                 @click="toggleAction"
                 icon>
            <v-icon v-if="action === 'list'">mdi-human-dolly</v-icon>
            <v-icon v-if="action === 'edit'">mdi-clipboard-list-outline</v-icon>
            <v-icon v-if="action === 'add'">mdi-clipboard-list-outline</v-icon>
          </v-btn>
        </v-col>
      </v-row>
      <v-divider class="mt-3"></v-divider>
    </v-col>

    <!--    Inventories Stock Transfer   -->
    <v-col v-show="(action === 'add' || action === 'edit')" cols="12">
      <AddStockTransfer
          ref="addStockTransfers"
          @exit="toggleAction"
          @refresh="getStockTransfers"/>
    </v-col>

    <!--    Stock Transfers List   -->
    <v-col v-show="action === 'list'" cols="12" class="pb-16">

      <!--    loading      -->
      <Loading :loading="loading"/>

      <!--    List      -->
      <v-data-table class="mt-n5 overflow-auto"
                    v-if="list.length"
                    :loading="loading"
                    :headers="listHeaders"
                    :items="list"
                    :items-per-page="perPage"
                    :pageCount="listTotal"
                    @update:options="setListOptions"
                    sticky
                    show-current-page>

        <!--     Items       -->
        <template v-slot:item._sourceWarehouse="{ item }">
          {{ item._sourceWarehouse.title }}
        </template>
        <template v-slot:item._destinationWarehouse="{ item }">
          {{ item._destinationWarehouse.title }}
        </template>
        <template v-slot:item.count="{ item }">
          {{ item.count + ' ' }}
          {{ item.productDetails._unit.title }}
        </template>
        <template v-slot:item.code="{ item }">
          {{ item.productDetails.code }}
        </template>
        <template v-slot:item.productDetails="{ item }">
          {{ item.productDetails.title }}
        </template>
        <template v-slot:item.status="{ item }">
          <span class="text-red" v-if="item.status === 'Draft'">پیش نویس</span>
          <span class="text-orange" v-if="item.status === 'Pending Approval'">در انتظار تایید</span>
          <span class="text-green" v-if="item.status === 'Approved'">تایید شده</span>
          <span class="text-orange" v-if="item.status === 'Dispatched'">خروج از انبار مبدا</span>
          <span class="text-blue" v-if="item.status === 'In Transit'">در مسیر</span>
          <span class="text-green" v-if="item.status === 'Received'">دریافت شده</span>
          <span class="text-green" v-if="item.status === 'Completed'">تکمیل شده</span>
          <span class="text-red" v-if="item.status === 'Completed'">لغو شده</span>
        </template>

        <template v-slot:item.operation="{ item }">
          <!--  Delete   -->
          <v-btn class="mx-2"
                 color="red"
                 size="25"
                 @click="setDelete(item)"
                 icon>
            <v-icon size="15">mdi-delete-outline</v-icon>
          </v-btn>
        </template>

        <!--      Pagination      -->
        <template v-slot:bottom>
          <v-pagination v-if="pageCount > 1"
                        class="mt-5"
                        active-color="secondary"
                        v-model="page"
                        :length="pageCount"
                        rounded="circle">
          </v-pagination>
        </template>
      </v-data-table>

      <!--    Empty List Alert      -->
      <EmptyList :list="list" :loading="loading"/>

    </v-col>

  </v-row>
</template>

<script setup>
import {ref, watch, onMounted, nextTick} from "vue";
import {useNuxtApp}                      from "#app";
import AddStockTransfer                  from "~/components/inventories/AddStockTransfer.vue";
import {useAPI}                          from "~/composables/useAPI";
import Loading                           from "~/components/Loading.vue";
import EmptyList                         from "~/components/EmptyList.vue";

// Define page metadata
definePageMeta({
  layout      : 'admin',
  middleware  : 'auth',
  requiresAuth: true,
  requiresRole: 'admin',
});

// Reactive state variables
const list              = ref([]);
const loading           = ref(true);
const listTotal         = ref(0);
const page              = ref(1);
const perPage           = ref(10);
const pageCount         = ref(1);
const sortColumn        = ref("");
const sortDirection     = ref("");
const action            = ref("list");
const addStockTransfers = ref(null);
const {$notify}         = useNuxtApp();

// Table headers
const listHeaders = [
  {title: "کد", key: "code", align: "center", sortable: false},
  {title: "محصول", key: "productDetails", align: "center", sortable: false},
  {title: "تعداد", key: "count", align: "center", sortable: false},
  {title: "انبار مبدا", key: "_sourceWarehouse", align: "center", sortable: false},
  {title: "انبار مقصد", key: "_destinationWarehouse", align: "center", sortable: false},
  {title: "تاریخ", key: "updatedAtJalali", align: "center", sortable: false},
  {title: "وضعیت", key: "status", align: "center", sortable: false},
  {title: "عملیات", key: "operation", align: "center", sortable: false},
];

// Toggle action mode
const toggleAction = () => {
  if (action.value === "add" || action.value === "edit") {
    action.value = "list";
  } else {
    action.value = addStockTransfers.value?.action; // Adjust this based on actual ref
  }
};

// Create filter query
const filter = () => {
  let search = new URLSearchParams();
  search.set("perPage", perPage.value);
  search.set("page", page.value);
  search.set("sortColumn", sortColumn.value);
  search.set("sortDirection", Number(sortDirection.value));
  return search;
};

// Fetch stock transfers
const getStockTransfers = async () => {
  loading.value = true;

  await useAPI('stock-transfers?' + filter(), {
    method    : 'get',
    onResponse: ({response}) => {
      // set total and list
      listTotal.value = response._data.total;
      list.value      = [];

      // set the loading properties for each item of the list and add them to the list
      response._data.list.forEach(item => {
        item.setEditLoading = false;
        item.deleteLoading  = false;
        list.value.push(item);
      })

      // calc and set the pageCount
      pageCount.value = Math.ceil(listTotal.value / perPage.value);
    }
  });

  loading.value = false;
};

// Handle sorting
const setListOptions = (val) => {
  if (val && val.sortBy[0]) {
    if (val.sortBy[0].key === "_warehouse") return;
    sortColumn.value    = val.sortBy[0].key === "dateTimeJalali" ? "dateTime" : val.sortBy[0].key;
    sortDirection.value = val.sortBy[0].order === "desc" ? -1 : 1;
    getStockTransfers();
  }
};

// Confirm delete action
const setDelete = (item) => {
  if (confirm("آیا مطمئن هستید؟")) {
    deleteStockTransfer(item);
  }
};

// Delete stock transfer
const deleteStockTransfer = async (item) => {
  // start loading
  item.deleteLoading = true;

  await useAPI('stock-transfers/' + item._id, {
    method    : 'delete',
    onResponse: ({response}) => {
      if (response.status === 200) {
        $notify("عملیات با موفقیت انجام شد", "success");

        // refresh list
        getStockTransfers();
      } else {
        $notify("مشکلی در عملیات پیش آمد؛ لطفا دوباره تلاش کنید", "error");
      }
    }
  });

};

// Watch page changes to refresh data
watch(page, () => {
  getStockTransfers();
});

// Fetch data on mount
onMounted(() => {
  nextTick(() => {
    getStockTransfers();
  });
});
</script>


<style scoped>

</style>
