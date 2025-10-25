<template>
  <v-form
    :readonly="loading"
    @submit.prevent="submit"
    ref="addSalesInvoiceForm"
    validate-on="submit lazy"
  >
    <!--  Settlement Dialog  -->
    <SettlementDialog
      v-model="settlementDialogFlag"
      :_id="settlementId"
      type="sales-invoice"
      @exit="closeSettlementDialog"
      ref="settlementDialog"
    />

    <!--    Information     -->
    <v-icon class="mt-1 mr-2" color="grey">mdi-information-outline</v-icon>
    <v-label class="text-black font-weight-bold mx-3">مشخصات فاکتور</v-label>
    <v-row>
      <!--   User   -->
      <v-col class="mt-md-0" cols="12" md="4">
        <UserInput
          class="mt-3"
          label="کاربر"
          v-model="form._customer"
          :readonly="loading"
          :insert-dialog-icon="true"
          :rules="[rules.requiredSelect]"
        >
        </UserInput>
      </v-col>

      <!--   Date   -->
      <v-col class="mt-n8 mt-md-0" cols="12" md="4">
        <v-text-field
          id="customDatePickerInput"
          class="mt-3"
          v-model="form.dateTime"
          :readonly="loading"
          :rules="[rules.required]"
          label="تاریخ و ساعت"
          density="compact"
          variant="outlined"
        >
        </v-text-field>

        <PersianDatePicker
          v-model="form.dateTime"
          color="#424242"
          custom-input="#customDatePickerInput"
          lang="fa"
          type="datetime"
          format="YYYY-MM-DD HH:mm:ss"
          display-format="dddd jDD jMMMM jYYYY"
        >
        </PersianDatePicker>
      </v-col>

      <!--   Description   -->
      <v-col class="" cols="12" md="4">
        <v-text-field
          class="mt-3"
          v-model="form.description"
          :readonly="loading"
          label="توضیحات"
          density="compact"
          variant="outlined"
        >
        </v-text-field>
      </v-col>
    </v-row>

    <v-divider class="my-5"></v-divider>

    <!--    Products     -->
    <v-icon class="mt-1 mr-2" color="grey">mdi-archive-outline</v-icon>
    <v-label class="text-black font-weight-bold mx-3">اقلام فاکتور</v-label>

    <!--  Stock Transfer Dialog (product)   -->
    <StockTransferDialog
      ref="stockTransferDialogRef"
      v-model="stockTransferDialog"
      @refresh="(val) => getInventoryByProductId(val._product, true)"
      @exit="hideStockTransferDialog"
    />

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

    <!--  Product Selector   -->
    <v-row class="mt-2 mb-2">
      <!--      Product      -->
      <v-col cols="12" md="6" offset-md="3">
        <ProductInput
          v-model="form.productSelector._id"
          @selected="(val) => onProductSelector(val)"
        />
      </v-col>
      <v-col class="text-caption" cols="12" md="6" offset-md="3">
        <v-row>
          <v-col cols="5">
            <!--    Price    -->
            <v-row v-if="form.productSelector.price" class="text-caption mx-5">
              قیمت: {{ formatters.price(form.productSelector.price) }} تومان
            </v-row>
            <!--    Inventory    -->
            <v-row
              class="text-caption mx-5"
              v-if="
                form.productSelector._id &&
                inventories[form.productSelector._id]
              "
            >
              موجودی کل:
              {{ inventories[form.productSelector._id].total }}
              {{ form.productSelector._unit.title }}
            </v-row>
          </v-col>
          <v-col
            v-if="
              form.productSelector._id && inventories[form.productSelector._id]
            "
            cols="5"
          >
            <v-row
              v-for="warehouse in inventories[form.productSelector._id]
                .warehouses"
            >
              {{ warehouse.title }}:
              {{ warehouse.count }}
              {{ form.productSelector._unit.title }}
            </v-row>
          </v-col>
          <v-col class="text-center" cols="2">
            <v-btn
              v-if="
                form.productSelector._id &&
                inventories[form.productSelector._id] &&
                inventories[form.productSelector._id].total
              "
              class="mt-n2"
              @click="addProductSelectorItem"
              size="small"
              color="green"
              icon
            >
              <v-icon>mdi-plus</v-icon>
            </v-btn>
            <v-progress-circular
              v-if="form.productSelector.loading"
              indeterminate
            ></v-progress-circular>
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <!-- Products List is Empty -->
    <div v-if="!form.products.length" class="d-flex justify-center w-100 my-16">
      <v-label>اقلامی ندارد</v-label>
    </div>

    <!--  Products List   -->
    <v-row
      class="border rounded-lg mx-5 mt-3 mb-2 pt-1 pb-2"
      v-for="(product, index) in form.products"
    >
      <!--  Product Name    -->
      <v-col class="pa-1 mt-2" cols="12" md="4">
        <ProductInput
          v-model="product._id"
          :rules="[rules.requiredSelect]"
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
          :rules="[rules.required, maxCountRule(product.totalCount, index)]"
          density="compact"
          variant="outlined"
        >
          <template v-slot:details>
            <a
              class="ml-n4 mt-n5 text-caption font-weight-bold text-blue cursor-pointer"
              v-if="product.stockTransferError"
              @click="showStockTransferDialog(index)"
            >
              انتقال
            </a>
          </template>
          <template v-slot:append-inner>
            <v-label v-if="!product.loading" class="mx-2 text-caption"
              >از {{ product.totalCount }}</v-label
            >
            <v-progress-circular indeterminate v-else></v-progress-circular>
          </template>
        </v-text-field>
      </v-col>

      <!--   Warehouse    -->
      <v-col class="pa-1 mt-2" cols="12" md="2">
        <WarehouseInput
          label="انبار"
          v-model="product._warehouse"
          @update:modelValue="setProductTotalCount(index)"
          :readonly="loading"
          :rules="[rules.requiredSelect]"
        >
        </WarehouseInput>
      </v-col>

      <!--   Sales Price    -->
      <v-col class="pa-1 mt-2" cols="12" md="2">
        <PriceInput
          class=""
          v-model="product.price"
          @update:modelValue="calculateProductTotal(index)"
          label="قیمت واحد"
          :rules="[rules.required]"
          hide-details
        />
      </v-col>

      <!--  Total  -->
      <v-col class="pa-1 text-caption text-center pt-2" cols="12" md="1">
        <p>جمع کل</p>
        {{ formatters.price(product.total) }}
      </v-col>

      <!--  Actions  -->
      <v-col class="pt-4" cols="12" md="1">
        <!--  Delete Product   -->
        <v-btn
          class="bg-white float-end"
          @click="deleteProduct(index)"
          size="30"
          variant="outlined"
          color="pink"
          icon
        >
          <v-icon>mdi-delete</v-icon>
        </v-btn>
      </v-col>
    </v-row>

    <v-divider class="mt-8 mb-4"></v-divider>

    <!--    Additions and subtractions     -->
    <v-icon class="mt-1 mr-2" color="grey">mdi-plus-minus-variant</v-icon>
    <v-label class="text-black font-weight-bold mx-3">اضافات و کسورات</v-label>

    <!--  Add Operation   -->
    <nuxt-link target="_blank" to="/add-and-subtract">
      <v-btn class="border" size="30" variant="outlined" color="pink" icon>
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </nuxt-link>

    <!--  Add-And-Subtract & Total   -->
    <v-row class="mt-2 mx-4">
      <!--   Add-And-Subtract    -->
      <v-col class="" cols="12" md="6">
        <!--   Chips     -->
        <v-chip-group
          v-model="selectedAddAndSubtract"
          class="overflow-hidden my-5 my-md-0"
          column
          multiple
        >
          <v-chip
            v-for="value in addAndSubtract"
            :key="value._id"
            :value="value._id"
            class="mx-2"
            variant="outlined"
            @click="toggleAddAndSubtract(value._id)"
            filter
          >
            {{ value.title }}
          </v-chip>
        </v-chip-group>

        <!--   Inputs for Add and Subtract    -->
        <v-row class="my-5 my-md-2">
          <!--      Add And Subtract     -->
          <v-col v-for="item in form.addAndSubtract" cols="12" md="8">
            <PercentOrPriceInput
              v-model="item.value"
              :label="getAddAndSubtractDetail(item._reason).title"
              :readonly="loading"
              :rules="[rules.required]"
              @update:modelValue="calculateInvoiceTotal"
            />
          </v-col>
        </v-row>
      </v-col>

      <!--   Total   -->
      <v-col cols="12" md="6">
        <v-row class="border rounded-lg bg-grey-lighten-3 mx-0 px-5 py-2">
          <!--    Total      -->
          <v-col cols="12">
            <v-row class="">
              <v-col cols="5" class=""> کل: </v-col>
              <v-col cols="7" class="text-end">
                {{ formatters.price(form.total) }} تومان
              </v-col>
            </v-row>
          </v-col>

          <!--    add and subtract      -->
          <v-col
            class="my-md-2"
            v-for="addAndSubtract in form.addAndSubtract"
            cols="12"
          >
            <v-row class="">
              <v-col cols="5" class="">
                {{ getAddAndSubtractDetail(addAndSubtract._reason).title }}:
              </v-col>
              <v-col cols="7" class="text-end">
                {{ formatters.price(addAndSubtract.amount) }} تومان
              </v-col>
            </v-row>
          </v-col>

          <!--    Total      -->
          <v-col cols="12">
            <v-row class="">
              <v-col cols="5" class="font-weight-bold"> جمع کل: </v-col>
              <v-col cols="7" class="text-end font-weight-bold">
                {{ formatters.price(form.sum) }} تومان
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

        <!--       Settlement       -->
        <v-btn
          class="border mx-2 rounded-lg"
          v-if="action === 'edit'"
          color="blue"
          prepend-icon="mdi-cash-fast"
          height="40"
          width="100"
          variant="text"
          @click="setSettlement"
          density="compact"
        >
          تسویه
        </v-btn>
      </v-col>
    </v-row>
  </v-form>
