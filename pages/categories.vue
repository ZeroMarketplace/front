<template>
  <v-row>

    <!--  Admin Dashboard Menu   -->
    <v-col class="pa-0 d-none d-md-inline" md="3">
      <AdminDashboardMenu/>
    </v-col>

    <!--  Page   -->
    <v-col cols="12" md="9">

      <AdminHeaderBar class="mb-3"/>

      <!--   Content     -->
      <v-row class="bg-white mr-4 mr-md-1 ml-4 rounded-lg pb-16v">

        <!--    Title And Action    -->
        <v-col cols="12">
          <v-row>
            <!--      Title      -->
            <v-col class="mt-2" cols="9">
              <v-icon v-if="action === 'list'" class="mt-1 mr-2" color="grey">
                mdi-file-tree-outline
              </v-icon>

              <v-icon v-if="action === 'add'" class="mt-1 mr-2" color="green">
                mdi-file-tree-outline
              </v-icon>

              <v-icon v-if="action === 'edit'" class="mt-1 mr-2" color="warning">
                mdi-file-tree-outline
              </v-icon>

              <v-label class="font-weight-bold mr-2">
                <span v-if="action === 'list'">دسته‌بندی‌ها</span>
                <span v-if="action === 'add'">افزودن دسته‌بندی</span>
                <span v-if="action === 'edit'">ویرایش دسته‌بندی</span>
              </v-label>
            </v-col>

            <!--     Action       -->
            <v-col class="text-end" cols="3">
              <v-btn class="bg-secondary"
                     size="small"
                     @click="toggleAction"
                     icon>
                <v-icon v-if="action === 'list'">mdi-plus</v-icon>
                <v-icon v-if="action === 'edit'">mdi-file-tree-outline</v-icon>
                <v-icon v-if="action === 'add'">mdi-file-tree-outline</v-icon>
              </v-btn>
            </v-col>
          </v-row>
          <v-divider class="mt-3"></v-divider>
        </v-col>

        <!--    Add Category   -->
        <v-col v-show="(action === 'add' || action === 'edit')" cols="12" class="pb-10">
          <categories-add-category ref="addCategory" @exit="toggleAction" @refresh="getCategories"/>
        </v-col>

        <!--    Category List   -->
        <v-col v-show="action === 'list'" cols="12" class="pb-16">

          <!--    loading      -->
          <Loading :loading="loading"/>

          <categories-category-view class="mt-5"
                                    :list="list"
                                    @setParent="setParent"
                                    @setDelete="setDelete"
                                    @setEdit="setEdit"/>

          <!--    Empty List Alert      -->
          <EmptyList class="py-16 mb-16" :list="list" :loading="loading"/>

        </v-col>

      </v-row>

    </v-col>

  </v-row>
</template>

<script>
import {useUserStore} from "~/store/user";
import {useCookie}    from "#app";

definePageMeta({
  layout: "admin-layout"
});

export default {
  data() {
    return {
      user   : {},
      loading: true,
      action : 'list',
      list   : []
    }
  },
  methods: {
    toggleAction() {
      if (this.action === 'add' || this.action === 'edit')
        this.action = 'list';
      else
        this.action = this.$refs.addCategory.action;
    },
    getCategories() {
      this.loading = true;
      fetch(this.runtimeConfig.public.API_BASE_URL + 'categories', {method: 'get'})
          .then(async response => {
            response     = await response.json();
            this.list    = response.list;
            this.loading = false;
          });
    },
    async delete(_id) {
      await fetch(
          this.runtimeConfig.public.API_BASE_URL + 'categories/' + _id, {
            method : 'delete',
            headers: {
              'Content-Type' : 'application/json',
              'authorization': 'Bearer ' + this.user.token
            },
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
    },
    setEdit(data) {
      this.$refs.addCategory.setEdit(data);
      this.action = 'edit';
    },
    setDelete(data) {
      if (confirm('آیا مطمئن هستید؟')) {
        this.delete(data._id);
      }
    },
    setParent(data) {
      this.$refs.addCategory.setParent(data);
      this.action = 'add';
    },
  },
  mounted() {
    this.user = useCookie('user').value;
    this.runtimeConfig = useRuntimeConfig();
    this.getCategories();
  },
  computed: {}
}
</script>


<style scoped>

</style>