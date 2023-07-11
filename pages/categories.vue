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
                       type="reset"
                       density="compact">
                  بازنگری
                </v-btn>

              </v-col>

            </v-row>
          </v-form>

        </v-col>

        <v-divider class="my-5"></v-divider>

        <!--    Category List   -->
        <v-col cols="12">
          <v-icon class="mt-1" color="grey">mdi-list</v-icon>
          <v-label class="text-h6 text-black mx-3">دسته بندی‌ها</v-label>

          <CategoryView :list="list" @setParent="setParent"/>

          <!--    Empty List Alert      -->
          <v-row v-if="!list.length" class="justify-center mt-5 mb-16">

            <v-icon class="w-100 my-5"
                    size="100">
              mdi-information-outline
            </v-icon>

            <v-label class="text-pink">
              متاسفانه هیچ داده‌ای یافت نشد
            </v-label>
          </v-row>

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
      loading: false,
      form   : {
        title       : '',
        titleEn     : '',
        icon        : '',
        _parent     : '',
        _parentTitle: '',
        valid       : false
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
    getItem(_id) {
      return _id;
    },
    async submit() {
      if (this.$refs.addCategoryForm.isValid) {
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
      }
    },
    async getCategories() {
      await fetch(
          this.runtimeConfig.public.apiUrl + 'categories', {
            method : 'get',
            headers: {
              'Content-Type' : 'application/json',
              'authorization': 'Bearer ' + this.user.token
            }
          }).then(async response => {
        response  = await response.json();
        this.list = response;
      });
    },
    setParent(data) {
      this.form._parent      = data._id;
      this.form._parentTitle = data.title;
    }
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