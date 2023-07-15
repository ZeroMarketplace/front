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
          <v-btn class="d-none d-sm-inline-flex"
                 prepend-icon="mdi-arrow-right"
                 color="secondary"
                 size="small"
                 variant="flat"
                 rounded>
            بازگشت
          </v-btn>

          <v-label v-if="action === 'list'" class="text-h6 text-black mx-3">مدیریت محصولات</v-label>
          <v-label v-if="action === 'add'" class="text-h6 text-black mx-3">افزودن محصول</v-label>
        </v-col>

        <v-col class="text-end">

          <!--    Add Product     -->
          <v-btn class="bg-grey-darken-3 rounded-lg d-none d-sm-inline-flex"
                 prepend-icon="mdi-image-plus-outline"
                 height="50"
                 variant="text">
            افزودن محصول
          </v-btn>

          <v-btn class="bg-grey-darken-3 d-inline-flex d-sm-none"
                 prepend-icon="mdi-image-plus-outline"
                 size="small"
                 icon>
            <v-icon>mdi-image-plus-outline</v-icon>
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
          <v-list class="">
            <v-list-item v-for="item in list"
                         class="rounded border-b pa-2" link>

              <!--      Title        -->
              <v-list-item-title>{{ item.title }}</v-list-item-title>

              <!--      Actions        -->
              <template v-slot:append>

                <!--  Delete   -->
                <v-btn class="mx-2"
                       color="red"
                       size="25"
                       @click="setDelete({_id: item._id})"
                       icon>
                  <v-icon size="15">mdi-delete-outline</v-icon>
                </v-btn>

                <!--  Edit   -->
                <v-btn class="mx-2"
                       color="secondary"
                       size="25"
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
        <v-col v-if="action === 'add'" cols="12" class="pb-16">
          <manage-products-add-product />
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
      action : 'add',
      list   : [],
    }
  },
  methods: {
    async getProducts() {
      this.loading = true;
      await fetch(
          this.runtimeConfig.public.apiUrl + 'units', {
            method : 'get',
            headers: {
              'Content-Type' : 'application/json',
              'authorization': 'Bearer ' + this.user.token
            }
          }).then(async response => {
        response  = await response.json();
        this.list = response;
      });
      this.loading = false;
    },
    setEdit(data) {
      this.form = {
        title  : data.title,
        titleEn: data.titleEn,
        action : 'edit',
        _id    : data._id
      };
    },
    setDelete(data) {
      if (confirm('آیا مطمئن هستید؟')) {
        this.delete(data._id);
      }
    },
    setParent(data) {
      this.form._parent      = data._id;
      this.form._parentTitle = data.title;
    },
  },
  mounted() {
    this.user = useUserStore();
    // this.getProducts();
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