</template>

<script setup>
// Import necessary composables and components
import { ref, onMounted, nextTick } from "vue";
import ProductInput from "~/components/products/ProductInput.vue";
import StockTransferDialog from "~/components/inventories/StockTransferDialog.vue";
import UserInput from "~/components/users/UserInput.vue";
import WarehouseInput from "~/components/warehouses/WarehouseInput.vue";
import SettlementDialog from "~/components/settlements/SettlementDialog.vue";
import { rules } from "~/utils/validationRules";
import { formatters } from "~/utils/formatters";
import PercentOrPriceInput from "~/components/price/PercentOrPriceInput.vue";
import PriceInput from "~/components/price/PriceInput.vue";

// Define reactive state
const settlementDialogFlag = ref(false);
const settlementId = ref("");
const form = ref({
  _id: "",
  _customer: null,
  dateTime: new Date(),
  description: "",
  productSelector: {
    _id: "",
    price: "",
    _unit: "",
    loading: false,
  },
  products: [],
  addAndSubtract: [],
  sum: 0,
  total: 0,
});
const inventories = ref({});
const addAndSubtract = ref([]);
const selectedAddAndSubtract = ref([]);
const defaultRetailWarehouse = ref("");
const stockTransferDialog = ref(false);
const stockTransferDialogRef = ref(null);
const loading = ref(false);
const action = ref("add");
const { $notify } = useNuxtApp();
const addSalesInvoiceForm = ref(null);
const emit = defineEmits(["exit", "refresh"]);
// Define methods
const reset = () => {
  form.value._id = "";
  form.value.sum = 0;
  form.value.total = 0;
  form.value.products = [];
  form.value.addAndSubtract = [];
  selectedAddAndSubtract.value = [];
  loading.value = false;
  action.value = "add";
};

