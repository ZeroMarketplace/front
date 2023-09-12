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

        <v-label class="text-h6 text-black mx-3">مدیریت ویژگی‌ها</v-label>
      </v-row>

      <!--   Content     -->
      <v-row class="bg-white mr-1 ml-4 mt-n2 rounded-lg">

        <!--    Add Property   -->
        <v-col cols="12">

          <v-icon class="mr-2" color="grey">mdi-plus-circle-outline</v-icon>
          <v-label class="text-h6 text-black mx-3">افزودن ویژگی</v-label>

          <v-form @submit.prevent="submit" ref="addPropertyForm">
            <v-row class="mt-2 mx-4">

              <!--      Title      -->
              <v-col class="mt-n1 mt-md-0" cols="12" md="4">
                <v-text-field class="mt-3"
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
                <v-text-field class="mt-3"
                              v-model="form.titleEn"
                              label="Title"
                              placeholder="وارد کنید"
                              :readonly="loading"
                              :rules="rules.notEmpty"
                              density="compact"
                              variant="outlined">
                </v-text-field>
              </v-col>

              <!--      Variant      -->
              <v-col class="mt-n5 mt-md-0 text-center" cols="12" md="4">
                <v-checkbox class="mt-2"
                            v-model="form.variant"
                            :readonly="loading"
                            label="ایجاد تنوع"
                            hide-details
                ></v-checkbox>
              </v-col>

              <!--      Values      -->
              <v-col class="mr-5 pb-10" cols="12" md="12">
                <v-label class="font-weight-bold mr-2">
                  مقادیر

                  <!--  Add Value   -->
                  <v-btn class="border mr-3"
                         @click="addValue"
                         size="30"
                         variant="outlined"
                         color="pink"
                         icon>
                    <v-icon>mdi-plus</v-icon>
                  </v-btn>

                </v-label>
                <v-row v-for="(valueItem, index) in form.values">

                  <!--         Title         -->
                  <v-col>
                    <v-text-field class="mt-3"
                                  v-model="valueItem.title"
                                  label="عنوان"
                                  placeholder="وارد کنید"
                                  :readonly="loading"
                                  :rules="rules.notEmpty"
                                  density="compact"
                                  variant="outlined"
                                  hide-details>
                    </v-text-field>
                  </v-col>

                  <!--         Value         -->
                  <v-col>
                    <v-text-field class="mt-3 ltrDirection"
                                  v-model="valueItem.value"
                                  label="مقدار"
                                  placeholder="وارد کنید"
                                  :readonly="loading"
                                  :rules="rules.notEmpty"
                                  density="compact"
                                  variant="outlined"
                                  hide-details>
                    </v-text-field>
                  </v-col>

                  <!--         Actions         -->
                  <v-col class="text-center align-center">
                    <!--  Delete Value   -->
                    <v-btn class="border float-start mt-5"
                           @click="deleteValue(index)"
                           size="30"
                           variant="outlined"
                           color="pink"
                           icon>
                      <v-icon>mdi-delete</v-icon>
                    </v-btn>
                  </v-col>
                </v-row>
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

        <!--    Properties List   -->
        <v-col cols="12" class="pb-16">
          <v-icon class="mt-1 mr-2" color="grey">mdi-order-bool-descending-variant</v-icon>
          <v-label class="text-h6 text-black mx-3">ویژگی‌ها</v-label>

          <!--    loading      -->
          <Loading :loading="loading"/>

          <!--    List      -->
          <v-list class="mx-5">
            <v-list-item v-for="item in list" class="rounded border-b pa-2" link>

              <!--      Title        -->
              <v-list-item-title>{{ item.title }}</v-list-item-title>

              <!--      Actions        -->
              <template v-slot:append>
                <!--  Delete   -->
                <v-btn class="mx-2"
                       color="red"
                       size="30"
                       @click="setDelete({_id: item._id})"
                       icon>
                  <v-icon size="15">mdi-delete-outline</v-icon>
                </v-btn>

                <!--  Edit   -->
                <v-btn class="mx-2"
                       color="secondary"
                       size="30"
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
        title  : '',
        titleEn: '',
        variant: false,
        values : [
          {
            title: '',
            value: ''
          }
        ],
        action : 'insert',
        loading: false
      },
      rules  : {
        notEmpty: [
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
    reset() {
      this.$refs.addPropertyForm.reset();
      this.form.values  = [{title: '', value: ''}];
      this.form.variant = false;
      this.form.action  = 'insert';
      this.form.loading = false;
    },
    async insert() {
      await fetch(
          this.runtimeConfig.public.apiUrl + 'properties', {
            method : 'post',
            headers: {
              'Content-Type' : 'application/json',
              'authorization': 'Bearer ' + this.user.token
            },
            body   : JSON.stringify({
              title  : this.form.title,
              titleEn: this.form.titleEn,
              variant: this.form.variant,
              values : this.form.values
            })
          }).then(async response => {
        const {$showMessage} = useNuxtApp();
        if (response.status === 200) {
          $showMessage('عملیات با موفقت انجام شد', 'success');

          // reset form
          this.reset();

          // refresh list
          this.getProperties();
        } else {
          // show error
          $showMessage('مشکلی در عملیات پیش آمد؛ لطفا دوباره تلاش کنید', 'error');
        }
      });
    },
    async edit() {
      await fetch(
          this.runtimeConfig.public.apiUrl + 'properties/' + this.form._id, {
            method : 'put',
            headers: {
              'Content-Type' : 'application/json',
              'authorization': 'Bearer ' + this.user.token
            },
            body   : JSON.stringify({
              title  : this.form.title,
              titleEn: this.form.titleEn,
              variant: this.form.variant,
              values : this.form.values
            })
          }).then(async response => {
        const {$showMessage} = useNuxtApp();
        if (response.status === 200) {
          $showMessage('عملیات با موفقت انجام شد', 'success');

          // reset form
          this.reset();

          // refresh list
          this.getProperties();
        } else {
          // show error
          $showMessage('مشکلی در عملیات پیش آمد؛ لطفا دوباره تلاش کنید', 'error');
        }
      });
    },
    async delete(_id) {
      await fetch(
          this.runtimeConfig.public.apiUrl + 'properties/' + _id, {
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
          this.getProperties();
        } else {
          // show error
          $showMessage('مشکلی در عملیات پیش آمد؛ لطفا دوباره تلاش کنید', 'error');
        }
      });
    },
    async submit() {
      if (this.$refs.addPropertyForm.isValid) {
        this.form.loading = true;

        if (this.form.action === 'insert') {
          await this.insert();
        } else if (this.form.action === 'edit') {
          await this.edit();
        }

        this.form.loading = false;
      }
    },
    getProperties() {
      this.loading = true;
      fetch(this.runtimeConfig.public.apiUrl + 'properties', {method: 'get',}).then(async response => {
        response     = await response.json();
        this.list    = response;
        this.loading = false;
      });
    },
    setEdit(data) {
      this.form = {
        title  : data.title,
        titleEn: data.titleEn,
        variant: data.variant,
        values : data.values,
        action : 'edit',
        _id    : data._id
      };
    },
    setDelete(data) {
      if (confirm('آیا مطمئن هستید؟')) {
        this.delete(data._id);
      }
    },
    addValue() {
      this.form.values.push({
        title: '',
        value: ''
      });
    },
    deleteValue(index) {
      this.form.values.splice(index, 1);
    },
  },
  mounted() {
    this.user = useUserStore();
    this.getProperties();
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