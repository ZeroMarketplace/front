<template>
  <v-row class="bg-white ma-0 mb-0 pa-0 rounded elevation-1 messengerContainer">

    <!--  List   -->
    <v-col v-show="!smAndDown || pageAction === 'list'"
           class="border px-0 overflow-hidden"
           cols="12"
           md="3">


      <!--   Chats List    -->
      <v-slide-x-transition>
        <Conversations v-show="listAction === 'chats'"
                       @select="onConversationSelected"
                       @contacts="changeListAction('contacts')">
        </Conversations>
      </v-slide-x-transition>


      <!--   Contacts List   -->
      <v-slide-x-reverse-transition>
        <Contacts @exit="changeListAction('chats')"
                  @select="onContactSelected"
                  v-show="listAction === 'contacts'"/>
      </v-slide-x-reverse-transition>

    </v-col>

    <!--  Chat   -->
    <v-col v-show="!smAndDown || pageAction === 'chat'"
           class="position-relative border py-0 px-0 overflow-hidden"
           cols="12"
           md="9">
      <Chat ref="chat" @exit="changePageAction('list')"/>
    </v-col>

  </v-row>
</template>

<script setup>
import {ref, onBeforeMount, onMounted} from "vue";
import {useDisplay}                    from "vuetify";
import Chat                            from "~/components/messenger/Chat.vue";
import Contacts                        from "~/components/messenger/Contacts.vue";
import Conversations                   from "~/components/messenger/Conversations.vue";
import {useCookie, useNuxtApp}         from "#app";
import {useMessengerStore}             from "~/store/messenger";

definePageMeta({
  layout      : 'default',
  middleware  : ['auth'],
  requiresAuth: true,
  // requiresRole: 'admin'
});

// get Nuxt App Functions
const {$socketConnection} = useNuxtApp();
const socketConnection    = ref(null);

// get user from Cookie
const user = useCookie('user');

// get messenger store
const messengerStore = useMessengerStore();

// create page action with screen size
const {smAndDown} = useDisplay();
// page action can be list or chat
const pageAction  = ref('');

// tablet actions is list (at first)
if (smAndDown) {
  if (!pageAction.value)
    pageAction.value = 'list';
}

// list action can be chats or contacts
const listAction = ref('chats');

// chat app ref
const chat = ref(null);

const changeListAction = (action) => {
  listAction.value = action;
};

const changePageAction = (action) => {
  pageAction.value = action;
};

// on contact selected from contacts list
const onContactSelected = (contact) => {
  chat.value.setContact(contact._id);
  changePageAction('chat');
};

// on contact selected from contacts list
const onConversationSelected = (conversation) => {
  chat.value.setConversation(conversation._id);
  changePageAction('chat');
};

// listen to store

// check users online
let checkedUsers = [];
messengerStore.$onAction(({name, store, args}) => {
  switch (name) {
    case "addUser":
      if (!checkedUsers.includes(args[0]._id)) {
        socketConnection.value.emit('get:users:online', {
          _user: args[0]._id
        });

        // add to checked users
        checkedUsers.push(args[0]._id);
      }
      break
  }
});


// on before mount
onBeforeMount(() => {
  // clear the recent uploads
  messengerStore.clearUploads();
  messengerStore.clearDownloads();
});

onMounted(() => {
  // get socket connection
  socketConnection.value = $socketConnection.get();

  // init socket events
  // Messages Events
  socketConnection.value.on('messages:insert', (message) => {
    // add message
    messengerStore.addMessage(message);

    // add unread Counts
    messengerStore.changeReadCount(message._conversation, 'add');
  });

  socketConnection.value.on('messages:read', (message) => {
    messengerStore.readMessage(message, message._user);
  });

  socketConnection.value.on('messages:update', (message) => {
    // add message
    messengerStore.addMessage(message);
  });

  socketConnection.value.on('messages:delete', (message) => {
    messengerStore.deleteMessage({
      _id          : message._id,
      _conversation: message._conversation
    })
  });

  // Conversations Events
  socketConnection.value.on('conversations:insert', (conversation) => {
    // add users of conversation
    if (conversation.memberDetails) {
      conversation.memberDetails.forEach((user) => {
        messengerStore.addUser(user);
      });
    }

    messengerStore.addConversation(conversation);
  });

  // Users Events
  socketConnection.value.on('users:online', (userOnline) => {
    messengerStore.setUserOnline(userOnline);
  });
});


// watch screen size changed to tablet or smaller
watch(smAndDown, (newValue) => {
  if (newValue) {
    if (!pageAction.value)
      pageAction.value = 'list';
  }
});

</script>

<style scoped>
.messengerContainer {
  height: 100vh;
  box-sizing: border-box;
  overflow: hidden;
}
</style>
