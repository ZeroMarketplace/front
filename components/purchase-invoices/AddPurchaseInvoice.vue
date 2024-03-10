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
                  item-title="title.fa"
                  item-value="id"
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
        <ProductInput v-model="product.code"/>
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
    <v-icon class="mt-1 mr-2" color="grey">mdi-plus-minus-variant</v-icon>
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
                  :key="value.id"
                  :value="value.id"
                  class="mx-2"
                  variant="outlined"
                  @click="toggleAddAndSubtract(value.id)"
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
                          :label="getAddAndSubtractDetail(item.reason).title.fa"
                          placeholder="وارد کنید"
                          :readonly="loading"
                          :rules="rules.notEmpty"
                          density="compact"
                          variant="outlined"
                          hide-details>
              <template v-slot:append-inner>
                <v-icon v-if="getAddAndSubtractDetail(item.reason).type === 'percent'">
                  mdi-percent
                </v-icon>
                <v-label v-if="getAddAndSubtractDetail(item.reason).type === 'number'">
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
import {useCookie}    from "#app";
import ProductInput   from "~/components/purchase-invoices/ProductInput.vue";

export default {
  components: {ProductInput},
  data() {
    return {
      form                  : {
        user          : null,
        dateTime      : undefined,
        warehouse     : null,
        products      : [
          {
            title   : '',
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
            items   : [],
            loading : false,
            search  : false
          }
        ],
        addAndSubtract: [],
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
        title   : '',
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
        items   : [],
        loading : false,
        search  : false
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
    toggleAddAndSubtract(id) {
      if (this.form.addAndSubtract.find(p => p.reason === id)) {
        this.form.addAndSubtract.splice(
            this.form.addAndSubtract.indexOf(this.form.addAndSubtract.find(p => p.reason === id)),
            1
        );
      } else {
        this.form.addAndSubtract.push({
          reason: id,
          value : ''
        });
      }
    },
    getAddAndSubtractDetail(id) {
      let findItem = this.addAndSubtract.find(p => p.id === id);
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
    getWarehouses() {
      this.loading = true;
      fetch(
          this.runtimeConfig.public.API_BASE_URL + 'warehouses', {
            method : 'get',
            headers: {'authorization': 'Bearer ' + this.user.token}
          }).then(async response => {
        response        = await response.json();
        this.warehouses = response.list;
        this.loading    = false;
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
    }
  },
  mounted() {
    this.user          = useCookie('user').value;
    this.runtimeConfig = useRuntimeConfig();
    this.getUsers();
    this.getWarehouses();
    this.getAddAndSubtract();
  },
  computed: {},
  watch   : {
    productSearchInput(val) {
      console.log(val);
    }
  }
}
</script>

<style scoped>
.productSearchItems {
  position: absolute;
  margin-bottom: -170px;
  z-index: 1;
  width: 17%;
  margin-right: -1%;
}
</style>