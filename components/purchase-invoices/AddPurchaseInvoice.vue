<template>
  <v-form :readonly="loading"
          @submit.prevent="submit"
          ref="addPurchaseInvoiceForm">

    <!--    Information     -->
    <v-icon class="mt-1 mr-2" color="grey">mdi-information-outline</v-icon>
    <v-label class="text-black font-weight-bold mx-3">مشخصات فاکتور</v-label>
    <v-row class="mx-5">
      <!--   User   -->
      <v-col class="mt-md-0" cols="12" md="4">
        <v-autocomplete class="mt-3"
                        v-model="form.user"
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
        <v-select class="mt-3"
                  v-model="form.warehouse"
                  label="انبار"
                  :readonly="loading"
                  :rules="rules.notEmptySelectable"
                  :items="warehouses"
                  item-title="title"
                  item-value="_id"
                  density="compact"
                  variant="outlined">
        </v-select>
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
    <v-icon class="mt-1 mr-2" color="grey">mdi-information-outline</v-icon>
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
        <v-autocomplete class="w-100"
                        v-model="product.code"
                        label="نام یا کد کالا"
                        :readonly="loading"
                        :rules="rules.notEmptySelectable"
                        :items="[]"
                        item-title="title"
                        item-value="code"
                        density="compact"
                        variant="outlined"
                        hide-details>
        </v-autocomplete>
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
                      label="فی مصرف"
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
                      label="فی فروشگاه"
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
    <v-icon class="mt-1 mr-2" color="grey">mdi-information-outline</v-icon>
    <v-label class="text-black font-weight-bold mx-3">اضافات و کسورات</v-label>

    <!--  Add Operation   -->
    <v-btn class="border"
           @click="addProduct"
           size="30"
           variant="outlined"
           color="pink"
           icon>
      <v-icon>mdi-plus</v-icon>
    </v-btn>

    <!--  Total   -->
    <v-row class="mt-2 mx-4">

      <v-col class="" cols="12" md="6">
        <v-row>
          <!--      Complications     -->
          <v-col cols="6">
            <v-text-field class=""
                          v-model="form.complications"
                          type="number"
                          label="عوارض"
                          placeholder="وارد کنید"
                          :readonly="loading"
                          :rules="rules.notEmpty"
                          density="compact"
                          variant="outlined"
                          hide-details>
            </v-text-field>
          </v-col>

          <!--      Taxes     -->
          <v-col cols="6">
            <v-text-field class=""
                          v-model="form.taxes"
                          type="number"
                          label="مالیات"
                          placeholder="وارد کنید"
                          :readonly="loading"
                          :rules="rules.notEmpty"
                          density="compact"
                          variant="outlined"
                          hide-details>
            </v-text-field>
          </v-col>

        </v-row>
      </v-col>

      <v-col cols="12" md="6">
        <v-row class="border rounded-lg bg-grey-lighten-3 mx-0 px-5 py-2">

          <!--    Total      -->
          <v-col cols="12">
            <v-row>
              <v-col>
                جمع کل:
              </v-col>
              <v-col class="text-end">
                {{ form.total }} تومان
              </v-col>
            </v-row>
          </v-col>

          <!--    Total      -->
          <v-col cols="12">
            <v-row>
              <v-col>
                جمع کل:
              </v-col>
              <v-col class="text-end">
                {{ form.total }} تومان
              </v-col>
            </v-row>
          </v-col>

          <!--    Total      -->
          <v-col cols="12">
            <v-row>
              <v-col>
                جمع کل:
              </v-col>
              <v-col class="text-end">
                {{ form.total }} تومان
              </v-col>
            </v-row>
          </v-col>

          <!--    Total      -->
          <v-col cols="12">
            <v-row class="">
              <v-col cols="5" class="text-caption">
                جمع کل:
              </v-col>
              <v-col cols="7" class="text-end">
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
               :loading="form.loading"
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

      </v-col>
    </v-row>


  </v-form>
</template>

<script>
import {useUserStore} from "~/store/user";

export default {
  data() {
    return {
      form      : {
        user     : null,
        dateTime : undefined,
        warehouse: null,
        products : [
          {
            code    : '',
            count   : 0,
            price   : {
              purchase: 0,
              consumer: 0,
              store   : 0,
            },
            sum     : 0,
            discount: 0,
            total   : 0,
          }
        ],
        total    : 0
      },
      rules     : {
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
      users     : [],
      warehouses: [],
      loading   : false,
      action    : 'add'
    }
  },
  methods: {
    async submit() {
      if (this.$refs.addPurchaseInvoiceForm.isValid) {
        this.form.loading = true;

        if (this.action === 'add') {
          await this.add();
        } else if (this.action === 'edit') {
          await this.edit();
        }

        this.form.loading = false;
      }
    },
    addProduct() {
      this.form.products.push({
        code         : '',
        count        : 0,
        price        : {
          purchase: 0,
          consumer: 0,
          store   : 0,
        },
        sum          : 0,
        discount     : 0,
        complications: 0,
        taxes        : 0,
        total        : 0,
      });
    },
    deleteProduct(index) {
      this.form.products.splice(index, 1);
    },
    calculateInvoiceTotal() {
      this.form.total = 0;
      this.form.products.forEach((product) => {
        this.form.total += product.total;
      });
    },
    calculateProductPrices(index) {
      let product                     = this.form.products[index];
      this.form.products[index].sum   = product.count * product.price.purchase;
      this.form.products[index].total = this.form.products[index].sum;
      // this.form.products[index].total = product.sum
      //     - (product.discount * product.sum / 100) // minus discount
      this.calculateInvoiceTotal();
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
        response.forEach((user) => {
          user.title = (user.firstName && user.lastName) ? (user.firstName + ' ' + user.lastName) : user.phone;
        });

        this.users   = response;
        this.loading = false;
      });
    },
    getWarehouses() {
      this.loading = true;
      fetch(
          this.runtimeConfig.public.API_BASE_URL + 'warehouses', {
            method : 'get',
            headers: {'authorization': 'Bearer ' + this.user.token}
          }).then(async response => {
        response        = await response.json();
        this.warehouses = response;
        this.loading    = false;
      });
    },
    getProducts() {

    },
  },
  mounted() {
    this.user = useUserStore();
    this.getUsers();
    this.getWarehouses();
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