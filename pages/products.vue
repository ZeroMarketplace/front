<template>
  <v-row class="bg-white mr-4 mr-md-1 ml-4 rounded-lg pb-16">
    <!--    Title And Action    -->
    <v-col cols="12">
      <v-row>
        <!--      Title      -->
        <v-col class="mt-2" cols="9">
          <v-icon v-if="action === 'list'" class="mt-1 mr-2" color="grey">
            mdi-archive-outline
          </v-icon>

          <v-icon v-if="action === 'add'" class="mt-1 mr-2" color="green">
            mdi-archive-plus-outline
          </v-icon>

          <v-icon v-if="action === 'edit'" class="mt-1 mr-2" color="warning">
            mdi-archive-outline
          </v-icon>

          <v-label class="font-weight-bold mr-2">
            <span v-if="action === 'list'">محصولات</span>
            <span v-if="action === 'add'">افزودن محصول</span>
            <span v-if="action === 'edit'">ویرایش محصول</span>
          </v-label>
        </v-col>

        <!--     Action       -->
        <v-col class="text-end" cols="3">
          <v-btn class="bg-secondary" size="small" @click="toggleAction" icon>
            <!--      Icons       -->
            <v-icon v-if="action === 'list'">mdi-archive-plus-outline</v-icon>
            <v-icon v-if="action === 'edit'">mdi-archive-outline</v-icon>
            <v-icon v-if="action === 'add'">mdi-archive-outline</v-icon>

            <!--       Description       -->
            <v-tooltip activator="parent" location="top">
              <span v-if="action === 'list'">اضافه کردن</span>
              <span v-if="action === 'edit'">محصولات</span>
              <span v-if="action === 'add'">محصولات</span>
            </v-tooltip>
          </v-btn>
        </v-col>
      </v-row>
      <v-divider class="mt-3"></v-divider>
    </v-col>

    <!--    Products List   -->
    <v-col v-show="action === 'list'" cols="12" class="">
      <!--    loading      -->
      <Loading :loading="loading" />

      <!--    List      -->
      <v-list class="mx-5" v-show="list.length">
        <v-list-item v-for="item in list" class="rounded border-b pa-2" link>
          <!--      Image        -->
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
            <ProductImage
              :file="item.files && item.files[0] ? item.files[0] : undefined"
              :size="100"
            />
          </template>

          <!--      Name        -->
          <v-list-item-title class="mr-2">
            {{ item.name }}
            <v-label class="d-block">
              <label v-if="item.price"
                >{{ formatters.price(item.price.store) }} تومان</label
              >
              <label v-if="item.variants && item.variants.length">{{
                getProductPriceRange(item)
              }}</label>
            </v-label>
          </v-list-item-title>

          <!--      Actions        -->
          <template v-slot:append>
            <!--  Delete   -->
            <v-btn
              class="mx-1"
              color="red"
              size="30"
              @click="setDelete({ _id: item._id })"
              icon
            >
              <!--       Icon       -->
              <v-icon size="15">mdi-delete-outline</v-icon>

              <!--       Description       -->
              <v-tooltip activator="parent" location="top"> حذف </v-tooltip>
            </v-btn>

            <!--  Copy   -->
            <v-btn
              class="mx-1"
              color="secondary"
              size="30"
              :loading="item.copyLoading"
              @click="setCopy(item)"
              icon
            >
              <!--       Icon       -->
              <v-icon size="15">mdi-content-copy</v-icon>

              <!--       Description       -->
              <v-tooltip activator="parent" location="top"> کپی </v-tooltip>
            </v-btn>

            <!--  Edit   -->
            <v-btn
              class="mx-1"
              color="secondary"
              size="30"
              :loading="item.editLoading"
              @click="setEdit(item)"
              icon
            >
              <!--       Icon        -->
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

    <!--    Add Product    -->
    <v-col v-show="action === 'add' || action === 'edit'" cols="12">
      <products-add-product
        ref="addProduct"
        @exit="toggleAction"
        @refresh="getProducts"
      />
    </v-col>
  </v-row>
