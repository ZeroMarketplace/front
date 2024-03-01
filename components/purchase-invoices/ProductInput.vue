<template>
  <v-text-field class="w-100"
                v-model="title"
                label="نام یا کد کالا"
                :readonly="loading"
                :loading="loading"
                :rules="rules.notEmpty"
                density="compact"
                variant="outlined"
                @input="searchProduct(index)"
                clearable>
    <template v-slot:details>
      <v-card v-if="!search" class="productSearchItems"  height="190">
        <v-card-text class="">
          <v-row>
            <v-col cols="12" md="12">

            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </template>
  </v-text-field>
</template>

<script>
export default {
  props: ['index'],
  data() {
    return {
      title  : '',
      code   : '',
      items  : [],
      search : false,
      loading: false,
      rules  : {
        notEmpty: [
          value => {
            if (value) return true;
            return 'پر کردن این فیلد اجباری است';
          }
        ]
      },
    }
  },
  methods: {
    searchProduct(index) {
      clearInterval(this.timer);

      this.timer = setTimeout(() => {

        // turn on search
        this.products[index].search = true;

        let search = new URLSearchParams();

        // code or title
        if (typeof this.products[index].title === 'number') {
          search.set('code', this.products[index].title);
        } else {
          search.set('title', this.products[index].title);
        }

        // search request
        this.products[index].loading = true;
        fetch(
            this.runtimeConfig.public.API_BASE_URL + 'products?' + search, {
              method: 'get',
            }).then(
            async (response) => {
              response                     = await response.json();
              this.products[index].items   = response.list;
              this.products[index].loading = false;
            });

      }, 800);
    },
  }
}
</script>

<style scoped>
.productSearchItems {
  position: absolute;
  margin-bottom: -168px;
  z-index: 1;
  overflow-y: scroll;
  margin-right: -15px;
  width: 320px;
}
</style>