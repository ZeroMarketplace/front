<template>
  <v-form @submit.prevent="submit" ref="addPropertyForm" validate-on="submit lazy">
    <v-row class="mt-2 mx-4">
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

      <!--      Variant      -->
      <v-col class="mt-n5 mt-md-0 text-center" cols="12" md="4">
        <v-checkbox
          class="mt-2"
          v-model="form.variant"
          :readonly="loading"
          label="ایجاد تنوع"
          hide-details
        ></v-checkbox>
      </v-col>

      <!--      Values      -->
      <v-col class="mr-5 pb-10" cols="12" md="12">
        <v-label class="font-weight-bold mr-2">
          مقادیر

          <!--  Add Value   -->
          <v-btn
            class="border mr-3"
            @click="addValue"
            size="30"
            variant="outlined"
            color="pink"
            icon
          >
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </v-label>
        <v-row v-for="(valueItem, index) in form.values">
          <!--         Title fa         -->
          <v-col>
            <v-text-field
              class="mt-3"
              v-model="valueItem.title"
              label="عنوان"
              placeholder="وارد کنید"
              :readonly="loading"
              :rules="[rules.required]"
              density="compact"
              variant="outlined"
              hide-details
            >
            </v-text-field>
          </v-col>

          <!--         Value         -->
          <v-col>
            <v-text-field
              class="mt-3 ltrDirection"
              v-model="valueItem.value"
              label="مقدار عددی یا رنگ یا ..."
              placeholder="وارد کنید"
              :readonly="loading"
              density="compact"
              variant="outlined"
              hide-details
            >
            </v-text-field>
          </v-col>

          <!--         Actions         -->
          <v-col class="text-center align-center">
            <!--  Delete Value   -->
            <v-btn
              class="border float-start mt-5"
              @click="deleteValue(index)"
              size="30"
              variant="outlined"
              color="pink"
              icon
            >
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </v-col>
        </v-row>
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

const { $notify } = useNuxtApp();
const emit = defineEmits(["exit", "refresh"]);

// Reactive data for the form and configuration
const form = ref({
  title: "",
  variant: false,
  values: [
    {
      title: "",
      value: "",
    },
  ],
});

const action = ref("add");
const loading = ref(false);

// Reset the form to its initial state
const reset = () => {
  form.value = {
    title: "",
    variant: false,
    values: [
      {
        title: "",
        value: "",
      },
    ],
  };
  action.value = "add";
  loading.value = false;
};

// Add a new property
const add = async () => {
  try {
    const data = await useApiService.post("properties", form.value);
    if (data) {
      $notify("عملیات با موفقت انجام شد", "success");
      reset(); // Reset form after success
      // Notify parent components to refresh
      emit("exit");
      emit("refresh");
    }
  } catch (error) {
    $notify("مشکلی در عملیات پیش آمد؛ لطفا دوباره تلاش کنید", "error");
  }
};

// Edit an existing property
const edit = async () => {
  try {
    const data = await useApiService.put(
      "properties/" + form.value._id,
      form.value
    );
    if (data) {
      $notify("عملیات با موفقت انجام شد", "success");
      reset(); // Reset form after success
      // Notify parent components to refresh
      emit("exit");
      emit("refresh");
    }
  } catch (error) {
    $notify("مشکلی در عملیات پیش آمد؛ لطفا دوباره تلاش کنید", "error");
  }
};

const addPropertyForm = ref(null);
// Submit the form data based on action type
const submit = async () => {
  await addPropertyForm.value.validate();
  if (addPropertyForm.value.isValid) {
    loading.value = true;
    if (action.value === "add") {
      await add();
    } else if (action.value === "edit") {
      await edit();
    }
    loading.value = false;
  }
};

// Set the form for editing a property
const setEdit = (data) => {
  form.value = {
    title: data.title,
    variant: data.variant,
    values: data.values,
    _id: data._id,
  };
  action.value = "edit";
};

// Delete a specific value from the form values
const deleteValue = (index) => {
  form.value.values.splice(index, 1);
};

// Add a new value entry to the form values
const addValue = () => {
  form.value.values.push({
    title: "",
    value: "",
  });
};

defineExpose({
  action,
  setEdit,
});
</script>

<style scoped></style>
