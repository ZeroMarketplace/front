<template>
  <div class="chatContainer">
    <!--   Chat Loading  -->
    <v-overlay
      class="d-flex justify-center align-center"
      v-model="chatLoading"
      :close-on-content-click="false"
      persistent
      contained
    >
      <v-progress-circular size="50" indeterminate></v-progress-circular>
    </v-overlay>

    <!--  Chat background   -->
    <div class="position-absolute bg-secondary h-100 w-100">
      <v-img class="chatBg"></v-img>
    </div>

    <!--   Chat   -->
    <v-slide-x-transition>
      <div class="d-flex flex-column h-100">
        <!-- Header -->
        <div
          v-if="conversation.type"
          class="border d-flex bg-white chatHeader pb-1"
        >
          <v-btn
            v-if="smAndDown"
            @click="closeChat"
            class="mt-2 mr-2"
            variant="text"
            icon
          >
            <v-icon>mdi-arrow-right</v-icon>
          </v-btn>

          <!--   Avatar    -->
          <UserAvatar
            v-if="conversation.type === 'private'"
            class="mr-3"
            :color="contact.color"
            :online="contact.online"
            :firstName="contact.firstName"
            :lastName="contact.lastName"
            :avatars="contact.avatars"
          />

          <!--   Title And Status    -->
          <div class="mr-2 mt-2">
            <!--    Title    -->
            <v-label class="d-block">
              <!--     Private Chat      -->
              <span v-if="conversation.type === 'private'">{{
                getConversationName()
              }}</span>
            </v-label>

            <!--   Status   -->
            <v-label class="d-inline-block text-caption">
              <!--     Private Chat     -->
              <span v-if="conversation.type === 'private'">
                {{ getContactStatus() }}
              </span>
            </v-label>
          </div>

          <!--   Action Icons   -->
          <div class="float-end"></div>
        </div>

        <!--  Chat Content  -->
        <div
          class="flex-grow-1 d-flex flex-column pr-md-6 pb-2 pl-md-4 pt-5 chatContent"
          ref="chatContent"
        >
          <!--     ContextMenu      -->
          <v-menu
            v-model="messageContextMenu.show"
            id="messageContextMenu"
            :style="messageContextMenu.style"
            :min-width="150"
            class="mr-n5"
            absolute
            offset-x
            offset-y
          >
            <v-list>
              <!--       Reply        -->
              <v-list-item
                prepend-icon="mdi-reply-outline"
                @click="replyMessage(messageContextMenu._id)"
                value="download"
              >
                <v-list-item-title>پاسخ</v-list-item-title>
              </v-list-item>

              <!--       Download        -->
              <v-list-item
                v-if="
                  ['video', 'image', 'file', 'audio'].includes(
                    getMessage(messageContextMenu._id).type
                  )
                "
                prepend-icon="mdi-download"
                @click="downloadMessage(messageContextMenu._id)"
                value="download"
              >
                <v-list-item-title>دانلود</v-list-item-title>
              </v-list-item>

              <!--       Edit        -->
              <v-list-item
                v-if="
                  getMessage(messageContextMenu._id).type === 'text' &&
                  getMessage(messageContextMenu._id)._sender === user._id
                "
                prepend-icon="mdi-pencil"
                @click="editMessage(messageContextMenu._id)"
                value="download"
              >
                <v-list-item-title>ویرایش</v-list-item-title>
              </v-list-item>

              <!--       Delete       -->
              <v-list-item
                prepend-icon="mdi-delete"
                class="text-red"
                @click="deleteMessage(messageContextMenu._id)"
                value="delete"
              >
                <v-list-item-title>حذف</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>

          <!--      Scroll To Bottom    -->
          <v-btn
            v-if="scrollToBottomFlag && conversation._id"
            class="scrollToBottom"
            :class="[formTop.action ? 'mb-12 mb-md-16' : 'mb-4']"
            @click="scrollToBottom"
            icon
          >
            <v-icon>mdi-arrow-down</v-icon>
            <v-badge
              v-if="
                conversation._id &&
                messengerStore.conversations[conversation._id].unreadCount
              "
              color="primary"
              class="mt-n12 position-absolute"
              :content="
                messengerStore.conversations[conversation._id].unreadCount
              "
              location="bottom left"
            >
            </v-badge>
          </v-btn>

          <!--     Messages Loading      -->
          <div
            v-if="messagesLoading"
            class="d-flex align-center justify-center"
          >
            <v-progress-circular
              color="white"
              indeterminate
            ></v-progress-circular>
          </div>

          <!--    Spacer for when not enough messages for height of screen      -->
          <v-spacer></v-spacer>

          <!--     Messages    -->
          <div
            v-if="conversation._id && renderMessages"
            v-for="(message, index) in listOfMessages"
            v-intersect="onMessageViewed"
            :data-id="message._id"
            @contextmenu="openMessageContextMenu($event, message._id)"
            class="d-flex mb-1 observerTrigger"
          >
            <v-spacer v-if="message._sender !== user._id"></v-spacer>

            <!--    User Avatar  (self)     -->
            <div class="d-flex flex-column">
              <v-spacer></v-spacer>
              <UserAvatar
                v-if="
                  message._sender === user._id &&
                  (index === listOfMessages.length - 1 ||
                    (listOfMessages[index + 1] &&
                      listOfMessages[index + 1]._sender !== user._id))
                "
                class="mr-1 ml-1"
                size="40"
                :color="user.color"
                :online="true"
                :firstName="user.firstName"
                :lastName="user.lastName"
                :avatars="user.avatars"
              >
              </UserAvatar>
            </div>

            <!--      Message       -->
            <v-card
              class="messageContainer"
              :min-width="
                ['video', 'audio', 'file', 'image'].includes(message.type)
                  ? 250
                  : ''
              "
              :max-width="message.type === 'video' ? '250' : '80%'"
              :class="[
                message._sender === user._id
                  ? 'rounded-bs-lg bg-lime-accent-1'
                  : 'rounded-bs-lg',
                message._sender === user._id &&
                (index === listOfMessages.length - 1 ||
                  (listOfMessages[index + 1] &&
                    listOfMessages[index + 1]._sender !== user._id))
                  ? ''
                  : 'mr-12',
                conversation.type === 'private' &&
                message._sender === contact._id &&
                (index === listOfMessages.length - 1 ||
                  (listOfMessages[index + 1] &&
                    listOfMessages[index + 1]._sender !== contact._id))
                  ? ''
                  : 'ml-12',
                message.type === 'text' ? 'px-4 py-1' : '',
                ['audio', 'file'].includes(message.type) ? 'px-4 py-2' : '',
                ['video', 'image'].includes(message.type)
                  ? 'px-0 pt-0 py-0'
                  : '',
                message.uploading ? 'pb-0' : '',
              ]"
              flat
            >
              <!--      Reply Message        -->
              <MessengerReplyMessage
                v-if="message._replyToMessage"
                class="mr-n4 ml-n5 mt-n1 mb-2"
                :class="
                  message._sender === user._id
                    ? 'bg-lime-accent-2'
                    : 'border-b-lg'
                "
                :_conversation="conversation._id"
                :_message="message._replyToMessage"
              />

              <!--      Attachments         -->
              <FileView
                v-if="message.attachment"
                class="w-100 px-0 py-0 mt-0 mb-n2"
                @show="showFile(message._id)"
                :video-controls="false"
                :video-muted="true"
                :_id="message._id"
                :uploading="message.uploading"
                :downloading="message.downloading"
                :downloaded="message.downloaded"
                :_conversation="conversation._id"
                :_message="message._id"
                :file="message.attachment"
              />

              <!--       Content        -->
              <div v-if="message.content" class="text-subtitle-2 mb-1">
                {{ message.content }}
              </div>

              <!--      Date - Edited - Read        -->
              <div
                v-if="!message.uploading"
                class="float-end mb-n2 ml-n2 messageInfo"
                :class="[
                  message.type === 'text' ? 'mt-n3' : '',
                  ['video', 'image'].includes(message.type)
                    ? 'position-absolute mt-n7 rounded-xl px-2 bg-white'
                    : '',
                ]"
              >
                <!--        Read Status        -->
                <span
                  v-if="message._sender === user._id"
                  class="read mt-1 ml-1"
                >
                  <v-icon v-if="message._readBy.length > 1" size="20"
                    >mdi-check-all</v-icon
                  >
                  <v-icon v-else size="20">mdi-check</v-icon>
                </span>

                <!--        Date        -->
                <v-label class="text-caption time">
                  {{
                    new PersianDate(new Date(message.createdAt))
                      .toLocale("fa")
                      .format("h:mm a")
                  }}
                </v-label>

                <!--       isEdited         -->
                <v-label
                  v-if="message.isEdited"
                  class="text-caption mr-1 isEdited"
                >
                  ویرایش شده
                </v-label>
              </div>
            </v-card>

            <!--    User Avatar    -->
            <div class="d-flex flex-column">
              <v-spacer></v-spacer>
              <UserAvatar
                v-if="
                  message._sender !== user._id &&
                  (index === listOfMessages.length - 1 ||
                    (listOfMessages[index + 1] &&
                      listOfMessages[index + 1]._sender !== message._sender))
                "
                class="mr-1 ml-1"
                size="40"
                :color="messengerStore.users[message._sender].color"
                :online="messengerStore.users[message._sender].online"
                :firstName="messengerStore.users[message._sender].firstName"
                :lastName="messengerStore.users[message._sender].lastName"
                :avatars="messengerStore.users[message._sender].avatars"
              >
              </UserAvatar>
            </div>
          </div>
        </div>

        <!--  Chat Form   -->
        <div
          v-if="conversation.type"
          class="d-flex flex-column mx-0 mx-md-5 mb-n5 mb-md-0"
        >
          <!--      From Top       -->
          <div v-if="formTop.action" class="w-100 bg-white">
            <v-card class="rounded-t-lg mb-n1 pb-2 d-flex">
              <!--       action icon         -->
              <!--       edit         -->
              <v-icon
                v-if="formTop.action === 'edit'"
                class="pr-6 pl-6 pt-6"
                color="secondary"
              >
                mdi-pencil
              </v-icon>

              <!--      reply        -->
              <v-icon
                v-if="formTop.action === 'reply'"
                class="pr-6 pl-6 pt-6"
                color="secondary"
              >
                mdi-reply-outline
              </v-icon>

              <!--        Message         -->
              <MessengerReplyMessage
                class="flex-grow-1"
                :action="formTop.action"
                :_message="getFormTopId()"
                :_conversation="conversation._id"
              />

              <!--       close         -->
              <v-btn type="small" @click="clearFormTop" variant="text" icon>
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </v-card>
          </div>

          <!--     Form     -->
          <v-form class="w-100" @submit.prevent="sendTextMessage" validate-on="submit lazy">
            <v-text-field
              class="elevation-0"
              :rounded="smAndDown ? 0 : formTop.action ? 'b-gl' : 'md'"
              v-model="form.text"
              variant="solo"
              placeholder="پیام خود را بنویسید..."
              autofocus
            >
              <template v-slot:append-inner>
                <div class="d-flex">
                  <!--      Record Sound        -->
                  <v-btn variant="text" size="small" icon>
                    <v-icon size="22">mdi-microphone</v-icon>
                  </v-btn>

                  <!--      File Input      -->
                  <v-file-input
                    v-model="inputFiles"
                    validate-on="input"
                    type="file"
                    class="d-none"
                    ref="filesInput"
                    accept=".jpg,.jpeg,.png,.gif,.bmp,.webp,.mp4,.mov,.avi,.mkv,.webm,.mp3,.ogg,.wav,.flac,.aac,.m4a,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv,.rtf,.zip,.rar,.7z,.tar,.gz,.exe,.apk,.bat"
                    multiple
                  >
                  </v-file-input>

                  <!--      File        -->
                  <v-btn
                    @click="openFileExplore"
                    variant="text"
                    size="small"
                    icon
                  >
                    <v-icon size="22">mdi-paperclip</v-icon>
                  </v-btn>

                  <!--       Send       -->
                  <v-btn
                    color="secondary"
                    :loading="form.loading"
                    @click="sendTextMessage"
                    class="mt-0"
                    size="small"
                    variant="text"
                    type="submit"
                    icon
                  >
                    <!--         Tiny Icon           -->
                    <v-icon color="blue" class="sendIcon mr-1">
                      mdi-send-outline
                    </v-icon>
                  </v-btn>
                </div>
              </template>
            </v-text-field>
          </v-form>
        </div>

        <!--    Upload Files Dialog     -->
        <UploadFilesDialog
          v-model="uploadFileDialog"
          @exit="uploadFileDialog = false"
          @createConversation="createConversation"
          :_conversation="conversation._id"
          :files="inputFiles"
        />

        <!--    DeleteMessageDialog     -->
        <DeleteMessageDialog
          v-model="deleteMessageDialog.show"
          @exit="closeDeleteMessageDialog"
          :_message="deleteMessageDialog._id"
          :_conversation="conversation._id"
        />

        <!--    File Viewer     -->
        <MessengerFileViewer
          v-model="fileViewer"
          @exit="closeFileViewer"
          @nextFile="fileViewerNext"
          @previousFile="fileViewerPrevious"
          :_conversation="conversation._id"
          :_message="fileViewerMessage"
        />
      </div>
    </v-slide-x-transition>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount, nextTick } from "vue";
