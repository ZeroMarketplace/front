<template>
  <div>

    <!--  Add Contact Dialog   -->
    <AddContact v-model="addContactDialog" @refresh="getContacts" @exit="addContactDialog = false"/>

    <!--   Search And Back    -->
    <v-row class="d-flex border pt-2 pb-2 mb-0 px-4 mx-0">

      <!--    Menu Button    -->
      <v-btn class="mr-1 ml-2"
             @click="closeContactsList"
             variant="plain"
             icon>
        <v-icon>mdi-arrow-right</v-icon>
      </v-btn>

      <!--   Search   -->
      <v-text-field class="ml-2 mt-1 mb-0 d-block"
                    v-if="searchFlag"
                    v-model="search"
                    prepend-inner-icon="mdi-magnify"
                    append-inner-icon="mdi-close"
                    @click:append-inner="searchFlag = false"
                    label="جستجو"
                    placeholder="وارد کنید"
                    variant="outlined"
                    density="compact"
                    single-line
                    hide-details>
      </v-text-field>

      <!--   Loading    -->
      <v-label v-if="loading && !searchFlag">در حال به روز رسانی...</v-label>

      <v-label v-if="!searchFlag" class="">
        مخاطبین
      </v-label>

      <v-spacer v-if="!searchFlag"></v-spacer>

      <!--   Search Toggle    -->
      <v-btn class="float-end mt-1"
             v-if="!searchFlag"
             @click="searchFlag = true"
             variant="text"
             size="small"
             icon>
        <v-icon>mdi-magnify</v-icon>
      </v-btn>

    </v-row>

    <!--  Add Contact   -->
    <v-row v-if="contacts.length" class="d-flex mt-0 mb-0">
      <v-list class="w-100 pa-0 border px-2">
        <v-list-item prepend-icon="mdi-account-plus-outline"
                     @click="addContactDialog = true"
                     value="addContact">
          افزودن مخاطب
        </v-list-item>
      </v-list>
    </v-row>

    <!--  Contacts List    -->
    <v-list v-if="list.length" class="listHeight mt-0 pb-16 overflow-auto">

      <v-list-item v-for="(contact, i) in list"
                   @click="selectContact(contact)"
                   class=""
                   :key="i"
                   :value="contact">
        <!--    Avatar      -->
        <template v-slot:prepend>
          <!--   Avatar    -->
          <UserAvatar class=""
                      :color="contact.color"
                      :online="messengerStore.users[contact._id].online"
                      :firstName="contact.firstName"
                      :lastName="contact.lastName"
                      :avatars="contact.avatars"/>
        </template>

        <v-list-item-title>
          {{ contact.firstName + ' ' + contact.lastName }}
        </v-list-item-title>


      </v-list-item>

    </v-list>

    <!--  Empty List   -->
    <v-row v-if="!list.length && !loading && !searchFlag" class="h-100 text-subtitle-1">
      <v-col cols="12" class="text-center my-0">هیچ مخاطبی ندارید</v-col>
      <v-col cols="12" class="text-center my-n5">میتوانید با کلیک روی دکمه زیر مخاطب اضافه کنید</v-col>
      <v-col cols="12" class="text-center">
        <v-btn class="mt-5 rounded-xl"
               prepend-icon="mdi-account-plus-outline"
               @click="addContactDialog = true"
               color="secondary">
          افزودن مخاطب
        </v-btn>
      </v-col>
    </v-row>

  </div>
</template>

<script setup>

import AddContact          from "~/components/messenger/AddContact.vue";
import {useAPI}            from "~/composables/useAPI";
import {useMessengerStore} from "~/store/messenger";
import UserAvatar          from "~/components/messenger/UserAvatar.vue";

// get messenger store
const messengerStore = useMessengerStore();

const emit = defineEmits(['exit', 'select']);

const closeContactsList = () => {
  emit('exit');
};

const loading          = ref(true);
const addContactDialog = ref(false);
const search           = ref('');
const searchFlag       = ref(false);
const contacts         = ref([]);

const list = computed(() => {
  if (search.value) {
    let names = search.value.split(' ');
    return contacts.value.filter(user => {
      // Check for different search conditions similar to server-side logic
      const fullName  = `${user.firstName} ${user.lastName}`.toLowerCase();
      const firstName = user.firstName.toLowerCase();
      const lastName  = user.lastName.toLowerCase();

      return (
          // Search assuming all words are in `first`
          firstName.includes(names.join(' ').toLowerCase()) ||
          // Search assuming all words are in `last`
          lastName.includes(names.join(' ').toLowerCase()) ||
          // Search assuming the first word is in `first` and the rest in `last`
          (names.length > 1 && firstName.includes(names[0].toLowerCase()) && lastName.includes(names.slice(1).join(' ').toLowerCase())) ||
          // Search assuming the first word is in `last` and the rest in `first`
          (names.length > 1 && lastName.includes(names[0].toLowerCase()) && firstName.includes(names.slice(1).join(' ').toLowerCase()))
      );
    });
  } else {
    return contacts.value;
  }
});

const getContacts = async () => {
  loading.value = true;

  await useAPI('contacts', {
    method: 'get',
    onResponse({response}) {
      if (response.status === 200) {
        // add every contact to store
        response._data.list.forEach((contact) => {
          messengerStore.addUser(contact)
        });
        contacts.value = response._data.list;
      }
    }
  });

  loading.value = false;
};

const selectContact = (contact) => {
  emit('select', contact);
};

// mounted
onMounted(async () => {
  await nextTick();
  getContacts();
});

</script>

<style scoped>

.listHeight {
  height: calc(100vh - 140px)
}
</style>
