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
          <v-col class="text-end" cols="3">
            <!--      Back      -->
            <v-btn v-if="form.window !== 1"
                   @click="form.window = 1"
                   size="small" icon>
              <v-icon>mdi-arrow-left</v-icon>
            </v-btn>

            <!--      Close      -->
            <v-btn class=""
                   v-if="form.window === 1"
                   @click="exit"
                   size="small" icon>
              <v-icon>mdi-close</v-icon>
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
                                v-model="info.amount"
                                variant="solo-filled"
                                readonly>
                  </v-text-field>
                </v-col>

              </v-row>

              <v-divider></v-divider>

              <!--    Accounts     -->
              <v-row class="mx-2">

                <!--        Loading for accounts        -->
                <v-row v-if="loading" class="d-flex justify-center my-8">
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
                                :rules="rules.remaining"
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
                  accounts.find(i => i._id === cashAccount._account).title
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
                  accounts.find(i => i._id === bankAccount._account).title
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

<script setup>
import {ref, watch, onMounted, nextTick} from 'vue';
import {useNuxtApp}                      from '#app';
import {useAPI}                          from "~/composables/useAPI";

// Props
const props = defineProps({
  _id : String,
  type: String,
});

// States
const loading        = ref(false);
const action         = ref('add');
const accounts       = ref([]);
const info           = ref({amount: 0});
const form           = ref({
  _id    : '',
  payment: {
    cash           : 0,
    cashAccounts   : [],
    distributedCash: false,
    bank           : 0,
    bankAccounts   : [],
    distributedBank: false,
    credit         : 0,
    remaining      : 0,
  },
  window : 1,
});
const settlementForm = ref(null);
const {$notify}      = useNuxtApp();
const emit           = defineEmits(['exit']);

// Validation rules
const rules = {
  remaining: [
    (value) => (value === 0 ? true : 'مقدار باقیمانده باید ۰ شود'),
  ],
};

// Exit from dialog
const exit = () => {
  emit('exit');
};

// Fetch accounts list
const getAccounts = async () => {
  loading.value = true;

  // init search
  let search = new URLSearchParams();
  search.set('types', ['bank', 'cash']);
  search.set('perPage', 50);

  await useAPI('accounts?' + search, {
    method    : 'get',
    onResponse: ({response}) => {
      // set the list
      accounts.value = response._data.list;

      // for each account
      accounts.value.forEach((account) => {
        // init the temp account Info
        let temp = {_account: account._id, amount: 0};
        // set the default
        if (account.defaultFor) temp.default = true;
        // add to related category
        if (account.type === 'bank') form.value.payment.bankAccounts.push(temp);
        if (account.type === 'cash') form.value.payment.cashAccounts.push(temp);
      });

      // stop loading
      loading.value = false;
    }
  });
};

// Fetch settlement data
const getSettlement = async (_id) => {
  loading.value = true;
  // fetch the settlement data
  await useAPI('settlements/' + _id, {
    method    : 'get',
    onResponse: ({response}) => {
      if (response.status === 200) {
        // set payment data
        form.value.payment = response._data.payment;
        form.value._id     = response._data._id;

        // calc remaining number
        calcRemaining();

        // stop loading
        loading.value = false;
      }
    }
  });
};

// Fetch additional info
const getInfo = async () => {
  loading.value = true;

  await useAPI(`${props.type}s/${props._id}`, {
    method    : 'get',
    onResponse: async ({response}) => {
      if (response.status === 200) {
        info.value.amount = response._data.total;
        if (response._data._settlement) {
          // get settlement
          await getSettlement(response._data._settlement);
          // set the action to edit
          action.value = 'edit';
        }
        // calc remaining number
        calcRemaining();

        // stop loading
        loading.value = false;
      }
    }
  });
};

// Calculate remaining amount
const calcRemaining = () => {
  let remaining                = info.value.amount;
  remaining -= form.value.payment.cash;
  remaining -= form.value.payment.bank;
  remaining -= form.value.payment.credit;
  form.value.payment.remaining = remaining;
};

// Submit form
const submit = async () => {
  settlementForm.value?.validate();
  if (settlementForm.value?.isValid) {
    loading.value = true;
    action.value === 'add' ? await add() : await edit();
    loading.value = false;
  }
};

// Add new settlement
const add = async () => {
  await useAPI('settlements', {
    method    : 'post',
    body      : {
      type      : props.type,
      _reference: props._id,
      payment   : form.value.payment
    },
    onResponse: ({response}) => {
      if (response.status === 200) {
        $notify('عملیات با موفقیت انجام شد', 'success');
        emit('exit');
      } else {
        $notify('مشکلی در عملیات پیش آمد؛ لطفا دوباره تلاش کنید', 'error');
      }
    }
  });
};

// Edit existing settlement
const edit = async () => {
  await useAPI('settlements/' + form.value._id, {
    method    : 'put',
    body      : {
      type      : 'props.type',
      _reference: props._id,
      payment   : form.value.payment
    },
    onResponse: ({response}) => {
      if (response.status === 200) {
        $notify('عملیات با موفقیت انجام شد', 'success');
        emit('exit');
      } else {
        $notify('مشکلی در عملیات پیش آمد؛ لطفا دوباره تلاش کنید', 'error');
      }
    }
  });
};

// Reset form
const reset = () => {
  form.value.payment = {
    cash           : 0,
    distributedCash: false,
    bank           : 0,
    distributedBank: false,
    credit         : 0,
    remaining      : 0,
    bankAccounts   : form.value.payment.bankAccounts.map((acc) => ({...acc, amount: 0})),
    cashAccounts   : form.value.payment.cashAccounts.map((acc) => ({...acc, amount: 0})),
  };
  calcRemaining();
};

// Watchers in script setup
watch(() => form.value.payment.cash, (val) => {
  if (!form.value.payment.distributedCash) {
    const defaultAccount = form.value.payment.cashAccounts.find(i => i.default === true);
    if (defaultAccount) {
      defaultAccount.amount = val;
    }
  }
  calcRemaining();
});

watch(() => form.value.payment.bank, (val) => {
  if (!form.value.payment.distributedBank) {
    const defaultAccount = form.value.payment.bankAccounts.find(i => i.default === true);
    if (defaultAccount) {
      defaultAccount.amount = val;
    }
  }

  calcRemaining();
});

watch(() => form.value.payment.credit, () => {
  calcRemaining();
});

watch(() => form.value.payment.cashAccounts, (newVal) => {
  calcRemaining();
  if (!form.value.payment.distributedCash) {
    newVal.forEach(account => {
      if (!account.default && account.amount !== 0) {
        form.value.payment.distributedCash = true;
      }
    });
  }

  form.value.payment.cash = newVal.reduce((sum, account) => sum + Number(account.amount), 0);
}, {deep: true});

watch(() => form.value.payment.bankAccounts, (newVal) => {
  calcRemaining();
  if (!form.value.payment.distributedBank) {
    newVal.forEach(account => {
      if (!account.default && account.amount !== 0) {
        form.value.payment.distributedBank = true;
      }
    });
  }

  form.value.payment.bank = newVal.reduce((sum, account) => sum + Number(account.amount), 0);
}, {deep: true});

watch(() => props._id, () => {
  getInfo();
});

// On component mount
onMounted(() => {
  nextTick(() => {
    getAccounts();
  });
});
</script>


<style scoped>
.numberInputLabel {
  width: 90px !important;
}
</style>
