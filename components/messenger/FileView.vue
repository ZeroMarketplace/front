<template>
  <div class="d-flex w-100" :class="[
      type === 'file' ? 'my-5' : ''
  ]">
    <!-- file loading progress  -->
    <v-progress-circular v-if="loading && type === 'file'"
                         v-model="getLoadProgress"
                         color="secondary"
                         size="40"
                         class="mt-n1">
      <v-icon color="secondary" @click="cancelLoading">mdi-close</v-icon>
    </v-progress-circular>

    <!--  File Avatar   -->
    <v-avatar v-if="!loading && type === 'file' && src" size="40" color="secondary" icon>
      <v-icon>mdi-file</v-icon>
    </v-avatar>

    <!--  Download Avatar   -->
    <v-avatar v-if="!loading && type === 'file' && !src"
              @click="download"
              size="40"
              color="secondary"
              icon>
      <v-icon>mdi-download</v-icon>
    </v-avatar>

    <!--  File Name And Size   -->
    <div v-if="type === 'file'" class="d-flex flex-column mx-2">
      <!--  File Name    -->
      <v-label class="fileName text-subtitle-2">{{ props.file.name }}</v-label>

      <!--   File Size    -->
      <v-label class="text-secondary text-caption">{{ size }}</v-label>
    </div>

    <!--   Delete Button    -->
    <v-spacer v-if="type === 'file'"></v-spacer>
    <v-btn v-if="props.delete && type === 'file'"
           class="float-end"
           @click="deleteFile"
           variant=""
           size="small"
           icon>
      <v-icon color="red">mdi-delete</v-icon>
    </v-btn>

    <!-- Image File And Video File when downloading  -->
    <v-img v-if="type === 'image' || (type === 'video' && !src)"
           @click="emitShow"
           class="mt-n2 w-100 h-100"
           min-height="150"
           :src="src">

      <!--   Delete Button    -->
      <v-btn v-if="props.delete"
             class="float-end"
             @click="deleteFile"
             variant=""
             size="small"
             icon>
        <v-icon color="red">mdi-delete</v-icon>
      </v-btn>

      <!--   middle icons    -->
      <div class="d-flex justify-center align-center middleControllers">

        <!--  Download Avatar   -->
        <v-avatar v-if="!loading && !src"
                  @click="download"
                  size="40"
                  color="secondary"
                  icon>
          <v-icon>mdi-download</v-icon>
        </v-avatar>

        <!-- loading progress  -->
        <v-progress-circular v-if="loading"
                             v-model="getLoadProgress"
                             class=""
                             color="secondary"
                             size="40">
          <v-icon color="secondary" @click="cancelLoading">mdi-close</v-icon>
        </v-progress-circular>
      </div>
    </v-img>

    <!--  Video File when downloaded   -->
    <div v-if="type === 'video' && src && !videoControls"
         class="d-flex justify-center align-center w-100 h-100 position-absolute videoControls">

      <!-- loading progress  -->
      <v-progress-circular v-if="loading"
                           v-model="getLoadProgress"
                           class=""
                           color="secondary"
                           size="40">
        <v-icon color="secondary" @click="cancelLoading">mdi-close</v-icon>
      </v-progress-circular>

      <v-btn v-if="!loading" @click="emitShow"
             class="w-100 h-100"
             size="small"
             variant="text"
             stacked>
        <v-icon color="white">mdi-play</v-icon>
      </v-btn>
    </div>
    <VideoPlayer @click="emitShow" v-if="type === 'video' && src" :src="src" :options="videoOptions"/>

    <!-- Video element used for thumbnail generation -->
<!--    <video v-if="type === 'video'" ref="thumbnailVideo" class="d-none"></video>-->


  </div>
</template>

<script setup>
import {ref, onMounted, onBeforeMount, watch, nextTick} from "vue";
import {useMessengerStore}                              from "~/store/messenger";
import {useNuxtApp}                                     from "#app";
import axios                                            from "axios";
import {da}                                             from "vuetify/locale";

// define props
const props                = defineProps({
  file         : {
    required: true
  },
  delete       : {
    type   : Boolean,
    default: false
  },
  uploading    : {
    type   : Boolean,
    default: false
  },
  downloading  : {
    type   : Boolean,
    default: false
  },
  downloaded   : {
    type   : Boolean,
    default: false
  },
  _message     : {
    type: String
  },
  _conversation: {
    type: String
  },
  videoControls: {
    type   : Boolean,
    default: false
  },
  videoMuted   : {
    type   : Boolean,
    default: true
  }
});
const config               = useRuntimeConfig();
const emit                 = defineEmits(['delete', 'show']);
const {$axios, $indexedDB} = useNuxtApp();
const messengerStore       = useMessengerStore();
const loading              = ref(false);
const progress             = ref(0);
const loadedBytes          = ref(0);
const cancelTokenSource    = ref(null);
const type                 = ref('file');
const size                 = ref('');
const src                  = ref(null);
// const thumbnailVideo       = ref(null);
const videoOptions         = ref({
  type    : 'video/mp4',
  autoplay: true,
  loop    : {active: true}
});

// get load progress
const getLoadProgress = computed(() => {
  if (props.uploading) {
    return messengerStore.uploads[props._message].uploadedProgress;
  } else {
    return messengerStore.downloads[props._message].downloadedProgress;
  }
});

const getBlobOfFile = (file, callback) => {
  let fileReader = new FileReader();
  fileReader.readAsDataURL(file);
  fileReader.onload = (e) => {
    callback(e.target.result);
  };
};

