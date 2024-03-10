<template>
  <v-form class="mx-5"
          validate-on="lazy"
          @submit.prevent="submit"
          ref="addBrandForm">
    <v-row class="mt-2">

      <!--      Title      -->
      <v-col class="mt-n1 mt-md-0" cols="12" md="4">
        <v-text-field class="mt-3 ltrDirection"
                      v-model="form.title.fa"
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
                      v-model="form.title.en"
                      label="Title"
                      placeholder="وارد کنید"
                      :readonly="loading"
                      :rules="rules.notEmpty"
                      density="compact"
                      variant="outlined">
        </v-text-field>
      </v-col>

      <!--     Actions       -->
      <v-col cols="12">

        <!--       Submit       -->
        <v-btn class="border rounded-lg"
               :loading="loading"
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
import {useCookie}    from "#app";

export default {
  data() {
    return {
      user   : {},
      form   : {
        title: {
          fa: '',
          en: ''
        }
      },
      rules  : {
        notEmpty: [
          value => {
            if (value) return true;
            return 'پر کردن این فیلد اجباری است';
          }
        ]
      },
      loading: false,
      action : 'add'
    }
  },
  methods: {
    reset() {
      this.$refs.addBrandForm.reset();
      this.action  = 'add';
      this.loading = false;
    },
    async add() {
      await fetch(
          this.runtimeConfig.public.API_BASE_URL + 'brands', {
            method : 'post',
            headers: {
              'Content-Type' : 'application/json',
              'authorization': 'Bearer ' + this.user.token
            },
            body   : JSON.stringify({
              title: this.form.title
            })
          }).then(async response => {
        const {$showMessage} = useNuxtApp();
        if (response.status === 200) {
          $showMessage('عملیات با موفقت انجام شد', 'success');

          // reset form
          this.reset();

          // refresh list
          this.$emit('exit');
          this.$emit('refresh');
        } else {
          // show error
          $showMessage('مشکلی در عملیات پیش آمد؛ لطفا دوباره تلاش کنید', 'error');
        }
      });
    },
    async edit() {
      await fetch(
          this.runtimeConfig.public.API_BASE_URL + 'brands/' + this.form.id, {
            method : 'put',
            headers: {
              'Content-Type' : 'application/json',
              'authorization': 'Bearer ' + this.user.token
            },
            body   : JSON.stringify({
              title: this.form.title
            })
          }).then(async response => {
        const {$showMessage} = useNuxtApp();
        if (response.status === 200) {
          $showMessage('عملیات با موفقت انجام شد', 'success');

          // reset form
          this.reset();

          // refresh list
          this.$emit('exit');
          this.$emit('refresh');
        } else {
          // show error
          $showMessage('مشکلی در عملیات پیش آمد؛ لطفا دوباره تلاش کنید', 'error');
        }
      });
    },
    async submit() {
      if (this.$refs.addBrandForm.isValid) {
        this.loading = true;

        if (this.action === 'add') {
          await this.add();
        } else if (this.action === 'edit') {
          await this.edit();
        }

        this.loading = false;
      }
    },
    setEdit(data) {
      this.form   = {
        title: data.title,
        id   : data.id
      };
      this.action = 'edit';
    }
  },
  mounted() {
    this.user          = useCookie('user').value;
    this.runtimeConfig = useRuntimeConfig();
  },
  computed: {}
}
</script>


<style scoped>

</style>