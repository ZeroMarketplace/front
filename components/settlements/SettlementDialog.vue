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
            <v-btn
              v-if="form.window !== 1"
              @click="form.window = 1"
              size="small"
              icon
            >
              <v-icon>mdi-arrow-left</v-icon>
            </v-btn>

            <!--      Close      -->
            <v-btn
              class=""
              v-if="form.window === 1"
              @click="exit"
              size="small"
              icon
            >
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-col>
        </v-row>
        <v-divider class="mt-3"></v-divider>
      </v-col>

      <!--  Window Content    -->
      <v-window v-model="form.window" class="w-100">
        <v-form
          :readonly="loading"
          @submit.prevent="submit"
          ref="settlementForm"
          validate-on="submit lazy"
        >
          <!--   Settlement Form    -->
          <v-window-item :value="1">
            <v-col class="ma-0 pa-0" cols="12">
              <!--    Information     -->
              <v-row class="mx-2">
                <!--   Amount   -->
                <v-col class="d-flex" cols="12" md="12">
                  <v-label class="d-inline-block mx-2 mt-4">مبلغ:</v-label>
                  <PriceInput
                    class="font-weight-bold text-secondary"
                    v-model="info.amount"
                    label=""
                    density="default"
                    variant="solo-filled"
                    readonly
                  />
                </v-col>
              </v-row>

              <v-divider></v-divider>

              <!--    Accounts     -->
              <v-row class="mx-2">
                <!--        Loading for accounts        -->
                <v-row v-if="loading" class="d-flex justify-center my-8">
                  <v-progress-circular indeterminate> </v-progress-circular>
                </v-row>

                <!--   Cash Amount   -->
                <v-col class="d-flex mt-5" cols="12" md="12">
                  <v-label class="d-inline-block mx-7 mt-2">نقد:</v-label>
                  <PriceInput
                    v-model="form.payment.cash"
                    :readonly="form.payment.distributedCash"
                    :disabled="!validCashAccounts"
                    @click:append="form.window = 2"
                    append-icon="mdi-cash-multiple"
                    label=""
                    density="compact"
                    variant="outlined"
                  />
                </v-col>

                <!--      Invalid Cash Accounts          -->
                <v-col
                  v-if="!validCashAccounts"
                  class="text-red text-caption mx-10 mt-n9 mb-5"
                  cols="12"
                >
                  <label>پرداخت نقدی غیر فعال است. زیرا:</label>
                  <ul class="mr-10">
                    <li v-if="!cashAccountsCount">
                      حساب صندوق ایجاد نشده است.
                    </li>
                    <li v-if="!hasDefaultCashAccount">
                      حساب پیش فرضی برای پردخت نقدی انتخاب نشده است.
                    </li>
                  </ul>
                </v-col>

                <!--   Bank Amount   -->
                <v-col class="d-flex mt-n5" cols="12" md="12">
                  <v-label class="d-inline-block mx-2 mt-2">کارتخوان:</v-label>
                  <PriceInput
                    class=""
                    v-model="form.payment.bank"
                    :readonly="form.payment.distributedBank"
                    :disabled="!validBankAccounts"
                    @click:append="form.window = 3"
                    append-icon="mdi-credit-card-multiple-outline"
                    label=""
                    density="compact"
                    variant="outlined"
                  />
                </v-col>

                <!--      Invalid Bank Accounts          -->
                <v-col
                  v-if="!validBankAccounts"
                  class="text-red text-caption mx-10 mt-n9 mb-5"
                  cols="12"
                >
                  <label>پرداخت بانکی غیر فعال است. زیرا:</label>
                  <ul class="mr-10">
                    <li v-if="!bankAccountsCount">
                      حساب بانکی ایجاد نشده است.
                    </li>
                    <li v-if="!hasDefaultBankAccount">
                      حساب پیش فرضی برای پرداخت بانکی انتخاب نشده است.
                    </li>
                  </ul>
                </v-col>

                <!--   Credit Amount   -->
                <v-col class="d-flex mt-n5" cols="12" md="12">
                  <v-label class="d-inline-block mx-6 mt-2">نسیه:</v-label>
                  <PriceInput
                    class="ml-11"
                    v-model="form.payment.credit"
                    label=""
                    density="compact"
                    variant="outlined"
                  />
                </v-col>
              </v-row>

              <v-divider></v-divider>

              <!--    Remaining      -->
              <v-row class="mx-2 mt-2">
                <!--   Amount   -->
                <v-col class="d-flex" cols="12" md="12">
                  <v-label class="d-inline-block mx-2 mt-4">باقیمانده:</v-label>
                  <PriceInput
                    class="font-weight-bold text-secondary"
                    v-model="form.payment.remaining"
                    :rules="[remaining]"
                    label=""
                    density="default"
                    variant="solo-filled"
                    readonly
                  />
                </v-col>
              </v-row>
            </v-col>
          </v-window-item>

          <!--   Cash Accounts Form     -->
          <v-window-item class="pt-4" :value="2">
            <!--   Cash Accounts     -->
            <v-row
              class="d-flex px-6"
              v-for="cashAccount in form.payment.cashAccounts"
              cols="12"
            >
              <v-label class="numberInputLabel d-inline-block ml-3 mt-2">
                {{
                  accounts.find((i) => i._id === cashAccount._account).title
                }}:
              </v-label>
              <PriceInput label="" v-model="cashAccount.amount" />
            </v-row>
          </v-window-item>

          <!--   Bank Accounts Form     -->
          <v-window-item class="pt-4" :value="3">
            <!--   Bank Accounts     -->
            <v-row
              class="d-flex px-6"
              v-for="bankAccount in form.payment.bankAccounts"
              cols="12"
            >
              <v-label class="numberInputLabel d-inline-block ml-3 mt-2">
                {{
                  accounts.find((i) => i._id === bankAccount._account).title
                }}:
              </v-label>
              <PriceInput label="" v-model="bankAccount.amount" />
            </v-row>
          </v-window-item>

          <!--     Actions       -->
          <v-row class="mx-1 pb-5">
            <v-col cols="12">
              <!--       Submit       -->
              <v-btn
                class="border bg-secondary rounded-lg"
                :loading="loading"
                prepend-icon="mdi-check-circle-outline"
                height="40"
                width="100"
                variant="text"
                type="submit"
                density="compact"
              >
                ثبت
              </v-btn>

              <!--       Reset       -->
              <v-btn
                class="border mx-2 rounded-lg"
                color="pink"
                prepend-icon="mdi-delete-outline"
                height="40"
                width="100"
                variant="text"
                @click="reset"
                density="compact"
              >
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
import { ref, watch, onMounted, nextTick } from "vue";
import { useNuxtApp } from "#app";

