<template>
  <v-form class="mx-5" @submit.prevent="submit" ref="addUnitForm" validate-on="submit lazy">
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

      <!--     Actions       -->
      <v-col cols="12">
        <!--       Submit       -->
        <v-btn
          class="border rounded-lg"
          :loading="form.loading"
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
import { ref } from "vue"; // Vue composition API functions
import { useNuxtApp } from "#app"; // Nuxt composables
import { rules } from "~/utils/validationRules";

// Reactive state
const form = ref({
  title: "",
  _id: null,
});

const action = ref("add");
const loading = ref(false);
const addUnitForm = ref(null);
const { $notify } = useNuxtApp();
const emit = defineEmits(["exit", "refresh"]);

// Reset form state
const reset = (addUnitFormRef) => {
  addUnitForm?.value.reset(); // Reset the form if the reference exists
  loading.value = false;
  action.value = "add";
};

// Add a new unit
const add = async () => {
  try {
    const data = await useApiService.post("units", {
      title: form.value.title,
    });
    if (data) {
      $notify("عملیات با موفقیت انجام شد", "success");

      // Reset form and emit events
      reset();
      emit("exit");
      emit("refresh");
    }
  } catch (error) {
    $notify("مشکلی در عملیات پیش آمد؛ لطفا دوباره تلاش کنید", "error");
  }
};

// Edit an existing unit
const edit = async () => {
  try {
    const data = await useApiService.put("units/" + form.value._id, {
      title: form.value.title,
    });
    if (data) {
      $notify("عملیات با موفقیت انجام شد", "success");

      // Reset form and emit events
      reset();
      emit("exit");
      emit("refresh");
    }
  } catch (error) {
    $notify("مشکلی در عملیات پیش آمد؛ لطفا دوباره تلاش کنید", "error");
  }
};

// Submit the form based on action type
const submit = async () => {
  addUnitForm?.value.validate();
  if (addUnitForm?.value.isValid) {
    loading.value = true;

    if (action.value === "add") {
      await add();
    } else if (action.value === "edit") {
      await edit();
    }

    loading.value = false;
  }
};

// Set the form to edit mode
const setEdit = (data) => {
  form.value.title = data.title;
  form.value._id = data._id;
  action.value = "edit";
};

defineExpose({
  action,
  setEdit,
});
</script>

<style scoped></style>
