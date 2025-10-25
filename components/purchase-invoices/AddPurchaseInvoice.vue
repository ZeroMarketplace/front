<template>
  <v-form
    :readonly="loading"
    @submit.prevent="submit"
    ref="addPurchaseInvoiceForm"
    validate-on="submit lazy"
  >
    <!--  Settlement Dialog  -->
    <SettlementDialog
      v-model="settlementDialog"
      :_id="settlementId"
      type="purchase-invoice"
      @exit="closeSettlementDialog"
      ref="settlementDialogRef"
    />

    <!--    Information     -->
    <v-icon class="mt-1 mr-2" color="grey">mdi-information-outline</v-icon>
    <v-label class="text-black font-weight-bold mx-3">مشخصات فاکتور</v-label>
    <v-row >
      <!--   User   -->
      <v-col class="mt-md-0" cols="12" md="4">
        <UserInput
          v-model="form._supplier"
          label="تامین کننده"
          class="mt-md-3 mb-5"
          :rules="[rules.required]"
          :insert-dialog-icon="true"
          :readonly="loading"
        />
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

      <!--   Warehouse   -->
      <v-col class="mt-n8 mt-md-3" cols="12" md="4">
        <WarehouseInput
          class=""
          label="وارد می‌شود به انبار"
          :rules="[rules.requiredSelect]"
          v-model="form._warehouse"
        >
        </WarehouseInput>
      </v-col>

      <!--   Description   -->
      <v-col class="mt-n2 mt-md-n8" cols="12" md="12">
        <v-text-field
          class=""
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
      class="border rounded-lg mx-5 mt-3 mb-2 pt-1 pb-2"
      v-for="(product, index) in form.products"
    >
      <!--  Product Name    -->
      <v-col class="pa-1 mt-2" cols="12" md="3">
        <ProductInput
          v-model="product._id"
          :rules="[rules.requiredSelect]"
          @selected="(val) => onProductSelected(val, index)"
        />
      </v-col>

      <!--   Count    -->
      <v-col class="pa-1 mt-2" cols="12" md="1">
        <v-text-field
          class=""
          v-model="product.count"
          @input="calculateProductPrices(index)"
          label="تعداد"
          type="number"
          :readonly="loading"
          :rules="[rules.required]"
          density="compact"
          variant="outlined"
          hide-details
        >
        </v-text-field>
      </v-col>

      <!--   Purchase Price    -->
      <v-col class="pa-1 mt-2" cols="12" md="2">
        <PriceInput
          class=""
          v-model="product.price.purchase"
          @update:modelValue="calculateProductPrices(index)"
          label="فی خرید"
          :readonly="loading"
          :rules="[rules.required]"
        />
      </v-col>

      <!--   Consumer Price    -->
      <v-col class="pa-1 mt-2" cols="12" md="2">
        <PriceInput
          v-model="product.price.consumer"
          :label="
            'فی مصرف' +
            (product.profitPercent ? '(%' + product.profitPercent + ')' : '')
          "
          :readonly="loading"
          :rules="[rules.required]"
        />
      </v-col>

      <!--   Store Price    -->
      <v-col class="pa-1 mt-2" cols="12" md="2">
        <PriceInput
          class=""
          v-model="product.price.store"
          :label="
            'فی فروشگاه' +
            (product.profitPercent ? '(%' + product.profitPercent + ')' : '')
          "
          :readonly="loading"
          :rules="[rules.required]"
        />
      </v-col>

      <!--  Total  -->
      <v-col class="pa-1 text-caption text-center pt-2" cols="12" md="1">
        <p>جمع کل</p>
        {{ product.total }}
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
          <v-col v-for="item in form.AddAndSub" cols="12" md="8">
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
            v-for="addAndSubtract in form.AddAndSub"
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
import { ref, onMounted, nextTick } from "vue";
import { useNuxtApp } from "#app";
import ProductInput from "~/components/products/ProductInput.vue";
import UserInput from "~/components/users/UserInput.vue";
import WarehouseInput from "~/components/warehouses/WarehouseInput.vue";
import SettlementDialog from "~/components/settlements/SettlementDialog.vue";
import { rules } from "~/utils/validationRules";
import PriceInput from "~/components/price/PriceInput.vue";
import PercentOrPriceInput from "~/components/price/PercentOrPriceInput.vue";
import { formatters } from "~/utils/formatters";

