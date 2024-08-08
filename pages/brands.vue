<template>
  <v-row class="bg-white mr-4 mr-md-1 ml-4 rounded-lg pb-16">

    <!--    Title And Action    -->
    <v-col cols="12">
      <v-row>
        <!--      Title      -->
        <v-col class="mt-2" cols="9">
          <v-icon v-if="action === 'list'" class="mt-1 mr-2" color="grey">
            mdi-draw-pen
          </v-icon>

          <v-icon v-if="action === 'add'" class="mt-1 mr-2" color="green">
            mdi-draw-pen
          </v-icon>

          <v-icon v-if="action === 'edit'" class="mt-1 mr-2" color="warning">
            mdi-draw-pen
          </v-icon>

          <v-label class="font-weight-bold mr-2">
            <span v-if="action === 'list'">برند‌ها</span>
            <span v-if="action === 'add'">افزودن برند</span>
            <span v-if="action === 'edit'">ویرایش برند</span>
          </v-label>
        </v-col>

        <!--     Action       -->
        <v-col class="text-end" cols="3">
          <v-btn class="bg-secondary"
                 size="small"
                 @click="toggleAction"
                 icon>
            <v-icon v-if="action === 'list'">mdi-plus</v-icon>
            <v-icon v-if="action === 'edit'">mdi-draw-pen</v-icon>
            <v-icon v-if="action === 'add'">mdi-draw-pen</v-icon>
          </v-btn>
        </v-col>
      </v-row>
      <v-divider class="mt-3"></v-divider>
    </v-col>

    <!--    Add Brand   -->
    <v-col v-show="(action === 'add' || action === 'edit')" cols="12">
      <brands-add-brand ref="addBrand" @exit="toggleAction" @refresh="getBrands"/>
    </v-col>

    <!--    Brands List   -->
    <v-col v-show="action === 'list'" cols="12" class="pb-16">

      <!--    loading      -->
      <Loading :loading="loading"/>

      <!--    List      -->
      <v-list class="mx-5">
        <v-list-item v-for="item in list"
                     class="rounded border-b pa-2" link>

          <!--      Title        -->
          <v-list-item-title>{{ item.title.fa }}</v-list-item-title>

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
</template>

<script>
import {useUserStore} from "~/store/user";
import {useCookie}    from "#app";

definePageMeta({
  layout: "admin",
  middleware: 'auth',
  requiresAuth: true,
  requiresRole: 'admin'
});

export default {
  data() {
    return {
      user   : {},
      list   : [],
      loading: true,
      action : 'list',
    }
  },
  methods: {
    async delete(_id) {
      await fetch(
          this.runtimeConfig.public.API_BASE_URL + 'brands/' + _id, {
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
          this.getBrands();
        } else {
          // show error
          $showMessage('مشکلی در عملیات پیش آمد؛ لطفا دوباره تلاش کنید', 'error');
        }
      });
    },
    getBrands() {
      this.loading = true;
      fetch(this.runtimeConfig.public.API_BASE_URL + 'brands', {method: 'get',}).then(async response => {
        response     = await response.json();
        this.list    = response.list;
        this.loading = false;
      });
    },
    setEdit(data) {
      this.$refs.addBrand.setEdit(data);
      this.action = 'edit';
    },
    setDelete(data) {
      if (confirm('آیا مطمئن هستید؟')) {
        this.delete(data._id);
      }
    },
    toggleAction() {
      if (this.action === 'add' || this.action === 'edit')
        this.action = 'list';
      else
        this.action = this.$refs.addBrand.action;
    }
  },
  mounted() {
    this.user = useCookie('user').value;
    this.runtimeConfig = useRuntimeConfig();
    this.getBrands();
  },
  computed: {}
}
</script>


<style scoped>

</style>
