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
              mdi-receipt-text-outline
            </v-icon>

            <v-label class="font-weight-bold mr-2">
              <span>تسویه حساب</span>
            </v-label>
          </v-col>

          <!--     Action       -->
          <v-col v-if="form.window !== 1" class="text-end" cols="3">
            <v-btn class="" @click="form.window = 1" icon>
              <v-icon>mdi-arrow-left</v-icon>
            </v-btn>
          </v-col>
        </v-row>
        <v-divider class="mt-3"></v-divider>
      </v-col>

      <!--  Window Content    -->
      <v-window v-model="form.window" class="w-100">
        <v-form :readonly="loading"
                @submit.prevent="submit"
                ref="settlementForm">

          <!--   Settlement Form    -->
          <v-window-item :value="1">
            <v-col class="ma-0 pa-0" cols="12">

              <!--    Information     -->
              <v-row class="mx-2">

                <!--   Amount   -->
                <v-col class="d-flex" cols="12" md="12">
                  <v-label class="d-inline-block mx-2 mt-4">مبلغ:</v-label>
                  <v-text-field class="font-weight-bold text-secondary"
                                v-model="form.amount"
                                variant="solo-filled"
                                readonly>
                  </v-text-field>
                </v-col>

              </v-row>

              <v-divider></v-divider>

              <!--    Accounts     -->
              <v-row class="mx-2">

                <!--        Loading for accounts        -->
                <v-row v-if="!accounts.length" class="d-flex justify-center my-8">
                  <v-progress-circular indeterminate>
                  </v-progress-circular>
                </v-row>

                <!--   Cash Amount   -->
                <v-col class="d-flex mt-5"
                       cols="12"
                       md="12">
                  <v-label class="d-inline-block mx-7 mt-2">نقد:</v-label>
                  <v-text-field class=""
                                v-model="form.payment.cash"
                                :readonly="form.payment.distributedCash"
                                @click:append="form.window = 2"
                                append-icon="mdi-cash-multiple"
                                type="number"
                                density="compact"
                                variant="outlined">
                  </v-text-field>
                </v-col>

                <!--   Bank Amount   -->
                <v-col class="d-flex mt-n5"
                       cols="12"
                       md="12">
                  <v-label class="d-inline-block mx-2 mt-2">کارتخوان:</v-label>
                  <v-text-field class=""
                                v-model="form.payment.bank"
                                :readonly="form.payment.distributedBank"
                                @click:append="form.window = 3"
                                append-icon="mdi-credit-card-multiple-outline"
                                type="number"
                                density="compact"
                                variant="outlined">
                  </v-text-field>
                </v-col>

                <!--   Credit Amount   -->
                <v-col class="d-flex mt-n5"
                       cols="12"
                       md="12">
                  <v-label class="d-inline-block mx-6 mt-2">نسیه:</v-label>
                  <v-text-field class="ml-11"
                                v-model="form.payment.credit"
                                type="number"
                                density="compact"
                                variant="outlined">
                  </v-text-field>
                </v-col>

              </v-row>

              <v-divider></v-divider>

              <!--    Remaining      -->
              <v-row class="mx-2 mt-2">
                <!--   Amount   -->
                <v-col class="d-flex" cols="12" md="12">
                  <v-label class="d-inline-block mx-2 mt-4">باقیمانده:</v-label>
                  <v-text-field class="font-weight-bold text-secondary"
                                v-model="form.payment.remaining"
                                variant="solo-filled"
                                readonly>
                  </v-text-field>
                </v-col>
              </v-row>

            </v-col>
          </v-window-item>

          <!--   Cash Accounts Form     -->
          <v-window-item class="pt-4" :value="2">
            <!--   Cash Accounts     -->
            <v-row class="d-flex px-6"
                   v-for="cashAccount in form.payment.cashAccounts"
                   cols="12">
              <v-label class="numberInputLabel d-inline-block ml-3 mt-2">
                {{
                  accounts.find(i => i._id === cashAccount._account).title.fa
                }}:
              </v-label>
              <v-text-field class=""
                            v-model="cashAccount.amount"
                            type="number"
                            density="compact"
                            variant="outlined">
              </v-text-field>
            </v-row>
          </v-window-item>

          <!--   Bank Accounts Form     -->
          <v-window-item class="pt-4" :value="3">
            <!--   Bank Accounts     -->
            <v-row class="d-flex px-6"
                   v-for="bankAccount in form.payment.bankAccounts"
                   cols="12">
              <v-label class="numberInputLabel d-inline-block ml-3 mt-2">
                {{
                  accounts.find(i => i._id === bankAccount._account).title.fa
                }}:
              </v-label>
              <v-text-field class=""
                            v-model="bankAccount.amount"
                            type="number"
                            density="compact"
                            variant="outlined">
              </v-text-field>
            </v-row>
          </v-window-item>
          <!--     Actions       -->
          <v-row class="mx-1 pb-5">
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
      </v-window>
    </v-row>

  </v-dialog>
