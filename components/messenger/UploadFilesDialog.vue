<template>
  <v-dialog width="350">
    <v-card class="rounded-lg">
      <v-card-title>
        <span>{{ files.length }}</span>
        فایل انتخاب شده
      </v-card-title>

      <!--  Files Preview  -->
      <div class="filesPreviewContainer px-3">
        <FileView
          v-for="(file, index) in files"
          :file="file"
          :delete="true"
          :video-controls="true"
          @delete="deleteFile(index)"
        />
      </div>

      <!--   Actions    -->
      <div class="pb-0 px-5 mt-0 mb-3 py-0 d-flex flex-column w-100">
        <!--    Text     -->
        <v-text-field
          class="rounded-0 py-0"
          v-model="text"
          variant="underlined"
          placeholder="پیام خود را بنویسید..."
          autofocus
        >
        </v-text-field>

        <!--    Buttons     -->
        <div>
          <!--     Send      -->
          <v-btn color="secondary" @click="submit">ارسال</v-btn>

          <!--     cancel     -->
          <v-btn class="mx-2 text-white" @click="closeDialog" variant="outlined"
            >انصراف
          </v-btn>
        </div>
      </div>
    </v-card>
  </v-dialog>
</template>

<script setup>
import FileView from "~/components/messenger/FileView.vue";
import { nextTick, ref, watch } from "vue";
import { useCookie, useNuxtApp } from "#app";
import { useMessengerStore } from "~/store/messenger";

// define props
const props = defineProps({
  files: {
    type: Array,
    default: [],
  },
  _conversation: {
    type: String,
    required: true,
  },
});

// define emits
const emit = defineEmits(["exit", "createConversation"]);

const messengerStore = useMessengerStore();
const { $notify, $axios, $indexedDB } = useNuxtApp();
const user = useCookie("user");
const text = ref("");
const waitForCreateConversation = ref(false);

const deleteFile = (index) => {
  props.files.splice(index, 1);
  if (!props.files.length) {
    emit("exit");
  }
};

const closeDialog = () => {
  emit("exit");
};

const submit = () => {
  if (props.files.length) {
    // check conversation exists
    if (!props._conversation) {
      waitForCreateConversation.value = true;
      emit("createConversation");
      return;
    }

    // send the text and upload every file as a message
    // send text
    if (text.value) sendTextMessage(text.value);
    // upload every file as a message
    props.files.forEach((file, index) => {
      uploadFile(file);
    });

    emit("exit");
  } else {
    $notify("لطفا فایلی را برای ارسال انتخاب کنید", "error");
  }
};

const generateMessageId = () => {
  const timestamp = Date.now().toString();
  const random = Math.floor(Math.random() * 1000000000).toString();
  return (timestamp + random).slice(0, 15);
};

const uploadFile = async (file) => {
  // get the type of file
  let type;
  if (file.type.startsWith("image/")) {
    type = "image";
  } else if (file.type.startsWith("video/")) {
    type = "video";
  } else if (file.type.startsWith("audio/")) {
    type = "audio";
  } else {
    type = "file";
  }

  // create date
  let date = new Date().toISOString();

  // create message _id
  let messageId = generateMessageId();

  // create upload message
  let message = {
    _id: messageId,
    _conversation: props._conversation,
    type: type,
    _sender: user.value._id,
    createdAt: date,
    updatedAt: date,
    _readBy: [user.value._id],
    attachment: file,
    uploading: true,
  };

  // add uploading message
  messengerStore.addMessage(message);

  // create upload controller
  const controller = new AbortController();
  const signal = controller.signal;

  // create the upload
  messengerStore.addUpload({
    _message: messageId,
    _conversation: props._conversation,
    controller: controller,
    uploadedBytes: 0,
    uploadedProgress: 0,
  });

  let data = new FormData();
  data.append("file", file);

  await $axios
    .post("conversations/" + props._conversation + "/files", data, {
      onUploadProgress: (progressEvent) => {
        messengerStore.updateUploadProgress(messageId, {
          uploadedBytes: progressEvent.loaded,
          uploadedProgress: Math.round(
            (progressEvent.loaded / progressEvent.total) * 100
          ),
        });
      },
      signal,
    })
    .then(async (response) => {
      if (response.status === 200) {
        // delete upload message
        messengerStore.deleteMessage({
          _id: messageId,
          _conversation: props._conversation,
        });

        // delete uploader
        messengerStore.deleteUpload({
          _message: messageId,
        });

        // save file in localStorage
        await $indexedDB.saveFile(
          response.data.attachment.file,
          new Blob([file], { type: file.type })
        );

        // add the uploaded message
        nextTick(() => {
          messengerStore.addMessage(response.data);
        });
      }
    });
};

// send text message
const sendTextMessage = async (content) => {
  // add a new Text Message
  if (content && props._conversation) {
    try {
      const data = await useApiService.post(
        "conversations/" + props._conversation + "/messages",
        {
          type: "text",
          content: content,
        }
      );
      if (data) {
        messengerStore.addMessage(data);
      }
    } catch (error) {
      console.log("Error sending text message:", error);
    }
  }
};

watch(
  () => props._conversation,
  (newValue, oldValue) => {
    if (!oldValue && newValue && waitForCreateConversation.value) {
      submit();
    }
  }
);
</script>

<style scoped>
.filesPreviewContainer {
  max-height: 50vh;
  overflow-y: auto;
}
</style>
