<template>
  <v-row class="bg-white mr-4 mr-md-1 ml-4 rounded-lg pb-16">

    <!--    Title And Action    -->
    <v-col cols="12">
      <v-row>
        <!--      Title      -->
        <v-col class="mt-2" cols="9">
          <v-icon v-if="action === 'list'" class="mt-1 mr-2" color="grey">
            mdi-receipt-text-outline
          </v-icon>

          <v-icon v-if="action === 'add'" class="mt-1 mr-2" color="green">
            mdi-receipt-text-plus-outline
          </v-icon>

          <v-icon v-if="action === 'edit'" class="mt-1 mr-2" color="warning">
            mdi-receipt-text-outline
          </v-icon>

          <v-label class="font-weight-bold mr-2">
            <span v-if="action === 'list'">فاکتور‌ها</span>
            <span v-if="action === 'add'">افزودن فاکتور</span>
            <span v-if="action === 'edit'">ویرایش فاکتور</span>
          </v-label>
        </v-col>

        <!--     Action       -->
        <v-col class="text-end" cols="3">
          <v-btn class="bg-secondary"
                 size="small"
                 @click="toggleAction"
                 icon>
            <v-icon v-if="action === 'list'">mdi-receipt-text-plus-outline</v-icon>
            <v-icon v-if="action === 'edit'">mdi-receipt-text-outline</v-icon>
            <v-icon v-if="action === 'add'">mdi-receipt-text-outline</v-icon>
          </v-btn>
        </v-col>
      </v-row>
      <v-divider class="mt-3"></v-divider>
    </v-col>

    <!--    Add Purchase Invoice   -->
    <v-col v-show="(action === 'add' || action === 'edit')" cols="12">
      <AddPurchaseInvoice
          ref="addPurchaseInvoice"
          @exit="toggleAction"
          @refresh="getPurchaseInvoices"/>
    </v-col>

    <!--    purchase-invoices List   -->
    <v-col v-show="action === 'list'" class="pb-16" cols="12">

      <!--    loading      -->
      <Loading :loading="loading"/>

      <!--    List      -->
      <v-data-table class="mt-n5"
                    v-if="list.length"
                    :loading="loading"
                    :headers="listHeaders"
                    :items="list"
                    :items-per-page="perPage"
                    :pageCount="listTotal"
                    @update:options="setListOptions"
                    sticky
                    show-current-page>
        <template v-slot:item._customer="{ item }">
          {{ item._customer.phone }}
        </template>
        <template v-slot:item._warehouse="{ item }">
          {{ item._warehouse.title }}
        </template>
        <template v-slot:item.operation="{ item }">
          <!--  Delete   -->
          <v-btn class="mx-2"
                 color="red"
                 size="25"
                 :loading="item.deleteLoading"
                 @click="setDelete({_id: item._id})"
                 icon>
            <v-icon size="15">mdi-delete-outline</v-icon>
          </v-btn>

          <!--  Edit   -->
          <v-btn class="mx-2"
                 color="secondary"
                 size="25"
                 :loading="item.setEditLoading"
                 @click="setEdit(item)"
                 icon>
            <v-icon size="15">mdi-pencil</v-icon>
          </v-btn>

          <!--  Settlement   -->
          <v-btn class="mx-2"
                 color="blue"
                 size="25"
                 :loading="item.setSettlementLoading"
                 @click="setSettlement(item)"
                 icon>
            <v-icon size="15">mdi-cash-fast</v-icon>
          </v-btn>
        </template>

        <!--      Pagination      -->
        <template v-slot:bottom>
          <v-pagination class="mt-5"
                        active-color="secondary"
                        v-model="page"
                        :length="pageCount"
                        rounded="circle">
          </v-pagination>
        </template>
      </v-data-table>


      <!--    Empty List Alert      -->
      <EmptyList :list="list" :loading="loading"/>

    </v-col>

  </v-row>
</template>

<script setup>
import {ref, onMounted, nextTick} from 'vue';
import {useNuxtApp}               from '#app';
import AddPurchaseInvoice from "~/components/purchase-invoices/AddPurchaseInvoice.vue";
import Loading            from "~/components/Loading.vue";
import EmptyList          from "~/components/EmptyList.vue";
import {useAPI}           from '~/composables/useAPI';

