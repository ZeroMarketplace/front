<template>
  <v-form class="" @submit.prevent="submit" ref="addAccountForm" validate-on="submit lazy">
    <v-row class="mt-2">
      <!--      Title      -->
      <v-col class="mt-n1 mt-md-0" cols="12" md="4">
        <v-text-field
          class=""
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

      <!--     type      -->
      <v-col class="mt-n5 mt-md-0" cols="12" md="4">
        <v-select
          class="ltrDirection"
          v-model="form.type"
          label="نوع حساب"
          placeholder="انتخاب کنید"
          :items="types"
          :readonly="loading"
          :rules="[rules.required]"
          density="compact"
          variant="outlined"
        >
        </v-select>
      </v-col>

      <!--      Balance      -->
      <v-col class="mt-n5 mt-md-0" cols="12" md="4">
        <BalanceInput
          class="ltrDirection"
          v-model="form.balance"
          label="مانده حساب"
          placeholder="وارد کنید"
          :readonly="loading"
          :rules="[rules.required]"
        />
      </v-col>

      <!--      Description      -->
      <v-col class="mt-n5 mt-md-0" cols="12" md="8">
        <v-text-field
          class=""
          v-model="form.description"
          label="توضیحات"
          placeholder="وارد کنید"
          :readonly="loading"
          density="compact"
          variant="outlined"
        >
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
</template>

<script setup>
import { ref } from "vue";
import { useNuxtApp } from "#app";
import { rules } from "~/utils/validationRules";
import BalanceInput from "~/components/price/PriceInput.vue";

definePageMeta({
  layout: "admin",
  middleware: "auth",
  requiresAuth: true,
  requiresRole: "admin",
});

const form = ref({
  title: "",
  type: 1,
  balance: "",
  description: "",
});

const types = [
  { title: "صندوق", value: 1 },
  { title: "بانک", value: 2 },
  { title: "هزینه", value: 3 },
  { title: "درآمد", value: 4 },
  { title: "سیستم", value: 5 },
];

const action = ref("add");
const loading = ref(false);
const addAccountForm = ref(null);
const { $notify } = useNuxtApp();
const emit = defineEmits(["exit", "refresh"]);

const reset = () => {
  form.value = {
    title: "",
    type: 1,
    balance: "",
    description: "",
  };
  action.value = "add";
  loading.value = false;
};

const add = async () => {
  try {
    const data = await useApiService.post("accounts", form.value);
    if (data) {
      $notify("عملیات با موفقیت انجام شد", "success");

      // reset the form and exit
      reset();
      emit("exit");
      emit("refresh");
    }
  } catch (error) {
    $notify("مشکلی در عملیات پیش آمد؛ لطفا دوباره تلاش کنید", "error");
  }
};

const edit = async () => {
  try {
    const data = await useApiService.put(
      "accounts/" + form.value._id,
      form.value
    );
    if (data) {
      $notify("عملیات با موفقیت انجام شد", "success");

      // reset the form and exit
      reset();
      emit("exit");
      emit("refresh");
    }
  } catch (error) {
    $notify("مشکلی در عملیات پیش آمد؛ لطفا دوباره تلاش کنید", "error");
  }
};

const submit = async () => {
  await addAccountForm.value?.validate();
  if (addAccountForm.value?.isValid) {
    loading.value = true;
    action.value === "add" ? await add() : await edit();
    loading.value = false;
  }
};

const setEdit = (data) => {
  form.value = { ...data };
  action.value = "edit";
};

defineExpose({
  action,
  setEdit,
});
</script>

<style scoped></style>
