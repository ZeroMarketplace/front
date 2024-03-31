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
          <purchase-invoices-add-purchase-invoice
              ref="addPurchaseInvoices"
              @exit="toggleAction"
              @refresh="getPurchaseInvoices"/>
        </v-col>

        <!--    purchase-invoices List   -->
        <v-col v-show="action === 'list'" class="pb-16" cols="12">

          <!--    loading      -->
          <Loading :loading="loading"/>

          <!--    List      -->
          <v-data-table :headers="listHeaders" :items="list">
          </v-data-table>


          <!--    Empty List Alert      -->
          <EmptyList :list="list" :loading="loading"/>

        </v-col>

      </v-row>

    </v-col>

  </v-row>
</template>

<script>
import {useUserStore}     from "~/store/user";
import AddPurchaseInvoice from "~/components/purchase-invoices/AddPurchaseInvoice.vue";
import {useCookie}        from "#app";

definePageMeta({
  layout: "admin-layout"
});

export default {
  components: {AddPurchaseInvoice},
  data() {
    return {
      user   : {},
      action : 'list',
      loading: true,
      list   : [],
      listHeaders: [
        {
          title: 'فروشنده',
          align: 'start',
          key: 'customer',
          sortable: false
        },
        {
          title: 'تاریخ',
          align: 'start',
          key: 'dateTime',
          sortable: false
        },
        {
          title: 'مبلغ فاکتور',
          align: 'start',
          key: 'total',
          sortable: false
        },
        {
          title: 'انبار',
          align: 'start',
          key: 'warehouse.title',
          sortable: false
        },
        {
          title: 'عملیات',
          align: 'start',
          sortable: false
        }
      ],
    }
  },
  methods: {
    toggleAction() {
      if (this.action === 'add' || this.action === 'edit')
        this.action = 'list';
      else
        this.action = this.$refs.addPurchaseInvoices.action;
    },
    async delete(id) {
      await fetch(
          this.runtimeConfig.public.API_BASE_URL + 'purchase-invoices/' + id, {
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
          await this.getPurchaseInvoices();
        } else {
          // show error
          $showMessage('مشکلی در عملیات پیش آمد؛ لطفا دوباره تلاش کنید', 'error');
        }
      });
    },
    getPurchaseInvoices() {
      this.loading = true;
      fetch(
          this.runtimeConfig.public.API_BASE_URL + 'purchase-invoices', {
            method : 'get',
            headers: {
              'Content-Type' : 'application/json',
              'authorization': 'Bearer ' + this.user.token
            }
          }).then(async response => {
        response  = await response.json();
        this.list = response.list;
      });
      this.loading = false;
    },
    async setEdit(data) {
      await fetch(
          this.runtimeConfig.public.API_BASE_URL + 'purchase-invoices/' + data.id, {
            method : 'get',
            headers: {
              'Content-Type' : 'application/json',
              'authorization': 'Bearer ' + this.user.token
            }
          }).then(async response => {
        response = await response.json();
        this.$refs.addPurchaseInvoices.setEdit(response);
        this.toggleAction();
      });
    },
    setDelete(data) {
      if (confirm('آیا مطمئن هستید؟')) {
        this.delete(data.id);
      }
    }
  },
  mounted() {
    this.user          = useCookie('user').value;
    this.runtimeConfig = useRuntimeConfig();
    this.getPurchaseInvoices();
  },
  computed: {}
}
</script>


<style scoped>

</style>