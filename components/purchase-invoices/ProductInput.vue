<template>
  <div>
    <v-combobox class="w-100"
                v-model="title"
                label="نام یا کد کالا"
                :readonly="loading"
                :loading="loading"
                :items="items"
                item-title="title"
                item-value="id"
                density="compact"
                variant="outlined"
                @input="searchProduct"
                clearable
                hide-details>
      <!--    <template #item="{ item, index }">-->
      <!--      <v-list-item link @click="selectProduct(index)">-->

      <!--        <template v-slot:prepend>-->
      <!--          <ProductImage class="ml-2" :files="item.files" :size="35"/>-->
      <!--        </template>-->

      <!--        <v-list-item-title>-->
      <!--          {{ item.title }}-->
      <!--        </v-list-item-title>-->

      <!--      </v-list-item>-->
      <!--    </template>-->

      <!--    <template #selection="{item,index}">-->
      <!--      <ProductImage v-if="item.files" class="ml-2" :files="item.files" :size="25"/>-->
      <!--      {{ item.title }}-->
      <!--    </template>-->
    </v-combobox>
  </div>
</template>

<script>
import {useCookie}  from "#app";
import ProductImage from "~/components/products/ProductImage.vue";

export default {
  components: {ProductImage},
  props     : ['inputId'],
  data() {
    return {
      title  : '',
      items  : [],
      loading: false,
      rules  : {
        notEmptySelectable: [
          value => {
            if (value) return true;
            return 'لطفا انتخاب کنید';
          }
        ]
      }
    }
  },
  methods : {
    searchProduct() {
      clearInterval(this.timer);

      this.timer = setTimeout(() => {

        let search = new URLSearchParams();

        // code or title
        if (typeof this.title === 'number') {
          search.set('code', this.title);
        } else {
          search.set('title', this.title);
        }

        // search request
        this.loading = true;
        fetch(
            this.runtimeConfig.public.API_BASE_URL + 'products?' + search, {
              method: 'get',
            }).then(
            async (response) => {
              response     = await response.json();
              this.items   = this.reformatProducts(response.list);
              this.loading = false;
            });

      }, 800);
    },
    getProduct() {
      this.loading = true;
      fetch(this.runtimeConfig.public.API_BASE_URL + 'products/' + this.inputId, {
        method : 'get',
        headers: {
          'Content-Type' : 'application/json',
          'authorization': 'Bearer ' + this.user.token
        }
      }).then(async (response) => {
        response = await response.json();
        this.items.push(response);
        this.title   = response;
        this.loading = false;
      });
    },
    reformatProducts(list) {
      list.forEach((product) => {
        // every variant must add to list
        product.variants.forEach((variant) => {
          let additionProduct  = structuredClone(product);
          additionProduct._id  = variant._id;
          additionProduct.code = variant.code;

          // create title with properties
          additionProduct.title = product.title + ' | ';
          variant.properties.forEach((property, index) => {
            additionProduct.title += property._property.values.find(value => value.code === property.value).title;
            if (variant.properties.length !== (index + 1)) {
              additionProduct.title += ' | ';
            }
          });

          // add to list
          list.push(additionProduct);
        });
      });
      return list;
    }
  },
  computed: {},
  watch   : {
    title(val, oldVal) {
      if (val && typeof val === 'object') {
        this.$emit('selected', val);
      }
    },
  },
  mounted() {
    this.user          = useCookie('user').value;
    this.runtimeConfig = useRuntimeConfig();
    if (this.inputId) {
      this.getProduct();
    }
  }
}
</script>

<style scoped>

</style>