import { useMessengerStore } from "~/store/messenger";
import { useCookie, useNuxtApp } from "#app";
import UserAvatar from "~/components/messenger/UserAvatar.vue";
import { useDisplay } from "vuetify";
import PersianDate from "persian-date";
import UploadFilesDialog from "~/components/messenger/UploadFilesDialog.vue";
import DeleteMessageDialog from "~/components/messenger/DeleteMessageDialog.vue";
import FileView from "~/components/messenger/FileView.vue";

const emit = defineEmits(["exit"]);
const { $notify, $indexedDB } = useNuxtApp();
const { smAndDown } = useDisplay();
const user = useCookie("user");
const chatLoading = ref(false);
const messengerStore = useMessengerStore();
const form = ref({
  _id: "",
  action: "add",
  text: "",
  _replyToMessage: undefined,
  loading: false,
});
const formTop = ref({
  action: "",
});
const inputFiles = ref([]);
const conversation = ref({
  _id: "",
  type: "",
  members: [],
  _pinnedMessage: undefined,
});
const messagesLoading = ref(false);
const filesInput = ref(null);
const uploadFileDialog = ref(false);
const renderMessages = ref(true);
const fileViewer = ref(false);
const fileViewerMessage = ref(null);
const messageContextMenu = ref({
  show: false,
  _id: undefined,
  x: 0,
  y: 0,
  style: "",
});
const deleteMessageDialog = ref({
  show: false,
  _id: undefined,
});

