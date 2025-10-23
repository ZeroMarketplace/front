<template>
  <v-dialog width="350">
    <v-card class="rounded-lg">
      <v-card-title> حذف </v-card-title>

      <div class="mx-5 mb-6 text-subtitle-2">
        <v-label>آیا از حذف گفتگو مطمئن هستید؟</v-label>
      </div>

      <!--   Actions    -->
      <div class="pb-0 px-5 mt-0 mb-3 py-0 d-flex flex-column w-100">
        <!--    Buttons     -->
        <div>
          <!--     Send      -->
          <v-btn color="red" :loading="loading" @click="submit"> حذف </v-btn>

          <!--     cancel     -->
          <v-btn class="mx-2 text-white" @click="closeDialog" variant="outlined">
            انصراف
          </v-btn>
        </div>
      </div>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref } from "vue";
import { useCookie, useNuxtApp } from "#app";
import { useMessengerStore } from "~/store/messenger";

// define props
const props = defineProps({
  _conversation: {
    type: String,
    required: true,
  },
});

// define emits
const emit = defineEmits(["exit"]);

const messengerStore = useMessengerStore();
const user = useCookie("user");
const loading = ref(false);
const { $notify } = useNuxtApp();

const closeDialog = () => {
  emit("exit");
};

const submit = async () => {
  loading.value = true;
  try {
    const data = await useApiService.remove(
      "conversations/" + props._conversation
    );
    if (data) {
      loading.value = false;
      emit("exit");
      messengerStore.deleteConversation(props._conversation);
    }
  } catch (error) {
    loading.value = false;
    $notify("مشکلی در حذف گفتگو پیش آمد", "error");
  }
};
</script>

<style scoped></style>
