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

      <div>
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
          <swiper-slide>
            <div class="p-gallery-img">
              <img src="/img/products/03.png" />
            </div> </swiper-slide
          ><swiper-slide>
            <div class="p-gallery-img">
              <img src="/img/products/03.png" />
            </div> </swiper-slide
          ><swiper-slide>
            <div class="p-gallery-img">
              <img src="/img/products/03.png" />
            </div>
          </swiper-slide>
          <swiper-slide>
            <div class="p-gallery-img">
              <img src="/img/products/03.png" />
            </div>
          </swiper-slide>
        </swiper>
      </div>
      <div>
        <swiper
          :breakpoints="config.breakpoints"
          @swiper="setThumbsSwiper"
          :loop="true"
          :modules="[SwiperNavigation, SwiperThumbs]"
          class="p-thumb-swiper"
        >
          <swiper-slide>
            <div
              class="p-thumb-swiper-img rounded-lg overflow-hidden position-relative"
            >
              <img class="" src="/img/products/03.png" />
            </div> </swiper-slide
          ><swiper-slide>
            <div
              class="p-thumb-swiper-img rounded-lg overflow-hidden position-relative"
            >
              <img class="" src="/img/products/03.png" />
            </div> </swiper-slide
          ><swiper-slide>
            <div
              class="p-thumb-swiper-img rounded-lg overflow-hidden position-relative"
            >
              <img src="/img/products/03.png" />
            </div>
          </swiper-slide>
          <swiper-slide>
            <div
              class="p-thumb-swiper-img rounded-lg overflow-hidden position-relative"
            >
              <img src="/img/products/03.png" />
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
const selectedIndex = computed(() => props.images.indexOf(props.selectedImage));

const thumbsSwiper = ref<any>(null);
const mainSwiperRef = ref<any>(null);

const config = ref({
  auto: {
    delay: 1000,
    disableOnInteraction: false,
  },
  breakpoints: {
    "320": {
      slidesPerView: 1.2,
      spaceBetween: 20,
    },
    "410": {
      slidesPerView: 1.4,
      spaceBetween: 20,
    },
    "640": {
      slidesPerView: 1.4,
      spaceBetween: 20,
    },
    "768": {
      slidesPerView: 2.4,
      spaceBetween: 20,
    },
    "1024": {
      slidesPerView: 3,
      spaceBetween: 20,
    },
    "1200": {
      slidesPerView: 3,
      spaceBetween: 20,
    },
    "1400": {
      slidesPerView: 3,
      spaceBetween: 5,
    },
  },
});

function onThumbsSwiper(swiper: any) {
  thumbsSwiper.value = swiper;
}

const setThumbsSwiper = (swiper) => {
  thumbsSwiper.value = swiper;
};

function selectThumb(img: string, i: number) {
  emit("select-image", img);
  // Move main swiper to the selected index
  if (mainSwiperRef.value && mainSwiperRef.value.swiper) {
    mainSwiperRef.value.swiper.slideTo(i);
  }
}

function onMainSlideChange(swiper: any) {
  const img = props.images[swiper.activeIndex];
  if (img && img !== props.selectedImage) emit("select-image", img);
}

// Watch for selectedImage changes and update main swiper
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
  display: flex;
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
</style>
