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

        <v-col>
          <BackButton/>

          <v-label v-if="action === 'list'" class="text-h6 text-black mx-3">مدیریت محصولات</v-label>
          <v-label v-if="action === 'add'" class="text-h6 text-black mx-3">افزودن محصول</v-label>
          <v-label v-if="action === 'edit'" class="text-h6 text-black mx-3">ویرایش محصول</v-label>
        </v-col>

        <v-col class="text-end">

          <!--    Add Product     -->
          <v-btn class="bg-grey-darken-3 rounded-lg d-none d-sm-inline-flex"
                 :prepend-icon="action === 'add' || action === 'edit' ? 'mdi-view-list' : 'mdi-image-plus-outline'"
                 height="50"
                 @click="togglePage"
                 variant="text">
            <span v-if="action === 'add' || action === 'edit'">لیست محصولات</span>
            <span v-if="action === 'list'">افزودن محصول</span>
          </v-btn>

          <v-btn class="bg-grey-darken-3 d-inline-flex d-sm-none"
                 prepend-icon="mdi-image-plus-outline"
                 size="small"
                 @click="togglePage"
                 icon>
            <v-icon v-if="action === 'add' || action === 'edit'">mdi-view-list</v-icon>
            <v-icon v-if="action === 'list'">mdi-image-plus-outline</v-icon>
          </v-btn>

        </v-col>

      </v-row>

      <!--   Content     -->
      <v-row class="bg-white mr-1 ml-4 mt-n2 rounded-lg">

        <!--    Products List   -->
        <v-col v-if="action === 'list'" cols="12" class="pb-16">
          <v-icon class="mt-1 mr-2" color="grey">mdi-archive-outline</v-icon>
          <v-label class="text-h6 text-black mx-3">محصولات</v-label>

          <!--    loading      -->
          <Loading :loading="loading"/>

          <!--    List      -->
          <v-list class="mx-5">
            <v-list-item v-for="item in list"
                         class="rounded border-b pa-2" link>

              <!--      Image        -->
              <template v-slot:prepend>

                <v-img v-if="item.files"
                       width="100"
                       height="100"
                       max-width="100"
                       :src="staticsUrl + 'products/files/' + item.files"
                       aspect-ratio="1/1"
                       cover>
                  <template v-slot:placeholder>
                    <div class="d-flex align-center justify-center fill-height">
                      <v-progress-circular indeterminate></v-progress-circular>
                    </div>
                  </template>
                </v-img>

                <!--        Icon        -->
                <v-icon v-if="!item.files" class="mx-0" size="100">mdi-image-outline</v-icon>
              </template>


              <!--      Name        -->
              <v-list-item-title class="mr-2">
                {{ item.name }}
                <v-label class="d-block">۰ تومان</v-label>
              </v-list-item-title>

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

                <!--  Copy   -->
                <v-btn class="mx-2"
                       color="secondary"
                       size="30"
                       @click="setCopy(item)"
                       icon>
                  <v-icon size="15">mdi-content-copy</v-icon>
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

        <!--    Add|Edit Product    -->
        <v-col :class="action === 'add' ? '' : 'd-none'" cols="12" class="pb-16">
          <products-add-product ref="addProductPage" @exit="togglePage" @refresh="getProducts"/>
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
      user      : {},
      loading   : true,
      action    : 'list',
      staticsUrl: '',
      list      : [],
    }
  },
  methods: {
    getProducts() {
      this.loading = true;
      fetch(
          this.runtimeConfig.public.apiUrl + 'products', {
            method : 'get',
            headers: {
              'Content-Type' : 'application/json',
              'authorization': 'Bearer ' + this.user.token
            }
          }).then(async response => {
        response     = await response.json();
        this.list    = response;
        this.loading = false;
      });
    },
    togglePage() {
      if (this.action === 'add') this.action = 'list';
      else this.action = 'add';
    },
    async delete(_id) {
      await fetch(
          this.runtimeConfig.public.apiUrl + 'products/' + _id, {
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
          this.getProducts();
        } else {
          // show error
          $showMessage('مشکلی در عملیات پیش آمد؛ لطفا دوباره تلاش کنید', 'error');
        }
      });
    },
    async setEdit(data) {
      await fetch(
          this.runtimeConfig.public.apiUrl + 'products/' + data._id, {
            method : 'get',
            headers: {
              'Content-Type' : 'application/json',
              'authorization': 'Bearer ' + this.user.token
            }
          }).then(async response => {
        response = await response.json();
        this.$refs.addProductPage.setEdit(response);
        this.togglePage();
      });
    },
    async setCopy(data) {
      await fetch(
          this.runtimeConfig.public.apiUrl + 'products/' + data._id, {
            method : 'get',
            headers: {
              'Content-Type' : 'application/json',
              'authorization': 'Bearer ' + this.user.token
            }
          }).then(async response => {
        response = await response.json();
        this.$refs.addProductPage.setCopy(response);
        this.togglePage();
      });
    },
    setDelete(data) {
      if (confirm('آیا مطمئن هستید؟')) {
        this.delete(data._id);
      }
    }
  },
  mounted() {
    this.user = useUserStore();
    this.getProducts();
  },
  created() {
    this.staticsUrl = this.runtimeConfig.public.staticsUrl;
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