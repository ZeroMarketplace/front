<template>
  <v-form class="mx-5"
          validate-on="lazy"
          @submit.prevent="submit"
          ref="addBrandForm">
    <v-row class="mt-2">

      <!--      Title      -->
      <v-col class="mt-n1 mt-md-0" cols="12" md="4">
        <v-text-field class="mt-3 ltrDirection"
                      v-model="form.title"
                      label="عنوان"
                      placeholder="وارد کنید"
                      :readonly="loading"
                      :rules="rules.notEmpty"
                      density="compact"
                      variant="outlined">
        </v-text-field>
      </v-col>

      <!--     Actions       -->
      <v-col cols="12">

        <!--       Submit       -->
        <v-btn class="border rounded-lg"
               :loading="loading"
               prepend-icon="mdi-check-circle-outline"
               height="40"
               width="100"
               variant="text"
               type="submit"
               density="compact">
          ثبت
        </v-btn>

        <!--       Reset       -->
        <v-btn class="border mx-2 rounded-lg"
               color="pink"
               prepend-icon="mdi-delete-outline"
               height="40"
               width="100"
               variant="text"
               @click="reset"
               density="compact">
          بازنگری
        </v-btn>

      </v-col>

    </v-row>
  </v-form>
</template>

<script setup>
import {ref, onMounted} from "vue"; // Vue composition API functions
import {useNuxtApp}     from "#app"; // Nuxt composables

// Reactive state variables
const addBrandForm = ref(null); // Form ref
const form         = ref({
  title: ''
});
const rules        = {
  notEmpty: [
    (value) => {
      if (value) return true;
      return "پر کردن این فیلد اجباری است";
    },
  ],
};
const loading      = ref(false);
const action       = ref("add");
const {$notify}    = useNuxtApp();
const emit         = defineEmits(['exit', 'refresh']);

// Reset the form and action state
const reset = () => {
  addBrandForm.value?.reset();
  action.value  = "add";
  loading.value = false;
};

// Add a new brand
const add = async () => {
  await useAPI('brands', {
    method    : 'post',
    body      : {
      title: form.value.title
    },
    onResponse: ({response}) => {
      if (response.status === 200) {
        $notify("عملیات با موفقت انجام شد", "success");

        // Reset form
        reset();

        // Emit events to refresh and exit
        emit("exit");
        emit("refresh");
      } else {
        // Show error message
        $notify("مشکلی در عملیات پیش آمد؛ لطفا دوباره تلاش کنید", "error");
      }
    }
  });
};

// Edit an existing brand
const edit = async () => {
  await useAPI('brands/' + form.value._id, {
    method    : 'put',
    body      : {
      title: form.value.title
    },
    onResponse: ({response}) => {
      if (response.status === 200) {
        $notify("عملیات با موفقت انجام شد", "success");

        // Reset form
        reset();

        // Emit events to refresh and exit
        emit("exit");
        emit("refresh");
      } else {
        // Show error message
        $notify("مشکلی در عملیات پیش آمد؛ لطفا دوباره تلاش کنید", "error");
      }
    }
  });
};

// Submit the form
const submit = async () => {
  addBrandForm.value?.validate();
  if (addBrandForm.value?.isValid) {
    loading.value = true;

    if (action.value === "add") {
      await add();
    } else if (action.value === "edit") {
      await edit();
    }

    loading.value = false;
  }
};

// Set form to edit mode with specific data
const setEdit = (data) => {
  form.value   = {
    title: data.title,
    _id  : data._id,
  };
  action.value = "edit";
};

// On component mount, initialize data
onMounted(() => {

});

defineExpose({
  action,
  setEdit
});
</script>

<style scoped>

</style>