const convertFormNumbers = () => {
  // convert products numbers
  form.value.products.forEach((product) => {
    product.count = Number(product.count);
    product.price = Number(product.price);
  });

  // convert addAndSub numbers
  form.value.addAndSubtract.forEach((addAndSubItem) => {
    addAndSubItem.value = Number(addAndSubItem.value);
  });
};

const add = async () => {
  // Convert numbers
  convertFormNumbers();

  // send the request
  try {
    const data = await useApiService.post("sales-invoices", {
      _customer: form.value._customer,
      dateTime: form.value.dateTime,
      description: form.value.description,
      products: form.value.products,
      AddAndSub: form.value.addAndSubtract,
    });
    if (data) {
      $notify("عملیات با موفقت انجام شد", "success");

      // set the _id
      form.value._id = data._id;

      // set the settlement
      setSettlement();
    }
  } catch (error) {
    $notify("مشکلی در عملیات پیش آمد؛ لطفا دوباره تلاش کنید", "error");
  }
};

const edit = async () => {
  // Convert numbers
  convertFormNumbers();

  // send the request
  try {
    const data = await useApiService.put("sales-invoices/" + form.value._id, {
      _customer: form.value._customer,
      dateTime: form.value.dateTime,
      description: form.value.description,
      products: form.value.products,
      AddAndSub: form.value.addAndSubtract,
    });
    if (data) {
      $notify("عملیات با موفقت انجام شد", "success");

      // set the settlement
      setSettlement();
    }
  } catch (error) {
    $notify("مشکلی در عملیات پیش آمد؛ لطفا دوباره تلاش کنید", "error");
  }
};

const submit = async () => {
  addSalesInvoiceForm.value?.validate();
  if (addSalesInvoiceForm.value?.isValid) {
    loading.value = true;
    if (action.value === "add") {
      await add();
    } else if (action.value === "edit") {
      await edit();
    }
    loading.value = false;
  }
};

