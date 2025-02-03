<template>
  <v-row class="bg-white mr-4 mr-md-1 ml-4 rounded-lg pb-16">

    <!--    Title And Action    -->
    <v-col cols="12">
      <v-row>
        <!--      Title      -->
        <v-col class="mt-2" cols="9">
          <v-icon v-if="action === 'list'" class="mt-1 mr-2" color="grey">
            mdi-warehouse
          </v-icon>

          <v-icon v-if="action === 'add'" class="mt-1 mr-2" color="green">
            mdi-warehouse
          </v-icon>

          <v-icon v-if="action === 'edit'" class="mt-1 mr-2" color="warning">
            mdi-warehouse
          </v-icon>

          <v-label class="font-weight-bold mr-2">
            <span v-if="action === 'list'">انبار‌ها</span>
            <span v-if="action === 'add'">افزودن انبار</span>
            <span v-if="action === 'edit'">ویرایش انبار</span>
          </v-label>
        </v-col>

        <!--     Action       -->
        <v-col class="text-end" cols="3">
          <v-btn class="bg-secondary"
                 size="small"
                 @click="toggleAction"
                 icon>
            <v-icon v-if="action === 'list'">mdi-plus</v-icon>
            <v-icon v-if="action === 'edit'">mdi-warehouse</v-icon>
            <v-icon v-if="action === 'add'">mdi-warehouse</v-icon>
          </v-btn>
        </v-col>
      </v-row>
      <v-divider class="mt-3"></v-divider>
    </v-col>

    <!--    Add Warehouse   -->
    <v-col v-show="(action === 'add' || action === 'edit')" class="pb-10" cols="12">
      <warehouses-add-warehouse ref="addWarehouse" @exit="toggleAction" @refresh="getWarehouses"/>
    </v-col>

    <!--    Warehouses List   -->
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

            <!--  Set Default   -->
            <v-btn class="mx-2"
                   v-bind="props"
                   :loading="item.setDefaultLoading"
                   :class="item.defaultFor ? 'bg-secondary' : 'bg-white border'"
                   size="30"
                   icon>
              <v-icon size="15">mdi-star-outline</v-icon>
              <v-menu activator="parent">
                <v-list>
                  <!--         Online Sales             -->
                  <v-list-item @click="setDefault('onlineSales',item)"
                               key="1"
                               value="onlineSales">
                    <v-list-item-title>
                      فروش آنلاین
                      <v-icon v-if="item.defaultFor === 'onlineSales'"
                              size="15"
                              color="secondary">mdi-star-outline
                      </v-icon>
                    </v-list-item-title>
                  </v-list-item>

                  <!--          Retail            -->
                  <v-list-item @click="setDefault('retail',item)"
                               key="2"
                               value="retail">
                    <v-list-item-title>
                      خرده فروشی
                      <v-icon v-if="item.defaultFor === 'retail'"
                              size="15"
                              color="secondary">mdi-star-outline
                      </v-icon>
                    </v-list-item-title>
                  </v-list-item>

                </v-list>
              </v-menu>
            </v-btn>

            <!--  inventory of products   -->
            <v-btn class="mx-2"
                   color="secondary"
                   size="30"
                   icon>
              <v-icon size="15">mdi-format-list-bulleted-square</v-icon>
            </v-btn>

            <!--  Edit   -->
            <v-btn class="mx-2"
                   color="secondary"
                   size="30"
                   @click="setEdit(item)"
                   icon>
              <v-icon size="15">mdi-pencil</v-icon>
            </v-btn>

            <!--  Delete   -->
            <v-btn class="mx-2"
                   color="red"
                   size="30"
                   @click="setDelete({_id: item._id})"
                   icon>
              <v-icon size="15">mdi-delete-outline</v-icon>
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
import {ref, onMounted} from 'vue';
import {useNuxtApp}     from '#app';
import {useAPI}         from '~/composables/useAPI';

// Define page meta
definePageMeta({
  layout      : 'admin',
  middleware  : 'auth',
  requiresAuth: true,
  requiresRole: 'admin'
});

// Reactive variables
const list         = ref([]);
const loading      = ref(true);
const action       = ref('list');
const addWarehouse = ref(null);
const {$notify}    = useNuxtApp();
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


// Fetch the warehouses list
const getWarehouses = async () => {
  loading.value = true;
  await useAPI('warehouses?' + filter(), {
    method    : 'get',
    onResponse: ({response}) => {
      // set the list and stop loading
      list.value = [];
      response._data.list.forEach((item) => {
        item.setDefaultLoading = false;
        list.value.push(item);
      });

      // set page count from list total
      pageCount.value = Math.ceil((response._data.total / perPage.value));

      loading.value = false;
    }
  });
};

// Toggle action between list, add, and edit
const toggleAction = () => {
  if (action.value === 'add' || action.value === 'edit') {
    action.value = 'list';
  } else {
    action.value = addWarehouse.value?.action;
  }
};

// Delete warehouse by ID
const deleteWarehouse = async (_id) => {
  await useAPI('warehouses/' + _id, {
    method    : 'delete',
    onResponse: ({response}) => {
      if (response.status === 200) {
        $notify('عملیات با موفقیت انجام شد', 'success');

        // refresh list
        getWarehouses();
      } else {
        $notify('مشکلی در عملیات پیش آمد؛ لطفا دوباره تلاش کنید', 'error');
      }
    }
  });
};

// Set warehouse for editing
const setEdit = (data) => {
  addWarehouse.value?.setEdit(data);
  action.value = 'edit';
};

// Confirm and delete warehouse
const setDelete = (data) => {
  if (confirm('آیا مطمئن هستید؟')) {
    deleteWarehouse(data._id);
  }
};

// Set warehouse as default
const setDefault = async (typeOfSales, item) => {
  // start loading
  item.setDefaultLoading = true;
  await useAPI('warehouses/default/' + typeOfSales + '/' + item._id, {
    method    : 'put',
    onResponse: ({response}) => {
      if (response.status === 200) {
        $notify('عملیات با موفقیت انجام شد', 'success');

        // refresh list
        getWarehouses();
      } else {
        $notify('مشکلی در عملیات پیش آمد؛ لطفا دوباره تلاش کنید', 'error');
      }

      // stop loading
      item.setDefaultLoading = false;
    }
  });
};

// watch page change for get warehouses
watch(page, (newValue) => {
  getWarehouses();
});

// Initialize component
onMounted(async () => {
  await nextTick(() => {
    getWarehouses();
  });
});
</script>


<style scoped>

</style>