const settlementDialog = ref(false);
const settlementId = ref("");
const form = ref({
  _id: "",
  _supplier: null,
  dateTime: new Date(),
  _warehouse: null,
  description: "",
  products: [],
  AddAndSub: [],
  sum: 0,
  total: 0,
});
const addAndSubtract = ref([]);
const selectedAddAndSubtract = ref([]);
const addPurchaseInvoiceForm = ref(null);
const loading = ref(false);
const action = ref("add");
const { $notify } = useNuxtApp();
const categories = ref({});
const emit = defineEmits(["exit", "refresh"]);

const closeSettlementDialog = () => {
  settlementDialog.value = false;
  emit("exit");
  emit("refresh");
};

const reset = () => {
  form.value = {
    _id: "",
    _supplier: null,
    dateTime: new Date(),
    _warehouse: null,
    description: "",
    products: [],
    AddAndSub: [],
    sum: 0,
    total: 0,
  };
  selectedAddAndSubtract.value = [];
  loading.value = false;
  action.value = "add";
};

const getAddAndSubtract = async () => {
  loading.value = true;
  try {
    const data = await useApiService.get("add-and-subtract?perPage=50");
    if (data) {
      addAndSubtract.value = data.list;
    }
  } catch (error) {
    console.log("Error fetching add and subtract:", error);
  }
  loading.value = false;
};

const addProduct = () => {
  form.value.products.push({
    _id: "",
    count: 0,
    price: { purchase: 0, consumer: 0, store: 0 },
    sum: 0,
    total: 0,
  });
};

const deleteProduct = (index) => {
  form.value.products.splice(index, 1);
};

const onProductSelected = async (val, index) => {
  let category = await getCategory(val._categories[0]);
  if (category.profitPercent) {
    form.value.products[index].profitPercent = category.profitPercent;
    calculateProductPrices(index);
  }
};

const calculateProductPrices = (index) => {
  let product = form.value.products[index];
  form.value.products[index].sum = product.count * product.price.purchase;
  form.value.products[index].total = form.value.products[index].sum;

  // calc profit percentage
  if (form.value.products[index].profitPercent) {
    // consumer price
    form.value.products[index].price.consumer =
      Number(form.value.products[index].price.purchase) +
      (Number(form.value.products[index].price.purchase) *
        Number(form.value.products[index].profitPercent)) /
        100;

    // store price
    form.value.products[index].price.store =
      Number(form.value.products[index].price.purchase) +
      (Number(form.value.products[index].price.purchase) *
        Number(form.value.products[index].profitPercent)) /
        100;
  } else {
    // consumer price
    form.value.products[index].price.consumer =
      form.value.products[index].price.purchase;

    // store price
    form.value.products[index].price.store =
      form.value.products[index].price.purchase;
  }

  // form.value.products[index].total = product.sum
  //     - (product.discount * product.sum / 100) // minus discount
  calculateInvoiceTotal();
};

const getAddAndSubtractDetail = (_id) => {
  let findItem = addAndSubtract.value.find((p) => p._id === _id);
  if (findItem) {
    return findItem;
  } else {
    return "";
  }
};

const toggleAddAndSubtract = (_id) => {
  if (form.value.AddAndSub.find((p) => p._reason === _id)) {
    form.value.AddAndSub.splice(
      form.value.AddAndSub.indexOf(
        form.value.AddAndSub.find((p) => p._reason === _id)
      ),
      1
    );
  } else {
    let addAndSubtract = getAddAndSubtractDetail(_id);
    form.value.AddAndSub.push({
      _reason: _id,
      value: addAndSubtract.default,
      sum: 0,
    });
  }

  calculateInvoiceTotal();
};

