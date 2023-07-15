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

        <v-label class="text-h6 text-black mx-3">مدیریت رنگ‌ها</v-label>
      </v-row>

      <!--   Content     -->
      <v-row class="bg-white mr-2 ml-3 rounded-lg">

        <!--    Add Color   -->
        <v-col cols="12">

          <v-icon class="" color="grey">mdi-plus-circle-outline</v-icon>
          <v-label class="text-h6 text-black mx-3">افزودن رنگ</v-label>

          <v-form @submit.prevent="submit" ref="addColorForm">

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

              <!--      Color      -->
              <v-col class="mt-n5 mt-md-0" cols="12" md="4">
                <v-text-field class="mt-3 ltrDirection"
                              v-model="form.color"
                              label="رنگ"
                              placeholder="وارد کنید"
                              :readonly="loading"
                              :rules="rules.notEmpty"
                              density="compact"
                              variant="outlined">
                  <template v-slot:append-inner>
                    <v-btn class="px-2" variant="text" @click="form.colorDialog = true">
                      <v-icon class="mx-1">mdi-palette</v-icon>
                      رنگ‌ها
                    </v-btn>
                  </template>
                </v-text-field>

                <!--        Color Dialog         -->
                <v-dialog v-model="form.colorDialog">
                  <v-row no-gutters>
                    <v-col cols="12" sm="8" offset-sm="2" md="4" offset-md="4">
                      <v-card class="pt-2" elevation="5">
                        <v-card-title class="border-b mb-1">
                          انتخاب رنگ
                          <v-icon class="float-left"
                                  @click="form.colorDialog = false">mdi-close
                          </v-icon>
                        </v-card-title>

                        <v-card-text class="pa-0">
                          <v-color-picker width="100%"
                                          v-model="form.color"
                                          show-swatches>

                          </v-color-picker>
                        </v-card-text>
                      </v-card>

                    </v-col>
                  </v-row>
                </v-dialog>

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

        <!--    Units List   -->
        <v-col cols="12" class="pb-16">
          <v-icon class="mt-1 mr-2" color="grey">mdi-palette</v-icon>
          <v-label class="text-h6 text-black mx-3">رنگ‌ها</v-label>

          <!--    loading      -->
          <Loading :loading="loading"/>

          <!--    List      -->
          <v-list class="">
            <v-list-item v-for="item in list"
                         class="rounded border-b pa-2" link>

              <!--      Title        -->
              <v-list-item-title>
                <v-icon class="mx-2" :color="item.color">mdi-circle</v-icon>
                {{ item.title }}
              </v-list-item-title>

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
        title      : '',
        titleEn    : '',
        color      : '',
        action     : 'insert',
        colorDialog: false,
        loading    : false
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
      this.form = {
        title  : '',
        titleEn: '',
        action : 'insert'
      };
    },
    async insert() {
      await fetch(
          this.runtimeConfig.public.apiUrl + 'colors', {
            method : 'post',
            headers: {
              'Content-Type' : 'application/json',
              'authorization': 'Bearer ' + this.user.token
            },
            body   : JSON.stringify({
              title  : this.form.title,
              titleEn: this.form.titleEn,
              color  : this.form.color
            })
          }).then(async response => {
        const {$showMessage} = useNuxtApp();
        if (response.status === 200) {
          $showMessage('عملیات با موفقت انجام شد', 'success');

          // refresh list
          await this.getColors();
        } else {
          // show error
          $showMessage('مشکلی در عملیات پیش آمد؛ لطفا دوباره تلاش کنید', 'error');
        }
      });
    },
    async edit() {
      await fetch(
          this.runtimeConfig.public.apiUrl + 'colors/' + this.form._id, {
            method : 'put',
            headers: {
              'Content-Type' : 'application/json',
              'authorization': 'Bearer ' + this.user.token
            },
            body   : JSON.stringify({
              title  : this.form.title,
              titleEn: this.form.titleEn,
              color  : this.form.color
            })
          }).then(async response => {
        const {$showMessage} = useNuxtApp();
        if (response.status === 200) {
          $showMessage('عملیات با موفقت انجام شد', 'success');

          // refresh list
          await this.getColors();
        } else {
          // show error
          $showMessage('مشکلی در عملیات پیش آمد؛ لطفا دوباره تلاش کنید', 'error');
        }
      });
    },
    async delete(_id) {
      await fetch(
          this.runtimeConfig.public.apiUrl + 'colors/' + _id, {
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
          await this.getColors();
        } else {
          // show error
          $showMessage('مشکلی در عملیات پیش آمد؛ لطفا دوباره تلاش کنید', 'error');
        }
      });
    },
    async submit() {
      if (this.$refs.addColorForm.isValid) {
        this.form.loading = true;

        if (this.form.action === 'insert') {
          await this.insert();
        } else if (this.form.action === 'edit') {
          await this.edit();
        }

        this.form.loading = false;
      }
    },
    async getColors() {
      this.loading = true;
      await fetch(
          this.runtimeConfig.public.apiUrl + 'colors', {
            method : 'get',
            headers: {
              'Content-Type': 'application/json'
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
        color  : data.color,
        action : 'edit',
        _id    : data._id
      };
    },
    setDelete(data) {
      if (confirm('آیا مطمئن هستید؟')) {
        this.delete(data._id);
      }
    },
  },
  mounted() {
    this.user = useUserStore();
    this.getColors();
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