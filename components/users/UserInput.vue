<template>
  <div>

    <UserInsertDialog v-model="insertDialog" @exit="insertDialog = false" @submitted="onUserSubmitted"/>

    <!--  Input  -->
    <v-combobox class="w-100"
                v-model="user"
                label="کاربر"
                :readonly="loading"
                :loading="loading"
                :items="items"
                item-title="name.fullName"
                :custom-filter="itemsFilter"
                density="compact"
                variant="outlined"
                auto-select-first="exact"
                @input="searchUser"
                :append-inner-icon="insertDialogIcon ? 'mdi-account-plus-outline' : ''"
                @click:append-inner="insertDialog = true"
                clearable
                hide-details>
    </v-combobox>
  </div>
</template>

<script setup>
import {ref, watch}     from "vue";
import {useAPI}         from "~/composables/useAPI";
import UserInsertDialog from "~/components/users/UserInsertDialog.vue";

const user         = ref(null);
const loading      = ref(false);
const items        = ref([]);
const timer        = ref(0);
const preload      = ref(true);
const insertDialog = ref(false);

// define Props
const props = defineProps({
  inputId         : String,
  insertDialogIcon: Boolean
});

// define emits
const emit = defineEmits(['selected']);

const itemsFilter = (value, query, item) => {
};

const filter = () => {
  let search = new URLSearchParams();

  if (user.value) {
    const phoneRegex = /^0\d{10}$/;

    // check phone input
    if (phoneRegex.test(user.value)) {
      search.set('phone', user.value);
    } else {
      search.set('name', user.value);
    }
  }


  return search;
};

const searchUser = async () => {
  clearInterval(timer.value);

  timer.value = setTimeout(async () => {

    loading.value = true;

    await useAPI('users?' + filter(), {
      method: 'get',
      onResponse({response}) {
        loading.value = false;
        items.value   = response._data.list;
      }
    });

  }, 800)

};

const getUser = async () => {
  loading.value = true;

  useAPI('users/' + props.inputId, {
    method: 'get',
    onResponse({response}) {
      items.value.push(response._data);
      user.value    = items.value.find(row => row._id === props.inputId);
      loading.value = false;
    }
  });

};

const onUserSubmitted = (response) => {
  items.value.push(response);
  user.value = items.value.find(row => row._id === response._id);
};

// watch when user selected
watch(user, (newVal) => {
  if (newVal && typeof newVal === 'object') {
    emit('selected', newVal);

    // prevent preload after item selected
    preload.value = false;
    setTimeout(() => {
      preload.value = true;
    }, 100);
  }
});

// preload the inputId
watch(() => props.inputId, (newVal) => {
  if (preload.value && newVal) {
    getUser();
  }
});


</script>

<style scoped>

</style>