// get size text
const getSizeText = (size) => {
  if (size === 0) return '0 بایت';
  const k     = 1024;
  const sizes = ['بایت', 'کیلوبایت', 'مگابایت', 'گیگابایت', 'ترابایت'];
  const i     = Math.floor(Math.log(size) / Math.log(k));
  return parseFloat((size / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// const thumbnailVideo    = ref(null);
// const generateThumbnail = (file, callback) => {
//   const canvas = document.createElement('canvas')
//   const ctx    = canvas.getContext('2d')
//
//   thumbnailVideo.value.src = file;
//
//
//   thumbnailVideo.value.onloadedmetadata = async () => {
//     canvas.width  = thumbnailVideo.value.videoWidth
//     canvas.height = thumbnailVideo.value.videoHeight
//
//     thumbnailVideo.value.currentTime = 1 // Move to 1 second to avoid black frame at the very start
//   }
//
//   thumbnailVideo.value.onseeked = () => {
//     ctx.drawImage(thumbnailVideo.value, 0, 0, canvas.width, canvas.height)
//     canvas.toBlob((blob) => {
//       if (blob) {
//         callback(blob)
//       }
//     }, 'image/jpeg')
//   }
// };

const deleteFile = () => {
  emit('delete');
};

const emitShow = () => {
  emit('show');
}

const cancelLoading = () => {
  if (props.uploading) {
    // abort the upload
    messengerStore.uploads[props._message].controller.abort();
    loading.value = false;
    nextTick(() => {
      messengerStore.deleteUpload({
        _message: props._message
      });
    });
  } else {
    if (messengerStore.downloads[props._message].cancelToken) {
      loading.value = false;
      messengerStore.downloads[props._message].cancelToken.cancel();
      nextTick(() => {
        messengerStore.deleteDownload(props._message);
      });
    }
  }
};

const setSrc = (data) => {
  switch (type.value) {
    case 'image':
      src.value = URL.createObjectURL(data);
      break;
    case 'video':
      videoOptions.value.type = data.type;
      src.value               = data;
    case 'file':
      src.value = data;
      break;
  }
};

const download = async () => {
  // check if file saved in localStorage
  // check file database for file
  await $indexedDB.loadFile(props.file.file).then(
      (blob) => {
        // founded
        setSrc(blob);
      },
      async (error) => {
        // file not founded so download it
        // check download is running
        if (messengerStore.downloads[props._message]) {
          loading.value = true;
        } else {
          // create download
          let cancelToken = axios.CancelToken.source();
          messengerStore.addDownload({
            _message          : props._message,
            _conversation     : props._conversation,
            cancelToken       : cancelToken,
            downloadedBytes   : 0,
            downloadedProgress: 0
          });

          // download the file
          await $axios.get(
              config.public.API_BASE_URL +
              'conversations/' + props._conversation
              + '/files/' + props.file.file,
              {
                cancelToken       : cancelToken.token,
                responseType      : 'blob',
                onDownloadProgress: (progressEvent) => {
                  messengerStore.updateDownloadProgress(props._message, {
                    downloadedBytes   : progressEvent.loaded,
                    downloadedProgress: Math.round((progressEvent.loaded * 100) / progressEvent.total)
                  });
                }
              }
          ).then(async (response) => {
            if (response.status === 200) {
              // set the data
              setSrc(response.data);

              // set downloading false
              loading.value = false;

              // save file in database
              await $indexedDB.saveFile(props.file.file, response.data);

              // set message Downloaded
              messengerStore.setDownloadState(props._conversation, props._message, true);

              // delete download
              nextTick(() => {
                messengerStore.deleteDownload(props._message);
              });
            }
          }).catch((error) => {
            // set downloading false
            loading.value = false;

            // delete download
            nextTick(() => {
              messengerStore.deleteDownload(props._message);
            });
          });
        }
      }
  );
};

onBeforeMount(() => {

  // check format
  if (props.file.type.startsWith('image/')) {
    type.value = 'image';
  } else if (props.file.type.startsWith('video/')) {
    type.value = 'video';
  } else if (props.file.type.startsWith('audio/')) {
    // exception (Audio player is not ready)
    type.value = 'file';
  } else {
    type.value = 'file';
  }

  // get the file size
  size.value = getSizeText(props.file.size);

  // set the loading
  if (props.uploading) {
    loading.value = true;
  }

  // set the video options
  if (props.videoControls) {
    videoOptions.value.controls = [
      'play-large', 'play', 'progress', 'current-time', 'mute', 'volume', 'captions', 'settings',
      'pip', 'airplay'
    ];
  }
  // set muted
  videoOptions.value.muted = props.videoMuted;
  if (props.videoMuted) {
    videoOptions.value.volume = 0;
  }
});

onMounted(() => {
  // create src for images
  switch (type.value) {
    case 'image':
      if (props.file instanceof File) {
        src.value = URL.createObjectURL(props.file);
      }
      break;
    case 'video':
      if (props.file instanceof File) {
        videoOptions.value.type = props.file.type;
        src.value = URL.createObjectURL(props.file);
      }
      break;
  }
});

watch(() => props.downloading, (newValue, oldValue) => {
  if (!oldValue && newValue && !(props.file instanceof File)) {
    // start download
    download();

    // disable downloading (for next view)
    messengerStore.disableDownload({
      _id          : props._message,
      _conversation: props._conversation
    });
  }
});

watch(() => props.downloaded, (newValue, oldValue) => {
  if (newValue && !src.value) {
    // start download (get file from storage)
    loading.value = false;
    download();
  }
});

watch(() => messengerStore.downloads[props._message], (newValue, oldValue) => {
  if (newValue) {
    // start download (get file from storage)
    loading.value = true;
  } else {
    loading.value = false;
  }
});

defineExpose({
  download
});

</script>

<style scoped>
.fileName {
  direction: ltr;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 150px;
}

.videoControls {
  z-index: 1;
}

.middleControllers {
  height: 100%;
}
</style>