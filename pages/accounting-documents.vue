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
          <add-accounting-document
              ref="addAccountingDocument"
              @exit="toggleAction"
              @refresh="getAccountingDocuments"/>
        </v-col>

        <!--    accounting-documents List   -->
        <v-col v-show="action === 'list'" class="pb-16" cols="12">

          <!--    loading      -->
          <Loading :loading="loading"/>

          <!--    List      -->
          <v-data-table class="mt-n5"
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
              {{ item._warehouse.title.fa }}
            </template>
            <template v-slot:item.operation="{ item }">
              <!--  Delete   -->
              <v-btn class="mx-2"
                     color="red"
                     size="25"
                     @click="setDelete({id: item.id})"
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

    </v-col>

  </v-row>
</template>

<script>
import {useCookie}           from "#app";
import AddAccountingDocument from "~/components/accounting-documents/AddAccountingDocument.vue";

definePageMeta({
  layout: "admin-layout"
});

export default {
  components: {AddAccountingDocument},
  data() {
    return {
      user         : {},
      action       : 'list',
      loading      : true,
      list         : [],
      listHeaders  : [
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
      ],
      listTotal    : 100,
      page         : 1,
      perPage      : 10,
      pageCount    : 1,
      sortColumn   : '',
      sortDirection: ''
    }
  },
  methods: {
    toggleAction() {
      if (this.action === 'add' || this.action === 'edit')
        this.action = 'list';
      else
        this.action = this.$refs.addAccountingDocument.action;
    },
    async delete(_id) {
      await fetch(
          this.runtimeConfig.public.API_BASE_URL + 'accounting-documents/' + _id, {
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
          await this.getAccountingDocuments();
        } else {
          // show error
          $showMessage('مشکلی در عملیات پیش آمد؛ لطفا دوباره تلاش کنید', 'error');
        }
      });
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
    getAccountingDocuments() {
      this.loading = true;
      fetch(
          this.runtimeConfig.public.API_BASE_URL + 'accounting-documents?' + this.filter(), {
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
    async setEdit(data) {
      await fetch(
          this.runtimeConfig.public.API_BASE_URL + 'accounting-documents/' + data._id, {
            method : 'get',
            headers: {
              'Content-Type' : 'application/json',
              'authorization': 'Bearer ' + this.user.token
            }
          }).then(async response => {
        response = await response.json();
        this.$refs.addAccountingDocument.setEdit(response);
        this.toggleAction();
      });
    },
    setDelete(data) {
      if (confirm('آیا مطمئن هستید؟')) {
        this.delete(data._id);
      }
    },
    setListOptions(val) {
      // handle dateTime
      if (val && val.sortBy[0]) {

        if (val.sortBy[0].key === 'dateTimeJalali')
          this.sortColumn = 'dateTime';
        else
          this.sortColumn = val.sortBy[0].key;

        this.sortDirection = val.sortBy[0].order === 'desc' ? -1 : 1;

        this.getAccountingDocuments();
      }
    }
  },
  mounted() {
    this.user          = useCookie('user').value;
    this.runtimeConfig = useRuntimeConfig();
    this.getAccountingDocuments();
  },
  computed: {},
  watch   : {
    page(val, oldVal) {
      this.getAccountingDocuments();
    }
  }
}
</script>


<style scoped>

</style>