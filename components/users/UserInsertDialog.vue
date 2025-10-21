<template>
  <!--  Insert Dialog   -->
  <v-dialog width="350">
    <!--   Content     -->
    <v-row class="bg-white mx-0 px-0 rounded-lg">
      <!--    Title And Action    -->
      <v-col cols="12">
        <v-row>
          <!--      Title      -->
          <v-col class="mt-2" cols="9">
            <v-icon class="mt-1 mr-2" color="green">
              mdi-account-multiple-plus-outline
            </v-icon>

            <v-label class="font-weight-bold mr-2">
              <span>افزودن کاربر</span>
            </v-label>
          </v-col>

          <!--     Action       -->
          <v-col class="text-end" cols="3">
            <!--      Close      -->
            <v-btn class="" @click="exit" size="small" icon>
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-col>
        </v-row>
        <v-divider class="mt-3"></v-divider>
      </v-col>

      <!--   Form    -->
      <v-col cols="12" class="pt-0 mt-0">
        <v-form
          :readonly="loading"
          @submit.prevent="submit"
          ref="userInsertForm"
          validate-on="submit lazy"
        >
          <v-row>
            <v-col class="" cols="12">
              <!-- First Name -->
              <v-text-field
                class="mt-3"
                v-model="form.name"
                label="نام و نام خانوادگی"
                placeholder="وارد کنید"
                :rules="[rules.required]"
                density="compact"
                variant="outlined"
              >
              </v-text-field>
            </v-col>

            <v-col class="mt-n5" cols="12">
              <!-- First Name -->
              <v-text-field
                class="mt-3"
                v-model="form.phone"
                label="شماره تلفن"
                placeholder="وارد کنید"
                :rules="[rules.required, rules.phone]"
                density="compact"
                variant="outlined"
              >
              </v-text-field>
            </v-col>

            <!--      Actions      -->
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
      </v-col>
    </v-row>
  </v-dialog>
</template>

<script setup lang="ts">
import { useNuxtApp } from "#app";
import { rules } from "~/utils/validationRules";

const { $notify } = useNuxtApp();
const loading = ref(false);

const form = ref({
  name: "",
  phone: "",
});

const userInsertForm = ref(null);

const emit = defineEmits(["exit", "submitted"]);

const reset = () => {
  userInsertForm.value.reset();
};
const exit = () => {
  emit("exit");
};
const submit = async () => {
  await userInsertForm?.value?.validate();
  if (userInsertForm?.value?.isValid) {
    const [firstName, ...lastNameParts] = form.value.name.split(" ");
    const lastName = lastNameParts.join(" ");

    try {
      const data = await useApiService.post("users", {
        firstName: firstName,
        lastName: lastName,
        phone: form.value.phone,
      });
      if (data) {
        $notify("کاربر ثبت شد", "success");
        emit("submitted", data);
        emit("exit");
      }
    } catch (error) {
      $notify("در پردازش درخواست مشکلی پیش آمد لطفا دوباره تلاش کنید", "error");
    }
  }
};
</script>

<style scoped></style>
