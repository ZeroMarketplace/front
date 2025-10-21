<template>
  <v-form @submit.prevent="submit" ref="addCategoryForm" validate-on="submit lazy">
    <!--    Parent      -->
    <v-chip
      v-if="form._parent"
      class="mt-5 mr-7"
      size="small"
      color="secondary"
      variant="elevated"
    >
      {{ form._parentTitle }}
    </v-chip>

    <v-row class="mt-2 mx-5">
      <!--      Title      -->
      <v-col class="mt-n1 mt-md-0" cols="12" md="4">
        <v-text-field
          class="mt-3"
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

      <!--      Properties      -->
      <v-col class="mt-n5 mt-md-3" cols="12" md="4">
        <PropertyInput v-model="form._properties" multiple chips />
      </v-col>

      <!--      Profit Percentage      -->
      <v-col class="mt-n5 mt-md-0" cols="12" md="4">
        <v-text-field
          class="mt-3"
          v-model="form.profitPercent"
          label="درصد سود"
          placeholder="وارد کنید"
          :readonly="loading"
          type="number"
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
// Import required modules and composables
import { useNuxtApp } from "#app";
import { ref, onMounted } from "vue";
import PropertyInput from "~/components/properties/PropertyInput.vue";
import { rules } from "~/utils/validationRules";

// Define reactive data
const form = ref({
  title: "",
  profitPercent: 0,
  _parent: null,
  _parentTitle: "",
  _properties: [],
});

const action = ref("add");
const loading = ref(false);
const addCategoryForm = ref(null);
const { $notify } = useNuxtApp();
const emit = defineEmits(["exit", "refresh"]);

// Define methods
const reset = () => {
  // Reset form data
  form.value.title = "";
  form.value.profitPercent = 0;
  form.value._parent = null;
  form.value._parentTitle = "";
  form.value._properties = [];
  action.value = "add";
  loading.value = false;
};

const add = async () => {
  // Add a new category
  try {
    const data = await useApiService.post("categories", {
      title: form.value.title,
      profitPercent: Number(form.value.profitPercent),
      _properties: form.value._properties.length
        ? form.value._properties
        : undefined,
      _parent: form.value._parent ?? undefined,
    });
    if (data) {
      $notify("عملیات با موفقیت انجام شد", "success");
      reset();
      emit("exit");
      emit("refresh");
    }
  } catch (error) {
    $notify("مشکلی در پردازش عملیات پیش آمد. لطفا دوباره تلاش کنید", "error");
  }
};

const edit = async () => {
  // Edit an existing category
  try {
    const data = await useApiService.put("categories/" + form.value._id, {
      title: form.value.title,
      profitPercent: Number(form.value.profitPercent),
      _properties: form.value._properties,
    });
    if (data) {
      $notify("عملیات با موفقیت انجام شد", "success");
      reset();
      emit("exit");
      emit("refresh");
    }
  } catch (error) {
    $notify("مشکلی در پردازش عملیات پیش آمد. لطفا دوباره تلاش کنید", "error");
  }
};

const submit = async () => {
  // Submit the form based on the current action (add or edit)
  await addCategoryForm.value.validate();
  if (addCategoryForm.value.isValid) {
    loading.value = true;
    if (action.value === "add") {
      await add();
    } else if (action.value === "edit") {
      await edit();
    }
    loading.value = false;
  }
};

const setEdit = (data) => {
  // Set the form for editing a category
  form.value.title = data.title;
  form.value.profitPercent = data.profitPercent;
  form.value._parent = undefined;
  form.value._parentTitle = "";
  form.value._properties = data._properties;
  form.value._id = data._id;
  action.value = "edit";
};

const setParent = (data) => {
  // Set parent information for the form
  form.value._parent = data._id;
  form.value._parentTitle = data.title;
  form.value._properties = data._properties ?? [];
};

onMounted(() => {});

defineExpose({
  action,
  setParent,
  setEdit,
});
</script>

<style scoped></style>
