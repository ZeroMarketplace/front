<template>
  <v-dialog width="600">
    <!--   Content     -->
    <v-row class="bg-white mx-0 px-0 rounded-lg">

      <!--    Title And Action    -->
      <v-col cols="12">
        <v-row>
          <!--      Title      -->
          <v-col class="mt-2" cols="9">
            <v-icon class="mt-1 mr-2" color="green">
              mdi-human-dolly
            </v-icon>

            <v-label class="font-weight-bold mr-2">
              <span>انتقال موجودی</span>
            </v-label>
          </v-col>

          <!--     Action       -->
          <v-col class="text-end" cols="3">
          </v-col>
        </v-row>
        <v-divider class="mt-3"></v-divider>
      </v-col>
      <!--   Form   -->
      <v-col cols="12">
        <v-form :readonly="loading"
                @submit.prevent="submit"
                ref="stockTransferForm">
          <v-row>

            <!--   source Warehouse   -->
            <v-col class="" cols="12">
              <warehouses-warehouse-input class=""
                                          label="انبار مبدا"
                                          :input-rules="rules.notEmptySelectable"
                                          :items="inventory.warehouses ?? []"
                                          :preload="false"
                                          v-model="form._sourceWarehouse">
              </warehouses-warehouse-input>
            </v-col>

            <!--   destination Warehouse   -->
            <v-col class="mt-n8 mt-md-n5" cols="12">
              <warehouses-warehouse-input class=""
                                          label="انبار مقصد"
                                          :input-rules="rules.notEmptySelectable"
                                          :items="inventory.warehouses ?? []"
                                          :preload="false"
                                          v-model="form._destinationWarehouse">
              </warehouses-warehouse-input>
            </v-col>

            <!--   product   -->
            <v-col class="mt-n8 mt-md-n5" cols="12">
              <ProductInput :inputId="form._product"
                            @selected="val => onProductSelected(val)"/>
            </v-col>

            <!--   Count    -->
            <v-col class="mt-n3 mt-md-0" cols="12">
              <v-text-field class=""
                            v-model="form.count"
                            label="تعداد"
                            type="number"
                            :readonly="loading"
                            :rules="[rules.notEmpty, maxCountRule(form.totalCount)]"
                            density="compact"
                            variant="outlined">
                <template v-slot:append-inner>
                  <v-label v-if="!loading" class="mx-2 text-caption">از {{ form.totalCount }}</v-label>
                  <v-progress-circular indeterminate v-else></v-progress-circular>
                </template>
              </v-text-field>
            </v-col>

            <!--     Actions       -->
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

            </v-col>

          </v-row>
        </v-form>
      </v-col>
    </v-row>
  </v-dialog>
</template>

<script>
import ProductInput from "~/components/products/ProductInput.vue";
import {useCookie}  from "#app";

export default {
  components: {ProductInput},
  data() {
    return {
      form     : {
        _sourceWarehouse     : undefined,
        _destinationWarehouse: undefined,
        totalCount           : 0,
        count                : 0,
        _product             : '',
      },
      inventory: {},
      rules    : {
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
      loading  : false
    }
  },
  methods : {
    reset() {
      this.$refs.stockTransferForm.reset();
      this.loading = false;
      this.$forceUpdate();
    },
    async submit() {
      await this.$refs.stockTransferForm.validate();
      if (this.$refs.stockTransferForm.isValid) {
        this.loading = true;
        await fetch(
            this.runtimeConfig.public.API_BASE_URL + 'stock-transfers', {
              method : 'post',
              headers: {
                'Content-Type' : 'application/json',
                'authorization': 'Bearer ' + this.user.token
              },
              body   : JSON.stringify({
                _sourceWarehouse     : this.form._sourceWarehouse,
                _destinationWarehouse: this.form._destinationWarehouse,
                _product             : this.form._product,
                count                : Number(this.form.count)
              })
            }).then(async response => {
          if (response.status === 200) {
            response                          = await response.json();
            this.notify('عملیات با موفقیت انجام شد','success');
            this.$emit('refresh');
            this.$emit('exit');
            this.loading = false;
          } else {
            this.loading = false;
            // show error
            this.notify('مشکلی در انتقال به وجود آمد', 'error');
          }
        });
      }
    },
    onProductSelected(val) {
      this.form._product = val._id;
      this.getInventoryByProductId(val._id);
    },
    maxCountRule(count) {
      return value => {
        if (value > count) {
          return value <= count || `بیشترین تعداد قابل انتقال ${count}`;
        } else {
          return true;
        }
      };
    },
    async getInventoryByProductId(_id) {
      this.loading = true;
      await fetch(
          this.runtimeConfig.public.API_BASE_URL + 'inventories/' + _id + '?typeOfSales=retail', {
            method : 'get',
            headers: {
              'Content-Type' : 'application/json',
              'authorization': 'Bearer ' + this.user.token
            }
          }).then(
          async (response) => {
            response       = await response.json();
            this.inventory = response;
            this.setProductTotalCount();
            this.loading = false;
          }
      );
    },
    setTransfer(data) {
      this.form._product              = data._product;
      this.form._sourceWarehouse      = data._sourceWarehouse;
      this.form._destinationWarehouse = data._destinationWarehouse;
      this.form.count                 = data.count;
    },
    setProductTotalCount() {
      if (this.form._sourceWarehouse && this.inventory && this.inventory.warehouses) {
        let warehouse = this.inventory.warehouses.find(warehouse => warehouse._id === this.form._sourceWarehouse);
        if (warehouse) {
          this.form.totalCount = warehouse.count;
        }
      }
    }
  },
  computed: {
    _sourceWarehouse() {
      return this.form._sourceWarehouse;
    }
  },
  watch   : {
    _sourceWarehouse(val, oldVal) {
      this.setProductTotalCount();
    }
  },
  mounted() {
    this.user          = useCookie('user').value;
    this.runtimeConfig = useRuntimeConfig();
    const {$showMessage} = useNuxtApp();
    this.notify          = $showMessage;
  }
}
</script>

<style scoped>

</style>