// if conversation type is private
const contact = ref(null);

const listOfMessages = computed(() => {
  if (messengerStore.messages[conversation.value._id]) {
    const sortedList = Object.entries(
      messengerStore.messages[conversation.value._id]
    )
      .sort(([, a], [, b]) => new Date(a.createdAt) - new Date(b.createdAt))
      .reduce((acc, [key, value]) => {
        acc[key] = value;
        return acc;
      }, {});

    return Object.values(sortedList);
  } else {
    return [];
  }
});

// open File Input (File Explore)
const openFileExplore = () => {
  filesInput.value.click();
};

// close chat in smAndDown
const closeChat = () => {
  emit("exit");
};

// get conversation name in different type of conversations
const getConversationName = () => {
  switch (conversation.value.type) {
    case "private":
      if (contact.value) {
        return contact.value.firstName + " " + contact.value.lastName;
      }
      break;
  }
};

const getLastSeenText = (lastSeen) => {
  if (lastSeen) {
    if (lastSeen === "recently") {
      return "آخرین بازدید اخیرا";
    } else {
      const nowDate = new PersianDate();
      const updatedAt = new PersianDate(new Date(lastSeen));

      // check year
      if (updatedAt.year() === nowDate.year()) {
        // check month
        if (updatedAt.month() === nowDate.month()) {
          // check day
          if (updatedAt.day() === nowDate.day()) {
            return "آخرین بازدید " + updatedAt.toLocale("fa").format("h:mm a");
          } else {
            return "آخرین بازدید " + updatedAt.toLocale("fa").format("D MMMM");
          }
        } else {
          return "آخرین بازدید " + updatedAt.toLocale("fa").format("D MMMM");
        }
      } else {
        return "آخرین بازدید " + updatedAt.toLocale("fa").format("D MMMM YYYY");
      }
    }
  } else {
    return "آخرین بازدید اخیرا";
  }
};

