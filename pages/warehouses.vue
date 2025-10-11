<template>
  <v-row class="bg-white mr-4 mr-md-1 ml-4 rounded-lg pb-16">
    <!--    Title And Action    -->
    <v-col cols="12">
      <v-row>
        <!--      Title      -->
        <v-col class="mt-2" cols="9">
          <v-icon v-if="action === 'list'" class="mt-1 mr-2" color="grey">
            mdi-warehouse
          </v-icon>

          <v-icon v-if="action === 'add'" class="mt-1 mr-2" color="green">
            mdi-warehouse
          </v-icon>

          <v-icon v-if="action === 'edit'" class="mt-1 mr-2" color="warning">
            mdi-warehouse
          </v-icon>

          <v-label class="font-weight-bold mr-2">
            <span v-if="action === 'list'">انبار‌ها</span>
            <span v-if="action === 'add'">افزودن انبار</span>
            <span v-if="action === 'edit'">ویرایش انبار</span>
          </v-label>
        </v-col>

        <!--     Action       -->
        <v-col class="text-end" cols="3">
          <v-btn class="bg-secondary" size="small" @click="toggleAction" icon>
            <!--      Icons       -->
            <v-icon v-if="action === 'list'">mdi-plus</v-icon>
            <v-icon v-if="action === 'edit'">mdi-warehouse</v-icon>
            <v-icon v-if="action === 'add'">mdi-warehouse</v-icon>

            <!--       Description       -->
            <v-tooltip activator="parent" location="top">
              <span v-if="action === 'list'">اضافه کردن</span>
              <span v-if="action === 'edit'">انبار‌ها</span>
              <span v-if="action === 'add'">انبار‌ها</span>
            </v-tooltip>
          </v-btn>
        </v-col>
      </v-row>
      <v-divider class="mt-3"></v-divider>
    </v-col>

    <!--    Add Warehouse   -->
    <v-col
      v-show="action === 'add' || action === 'edit'"
      class="pb-10"
      cols="12"
    >
      <warehouses-add-warehouse
        ref="addWarehouse"
        @exit="toggleAction"
        @refresh="getWarehouses"
      />
    </v-col>

    <!--    Warehouses List   -->
    <v-col v-show="action === 'list'" cols="12" class="pb-16">
      <!--    loading      -->
      <Loading :loading="loading" />

      <!--    List      -->
      <v-list class="mx-5">
        <v-list-item v-for="item in list" class="rounded border-b pa-2" link>
          <template v-slot:prepend>
            <!--  Status   -->
            <v-btn
              class="ml-2"
              :color="item.status === 1 ? 'green' : 'red'"
              size="30"
              :loading="item.setStatusLoading"
              @click="setStatus(item)"
            >
              <!--       Icons       -->
              <v-icon v-if="item.status === 1" size="15"
                >mdi-check-outline</v-icon
              >
              <v-icon v-if="item.status === 2" size="15"
                >mdi-close-outline</v-icon
              >

              <!--       Description       -->
              <v-tooltip activator="parent" location="top">
                <span v-if="item.status === 1">غیر فعال کردن</span>
                <span v-if="item.status === 2">فعال کردن</span>
              </v-tooltip>
            </v-btn>
          </template>

          <!--      Title        -->
          <v-list-item-title>{{ item.title }}</v-list-item-title>

          <!--      Actions        -->
          <template v-slot:append>
            <!--  Set Default   -->
            <v-btn
              class="mx-2"
              v-bind="props"
              :loading="item.setDefaultLoading"
              :class="item.defaultFor ? 'bg-secondary' : 'bg-white border'"
              size="30"
              icon
            >
              <!--       Icon       -->
              <v-icon size="15">mdi-star-outline</v-icon>

              <!--       Menu        -->
              <v-menu activator="parent">
                <v-list>
                  <!--         Online Sales             -->
                  <v-list-item
                    @click="setDefault(2, item)"
                    key="1"
                    value="onlineSales"
                  >
                    <v-list-item-title>
                      فروش آنلاین
                      <v-icon
                        v-if="item.defaultFor === 2"
                        size="15"
                        color="secondary"
                        >mdi-star-outline
                      </v-icon>
                    </v-list-item-title>
                  </v-list-item>

                  <!--          Retail            -->
                  <v-list-item
                    @click="setDefault(1, item)"
                    key="2"
                    value="retail"
                  >
                    <v-list-item-title>
                      خرده فروشی
                      <v-icon
                        v-if="item.defaultFor === 1"
                        size="15"
                        color="secondary"
                        >mdi-star-outline
                      </v-icon>
                    </v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>

              <!--       Description       -->
              <v-tooltip activator="parent" location="top">
                پیش فرض برای ...
              </v-tooltip>
            </v-btn>

            <!--  Edit   -->
            <v-btn
              class="mx-2"
              color="secondary"
              size="30"
              @click="setEdit(item)"
              icon
            >
              <!--       Icon        -->
              <v-icon size="15">mdi-pencil</v-icon>

              <!--       Description       -->
              <v-tooltip activator="parent" location="top"> ویرایش </v-tooltip>
            </v-btn>

            <!--  Delete   -->
            <v-btn
              class="mx-2"
              color="red"
              size="30"
              @click="setDelete({ _id: item._id })"
              icon
            >
              <!--      Icon        -->
              <v-icon size="15">mdi-delete-outline</v-icon>

              <!--       Description       -->
              <v-tooltip activator="parent" location="top"> حذف </v-tooltip>
            </v-btn>
          </template>
        </v-list-item>
      </v-list>

      <!--   Pagination    -->
      <v-pagination
        v-if="pageCount > 1"
        class="mt-5"
        active-color="secondary"
        v-model="page"
        :length="pageCount"
        rounded="circle"
      >
      </v-pagination>

      <!--    Empty List Alert      -->
      <EmptyList :list="list" :loading="loading" />
    </v-col>
  </v-row>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useNuxtApp } from "#app";
