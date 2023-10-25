<template>
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
</template>

<script>
import {useUserStore} from "~/store/user";
import {useCookie}    from "#app";

export default {
  data() {
    return {
      form   : {
        title  : '',
        titleEn: '',
        variant: false,
        values : [
          {
            title: '',
            value: ''
          }
        ]
      },
      rules  : {
        notEmpty: [
          value => {
            if (value) return true;
            return 'پر کردن این فیلد اجباری است';
          }
        ]
      },
      action : 'add',
      loading: false
    }
  },
  methods: {
    reset() {
      this.$refs.addPropertyForm.reset();
      this.form.values  = [{title: '', value: ''}];
      this.form.variant = false;
      this.action       = 'add';
      this.loading      = false;
    },
    async add() {
      await fetch(
          this.runtimeConfig.public.API_BASE_URL + 'properties', {
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
          this.runtimeConfig.public.API_BASE_URL + 'properties/' + this.form._id, {
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
          this.$emit('exit');
          this.$emit('refresh');
        } else {
          // show error
          $showMessage('مشکلی در عملیات پیش آمد؛ لطفا دوباره تلاش کنید', 'error');
        }
      });
    },
    async submit() {
      if (this.$refs.addPropertyForm.isValid) {
        this.loading = true;

        if (this.action === 'add') {
          await this.add();
        } else if (this.action === 'edit') {
          await this.edit();
        }

        this.form.loading = false;
      }
    },
    setEdit(data) {
      this.form   = {
        title  : data.title,
        titleEn: data.titleEn,
        variant: data.variant,
        values : data.values,
        _id    : data._id
      };
      this.action = 'edit';
    },
    deleteValue(index) {
      this.form.values.splice(index, 1);
    },
    addValue() {
      this.form.values.push({
        title: '',
        value: ''
      });
    },
  },
  mounted() {
    this.user = useCookie('user').value;
    this.runtimeConfig = useRuntimeConfig();
  },
  computed: {}
}
</script>

<style scoped>

</style>