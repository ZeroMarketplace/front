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
      <v-row class="bg-white mr-1 ml-4 rounded-lg">

        <!--    Title And Action    -->
        <v-col cols="12">
          <v-row>
            <!--      Title      -->
            <v-col class="mt-2" cols="9">
              <v-icon v-if="action === 'list'" class="mt-1 mr-2" color="grey">
                mdi-archive-outline
              </v-icon>

              <v-icon v-if="action === 'add'" class="mt-1 mr-2" color="green">
                mdi-archive-plus-outline
              </v-icon>

              <v-icon v-if="action === 'edit'" class="mt-1 mr-2" color="warning">
                mdi-archive-outline
              </v-icon>

              <v-label class="font-weight-bold mr-2">
                <span v-if="action === 'list'">محصولات</span>
                <span v-if="action === 'add'">افزودن محصول</span>
                <span v-if="action === 'edit'">ویرایش محصول</span>
              </v-label>
            </v-col>

            <!--     Action       -->
            <v-col class="text-end" cols="3">
              <v-btn class="bg-secondary"
                     size="small"
                     @click="toggleAction"
                     icon>
                <v-icon v-if="action === 'list'">mdi-archive-plus-outline</v-icon>
                <v-icon v-if="action === 'edit'">mdi-archive-outline</v-icon>
                <v-icon v-if="action === 'add'">mdi-archive-outline</v-icon>
              </v-btn>
            </v-col>
          </v-row>
          <v-divider class="mt-3"></v-divider>
        </v-col>

        <!--    Add Purchase Invoice   -->
        <v-col v-show="(action === 'add' || action === 'edit')" cols="12">
          <purchase-invoices-add-purchase-invoice ref="addPurchaseInvoices"/>
        </v-col>

        <!--    purchase-invoices List   -->
        <v-col v-show="action === 'list'" class="pb-16" cols="12">

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
    toggleAction() {
      if (this.action === 'add' || this.action === 'edit')
        this.action = 'list';
      else
        this.action = this.$refs.addPurchaseInvoices.form.action;
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