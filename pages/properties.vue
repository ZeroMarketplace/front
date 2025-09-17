<template>
  <v-row class="bg-white mr-4 mr-md-1 ml-4 rounded-lg pb-16">
    <!--    Title And Action    -->
    <v-col cols="12">
      <v-row>
        <!--      Title      -->
        <v-col class="mt-2" cols="9">
          <v-icon v-if="action === 'list'" class="mt-1 mr-2" color="grey">
            mdi-order-bool-descending-variant
          </v-icon>

          <v-icon v-if="action === 'add'" class="mt-1 mr-2" color="green">
            mdi-order-bool-descending-variant
          </v-icon>

          <v-icon v-if="action === 'edit'" class="mt-1 mr-2" color="warning">
            mdi-order-bool-descending-variant
          </v-icon>

          <v-label class="font-weight-bold mr-2">
            <span v-if="action === 'list'">ویژگی‌ها</span>
            <span v-if="action === 'add'">افزودن ویژگی</span>
            <span v-if="action === 'edit'">ویرایش ویژگی</span>
          </v-label>
        </v-col>

        <!--     Action       -->
        <v-col class="text-end" cols="3">
          <v-btn class="bg-secondary" size="small" @click="toggleAction" icon>
            <!--      Icons      -->
            <v-icon v-if="action === 'list'">mdi-plus</v-icon>
            <v-icon v-if="action === 'edit'"
              >mdi-order-bool-descending-variant</v-icon
            >
            <v-icon v-if="action === 'add'"
              >mdi-order-bool-descending-variant</v-icon
            >

            <!--       Description       -->
            <v-tooltip activator="parent" location="top">
              <span v-if="action === 'list'">اضافه کردن</span>
              <span v-if="action === 'edit'">ویژگی‌ها</span>
              <span v-if="action === 'add'">ویژگی‌ها</span>
            </v-tooltip>
          </v-btn>
        </v-col>
      </v-row>
      <v-divider class="mt-3"></v-divider>
    </v-col>

    <!--    Add Property   -->
    <v-col v-show="action === 'add' || action === 'edit'" cols="12">
      <properties-add-property
        ref="addProperty"
        @exit="toggleAction"
        @refresh="getProperties"
      />
    </v-col>

    <!--    Properties List   -->
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
              :loading="item.deleteLoading"
              @click="setDelete(item)"
              icon
            >
              <!--       Icon       -->
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
              <!--       Icon       -->
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
import { ref, onMounted, watch } from "vue";
import { useCookie, useNuxtApp } from "#app";
import Loading from "~/components/Loading.vue";
import EmptyList from "~/components/EmptyList.vue";

definePageMeta({
  layout: "admin",
  middleware: "auth",
  requiresAuth: true,
  requiresRole: "admin",
});

const { $notify } = useNuxtApp();
const user = ref({});
const list = ref([]);
const action = ref("list");
const loading = ref(true);
const addProperty = ref(null);
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

  // set statuses
  search.set("statuses", [1, 2]);

  return search;
};

// get All properties from API
const getProperties = async () => {
  loading.value = true;
  // Request
  try {
    const data = await useApiService.get("properties?" + filter());
    // fill the list and stop loading
    list.value = [];
    // add loadings flags to each item
    data.list.forEach((item) => {
      item.setStatusLoading = false;
      item.deleteLoading = false;
      list.value.push(item);
    });
    loading.value = false;
    // set page count from list total
    pageCount.value = Math.ceil(data.total / perPage.value);
  } catch (error) {
    loading.value = false;
  }
};

const deleteProperty = async (item) => {
  // start loading
  item.deleteLoading = true;

  // send the request
  try {
    await useApiService.remove("properties/" + item._id);
    $notify("عملیات با موفقت انجام شد", "success");
    await getProperties();
  } catch (error) {
    $notify("مشکلی در عملیات پیش آمد؛ لطفا دوباره تلاش کنید", "error");
  }

  // stop the loading
  item.deleteLoading = false;
};

// set status for property
const setStatus = async (item) => {
  // start loading
  item.setStatusLoading = true;

  // detect the status
  let status = item.status === 1 ? 2 : 1;

  // send the request
  try {
    await useApiService.patch("properties/" + item._id + "/status", { status });
    $notify("عملیات با موفقت انجام شد", "success");
    await getProperties();
  } catch (error) {
    $notify("مشکلی در عملیات پیش آمد؛ لطفا دوباره تلاش کنید", "error");
  }

  // stop loading
  item.setStatusLoading = false;
};

const setEdit = (data) => {
  addProperty.value.setEdit(data);
  action.value = "edit";
};

const setDelete = (item) => {
  if (confirm("آیا مطمئن هستید؟")) {
    deleteProperty(item);
  }
};

const toggleAction = () => {
  if (action.value === "add" || action.value === "edit") {
    action.value = "list";
  } else {
    action.value = addProperty.value.action;
  }
};

watch(page, (newValue) => {
  getProperties();
});

onMounted(async () => {
  user.value = useCookie("user").value;
  // set delay for sync mounted and getProperties
  setTimeout(async () => {
    await getProperties();
  }, 10);
});
</script>

<style scoped></style>