</template>

<script>
import {useCookie} from "#app";

export default {
  data() {
    return {
      loading : false,
      accounts: [],
      form    : {
        amount : 90000,
        payment: {
          cash           : 0,
          cashAccounts   : [],
          distributedCash: false,
          bank           : 0,
          bankAccounts   : [],
          distributedBank: false,
          credit         : 0,
          remaining      : 0
        },
        window : 1
      }
    }
  },
  methods: {
    submit() {

    },
    getAccounts() {
      this.loading = true;
      this.list    = [];
      fetch(this.runtimeConfig.public.API_BASE_URL + 'accounts',
          {
            method : 'get',
            headers: {
              'Content-Type' : 'application/json',
              'authorization': 'Bearer ' + this.user.token
            }
          }
      ).then(async response => {
        response      = await response.json();
        this.accounts = response.list;

        // add accounts fields
        this.accounts.forEach((account) => {
          let temp = {
            _account: account._id,
            amount  : 0
          };
          if (account.defaultFor) {
            temp.default = true;
          }
          switch (account.type) {
            case 'bank':
              this.form.payment.bankAccounts.push(temp);
              break;
            case 'cash':
              this.form.payment.cashAccounts.push(temp);
              break;
          }
        });

        this.loading = false;
      });
    },
    calcRemaining() {
      let remaining               = this.form.amount;
      remaining -= this.form.payment.cash;
      remaining -= this.form.payment.bank;
      remaining -= this.form.payment.credit;
      this.form.payment.remaining = remaining;
    }
  },
  mounted() {
    this.user          = useCookie('user').value;
    this.runtimeConfig = useRuntimeConfig();
    this.getAccounts();
  },
  computed: {
    cashAmount() {
      return this.form.payment.cash;
    },
    bankAmount() {
      return this.form.payment.bank;
    },
    cashAccounts() {
      return this.form.payment.cashAccounts;
    },
    bankAccounts() {
      return this.form.payment.bankAccounts;
    },
    creditAmount() {
      return this.form.payment.credit;
    }
  },
  watch   : {
    cashAmount(val, oldVal) {
      if (!this.form.payment.distributedCash)
        (this.form.payment.cashAccounts.find(i => i.default === true)).amount = val;
    },
    bankAmount(val, oldVal) {
      if (!this.form.payment.distributedBank)
        (this.form.payment.bankAccounts.find(i => i.default === true)).amount = val;
    },
    creditAmount(val, oldVal) {
      this.calcRemaining();
    },
    cashAccounts: {
      handler(newVal, oldVal) {
        // calc remaining
        this.calcRemaining();

        // check distributed cash
        if (!this.form.payment.distributedCash) {
          newVal.forEach((account) => {
            if (!account.default && account.amount !== 0) {
              this.form.payment.distributedCash = true;
            }
          });
        } else {
          let sum = 0;
          newVal.forEach((account) => {
            sum += Number(account.amount);
          });
          this.form.payment.cash = sum;
        }
      },
      deep: true
    },
    bankAccounts: {
      handler(newVal, oldVal) {
        // calc remaining
        this.calcRemaining();

        // check distributed bank
        if (!this.form.payment.distributedBank) {
          newVal.forEach((account) => {
            if (!account.default && account.amount !== 0) {
              this.form.payment.distributedBank = true;
            }
          });
        } else {
          let sum = 0;
          newVal.forEach((account) => {
            sum += Number(account.amount);
          });
          this.form.payment.bank = sum;
        }
      },
      deep: true
    }
  }
}
</script>


<style scoped>
.numberInputLabel {
  width: 90px !important;
}
</style>
