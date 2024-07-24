<template>
  <v-form :readonly="loading"
          @submit.prevent="submit"
          ref="addPurchaseInvoiceForm">

    <!--  Settlement Dialog  -->
    <SettlementDialog v-model="settlementDialog"
                      :_id="settlementId"
                      type="purchase-invoices"
                      @exit="closeSettlementDialog"
                      ref="settlementDialog"/>

    <!--    Information     -->
    <v-icon class="mt-1 mr-2" color="grey">mdi-information-outline</v-icon>
    <v-label class="text-black font-weight-bold mx-3">مشخصات فاکتور</v-label>
    <v-row class="mx-5">
      <!--   User   -->
      <v-col class="mt-md-0" cols="12" md="4">
        <v-autocomplete class="mt-3"
                        v-model="form.customer"
                        label="کاربر"
                        :readonly="loading"
                        :rules="rules.notEmptySelectable"
                        :items="users"
                        item-title="title"
                        item-value="_id"
                        density="compact"
                        variant="outlined">
        </v-autocomplete>
      </v-col>

      <!--   Date   -->
      <v-col class="mt-n8 mt-md-0" cols="12" md="4">

        <v-text-field id="customDatePickerInput"
                      class="mt-3"
                      v-model="form.dateTime"
                      :readonly="loading"
                      :rules="rules.notEmpty"
                      label="تاریخ و ساعت"
                      density="compact"
                      variant="outlined">
        </v-text-field>

        <PersianDatePicker v-model="form.dateTime"
                           color="#424242"
                           custom-input="#customDatePickerInput"
                           lang="fa"
                           type="datetime"
                           format="YYYY-MM-DD HH:mm:ss"
                           display-format="dddd jDD jMMMM jYYYY">
        </PersianDatePicker>
      </v-col>

      <!--   Warehouse   -->
      <v-col class="mt-n8 mt-md-0" cols="12" md="4">
        <warehouses-warehouse-input class="mt-3"
                                    :input-rules="rules.notEmptySelectable"
                                    v-model="form.warehouse">
        </warehouses-warehouse-input>
      </v-col>

      <!--   Description   -->
      <v-col class="mt-n8" cols="12" md="12">
        <v-text-field class="mt-3"
                      v-model="form.description"
                      :readonly="loading"
                      label="توضیحات"
                      density="compact"
                      variant="outlined">
        </v-text-field>
      </v-col>

    </v-row>

    <v-divider class="my-5"></v-divider>

    <!--    Products     -->
    <v-icon class="mt-1 mr-2" color="grey">mdi-archive-outline</v-icon>
    <v-label class="text-black font-weight-bold mx-3">اقلام فاکتور</v-label>

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
    <v-row class="border rounded-lg mx-5 mt-3 mb-2 pt-1 pb-2" v-for="(product,index) in form.products">

      <!--  Product Name    -->
      <v-col class="pa-1 mt-2" cols="12" md="3">
        <ProductInput :inputId="product._id"
                      @selected="val => onProductSelected(val,index)"/>
      </v-col>

      <!--   Count    -->
      <v-col class="pa-1 mt-2" cols="12" md="1">
        <v-text-field class=""
                      v-model="product.count"
                      @input="calculateProductPrices(index)"
                      label="تعداد"
                      type="number"
                      :readonly="loading"
                      :rules="rules.notEmpty"
                      density="compact"
                      variant="outlined"
                      hide-details>
        </v-text-field>
      </v-col>

      <!--   Purchase Price    -->
      <v-col class="pa-1 mt-2" cols="12" md="2">
        <v-text-field class=""
                      v-model="product.price.purchase"
                      @input="calculateProductPrices(index)"
                      label="فی خرید"
                      type="number"
                      :readonly="loading"
                      :rules="rules.notEmpty"
                      density="compact"
                      variant="outlined"
                      hide-details>
        </v-text-field>
      </v-col>

      <!--   Consumer Price    -->
      <v-col class="pa-1 mt-2" cols="12" md="2">
        <v-text-field class=""
                      v-model="product.price.consumer"
                      type="number"
                      :label="'فی مصرف' + (product.profitPercent ? '(%'+product.profitPercent+')' : '')"
                      :readonly="loading"
                      :rules="rules.notEmpty"
                      density="compact"
                      variant="outlined"
                      hide-details>
        </v-text-field>
      </v-col>

      <!--   Store Price    -->
      <v-col class="pa-1 mt-2" cols="12" md="2">
        <v-text-field class=""
                      v-model="product.price.store"
                      :label="'فی فروشگاه' + (product.profitPercent ? '(%'+product.profitPercent+')' : '')"
                      type="number"
                      :readonly="loading"
                      :rules="rules.notEmpty"
                      density="compact"
                      variant="outlined"
                      hide-details>
        </v-text-field>
      </v-col>

      <!--  Total  -->
      <v-col class="pa-1 text-caption text-center pt-2" cols="12" md="1">
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

    <!--    Additions and subtractions     -->
    <v-icon class="mt-1 mr-2" color="grey">mdi-plus-minus-variant</v-icon>
    <v-label class="text-black font-weight-bold mx-3">اضافات و کسورات</v-label>

    <!--  Add Operation   -->
    <nuxt-link target="_blank" to="/add-and-subtract">
      <v-btn class="border"
             size="30"
             variant="outlined"
             color="pink"
             icon>
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </nuxt-link>

    <!--  Add-And-Subtract & Total   -->
    <v-row class="mt-2 mx-4">

      <!--   Add-And-Subtract    -->
      <v-col class="" cols="12" md="6">
        <!--   Chips     -->
        <v-chip-group v-model="selectedAddAndSubtract"
                      class="overflow-hidden my-5 my-md-0"
                      column
                      multiple>
          <v-chip v-for="(value) in addAndSubtract"
                  :key="value._id"
                  :value="value._id"
                  class="mx-2"
                  variant="outlined"
                  @click="toggleAddAndSubtract(value._id)"
                  filter>

            {{ value.title.fa }}

          </v-chip>
        </v-chip-group>

        <!--   Inputs for Add and Subtract    -->
        <v-row class="my-5 my-md-2">
          <!--      Add And Subtract     -->
          <v-col v-for="item in form.addAndSubtract" cols="12" md="8">
            <v-text-field class=""
                          v-model="item.value"
                          type="number"
                          placeholder="وارد کنید"
                          :label="getAddAndSubtractDetail(item._reason).title.fa"
                          :readonly="loading"
                          :rules="rules.notEmpty"
                          @input="calculateInvoiceTotal"
                          density="compact"
                          variant="outlined"
                          hide-details>
              <template v-slot:append-inner>
                <v-icon v-if="Number(item.value) <= 100">
                  mdi-percent
                </v-icon>
                <v-label v-else>
                  تومان
                </v-label>
              </template>
            </v-text-field>
          </v-col>

        </v-row>
      </v-col>

      <!--   Total   -->
      <v-col cols="12" md="6">
        <v-row class="border rounded-lg bg-grey-lighten-3 mx-0 px-5 py-2">
          <!--    Total      -->
          <v-col cols="12">
            <v-row class="">
              <v-col cols="5" class="">
                کل:
              </v-col>
              <v-col cols="7" class="text-end">
                {{ form.total }} تومان
              </v-col>
            </v-row>
          </v-col>

          <!--    add and subtract      -->
          <v-col class="my-md-2" v-for="addAndSubtract in form.addAndSubtract" cols="12">
            <v-row class="">
              <v-col cols="5" class="">
                {{ getAddAndSubtractDetail(addAndSubtract._reason).title.fa }}:
              </v-col>
              <v-col cols="7" class="text-end">
                {{ addAndSubtract.amount }} تومان
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
                {{ form.sum }} تومان
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
      settlementDialog      : false,
      settlementId          : '',
      form                  : {
        _id           : '',
        customer      : null,
        dateTime      : new Date(),
        warehouse     : null,
        description   : '',
        products      : [],
        addAndSubtract: [],
        sum           : 0,
        total         : 0
      },
      rules                 : {
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
      users                 : [],
      warehouses            : [],
      addAndSubtract        : [],
      selectedAddAndSubtract: [],
      productSearchTimer    : undefined,
      productSearchInput    : '',
      loading               : false,
      action                : 'add'
    }
  },
  methods: {
    reset() {
      this.$refs.addPurchaseInvoiceForm.reset();
      this.form._id               = '';
      this.form.sum               = 0;
      this.form.total             = 0;
      this.form.products          = [];
      this.form.addAndSubtract    = [];
      this.selectedAddAndSubtract = [];
      this.loading                = false;
      this.action                 = 'add';
      this.$forceUpdate();
    },
    async add() {

      // convert numbers
      this.form.products.forEach((product) => {
        product.price.purchase = Number(product.price.purchase);
        product.price.consumer = Number(product.price.consumer);
        product.price.store    = Number(product.price.store);
        product.count          = Number(product.count);
      });

      await fetch(
          this.runtimeConfig.public.API_BASE_URL + 'purchase-invoices', {
            method : 'post',
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
          response = await response.json();
          this.setEdit(response);
          this.setSettlement();
        } else {
          // show error
          $showMessage('مشکلی در عملیات پیش آمد؛ لطفا دوباره تلاش کنید', 'error');
        }
      });
    },
    async edit() {

      // convert numbers
      this.form.products.forEach((product) => {
        product.price.purchase = Number(product.price.purchase);
        product.price.consumer = Number(product.price.consumer);
        product.price.store    = Number(product.price.store);
        product.count          = Number(product.count);
      });

      await fetch(
          this.runtimeConfig.public.API_BASE_URL + 'purchase-invoices/' + this.form._id, {
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
      if (this.$refs.addPurchaseInvoiceForm.isValid) {
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
        _id  : '',
        count: 0,
        price: {
          purchase: 0,
          consumer: 0,
          store   : 0,
        },
        sum  : 0,
        total: 0
      });
    },
    async onProductSelected(val, index) {
      this.form.products[index]['_id'] = val._id;
      this.getCategory(val._categories[0]).then(category => {
        if (category.profitPercent)
          this.form.products[index].profitPercent = category.profitPercent;
      });
    },
    deleteProduct(index) {
      this.form.products.splice(index, 1);
    },
    calculateInvoiceTotal() {
      this.form.total = 0;

      // calc products price
      this.form.products.forEach((product) => {
        this.form.total += product.total;
      });

      this.form.sum = this.form.total;

      // calc subtracts on total
      this.form.addAndSubtract.forEach((addAndSubtract) => {
        let detailAddAndSubtract = this.getAddAndSubtractDetail(addAndSubtract._reason);
        if (detailAddAndSubtract) {
          if (detailAddAndSubtract.operation === 'subtract') {
            let operationSum = 0;
            if (Number(addAndSubtract.value) <= 100) {
              operationSum = (this.form.total * addAndSubtract.value / 100)
              this.form.sum -= operationSum;
            } else {
              operationSum = Number(addAndSubtract.value);
              this.form.sum -= addAndSubtract.value;
            }
            addAndSubtract.amount = operationSum;
          }
        }
      });

      // add and subtract
      this.form.addAndSubtract.forEach((addAndSubtract) => {
        let detailAddAndSubtract = this.getAddAndSubtractDetail(addAndSubtract._reason);
        if (detailAddAndSubtract) {
          if (detailAddAndSubtract.operation === 'add') {
            let operationSum = 0;
            if (Number(addAndSubtract.value) <= 100) {
              operationSum = (this.form.sum * addAndSubtract.value / 100)
              this.form.sum += operationSum;
            } else {
              operationSum = Number(addAndSubtract.value);
              this.form.sum += addAndSubtract.value;
            }
            addAndSubtract.amount = operationSum;
          }
        }
      });
    },
    calculateProductPrices(index) {
      let product                     = this.form.products[index];
      this.form.products[index].sum   = product.count * product.price.purchase;
      this.form.products[index].total = this.form.products[index].sum;

      // calc profit percentage
      if (this.form.products[index].profitPercent) {
        // consumer price
        this.form.products[index].price.consumer = Number(this.form.products[index].price.purchase) +
            (Number(this.form.products[index].price.purchase) * Number(this.form.products[index].profitPercent) / 100);

        // store price
        this.form.products[index].price.store = Number(this.form.products[index].price.purchase) +
            (Number(this.form.products[index].price.purchase) * Number(this.form.products[index].profitPercent) / 100);
      } else {
        // consumer price
        this.form.products[index].price.consumer = this.form.products[index].price.purchase;

        // store price
        this.form.products[index].price.store = this.form.products[index].price.purchase;
      }

      // this.form.products[index].total = product.sum
      //     - (product.discount * product.sum / 100) // minus discount
      this.calculateInvoiceTotal();
    },
    toggleAddAndSubtract(_id) {
      if (this.form.addAndSubtract.find(p => p._reason === _id)) {
        this.form.addAndSubtract.splice(
            this.form.addAndSubtract.indexOf(this.form.addAndSubtract.find(p => p._reason === _id)),
            1
        );
      } else {
        let addAndSubtract = this.getAddAndSubtractDetail(_id);
        this.form.addAndSubtract.push({
          _reason: _id,
          value  : addAndSubtract.default,
          sum    : 0
        });
      }

      this.calculateInvoiceTotal();
    },
    getAddAndSubtractDetail(_id) {
      let findItem = this.addAndSubtract.find(p => p._id === _id);
      if (findItem) {
        return findItem;
      } else {
        return '';
      }
    },
    getUsers() {
      this.loading = true;
      fetch(
          this.runtimeConfig.public.API_BASE_URL + 'users', {
            method : 'get',
            headers: {'authorization': 'Bearer ' + this.user.token}
          }).then(async response => {
        response = await response.json();

        // set title of users
        response.list.forEach((user) => {
          user.title = (user.firstName && user.lastName) ? (user.firstName + ' ' + user.lastName) : user.phone;
        });

        this.users   = response.list;
        this.loading = false;
      });
    },
    getAddAndSubtract() {
      this.loading = true;
      fetch(
          this.runtimeConfig.public.API_BASE_URL + 'add-and-subtract', {
            method : 'get',
            headers: {'authorization': 'Bearer ' + this.user.token}
          }).then(async response => {
        response            = await response.json();
        this.addAndSubtract = response.list;
        this.loading        = false;
      });
    },
    getCategory(_id) {
      return new Promise((resolve, reject) => {
        fetch(
            this.runtimeConfig.public.API_BASE_URL + 'categories/' + _id, {
              method: 'get'
            }).then(async response => {
          response = await response.json();
          return resolve(response);
        });
      });
    },
    setEdit(data) {
      if (this.form._id !== data._id) {
        this.reset();

        this.form.customer       = data._customer;
        this.form.dateTime       = data.dateTime;
        this.form.warehouse      = data._warehouse;
        this.form.description    = data.description;
        this.form.products       = data.products;
        this.form.addAndSubtract = data.AddAndSub;

        // add and subtract
        data.AddAndSub.forEach((addAndSub) => {
          this.selectedAddAndSubtract.push(addAndSub._reason);
        });

        // _id and action
        this.form._id = data._id;
        this.action   = 'edit';
        setTimeout(() => {
          this.$forceUpdate();
        }, 2500);

        this.calculateInvoiceTotal();
      }
    },
    setSettlement() {
      this.settlementId     = this.form._id;
      this.settlementDialog = true;
    },
    closeSettlementDialog() {
      this.settlementDialog = false;
      this.$emit('exit', true);
      this.$emit('refresh', true);
    }
  },
  mounted() {
    this.user          = useCookie('user').value;
    this.runtimeConfig = useRuntimeConfig();
    this.getUsers();
    this.getAddAndSubtract();
  },
  computed: {},
  watch   : {}
}
</script>

<style scoped>

</style>
