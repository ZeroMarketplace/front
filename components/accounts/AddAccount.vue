<template>
  <v-form class=""
          @submit.prevent="submit"
          ref="addAccountForm">
    <v-row class="mt-2">
      <!--      Title      -->
      <v-col class="mt-n1 mt-md-0" cols="12" md="4">
        <v-text-field class=""
                      v-model="form.title"
                      label="عنوان"
                      placeholder="وارد کنید"
                      :readonly="form.loading"
                      :rules="rules.notEmpty"
                      density="compact"
                      variant="outlined">
        </v-text-field>
      </v-col>

      <!--      Title EN      -->
      <v-col class="mt-n5 mt-md-0" cols="12" md="4">
        <v-text-field class="ltrDirection"
                      v-model="form.titleEn"
                      label="Title"
                      placeholder="وارد کنید"
                      :readonly="form.loading"
                      :rules="rules.notEmpty"
                      density="compact"
                      variant="outlined">
        </v-text-field>
      </v-col>

      <!--     type      -->
      <v-col class="mt-n5 mt-md-0" cols="12" md="4">
        <v-select class="ltrDirection"
                      v-model="form.titleEn"
                      label="نوع حساب"
                      placeholder="انتخاب کنید"
                      :readonly="form.loading"
                      :rules="rules.notEmpty"
                      density="compact"
                      variant="outlined">
        </v-select>
      </v-col>

      <!--      Balance      -->
      <v-col class="mt-n5 mt-md-0" cols="12" md="4">
        <v-text-field class="ltrDirection"
                      v-model="form.balance"
                      label="مانده حساب"
                      placeholder="وارد کنید"
                      :readonly="form.loading"
                      :rules="rules.notEmpty"
                      type="number"
                      density="compact"
                      variant="outlined">
          <template v-slot:append-inner>
            تومان
          </template>
        </v-text-field>
      </v-col>

      <!--      Description      -->
      <v-col class="mt-n5 mt-md-0" cols="12" md="8">
        <v-text-field class=""
                      v-model="form.description"
                      label="توضیحات"
                      placeholder="وارد کنید"
                      :readonly="form.loading"
                      :rules="rules.notEmpty"
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
</template>

<script>
import {useUserStore} from "~/store/user";

export default {
  data() {
    return {
      user : {},
      form : {
        title  : '',
        titleEn: '',
        action : 'insert',
        loading: false
      },
      rules: {
        notEmpty: [
          value => {
            if (value) return true;
            return 'پر کردن این فیلد اجباری است';
          }
        ]
      },
    }
  },
  methods: {
    reset() {
      this.$refs.addAccountForm.reset();
      this.form.action  = 'insert';
      this.form.loading = false;
    },
    async insert() {
      await fetch(
          this.runtimeConfig.public.apiUrl + 'accounts', {
            method : 'post',
            headers: {
              'Content-Type' : 'application/json',
              'authorization': 'Bearer ' + this.user.token
            },
            body   : JSON.stringify({
              title  : this.form.title,
              titleEn: this.form.titleEn
            })
          }).then(async response => {
        const {$showMessage} = useNuxtApp();
        if (response.status === 200) {
          $showMessage('عملیات با موفقت انجام شد', 'success');

          // reset form
          this.reset();

          // refresh list
          await this.getAccounts();
        } else {
          // show error
          $showMessage('مشکلی در عملیات پیش آمد؛ لطفا دوباره تلاش کنید', 'error');
        }
      });
    },
    async edit() {
      await fetch(
          this.runtimeConfig.public.apiUrl + 'accounts/' + this.form._id, {
            method : 'put',
            headers: {
              'Content-Type' : 'application/json',
              'authorization': 'Bearer ' + this.user.token
            },
            body   : JSON.stringify({
              title  : this.form.title,
              titleEn: this.form.titleEn
            })
          }).then(async response => {
        const {$showMessage} = useNuxtApp();
        if (response.status === 200) {
          $showMessage('عملیات با موفقت انجام شد', 'success');

          // reset form
          this.reset();

          // refresh list
          await this.getAccounts();
        } else {
          // show error
          $showMessage('مشکلی در عملیات پیش آمد؛ لطفا دوباره تلاش کنید', 'error');
        }
      });
    },
    async submit() {
      if (this.$refs.addAccountForm.isValid) {
        this.form.loading = true;

        if (this.form.action === 'insert') {
          await this.insert();
        } else if (this.form.action === 'edit') {
          await this.edit();
        }

        this.form.loading = false;
      }
    },
  },
  mounted() {
    this.user = useUserStore();
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