<template>
  <v-form
    :readonly="loading"
    @submit.prevent="submit"
    ref="addAccountingDocumentForm"
    validate-on="submit lazy"
  >
    <!--    Information     -->
    <v-icon class="mt-1 mr-2" color="grey">mdi-information-outline</v-icon>
    <v-label class="text-black font-weight-bold mx-3">مشخصات سند</v-label>
    <v-row class="mx-5">
      <!--   Date   -->
      <v-col class="mt-5 mt-md-0" cols="12" md="4">
        <v-text-field
          id="customDatePickerInput"
          class="mt-3"
          v-model="form.dateTime"
          :readonly="loading"
          :rules="[rules.required]"
          label="تاریخ و ساعت"
          density="compact"
          variant="outlined"
        >
        </v-text-field>

        <PersianDatePicker
          v-model="form.dateTime"
          color="#424242"
          custom-input="#customDatePickerInput"
          lang="fa"
          type="datetime"
          format="YYYY-MM-DD HH:mm:ss"
          display-format="dddd jDD jMMMM jYYYY"
        >
        </PersianDatePicker>
      </v-col>

      <!--   Description   -->
      <v-col class="mt-md-3" cols="12" md="8">
        <v-text-field
          class=""
          v-model="form.description"
          :readonly="loading"
          label="توضیحات"
          density="compact"
          variant="outlined"
        >
        </v-text-field>
      </v-col>
    </v-row>

    <v-divider class="my-5"></v-divider>

    <!--    Accounts     -->
    <v-icon class="mt-1 mr-2" color="grey">mdi-wallet-bifold-outline</v-icon>
    <v-label class="text-black font-weight-bold mx-3">حساب‌های درگیر</v-label>

    <!--  Add Account   -->
    <v-btn
      class="border"
      @click="addAccount"
      size="30"
      variant="outlined"
      color="pink"
      icon
    >
      <v-icon>mdi-plus</v-icon>
    </v-btn>

    <!-- Accounts List is Empty -->
    <div
      v-if="!form.accountsInvolved.length"
      class="d-flex justify-center w-100 my-16"
    >
      <v-label>حسابی اضافه نشده است</v-label>
    </div>

    <!--  Accounts List   -->
    <div class="mt-5">
      <v-row
        v-for="(account, index) in form.accountsInvolved"
        class="mx-5 mt-10 mt-md-6 border-b"
      >
        <!--  Accounts CodeOrName    -->
        <v-col class="pa-1" cols="12" md="3">
          <AccountInput v-model="account._account" />
        </v-col>

        <!--  Description    -->
        <v-col class="pa-1" cols="12" md="4">
          <v-text-field
            class=""
            v-model="account.description"
            label="توضیحات"
            :readonly="loading"
            density="compact"
            variant="outlined"
            hide-details
          >
          </v-text-field>
        </v-col>

        <!--  Debit    -->
        <v-col class="pa-1" cols="12" md="2">
          <PriceInput
            class="bg-red-lighten-5"
            v-model="account.debit"
            label="بدهکار"
            :readonly="loading"
            @update:modelValue="calcDocument"
            hide-details
          />
        </v-col>

        <!--   Credit   -->
        <v-col class="pa-1" cols="12" md="2">
          <PriceInput
            class="bg-green-lighten-5"
            v-model="account.credit"
            label="بستانکار"
            :readonly="loading"
            @update:modelValue="calcDocument"
            hide-details
          />
        </v-col>

        <!--  Actions  -->
        <v-col class="pa-1 mt-2 text-end text-md-center" cols="12" md="1">
          <!--  Delete Product   -->
          <v-btn
            class="bg-white"
            @click="deleteAccount(index)"
            size="30"
            variant="outlined"
            color="pink"
            icon
          >
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </v-col>
      </v-row>

      <!--   Total and difference   -->
      <v-row class="mt-10">
        <v-col cols="12" md="6" offset-md="6" class="pl-md-16">
          <v-row>
            <v-col class="bg-red-lighten-5 border rounded-lg"
              >بدهکار: {{ formatters.price(form.sumOfDebit) }} تومان</v-col
            >
            <v-col class="bg-green-lighten-5 border rounded-lg"
              >بستانکار: {{ formatters.price(form.sumOfCredit) }} تومان</v-col
            >
            <v-col cols="12" class="bg-orange-lighten-5 border rounded-lg"
              >اختلاف:
              <span :class="form.difference >= 0 ? 'text-green' : 'text-red'"
                >{{ formatters.price(form.difference) }} تومان</span
              >
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
        <v-file-input
          v-model="form.files"
          :rules="[filesIsValid]"
          validate-on="input"
          type="file"
          class="d-none"
          ref="filesInput"
          accept="image/*"
          multiple
        >
        </v-file-input>

        <v-card
          class="border border-dashed border-opacity-100 h-100 w-100"
          :class="form.filesError ? 'bg-red' : ''"
          @click="openFileDialog"
          variant="plain"
          link
        >
          <v-card-text>
            <v-row class="d-flex justify-center py-8">
              <v-icon class="w-100 my-2" size="90" color="grey-lighten-2"
                >mdi-image</v-icon
              >
              افزودن تصویر
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>

      <!--   Previews    -->
      <v-col
        v-if="form.renderFilesPreview"
        v-for="(filePreview, index) in form.filesPreview"
        class=""
        cols="12"
        md="3"
      >
        <AttachmentPreview
          :src="filePreview.src"
          :showDelete="filePreview.uploaded"
          @deleteFile="deleteFile(filePreview.name, index)"
        />
      </v-col>
    </v-row>

    <!--     Actions       -->
    <v-row class="mt-10 mx-1">
      <v-col cols="12">
        <!--       Submit       -->
        <v-btn
          class="border rounded-lg"
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
</template>

