<template>
  <v-form :readonly="loading"
          @submit.prevent="submit"
          ref="addAccountingDocumentForm">

    <!--    Information     -->
    <v-icon class="mt-1 mr-2" color="grey">mdi-information-outline</v-icon>
    <v-label class="text-black font-weight-bold mx-3">مشخصات سند</v-label>
    <v-row class="mx-5">
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

      <!--   Description   -->
      <v-col class="" cols="12" md="8">
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

    <!--    Accounts     -->
    <v-icon class="mt-1 mr-2" color="grey">mdi-archive-outline</v-icon>
    <v-label class="text-black font-weight-bold mx-3">حساب‌ها</v-label>

    <!--  Add Account   -->
    <v-btn class="border"
           @click="addAccount"
           size="30"
           variant="outlined"
           color="pink"
           icon>
      <v-icon>mdi-plus</v-icon>
    </v-btn>

    <!-- Accounts List is Empty -->
    <div v-if="!form.accountsInvolved.length" class="d-flex justify-center w-100 my-16">
      <v-label>طرف حسابی اضافه نشده است</v-label>
    </div>

    <!--  Accounts List   -->
    <v-table v-if="form.accountsInvolved.length" class="border my-2" density="compact" fixed-footer hover>
      <thead>
      <tr class="text-center">
        <th class="text-center border">حساب</th>
        <th class="text-center border">توضیحات</th>
        <th class="text-center border">بدهکار</th>
        <th class="text-center border">بستانکار</th>
        <th class="text-center border">عملیات</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(account,index) in form.accountsInvolved"
          class="text-center px-0">

        <!--  Accounts CodeOrName    -->
        <td class="pt-5 px-1 w-25 border">
          <AccountInput :inputId="account._id"
                        @selected="val => onAccountSelected(val,index)"/>
        </td>

        <!--  Description    -->
        <td class="px-1 w-25 border">
          <v-text-field class=""
                        v-model="account.description"
                        label="توضیحات"
                        :readonly="loading"
                        :rules="rules.notEmpty"
                        density="compact"
                        variant="outlined"
                        hide-details>
          </v-text-field>
        </td>

        <!--  Debit    -->
        <td class="px-1 border">
          <v-text-field class=""
                        v-model="account.debit"
                        label="بدهکار"
                        :readonly="loading"
                        :rules="rules.notEmpty"
                        type="number"
                        density="compact"
                        variant="outlined"
                        hide-details>
          </v-text-field>
        </td>

        <!--   Credit   -->
        <td class="px-1 border">
          <v-text-field class=""
                        v-model="account.credit"
                        label="بستانکار"
                        :readonly="loading"
                        :rules="rules.notEmpty"
                        type="number"
                        density="compact"
                        variant="outlined"
                        hide-details>
          </v-text-field>
        </td>

        <!--  Actions  -->
        <td class="px-1">
          <!--  Delete Product   -->
          <v-btn class="bg-white"
                 @click="deleteAccount(index)"
                 size="30"
                 variant="outlined"
                 color="pink"
                 icon>
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </td>

      </tr>
      </tbody>

    </v-table>

    <v-divider class="mt-8 mb-4"></v-divider>

    <!--    Attachments     -->
    <v-icon class="mt-1 mr-2" color="grey">mdi-plus-minus-variant</v-icon>
    <v-label class="text-black font-weight-bold mx-3">پیوست‌ها</v-label>

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

      </v-col>
    </v-row>


  </v-form>
</template>

<script>
import {useUserStore} from "~/store/user";
import {useCookie}    from "#app";
import AccountInput   from "~/components/accounts/AccountInput.vue";

export default {
  components: {AccountInput},
  data() {
    return {
      form   : {
        _id             : '',
        dateTime        : new Date(),
        accountsInvolved: [],
        description     : '',
        amount          : 0,
        files           : []
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
      this.$refs.addAccountingDocumentForm.reset();
      this.form._id              = '';
      this.form.amount           = 0;
      this.form.accountsInvolved = [];
      this.loading               = false;
      this.action                = 'add';
      this.$forceUpdate();
    },
    async add() {

      // convert numbers
      this.form.accountsInvolved.forEach((account) => {
        account.debit  = Number(account.debit);
        account.credit = Number(account.credit);
      });

      await fetch(
          this.runtimeConfig.public.API_BASE_URL + 'accounting-documents', {
            method : 'post',
            headers: {
              'Content-Type' : 'application/json',
              'authorization': 'Bearer ' + this.user.token
            },
            body   : JSON.stringify({
              dateTime        : this.form.dateTime,
              description     : this.form.description,
              accountsInvolved: this.form.accountsInvolved,
              amount          : this.form.amount,
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
    async edit() {

      // convert numbers
      this.form.accountsInvolved.forEach((account) => {
        account.debit  = Number(account.debit);
        account.credit = Number(account.credit);
      });

      await fetch(
          this.runtimeConfig.public.API_BASE_URL + 'purchase-invoices/' + this.form._id, {
            method : 'put',
            headers: {
              'Content-Type' : 'application/json',
              'authorization': 'Bearer ' + this.user.token
            },
            body   : JSON.stringify({
              dateTime        : this.form.dateTime,
              description     : this.form.description,
              accountsInvolved: this.form.accountsInvolved,
              amount          : this.form.amount,
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
      if (this.$refs.addAccountingDocumentForm.isValid) {
        this.loading = true;

        if (this.action === 'add') {
          await this.add();
        } else if (this.action === 'edit') {
          await this.edit();
        }

        this.loading = false;
      }
    },
    addAccount() {
      this.form.accountsInvolved.push({
        _account   : '',
        description: '',
        debit      : '',
        credit     : '',
      });
    },
    async onAccountSelected(val, index) {
      this.form.accountsInvolved[index]['_account'] = val._id;
    },
    deleteAccount(index) {
      this.form.accountsInvolved.splice(index, 1);
    },
    setEdit(data) {
      this.reset();

      this.form.dateTime         = data.dateTime;
      this.form.description      = data.description;
      this.form.accountsInvolved = data.accountsInvolved;
      this.form.amount           = data.amount;

      // _id and action
      this.form._id = data._id;
      this.action   = 'edit';
    },
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