<template>
  <v-row class="bg-white mr-4 mr-md-1 ml-4 rounded-lg pb-16">
    <!--    Title And Action    -->
    <v-col cols="12">
      <v-row>
        <!--      Title      -->
        <v-col class="mt-2" cols="9">
          <v-icon v-if="action === 'list'" class="mt-1 mr-2" color="grey">
            mdi-scale
          </v-icon>

          <v-icon v-if="action === 'add'" class="mt-1 mr-2" color="green">
            mdi-scale
          </v-icon>

          <v-icon v-if="action === 'edit'" class="mt-1 mr-2" color="warning">
            mdi-scale
          </v-icon>

          <v-label class="font-weight-bold mr-2">
            <span v-if="action === 'list'">واحد‌ها</span>
            <span v-if="action === 'add'">افزودن واحد</span>
            <span v-if="action === 'edit'">ویرایش واحد</span>
          </v-label>
        </v-col>

        <!--     Action       -->
        <v-col class="text-end" cols="3">
          <v-btn class="bg-secondary" size="small" @click="toggleAction" icon>
            <!--      Icons       -->
            <v-icon v-if="action === 'list'">mdi-plus</v-icon>
            <v-icon v-if="action === 'edit'">mdi-scale</v-icon>
            <v-icon v-if="action === 'add'">mdi-scale</v-icon>

            <!--       Description       -->
            <v-tooltip activator="parent" location="top">
              <span v-if="action === 'list'">اضافه کردن</span>
              <span v-if="action === 'edit'">واحد‌ها</span>
              <span v-if="action === 'add'">واحد‌ها</span>
            </v-tooltip>
          </v-btn>
        </v-col>
      </v-row>
      <v-divider class="mt-3"></v-divider>
    </v-col>

    <!--    Add Unit   -->
    <v-col v-show="action === 'add' || action === 'edit'" cols="12">
      <units-add-unit ref="addUnit" @exit="toggleAction" @refresh="getUnits" />
    </v-col>

    <!--    Units List   -->
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
            <!--  Delete   -->
            <v-btn
              class="mx-2"
              color="red"
              size="30"
              @click="setDelete({ _id: item._id })"
              icon
            >
              <!--       Icons        -->
              <v-icon size="15">mdi-delete-outline</v-icon>

              <!--       Description       -->
              <v-tooltip activator="parent" location="top"> حذف </v-tooltip>
            </v-btn>

            <!--  Edit   -->
            <v-btn
              class="mx-2"
              color="secondary"
              size="30"
              @click="setEdit(item)"
              icon
            >
              <!--      Icons        -->
              <v-icon size="15">mdi-pencil</v-icon>

              <!--       Description       -->
              <v-tooltip activator="parent" location="top"> ویرایش </v-tooltip>
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
import { ref, onMounted, nextTick } from "vue"; // Vue composition API functions
import { useNuxtApp } from "#app"; // Nuxt composables
import Loading from "~/components/Loading.vue";
import EmptyList from "~/components/EmptyList.vue";

// Define page metadata
definePageMeta({
  layout: "admin",
  middleware: "auth",
  requiresAuth: true,
  requiresRole: "admin",
});

// Reactive state variables
const list = ref([]);
const loading = ref(true);
const action = ref("list");
const addUnit = ref(null);
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

// Toggle between different actions (add, edit, list)
const toggleAction = () => {
  if (action.value === "add" || action.value === "edit") {
    action.value = "list";
  } else {
    action.value = addUnit.value?.action;
  }
};

// Delete a unit by ID
const deleteUnit = async (item) => {
  // start loading
  item.deleteLoading = true;

  // send the request
  try {
    await useApiService.remove("units/" + item._id);
    $notify("عملیات با موفقت انجام شد", "success");
    // Refresh the list of units
    getUnits();
  } catch (error) {
    // Show error message
    $notify("مشکلی در عملیات پیش آمد؛ لطفا دوباره تلاش کنید", "error");
  }

  // stop loading
  item.deleteLoading = false;
};

// Fetch the list of units
const getUnits = async () => {
  // start loading
  loading.value = true;

  // send the request
  try {
    const data = await useApiService.get("units?" + filter());
    // set data to list and stop loading
    list.value = [];
    data.list.forEach((item) => {
      item.setStatusLoading = false;
      item.deleteLoading = false;
      list.value.push(item);
    });
    // set page count from list total
    pageCount.value = Math.ceil(data.total / perPage.value);
  } catch (error) {}

  // stop loading
  loading.value = false;
};

// set status for unit
const setStatus = async (item) => {
  // start loading
  item.setStatusLoading = true;

  // detect the status
  let status = item.status === 1 ? 2 : 1;

  // send the request
  try {
    await useApiService.patch("units/" + item._id + "/status", { status });
    $notify("عملیات با موفقت انجام شد", "success");
    await getUnits();
  } catch (error) {
    $notify("مشکلی در عملیات پیش آمد؛ لطفا دوباره تلاش کنید", "error");
  }

  // stop loading
  item.setStatusLoading = false;
};

// Set the form to edit mode with specific data
const setEdit = (data) => {
  addUnit.value?.setEdit(data);
  action.value = "edit";
};

// Confirm and delete a unit
const setDelete = (item) => {
  if (confirm("آیا مطمئن هستید؟")) {
    deleteUnit(item);
  }
};

// watch page change for get units
watch(page, (newValue) => {
  getUnits();
});

// On component mount, initialize user and fetch units
onMounted(() => {
  nextTick(() => {
    getUnits();
  });
});
</script>

<style scoped></style>
