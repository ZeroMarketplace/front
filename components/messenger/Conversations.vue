<template>
  <div>
    <!--   Search And Menu    -->
    <v-row class="d-flex border pt-2 pb-2 mb-0 px-4 mx-0">

      <!--    Menu Button    -->
      <v-btn class="mr-1 ml-2"
             @click=""
             variant="plain"
             icon>
        <v-icon>mdi-menu</v-icon>

        <v-menu class="rounded-lg elevation-0" width="325" activator="parent">
          <v-list>
            <!--        Saved Messages          -->
            <v-list-item prepend-icon="mdi-bookmark-outline" value="savedMessages">
              <v-list-item-title>پیام‌های ذخیره شده</v-list-item-title>
            </v-list-item>

            <!--        Contacts          -->
            <v-list-item prepend-icon="mdi-account-outline"
                         @click="goToContacts"
                         value="contacts">
              <v-list-item-title>مخاطبین</v-list-item-title>
            </v-list-item>

            <!--        Settings          -->
            <v-list-item prepend-icon="mdi-cog-outline" value="settings">
              <v-list-item-title>تنظیمات</v-list-item-title>
            </v-list-item>

          </v-list>
        </v-menu>

      </v-btn>

      <v-label v-if="loading && listAction === 'conversations'">در حال به روز رسانی...</v-label>

      <v-label v-if="listAction === 'conversations'">
        پیام رسان
      </v-label>

      <!--      Search      -->
      <v-text-field v-if="listAction === 'search'"
                    class="mt-1 ml-2 mb-0"
                    prepend-inner-icon="mdi-magnify"
                    append-inner-icon="mdi-close"
                    @click:append-inner="changeListAction('conversations')"
                    label="جستجو"
                    placeholder="وارد کنید"
                    variant="outlined"
                    density="compact"
                    single-line
                    hide-details>

      </v-text-field>

      <v-spacer v-if="listAction === 'conversations'"></v-spacer>

      <!--   Search Toggle    -->
      <v-btn class="float-end mt-1"
             v-if="listAction === 'conversations'"
             @click="changeListAction('search')"
             variant="text"
             size="small"
             icon>
        <v-icon>mdi-magnify</v-icon>
      </v-btn>

    </v-row>

    <!--     ContextMenu      -->
    <v-menu
        v-model="conversationContextMenu.show"
        :style="conversationContextMenu.style"
        :min-width="150"
        class="mr-n5"
        absolute
        offset-x
        offset-y>
      <v-list>
        <!--    Delete     -->
        <v-list-item prepend-icon="mdi-delete"
                     class="text-red"
                     @click="deleteConversation(conversationContextMenu._id)"
                     value="delete">
          <v-list-item-title>حذف</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>

    <!--  Empty List   -->
    <v-row v-if="!Object.values(listOfConversations).length && !loading" class="h-100 text-subtitle-1">
      <v-col cols="12" class="text-center my-0">هیچ گفتگویی ندارید</v-col>
      <v-col cols="12" class="text-center my-n5">با انتخاب مخاطب خود گفتگویی را شروع کنید</v-col>
      <v-col cols="12" class="text-center">
        <v-btn class="mt-5 mb-2 rounded-xl"
               prepend-icon="mdi-account-outline"
               @click="goToContacts"
               color="secondary">
          مخاطبین
        </v-btn>
      </v-col>
    </v-row>

    <!--  Chats List    -->
    <v-list class="listHeight mt-0 pb-5 mb-0 overflow-auto">

      <v-list-item v-for="(conversation, i) in listOfConversations"
                   @click="selectConversation(conversation)"
                   @contextmenu="openConversationContextMenu($event, conversation._id)"
                   :key="i"
                   :value="conversation._id">
        <!--    Avatar      -->
        <template v-slot:prepend>
          <UserAvatar v-if="conversation.type === 'private'"
                      :color="getConversationContact(conversation).color"
                      :online="getConversationContact(conversation).online"
                      :firstName="getConversationContact(conversation).firstName"
                      :lastName="getConversationContact(conversation).lastName"
                      :avatars="getConversationContact(conversation).avatars"/>
        </template>

        <v-list-item-title>
          {{ getConversationName(conversation) }}
        </v-list-item-title>

        <v-list-item-subtitle v-if="getConversationLastMessage(conversation)"
                              class="w-100">
          <span v-if="getConversationLastMessage(conversation).type === 'text'">
            {{ getConversationLastMessage(conversation).content }}
          </span>
          <span v-if="getConversationLastMessage(conversation).type === 'image'">
            تصویر
          </span>
          <span v-if="getConversationLastMessage(conversation).type === 'video'">
            ویدئو
          </span>
          <span v-if="getConversationLastMessage(conversation).type === 'audio'">
            صدا
          </span>
          <span v-if="getConversationLastMessage(conversation).type === 'file'">
            فایل
          </span>
        </v-list-item-subtitle>

        <template v-slot:append>
          <v-row class="d-inline-block my-0 py-0">
            <v-col class="my-0 py-0" cols="12">
              <v-label class="text-caption">{{ getConversationDate(conversation) }}</v-label>
            </v-col>
            <v-col class="my-0 py-0 d-flex justify-center" cols="12">
              <label v-if="conversation.unreadCount" class="unreadCount bg-secondary">
                {{ conversation.unreadCount }}
              </label>
            </v-col>
          </v-row>
        </template>

      </v-list-item>
    </v-list>

    <!--  Delete Conversation   -->
    <DeleteConversationDialog v-model="deleteConversationDialog.show"
                              @exit="closeDeleteConversationDialog"
                              :_conversation="deleteConversationDialog._id"/>

  </div>
