<template>
  <v-form :readonly="loading"
          @submit.prevent="submit"
          ref="addAccountingDocumentForm">

    <!--    Information     -->
    <v-icon class="mt-1 mr-2" color="grey">mdi-information-outline</v-icon>
    <v-label class="text-black font-weight-bold mx-3">مشخصات سند</v-label>
    <v-row class="mx-5">
      <!--   Date   -->
      <v-col class="mt-5 mt-md-0" cols="12" md="4">

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
      <v-col class="mt-md-3" cols="12" md="8">
        <v-text-field class=""
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
    <v-icon class="mt-1 mr-2" color="grey">mdi-wallet-bifold-outline</v-icon>
    <v-label class="text-black font-weight-bold mx-3">حساب‌های درگیر</v-label>

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
      <v-label>حسابی اضافه نشده است</v-label>
    </div>

    <!--  Accounts List   -->
    <div class="mt-5">
      <v-row v-for="(account,index) in form.accountsInvolved"
             class="mx-5 mt-10 mt-md-6 border-b">

        <!--  Accounts CodeOrName    -->
        <v-col class="pa-1" cols="12" md="3">
          <AccountInput :inputId="account._account"
                        @selected="val => onAccountSelected(val,index)"/>
        </v-col>

        <!--  Description    -->
        <v-col class="pa-1" cols="12" md="4">
          <v-text-field class=""
                        v-model="account.description"
                        label="توضیحات"
                        :readonly="loading"
                        density="compact"
                        variant="outlined"
                        hide-details>
          </v-text-field>
        </v-col>

        <!--  Debit    -->
        <v-col class="pa-1" cols="12" md="2">
          <v-text-field class="bg-red-lighten-5"
                        v-model="account.debit"
                        label="بدهکار"
                        :readonly="loading"
                        @input="calcDocument"
                        type="number"
                        density="compact"
                        variant="outlined"
                        hide-details>
          </v-text-field>
        </v-col>

        <!--   Credit   -->
        <v-col class="pa-1" cols="12" md="2">
          <v-text-field class="bg-green-lighten-5"
                        v-model="account.credit"
                        label="بستانکار"
                        :readonly="loading"
                        @input="calcDocument"
                        type="number"
                        density="compact"
                        variant="outlined"
                        hide-details>
          </v-text-field>
        </v-col>

        <!--  Actions  -->
        <v-col class="pa-1 mt-2 text-end text-md-center" cols="12" md="1">
          <!--  Delete Product   -->
          <v-btn class="bg-white"
                 @click="deleteAccount(index)"
                 size="30"
                 variant="outlined"
                 color="pink"
                 icon>
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </v-col>
      </v-row>
      <!--   Total and difference   -->
      <v-row class="mt-10">
        <v-col cols="12" md="6" offset-md="6" class="pl-md-16">
          <v-row>
            <v-col class="bg-red-lighten-5 border rounded-lg">بدهکار: {{ form.sumOfDebit }}</v-col>
            <v-col class="bg-green-lighten-5 border rounded-lg">بستانکار: {{ form.sumOfCredit }}</v-col>
            <v-col cols="12" class="bg-orange-lighten-5 border rounded-lg">اختلاف:
              <span :class="form.difference >= 0 ? 'text-green' : 'text-red'">{{ form.difference }}</span>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </div>


    <v-divider class="mt-8 mb-4"></v-divider>

    <!--    Attachments     -->
    <v-icon class="mt-1 mr-2" color="grey">mdi-paperclip</v-icon>
    <v-label class="text-black font-weight-bold mx-3">پیوست‌ها</v-label>

    <v-row class="mt-2 mx-4">

      <!--   File Input    -->
      <v-col cols="12" md="3">
        <v-file-input v-model="form.files"
                      :rules="rules.filesIsValid"
                      validate-on="input"
                      type="file"
                      class="d-none"
                      ref="filesInput"
                      accept="image/*"
                      multiple>
        </v-file-input>

        <v-card class="border border-dashed border-opacity-100 h-100 w-100"
                :class="form.filesError ? 'bg-red' : ''"
                @click="openFileDialog"
                variant="plain" link>
          <v-card-text>
            <v-row class="d-flex justify-center py-8">
              <v-icon class="w-100 my-2" size="90" color="grey-lighten-2">mdi-image</v-icon>
              افزودن تصویر
            </v-row>
          </v-card-text>
        </v-card>

      </v-col>

      <!--   Previews    -->
      <v-col v-for="(filePreview, index) in form.filesPreview"
             class=""
             cols="12"
             md="3">
        <v-btn v-if="filePreview.uploaded"
               class="mt-2 mr-2 border border-opacity-100"
               size="25"
               variant="elevated"
               @click="deleteFile(filePreview.name, index)"
               icon>
          <v-icon color="red">mdi-delete</v-icon>
        </v-btn>
        <AttachmentPreview :src="filePreview.src"></AttachmentPreview>
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

      </v-col>
    </v-row>


  </v-form>
</template>

<script>
import {useUserStore} from "~/store/user";
import {useCookie}    from "#app";
import AccountInput   from "~/components/accounts/AccountInput.vue";
import AttachmentPreview from "~/components/accounting-documents/AttachmentPreview.vue";