// get contact status in private chats
const getContactStatus = () => {
  if (
    contact.value.status.operation &&
    contact.value.status._conversation === conversation.value._id
  ) {
    switch (contact.value.status.operation) {
      case "isTyping":
        return "در حال نوشتن...";
        break;
    }
  } else {
    if (contact.value.online) {
      return "آنلاین";
    } else {
      return getLastSeenText(contact.value.lastSeen);
    }
  }
};

// get conversation messages
const getMessages = async () => {
  messagesLoading.value = true;

  try {
    const data = await useApiService.get(
      "conversations/" + conversation.value._id + "/messages"
    );
    if (data) {
      messengerStore.clearMessages(conversation.value._id);
      data.list.forEach((message) => {
        messengerStore.addMessage(message);
      });
    }
  } catch (error) {
    console.log("Error fetching messages:", error);
  }

  messagesLoading.value = false;
};

// create conversation when is not exist
const createConversation = async () => {
  let body = {};

  switch (conversation.value.type) {
    case "private":
      body.type = conversation.value.type;
      body.contact = contact.value._id;
      break;
  }

  try {
    const data = await useApiService.post("conversations", body);
    if (data) {
      messengerStore.addConversation(data);
      setConversation(data._id);
    }
  } catch (error) {
    console.log("Error creating conversation:", error);
  }
};