</template>

<script setup>

import {useAPI}                 from "~/composables/useAPI";
import {useMessengerStore}      from "~/store/messenger";
import {useCookie}              from "#app";
import PersianDate              from 'persian-date';
import UserAvatar               from "~/components/messenger/UserAvatar.vue";
import DeleteConversationDialog from "~/components/messenger/DeleteConversationDialog.vue";
import {ref}                    from "vue";

const emit = defineEmits(['contacts', 'select']);

const loading                  = ref(true);
const listAction               = ref('conversations');
const user                     = useCookie('user');
const conversationContextMenu  = ref({
  show : false,
  _id  : undefined,
  x    : 0,
  y    : 0,
  style: ''
});
const deleteConversationDialog = ref({
  show: false,
  _id : undefined
});

// get messenger store
const messengerStore = useMessengerStore();

const goToContacts = () => {
  emit('contacts');
};

const changeListAction = (action) => {
  listAction.value = action;
};

const selectConversation = (conversation) => {
  emit('select', conversation);
};

// get sorted list
const listOfConversations = computed(() => {
  return Object.entries(messengerStore.conversations)
      .sort(([, a], [, b]) => new Date(a.updatedAt) - new Date(b.updatedAt))
      .reduce((acc, [key, value]) => {
        acc[key] = value;
        return acc;
      }, {});
});

// get conversation contact (just in private conversations)
const getConversationContact = (conversation) => {
  switch (conversation.type) {
    case 'private':
      let contactId = conversation.members.find(userId => userId !== user.value._id);
      if (contactId) {
        return messengerStore.users[contactId];
      }
      break;
  }
};

// get name of conversation
const getConversationName = (conversation) => {
  switch (conversation.type) {
    case 'private':
      let contact = getConversationContact(conversation);
      if (contact) {
        return contact['firstName'] + ' ' + contact['lastName'];
      }
      break;
  }
};

const getConversationLastMessage = (conversation) => {
  if (messengerStore.messages[conversation._id] && Object.values(messengerStore.messages[conversation._id]).length) {
    return Object.values(messengerStore.messages[conversation._id]).reduce((latest, current) => {
      return new Date(current.updatedAt) > new Date(latest.updatedAt) ? current : latest;
    });
  } else {
    return undefined;
  }
};

const getConversationDate = (conversation) => {
  if (conversation.updatedAt) {
    const nowDate   = new PersianDate();
    const updatedAt = new PersianDate(new Date(conversation.updatedAt));

    // check year
    if (updatedAt.year() === nowDate.year()) {

      // check month
      if (updatedAt.month() === nowDate.month()) {

        // check day
        if (updatedAt.day() === nowDate.day()) {
          return updatedAt.toLocale('fa').format('h:mm a');
        } else {
          return updatedAt.toLocale('fa').format('D MMMM');
        }

      } else {
        return updatedAt.toLocale('fa').format('D MMMM');
      }

    } else {
      return updatedAt.toLocale('fa').format('D MMMM YYYY');
    }


  } else {
    return undefined;
  }
};

const openConversationContextMenu = (event, conversationId) => {
  event.preventDefault();
  conversationContextMenu.value._id   = conversationId;
  conversationContextMenu.value.x     = event.clientX;
  conversationContextMenu.value.y     = event.clientY;
  conversationContextMenu.value.style = {right: `${window.innerWidth - event.clientX}px`, top: `${event.clientY}px`};
  conversationContextMenu.value.show  = true;
};

const deleteConversation = (_conversation) => {
  deleteConversationDialog.value._id  = _conversation;
  deleteConversationDialog.value.show = true;
};

const closeDeleteConversationDialog = () => {
  deleteConversationDialog.value.show = false;
};


const getConversations = () => {
  loading.value = true;

  useAPI('conversations', {
    method: 'get',
    onResponse({response}) {
      if (response.status === 200) {
        // clear the conversations
        messengerStore.clearConversations();

        response._data.list.forEach((conversation) => {

          // add users of conversation
          if (conversation.memberDetails) {
            conversation.memberDetails.forEach((user) => {
              messengerStore.addUser(user);
            });
          }

          // add conversation to store
          messengerStore.addConversation(conversation);

          // add lastMessage to store
          if (conversation.lastMessage)
            messengerStore.addMessage(conversation.lastMessage);

        });
      }
    }
  });

  loading.value = false;
};

// mounted
onMounted(async () => {
  await nextTick();
  getConversations();
});

</script>

<style scoped>
.listHeight {
  height: calc(100vh - 90px)
}
</style>
