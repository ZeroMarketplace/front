<template>
  <v-row class="bg-white mr-4 mr-md-1 ml-4 rounded-lg pb-16">

    <!--    Title And Action    -->
    <v-col cols="12">
      <v-row>
        <!--      Title      -->
        <v-col class="mt-2" cols="9">
          <v-icon v-if="action === 'list'" class="mt-1 mr-2" color="grey">
            mdi-archive-outline
          </v-icon>

          <v-icon v-if="action === 'add'" class="mt-1 mr-2" color="green">
            mdi-archive-plus-outline
          </v-icon>

          <v-icon v-if="action === 'edit'" class="mt-1 mr-2" color="warning">
            mdi-archive-outline
          </v-icon>

          <v-label class="font-weight-bold mr-2">
            <span v-if="action === 'list'">محصولات</span>
            <span v-if="action === 'add'">افزودن محصول</span>
            <span v-if="action === 'edit'">ویرایش محصول</span>
          </v-label>
        </v-col>

        <!--     Action       -->
        <v-col class="text-end" cols="3">
          <v-btn class="bg-secondary"
                 size="small"
                 @click="toggleAction"
                 icon>
            <v-icon v-if="action === 'list'">mdi-archive-plus-outline</v-icon>
            <v-icon v-if="action === 'edit'">mdi-archive-outline</v-icon>
            <v-icon v-if="action === 'add'">mdi-archive-outline</v-icon>
          </v-btn>
        </v-col>
      </v-row>
      <v-divider class="mt-3"></v-divider>
    </v-col>

    <!--    Products List   -->
    <v-col v-show="action === 'list'" cols="12" class="">

      <!--    loading      -->
      <Loading :loading="loading"/>

      <!--    List      -->
      <v-list class="mx-5" v-show="list.length">
        <v-list-item v-for="item in list"
                     class="rounded border-b pa-2"
                     link>

          <!--      Image        -->
          <template v-slot:prepend>
            <ProductImage :file="(item.files && item.files[0]) ? item.files[0] : undefined" :size="100"/>
          </template>

          <!--      Name        -->
          <v-list-item-title class="mr-2">
            {{ item.name }}
            <v-label class="d-block">
              <label v-if="item.price">{{ item.price.store }} تومان</label>
              <label v-if="item.variants && item.variants.length">{{ getProductPriceRange(item) }}</label>
            </v-label>
          </v-list-item-title>

          <!--      Actions        -->
          <template v-slot:append>

            <!--  Delete   -->
            <v-btn class="mx-1"
                   color="red"
                   size="30"
                   @click="setDelete({_id: item._id})"
                   icon>
              <v-icon size="15">mdi-delete-outline</v-icon>
            </v-btn>

            <!--  Copy   -->
            <v-btn class="mx-1"
                   color="secondary"
                   size="30"
                   @click="setCopy(item)"
                   icon>
              <v-icon size="15">mdi-content-copy</v-icon>
            </v-btn>

            <!--  Edit   -->
            <v-btn class="mx-1"
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

    <!--    Add Product    -->
    <v-col v-show="(action === 'add' || action === 'edit')" cols="12">
      <products-add-product ref="addProduct" @exit="toggleAction" @refresh="getProducts"/>
    </v-col>

  </v-row>
</template>

<script>
import {useUserStore} from "~/store/user";
import ProductImage   from "~/components/products/ProductImage.vue";

definePageMeta({
  layout: "admin",
  middleware: 'auth',
  requiresAuth: true,
  requiresRole: 'admin'
});

export default {
  components: {ProductImage},
  data() {
    return {
      loading: true,
      action : 'list',
      list   : [],
    }
  },
  methods: {
    getProducts() {
      this.loading = true;
      fetch(
          this.runtimeConfig.public.API_BASE_URL + 'products', {
            method : 'get',
            headers: {
              'Content-Type' : 'application/json',
              'authorization': 'Bearer ' + this.user.token
            }
          }).then(async response => {
        response     = await response.json();
        this.list    = response.list;
        this.loading = false;
      });
    },
    toggleAction() {
      if (this.action === 'add' || this.action === 'edit')
        this.action = 'list';
      else
        this.action = this.$refs.addProduct.action;
    },
    async delete(_id) {
      await fetch(
          this.runtimeConfig.public.API_BASE_URL + 'products/' + _id, {
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
          this.runtimeConfig.public.API_BASE_URL + 'products/' + data._id, {
            method : 'get',
            headers: {
              'Content-Type' : 'application/json',
              'authorization': 'Bearer ' + this.user.token
            }
          }).then(async response => {
        response = await response.json();
        this.$refs.addProduct.setEdit(response);
        this.toggleAction();
      });
    },
    async setCopy(data) {
      await fetch(
          this.runtimeConfig.public.API_BASE_URL + 'products/' + data._id, {
            method : 'get',
            headers: {
              'Content-Type' : 'application/json',
              'authorization': 'Bearer ' + this.user.token
            }
          }).then(async response => {
        response = await response.json();
        this.$refs.addProduct.setCopy(response);
        this.toggleAction();
      });
    },
    setDelete(data) {
      if (confirm('آیا مطمئن هستید؟')) {
        this.delete(data._id);
      }
    },
    getProductPriceRange(item) {
      let min = 0, max = 0;
      item.variants.forEach((variant) => {
        if(variant.price) {
          // first measuring
          if(min === 0)
            min = variant.price.store;

          if(variant.price.store >= max)
            max = variant.price.store;
          if(variant.price.store <= min)
            min = variant.price.store;
        }
      });
      if(min === 0 && max === 0) {
        return 'قیمت ندارد';
      } else if(min === max) {
        return min + ' تومان';
      } else {
        return 'از ' + min + ' تا ' + max + ' تومان';
      }
    }
  },
  mounted() {
    this.user = useCookie('user').value;
    this.getProducts();
  },
  created() {
    this.runtimeConfig = useRuntimeConfig();
  },
  computed: {}
}
</script>


<style scoped>

</style>
