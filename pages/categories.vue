<template>
  <v-row class="bg-white mr-4 mr-md-1 ml-4 rounded-lg pb-16v">

    <!--    Title And Action    -->
    <v-col cols="12">
      <v-row>
        <!--      Title      -->
        <v-col class="mt-2" cols="9">
          <v-icon v-if="action === 'list'" class="mt-1 mr-2" color="grey">
            mdi-file-tree-outline
          </v-icon>

          <v-icon v-if="action === 'add'" class="mt-1 mr-2" color="green">
            mdi-file-tree-outline
          </v-icon>

          <v-icon v-if="action === 'edit'" class="mt-1 mr-2" color="warning">
            mdi-file-tree-outline
          </v-icon>

          <v-label class="font-weight-bold mr-2">
            <span v-if="action === 'list'">دسته‌بندی‌ها</span>
            <span v-if="action === 'add'">افزودن دسته‌بندی</span>
            <span v-if="action === 'edit'">ویرایش دسته‌بندی</span>
          </v-label>
        </v-col>

        <!--     Action       -->
        <v-col class="text-end" cols="3">
          <v-btn class="bg-secondary"
                 size="small"
                 @click="toggleAction"
                 icon>
            <!--      Icons      -->
            <v-icon v-if="action === 'list'">mdi-plus</v-icon>
            <v-icon v-if="action === 'edit'">mdi-file-tree-outline</v-icon>
            <v-icon v-if="action === 'add'">mdi-file-tree-outline</v-icon>

            <!--       Description       -->
            <v-tooltip
                activator="parent"
                location="top">
              <span v-if="action === 'list'">اضافه کردن</span>
              <span v-if="action === 'edit'">دسته‌بندی‌ها</span>
              <span v-if="action === 'add'">دسته‌بندی‌ها</span>
            </v-tooltip>
          </v-btn>
        </v-col>
      </v-row>
      <v-divider class="mt-3"></v-divider>
    </v-col>

    <!--    Add Category   -->
    <v-col v-show="(action === 'add' || action === 'edit')" cols="12" class="pb-10">
      <categories-add-category ref="addCategory" @exit="toggleAction" @refresh="getCategories"/>
    </v-col>

    <!--    Category List   -->
    <v-col v-show="action === 'list'" cols="12" class="pb-16">

      <!--    loading      -->
      <Loading :loading="loading"/>

      <!--   List   -->
      <v-list class="w-100">
        <categories-category-view v-for="item in list"
                                  @setEdit="setEdit"
                                  @setParent="setParent"
                                  @setDelete="setDelete"
                                  @setStatus="setStatus"
                                  :item="item"/>
      </v-list>

      <!--    Empty List Alert      -->
      <EmptyList class="py-16 mb-16" :list="list" :loading="loading"/>

    </v-col>

  </v-row>
</template>

<script setup>
import {useNuxtApp}     from "#app";
import {ref, onMounted} from "vue";
import {useAPI}         from '~/composables/useAPI';
import Loading          from "~/components/Loading.vue";
import EmptyList        from "~/components/EmptyList.vue";

// Page metadata configuration
definePageMeta({
  layout      : "admin",
  middleware  : "auth",
  requiresAuth: true,
  requiresRole: "admin",
});

// Reactive variables
const loading     = ref(true); // Tracks loading state
const action      = ref("list"); // Determines current view state (list/add/edit)
const list        = ref([]); // Stores the list of categories
const {$notify}   = useNuxtApp();
const addCategory = ref(null); // Store the ref of child component

// Toggles between different actions
const toggleAction = () => {
  if (action.value === "add" || action.value === "edit") {
    action.value = "list";
  } else {
    action.value = "list"; // Default fallback
    action.value = addCategory.value.action;
  }
};

const filter = () => {
  let search = new URLSearchParams();

  // set the statuses
  search.set('statuses', [1, 2]);


  return search;
};

// Fetches the list of categories
const getCategories = async () => {
  // start loading
  loading.value = true;
  await useAPI('categories?' + filter(), {
    method    : 'get',
    onResponse: ({response}) => {
      // set list of categories
      list.value = [];

      // add the loading flags to each item
      response._data.list.forEach(item => {
        item.deleteLoading    = false;
        item.setStatusLoading = false;

        list.value.push(item);
      })

    }
  });
  // stop loading
  loading.value = false;
};

// Deletes a category by ID
const deleteCategory = async (item) => {
  // start loading
  item.deleteLoading = true;

  // send the request
  await useAPI('categories/' + item._id, {
    method    : 'delete',
    onResponse: ({response}) => {
      if (response.status === 200) {
        $notify('عملیات با موفقت انجام شد', 'success');
        getCategories();
      } else {
        $notify('مشکلی در پردازش عملیات پیش آمد. لطفا دوباره تلاش کنید.', 'error');
      }
    }
  });

  item.deleteLoading = false;
};

// set status for category
const setStatus = async (item) => {

  // start loading
  item.setStatusLoading = true;

  // detect the status
  let status = item.status === 1 ? 2 : 1;

  // send the request
  await useAPI('categories/' + item._id + '/status', {
    method    : 'patch',
    body      : {
      status: status
    },
    onResponse: async ({response}) => {
      if (response.status === 200) {
        $notify('عملیات با موفقت انجام شد', 'success');
        await getCategories();
      } else {
        $notify('مشکلی در عملیات پیش آمد؛ لطفا دوباره تلاش کنید', 'error');
      }
    }
  });

  // stop loading
  item.setStatusLoading = false;
};

// Prepares data for editing a category
const setEdit = (data) => {
  // Call the relevant function in the child component
  addCategory.value.setEdit(data);
  action.value = "edit";
};

// Confirms and deletes a category
const setDelete = (item) => {
  if (confirm("آیا مطمئن هستید؟")) {
    deleteCategory(item);
  }
};

// Prepares to add a subcategory
const setParent = (data) => {
  // Call the relevant function in the child component
  addCategory.value.setParent(data);
  action.value = "add";
};

// Initialize the component on mount
onMounted(() => {

  // fix the onMounted bug for reload categories
  setTimeout(() => {
    getCategories(); // Fetch the list of categories
  }, 10);
});
</script>


<style scoped>

</style>
