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
              <p v-if="step === 3 && action === 1">تعیین رمز عبور</p>
              <p v-if="step === 3 && action === 2">وارد کردن رمز عبور</p>
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
                />
              </div>

              <!--            Timer          -->
              <v-label v-if="timer.active"
                       class="d-block my-2 ltrDirection text-pink font-weight-bold">
                {{ '0' + timer.minutes }} : {{ timer.second < 10 ? '0' + timer.second : timer.second }}
              </v-label>

              <!--       reSend OTP code       -->
              <v-label v-if="!timer.active"
                       class="mb-2 text-pink"
                       @click="sendOTP"
                       :clickable="!timer.active">دریافت مجدد کد
              </v-label>

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
                            v-model="form.confirmPassword"
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
                   :disabled="!validToSubmit"
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
      timer     : {
        active : false,
        minutes: 1,
        second : 60,
        counter: null
      },
      form      : {
        phoneNumber    : '',
        otp            : '',
        password       : '',
        confirmPassword: '',
        showPassword   : false
      }
    }
  },
  computed: {
    validToSubmit() {
      if (this.step === 1 && this.form.phoneNumber.length === 11) {
        return true;
      } else if (this.step === 2 && this.form.otp.length === 5) {
        return true;
      } else if (this.step === 3) {
        if (this.action === 2) {
          return (this.form.password.length > 7);
        } else {
          return this.form.password.length > 7 && this.form.password === this.form.confirmPassword;
        }
      } else {
        return false;
      }
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
    changeStep(val) {
      this.step = val;
    },
    startTimer() {
      this.timer.minutes = 4;
      this.timer.second  = 60;
      this.timer.active  = true;
      this.timer.counter = setInterval(() => {
        if (this.timer.second === 1) {
          if (this.timer.minutes) {
            this.timer.minutes--;
            this.timer.second = 60;
          } else {
            this.timer.active = false;
            this.timer.minutes -= 1;
            this.timer.second = 60;
            clearInterval(this.timer.counter);
          }
        } else {
          this.timer.second--;
        }
      }, 1000);
    },
    async sendOTP() {
      let response = await fetch(
          this.runtimeConfig.public.API_BASE_URL + 'auth/login', {
            method : 'post',
            headers: {'Content-Type': 'application/json'},
            body   : JSON.stringify({phone: this.form.phoneNumber, method: 'phone'})
          });

      // OTP code sent
      if (response.status === 200) {
        this.startTimer();
        this.changeStep(2);
      } else {
        // show error
        const {$showMessage} = useNuxtApp();
        $showMessage('مشکلی در ارسال کد بوجود آمد. لطفا بعدا تلاش کنید', 'error');
      }
    },
    async verifyOTP() {
      await fetch(
          this.runtimeConfig.public.API_BASE_URL + 'auth/login', {
            method : 'post',
            headers: {'Content-Type': 'application/json'},
            body   : JSON.stringify({
              phone : this.form.phoneNumber,
              code  : this.form.otp,
              method: 'phone'
            })
          }).then(async response => {
        // OTP code verified
        if (response.status === 200) {
          response        = await response.json();
          this.validation = response.validation;
          this.action     = response.userIsExists ? 2 : 1;
          this.changeStep(3);
        } else {
          // show error
          const {$showMessage} = useNuxtApp();
          response             = await response.json();
          if (response.message) {
            if (response.message === 'The OTP code is wrong') {
              $showMessage('کد وارد شده صحیح نیست', 'error');
            }
          }
        }
      });
    },
    async login() {
      await fetch(
          this.runtimeConfig.public.API_BASE_URL + 'auth/login', {
            method : 'post',
            headers: {'Content-Type': 'application/json'},
            body   : JSON.stringify({
              method    : 'phone',
              phone     : this.form.phoneNumber,
              password  : this.form.password,
              validation: this.validation
            })
          }).then(async (response) => {
        const {$showMessage} = useNuxtApp();
        if (response.status === 200) {
          // Login was successful

          // set auth token
          response = await response.json();

          // expires in 30 days
          const user = useCookie('user', {
            secure: true,
            maxAge: (86400 * 30)
          });

          user.value = {
            authenticated: true,
            token        : response.token,
            role         : response.role
          };

          // redirect to dashboard
          $showMessage('خوش آمدید', 'success');
          this.closeModal();
          await navigateTo(response.role === 'admin' ? '/admin-dashboard' : '/dashboard');

        } else if (response.status === 401) {
          // Password is wrong
          $showMessage('رمز عبور وارد شده اشتباه است', 'error');

        } else {
          // other errors
          response = await response.json();
          if (response.message === 'Validation has expired') {
            $showMessage('مدت زمان اعتبار سنجی شما تمام شده است. لطفا دوباره تلاش کنید', 'error');
          }

        }
      });
    },
    async submit() {
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
  },
  mounted() {
    this.runtimeConfig = useRuntimeConfig();
    // const {signIn} = useAuth();
  }
}
</script>


<style scoped>

</style>