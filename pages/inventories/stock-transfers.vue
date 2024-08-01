<template>
  <v-row>
    <!--  Admin Dashboard Menu   -->
    <v-col class="pa-0 d-none d-md-inline" md="3">
      <AdminDashboardMenu/>
    </v-col>

    <!--  Page   -->
    <v-col cols="12" md="9">

      <AdminHeaderBar class="mb-3"/>

      <!--   Content     -->
      <v-row class="bg-white mr-4 mr-md-1 ml-4 rounded-lg pb-16">

        <!--    Title And Action    -->
        <v-col cols="12">
          <v-row>
            <!--      Title      -->
            <v-col class="mt-2" cols="9">
              <v-icon v-if="action === 'list'" class="mt-1 mr-2" color="grey">
                mdi-clipboard-list-outline
              </v-icon>

              <v-icon v-if="action === 'add'" class="mt-1 mr-2" color="green">
                mdi-human-dolly
              </v-icon>

              <v-icon v-if="action === 'edit'" class="mt-1 mr-2" color="warning">
                mdi-human-dolly
              </v-icon>

              <v-label class="font-weight-bold mr-2">
                <span v-if="action === 'list'">انتقالات موجودی</span>
                <span v-if="action === 'add'">افزودن انتقال</span>
                <span v-if="action === 'edit'">ویرایش انتقال</span>
              </v-label>
            </v-col>

            <!--     Action       -->
            <v-col class="text-end" cols="3">
              <v-btn class="bg-secondary"
                     size="small"
                     @click="toggleAction"
                     icon>
                <v-icon v-if="action === 'list'">mdi-human-dolly</v-icon>
                <v-icon v-if="action === 'edit'">mdi-clipboard-list-outline</v-icon>
                <v-icon v-if="action === 'add'">mdi-clipboard-list-outline</v-icon>
              </v-btn>
            </v-col>
          </v-row>
          <v-divider class="mt-3"></v-divider>
        </v-col>

        <!--    Inventories Stock Transfer   -->
        <v-col v-show="(action === 'add' || action === 'edit')" cols="12">
          <inventories-add-stock-transfer
              ref="addStockTransfers"
              @exit="toggleAction"
              @refresh="getStockTransfers"/>
        </v-col>

        <!--    Stock Transfers List   -->
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
            <template v-slot:item._sourceWarehouse="{ item }">
              {{ item._sourceWarehouse.title.fa }}
            </template>
            <template v-slot:item._destinationWarehouse="{ item }">
              {{ item._destinationWarehouse.title.fa }}
            </template>
            <template v-slot:item.count="{ item }">
              {{ item.count + ' ' }}
              {{ item.productDetails._unit.title.fa }}
            </template>
            <template v-slot:item.code="{ item }">
              {{ item.productDetails.code }}
            </template>
            <template v-slot:item.productDetails="{ item }">
              {{ item.productDetails.title }}
            </template>

            <template v-slot:item.operation="{ item }">
              <!--  Delete   -->
              <v-btn class="mx-2"
                     color="red"
                     size="25"
                     @click="setDelete(item._id)"
                     icon>
                <v-icon size="15">mdi-delete-outline</v-icon>
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

    </v-col>

  </v-row>
</template>

<script>
import {useUserStore} from "~/store/user";
import {useCookie}    from "#app";

definePageMeta({
  layout: "admin-layout"
});

export default {
  data() {
    return {
      user         : {},
      list         : [],
      loading      : true,
      _warehouse   : undefined,
      listHeaders  : [
        {
          title   : 'کد',
          key     : 'code',
          align   : 'center',
          sortable: false
        },
        {
          title   : 'محصول',
          key     : 'productDetails',
          align   : 'center',
          sortable: false
        },
        {
          title   : 'تعداد',
          key     : 'count',
          align   : 'center',
          sortable: false
        },
        {
          title   : 'انبار مبدا',
          key     : '_sourceWarehouse',
          align   : 'center',
          sortable: false
        },
        {
          title   : 'انبار مقصد',
          key     : '_destinationWarehouse',
          align   : 'center',
          sortable: false
        },
        {
          title   : 'تاریخ',
          key     : 'updatedAtJalali',
          align   : 'center',
          sortable: false
        },
        {
          title   : 'عملیات',
          key     : 'operation',
          align   : 'center',
          sortable: false
        },
      ],
      listTotal    : 100,
      page         : 1,
      perPage      : 10,
      pageCount    : 1,
      sortColumn   : '',
      sortDirection: '',
      action       : 'list'
    }
  },
  methods: {
    toggleAction() {
      if (this.action === 'add' || this.action === 'edit')
        this.action = 'list';
      else
        this.action = this.$refs.addStockTransfers.action;
    },
    filter() {
      let search = new URLSearchParams();

      // pagination
      search.set('perPage', this.perPage);
      search.set('page', this.page);

      // sort
      search.set('sortColumn', this.sortColumn);
      search.set('sortDirection', Number(this.sortDirection));


      return search;
    },
    getStockTransfers() {
      this.loading = true;
      fetch(
          this.runtimeConfig.public.API_BASE_URL + 'stock-transfers?' + this.filter(), {
            method : 'get',
            headers: {
              'Content-Type' : 'application/json',
              'authorization': 'Bearer ' + this.user.token
            }
          }).then(async response => {
        response       = await response.json();
        this.listTotal = response.total;
        this.pageCount = Math.ceil((this.listTotal / this.perPage));
        this.list      = response.list;
      });
      this.loading = false;
    },
    setListOptions(val) {
      // handle dateTime
      if (val && val.sortBy[0]) {

        if (val.sortBy[0].key === '_warehouse')
          return;

        if (val.sortBy[0].key === 'dateTimeJalali')
          this.sortColumn = 'dateTime';
        else
          this.sortColumn = val.sortBy[0].key;

        this.sortDirection = val.sortBy[0].order === 'desc' ? -1 : 1;

        this.getStockTransfers();
      }
    },
    setDelete(_id) {
      if (confirm('آیا مطمئن هستید؟')) {
        this.delete(_id);
      }
    },
    async delete(_id) {
      await fetch(
          this.runtimeConfig.public.API_BASE_URL + 'stock-transfers/' + _id, {
            method : 'delete',
            headers: {
              'Content-Type' : 'application/json',
              'authorization': 'Bearer ' + this.user.token
            }
          }).then(async response => {
        const {$showMessage} = useNuxtApp();
        if (response.status === 200) {
          $showMessage('عملیات با موفقت انجام شد', 'success');

          // refresh list
          this.getStockTransfers();
        } else {
          // show error
          $showMessage('مشکلی در عملیات پیش آمد؛ لطفا دوباره تلاش کنید', 'error');
        }
      });
    },
  },
  mounted() {
    this.user          = useCookie('user').value;
    this.runtimeConfig = useRuntimeConfig();
    this.getStockTransfers();
  },
  computed: {},
  watch: {
    page(val, oldVal) {
      this.getStockTransfers();
    }
  }
}
</script>


<style scoped>

</style>