<script setup>
// Import necessary composables and components
import { useNuxtApp, useRuntimeConfig } from "#app";
import AccountInput from "~/components/accounts/AccountInput.vue";
import AttachmentPreview from "~/components/accounting-documents/AttachmentPreview.vue";
import { ref, reactive, onMounted } from "vue";
import { rules } from "~/utils/validationRules";
import PriceInput from "~/components/price/PriceInput.vue";
import { formatters } from "~/utils/formatters";

// Define reactive state
const form = reactive({
  _id: "",
  dateTime: new Date(),
  accountsInvolved: [],
  description: "",
  amount: 0,
  difference: 0,
  sumOfDebit: 0,
  sumOfCredit: 0,
  files: [],
  filesPreview: [],
  renderFilesPreview: true,
  filesError: false,
});

const loading = ref(false);
const action = ref("add");
const { $notify, $axios } = useNuxtApp();
const addAccountingDocumentForm = ref(null);
const runtimeConfig = useRuntimeConfig();
const filesInput = ref(null);
const showUploadProgress = ref(false);
const uploadProgress = ref(0);
const emit = defineEmits(["exit", "refresh"]);

// Define methods
const filesIsValid = (value) => {
  let valid = true;
  if (value)
    value.forEach((file) => {
      // Allowing file type
      let allowedExtensions = /(\.jpg|\.jpeg|\.png|\.gif)$/i;

      // Check format
      if (!allowedExtensions.exec(file.name)) {
        // Show error
        $notify("فرمت فایل انتخابی قابل قبول نیست", "error");
        valid = false;
        return false;
      }

      // Check size
      if ((file.size / 1024 / 1024).toFixed(2) > 4.7) {
        // Show error
        $notify("اندازه فایل بیش از حد مجاز است", "error");
        valid = false;
        return false;
      }
    });
  if (valid) {
    createImagesPreview();
    form.filesError = false;
  } else {
    form.filesPreview = [];
    form.filesError = true;
  }
  return valid;
};

const reset = () => {
  form._id = "";
  form.dateTime = new Date();
  form.accountsInvolved = [];
  form.description = "";
  form.amount = 0;
  form.difference = 0;
  form.sumOfDebit = 0;
  form.sumOfCredit = 0;
  form.files = [];
  form.filesPreview = [];
  form.renderFilesPreview = true;
  form.filesError = false;
  loading.value = false;
  action.value = "add";
};

const convertFormNumbers = () => {
  form.accountsInvolved.forEach((account) => {
    account.debit = Number(account.debit);
    account.credit = Number(account.credit);
  });
};

const add = async () => {
  // Convert numbers
  convertFormNumbers();

  try {
    const data = await useApiService.post("accounting-documents", {
      dateTime: form.dateTime,
      description: form.description,
      accountsInvolved: form.accountsInvolved,
      amount: form.amount,
    });
    if (data) {
      $notify("عملیات با موفقت انجام شد", "success");
      if (form.files && form.files.length) {
        // upload files of document
        $notify("در حال بارگذاری فایل‌ها...", "warning");
        await uploadFiles(data._id);
      } else {
        // reset and exit
        reset();
        emit("exit");
        emit("refresh");
      }
    }
  } catch (error) {
    // Show error
    $notify("مشکلی در عملیات پیش آمد؛ لطفا دوباره تلاش کنید", "error");
  }
};

const edit = async () => {
  // Convert numbers
  convertFormNumbers();

  try {
    const data = await useApiService.put("accounting-documents/" + form._id, {
      dateTime: form.dateTime,
      description: form.description,
      accountsInvolved: form.accountsInvolved,
      amount: form.amount,
    });
    if (data) {
      $notify("عملیات با موفقیت انجام شد", "success");
      if (form.files && form.files.length) {
        // upload files of document
        $notify("در حال بارگذاری فایل‌ها...", "warning");
        await uploadFiles(data._id);
      } else {
        // reset and exit
        reset();
        emit("exit");
        emit("refresh");
      }
    }
  } catch (error) {
    // Show error
    $notify("مشکلی در عملیات پیش آمد؛ لطفا دوباره تلاش کنید", "error");
  }
};

