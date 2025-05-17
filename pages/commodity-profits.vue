<template>
  <v-row class="bg-white mr-4 mr-md-2 ml-md-5 mt-2 ml-6 rounded-lg pb-16">

    <!--    Title And Action    -->
    <v-col cols="12">
      <v-row>
        <!--      Title      -->
        <v-col class="mt-2" cols="9">
          <v-icon v-if="action === 'list'" class="mt-1 mr-2" color="grey">
            mdi-clipboard-list-outline
          </v-icon>

          <!--          <v-icon v-if="action === 'add'" class="mt-1 mr-2" color="green">-->
          <!--            mdi-human-dolly-->
          <!--          </v-icon>-->

          <!--          <v-icon v-if="action === 'edit'" class="mt-1 mr-2" color="warning">-->
          <!--            mdi-human-dolly-->
          <!--          </v-icon>-->

          <v-label class="font-weight-bold mr-2">
            <span v-if="action === 'list'">سود فروش کالا‌ها</span>
            <!--            <span v-if="action === 'add'">افزودن سود</span>-->
            <!--            <span v-if="action === 'edit'">ویرایش سود</span>-->
          </v-label>
        </v-col>

        <!--     Action       -->
        <v-col class="text-end" cols="3">
          <!--              <v-btn class="bg-secondary"-->
          <!--                     size="small"-->
          <!--                     @click="toggleAction"-->
          <!--                     icon>-->
          <!--                <v-icon v-if="action === 'list'">mdi-human-dolly</v-icon>-->
          <!--                <v-icon v-if="action === 'edit'">mdi-clipboard-list-outline</v-icon>-->
          <!--                <v-icon v-if="action === 'add'">mdi-clipboard-list-outline</v-icon>-->
          <!--              </v-btn>-->
        </v-col>
      </v-row>
      <v-divider class="mt-3"></v-divider>
    </v-col>

    <!--    Commodity Profits List   -->
    <v-col v-show="action === 'list'" cols="12" class="pb-16">

      <!--    loading      -->
      <Loading :loading="loading"/>

      <!--    List      -->
      <v-data-table class="mt-n5 overflow-auto"
                    v-if="list.length"
                    :loading="loading"
                    :headers="listHeaders"
                    :items="list"
                    :items-per-page="perPage"
                    :pageCount="listTotal"
                    @update:options="setListOptions"
                    sticky
                    show-current-page>

        <!--     Items       -->
        <template v-slot:item.count="{ item }">
          {{ item.count + ' ' }}
          {{ item._product._unit.title }}
        </template>
        <template v-slot:item.amount="{ item }">
          {{ formatters.price(item.amount) }}
        </template>
        <template v-slot:item.referenceCode="{ item }">
          {{ item._product.code }}
        </template>
        <template v-slot:item.productTitle="{ item }">
          {{ item._product.title }}
        </template>
        <template v-slot:item.description="{ item }">
              <span v-if="item.referenceType === 'sales-invoices'">
                فاکتور فروش ({{ item._reference.code }})
              </span>
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
import {useAPI}                          from "~/composables/useAPI";
import Loading                           from "~/components/Loading.vue";
import EmptyList                         from "~/components/EmptyList.vue";
import {formatters}                      from '~/utils/formatters'

definePageMeta({
  layout      : 'admin',
  middleware  : 'auth',
  requiresAuth: true,
  requiresRole: 'admin'
});

// Define reactive variables
const list          = ref([]);
const loading       = ref(true);
const listTotal     = ref(0);
const page          = ref(1);
const perPage       = ref(10);
const pageCount     = ref(1);
const sortColumn    = ref('');
const sortDirection = ref('');
const action        = ref('list');

// Define headers for the table
const listHeaders = [
  {title: 'کد محصول', key: 'referenceCode', align: 'center', sortable: false},
  {title: 'نام محصول', key: 'productTitle', align: 'center', sortable: false},
  {title: 'تعداد', key: 'count', align: 'center', sortable: false},
  {title: 'سود (تومان)', key: 'amount', align: 'center', sortable: false},
  {title: 'شرح', key: 'description', align: 'center', sortable: false},
  {title: 'تاریخ', key: 'updatedAtJalali', align: 'center', sortable: false}
];

// Function to toggle action mode
// const toggleAction = () => {
//   if (action.value === 'add' || action.value === 'edit') {
//     action.value = 'list';
//   } else {
//     action.value = 'list'; // Placeholder, since $refs is not available in script setup
//   }
// };

// Function to filter data
const filter = () => {
  let search = new URLSearchParams();
  search.set('perPage', perPage.value);
  search.set('page', page.value);
  search.set('sortColumn', sortColumn.value);
  search.set('sortDirection', Number(sortDirection.value));
  return search;
};

// Function to fetch commodity profits
const getCommodityProfits = async () => {
  loading.value = true;
  await useAPI('commodity-profits?' + filter(), {
    method    : 'get',
    onResponse: ({response}) => {
      listTotal.value = response._data.total;
      pageCount.value = Math.ceil(listTotal.value / perPage.value);
      list.value      = response._data.list;
    }
  });
  loading.value = false;
};

// Function to handle sorting
const setListOptions = (val) => {
  if (val && val.sortBy[0]) {
    if (val.sortBy[0].key === '_warehouse') return;
    sortColumn.value    = val.sortBy[0].key === 'dateTimeJalali' ? 'dateTime' : val.sortBy[0].key;
    sortDirection.value = val.sortBy[0].order === 'desc' ? -1 : 1;
    getCommodityProfits();
  }
};

// Function to confirm delete
// const setDelete = (_id) => {
//   if (confirm('آیا مطمئن هستید؟')) {
//     deleteItem(_id);
//   }
// };

// const deleteItem = async (_id) => {
//
//   await useAPI('commodity-profits/' + _id, {
//     method    : 'delete',
//     onResponse: ({response}) => {
//       if (response.status === 200) {
//         $notify("عملیات با موفقت انجام شد", "success");
//
//         // Refresh the list of units
//         getCommodityProfits();
//       } else {
//         // Show error message
//         $notify("مشکلی در عملیات پیش آمد؛ لطفا دوباره تلاش کنید", "error");
//       }
//     }
//   });
// };

// Watch for page changes
watch(page, () => {
  getCommodityProfits();
});

// On component mount
onMounted(() => {
  nextTick(() => {
    getCommodityProfits();
  });
});
</script>


<style scoped>

</style>
