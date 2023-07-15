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
        <v-btn prepend-icon="mdi-arrow-right"
               color="secondary"
               size="small"
               variant="flat"
               rounded>
          بازگشت
        </v-btn>

        <v-label class="text-h6 text-black mx-3">مدیریت دسته بندی</v-label>
      </v-row>

      <!--   Content     -->
      <v-row class="bg-white mr-2 ml-3 rounded-lg">

        <!--    Add Category   -->
        <v-col cols="12">

          <v-icon class="" color="grey">mdi-plus-circle-outline</v-icon>
          <v-label class="text-h6 text-black mx-3">افزودن دسته بندی</v-label>

          <v-form @submit.prevent="submit" ref="addCategoryForm">

            <!--    Parent      -->
            <v-chip v-if="form._parent"
                    prepend-icon="mdi-close"
                    @click:append-inner="openIconsList"
                    class="mt-5"
                    size="small"
                    color="secondary"
                    variant="elevated">
              {{ form._parentTitle }}
            </v-chip>

            <v-row class="mt-2">

              <!--      Title      -->
              <v-col class="mt-n1 mt-md-0" cols="12" md="4">
                <v-text-field class="mt-3 ltrDirection"
                              v-model="form.title"
                              label="عنوان"
                              placeholder="وارد کنید"
                              :readonly="loading"
                              :rules="rules.title"
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
                              :rules="rules.titleEn"
                              density="compact"
                              variant="outlined">
                </v-text-field>
              </v-col>

              <!--      Icon      -->
              <v-col class="mt-n5 mt-md-0" cols="12" md="4">
                <v-text-field class="mt-3 ltrDirection"
                              v-model="form.icon"
                              append-inner-icon="mdi-link"
                              @click:append-inner="openIconsList"
                              label="Icon"
                              placeholder="وارد کنید"
                              :readonly="loading"
                              density="compact"
                              variant="outlined">
                </v-text-field>
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

        <!--    Category List   -->
        <v-col cols="12" class="pb-16">
          <v-icon class="mt-1 mr-2" color="grey">mdi-file-tree</v-icon>
          <v-label class="text-h6 text-black mx-3">دسته بندی‌ها</v-label>

          <!--    loading      -->
          <Loading :loading="loading"/>

          <CategoryView class="mt-5"
                        :list="list"
                        @setParent="setParent"
                        @setDelete="setDelete"
                        @setEdit="setEdit"/>

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
        title       : '',
        titleEn     : '',
        icon        : '',
        _parent     : '',
        _parentTitle: '',
        action      : 'insert',
        loading     : false,
      },
      rules  : {
        title  : [
          value => {
            if (value) return true;
            return 'پر کردن این فیلد اجباری است';
          }
        ],
        titleEn: [
          value => {
            if (value) return true;
            return 'پر کردن این فیلد اجباری است';
          }
        ]
      },
      list   : [],
    }
  },
  methods: {
    openIconsList() {
      window.open('https://materialdesignicons.com/', '_blank');
    },
    reset() {
      this.form = {
        title       : '',
        titleEn     : '',
        icon        : '',
        _parent     : '',
        _parentTitle: '',
        action      : 'insert'
      };
    },
    async insert() {
      await fetch(
          this.runtimeConfig.public.apiUrl + 'categories', {
            method : 'post',
            headers: {
              'Content-Type' : 'application/json',
              'authorization': 'Bearer ' + this.user.token
            },
            body   : JSON.stringify({
              title  : this.form.title,
              titleEn: this.form.titleEn,
              icon   : this.form.icon,
              _parent: this.form._parent,
            })
          }).then(async response => {
        const {$showMessage} = useNuxtApp();
        if (response.status === 200) {
          $showMessage('عملیات با موفقت انجام شد', 'success');

          // refresh list
          await this.getCategories();
        } else {
          // show error
          $showMessage('مشکلی در عملیات پیش آمد؛ لطفا دوباره تلاش کنید', 'error');
        }
      });
    },
    async edit() {
      await fetch(
          this.runtimeConfig.public.apiUrl + 'categories/' + this.form._id, {
            method : 'put',
            headers: {
              'Content-Type' : 'application/json',
              'authorization': 'Bearer ' + this.user.token
            },
            body   : JSON.stringify({
              title  : this.form.title,
              titleEn: this.form.titleEn,
              icon   : this.form.icon
            })
          }).then(async response => {
        const {$showMessage} = useNuxtApp();
        if (response.status === 200) {
          $showMessage('عملیات با موفقت انجام شد', 'success');

          // refresh list
          await this.getCategories();
        } else {
          // show error
          $showMessage('مشکلی در عملیات پیش آمد؛ لطفا دوباره تلاش کنید', 'error');
        }
      });
    },
    async delete(_id) {
      await fetch(
          this.runtimeConfig.public.apiUrl + 'categories/' + _id, {
            method : 'delete',
            headers: {
              'Content-Type' : 'application/json',
              'authorization': 'Bearer ' + this.user.token
            },
          }).then(async response => {
        const {$showMessage} = useNuxtApp();
        if (response.status === 200) {
          $showMessage('عملیات با موفقت انجام شد', 'success');

          // refresh list
          await this.getCategories();
        } else {
          // show error
          $showMessage('مشکلی در عملیات پیش آمد؛ لطفا دوباره تلاش کنید', 'error');
        }
      });
    },
    async submit() {
      if (this.$refs.addCategoryForm.isValid) {
        this.form.loading = true;
        if (this.form.action === 'insert') {
          await this.insert();
        } else if (this.form.action === 'edit') {
          await this.edit();
        }
        this.form.loading = false;
      }
    },
    async getCategories() {
      this.loading = true;
      await fetch(
          this.runtimeConfig.public.apiUrl + 'categories', {
            method : 'get',
            headers: {
              'Content-Type' : 'application/json'
            }
          }).then(async response => {
        response  = await response.json();
        this.list = response;
      });
      this.loading = false;
    },
    setEdit(data) {
      this.form = {
        title       : data.title,
        titleEn     : data.titleEn,
        icon        : data.icon ?? '',
        _parent     : '',
        _parentTitle: '',
        action      : 'edit',
        _id         : data._id
      };
    },
    setDelete(data) {
      if (confirm('آیا مطمئن هستید؟')) {
        this.delete(data._id);
      }
    },
    setParent(data) {
      this.form._parent      = data._id;
      this.form._parentTitle = data.title;
    },
  },
  mounted() {
    this.user = useUserStore();
    this.getCategories();
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