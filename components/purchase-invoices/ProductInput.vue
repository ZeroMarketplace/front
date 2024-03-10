<template>
  <v-combobox class="w-100"
              v-model="title"
              label="نام یا کد کالا"
              :readonly="loading"
              :loading="loading"
              :items="items"
              item-title="title"
              item-value="code"
              density="compact"
              variant="outlined"
              @input="searchProduct"
              return-object
              clearable>
    <template #item="{ item, index }">
      <v-list-item link @click="selectProduct(index)">

        <template v-slot:prepend>
          <ProductImage class="ml-2" :files="item.files" :size="35"/>
        </template>

        <v-list-item-title>
          {{ item.title }}
        </v-list-item-title>

      </v-list-item>
    </template>

    <template #selection="{item,index}">
      <ProductImage v-if="item.files" class="ml-2" :files="item.files" :size="25"/>
      {{ item.title }}
    </template>
  </v-combobox>
</template>

<script>
import {useCookie}  from "#app";
import ProductImage from "~/components/products/ProductImage.vue";

export default {
  components: {ProductImage},
  data() {
    return {
      title  : '',
      code   : '',
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
  methods: {
    selectProduct(index) {
      this.title = this.items[index].title;
      this.title = this.items[index];
    },
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
              this.items   = response.list;
              this.loading = false;
            });

      }, 800);
    },
  },
  mounted() {
    this.user          = useCookie('user').value;
    this.runtimeConfig = useRuntimeConfig();
  }
}
</script>

<style scoped>

</style>