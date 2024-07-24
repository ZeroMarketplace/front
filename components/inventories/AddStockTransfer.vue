<template>
  <v-form :readonly="loading"
          @submit.prevent="submit"
          ref="stockTransfersForm">

    <!--    Information     -->
    <v-icon class="mt-1 mr-2" color="grey">mdi-information-outline</v-icon>
    <v-label class="text-black font-weight-bold mx-3">مشخصات انتقال</v-label>
    <v-row class="mx-5">

      <!--   Warehouse   -->
      <v-col class="" cols="12" md="4">
        <warehouses-warehouse-input class="mt-3"
                                    label="انبار مبدا"
                                    :input-rules="rules.notEmptySelectable"
                                    v-model="form.sourceWarehouse">
        </warehouses-warehouse-input>
      </v-col>

      <!--   Warehouse   -->
      <v-col class="mt-n8 mt-md-0" cols="12" md="4" offset-md="1">
        <warehouses-warehouse-input class="mt-3"
                                    label="انبار مقصد"
                                    :input-rules="rules.notEmptySelectable"
                                    v-model="form.destinationWarehouse">
        </warehouses-warehouse-input>
      </v-col>

    </v-row>

    <v-divider class="my-5"></v-divider>

    <!--    Products     -->
    <v-icon class="mt-1 mr-2" color="grey">mdi-archive-outline</v-icon>
    <v-label class="text-black font-weight-bold mx-3">اقلام انتقال</v-label>

    <!--  Add Product   -->
    <v-btn class="border"
           @click="addProduct"
           size="30"
           variant="outlined"
           color="pink"
           icon>
      <v-icon>mdi-plus</v-icon>
    </v-btn>

    <!-- Products List is Empty -->
    <div v-if="!form.products.length" class="d-flex justify-center w-100 my-16">
      <v-label>اقلامی ندارد</v-label>
    </div>

    <!--  Products List   -->
    <v-row class="border mr-md-8 rounded-lg mx-5 mt-3 mb-2 pt-1 pb-2" v-for="(product,index) in form.products">

      <!--  Product Name    -->
      <v-col class="pa-1 mt-2" cols="12" md="3">
        <ProductInput :inputId="product._id"
                      @selected="val => onProductSelected(val,index)"/>
      </v-col>

      <!--   Count    -->
      <v-col class="pa-1 mt-2" cols="12" md="2">
        <v-text-field class=""
                      v-model="product.count"
                      @input="calculateProductTotal(index)"
                      label="تعداد"
                      type="number"
                      :readonly="loading"
                      :rules="[rules.notEmpty, maxCountRule(product.totalCount)]"
                      density="compact"
                      variant="outlined"
                      hide-details>
          <template v-slot:append-inner>
            <v-label class="mx-2">از {{ product.totalCount }}</v-label>
          </template>
        </v-text-field>
      </v-col>

      <!--   Sales Price    -->
      <v-col class="pa-1 mt-2" cols="12" md="3">
        <v-text-field class=""
                      v-model="product.price"
                      label="قیمت واحد"
                      :rules="rules.notEmpty"
                      density="compact"
                      variant="outlined"
                      readonly
                      hide-details>
        </v-text-field>
      </v-col>

      <!--  Total  -->
      <v-col class="pa-1 text-caption text-center pt-2" cols="12" offset-md="1" md="2">
        <p>جمع کل</p>
        {{ product.total }}
      </v-col>


      <!--  Actions  -->
      <v-col class="pt-4" cols="12" md="1">
        <!--  Delete Product   -->
        <v-btn class="bg-white float-end"
               @click="deleteProduct(index)"
               size="30"
               variant="outlined"
               color="pink"
               icon>
          <v-icon>mdi-delete</v-icon>
        </v-btn>
      </v-col>

    </v-row>

    <v-divider class="mt-8 mb-4"></v-divider>

    <!--  Total   -->
    <v-row class="mt-2 mx-4">
      <!--   Total   -->
      <v-col cols="12" md="6" offset-md="6">
        <v-row class="border rounded-lg bg-grey-lighten-3 mx-0 px-5 py-2">

          <!--    Total Count      -->
          <v-col cols="12">
            <v-row class="">
              <v-col cols="5" class="font-weight-bold">
                جمع تعداد:
              </v-col>
              <v-col cols="7" class="text-end font-weight-bold">
                {{ form.totalCount }}
              </v-col>
            </v-row>
          </v-col>

          <!--    Total      -->
          <v-col cols="12">
            <v-row class="">
              <v-col cols="5" class="font-weight-bold">
                جمع کل:
              </v-col>
              <v-col cols="7" class="text-end font-weight-bold">
                {{ form.total }} تومان
              </v-col>
            </v-row>
          </v-col>

        </v-row>
      </v-col>
    </v-row>

    <!--     Actions       -->
    <v-row class="mt-10 mx-1">
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

        <!--       Settlement       -->
        <v-btn class="border mx-2 rounded-lg"
               v-if="action === 'edit'"
               color="blue"
               prepend-icon="mdi-cash-fast"
               height="40"
               width="100"
               variant="text"
               @click="setSettlement"
               density="compact">
          تسویه
        </v-btn>

      </v-col>
    </v-row>


  </v-form>
</template>

