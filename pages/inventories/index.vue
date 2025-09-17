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

          <v-label class="font-weight-bold mr-2">
            <span v-if="action === 'list'">موجودی کالا‌ها</span>
          </v-label>
        </v-col>

        <!--     Action       -->
        <v-col class="text-end" cols="3">
          <nuxt-link to="inventories/stock-transfers">
            <v-btn class="bg-secondary" size="small" @click="toggleAction" icon>
              <v-icon>mdi-human-dolly</v-icon>
            </v-btn>
          </nuxt-link>
        </v-col>
      </v-row>
      <v-divider class="mt-3"></v-divider>
    </v-col>

    <!--    Inventories List   -->
    <v-col v-show="action === 'list'" cols="12" class="pb-16">
      <!--    loading      -->
      <Loading :loading="loading" />

      <!--    List      -->
      <v-data-table
        class="mt-n5 overflow-auto"
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
        <!--     Items       -->
        <template v-slot:item.code="{ item }">
          {{ item.productDetails.code }}
        </template>
        <template v-slot:item.barcode="{ item }">
          {{ item.productDetails.barcode }}
        </template>
        <template v-slot:item.productDetails="{ item }">
          {{ item.productDetails.title }}
        </template>
        <template v-slot:item.total="{ item }">
          {{ item.total + " " }}
          {{ item.productDetails._unit.title }}
        </template>
        <template v-slot:item._warehouse="{ item, column }">
          {{ getCountInWarehouse(item, column._id) }}
          {{ item.productDetails._unit.title }}
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
import { ref, onMounted, watch, nextTick } from "vue";

definePageMeta({
  layout: "admin",
  middleware: "auth",
  requiresAuth: true,
  requiresRole: "admin",
});

// Reactive state variables
const list = ref([]);
const loading = ref(true);
const listHeaders = ref([
  { title: "کد", key: "code", align: "center", sortable: false },
  { title: "بارکد", key: "barcode", align: "center", sortable: false },
  { title: "محصول", key: "productDetails", align: "center", sortable: false },
  { title: "تعداد کل", key: "total", align: "center", sortable: false },
]);
const listTotal = ref(0);
const page = ref(1);
const perPage = ref(10);
const pageCount = ref(1);
const sortColumn = ref("");
const sortDirection = ref("");
const action = ref("list");

// Create search parameters for filtering
const filter = () => {
  let search = new URLSearchParams();

  search.set("perPage", perPage.value);
  search.set("page", page.value);
  search.set("sortColumn", sortColumn.value);
  search.set("sortDirection", Number(sortDirection.value));

  return search;
};

// Fetch inventory data
const getInventories = async () => {
  loading.value = true;

  try {
    const data = await useApiService.get("inventories?" + filter());
    // set the list and total
    listTotal.value = data.total;
    list.value = data.list;
    // calc and set page count
    pageCount.value = Math.ceil(listTotal.value / perPage.value);
  } catch (error) {}

  loading.value = false;
};

// Set list options based on sorting
const setListOptions = (val) => {
  if (val && val.sortBy[0]) {
    if (val.sortBy[0].key === "_warehouse") return;

    sortColumn.value =
      val.sortBy[0].key === "dateTimeJalali" ? "dateTime" : val.sortBy[0].key;
    sortDirection.value = val.sortBy[0].order === "desc" ? -1 : 1;

    getInventories();
  }
};

// Fetch warehouses and update headers
const getWarehouses = async () => {
  try {
    const data = await useApiService.get("warehouses");
    data.list.forEach((warehouse) => {
      listHeaders.value.push({
        title: warehouse.title,
        key: "_warehouse",
        align: "center",
        sortable: false,
        _id: warehouse._id,
      });
    });
  } catch (error) {}
};

// Get count of inventory in a specific warehouse
const getCountInWarehouse = (item, _warehouse) => {
  let warehouse = item.warehouses.find((w) => w._id === _warehouse);
  return warehouse ? warehouse.count : "-";
};

// Fetch initial data on component mount
onMounted(() => {
  nextTick(async () => {
    await getWarehouses();
    await getInventories();
  });
});

// Watch for changes in filters and refresh inventory
watch(
  () => ({
    perPage: perPage.value,
    page: page.value,
    sortColumn: sortColumn.value,
    sortDirection: sortDirection.value,
  }),
  () => {
    getInventories();
  },
  { deep: true }
);
</script>

<style scoped></style>
