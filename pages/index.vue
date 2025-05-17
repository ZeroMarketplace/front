<template>
  <div class="comingSoon">
    <v-row no-gutters class="h100 d-flex justify-center justify-between text-center">
      <v-label class="text-h2 text-secondary">Coming Soon</v-label>
    </v-row>
    <v-row no-gutters class="h100 text-center d-flex flex-column justify-center">
      <p class="text-white text-h4 text-md-h2 d-block my-5">
        به زودی برمی‌گردیم
      </p>
      <p class="my-15">
        برمیگردیم تا:
      </p>
      <div class="mx-1 mx-md-5">
        <v-row>
          <v-col>
            <v-sheet height="20vh"
                     class="rounded text-center d-flex justify-center flex-column bg-secondary text-h6">
              {{ days }}
              روز
            </v-sheet>
          </v-col>
          <v-col>
            <v-sheet height="20vh"
                     class="rounded text-center d-flex justify-center flex-column bg-secondary text-h6">
              {{ hours }}
              ساعت
            </v-sheet>
          </v-col>
          <v-col>
            <v-sheet height="20vh"
                     class="rounded text-center d-flex justify-center flex-column bg-secondary text-h6">
              {{ minutes }}
              دقیقه
            </v-sheet>
          </v-col>
          <v-col>
            <v-sheet height="20vh"
                     class="rounded text-center d-flex justify-center flex-column bg-secondary text-h6">
              {{ seconds }}
              ثانیه
            </v-sheet>
          </v-col>
        </v-row>
      </div>
    </v-row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      countDownTime: new Date("March 20, 2024 00:00:00").getTime(),
      days         : '',
      hours        : '',
      minutes      : '',
      seconds      : ''
    }
  },
  methods: {},
  mounted() {
    setInterval(() => {
      let now      = new Date().getTime();
      let distance = this.countDownTime - now;
      this.days    = Math.floor(distance / (1000 * 60 * 60 * 24));
      this.hours   = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      this.minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      this.seconds = Math.floor((distance % (1000 * 60)) / 1000);
    }, 1000);
  }
}
</script>

<style scoped>
.comingSoon {
  width: 100%;
  height: 100vh;
  position: relative;
  background-image: linear-gradient(
      85deg,
      hsl(0deg 0% 0%) 0%,
      hsl(119deg 0% 3%) 17%,
      hsl(119deg 0% 6%) 29%,
      hsl(119deg 0% 8%) 39%,
      hsl(119deg 0% 9%) 46%,
      hsl(126deg 0% 11%) 53%,
      hsl(129deg 0% 12%) 58%,
      hsl(131deg 0% 14%) 63%,
      hsl(133deg 0% 16%) 68%,
      hsl(134deg 0% 17%) 71%,
      hsl(134deg 0% 19%) 75%,
      hsl(135deg 0% 21%) 77%,
      hsl(135deg 0% 23%) 80%,
      hsl(136deg 0% 24%) 82%,
      hsl(136deg 0% 26%) 85%,
      hsl(136deg 0% 28%) 86%,
      hsl(137deg 0% 30%) 88%,
      hsl(137deg 0% 32%) 90%,
      hsl(137deg 0% 33%) 91%,
      hsl(137deg 0% 35%) 93%,
      hsl(137deg 0% 37%) 95%,
      hsl(0deg 0% 39%) 100%
  );
}

.h100 {
  width: 100%;
  height: 100%;
  position: absolute;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
}
</style>