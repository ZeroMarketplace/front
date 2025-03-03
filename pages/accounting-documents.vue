<template>
  <v-row class="bg-white mr-4 mr-md-1 ml-4 rounded-lg pb-16">

    <!--    Title And Action    -->
    <v-col cols="12">
      <v-row>
        <!--      Title      -->
        <v-col class="mt-2" cols="9">
          <v-icon v-if="action === 'list'" class="mt-1 mr-2" color="grey">
            mdi-file-document-outline
          </v-icon>

          <v-icon v-if="action === 'add'" class="mt-1 mr-2" color="green">
            mdi-file-document-plus-outline
          </v-icon>

          <v-icon v-if="action === 'edit'" class="mt-1 mr-2" color="warning">
            mdi-file-document-edit-outline
          </v-icon>

          <v-label class="font-weight-bold mr-2">
            <span v-if="action === 'list'">اسناد حسابداری</span>
            <span v-if="action === 'add'">افزودن سند</span>
            <span v-if="action === 'edit'">ویرایش سند</span>
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

    <!--    Add Accounting Documents   -->
    <v-col v-show="(action === 'add' || action === 'edit')" cols="12">
      <AddAccountingDocument
          ref="addAccountingDocument"
          @exit="toggleAction"
          @refresh="getAccountingDocuments"/>
    </v-col>

    <!--    accounting-documents List   -->
    <v-col v-show="action === 'list'" class="pb-16" cols="12">

      <!--    loading      -->
      <Loading :loading="loading"/>

      <!--    List      -->
      <v-data-table v-if="list.length && !loading" class="mt-n5"
                    :loading="loading"
                    :headers="listHeaders"
                    :items="list"
                    :items-per-page="perPage"
                    :pageCount="pageCount"
                    @update:options="setListOptions"
                    sticky
                    show-current-page>
        <template v-slot:item.amount="{ item }">
          {{ formatters.price(item.amount) }}
        </template>
        <template v-slot:item.operation="{ item }">
          <!--  Delete   -->
          <v-btn class="mx-2"
                 color="red"
                 size="25"
                 @click="setDelete({_id: item._id})"
                 icon>
            <v-icon size="15">mdi-delete-outline</v-icon>
          </v-btn>

          <!--  Edit   -->
          <v-btn class="mx-2"
                 color="secondary"
                 size="25"
                 @click="setEdit(item)"
                 icon>
            <v-icon size="15">mdi-pencil</v-icon>
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
import {ref, watch, onMounted, nextTick} from 'vue';
import {useNuxtApp}                      from '#app';
import AddAccountingDocument             from '~/components/accounting-documents/AddAccountingDocument.vue';
import {useAPI}                          from "~/composables/useAPI";
import Loading                           from '~/components/Loading.vue';
import EmptyList                         from '~/components/EmptyList.vue';
import {formatters}                      from "../utils/formatters";

definePageMeta({
  layout      : 'admin',
  middleware  : 'auth',
  requiresAuth: true,
  requiresRole: 'admin',
});

// State variables
const action                = ref('list');
const loading               = ref(true);
const list                  = ref([]);
const listHeaders           = ref([
  {title: 'کد سند', key: 'code', align: 'center', sortable: true},
  {title: 'تاریخ', key: 'dateTimeJalali', align: 'center', sortable: true},
  {title: 'توضیحات', key: 'description', align: 'center', sortable: true},
  {title: 'مبلغ (تومان)', key: 'amount', align: 'center', sortable: true},
  {title: 'عملیات', key: 'operation', align: 'center', sortable: false},
]);
const listTotal             = ref(0);
const page                  = ref(1);
const perPage               = ref(10);
const pageCount             = ref(1);
const sortColumn            = ref('');
const sortDirection         = ref('');
const addAccountingDocument = ref(null);
const {$notify}             = useNuxtApp();

// Toggle between list and add/edit actions
const toggleAction = () => {
  if (action.value === 'add' || action.value === 'edit')
    action.value = 'list';
  else
    action.value = addAccountingDocument.value?.action;
};

// Delete an accounting document
const deleteDocument = async (data) => {
  data.deleteLoading = true;
  await useAPI('accounting-documents/' + data._id, {
    method    : 'delete',
    onResponse: async ({response}) => {
      if (response.status === 200) {
        $notify('عملیات با موفقیت انجام شد', 'success');

        data.deleteLoading = false;

        // refresh list
        await getAccountingDocuments();
      } else {
        $notify('مشکلی در عملیات پیش آمد؛ لطفا دوباره تلاش کنید', 'error');
      }
    }
  })
};

// Generate query parameters for filtering
const filter = () => {
  let search = new URLSearchParams();
  search.set('perPage', perPage.value);
  search.set('page', page.value);
  search.set('sortColumn', sortColumn.value);
  search.set('sortDirection', Number(sortDirection.value));
  return search;
};

// Fetch accounting documents list
const getAccountingDocuments = async () => {
  loading.value = true;
  await useAPI('accounting-documents?' + filter(), {
    method    : 'get',
    onResponse: ({response}) => {
      // set the list and total
      listTotal.value = response._data.total;

      list.value = [];
      response._data.list.forEach((item) => {
        item.setEditLoading = false;
        item.deleteLoading  = false;
        list.value.push(item);
      });

      // set page Count
      pageCount.value = Math.ceil(response._data.total / perPage.value);
      // stop loading
      loading.value   = false;
    }
  });
};

// Fetch and set document for editing
const setEdit = async (data) => {
  data.setEditLoading = true;
  // Call child component method to set edit data
  await addAccountingDocument.value?.setEdit(data);
  toggleAction();
  data.setEditLoading = false;
};

// Confirm and delete document
const setDelete = (data) => {
  if (confirm('آیا مطمئن هستید؟')) {
    deleteDocument(data);
  }
};

// Handle sorting and update list
const setListOptions = (val) => {
  if (val && val.sortBy[0]) {
    sortColumn.value    = val.sortBy[0].key === 'dateTimeJalali' ? 'dateTime' : val.sortBy[0].key;
    sortDirection.value = val.sortBy[0].order === 'desc' ? -1 : 1;
    getAccountingDocuments();
  }
};

// Fetch user and initialize data on mount
onMounted(() => {
  nextTick(() => {
    getAccountingDocuments();
  });
});

// Watch for page change and fetch new data
watch(page, () => {
  getAccountingDocuments();
});
</script>

<style scoped>

</style>
