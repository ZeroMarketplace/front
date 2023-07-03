<template>
  <v-dialog v-model="modal">
    <v-row>
      <v-col cols="12" sm="8" offset-sm="2" md="4" offset-md="4">
        <v-card class="rounded-xl pa-2">

          <!--    Title      -->
          <v-card-title>
            <p class="text-subtitle-2 d-inline-block mt-3">ورود یا عضویت</p>
            <v-btn class="float-end ml-n3" variant="plain" @click="closeModal" icon>
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-title>

          <!--    Content      -->
          <v-card-text class="py-5 px-4">

            <!--      STEP 1      -->
            <div>
              <!--     Google Login Button       -->
              <v-btn class="border rounded-lg w-100 bg-grey-lighten-3" height="50" >
                <v-icon class="mx-1"
                        size="large"
                        color="red">
                  mdi-google
                </v-icon>
                <p class="text-subtitle-2 ml-3">ورود با گوگل</p>
              </v-btn>

              <!--      Phone Number      -->
              <v-text-field class="mt-5 ltrText"
                            v-model="form.phoneNumber"
                            label="شماره موبایل"
                            placeholder="وارد کنید"
                            density="compact"
                            variant="outlined">

              </v-text-field>
            </div>

            <!--      Submit        -->
            <v-btn class="rounded-lg w-100 bg-green text-center" height="50">
              <p> ادامه  </p>
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

export default {
  data() {
    return {
      modal: false,
      step : 1,
      form : {
        phoneNumber: "09"
      }
    }
  },
  methods: {
    openModal() {
      this.modal = true;
    },
    closeModal() {
      this.modal = false;
    }
  }
}
</script>


<style scoped>

</style>