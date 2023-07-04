<template>
  <v-dialog v-model="modal">
    <v-row no-gutters>
      <v-col cols="12" sm="8" offset-sm="2" md="4" offset-md="4">
        <v-card class="rounded-xl pa-2">

          <!--    Header      -->
          <v-card-title class="pt-2">

            <!--    Title      -->
            <v-label class="font-weight-bold text-black d-inline-block mt-2">
              <p v-if="step === 1">ورود یا عضویت</p>
              <p v-if="step === 2" class="mt-n1">
                <v-btn variant="plain" @click="changeStep(1)" icon>
                  <v-icon color="pink">mdi-arrow-right</v-icon>
                </v-btn>
                تایید پیامکی
              </p>
              <p v-if="step === 3 && action === 2">تعیین رمز عبور</p>
              <p v-if="step === 3 && action === 1">وارد کردن رمز عبور</p>
            </v-label>

            <!--     Close       -->
            <v-btn class="float-end ml-n3" variant="plain" @click="closeModal" icon>
              <v-icon>mdi-close</v-icon>
            </v-btn>

          </v-card-title>

          <!--    Content      -->
          <v-card-text class="py-5 px-4">

            <!--      STEP 1      -->
            <div v-if="step === 1 || step === 3">
              <!--     Google Login Button       -->
              <v-btn v-if="step === 1"
                     class="rounded-lg w-100 bg-grey-lighten-3 mb-5"
                     height="50">
                <v-icon class="mx-1"
                        size="large"
                        color="red">
                  mdi-google
                </v-icon>
                <p class="text-subtitle-2 ml-3">ورود با گوگل</p>
              </v-btn>

              <!--      Phone Number      -->
              <v-text-field class="mt-3 ltrDirection"
                            v-model="form.phoneNumber"
                            :label="step === 3 ? 'شماره موبایل (تایید شده)' : 'شماره موبایل'"
                            placeholder="وارد کنید"
                            :readonly="step === 3 || loading"
                            density="compact"
                            variant="outlined">
              </v-text-field>

            </div>

            <!--      STEP 2      -->
            <div v-if="step === 2" class="text-center">
              <v-label class="text-subtitle-2">
                لطفا کد ارسال شده را وارد نمایید
              </v-label>

              <!--       OTP Input       -->
              <div class="d-flex justify-center ltrDirection my-5">
                <VOPTInput
                    class="text-center"
                    ref="otpInput"
                    v-model:value="form.otp"
                    input-classes="otp-input"
                    separator=""
                    :num-inputs="5"
                    :should-auto-focus="true"
                    input-type="numeric"
                    @on-complete="onOTPEntered"
                />
              </div>

              <v-label class="my-2 font-weight-bold" clickable="true">دریافت مجدد کد</v-label>
              <v-label class="d-block my-2">1:30</v-label>
            </div>

            <!--      STEP 3       -->
            <div v-if="step === 3">

              <!--      Password      -->
              <v-text-field class="mt-3 "
                            v-model="form.password"
                            label="رمز عبور"
                            placeholder="وارد کنید"
                            :append-inner-icon="form.showPassword ? 'mdi-eye-off ': 'mdi-eye'"
                            :type="form.showPassword ? 'text' : 'password'"
                            @click:append-inner="togglePasswordVisible"
                            density="compact"
                            variant="outlined">
              </v-text-field>

              <!--      Confirm Password      -->
              <v-text-field v-if="action === 1"
                            class="mt-3"
                            label="تکرار رمز عبور"
                            placeholder="وارد کنید"
                            :append-inner-icon="form.showPassword ? 'mdi-eye-off ': 'mdi-eye'"
                            :type="form.showPassword ? 'text' : 'password'"
                            @click:append-inner="togglePasswordVisible"
                            density="compact"
                            variant="outlined">
              </v-text-field>

            </div>

            <!--      Submit        -->
            <v-btn class="rounded-lg w-100 bg-green text-center mt-3"
                   @click="submit"
                   :loading="loading"
                   height="50">
              <p> ادامه </p>
              <v-icon class="mx-2 ml-n3">mdi-arrow-left</v-icon>
            </v-btn>


          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-dialog>
</template>


<script>

// Login Has 3-Step
// Step 1 is entered phone number
// Step 2 is entered OTP Code
// Step 3 is entered password for signup or sign in

// action is 1-Sign up 2-Sign in

import VOPTInput from "vue3-otp-input"

export default {
  components: {
    VOPTInput
  },
  data() {
    return {
      modal     : false,
      step      : 1,
      action    : 1,
      loading   : false,
      validation: '',
      form      : {
        phoneNumber : '',
        otp         : '',
        password    : '',
        showPassword: false
      }
    }
  },
  computed: {
    runtimeConfig() {
      return useRuntimeConfig();
    }
  },
  methods : {
    openModal() {
      this.modal = true;
    },
    closeModal() {
      this.modal = false;
    },
    togglePasswordVisible() {
      this.form.showPassword = !this.form.showPassword;
    },
    onOTPEntered(val) {
      console.log(val);
    },
    changeStep(val) {
      this.step = val;
    },
    async sendOTP() {
      let response = await fetch(
          this.runtimeConfig.public.apiUrl + 'auth/sendOTP', {
            method : 'post',
            headers: {'Content-Type': 'application/json'},
            body   : JSON.stringify({phone: this.form.phoneNumber})
          });

      // OTP code sent
      if (response.status === 200) {
        this.step = 2;
      } else {
        // show error
      }
    },
    async verifyOTP() {
      await fetch(
          this.runtimeConfig.public.apiUrl + 'auth/verifyOTP', {
            method : 'post',
            headers: {'Content-Type': 'application/json'},
            body   : JSON.stringify({
              phone: this.form.phoneNumber,
              code : this.form.otp
            })
          }).then(async response => {
            // OTP code verified
            if (response.status === 200) {
              response        = await response.json();
              this.validation = response.validation
              this.step       = 3;
            } else {
              // show error
            }
      });
    },
    async login() {
      let response = await fetch(
          this.runtimeConfig.public.apiUrl + 'auth/login', {
            method : 'post',
            headers: {'Content-Type': 'application/json'},
            body   : JSON.stringify({
              phone     : this.form.phoneNumber,
              password  : this.form.password,
              validation: this.validation
            })
          });
    },
    async submit() {
      let response;
      this.loading = true;
      switch (this.step) {
        case 1:
          await this.sendOTP();
          break;
        case 2:
          await this.verifyOTP();
          break;
        case 3:
          await this.login();
          break;
      }
      this.loading = false;
    }
  }
}
</script>


<style scoped>

</style>