// send text message
const sendTextMessage = async () => {
  if (form.value.text) {
    form.value.loading = true;
    // add a new Text Message
    if (form.value.action === "add") {
      // wait for create conversation
      if (!conversation.value._id) {
        await createConversation();
      }

      try {
        const data = await useApiService.post(
          "conversations/" + conversation.value._id + "/messages",
          {
            type: "text",
            content: form.value.text,
            _replyToMessage: form.value._replyToMessage,
          }
        );
        if (data) {
          form.value.text = "";
          clearFormTop();
          messengerStore.addMessage(data);
          form.value.loading = false;
        }
      } catch (error) {
        $notify("مشکلی در ارسال پیام به وجود آمد", "error");
        form.value.loading = false;
      }
    } else if (form.value.action === "edit") {
      try {
        const data = await useApiService.put(
          "conversations/" +
            conversation.value._id +
            "/messages/" +
            form.value._id,
          {
            content: form.value.text,
          }
        );
        if (data) {
          form.value.text = "";
          messengerStore.addMessage(data);
          form.value.loading = false;
          clearFormTop();
        }
      } catch (error) {
        $notify("مشکلی در ویرایش پیام به وجود آمد", "error");
        form.value.loading = false;
      }
    } else {
      $notify("عملیات مشخص نیست", "error");
      form.value.loading = false;
    }
  }
};

// set contact (call from messenger for set receiver)
const setContact = (userId) => {
  conversation.value = {};
  conversation.value.type = "private";
  contact.value = messengerStore.users[userId];

  // find for conversation
  const conversationFound = Object.values(messengerStore.conversations).find(
    (cn) =>
      cn.type === "private" && cn.members.find((user) => user._id === userId)
  );

  if (conversationFound) setConversation(conversationFound._id);
};

// set conversation (call from messenger of createConversation)
const setConversation = (conversationId) => {
  if (messengerStore.conversations[conversationId]) {
    conversation.value = messengerStore.conversations[conversationId];

    // private chats need contact
    switch (conversation.value.type) {
      case "private":
        let contactFound = conversation.value.members.find(
          (member) => member._id !== user.value._id
        );
        if (contactFound) {
          contact.value = messengerStore.users[contactFound._id];
        }
        break;
    }

    scrollToBottom();
  } else {
    console.log("conversation is not exist");
  }
};

// request for read message
const readMessage = async (messageId) => {
  try {
    const data = await useApiService.put(
      "conversations/" +
        conversation.value._id +
        "/messages/" +
        messageId +
        "/read"
    );
    if (data) {
      // read message in the store
      messengerStore.readMessage(
        {
          _id: messageId,
          _conversation: conversation.value._id,
        },
        user.value._id
      );

      // minus unreadCount
      messengerStore.changeReadCount(conversation.value._id, "minus");
    }
  } catch (error) {
    console.log("Error reading message:", error);
  }
};

