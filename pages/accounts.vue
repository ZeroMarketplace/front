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
                mdi-wallet-bifold-outline
              </v-icon>

              <v-icon v-if="action === 'add'" class="mt-1 mr-2" color="green">
                mdi-wallet-plus-outline
              </v-icon>

              <v-icon v-if="action === 'edit'" class="mt-1 mr-2" color="warning">
                mdi-wallet-bifold-outline
              </v-icon>

              <v-label class="font-weight-bold mr-2">
                <span v-if="action === 'list'">حساب‌ها</span>
                <span v-if="action === 'add'">افزودن حساب</span>
                <span v-if="action === 'edit'">ویرایش حساب</span>
              </v-label>
            </v-col>

            <!--     Action       -->
            <v-col class="text-end" cols="3">
              <v-btn class="bg-secondary"
                     size="small"
                     @click="toggleAction"
                     icon>
                <v-icon v-if="action === 'list'">mdi-wallet-plus-outline</v-icon>
                <v-icon v-if="action === 'edit'">mdi-wallet-plus-outline</v-icon>
                <v-icon v-if="action === 'add'">mdi-wallet-bifold-outline</v-icon>
              </v-btn>
            </v-col>
          </v-row>
          <v-divider class="mt-3"></v-divider>
        </v-col>

        <!--    Add Account   -->
        <v-col v-show="(action === 'add' || action === 'edit')"
               cols="12"
               class="px-8 pt-5">
          <accounts-add-account ref="addAccount" @exit="toggleAction" @refresh="getAccounts"/>
        </v-col>

        <!--    Accounts List   -->
        <v-col v-show="action === 'list'" cols="12" class="pb-16 py-7">

          <!--    loading      -->
          <Loading :loading="loading"/>

          <!--    List      -->
          <v-dialog-transition>
            <v-row class="mx-4 mt-2" v-show="list.length">
              <v-col v-for="item in list" cols="12" md="4">
                <v-card elevation="2">
                  <!--        Title and Icon     -->
                  <v-card-title class="border-b">
                    {{ item.title }}

                    <!--         Icon         -->
                    <v-icon v-if="item.type === 'bank'"
                            size="20"
                            class="float-left mt-1"
                            color="secondary">
                      mdi-bank
                    </v-icon>

                    <v-icon v-if="item.type === 'cash'"
                            size="20"
                            class="float-left mt-1"
                            color="secondary">
                      mdi-inbox
                    </v-icon>

                    <v-icon v-if="item.type === 'expense'"
                            size="20"
                            class="float-left mt-1"
                            color="red">
                      mdi-cash-minus
                    </v-icon>

                    <v-icon v-if="item.type === 'income'"
                            size="20"
                            class="float-left mt-1"
                            color="green">
                      mdi-cash-plus
                    </v-icon>

                  </v-card-title>

                  <!--        Content        -->
                  <v-card-text class="pa-5">
                    <v-label>
                      موجودی:
                      <span class="mx-2 font-weight-bold">
                      {{ item.balance }}
                    </span>

                      تومان
                    </v-label>
                  </v-card-text>

                  <!--        Actions        -->
                  <v-card-actions class="float-left">
                    <!--  Delete   -->
                    <v-btn class="mx-2 bg-red"
                           size="30"
                           @click="setDelete({_id: item._id})"
                           icon>
                      <v-icon size="15">mdi-delete-outline</v-icon>
                    </v-btn>

                    <!--  Edit   -->
                    <v-btn class="mx-2 bg-secondary"
                           size="30"
                           @click="setEdit(item)"
                           icon>
                      <v-icon size="15">mdi-pencil</v-icon>
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-col>
            </v-row>
          </v-dialog-transition>

          <!--    Empty List Alert      -->
          <EmptyList :list="list" :loading="loading"/>

        </v-col>

      </v-row>

    </v-col>

  </v-row>
</template>

<script>
import {useUserStore} from "~/store/user";

definePageMeta({
  layout: "admin-layout"
});

export default {
  data() {
    return {
      user   : {},
      loading: true,
      action : 'list',
      list   : [],
    }
  },
  methods: {
    async delete(_id) {
      await fetch(
          this.runtimeConfig.public.apiUrl + 'accounts/' + _id, {
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
          await this.getAccounts();
        } else {
          // show error
          $showMessage('مشکلی در عملیات پیش آمد؛ لطفا دوباره تلاش کنید', 'error');
        }
      });
    },
    getAccounts() {
      this.loading = true;
      this.list    = [];
      fetch(this.runtimeConfig.public.apiUrl + 'accounts', {method: 'get',}).then(async response => {
        response     = await response.json();
        this.list    = response;
        this.loading = false;
      });
    },
    setEdit(data) {
      this.$refs.addAccount.setEdit(data);
      this.action = 'edit';
    },
    setDelete(data) {
      if (confirm('آیا مطمئن هستید؟')) {
        this.delete(data._id);
      }
    },
    toggleAction() {
      if (this.action === 'add' || this.action === 'edit')
        this.action = 'list';
      else
        this.action = this.$refs.addAccount.action;
    }
  },
  mounted() {
    this.user = useUserStore();
    this.getAccounts();
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