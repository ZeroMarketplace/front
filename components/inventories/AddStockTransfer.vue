<template>
  <v-form :readonly="loading" @submit.prevent="submit" ref="stockTransfersForm" validate-on="submit lazy">
    <!--    Information     -->
    <v-icon class="mt-1 mr-2" color="grey">mdi-information-outline</v-icon>
    <v-label class="text-black font-weight-bold mx-3">مشخصات انتقال</v-label>
    <v-row class="mx-5">
      <!--   Source Warehouse   -->
      <v-col class="" cols="12" md="4">
        <WarehouseInput
          class="mt-3"
          label="انبار مبدا"
          :rules="[rules.requiredSelect, differentWarehouseRule]"
          v-model="form._sourceWarehouse"
        >
        </WarehouseInput>
      </v-col>

      <!--   Destination Warehouse   -->
      <v-col class="mt-n8 mt-md-0" cols="12" md="4" offset-md="1">
        <WarehouseInput
          class="mt-3"
          label="انبار مقصد"
          :rules="[rules.requiredSelect, differentWarehouseRule]"
          v-model="form._destinationWarehouse"
        >
        </WarehouseInput>
      </v-col>
    </v-row>

    <v-divider class="my-5"></v-divider>

    <!--    Products     -->
    <v-icon class="mt-1 mr-2" color="grey">mdi-archive-outline</v-icon>
    <v-label class="text-black font-weight-bold mx-3">اقلام انتقال</v-label>

    <!--  Add Product   -->
    <v-btn
      class="border"
      @click="addProduct"
      size="30"
      variant="outlined"
      color="pink"
      icon
    >
      <v-icon>mdi-plus</v-icon>
    </v-btn>

    <!-- Products List is Empty -->
    <div v-if="!form.products.length" class="d-flex justify-center w-100 my-16">
      <v-label>اقلامی ندارد</v-label>
    </div>

    <!--  Products List   -->
    <v-row
      class="border mr-md-8 rounded-lg mx-5 mt-3 mb-2 pt-1 pb-2"
      v-for="(product, index) in form.products"
      :key="index"
      :class="product.error ? 'error' : ''"
    >
      <!--  Product Name    -->
      <v-col class="pa-1 mt-2" cols="12" md="3">
        <ProductInput
          v-model="product._id"
          @selected="(val) => onProductSelected(val, index)"
        />
      </v-col>

      <!--   Count    -->
      <v-col class="pa-1 mt-2" cols="12" md="2">
        <v-text-field
          class=""
          v-model="product.count"
          @input="calculateProductTotal(index)"
          label="تعداد"
          type="number"
          :readonly="loading"
          :rules="[rules.required, maxCountRule(product.totalCount)]"
          density="compact"
          variant="outlined"
          hide-details
        >
          <template v-slot:append-inner>
            <v-label v-if="!product.totalCountLoading" class="mx-2 text-caption"
              >از {{ product.totalCount }}</v-label
            >
            <v-progress-circular indeterminate v-else></v-progress-circular>
          </template>
        </v-text-field>
      </v-col>

      <!--   Sales Price    -->
      <v-col class="pa-1 mt-2" cols="12" md="3">
        <v-text-field
          class=""
          v-model="product.price"
          label="قیمت واحد"
          :rules="[rules.required]"
          density="compact"
          variant="outlined"
          readonly
          hide-details
        >
        </v-text-field>
      </v-col>

      <!--  Total  -->
      <v-col
        class="pa-1 text-caption text-center pt-2"
        cols="12"
        offset-md="1"
        md="2"
      >
        <p>جمع کل</p>
        {{ product.total }}
      </v-col>

      <!--  Actions  -->
      <v-col class="pt-4" cols="12" md="1">
        <!--  Delete Product   -->
        <v-btn
          class="bg-white float-end"
          v-if="!product.loading && !product.done"
          @click="deleteProduct(index)"
          size="30"
          variant="outlined"
          color="pink"
          icon
        >
          <v-icon>mdi-delete</v-icon>
        </v-btn>
        <v-progress-circular
          indeterminate
          v-if="product.submitLoading"
        ></v-progress-circular>
        <v-icon v-if="product.done" color="green"> mdi-check-circle </v-icon>
      </v-col>
    </v-row>

    <v-divider class="mt-8 mb-4"></v-divider>

    <!--  Total   -->
    <v-row class="mt-2 mx-4">
      <!--   Total   -->
      <v-col cols="12" md="6" offset-md="6">
        <v-row class="border rounded-lg bg-grey-lighten-3 mx-0 px-5 py-2">
          <!--    Total Count      -->
          <v-col cols="12">
            <v-row class="">
              <v-col cols="5" class="font-weight-bold"> جمع تعداد: </v-col>
              <v-col cols="7" class="text-end font-weight-bold">
                {{ form.totalCount }}
              </v-col>
            </v-row>
          </v-col>

          <!--    Total      -->
          <v-col cols="12">
            <v-row class="">
              <v-col cols="5" class="font-weight-bold"> جمع کل: </v-col>
              <v-col cols="7" class="text-end font-weight-bold">
                {{ form.total }} تومان
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <!--     Actions       -->
    <v-row class="mt-10 mx-1">
      <v-col cols="12">
        <!--       Submit       -->
        <v-btn
          class="border rounded-lg"
          :loading="loading"
          prepend-icon="mdi-check-circle-outline"
          height="40"
          width="100"
          variant="text"
          type="submit"
          density="compact"
        >
          ثبت
        </v-btn>

        <!--       Reset       -->
        <v-btn
          class="border mx-2 rounded-lg"
          color="pink"
          prepend-icon="mdi-delete-outline"
          height="40"
          width="100"
          variant="text"
          @click="reset"
          density="compact"
        >
          بازنگری
        </v-btn>
      </v-col>
    </v-row>
  </v-form>
