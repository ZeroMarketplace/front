<template>
  <v-row class="bg-white mr-4 mr-md-1 ml-4 rounded-lg pb-16">
    <!--    Title And Action    -->
    <v-col cols="12">
      <v-row>
        <!--      Title      -->
        <v-col class="mt-2" cols="9">
          <v-icon v-if="action === 'list'" class="mt-1 mr-2" color="grey">
            mdi-scale
          </v-icon>

          <!--          <v-icon v-if="action === 'add'" class="mt-1 mr-2" color="green">-->
          <!--            mdi-scale-->
          <!--          </v-icon>-->

          <!--          <v-icon v-if="action === 'edit'" class="mt-1 mr-2" color="warning">-->
          <!--            mdi-scale-->
          <!--          </v-icon>-->

          <v-label class="font-weight-bold mr-2">
            <span v-if="action === 'list'">تنظیمات</span>
            <!--            <span v-if="action === 'add'">افزودن واحد</span>-->
            <!--            <span v-if="action === 'edit'">ویرایش واحد</span>-->
          </v-label>
        </v-col>

        <!--     Action       -->
        <v-col class="text-end" cols="3">
          <!--          <v-btn class="bg-secondary"-->
          <!--                 size="small"-->
          <!--                 @click="toggleAction"-->
          <!--                 icon>-->
          <!--            <v-icon v-if="action === 'list'">mdi-plus</v-icon>-->
          <!--            <v-icon v-if="action === 'edit'">mdi-scale</v-icon>-->
          <!--            <v-icon v-if="action === 'add'">mdi-scale</v-icon>-->
          <!--          </v-btn>-->
        </v-col>
      </v-row>
      <v-divider class="mt-3"></v-divider>
    </v-col>

    <!--    Add Setting   -->
    <v-col v-show="action === 'add' || action === 'edit'" cols="12">
      <!--      <units-add-unit ref="addUnit" @exit="toggleAction" @refresh="getUnits"/>-->
    </v-col>

    <!--    Settings List   -->
    <v-col v-show="action === 'list'" cols="12" class="pb-16">
      <!--    loading      -->
      <Loading :loading="loading" />

      <!--    List      -->
      <v-table class="text-center mt-n5">
        <tbody>
          <tr v-for="item in list" :key="item.key" class="">
            <!--     Title      -->
            <td class="pa-2">{{ item.title }}</td>

            <!--    Value      -->
            <td class="text-center pa-2">
              <!--     Select       -->
              <v-autocomplete
                v-if="item.type === 'select'"
                v-model="item.value"
                :items="item.options"
                class="mt-2 w-50"
                item-title="title"
                item-value="key"
                variant="outlined"
                @update:modelValue="edit(item)"
                density="compact"
              >
                <template v-slot:append>
                  <!--       Loading         -->
                  <v-progress-circular
                    v-if="item.editLoading"
                    color="secondary"
                    indeterminate
                  >
                  </v-progress-circular>
                </template>
              </v-autocomplete>
            </td>
          </tr>
        </tbody>
      </v-table>

      <!--    Empty List Alert      -->
      <EmptyList :list="list" :loading="loading" />
    </v-col>
  </v-row>
</template>

<script setup>
import { ref, onMounted, nextTick } from "vue"; // Vue composition API functions
import { useNuxtApp } from "#app"; // Nuxt composables
import Loading from "~/components/Loading.vue";
import EmptyList from "~/components/EmptyList.vue";

// Define page metadata
definePageMeta({
  layout: "admin",
  middleware: "auth",
  requiresAuth: true,
  requiresRole: "admin",
});

// Reactive state variables
const list = ref([]);
const loading = ref(true);
const action = ref("list");
const { $notify } = useNuxtApp();

// Toggle between different actions (add, edit, list)
// const toggleAction = () => {
//   if (action.value === "add" || action.value === "edit") {
//     action.value = "list";
//   } else {
//     action.value = addUnit.value?.action;
//   }
// };

// Fetch the list of units
const getSettings = async () => {
  loading.value = true;

  try {
    const data = await useApiService.get("settings");
    // set data to list and stop loading
    list.value = [];
    data.list.forEach((item) => {
      item.editLoading = false;
      list.value.push(item);
    });
    loading.value = false;
  } catch (error) {
    loading.value = false;
  }
};

const edit = async (item) => {
  item.editLoading = true;

  try {
    await useApiService.put("settings/" + item._id, { value: item.value });
    $notify("عملیات با موفقیت انجام شد", "success");
  } catch (error) {
    $notify("مشکلی در انجام عملیات بوجود آمد. لطفا مجددا تلاش کنید", "error");
  } finally {
    item.editLoading = false;
  }
};

// On component mount, initialize user and fetch units
onMounted(() => {
  nextTick(() => {
    getSettings();
  });
});
</script>

<style scoped></style>