// set intersect for messages (read)
const onMessageViewed = (target) => {
  const messageId = target.getAttribute("data-id");
  // check message is not for user and never viewed before
  if (
    messengerStore.messages[conversation.value._id][messageId]._sender !==
      user.value._id &&
    !messengerStore.messages[conversation.value._id][
      messageId
    ]._readBy.includes(user.value._id)
  ) {
    readMessage(messageId);
  }

  // download the file
  if (
    ["video", "audio", "image"].includes(
      messengerStore.messages[conversation.value._id][messageId].type
    )
  ) {
    messengerStore.enableDownload({
      _id: messageId,
      _conversation: conversation.value._id,
    });
  }
};

// File Viewer Methods

const showFile = (messageId) => {
  fileViewerMessage.value = messageId;
  fileViewer.value = true;
};

const closeFileViewer = () => {
  fileViewerMessage.value = null;
  fileViewer.value = false;
};

const conversationFiles = computed(() => {
  let list = Object.entries(messengerStore.messages[conversation.value._id])
    .sort(([, a], [, b]) => new Date(a.createdAt) - new Date(b.createdAt))
    .reduce((acc, [key, value]) => {
      acc[key] = value;
      return acc;
    }, {});

  return Object.values(list).filter((message) =>
    ["image", "video"].includes(message.type)
  );
});

const fileViewerMessageIndex = computed(() => {
  return conversationFiles.value.indexOf(
    messengerStore.messages[conversation.value._id][fileViewerMessage.value]
  );
});

const fileViewerNext = () => {
  fileViewerMessage.value =
    conversationFiles.value[fileViewerMessageIndex.value + 1]._id;
};

const fileViewerPrevious = () => {
  fileViewerMessage.value =
    conversationFiles.value[fileViewerMessageIndex.value - 1]._id;
};

const openMessageContextMenu = async (event, messageId) => {
  event.preventDefault();
  messageContextMenu.value._id = messageId;
  messageContextMenu.value.x = event.clientX;
  messageContextMenu.value.y = event.clientY;
  messageContextMenu.value.style = {
    right: `${window.innerWidth - messageContextMenu.value.x}px`,
    top: `${messageContextMenu.value.y}px`,
  };
  messageContextMenu.value.show = true;
};

const getMessage = (messageId) => {
  return (
    messengerStore.messages[conversation.value._id][messageId] ?? undefined
  );
};

// download message
const downloadMessage = async (messageId) => {
  let message = getMessage(messageId);
  await $indexedDB.loadFile(message.attachment.file).then(
    (blob) => {
      // ایجاد URL موقت از Blob
      const url = window.URL.createObjectURL(blob);

      // ایجاد لینک دانلود
      const link = document.createElement("a");
      link.href = url;
      link.download = message.attachment.name;

      // کلیک خودکار روی لینک برای شروع دانلود
      document.body.appendChild(link);
      link.click();

      // پاک کردن لینک از DOM و آزاد کردن URL
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    },
    (error) => {
      messengerStore.enableDownload({
        _id: messageId,
        _conversation: conversation.value._id,
      });
    }
  );
};

// delete message
const deleteMessage = (messageId) => {
  deleteMessageDialog.value._id = messageId;
  deleteMessageDialog.value.show = true;
};

const closeDeleteMessageDialog = () => {
  deleteMessageDialog.value.show = false;
};

const editMessage = (_message) => {
  formTop.value.action = "edit";
  form.value._id = _message;
  form.value.text = getMessage(_message).content;
  form.value.action = "edit";
};

const replyMessage = (_message) => {
  form.value._replyToMessage = _message;
  if (formTop.value.action !== "edit") {
    formTop.value.action = "reply";
  }
};

const clearFormTop = () => {
  if (formTop.value.action === "edit") {
    if (form.value._replyToMessage) {
      formTop.value.action = "reply";
    } else {
      formTop.value.action = "";
    }
    form.value._id = undefined;
    form.value.text = "";
    form.value.action = "add";
  } else if (formTop.value.action === "reply") {
    form.value._replyToMessage = undefined;
    formTop.value.action = "";
  }
};

const getFormTopId = () => {
  return formTop.value.action === "edit"
    ? form.value._id
    : form.value._replyToMessage;
};

const chatContent = ref(null);
const scrollPosition = ref(0);
const scrollToBottomFlag = ref(false);
// handle chat scroll
const handleChatScroll = () => {
  const scrollTop = chatContent.value.scrollTop;
  const scrollHeight = chatContent.value.scrollHeight;
  const clientHeight = chatContent.value.clientHeight;

  // scroll percent
  scrollPosition.value = (scrollTop / (scrollHeight - clientHeight)) * 100;

  // change scrollToBottom flag
  scrollToBottomFlag.value = scrollPosition.value < 95;
};