export default {
  components: {AttachmentPreview, AccountInput},
  data() {
    return {
      form   : {
        _id             : '',
        dateTime        : new Date(),
        accountsInvolved: [],
        description     : '',
        amount          : 0,
        difference      : 0,
        sumOfDebit      : 0,
        sumOfCredit     : 0,
        files           : [],
        filesPreview    : [],
        filesError      : false,
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
        filesIsValid      : [
          value => {
            let valid = true;
            if (value)
              value.forEach((file) => {
                // Allowing file type
                let allowedExtensions = /(\.jpg|\.jpeg|\.png|\.gif)$/i;

                // check format
                if (!allowedExtensions.exec(file.name)) {
                  // show error
                  const {$showMessage} = useNuxtApp();
                  $showMessage('فرمت فایل انتخابی قابل قبول نیست', 'error');
                  valid = false;
                  return false;
                }

                // check size
                if ((file.size / 1024 / 1024).toFixed(2) > 4.7) {
                  // show error
                  const {$showMessage} = useNuxtApp();
                  $showMessage('اندازه فایل بیش از حد مجاز است', 'error');
                  valid = false;
                  return false;
                }

              });
            if (valid) {
              this.createImagesPreview();
              this.form.filesError = false;
            } else {
              this.form.filesPreview = [];
              this.form.filesError   = true;
            }
            return valid;

          }
        ]
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
          if (this.form.files.length) {
            response = await response.json();
            await this.uploadFiles(response._id)
          } else {
            this.reset();
            this.$emit('exit');
            this.$emit('refresh');
            $showMessage('عملیات با موفقت انجام شد', 'success');
          }
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
          if (this.form.files.length) {
            await this.uploadFiles(this.form._id)
          } else {
            this.reset();
            this.$emit('exit');
            this.$emit('refresh');
            $showMessage('عملیات با موفقت انجام شد', 'success');
          }
        } else {
          // show error
          $showMessage('مشکلی در عملیات پیش آمد؛ لطفا دوباره تلاش کنید', 'error');
        }
      });
    },
    async submit() {

      // check is valid
      let valid = true;
      this.form.accountsInvolved.forEach((account) => {
        if (!account.debit && !account.credit) {
          const {$showMessage} = useNuxtApp();
          $showMessage('برای حساب، مقدار بدهکار یا بستانکار را وارد کنید', 'error');
          valid = false;
        }
      });

      if (this.form.accountsInvolved.length === 0) {
        const {$showMessage} = useNuxtApp();
        $showMessage('حداقل یک حساب درگیر اضافه کنید', 'error');
        valid = false;
      }

      if (valid && this.$refs.addAccountingDocumentForm.isValid) {
        this.loading = true;

        if (this.action === 'add') {
          await this.add();
        } else if (this.action === 'edit') {
          await this.edit();
        }

        this.loading = false;
      }
    },
    async onAccountSelected(val, index) {
      this.form.accountsInvolved[index]['_account'] = val._id;
    },
    addAccount() {
      this.form.accountsInvolved.push({
        _account   : '',
        description: '',
        debit      : '',
        credit     : '',
      });
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

      // set files
      if (data.files) {
        data.files.forEach((filePreview) => {
          this.form.filesPreview.push({
            uploaded: true,
            name    : filePreview,
            src     : this.runtimeConfig.public.API_BASE_URL +
                'accounting-documents/' + data._id + '/files/' + filePreview
          });
        });
      }

      // _id and action
      this.form._id = data._id;
      this.action   = 'edit';

      this.calcDocument();
    },
    calcDocument() {
      // reset numbers
      this.form.sumOfDebit  = 0;
      this.form.sumOfCredit = 0;
      this.form.difference  = 0;

      // calc sum of debit and credit
      this.form.accountsInvolved.forEach((account) => {
        this.form.sumOfDebit += Number(account.debit);
        this.form.sumOfCredit += Number(account.credit);
      });

      // calc difference
      this.form.difference = this.form.sumOfCredit - this.form.sumOfDebit;

      // set amount
      this.form.amount = this.form.sumOfCredit;

    },
    openFileDialog() {
      this.$refs.filesInput.click();
    },
    createImagesPreview() {

      let previews           = this.form.filesPreview;
      this.form.filesPreview = [];

      // add uploaded preview
      previews.forEach((filePreview, index) => {
        if (filePreview.uploaded) {
          this.form.filesPreview.push(filePreview);
        }
      });

      // create new previews
      if (this.form.files)
        this.form.files.forEach((file) => {
          let fileReader = new FileReader();
          fileReader.readAsDataURL(file);
          fileReader.onload = (e) => {
            this.form.filesPreview.push({src: e.target.result});
          };
        });

    },
    async deleteFile(fileName, index) {
      if (confirm('آیا مطمئن هستید؟')) {
        await fetch(
            this.runtimeConfig.public.API_BASE_URL + 'accounting-documents/' + this.form._id + '/files/' + fileName, {
              method : 'delete',
              headers: {
                'authorization': 'Bearer ' + this.user.token
              }
            }).then(async response => {
          const {$showMessage} = useNuxtApp();
          if (response.status === 200) {
            // remove item from files preview
            this.form.filesPreview.splice(index, 1);

            $showMessage('عملیات با موفقت انجام شد', 'success');
          } else {
            // show error
            $showMessage('مشکلی در عملیات پیش آمد؛ لطفا دوباره تلاش کنید', 'error');
          }
        });
      }
    },
    async uploadFiles(_id) {
      // add files to form data
      let filesForm = new FormData();
      this.form.files.forEach((file) => {
        filesForm.append('files', file);
      });

      await fetch(
          this.runtimeConfig.public.API_BASE_URL + 'accounting-documents/' + _id + '/files', {
            method : 'post',
            headers: {
              'authorization': 'Bearer ' + this.user.token
            },
            body   : filesForm
          }).then(async response => {
        const {$showMessage} = useNuxtApp();
        if (response.status === 200) {
          this.reset();
          this.$emit('exit');
          this.$emit('refresh');
          $showMessage('عملیات با موفقت انجام شد', 'success');
        } else {
          // show error
          $showMessage('مشکلی در بارگذاری فایل‌ها پیش آمد؛ لطفا دوباره تلاش کنید', 'error');
        }
      });
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