<template>
  <v-form class="mx-5" @submit.prevent="submit" ref="addWarehouseForm" validate-on="submit lazy">
    <v-row class="mt-2">
      <!--      Title      -->
      <v-col class="mt-n1 mt-md-0" cols="12" md="4">
        <v-text-field
          class="mt-3 ltrDirection"
          v-model="form.title"
          label="عنوان"
          placeholder="وارد کنید"
          :readonly="loading"
          :rules="[rules.required]"
          density="compact"
          variant="outlined"
        >
        </v-text-field>
      </v-col>

      <!--      Sell Online      -->
      <v-col class="mt-n5 mt-md-0 text-center" cols="12" md="2">
        <v-checkbox
          class="mt-2"
          v-model="form.onlineSales"
          :readonly="loading"
          label="فروش آنلاین"
          hide-details
        ></v-checkbox>
      </v-col>

      <!--      Retail      -->
      <v-col class="mt-n5 mt-md-0 text-center" cols="12" md="2">
        <v-checkbox
          class="mt-2"
          v-model="form.retail"
          :readonly="loading"
          label="خرده فروشی"
          hide-details
        >
        </v-checkbox>
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
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useNuxtApp } from "#app";
import { rules } from "~/utils/validationRules";

// Define reactive variables
const form = ref({
  title: "",
  onlineSales: false,
  retail: false,
  _id: null,
});
const action = ref("add");
const loading = ref(false);
const addWarehouseForm = ref(null);
const { $notify } = useNuxtApp();
const emit = defineEmits(["exit", "refresh"]);

// Reset form
const reset = () => {
  addWarehouseForm.value?.reset();
  form.value = { title: "", onlineSales: false, retail: false, _id: null };
  loading.value = false;
  action.value = "add";
};

// Add new warehouse
const add = async () => {
  try {
    const data = await useApiService.post("warehouses", {
      title: form.value.title,
      onlineSales: form.value.onlineSales,
      retail: form.value.retail,
    });
    if (data) {
      $notify("عملیات با موفقیت انجام شد", "success");

      // reset and exit
      reset();
      emit("exit");
      emit("refresh");
    }
  } catch (error) {
    $notify("مشکلی در عملیات پیش آمد؛ لطفا دوباره تلاش کنید", "error");
  }
};

// Edit warehouse
const edit = async () => {
  try {
    const data = await useApiService.put("warehouses/" + form.value._id, {
      title: form.value.title,
      onlineSales: form.value.onlineSales,
      retail: form.value.retail,
    });
    if (data) {
      $notify("عملیات با موفقیت انجام شد", "success");

      // reset and exit
      reset();
      emit("exit");
      emit("refresh");
    }
  } catch (error) {
    $notify("مشکلی در عملیات پیش آمد؛ لطفا دوباره تلاش کنید", "error");
  }
};

// Submit form
const submit = async () => {
  addWarehouseForm.value?.validate();
  if (addWarehouseForm.value?.isValid) {
    loading.value = true;
    if (action.value === "add") {
      await add();
    } else if (action.value === "edit") {
      await edit();
    }
    loading.value = false;
  }
};

// Set warehouse data for editing
const setEdit = (data) => {
  form.value = {
    title: data.title,
    onlineSales: data.onlineSales,
    retail: data.retail,
    _id: data._id,
  };
  action.value = "edit";
};

// Initialize component
onMounted(() => {});

defineExpose({
  action,
  setEdit,
});
</script>

<style scoped></style>
