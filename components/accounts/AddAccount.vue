<template>
  <v-form class=""
          validate-on="lazy"
          @submit.prevent="submit"
          ref="addAccountForm">
    <v-row class="mt-2">
oi
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
export default {
  data() {
    return {
      form : {
        title  : '',
        titleEn: '',
        action : 'insert',
        loading: false
      },
      rules: {
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
  }
}
</script>


<style scoped>

</style>