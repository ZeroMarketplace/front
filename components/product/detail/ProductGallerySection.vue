<template>
  <v-card
    flat
    class="pa-4 d-flex flex-column align-center rounded-xl gallery-full-height"
  >
    <div class="gallery-swiper-container position-relative">
      <button class="gallery-prev-nav-btn">
        <v-icon class="">mdi-arrow-right</v-icon>
      </button>

      <button class="gallery-next-nav-btn">
        <v-icon class="">mdi-arrow-left</v-icon>
      </button>

      <div v-if="staticsUrl">
        <swiper
          :spaceBetween="10"
          :navigation="{
            nextEl: '.gallery-next-nav-btn',
            prevEl: '.gallery-prev-nav-btn',
          }"
          :thumbs="{ swiper: thumbsSwiper }"
          :modules="[SwiperNavigation, SwiperThumbs]"
          class="gallery-swiper"
        >
          <swiper-slide v-for="image in images" :key="image">
            <div class="p-gallery-img">
              <img :src="staticsUrl + image" />
            </div>
          </swiper-slide>
        </swiper>
      </div>
      <div v-if="staticsUrl">
        <swiper
          :breakpoints="config.breakpoints"
          @swiper="setThumbsSwiper"
          :loop="true"
          :modules="[SwiperNavigation, SwiperThumbs]"
          class="p-thumb-swiper"
        >
          <swiper-slide v-for="image in images" :key="image">
            <div
              class="p-thumb-swiper-img rounded-lg overflow-hidden position-relative"
            >
              <img class="" :src="staticsUrl + image" />
            </div>
          </swiper-slide>
        </swiper>
      </div>
    </div>
    <div class="thumbs-swiper-container mt-4"></div>
  </v-card>
</template>

<script setup lang="ts">
const props = defineProps<{ images: string[]; selectedImage: string }>();
const emit = defineEmits(["select-image"]);
const staticsUrl = ref("");
const runtimeConfig = useRuntimeConfig();
const thumbsSwiper = ref<any>(null);
const mainSwiperRef = ref<any>(null);

const config = ref({
  auto: {
    delay: 1000,
    disableOnInteraction: false,
  },
  breakpoints: {
    "320": {
      slidesPerView: 3,
      spaceBetween: 20,
    },
    "410": {
      slidesPerView: 4,
      spaceBetween: 20,
    },
    "640": {
      slidesPerView: 5,
      spaceBetween: 20,
    },
    "768": {
      slidesPerView: 6,
      spaceBetween: 5,
    },
    "840": {
      slidesPerView: 8,
      spaceBetween: 5,
    },
    "1024": {
      slidesPerView: 3,
      spaceBetween: 5,
    },
    "1200": {
      slidesPerView: 3,
      spaceBetween: 5,
    },
    "1400": {
      slidesPerView: 4,
      spaceBetween: 5,
    },
  },
});

const setThumbsSwiper = (swiper) => {
  thumbsSwiper.value = swiper;
};

watch(
  () => props.selectedImage,
  (val) => {
    if (mainSwiperRef.value && mainSwiperRef.value.swiper) {
      const idx = props.images.indexOf(val);
      if (idx !== mainSwiperRef.value.swiper.activeIndex) {
        mainSwiperRef.value.swiper.slideTo(idx);
      }
    }
  }
);
onBeforeMount(() => {
  staticsUrl.value = runtimeConfig.public.STATICS_URL;
});
onMounted(() => {});
</script>

<style scoped>
.gallery-full-height {
  height: 100%;
  min-height: 100%;
  display: flex;
  flex-direction: column;
}
.gallery-swiper-container {
  position: relative;
  width: 100%;
  height: 100%;
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.gallery-swiper {
  height: 100%;
  min-height: 300px;
}
.p-gallery-img {
  display: flex;
  justify-content: center;
}
.p-gallery-img img {
  height: 300px;
}
.gallery-swiper img {
  width: 70%;
  object-fit: contain;
}

.p-thumb-swiper {
  height: 100px;
}
.p-thumb-swiper-img {
  width: 4rem;
  height: 5rem;
  max-height: 5rem;
  overflow: hidden;
  position: relative;
  padding: 5px 8px;
  border-radius: 16px;
  background: transparent;
  transition: background 0.2s, box-shadow 0.2s;
}
.swiper-slide-thumb-active .p-thumb-swiper-img {
  background: #f5f5f7;
}
.p-thumb-swiper-img img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
.gallery-prev-nav-btn,
.gallery-next-nav-btn {
  position: absolute;
  top: 40%;
  z-index: 10;
  color: #424242;
  font-size: 1rem;
  display: none;
  align-items: center;
  justify-content: center;
  transform: translateY(-50%);
  cursor: pointer;
}
.gallery-prev-nav-btn {
  right: -5px;
}
.gallery-next-nav-btn {
  left: -5px;
}
.p-thumb-active {
  background: rgba(196, 196, 196, 0.21);
}
/* Ensure parent v-col is 100% height */
:deep(.v-col) {
  height: 100%;
}
@media (min-width: 960px) {
  .gallery-prev-nav-btn,
  .gallery-next-nav-btn {
    display: flex;
  }
}
</style>