// Props
const props = defineProps({
  _id: String,
  type: String,
});

// States
const loading = ref(false);
const action = ref("add");
const accounts = ref([]);
const info = ref({ amount: 0 });
const form = ref({
  _id: "",
  payment: {
    cash: 0,
    cashAccounts: [],
    distributedCash: false,
    bank: 0,
    bankAccounts: [],
    distributedBank: false,
    credit: 0,
    remaining: 0,
  },
  window: 1,
});
const settlementForm = ref(null);
const { $notify } = useNuxtApp();
const emit = defineEmits(["exit"]);
const validCashAccounts = ref(true);
const validBankAccounts = ref(true);
const hasDefaultBankAccount = ref(false);
const hasDefaultCashAccount = ref(false);
const bankAccountsCount = ref(0);
const cashAccountsCount = ref(0);

// Validation rules
const remaining = (value) =>
  value === 0 ? true : "مقدار باقیمانده باید ۰ شود";

// Exit from dialog
const exit = () => {
  emit("exit");
};

// Fetch accounts list
const getAccounts = async () => {
  loading.value = true;

  // init search
  let search = new URLSearchParams();
  search.set("types", ["bank", "cash"]);
  search.set("perPage", 100);

  try {
    const data = await useApiService.get("accounts?" + search);
    // set the list
    accounts.value = data.list;
    console.log("accounts", accounts);

    // for each account
    accounts.value.forEach((account) => {
      // init the temp account Info
      let temp = { _account: account._id, amount: 0, title: account?.title };
      // set the default
      if (account.defaultFor) temp.default = true;

      // add to related category
      if (account.type == "2") {
        // add to payment
        form.value.payment.bankAccounts.push(temp);

        // add the bank Accounts Count
        bankAccountsCount.value += 1;

        // set has default bank account
        if (account.defaultFor) hasDefaultBankAccount.value = true;
      }

      if (account.type == "1") {
        console.log("temp", temp);

        // add to payment
        form.value.payment.cashAccounts.push(temp);

        // add the cash Accounts Count
        cashAccountsCount.value += 1;

        // set has default cash account
        if (account.defaultFor) hasDefaultCashAccount.value = true;
      }
    });

    // check the cash Account count is valid
    if (cashAccountsCount.value === 0 || !hasDefaultCashAccount.value) {
      validCashAccounts.value = false;
    }

    // check the bank Account count is valid
    if (bankAccountsCount.value === 0 || !hasDefaultBankAccount.value) {
      validBankAccounts.value = false;
    }
    console.log("stop loading");

    // stop loading
    loading.value = false;
  } catch (error) {
    console.log("getAccounts error", error);
    loading.value = false;
  }
};

// Fetch settlement data
const getSettlement = async (_id) => {
  loading.value = true;
  // fetch the settlement data
  try {
    const data = await useApiService.get("settlements/" + _id);
    // set payment data
    form.value.payment = data.payment;
    form.value._id = data._id;

    // calc remaining number
    calcRemaining();

    // stop loading
    loading.value = false;
  } catch (error) {
    console.log("getSettlement error", error);
    loading.value = false;
  }
};

