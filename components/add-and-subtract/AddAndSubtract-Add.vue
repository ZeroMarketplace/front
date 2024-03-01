<template>
  <v-form class="mx-5" @submit.prevent="submit" ref="addAndSubtractForm">

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

      <!--      Title EN      -->
      <v-col class="mt-n5 mt-md-0" cols="12" md="4">
        <v-text-field class="mt-3 ltrDirection"
                      v-model="form.default"
                      label="مقدار پیش فرض"
                      placeholder="وارد کنید"
                      :readonly="loading"
                      :rules="rules.notEmpty"
                      type="number"
                      density="compact"
                      variant="outlined">
        </v-text-field>
      </v-col>

      <!--      Type      -->
      <v-col class="mt-n5 mt-md-0" cols="12" md="4">
        <v-select class="ltrDirection"
                  v-model="form.type"
                  label="نوع ورودی"
                  placeholder="انتخاب کنید"
                  :items="types"
                  :readonly="loading"
                  :rules="rules.notEmpty"
                  density="compact"
                  variant="outlined">
        </v-select>
      </v-col>

      <!--      Operation      -->
      <v-col class="mt-n5 mt-md-0" cols="12" md="4">
        <v-select class="ltrDirection"
                  v-model="form.operation"
                  label="نوع عملیات"
                  placeholder="انتخاب کنید"
                  :items="operations"
                  :readonly="loading"
                  :rules="rules.notEmpty"
                  density="compact"
                  variant="outlined">
        </v-select>
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
import {useCookie}    from "#app";

export default {
  data() {
    return {
      form      : {
        title    : {
          en: '',
          fa: ''
        },
        default  : '',
        type     : 'percent',
        operation: 'add',
      },
      rules     : {
        notEmpty: [
          value => {
            if (value) return true;
            return 'پر کردن این فیلد اجباری است';
          }
        ],
      },
      types     : [
        {title: 'درصد', value: 'percent'},
        {title: 'مقدار عددی', value: 'number'},
      ],
      operations: [
        {title: 'اضافه کردن', value: 'add'},
        {title: 'کم کردن', value: 'subtract'},
      ],
      action    : 'add',
      loading   : false
    }
  },
  methods: {
    reset() {
      this.$refs.addAndSubtractForm.reset();
      this.loading = false;
      this.action  = 'add';
    },
    async add() {
      await fetch(
          this.runtimeConfig.public.API_BASE_URL + 'add-and-subtract', {
            method : 'post',
            headers: {
              'Content-Type' : 'application/json',
              'authorization': 'Bearer ' + this.user.token
            },
            body   : JSON.stringify({
              title    : this.form.title,
              default  : this.form.default,
              type     : this.form.type,
              operation: this.form.operation,
            })
          }).then(async response => {
        const {$showMessage} = useNuxtApp();
        if (response.status === 200) {
          $showMessage('عملیات با موفقت انجام شد', 'success');

          // reset form
          this.reset();

          // refresh list
          this.$emit('exit');
          setTimeout(() => {
            this.$emit('refresh');
          }, 500)
        } else {
          // show error
          $showMessage('مشکلی در عملیات پیش آمد؛ لطفا دوباره تلاش کنید', 'error');
        }
      });
    },
    async edit() {
      await fetch(
          this.runtimeConfig.public.API_BASE_URL + 'add-and-subtract/' + this.form.id, {
            method : 'put',
            headers: {
              'Content-Type' : 'application/json',
              'authorization': 'Bearer ' + this.user.token
            },
            body   : JSON.stringify({
              title    : this.form.title,
              default  : this.form.default,
              type     : this.form.type,
              operation: this.form.operation,
            })
          }).then(async response => {
        const {$showMessage} = useNuxtApp();
        if (response.status === 200) {
          $showMessage('عملیات با موفقت انجام شد', 'success');

          // reset form
          this.reset();

          // refresh list
          this.$emit('exit');
          setTimeout(() => {
            this.$emit('refresh');
          }, 500)
        } else {
          // show error
          $showMessage('مشکلی در عملیات پیش آمد؛ لطفا دوباره تلاش کنید', 'error');
        }
      });
    },
    async submit() {
      if (this.$refs.addAndSubtractForm.isValid) {
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
        title    : data.title,
        default  : data.default,
        type     : data.type,
        operation: data.operation,
        id       : data.id
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