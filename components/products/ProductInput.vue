<template>
  <div>
    <v-combobox class="w-100"
                v-model="title"
                label="نام یا کد کالا"
                :readonly="loading"
                :loading="loading"
                :items="items"
                item-title="title"
                item-value="_id"
                density="compact"
                variant="outlined"
                auto-select-first="exact"
                @input="searchProduct"
                clearable
                hide-details>
      <!--   Item    -->
      <template #item="{ item, index, props }">
        <v-list-item v-bind="props">
          <template v-slot:prepend>
            <ProductImage class="ml-2"
                          :file="(item.raw.files && item.raw.files[0]) ? item.raw.files[0] : undefined"
                          :size="35"/>
          </template>
        </v-list-item>
      </template>

      <!--   Selection    -->
      <template v-slot:selection="data">
        <v-label class="text-black font-weight-bold"
                 :key="JSON.stringify(data.item)"
                 v-bind="data.attrs"
                 :disabled="data.disabled"
                 :model-value="data.selected"
                 size="small"
                 @click:close="data.parent.selectItem(data.item)">
          <ProductImage class="ml-2"
                        v-if="data.item.raw"
                        :file="(data.item.raw.files && data.item.raw.files[0]) ? data.item.raw.files[0] : undefined"
                        :size="35"/>
          {{ data.item.title }}
        </v-label>
      </template>
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
      title     : '',
      items     : [],
      properties: [],
      loading   : false,
      rules     : {
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
      this.items   = [];
      fetch(this.runtimeConfig.public.API_BASE_URL + 'products/' + this.inputId, {
        method : 'get',
        headers: {
          'Content-Type' : 'application/json',
          'authorization': 'Bearer ' + this.user.token
        }
      }).then(async (response) => {
        response = await response.json();
        this.items.push(response);
        this.items   = this.reformatProducts(this.items);
        this.title   = this.items.find(row => row._id === this.inputId);
        this.loading = false;
      });
    },
    getProperty(_id) {
      fetch(this.runtimeConfig.public.API_BASE_URL + 'properties/' + _id, {
        method : 'get',
        headers: {
          'Content-Type' : 'application/json',
          'authorization': 'Bearer ' + this.user.token
        }
      }).then(async (response) => {
        response = await response.json();
        this.properties.push(response);
      });
    },
    reformatProducts(list) {
      list.forEach((product, index) => {
        // every variant must add to list
        if (product.variants && product.variants.length > 0) {
          product.variants.forEach((variant) => {
            let additionProduct   = structuredClone(toRaw(product));
            additionProduct._id   = variant._id;
            additionProduct.code  = variant.code;
            // create title with properties
            additionProduct.title = variant.title;
            additionProduct.price = variant.price;
            // add to list
            list.push(additionProduct);
          });

          // remove original product
          list.splice(index, 1);
        }
      });

      // sort list
      list.sort((a, b) => a.title.localeCompare(b.text));

      return list;
    }
  },
  computed: {},
  watch   : {
    title(val, oldVal) {
      if (val && typeof val === 'object') {
        this.$emit('selected', val);

        // prevent preload after select
        this.preload = false;
        setTimeout(() => {
          this.preload = true;
        }, 100);
      }
    },
    inputId(val, oldVal) {
      if (this.preload && val) {
        this.getProduct();
      }
    }
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