const submit = async () => {
  // Check if valid
  let valid = true;
  form.accountsInvolved.forEach((account) => {
    if (!account.debit && !account.credit) {
      $notify("برای حساب، مقدار بدهکار یا بستانکار را وارد کنید", "error");
      valid = false;
    }
  });

  if (form.accountsInvolved.length === 0) {
    $notify("حداقل یک حساب درگیر اضافه کنید", "error");
    valid = false;
  }

  if (valid && addAccountingDocumentForm.value?.isValid) {
    loading.value = true;

    if (action.value === "add") {
      await add();
    } else if (action.value === "edit") {
      await edit();
    }

    loading.value = false;
  }
};

const addAccount = () => {
  form.accountsInvolved.push({
    _account: "",
    description: "",
    debit: "",
    credit: "",
  });
};

const deleteAccount = (index) => {
  form.accountsInvolved.splice(index, 1);
  calcDocument();
};

const setEdit = async (data) => {
  try {
    const response = await useApiService.get(
      "accounting-documents/" + data._id
    );
    if (response) {
      form.dateTime = response.dateTime;
      form.description = response.description;
      form.accountsInvolved = response.accountsInvolved;
      form.amount = response.amount;

      // Set files
      if (response.files) {
        response.files.forEach((filePreview) => {
          form.filesPreview.push({
            uploaded: true,
            name: filePreview,
            src:
              runtimeConfig.public.API_BASE_URL +
              "accounting-documents/" +
              data._id +
              "/files/" +
              filePreview,
          });
        });
      }

      // _id and action
      form._id = data._id;
      action.value = "edit";

      calcDocument();
    }
  } catch (error) {
    console.log("Error fetching accounting document:", error);
  }
};

const calcDocument = () => {
  // Reset numbers
  form.sumOfDebit = 0;
  form.sumOfCredit = 0;
  form.difference = 0;

  // Calculate sum of debit and credit
  form.accountsInvolved.forEach((account) => {
    form.sumOfDebit += Number(account.debit);
    form.sumOfCredit += Number(account.credit);
  });

  // Calculate difference
  form.difference = form.sumOfCredit - form.sumOfDebit;

  // Set amount
  form.amount = form.sumOfCredit;
};

const openFileDialog = () => {
  filesInput.value?.click();
};

const createImagesPreview = () => {
  let previews = form.filesPreview;
  form.filesPreview = [];

  // Add uploaded preview
  previews.forEach((filePreview) => {
    if (filePreview.uploaded) {
      form.filesPreview.push(filePreview);
    }
  });

  // Create new previews
  if (form.files)
    form.files.forEach((file) => {
      let fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = (e) => {
        form.filesPreview.push({ src: e.target.result });
      };
    });
};

const deleteFile = async (fileName, index) => {
  if (confirm("آیا مطمئن هستید؟")) {
    try {
      const data = await useApiService.remove(
        "accounting-documents/" + form._id + "/files/" + fileName
      );
      if (data) {
        // Remove item from files preview
        form.filesPreview.splice(index, 1);

        // Exception for reRender files preview after delete file
        // Must AttachmentPreview Component reRendered
        form.renderFilesPreview = false;
        setTimeout(() => {
          form.renderFilesPreview = true;
        }, 200);

        $notify("عملیات با موفقیت انجام شد", "success");
      }
    } catch (error) {
      // Show error
      $notify("مشکلی در عملیات پیش آمد؛ لطفا دوباره تلاش کنید", "error");
    }
  }
};

const uploadFiles = async (_id) => {
  // Add files to form data
  const filesForm = new FormData();
  form.files.forEach((file) => filesForm.append("files", file));

  // enable upload progress show
  showUploadProgress.value = true;

  // upload with axios
  const response = await $axios.post(
    "accounting-documents/" + _id + "/files",
    filesForm,
    {
      onUploadProgress: (progressEvent) => {
        // fill upload progress
        uploadProgress.value = Math.round(
          (progressEvent.loaded / progressEvent.total) * 100
        );
      },
    }
  );
  // disable upload progress show
  showUploadProgress.value = false;

  if (response.status === 200) {
    $notify("بارگذاری فایل‌ها با موفقت انجام شد", "success");
    reset();
    emit("exit");
    emit("refresh");
  } else {
    $notify(
      "مشکلی در بارگذاری فایل‌ها پیش آمد؛ لطفا دوباره تلاش کنید",
      "error"
    );
  }
};

defineExpose({
  action,
  setEdit,
});
</script>

<style scoped></style>