<script>
import {useUserStore} from "~/store/user";
import {useCookie}    from "#app";
import ProductInput   from "~/components/products/ProductInput.vue";

export default {
  components: {ProductInput},
  data() {
    return {
      form   : {
        _id                 : '',
        sourceWarehouse     : null,
        destinationWarehouse: null,
        products            : [],
        totalCount          : 0,
        total               : 0
      },
      rules  : {
        notEmpty          : [
          value => {
            if (value) return true;
            return 'پر کردن این فیلد اجباری است';
          }
        ],
        notEmptySelectable: [
          value => {
            if (value) return true;
            return 'لطفا انتخاب کنید';
          }
        ],
      },
      loading: false,
      action : 'add'
    }
  },
  methods: {
    reset() {
      this.$refs.stockTransfersForm.reset();
      this.form._id        = '';
      this.form.totalCount = 0;
      this.form.total      = 0;
      this.form.products   = [];
      this.loading         = false;
      this.action          = 'add';
      this.$forceUpdate();
    },
    async add() {

      // convert numbers and create products array
      let products = [];
      this.form.products.forEach((product) => {
        products.push({
          _id  : product._id,
          count: Number(product.count)
        });
      });

      await fetch(
          this.runtimeConfig.public.API_BASE_URL + 'stock-transfers', {
            method : 'post',
            headers: {
              'Content-Type' : 'application/json',
              'authorization': 'Bearer ' + this.user.token
            },
            body   : JSON.stringify({
              sourceWarehouse     : this.form.sourceWarehouse,
              destinationWarehouse: this.form.destinationWarehouse,
              products            : products
            })
          }).then(async response => {
        const {$showMessage} = useNuxtApp();
        if (response.status === 200) {
          $showMessage('عملیات با موفقت انجام شد', 'success');
          response = await response.json();
        } else {
          // show error
          $showMessage('مشکلی در عملیات پیش آمد؛ لطفا دوباره تلاش کنید', 'error');
        }
      });
    },
    async edit() {

      // convert numbers and create products array
      let products = [];
      this.form.products.forEach((product) => {
        products.push({
          _id  : product._id,
          count: Number(product.count)
        });
      });

      await fetch(
          this.runtimeConfig.public.API_BASE_URL + 'sales-invoices/' + this.form._id, {
            method : 'put',
            headers: {
              'Content-Type' : 'application/json',
              'authorization': 'Bearer ' + this.user.token
            },
            body   : JSON.stringify({
              customer   : this.form.customer,
              dateTime   : this.form.dateTime,
              warehouse  : this.form.warehouse,
              description: this.form.description,
              products   : this.form.products,
              AddAndSub  : this.form.addAndSubtract,
            })
          }).then(async response => {
        const {$showMessage} = useNuxtApp();
        if (response.status === 200) {
          $showMessage('عملیات با موفقت انجام شد', 'success');

          // reset form
          this.reset();

          // refresh list
          this.$emit('exit');
          setTimeout(() => {
            this.$emit('refresh');
          }, 500)
        } else {
          // show error
          $showMessage('مشکلی در عملیات پیش آمد؛ لطفا دوباره تلاش کنید', 'error');
        }
      });
    },
    async submit() {
      if (this.$refs.stockTransfersForm.isValid) {
        this.loading = true;

        if (this.action === 'add') {
          await this.add();
        } else if (this.action === 'edit') {
          await this.edit();
        }

        this.loading = false;
      }
    },
    addProduct() {
      this.form.products.push({
        _id       : '',
        count     : 0,
        totalCount: 0,
        price     : 0,
        total     : 0,
        loading   : false
      });
    },
    async onProductSelected(val, index) {
      this.form.products[index]['_id'] = val._id;
      // set product price
      if (val.price)
        this.form.products[index]['price'] = val.price.consumer;
      else
        this.form.products[index]['price'] = 0;

      if(val._id) {
        this.form.products[index]['loading'] = true;
        await this.getInventoryByProductId(val._id);
        this.form.products[index]['loading'] = false;
      }

      this.calculateProductTotal(index);
    },
    async getInventoryByProductId(_id) {
      await fetch(
          this.runtimeConfig.public.API_BASE_URL + 'inventories/' + _id, {
            method : 'get',
            headers: {
              'Content-Type' : 'application/json',
              'authorization': 'Bearer ' + this.user.token
            }
          }).then(async response => {
        response       = await response.json();
        console.log(response);
      });
    },
    deleteProduct(index) {
      this.form.products.splice(index, 1);
    },
    calculateInvoiceTotal() {
      this.form.total      = 0;
      this.form.totalCount = 0;

      // calc products price
      this.form.products.forEach((product) => {
        this.form.total += product.total;
        this.form.totalCount += Number(product.count);
      });

    },
    calculateProductTotal(index) {
      let product                     = this.form.products[index];
      this.form.products[index].total = product.count * product.price;
      this.calculateInvoiceTotal();
    },
    maxCountRule(count) {
      return value => {
        if (value > count) {
          return value <= count || `بیشترین تعداد قابل انتقال ${count}`;
        } else {
          return true;
        }
      };
    }
  },
  mounted() {
    this.user          = useCookie('user').value;
    this.runtimeConfig = useRuntimeConfig();
  },
  computed: {},
  watch   : {}
}
</script>

<style scoped>

</style>