// Fetch additional info
const getInfo = async () => {
  // loading.value = true;
  console.log("getInfo ....");
  console.log("props.type", props.type);
  console.log("props._id", props._id);

  try {
    const data = await useApiService.get(`${props.type}s/${props._id}`);

    console.log("getInfo response data", data);

    info.value.amount = data.total;
    if (data._settlement) {
      // get settlement
      await getSettlement(data._settlement);
      // set the action to edit
      action.value = "edit";
    }
    // calc remaining number
    calcRemaining();

    // stop loading
    loading.value = false;
  } catch (error) {
    console.log("getInfo error", error);
    loading.value = false;
  }
};

// Calculate remaining amount
const calcRemaining = () => {
  let remaining = info.value.amount;
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
    action.value === "add" ? await add() : await edit();
    info.value.amount = 0;
    form.value.window = 1;
    form.value.payment.cash = 0;
    form.value.payment.bank = 0;
    form.value.payment.credit = 0;
    form.value.payment.remaining = 0;
    form.value.payment.distributedBank = false;
    form.value.payment.distributedCash = false;
    loading.value = false;
  }
};

// Add new settlement
const add = async () => {
  // convert credit number
  form.value.payment.credit = Number(form.value.payment.credit);

  try {
    const data = await useApiService.post("settlements", {
      type: props.type,
      _reference: props._id,
      payment: form.value.payment,
    });

    if (data) {
      $notify("عملیات با موفقیت انجام شد", "success");
      emit("exit");
    }
  } catch (error) {
    console.log("add settlement error", error);
    const status = error?.response?.status;
    const message = error?.response?._data?.message;
    if (status === 400) {
      if (
        typeof message === "string" &&
        message.startsWith("Invalid Payment")
      ) {
        $notify("پرداخت نامعتبر؛ لطفا مقادیر پرداختی را بازنگری کنید", "error");
      } else {
        $notify("مشکلی در عملیات پیش آمد؛ لطفا دوباره تلاش کنید", "error");
      }
    } else {
      $notify("مشکلی در عملیات پیش آمد؛ لطفا دوباره تلاش کنید", "error");
    }
  }
};

// Edit existing settlement
const edit = async () => {
  // convert credit number
  form.value.payment.credit = Number(form.value.payment.credit);

  try {
    const data = await useApiService.put("settlements/" + form.value._id, {
      type: props.type,
      _reference: props._id,
      payment: form.value.payment,
    });

    if (data) {
      $notify("عملیات با موفقیت انجام شد", "success");
      emit("exit");
    }
  } catch (error) {
    console.log("edit settlement error", error);
    $notify("مشکلی در عملیات پیش آمد؛ لطفا دوباره تلاش کنید", "error");
  }
};

// Reset form
const reset = () => {
  form.value.payment = {
    cash: 0,
    distributedCash: false,
    bank: 0,
    distributedBank: false,
    credit: 0,
    remaining: 0,
    bankAccounts: form.value.payment.bankAccounts.map((acc) => ({
      ...acc,
      amount: 0,
    })),
    cashAccounts: form.value.payment.cashAccounts.map((acc) => ({
      ...acc,
      amount: 0,
    })),
  };
  calcRemaining();
};

// Watchers in script setup
watch(
  () => form.value.payment.cash,
  (val) => {
    if (!form.value.payment.distributedCash) {
      const defaultAccount = form.value.payment.cashAccounts.find(
        (i) => i.default === true
      );
      if (defaultAccount) {
        defaultAccount.amount = val;
      }
    }
    calcRemaining();
  }
);

watch(
  () => form.value.payment.bank,
  (val) => {
    if (!form.value.payment.distributedBank) {
      const defaultAccount = form.value.payment.bankAccounts.find(
        (i) => i.default === true
      );
      if (defaultAccount) {
        defaultAccount.amount = val;
      }
    }

    calcRemaining();
  }
);

watch(
  () => form.value.payment.credit,
  () => {
    calcRemaining();
  }
);

watch(
  () => form.value.payment.cashAccounts,
  (newVal) => {
    calcRemaining();
    if (!form.value.payment.distributedCash) {
      newVal.forEach((account) => {
        if (!account.default && account.amount !== 0) {
          form.value.payment.distributedCash = true;
        }
      });
    }

    form.value.payment.cash = newVal.reduce(
      (sum, account) => sum + Number(account.amount),
      0
    );
  },
  { deep: true }
);

watch(
  () => form.value.payment.bankAccounts,
  (newVal) => {
    calcRemaining();
    if (!form.value.payment.distributedBank) {
      newVal.forEach((account) => {
        if (!account.default && account.amount !== 0) {
          form.value.payment.distributedBank = true;
        }
      });
    }

    form.value.payment.bank = newVal.reduce(
      (sum, account) => sum + Number(account.amount),
      0
    );
  },
  { deep: true }
);

watch(
  () => props._id,
  (val) => {
    if (val && val !== null) {
      getInfo();
    }
  },
  { immediate: true }
);

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
