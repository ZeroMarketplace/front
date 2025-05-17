<template>
  <v-row class="bg-white mr-4 mr-md-1 ml-4 rounded-lg pb-16">

    <!--    Title And Action    -->
    <v-col cols="12">
      <v-row>
        <!--      Title      -->
        <v-col class="mt-2" cols="9">
          <v-icon v-if="action === 'list'" class="mt-1 mr-2" color="grey">
            mdi-plus-minus-variant
          </v-icon>

          <v-icon v-if="action === 'add'" class="mt-1 mr-2" color="green">
            mdi-plus-minus-variant
          </v-icon>

          <v-icon v-if="action === 'edit'" class="mt-1 mr-2" color="warning">
            mdi-plus-minus-variant
          </v-icon>

          <v-label class="font-weight-bold mr-2">
            <span v-if="action === 'list'">اضافات و کسورات</span>
            <span v-if="action === 'add'">افزودن</span>
            <span v-if="action === 'edit'">ویرایش</span>
          </v-label>
        </v-col>

        <!--     Action       -->
        <v-col class="text-end" cols="3">
          <v-btn class="bg-secondary"
                 size="small"
                 @click="toggleAction"
                 icon>
            <v-icon v-if="action === 'list'">mdi-plus</v-icon>
            <v-icon v-if="action === 'edit'">mdi-scale</v-icon>
            <v-icon v-if="action === 'add'">mdi-scale</v-icon>
          </v-btn>
        </v-col>
      </v-row>
      <v-divider class="mt-3"></v-divider>
    </v-col>

    <!--    Add Add-And-Subtract   -->
    <v-col v-show="(action === 'add' || action === 'edit')" cols="12">
      <add-and-subtract-add ref="addAndSubtract" @exit="toggleAction" @refresh="getAddAndSubtract"/>
    </v-col>

    <!--    Add-And-Subtract List   -->
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
      <v-pagination v-if="pageCount > 1"
                    class="mt-5"
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
import {ref, onMounted, nextTick} from 'vue';
import {useNuxtApp}               from '#app';
import {useAPI}                   from '~/composables/useAPI';

// Define page metadata
definePageMeta({
  layout      : 'admin',
  middleware  : 'auth',
  requiresAuth: true,
  requiresRole: 'admin'
});

// Reactive variables
const list           = ref([]);
const loading        = ref(true);
const action         = ref('list');
const addAndSubtract = ref(null);
const {$notify}      = useNuxtApp();
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

// Toggle action state
const toggleAction = () => {
  if (action.value === 'add' || action.value === 'edit') {
    action.value = 'list';
  } else {
    action.value = addAndSubtract.value?.action;
  }
};

// Fetch list data from API
const getAddAndSubtract = async () => {
  loading.value = true;
  await useAPI('add-and-subtract?' + filter(), {
    method    : 'get',
    onResponse: ({response}) => {
      // set the list and stop loading
      list.value    = response._data.list;
      loading.value = false;

      // set page count from list total
      pageCount.value = Math.ceil((response._data.total / perPage.value));
    }
  });
};

// Delete item from API
const deleteItem = async (_id) => {
  await useAPI('add-and-subtract/' + _id, {
    method    : 'delete',
    onResponse: ({response}) => {
      if (response.status === 200) {
        $notify('عملیات با موفقیت انجام شد', 'success');
        getAddAndSubtract(); // Refresh list
      } else {
        $notify('مشکلی در عملیات پیش آمد؛ لطفا دوباره تلاش کنید', 'error');
      }
    }
  });
};

// Set edit mode with selected data
const setEdit = (data) => {
  addAndSubtract.value?.setEdit(data);
  action.value = 'edit';
};

// Confirm and delete item
const setDelete = (data) => {
  if (confirm('آیا مطمئن هستید؟')) {
    deleteItem(data._id);
  }
};

// watch page change for get units
watch(page, (newValue) => {
  getAddAndSubtract();
});


// Fetch user data and initialize list on mount
onMounted(() => {
  nextTick(() => {
    getAddAndSubtract();
  });
});
</script>


<style scoped>

</style>