// Define page metadata
definePageMeta({
  layout      : "admin",
  middleware  : 'auth',
  requiresAuth: true,
  requiresRole: 'admin'
});

// State variables
const action             = ref('list');
const loading            = ref(true);
const list               = ref([]);
const listTotal          = ref(100);
const page               = ref(1);
const perPage            = ref(10);
const pageCount          = ref(1);
const sortColumn         = ref('');
const sortDirection      = ref('');
const addPurchaseInvoice = ref(null);
const {$notify}          = useNuxtApp();

const listHeaders = [
  {
    title   : 'فروشنده',
    align   : 'center',
    key     : '_customer',
    sortable: false
  },
  {
    title   : 'تاریخ',
    key     : 'dateTimeJalali',
    align   : 'center',
    sortable: true
  },
  {
    title   : 'مبلغ',
    key     : 'total',
    align   : 'center',
    sortable: true
  },
  {
    title   : 'انبار',
    key     : '_warehouse',
    align   : 'center',
    sortable: true
  },
  {
    title   : 'عملیات',
    align   : 'center',
    key     : 'operation',
    sortable: false
  }
];

// Toggle action mode
const toggleAction = () => {
  if (action.value === 'add' || action.value === 'edit') {
    action.value = 'list';
  } else {
    action.value = addPurchaseInvoice.value?.action;
  }
};

// Fetch purchase invoices
const getPurchaseInvoices = async () => {
  loading.value = true;
  await useAPI('purchase-invoices?' + filter(), {
    method    : 'get',
    onResponse: ({response}) => {
      // set list total and page count
      listTotal.value = response._data.total;
      pageCount.value = Math.ceil(response._data.total / perPage.value);

      // set the list and stop loading
      list.value = [];
      response._data.list.forEach((item) => {
        item.setEditLoading       = false;
        item.setSettlementLoading = false;
        item.deleteLoading        = false;
        list.value.push(item);
      })
      loading.value = false;
    }
  });
};

// Filter parameters
const filter = () => {
  const search = new URLSearchParams();
  search.set('perPage', perPage.value);
  search.set('page', page.value);
  search.set('sortColumn', sortColumn.value);
  search.set('sortDirection', Number(sortDirection.value));
  return search;
};

// Delete an invoice
const deleteInvoice = async (data) => {
  data.deleteLoading = true;
  await useAPI('purchase-invoice/' + data._id, {
    method    : 'delete',
    onResponse: ({response}) => {
      if (response.status === 200) {
        $notify('عملیات با موفقیت انجام شد', 'success');
        // stop loading
        data.deleteLoading = false;
        // refresh list
        getPurchaseInvoices();
      } else {
        $notify('مشکلی در عملیات پیش آمد؛ لطفا دوباره تلاش کنید', 'error');
      }
    }
  });
};

// Set invoice for editing
const setEdit = async (data) => {
  data.setEditLoading = true;
  await addPurchaseInvoice.value?.setEdit(data);
  data.setEditLoading = false;
  toggleAction();
};

// Set invoice for settlement
const setSettlement = async (data) => {
  data.setSettlementLoading = true;
  await setEdit(data);
  await addPurchaseInvoice.value?.setSettlement();
  data.setSettlementLoading = false;
};

// Confirm delete
const setDelete = (data) => {
  if (confirm('آیا مطمئن هستید؟')) {
    deleteInvoice(data);
  }
};

// Handle sorting and fetching
const setListOptions = (val) => {
  if (val?.sortBy?.[0]) {
    sortColumn.value    = val.sortBy[0].key === 'dateTimeJalali' ? 'dateTime' : val.sortBy[0].key;
    sortDirection.value = val.sortBy[0].order === 'desc' ? -1 : 1;
    getPurchaseInvoices();
  }
};

// Watch page change
watch(page, () => {
  getPurchaseInvoices();
});

// Mounted lifecycle hook
onMounted(() => {
  nextTick(() => {
    getPurchaseInvoices();
  });
});
</script>


<style scoped>

</style>
