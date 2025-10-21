<template>
  <v-dialog width="600">
    <!--   Content     -->
    <v-row class="bg-white mx-0 px-0 rounded-lg">
      <!--    Title And Action    -->
      <v-col cols="12">
        <v-row>
          <!--      Title      -->
          <v-col class="mt-2" cols="9">
            <v-icon class="mt-1 mr-2" color="green"> mdi-human-dolly </v-icon>

            <v-label class="font-weight-bold mr-2">
              <span>انتقال موجودی</span>
            </v-label>
          </v-col>

          <!--     Action       -->
          <v-col class="text-end" cols="3">
            <v-btn @click="closeTheDialog" size="small" icon>
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-col>
        </v-row>
        <v-divider class="mt-3"></v-divider>
      </v-col>
      <!--   Form   -->
      <v-col cols="12">
        <v-form
          :readonly="loading"
          @submit.prevent="submit"
          ref="stockTransferForm"
          validate-on="submit lazy"
        >
          <v-row>
            <!--   source Warehouse   -->
            <v-col class="" cols="12">
              <WarehouseInput
                class=""
                label="انبار مبدا"
                :rules="[rules.requiredSelect, differentWarehouseRule]"
                v-model="form._sourceWarehouse"
              >
              </WarehouseInput>
            </v-col>

            <!--   destination Warehouse   -->
            <v-col class="" cols="12">
              <WarehouseInput
                class=""
                label="انبار مقصد"
                :rules="[rules.requiredSelect, differentWarehouseRule]"
                v-model="form._destinationWarehouse"
              >
              </WarehouseInput>
            </v-col>

            <!--   product   -->
            <v-col class="" cols="12">
              <ProductInput
                v-model="form._product"
                @selected="(val) => onProductSelected(val)"
              />
            </v-col>

            <!--   Count    -->
            <v-col class="" cols="12">
              <v-text-field
                class=""
                v-model="form.count"
                label="تعداد"
                type="number"
                :readonly="loading"
                :rules="[rules.required, maxCountRule(form.totalCount)]"
                density="compact"
                variant="outlined"
              >
                <template v-slot:append-inner>
                  <v-label v-if="!loading" class="mx-2 text-caption"
                    >از {{ form.totalCount }}</v-label
                  >
                  <v-progress-circular
                    indeterminate
                    v-else
                  ></v-progress-circular>
                </template>
              </v-text-field>
            </v-col>

            <!--     Actions       -->
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
      </v-col>
    </v-row>
  </v-dialog>
</template>

<script setup>
import { ref, watch } from "vue";
import { useNuxtApp } from "#app";
import ProductInput from "~/components/products/ProductInput.vue";
import WarehouseInput from "~/components/warehouses/WarehouseInput.vue";

// Define reactive form state
const form = ref({
  _sourceWarehouse: undefined,
  _destinationWarehouse: undefined,
  totalCount: 0,
  count: 0,
  _product: "",
});

const inventory = ref({});
const loading = ref(false);
const { $notify } = useNuxtApp();
const stockTransferForm = ref(null);

// Define Emits
const emit = defineEmits(["exti", "refresh"]);

// validate different warehouses
const differentWarehouseRule = () => {
  if (form.value._sourceWarehouse === form.value._destinationWarehouse) {
    return "انبار‌های انتقال باید متفاوت باشد";
  } else {
    return true;
  }
};

// Function for close the dialog
const closeTheDialog = () => {
  emit("exit");
};

// Function to reset form
const reset = (formRef) => {
  form.value = {
    _sourceWarehouse: undefined,
    _destinationWarehouse: undefined,
    totalCount: 0,
    count: 0,
    _product: "",
  };
  loading.value = false;
};

// Function to handle form submission
const submit = async (formRef) => {
  await stockTransferForm.value?.validate();
  if (stockTransferForm.value?.isValid) {
    // start loading
    loading.value = true;

    // set the request
    try {
      const data = await useApiService.post("stock-transfers", {
        _sourceWarehouse: form.value._sourceWarehouse,
        _destinationWarehouse: form.value._destinationWarehouse,
        _product: form.value._product,
        count: Number(form.value.count),
      });
      if (data) {
        $notify("عملیات با موفقیت انجام شد", "success");
        emit("exit");
        emit("refresh", {
          _product: form.value._product,
        });
      }
    } catch (error) {
      $notify("مشکلی در انتقال به وجود آمد", "error");

      // different warehouse error
      const status = error?.response?.status;
      const message = error?.response?._data?.message;
      if (status === 400) {
        switch (message) {
          case "_sourceWarehouse & _destinationWarehouse must be unique and different":
            $notify(
              "انبار مبدا و مقصد باید منحصر به فرد و متفاوت باشد",
              "error"
            );
            break;
        }
      }
    }

    loading.value = false;
  }
};

// Validation rule for max count
const maxCountRule = (count) => {
  return (value) =>
    value > count ? `بیشترین تعداد قابل انتقال ${count}` : true;
};

// Fetch inventory data for a product
const getInventoryByProductId = async (_id) => {
  loading.value = true;
  try {
    const data = await useApiService.get(
      `products/${_id}/inventory?typeOfSales=retail`
    );
    if (data) {
      inventory.value = data;
      setProductTotalCount();
    }
  } catch (error) {
    console.log("Error fetching inventory:", error);
  }
  loading.value = false;
};

// Set transfer data
const setTransfer = (data) => {
  form.value._product = data._product;
  form.value._sourceWarehouse = data._sourceWarehouse;
  form.value._destinationWarehouse = data._destinationWarehouse;
  form.value.count = data.count;
};

// Calculate total product count in source warehouse
const setProductTotalCount = () => {
  if (form.value._sourceWarehouse && inventory.value?.warehouses) {
    const warehouse = inventory.value.warehouses.find(
      (warehouse) => warehouse._id === form.value._sourceWarehouse
    );
    if (warehouse) {
      form.value.totalCount = warehouse.count;
    }
  }
};

// Watch for changes in source warehouse
watch(
  () => form.value._sourceWarehouse,
  () => {
    setProductTotalCount();
  }
);

// Function triggered when a product is selected
watch(
  () => form.value._product,
  (value, oldValue, onCleanup) => {
    getInventoryByProductId(value);
  }
);

// Define Expose
defineExpose({
  setTransfer,
});
</script>

<style scoped></style>