const addProduct = () => {
  form.value.products.push({
    _id: "",
    count: 0,
    price: 0,
    totalCount: 0,
    _warehouse: undefined,
    loading: false,
    stockTransferError: false,
    total: 0,
  });
};

const addProductSelectorItem = () => {
  let warehouse = undefined;
  if (inventories.value[form.value.productSelector._id].warehouses.length > 1) {
    if (defaultRetailWarehouse.value) {
      warehouse = inventories.value[
        form.value.productSelector._id
      ].warehouses.find((w) => w._id === defaultRetailWarehouse.value._id);
    }
  } else {
    warehouse = inventories.value[form.value.productSelector._id].warehouses[0];
  }

  let totalCount = 0;
  if (warehouse) {
    totalCount = warehouse.count;
  }

  form.value.products.push({
    _id: form.value.productSelector._id,
    count: 0,
    price: form.value.productSelector.price,
    totalCount: totalCount,
    _warehouse: warehouse ? warehouse._id : undefined,
    loading: false,
    stockTransferError: false,
    total: 0,
  });
};

const onProductSelected = async (val, index) => {
  form.value.products[index].price = val.price ? val.price.consumer : 0;
  form.value.products[index].loading = true;
  await getInventoryByProductId(val._id);
  form.value.products[index].loading = false;

  if (inventories.value[val._id].total) {
    let warehouse = undefined;
    if (inventories.value[val._id].warehouses.length > 1) {
      if (defaultRetailWarehouse.value) {
        warehouse = inventories.value[val._id].warehouses.find(
          (w) => w._id === defaultRetailWarehouse.value._id
        );
      }
      form.value.products[index]._warehouse = warehouse._id;
    } else {
      warehouse = inventories.value[val._id].warehouses[0];
      form.value.products[index]._warehouse = warehouse._id;
    }

    if (warehouse) {
      form.value.products[index].totalCount = warehouse.count;
    }
  }

  calculateProductTotal(index);
};

const onProductSelector = async (val, index) => {
  form.value.productSelector.price = val.price ? val.price.consumer : 0;
  form.value.productSelector._unit = val._unit;
  form.value.productSelector.loading = true;
  await getInventoryByProductId(val._id);
  form.value.productSelector.loading = false;
};

const deleteProduct = (index) => {
  form.value.products.splice(index, 1);
};

const calculateInvoiceTotal = () => {
  form.value.total = 0;
  form.value.products.forEach((product) => {
    form.value.total += product.total;
  });

  form.value.sum = Number(form.value.total);

  // calc subtracts
  form.value.addAndSubtract.forEach((addAndSubtract) => {
    const detailAddAndSubtract = getAddAndSubtractDetail(
      addAndSubtract._reason
    );
    addAndSubtract.value = Number(addAndSubtract.value);
    if (detailAddAndSubtract) {
      if (detailAddAndSubtract.operation === "subtract") {
        let operationSum = 0;
        if (addAndSubtract.value <= 100) {
          operationSum = Math.floor(
            (form.value.total * addAndSubtract.value) / 100
          );
          form.value.sum -= operationSum;
        } else {
          operationSum = addAndSubtract.value;
          form.value.sum -= addAndSubtract.value;
        }
        addAndSubtract.amount = operationSum;
      }
    }
  });

  // calc addition
  form.value.addAndSubtract.forEach((addAndSubtract) => {
    const detailAddAndSubtract = getAddAndSubtractDetail(
      addAndSubtract._reason
    );
    addAndSubtract.value = Number(addAndSubtract.value);
    if (detailAddAndSubtract) {
      if (detailAddAndSubtract.operation === "add") {
        let operationSum = 0;
        if (addAndSubtract.value <= 100) {
          operationSum = Math.ceil(
            (form.value.sum * addAndSubtract.value) / 100
          );
          form.value.sum += operationSum;
        } else {
          operationSum = addAndSubtract.value;
          form.value.sum += addAndSubtract.value;
        }
        addAndSubtract.amount = operationSum;
      }
    }
  });
};

const calculateProductTotal = (index) => {
  form.value.products[index].total =
    Number(form.value.products[index].count) *
    Number(form.value.products[index].price);
  calculateInvoiceTotal();
};

const toggleAddAndSubtract = (_id) => {
  const index = form.value.addAndSubtract.findIndex((p) => p._reason === _id);
  if (index !== -1) {
    form.value.addAndSubtract.splice(index, 1);
  } else {
    const addAndSubtractDetail = getAddAndSubtractDetail(_id);
    form.value.addAndSubtract.push({
      _reason: _id,
      value: addAndSubtractDetail.default,
      amount: 0,
    });
  }
  calculateInvoiceTotal();
};