// scroll to bottom
const scrollToBottom = () => {
  chatContent.value.scrollTop = chatContent.value.scrollHeight;
};

// watch messenger store
messengerStore.$onAction(({ name, store, args }) => {
  // switch between actions
  switch (name) {
    case "addMessage":
      if (
        conversation.value._id &&
        args[0]._conversation === conversation.value._id
      ) {
        if (!scrollToBottomFlag.value) {
          setTimeout(() => {
            scrollToBottom();
          }, 100);
        }
      }
      break;
    case "deleteMessage":
      if (
        conversation.value._id &&
        args[0]._conversation === conversation.value._id
      ) {
        let scrollTop = chatContent.value.scrollTop;
        renderMessages.value = false;
        nextTick(() => {
          renderMessages.value = true;
          nextTick(() => {
            chatContent.value.scrollTop = scrollTop;
          });
        });

        // check replyMessage or editMessage
        // edit
        if (args[0]._id === form.value._id) {
          clearFormTop();
        }
        // reply
        if (args[0]._id === form.value._replyToMessage) {
          clearFormTop();
        }
      }
      break;
    case "deleteConversation":
      if (conversation.value._id && args[0] === conversation.value._id) {
        conversation.value = {
          _id: "",
          type: "",
          members: [],
          _pinnedMessage: undefined,
        };
      }
      break;
  }
});

// mount
// onMounted(() => {
//   nextTick(() => {
//     if (chatContent.value) {
//       chatContent.value.addEventListener('scroll', handleChatScroll)
//     }
//   })
// })

// beforeUnmount
// onBeforeUnmount(() => {
//   if (chatContent.value) {
//     chatContent.value.removeEventListener('scroll', handleChatScroll);
//   }
// });

// watch
// conversation
watch(conversation, () => {
  // load conversation messages
  if (conversation.value._id) getMessages();
});

// files Input
watch(inputFiles, (value) => {
  let valid = true;

  // check the extension and size of files
  if (value)
    value.forEach((file) => {
      // Allowing file types
      const acceptedFormats = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/bmp",
        "image/webp",
        "video/mp4",
        "video/quicktime",
        "video/x-msvideo",
        "video/x-matroska",
        "video/webm",
        "audio/mpeg",
        "audio/ogg",
        "audio/wav",
        "audio/flac",
        "audio/aac",
        "audio/mp4",
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/vnd.ms-powerpoint",
        "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        "text/plain",
        "text/csv",
        "application/rtf",
        "application/zip",
        "application/x-rar-compressed",
        "application/x-7z-compressed",
        "application/x-tar",
        "application/gzip",
        "application/x-msdownload",
        "application/vnd.android.package-archive",
        "application/x-msdos-program",
      ];

      // check format
      if (!acceptedFormats.includes(file.type)) {
        // show error
        $notify("فرمت فایل " + file.name + " قابل قبول نیست", "error");
        valid = false;
        return [];
      }

      // check size
      if ((file.size / 1024 / 1024).toFixed(2) > 2048) {
        // show error
        $notify("اندازه فایل بیش از حد مجاز است", "error");
        valid = false;
        return [];
      }
    });

  // upload files if all files is valid
  if (valid) {
    uploadFileDialog.value = true;
  }
});

defineExpose({
  setContact,
  setConversation,
});
</script>

<style lang="scss" scoped>
.chatContainer {
  height: 90vh;

  .chatBg {
    z-index: 0;
    position: absolute;
    width: 100%;
    height: 100%;
    background-image: url("/img/chatbg.png");
    background-repeat: repeat;
    opacity: 40%;
  }

  .chatHeader {
    z-index: 2;
  }

  .chatContent {
    z-index: 2;
    overflow-y: auto;
    height: 50vh;

    .scrollToBottom {
      position: fixed;
      z-index: 3;
      bottom: 70px;
      margin-right: 1rem;
    }

    .messageContainer {
      .messageInfo {
        left: 10px;

        .isEdited {
          font-size: 0.6rem !important;
        }

        .time {
          font-size: 0.6rem !important;
        }
      }
    }
  }

  .sendIcon {
    transform: rotate(180deg);
  }
}
</style>
