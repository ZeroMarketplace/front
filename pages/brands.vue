<template>
  <v-row class="bg-white mr-4 mr-md-1 ml-4 rounded-lg pb-16">

    <!--    Title And Action    -->
    <v-col cols="12">
      <v-row>
        <!--      Title      -->
        <v-col class="mt-2" cols="9">
          <v-icon v-if="action === 'list'" class="mt-1 mr-2" color="grey">
            mdi-draw-pen
          </v-icon>

          <v-icon v-if="action === 'add'" class="mt-1 mr-2" color="green">
            mdi-draw-pen
          </v-icon>

          <v-icon v-if="action === 'edit'" class="mt-1 mr-2" color="warning">
            mdi-draw-pen
          </v-icon>

          <v-label class="font-weight-bold mr-2">
            <span v-if="action === 'list'">برند‌ها</span>
            <span v-if="action === 'add'">افزودن برند</span>
            <span v-if="action === 'edit'">ویرایش برند</span>
          </v-label>
        </v-col>

        <!--     Action       -->
        <v-col class="text-end" cols="3">
          <v-btn class="bg-secondary"
                 size="small"
                 @click="toggleAction"
                 icon>
            <v-icon v-if="action === 'list'">mdi-plus</v-icon>
            <v-icon v-if="action === 'edit'">mdi-draw-pen</v-icon>
            <v-icon v-if="action === 'add'">mdi-draw-pen</v-icon>
          </v-btn>
        </v-col>
      </v-row>
      <v-divider class="mt-3"></v-divider>
    </v-col>

    <!--    Add Brand   -->
    <v-col v-show="(action === 'add' || action === 'edit')" cols="12">
      <brands-add-brand ref="addBrand" @exit="toggleAction" @refresh="getBrands"/>
    </v-col>

    <!--    Brands List   -->
    <v-col v-show="action === 'list'" cols="12" class="pb-16">

      <!--    loading      -->
      <Loading :loading="loading"/>

      <!--    List      -->
      <v-list class="mx-5">
        <v-list-item v-for="item in list"
                     class="rounded border-b pa-2" link>

          <!--      Title        -->
          <v-list-item-title>{{ item.title }}</v-list-item-title>

          <!--      Actions        -->
          <template v-slot:append>
            <!--  Delete   -->
            <v-btn class="mx-2"
                   color="red"
                   size="30"
                   @click="setDelete({_id: item._id})"
                   icon>
              <v-icon size="15">mdi-delete-outline</v-icon>
            </v-btn>

            <!--  Edit   -->
            <v-btn class="mx-2"
                   color="secondary"
                   size="30"
                   @click="setEdit(item)"
                   icon>
              <v-icon size="15">mdi-pencil</v-icon>
            </v-btn>

          </template>

        </v-list-item>
      </v-list>

      <!--   Pagination    -->
      <v-pagination class="mt-5"
                    active-color="secondary"
                    v-model="page"
                    :length="pageCount"
                    rounded="circle">
      </v-pagination>

      <!--    Empty List Alert      -->
      <EmptyList :list="list" :loading="loading"/>

    </v-col>

  </v-row>
</template>

<script setup>
import {ref, onMounted, nextTick, watch} from "vue"; // Vue composition API functions
import {useNuxtApp}                      from "#app"; // Nuxt composables
import {useAPI}                          from '~/composables/useAPI';

// Page meta for layout, middleware, and role
definePageMeta({
  layout      : "admin",
  middleware  : "auth",
  requiresAuth: true,
  requiresRole: "admin",
});

// Reactive state variables
const list      = ref([]);
const loading   = ref(true);
const action    = ref("list");
const {$notify} = useNuxtApp();
const addBrand  = ref(null);
const page          = ref(1);
const perPage       = ref(10);
const pageCount     = ref(1);
const sortColumn    = ref('');
const sortDirection = ref(1);

// filter the table
const filter = () => {
  let search = new URLSearchParams();

  // pagination
  search.set('perPage', perPage.value);
  search.set('page', page.value);

  // sort
  search.set('sortColumn', sortColumn.value);
  search.set('sortDirection', sortDirection.value);

  return search;
};

// Fetch the list of brands from the API
const getBrands = async () => {
  loading.value = true;
  await useAPI('brands?' + filter(), {
    method    : 'get',
    onResponse: ({response}) => {
      // Set data to list variable and stop loading
      list.value    = response._data.list;
      loading.value = false;

      // set page count from list total
      pageCount.value = Math.ceil((response._data.total / perPage.value));
    }
  });
};

// Delete a brand by ID
const deleteBrand = async (_id) => {
  await useAPI('brands/' + _id, {
    method    : 'delete',
    onResponse: ({response}) => {
      if (response.status === 200) {
        $notify("عملیات با موفقت انجام شد", "success");
        // Refresh the list
        getBrands();
      } else {
        // Show error message
        $notify("مشکلی در عملیات پیش آمد؛ لطفا دوباره تلاش کنید", "error");
      }
    }
  });
};

// Set brand to edit mode
const setEdit = (data) => {
  // Accessing the child component through refs
  addBrand.value?.setEdit(data);
  action.value = "edit";
};

// Confirm and delete a brand
const setDelete = (data) => {
  if (confirm("آیا مطمئن هستید؟")) {
    deleteBrand(data._id);
  }
};

// Toggle between actions
const toggleAction = () => {
  if (action.value === "add" || action.value === "edit") {
    action.value = "list";
  } else {
    action.value = addBrand.value?.action;
  }
};

// watch page change for get brands
watch(page, (newValue) => {
  getBrands();
});

// On component mount, initialize the data
onMounted(() => {
  nextTick(() => {
    getBrands();
  });
});
</script>


<style scoped>

</style>