const getAddAndSubtractDetail = (_id) => {
  return addAndSubtract.value.find((p) => p._id === _id) || undefined;
};

const getAddAndSubtract = async () => {
  loading.value = true;
  try {
    const data = await useApiService.get("add-and-subtract?perPage=50");
    if (data) {
      // set the list
      addAndSubtract.value = data.list;
    }
  } catch (error) {
    console.log("Error fetching add and subtract:", error);
  }
  // stop loading
  loading.value = false;
};

const setEdit = async (data) => {
  if (form.value._id !== data._id) {
    // reset the data
    reset();

    // fetch the data
    try {
      const response = await useApiService.get("sales-invoices/" + data._id);
      if (response) {
        form.value._customer = response._customer;
        form.value.dateTime = response.dateTime;
        form.value.warehouse = response._warehouse;
        form.value.description = response.description;
        form.value.products = response.products;
        form.value.addAndSubtract = response.AddAndSub;

        response.AddAndSub.forEach((addAndSub) => {
          selectedAddAndSubtract.value.push(addAndSub._reason);
        });

        // set the form _id
        form.value._id = data._id;

        // set the action
        action.value = "edit";

        nextTick(() => {
          calculateInvoiceTotal();
        });
      }
    } catch (error) {
      console.log("Error fetching sales invoice:", error);
    }
  }
};

const setSettlement = () => {
  settlementId.value = form.value._id;
  settlementDialogFlag.value = true;
};

const closeSettlementDialog = () => {
  settlementDialogFlag.value = false;
  emit("exit", true);
  emit("refresh", true);
};

const getInventoryByProductId = async (_id, updateTotalCount = false) => {
  try {
    const data = await useApiService.get(
      `products/${_id}/inventory?typeOfSales=retail`
    );
    if (data) {
      inventories.value[_id] = data;
      if (updateTotalCount) {
        // find the product
        const product = form.value.products.find((p) => p._id === _id);
        // find index of the product
        const index = form.value.products.indexOf(product);

        // validate the form (when we back from stockTransferDialog form must be validated)
        addSalesInvoiceForm.value?.validate();

        // set total count of the product
        setProductTotalCount(index);
      }
    }
  } catch (error) {
    console.log("Error fetching inventory:", error);
  }
};

const maxCountRule = (count, index) => {
  return (value) => {
    if (value > count) {
      checkProductStockTransferError(index, count);
      return value <= count || ` تعداد قابل فروش ${count}`;
    } else {
      form.value.products[index].stockTransferError = false;
      return true;
    }
  };
};

const getRetailDefaultWarehouse = async () => {
  try {
    const data = await useApiService.get("warehouses/default/retail");
    if (data) {
      defaultRetailWarehouse.value = data;
    }
  } catch (error) {
    console.log("Error fetching default retail warehouse:", error);
  }
};

const setProductTotalCount = (index) => {
  if (form.value.products[index]._warehouse) {
    // find the warehouse
    const warehouse = inventories.value[
      form.value.products[index]._id
    ].warehouses.find((w) => w._id === form.value.products[index]._warehouse);
    // set the count of the product in related warehouse
    form.value.products[index].totalCount = warehouse.count;
  } else {
    form.value.products[index].totalCount = 0;
  }
};

const checkProductStockTransferError = (index, count) => {
  const inventory = inventories.value[form.value.products[index]._id];
  if (inventory.total > count) {
    form.value.products[index].stockTransferError = true;
  }
};

const showStockTransferDialog = (index) => {
  // find the inventory of product in local variable
  const inventory = inventories.value[form.value.products[index]._id];

  // find the related warehouse in inventory
  const warehouse = inventory.warehouses.find(
    (w) => w._id === form.value.products[index]._warehouse
  );

  // set the data in stock transfer dialog
  stockTransferDialog.value = true;

  // send the data to Stock Transfer Dialog
  stockTransferDialogRef.value?.setTransfer({
    _product: form.value.products[index]._id,
    _destinationWarehouse: form.value.products[index]._warehouse,
    count: form.value.products[index].count - warehouse.count,
  });
};

const hideStockTransferDialog = () => {
  stockTransferDialog.value = false;
};

// Lifecycle hooks
onMounted(() => {
  nextTick(() => {
    getAddAndSubtract();
    getRetailDefaultWarehouse();
  });
});

defineExpose({
  action,
  setEdit,
  setSettlement,
});
</script>

<style scoped></style>
