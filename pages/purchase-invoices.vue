<template>
  <v-row>

    <!--  Admin Dashboard Menu   -->
    <v-col class="pa-0 d-none d-md-inline" md="3">
      <AdminDashboardMenu/>
    </v-col>

    <!--  Page   -->
    <v-col cols="12" md="9">

      <AdminHeaderBar class="mb-3"/>

      <!--    Title    -->
      <v-row class=" px-5 pt-5 mb-5">

        <v-col>
          <BackButton />

          <v-label v-if="action === 'list'" class="text-h6 text-black mx-3">مدیریت فاکتور‌های خرید</v-label>
          <v-label v-if="action === 'add'" class="text-h6 text-black mx-3">افزودن فاکتور</v-label>
          <v-label v-if="action === 'edit'" class="text-h6 text-black mx-3">ویرایش فاکتور</v-label>
        </v-col>

        <v-col class="text-end">

          <!--    Add Purchase Invoice     -->
          <v-btn class="bg-grey-darken-3 rounded-lg d-none d-sm-inline-flex"
                 :prepend-icon="action === 'add' || action === 'edit' ? 'mdi-view-list' : 'mdi-plus-outline'"
                 height="50"
                 @click="togglePage"
                 variant="text">
            <span v-if="action === 'add' || action === 'edit'">لیست فاکتور‌ها</span>
            <span v-if="action === 'list'">افزودن فاکتور</span>
          </v-btn>

          <v-btn class="bg-grey-darken-3 d-inline-flex d-sm-none"
                 prepend-icon="mdi-image-plus-outline"
                 size="small"
                 @click="togglePage"
                 icon>
            <v-icon v-if="action === 'add' || action === 'edit'">mdi-view-list</v-icon>
            <v-icon v-if="action === 'list'">mdi-plus-outline</v-icon>
          </v-btn>

        </v-col>
      </v-row>

      <!--   Content     -->
      <v-row class="bg-white mr-1 ml-4 mt-n2 rounded-lg">

        <!--    Add Purchase Invoice   -->
        <v-col :class="action === 'add' ? '' : 'd-none'" cols="12">
          <add-purchase-invoice/>
        </v-col>


        <!--    purchase-invoices List   -->
        <v-col v-if="action === 'list'" class="pb-16" cols="12" >
          <v-icon class="mt-1 mr-2" color="grey">mdi-receipt-text-edit-outline</v-icon>
          <v-label class="text-h6 text-black mx-3">فاکتور‌ها</v-label>

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

            </v-list-item>
          </v-list>

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
    }
  },
  methods: {
    reset() {
      this.form = {
        title  : '',
        titleEn: '',
        action : 'insert'
      };
    },
    togglePage() {
      if (this.action === 'add') this.action = 'list';
      else this.action = 'add';
    },
    async delete(_id) {
      await fetch(
          this.runtimeConfig.public.apiUrl + 'units/' + _id, {
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
          this.runtimeConfig.public.apiUrl + 'units', {
            method : 'get',
            headers: {
              'Content-Type' : 'application/json',
              'authorization': 'Bearer ' + this.user.token
            }
          }).then(async response => {
        response  = await response.json();
        this.list = response;
      });
      this.loading = false;
    },
    setEdit(data) {
      this.form = {
        title  : data.title,
        titleEn: data.titleEn,
        action : 'edit',
        _id    : data._id
      };
    },
    setDelete(data) {
      if (confirm('آیا مطمئن هستید؟')) {
        this.delete(data._id);
      }
    }
  },
  mounted() {
    this.user = useUserStore();
    this.getPurchaseInvoices();
  },
  computed: {
    runtimeConfig() {
      return useRuntimeConfig();
    },
  }
}
</script>


<style scoped>

</style>