</template>

<script setup>
import { nextTick, ref, watch } from "vue";
import { useNuxtApp } from "#app";
import ProductInput from "~/components/products/ProductInput.vue";
import WarehouseInput from "~/components/warehouses/WarehouseInput.vue";
import { rules } from "~/utils/validationRules";

// Define reactive form data
const form = ref({
  _id: "",
  _sourceWarehouse: null,
  _destinationWarehouse: null,
  products: [],
  totalCount: 0,
  total: 0,
});

const inventories = ref({});
const loading = ref(false);
const action = ref("add");
const stockTransfersForm = ref(null);
const { $notify } = useNuxtApp();
const emit = defineEmits(["exit", "refresh"]);

// validate different warehouses
const differentWarehouseRule = () => {
  if (form.value._sourceWarehouse === form.value._destinationWarehouse) {
    return "انبار‌های انتقال باید متفاوت باشد";
  } else {
    return true;
  }
};

const maxCountRule = (count) => {
  return (value) => {
    if (value > count) {
      return value <= count || `بیشترین تعداد قابل انتقال ${count}`;
    } else {
      return true;
    }
  };
};

// Function to reset form
const reset = () => {
  form.value = {
    _id: "",
    _sourceWarehouse: null,
    _destinationWarehouse: null,
    products: [],
    totalCount: 0,
    total: 0,
  };
  loading.value = false;
  action.value = "add";
};

// Function to add product
const addProduct = () => {
  form.value.products.push({
    _id: "",
    count: 0,
    totalCount: 0,
    price: 0,
    total: 0,
    totalCountLoading: false,
    submitLoading: false,
    error: false,
    done: false,
  });
};

// Function to delete product
const deleteProduct = (index) => {
  form.value.products.splice(index, 1);
};

// Calculate total for invoice
const calculateInvoiceTotal = () => {
  form.value.total = 0;
  form.value.totalCount = 0;
  form.value.products.forEach((product) => {
    form.value.total += product.total;
    form.value.totalCount += Number(product.count);
  });
};

