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
        <BackButton/>

        <v-label class="text-h6 text-black mx-3">مدیریت انبار‌ها</v-label>
      </v-row>

      <!--   Content     -->
      <v-row class="bg-white mr-1 ml-4 mt-n2 rounded-lg">

        <!--    Add Warehouse   -->
        <v-col cols="12">

          <v-icon class="" color="grey">mdi-plus-circle-outline</v-icon>
          <v-label class="text-h6 text-black mx-3">افزودن انبار</v-label>

          <v-form class="mx-5" @submit.prevent="submit" ref="addWarehouseForm">

            <v-row class="mt-2">

              <!--      Title      -->
              <v-col class="mt-n1 mt-md-0" cols="12" md="4">
                <v-text-field class="mt-3 ltrDirection"
                              v-model="form.title"
                              label="عنوان"
                              placeholder="وارد کنید"
                              :readonly="loading"
                              :rules="rules.notEmpty"
                              density="compact"
                              variant="outlined">
                </v-text-field>
              </v-col>

              <!--      Title EN      -->
              <v-col class="mt-n5 mt-md-0" cols="12" md="4">
                <v-text-field class="mt-3 ltrDirection"
                              v-model="form.titleEn"
                              label="Title"
                              placeholder="وارد کنید"
                              :readonly="loading"
                              :rules="rules.notEmpty"
                              density="compact"
                              variant="outlined">
                </v-text-field>
              </v-col>

              <!--      Sell Online      -->
              <v-col class="mt-n5 mt-md-0 text-center" cols="12" md="4">
                <v-checkbox class="mt-2"
                            v-model="form.sellOnline"
                            :readonly="loading"
                            label="فروش آنلاین"
                            hide-details
                ></v-checkbox>
              </v-col>

              <!--     Actions       -->
              <v-col cols="12">

                <!--       Submit       -->
                <v-btn class="border rounded-lg"
                       :loading="form.loading"
                       prepend-icon="mdi-check-circle-outline"
                       height="40"
                       width="100"
                       variant="text"
                       type="submit"
                       density="compact">
                  ثبت
                </v-btn>

                <!--       Reset       -->
                <v-btn class="border mx-2 rounded-lg"
                       color="pink"
                       prepend-icon="mdi-delete-outline"
                       height="40"
                       width="100"
                       variant="text"
                       @click="reset"
                       density="compact">
                  بازنگری
                </v-btn>

              </v-col>

            </v-row>
          </v-form>

        </v-col>

        <v-divider class="my-5"></v-divider>

        <!--    Warehouses List   -->
        <v-col cols="12" class="pb-16">
          <v-icon class="mt-n1 mr-2" color="grey">mdi-warehouse</v-icon>
          <v-label class="text-h6 text-black mx-3">انبار‌ها</v-label>

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
      form   : {
        title     : '',
        titleEn   : '',
        sellOnline: false,
        action    : 'insert',
        loading   : false
      },
      rules  : {
        notEmpty: [
          value => {
            if (value) return true;
            return 'پر کردن این فیلد اجباری است';
          }
        ],
      },
      list   : [],
    }
  },
  methods: {
    reset() {
      this.$refs.addWarehouseForm.reset();
      this.form.action     = 'insert';
      this.form.sellOnline = false;
      this.form.loading    = false;
    },
    async insert() {
      await fetch(
          this.runtimeConfig.public.apiUrl + 'warehouses', {
            method : 'post',
            headers: {
              'Content-Type' : 'application/json',
              'authorization': 'Bearer ' + this.user.token
            },
            body   : JSON.stringify({
              title     : this.form.title,
              titleEn   : this.form.titleEn,
              sellOnline: this.form.sellOnline
            })
          }).then(async response => {
        const {$showMessage} = useNuxtApp();
        if (response.status === 200) {
          $showMessage('عملیات با موفقت انجام شد', 'success');

          // reset form
          this.reset();

          // refresh list
          this.getWarehouses();
        } else {
          // show error
          $showMessage('مشکلی در عملیات پیش آمد؛ لطفا دوباره تلاش کنید', 'error');
        }
      });
    },
    async edit() {
      await fetch(
          this.runtimeConfig.public.apiUrl + 'warehouses/' + this.form._id, {
            method : 'put',
            headers: {
              'Content-Type' : 'application/json',
              'authorization': 'Bearer ' + this.user.token
            },
            body   : JSON.stringify({
              title     : this.form.title,
              titleEn   : this.form.titleEn,
              sellOnline: this.form.sellOnline
            })
          }).then(async response => {
        const {$showMessage} = useNuxtApp();
        if (response.status === 200) {
          $showMessage('عملیات با موفقت انجام شد', 'success');

          // reset form
          this.reset();

          // refresh list
          this.getWarehouses();
        } else {
          // show error
          $showMessage('مشکلی در عملیات پیش آمد؛ لطفا دوباره تلاش کنید', 'error');
        }
      });
    },
    async delete(_id) {
      await fetch(
          this.runtimeConfig.public.apiUrl + 'warehouses/' + _id, {
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
          this.getWarehouses();
        } else {
          // show error
          $showMessage('مشکلی در عملیات پیش آمد؛ لطفا دوباره تلاش کنید', 'error');
        }
      });
    },
    async submit() {
      if (this.$refs.addWarehouseForm.isValid) {
        this.form.loading = true;

        if (this.form.action === 'insert') {
          await this.insert();
        } else if (this.form.action === 'edit') {
          await this.edit();
        }

        this.form.loading = false;
      }
    },
    getWarehouses() {
      this.loading = true;
      fetch(this.runtimeConfig.public.apiUrl + 'warehouses', {method: 'get',}).then(async response => {
        response     = await response.json();
        this.list    = response;
        this.loading = false;
      });
    },
    setEdit(data) {
      this.form = {
        title     : data.title,
        titleEn   : data.titleEn,
        sellOnline: data.sellOnline,
        action    : 'edit',
        _id       : data._id
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
    this.getWarehouses();
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