</template>

<script setup>
import { ref, nextTick, onMounted } from "vue"; // Vue Composition API functions
import { useNuxtApp } from "#app"; // Nuxt composables
import ProductImage from "~/components/products/ProductImage.vue"; // Component import
import { formatters } from "~/utils/formatters";
import Loading from "~/components/Loading.vue";
import EmptyList from "~/components/EmptyList.vue";

// Define page meta
definePageMeta({
  layout: "admin",
  middleware: "auth",
  requiresAuth: true,
  requiresRole: "admin",
});

// Reactive states
const loading = ref(true);
const action = ref("list");
const list = ref([]);
const addProduct = ref(null);
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

// Fetch all products
const getProducts = async () => {
  loading.value = true;
  try {
    const response = await useApiService.get("products?" + filter());
    list.value = [];
    // @ts-ignore
    response.list.forEach((item) => {
      item.editLoading = false;
      item.copyLoading = false;
      item.deleteLoading = false;
      item.setStatusLoading = false;
      list.value.push(item);
    });
    // @ts-ignore
    pageCount.value = Math.ceil(response.total / perPage.value);
  } catch (e) {
    $notify("مشکلی در عملیات پیش آمد؛ لطفا دوباره تلاش کنید", "error");
  } finally {
    loading.value = false;
  }
};

// Toggle between actions
const toggleAction = () => {
  if (action.value === "add" || action.value === "edit") {
    action.value = "list";
  } else {
    action.value = addProduct.value?.action || "list";
  }
};

// Delete a product
const deleteProduct = async (data) => {
  data.deleteLoading = true;
  try {
    await useApiService.remove("products/" + data._id);
    $notify("عملیات با موفقیت انجام شد", "success");
    getProducts();
  } catch (e) {
    $notify("مشکلی در عملیات پیش آمد؛ لطفا دوباره تلاش کنید", "error");
  } finally {
    data.deleteLoading = false;
  }
};

// set status for product
const setStatus = async (item) => {
  item.setStatusLoading = true;
  const status = item.status === 1 ? 2 : 1;
  try {
    await useApiService.patch("products/" + item._id + "/status", { status });
    $notify("عملیات با موفقت انجام شد", "success");
    await getProducts();
  } catch (e) {
    $notify("مشکلی در عملیات پیش آمد؛ لطفا دوباره تلاش کنید", "error");
  } finally {
    item.setStatusLoading = false;
  }
};

// Confirm and delete a product
const setDelete = (data) => {
  if (confirm("آیا مطمئن هستید؟")) {
    deleteProduct(data);
  }
};

// Fetch a single product for editing
const setEdit = async (data) => {
  // enable edit loading
  data.editLoading = true;

  // set edit to child component
  await addProduct.value?.setEdit(data);

  // stop loading
  data.editLoading = false;

  // toggle to child component
  toggleAction();
};

// Fetch a single product for copying
const setCopy = async (data) => {
  // enable edit loading
  data.copyLoading = true;

  // set edit to child component
  await addProduct.value?.setCopy(data);

  // stop loading
  data.copyLoading = false;

  // toggle to child component
  toggleAction();
};

// Get the price range of a product
const getProductPriceRange = (item) => {
  let min = 0,
    max = 0;

  item.variants.forEach((variant) => {
    if (variant.price) {
      if (min === 0) min = variant.price.store;

      if (variant.price.store >= max) max = variant.price.store;
      if (variant.price.store <= min) min = variant.price.store;
    }
  });

  if (min === 0 && max === 0) {
    return "قیمت ندارد";
  } else if (min === max) {
    return `${formatters.price(min)} تومان`;
  } else {
    return `از ${formatters.price(min)} تا ${formatters.price(max)} تومان`;
  }
};

// watch page change for get products
watch(page, (newValue) => {
  getProducts();
});

// Lifecycle hooks
onMounted(() => {
  nextTick(() => {
    getProducts();
  });
});
</script>

<style scoped></style>
