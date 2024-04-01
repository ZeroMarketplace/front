<template>
  <v-form @submit.prevent="submit" ref="addCategoryForm">

    <!--    Parent      -->
    <v-chip v-if="form._parent"
            class="mt-5 mr-7"
            size="small"
            color="secondary"
            variant="elevated">
      {{ form._parentTitle }}
    </v-chip>

    <v-row class="mt-2 mx-5">

      <!--      Title      -->
      <v-col class="mt-n1 mt-md-0" cols="12" md="4">
        <v-text-field class="mt-3"
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
        <v-text-field class="mt-3"
                      v-model="form.title.en"
                      label="Title"
                      placeholder="وارد کنید"
                      :readonly="loading"
                      :rules="rules.notEmpty"
                      density="compact"
                      variant="outlined">
        </v-text-field>
      </v-col>

      <!--      Properties      -->
      <v-col class="mt-n5 mt-md-0" cols="12" md="4">
        <v-autocomplete class="mt-3"
                        v-model="form._properties"
                        label="ویژگی‌ها"
                        :readonly="loading"
                        :items="properties"
                        item-title=".title.fa"
                        item-value="_id"
                        density="compact"
                        variant="outlined"
                        multiple>
        </v-autocomplete>
      </v-col>

      <!--      Profit Percentage      -->
      <v-col class="mt-n5 mt-md-0" cols="12" md="4">
        <v-text-field class="mt-3"
                      v-model="form.profitPercent"
                      label="درصد سود"
                      placeholder="وارد کنید"
                      :readonly="loading"
                      type="number"
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
      form      : {
        title        : {
          en: '',
          fa: ''
        },
        profitPercent: 0,
        _parent      : '',
        _parentTitle : '',
        _properties  : []
      },
      rules     : {
        notEmpty                  : [
          value => {
            if (value) return true;
            return 'پر کردن این فیلد اجباری است';
          }
        ],
        notEmptySelectableMultiple: [
          value => {
            if (value.length) return true;
            return 'لطفا انتخاب کنید';
          }
        ],
      },
      properties: [],
      action    : 'add',
      loading   : false
    }
  },
  methods: {
    reset() {
      this.$refs.addCategoryForm.reset();
      this.form._parent      = '';
      this.form._parentTitle = '';
      this.action            = 'add';
      this.loading           = false;
    },
    async add() {
      await fetch(
          this.runtimeConfig.public.API_BASE_URL + 'categories', {
            method : 'post',
            headers: {
              'Content-Type' : 'application/json',
              'authorization': 'Bearer ' + this.user.token
            },
            body   : JSON.stringify({
              title        : this.form.title,
              profitPercent: Number(this.form.profitPercent),
              _properties  : this.form._properties,
              _parent      : this.form._parent,
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
          this.runtimeConfig.public.API_BASE_URL + 'categories/' + this.form._id, {
            method : 'put',
            headers: {
              'Content-Type' : 'application/json',
              'authorization': 'Bearer ' + this.user.token
            },
            body   : JSON.stringify({
              title        : this.form.title,
              profitPercent: Number(this.form.profitPercent),
              _properties  : this.form._properties
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
      if (this.$refs.addCategoryForm.isValid) {
        this.loading = true;
        if (this.action === 'add') {
          await this.add();
        } else if (this.action === 'edit') {
          await this.edit();
        }
        this.loading = false;
      }
    },
    getProperties() {
      fetch(this.runtimeConfig.public.API_BASE_URL + 'properties', {method: 'get'})
          .then(async response => {
            response        = await response.json();
            this.properties = response.list;
          });
    },
    setEdit(data) {
      this.form   = {
        title        : data.title,
        profitPercent: data.profitPercent,
        _parent      : '',
        _parentTitle : '',
        _properties  : data._properties,
        _id           : data._id
      };
      this.action = 'edit';
    },
    setDelete(data) {
      if (confirm('آیا مطمئن هستید؟')) {
        this.delete(data._id);
      }
    },
    setParent(data) {
      this.form._parent      = data._id;
      this.form._parentTitle = data.title;
      this.form._properties  = data._properties;
    }
  },
  mounted() {
    this.user          = useCookie('user').value;
    this.runtimeConfig = useRuntimeConfig();
    this.getProperties();
  },
  computed: {}
}
</script>


<style scoped>

</style>