import Loading from "~/components/Loading.vue";
import EmptyList from "~/components/EmptyList.vue";

// Define page meta
definePageMeta({
  layout: "admin-spike",
  middleware: "auth",
  requiresAuth: true,
  requiresRole: "admin",
});

// Reactive variables
const list = ref([]);
const loading = ref(true);
const action = ref("list");
const addWarehouse = ref(null);
const { $notify } = useNuxtApp();
const page = ref(1);
const perPage = ref(10);
const pageCount = ref(1);
const sortColumn = ref("");
const sortDirection = ref(1);

// filter the table
const filter = () => {
  let search = new URLSearchParams();

  // pagination
  search.set("perPage", perPage.value);
  search.set("page", page.value);

  // sort
  search.set("sortColumn", sortColumn.value);
  search.set("sortDirection", sortDirection.value);

  // statuses
  search.set("statuses", [1, 2]);

  return search;
};

// Fetch the warehouses list
const getWarehouses = async () => {
  // start loading
  loading.value = true;

  // send the request
  try {
    const data = await useApiService.get("warehouses?" + filter());
    // set the list and stop loading
    list.value = [];
    data.list.forEach((item) => {
      item.setDefaultLoading = false;
      list.value.push(item);
    });
    // set page count from list total
    pageCount.value = Math.ceil(data.total / perPage.value);
  } catch (error) {}

  // stop loading
  loading.value = false;
};

// Toggle action between list, add, and edit
const toggleAction = () => {
  if (action.value === "add" || action.value === "edit") {
    action.value = "list";
  } else {
    action.value = addWarehouse.value?.action;
  }
};

// Delete warehouse by ID
const deleteWarehouse = async (item) => {
  // start loading
  item.deleteLoading = true;

  // send the request
  try {
    await useApiService.remove("warehouses/" + item._id);
    $notify("عملیات با موفقیت انجام شد", "success");
    getWarehouses();
  } catch (error) {
    $notify("مشکلی در عملیات پیش آمد؛ لطفا دوباره تلاش کنید", "error");
  }

  item.deleteLoading = false;
};

// set status for warehouse
const setStatus = async (item) => {
  // start loading
  item.setStatusLoading = true;

  // detect the status
  let status = item.status === 1 ? 2 : 1;

  // send the request
  try {
    await useApiService.patch("warehouses/" + item._id + "/status", { status });
    $notify("عملیات با موفقت انجام شد", "success");
    await getWarehouses();
  } catch (error) {
    $notify("مشکلی در عملیات پیش آمد؛ لطفا دوباره تلاش کنید", "error");
  }

  // stop loading
  item.setStatusLoading = false;
};

// Set warehouse for editing
const setEdit = (data) => {
  addWarehouse.value?.setEdit(data);
  action.value = "edit";
};

// Confirm and delete warehouse
const setDelete = (item) => {
  if (confirm("آیا مطمئن هستید؟")) {
    deleteWarehouse(item);
  }
};

// Set warehouse as default
const setDefault = async (typeOfSales, item) => {
  // start loading
  item.setDefaultLoading = true;

  // send the request
  try {
    await useApiService.patch("warehouses/" + item._id + "/defaultFor", {
      typeOfSales,
    });
    $notify("عملیات با موفقیت انجام شد", "success");
    getWarehouses();
  } catch (error) {
    $notify("مشکلی در عملیات پیش آمد؛ لطفا دوباره تلاش کنید", "error");
  }

  // stop loading
  item.setDefaultLoading = false;
};

// watch page change for get warehouses
watch(page, (newValue) => {
  getWarehouses();
});

// Initialize component
onMounted(async () => {
  await nextTick(() => {
    getWarehouses();
  });
});
</script>

<style scoped></style>