// Calculate total price for a single product
const calculateProductTotal = (index) => {
  let product = form.value.products[index];
  form.value.products[index].total = product.count * product.price;
  calculateInvoiceTotal();
};

const onProductSelected = async (val, index) => {
  // set product price
  if (val.price) form.value.products[index]["price"] = val.price.consumer;
  else form.value.products[index]["price"] = 0;

  // calculate the product total price
  calculateProductTotal(index);

  // get the product total count
  await nextTick(async () => {
    await setProductTotalCount(index);
  });
};

// Fetch inventory by product ID
const getInventoryOfProduct = async (index) => {
  // start total count loading
  form.value.products[index]["totalCountLoading"] = true;

  try {
    const data = await useApiService.get(
      "products/" + form.value.products[index]._id + "/inventory"
    );
    if (data) {
      // set the inventory to local variable
      inventories.value[form.value.products[index]._id] = data;
      // stop the loading
      form.value.products[index]["totalCountLoading"] = false;
      // set the product total count
      await setProductTotalCount(index);
    }
  } catch (error) {
    $notify("مشکلی در دریافت اطلاعات پیش آمد", "error");
  }
};

// Set product total count based on inventory
const setProductTotalCount = async (index) => {
  // get the inventory from local variable
  let inventory = inventories.value[form.value.products[index]._id];

  // check the inventory exist
  if (inventory) {
    if (form.value._sourceWarehouse) {
      let warehouse = inventory.warehouses.find(
        (w) => w._id === form.value._sourceWarehouse
      );
      form.value.products[index].totalCount = warehouse ? warehouse.count : 0;
    } else {
      $notify("انبار مبدا را انتخاب کنید", "warning");
    }
  } else {
    // get the inventory of product
    await getInventoryOfProduct(index);
  }
};

const stockTransferProduct = async (index) => {
  // start loading of product item
  form.value.products[index].submitLoading = true;

  // start the fetch
  try {
    const data = await useApiService.post("stock-transfers", {
      _sourceWarehouse: form.value._sourceWarehouse,
      _destinationWarehouse: form.value._destinationWarehouse,
      _product: form.value.products[index]._id,
      count: Number(form.value.products[index].count),
    });
    if (data) {
      // stop loading and set done
      form.value.products[index].submitLoading = false;
      form.value.products[index].done = true;
    }
  } catch (error) {
    // stop loading and set the error
    form.value.products[index].submitLoading = false;
    form.value.products[index].error = true;

    // show error
    $notify("مشکلی در انتقال به وجود آمد", "error");

    const status = error?.response?.status;
    const message = error?.response?._data?.message;
    if (status === 400) {
      switch (message) {
        // different warehouse error
        case "_sourceWarehouse & _destinationWarehouse must be unique and different":
          $notify("انبار مبدا و مقصد باید منحصر به فرد و متفاوت باشد", "error");
          break;
      }
    }
  }
};

const add = async () => {
  for (const product of form.value.products) {
    const index = form.value.products.indexOf(product);

    // remove the done product
    if (product.done) form.value.products.splice(index, 1);

    await stockTransferProduct(index);
  }

  let countOfSuccess = 0;
  for (const product of form.value.products) {
    if (product.done) countOfSuccess++;
  }

  if (countOfSuccess === form.value.products.length) {
    $notify("عملیات با موفقیت انجام شد", "success");
    reset();
    emit("exit");
    emit("refresh");
  }
};

const submit = async () => {
  stockTransfersForm.value?.validate();
  if (stockTransfersForm.value?.isValid) {
    loading.value = true;

    if (action.value === "add") {
      await add();
    } else if (this.action === "edit") {
      await edit();
    }

    loading.value = false;
  }
};

// Watch _sourceWarehouse changes
watch(
  () => form.value._sourceWarehouse,
  (val, oldVal) => {
    form.value.products.forEach((_, index) => {
      setProductTotalCount(index);
    });
  }
);

defineExpose({
  action,
});
</script>

<style scoped>
.error {
  border-color: red !important;
}
</style>
