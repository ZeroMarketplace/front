<template>
  <v-sheet class="d-flex flex-column pr-2 pr-md-2 pl-5"
           border="s-lg secondary">
    <!--         Action or sender name         -->
    <v-label class="text-caption text-secondary mt-1">
      <span v-if="action === 'edit'">ویرایش</span>
      <span v-if="action === 'reply' && (getMessageUser())">
         {{ getMessageUser().firstName + ' ' + getMessageUser().lastName }}
      </span>
    </v-label>

    <v-label v-if="message" class="text-subtitle-2 replyText">
      <!--        Text            -->
      <v-span v-if="message.type === 'text'" v-html="message.content"></v-span>
      <!--        Image            -->
      <v-span v-if="message.type === 'image'">تصویر</v-span>
      <!--        Video            -->
      <v-span v-if="message.type === 'video'">تصویر</v-span>
      <!--        Audio            -->
      <v-span v-if="message.type === 'audio'">صدا</v-span>
      <!--        File            -->
      <v-span v-if="message.type === 'file'">فایل</v-span>
    </v-label>

    <v-label v-else>پیام حذف شده</v-label>

  </v-sheet>
</template>

<script setup>

// define props
import {useMessengerStore} from "~/store/messenger";
import {useCookie}         from "#app";

const props = defineProps({
  action       : {
    type   : String,
    default: 'reply'
  },
  _message     : {
    type: String
  },
  _conversation: {
    type: String
  },
});

const messengerStore = useMessengerStore();
const user           = useCookie('user');

const message = computed(() => {
  if (props._message && props._conversation) {
    return messengerStore.messages[props._conversation][props._message];
  } else {
    return undefined;
  }
});

const getMessageUser = () => {
  if (message.value) {
    if (message.value._sender === user.value._id) {
      return user.value;
    } else {
      if (messengerStore.users[message.value._sender]) {
        return messengerStore.users[message.value._sender];
      } else {
        return undefined;
      }
    }
  } else {
    return {
      firstName: 'پیام حذف شده',
      lastName: ''
    };
  }
};


</script>

<style scoped>
.replyText {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 150px;
}
</style>