const calculateInvoiceTotal = () => {
  form.value.total = form.value.products.reduce(
    (sum, product) => sum + product.total,
    0
  );
  form.value.sum = form.value.total;

  // calc subtracts
  form.value.AddAndSub.forEach((item) => {
    const detailAddAndSubtract = addAndSubtract.value.find(
      (p) => p._id === item._reason
    );
    item.value = Number(item.value);
    if (detailAddAndSubtract) {
      if (detailAddAndSubtract.operation === "subtract") {
        let operationSum = 0;
        if (item.value <= 100) {
          operationSum = Math.ceil((form.value.total * item.value) / 100);
          form.value.sum -= operationSum;
        } else {
          operationSum = item.value;
          form.value.sum -= item.value;
        }
        item.amount = operationSum;
      }
    }
  });

  // calc addition
  form.value.AddAndSub.forEach((item) => {
    const detailAddAndSubtract = addAndSubtract.value.find(
      (p) => p._id === item._reason
    );
    item.value = Number(item.value);
    if (detailAddAndSubtract) {
      if (detailAddAndSubtract.operation === "add") {
        let operationSum = 0;
        if (item.value <= 100) {
          operationSum = Math.floor((form.value.sum * item.value) / 100);
          form.value.sum += operationSum;
        } else {
          operationSum = item.value;
          form.value.sum += item.value;
        }
        item.amount = operationSum;
      }
    }
  });
};

const getCategory = async (_id) => {
  if (!categories.value[_id]) {
    let category = {};

    // get the category
    try {
      category = await useApiService.get("categories/" + _id);
    } catch (error) {
      console.log("Error fetching category:", error);
    }

    // set the category and return
    categories.value[_id] = category;
    return category;
  } else {
    return categories.value[_id];
  }
};

const setEdit = async (data) => {
  if (form.value._id !== data._id) {
    // reset the form data
    reset();

    // get the purchase invoice data
    try {
      const response = await useApiService.get("purchase-invoices/" + data._id);
      if (response) {
        form.value._supplier = response._supplier;
        form.value.dateTime = response.dateTime;
        form.value._warehouse = response._warehouse;
        form.value.description = response.description;
        form.value.products = response.products;
        form.value.AddAndSub = response.AddAndSub;

        // add and subtract
        response.AddAndSub.forEach((addAndSub) => {
          selectedAddAndSubtract.value.push(addAndSub._reason);
        });

        // _id and action
        form.value._id = data._id;
        action.value = "edit";

        calculateInvoiceTotal();
      }
    } catch (error) {
      console.log("Error fetching purchase invoice:", error);
    }
  }
};

const setSettlement = () => {
  settlementId.value = form.value._id;
  settlementDialog.value = true;
};

const convertFormNumbers = () => {
  form.value.products.forEach((product) => {
    product.price.purchase = Number(product.price.purchase);
    product.price.consumer = Number(product.price.consumer);
    product.price.store = Number(product.price.store);
    product.count = Number(product.count);
  });
};

const add = async () => {
  // convert numbers
  convertFormNumbers();

  try {
    const data = await useApiService.post("purchase-invoices", {
      _supplier: form.value._supplier,
      _warehouse: form.value._warehouse,
      dateTime: form.value.dateTime,
      description: form.value.description,
      products: form.value.products,
      AddAndSub: form.value.AddAndSub,
    });
    if (data) {
      $notify("عملیات با موفقیت انجام شد", "success");
      // set _id
      form.value._id = data._id;

      // set settlement
      setSettlement();
    }
  } catch (error) {
    $notify("مشکلی پیش آمد؛ لطفا دوباره تلاش کنید", "error");
  }
};

const edit = async () => {
  // convert numbers
  convertFormNumbers();

  try {
    const data = await useApiService.put(
      "purchase-invoices/" + form.value._id,
      form.value
    );
    if (data) {
      $notify("عملیات با موفقیت انجام شد", "success");

      // set settlement
      setSettlement();
    }
  } catch (error) {
    $notify("مشکلی پیش آمد؛ لطفا دوباره تلاش کنید", "error");
  }
};

const submit = async () => {
  loading.value = true;
  await addPurchaseInvoiceForm.value?.validate();
  if (addPurchaseInvoiceForm.value?.isValid) {
    if (action.value === "add") {
      await add();
    } else {
      await edit();
    }
    // reset form after successful action
    reset();
  }
  loading.value = false;
};

onMounted(() => {
  nextTick(() => {
    getAddAndSubtract();
  });
});

defineExpose({
  action,
  setEdit,
  setSettlement,
});
</script>

<style scoped></style>
