<script setup>

const selectedCoords = ref({ lat: null, lng: null })

onMounted(async () => {
  const L = await import('leaflet')
  await import('leaflet/dist/leaflet.css')

  const map = L.map('map').setView([35.6892, 51.3890], 13)

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map)

  let marker = null

  map.on('click', function (e) {
    const { lat, lng } = e.latlng
    selectedCoords.value = {
      lat: lat.toFixed(6),
      lng: lng.toFixed(6)
    }

    if (marker) map.removeLayer(marker)

    const customIcon = L.divIcon({
      html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#EC407A" width="30" height="30">
      <path d="M12 2C8.1 2 5 5.1 5 9c0 5.2 7 13 7 13s7-7.8 7-13c0-3.9-3.1-7-7-7m0 9.5c-1.4 0-2.5-1.1-2.5-2.5S10.6 6.5 12 6.5s2.5 1.1 2.5 2.5S13.4 11.5 12 11.5Z" />
    </svg>`,
      className: '',
      iconSize: [30, 30],
      iconAnchor: [15, 30],
    })

    marker = L.marker([lat, lng], { icon: customIcon }).addTo(map)
  })
})

let selectedAddress = ref('one')
let SelectedDeliverymethod = ref(null)

</script>
<template>
    <div class="d-flex flex-column ga-2 align-center">
        <ProcessOrderProgressBar/>
        <v-container fluid class="px-0">
            <v-row class="ga-4 justify-center" align="center" wrap>
                <!-- Form column -->
                <v-col cols="12" md="6" lg="5" order="1" order-md="1" class="d-flex justify-center">
                <div class="px-8 py-7 completionForm">
                    <p class="FromTitle">فرم تکمیل اطلاعات</p>
                    <v-radio-group class="mt-7" v-model="selectedAddress">
                    <v-radio label="مشهد - خیابان بهار - بهار ۶ - پلاک ۱۰ - طبقه اول" value="one" :class="['pa-3',{'selectedAddress' : selectedAddress == 'one'}]"></v-radio>
                    <v-radio label="تهران - ابتدا عباس آباد - خیابان نادری - پلاک ۶۰ - طبقه دوم" value="two" :class="['pa-3',{'selectedAddress' : selectedAddress == 'two'}]"></v-radio>
                    </v-radio-group>
                    <v-divider color="#000000d6" :thickness="1" class="mb-5"></v-divider>
                    <v-row class="gap-y-5">
                    <v-col cols="12" md="6">
                        <v-text-field label="نام" placeholder="وارد کنید" variant="outlined" hide-details style="border-radius: 12px !important;" />
                    </v-col>
                    <v-col cols="12" md="6">
                        <v-text-field label="نام خانوادگی" placeholder="وارد کنید" variant="outlined" hide-details />
                    </v-col>
                    <v-col cols="12" md="6">
                        <v-text-field label="ایمیل" placeholder="وارد کنید" variant="outlined" hide-details />
                    </v-col>
                    <v-col cols="12" md="6">
                        <v-text-field label="تلفن ثابت" placeholder="وارد کنید" variant="outlined" hide-details />
                    </v-col>
                    <v-col cols="12" md="6">
                        <v-text-field label="شماره تماس" placeholder="وارد کنید" variant="outlined" hide-details />
                    </v-col>
                    <v-col cols="12" md="6">
                        <v-text-field label="کد پستی" placeholder="وارد کنید" variant="outlined" hide-details />
                    </v-col>
                    <v-col cols="12">
                        <v-textarea label="آدرس" placeholder="وارد کنید" variant="outlined" hide-details></v-textarea>
                    </v-col>
                    </v-row>
                </div>
                </v-col>

                <!-- Map and select column -->
                <v-col cols="12" md="5" lg="4" order="2" order-md="2" class="d-flex flex-column justify-center align-center" >
                <div class="d-flex flex-column ga-4 w-100 align-center">
                    <div class="px-8 py-7 w-100  completionForm">
                    <p class="FromTitle">انتخاب موقعیت</p>
                    <div id="map" class="leaflet-map mt-7"></div>
                    </div>
                    <div class="px-8 py-7 w-100 completionForm">
                    <p class="FromTitle">نحوه ارسال</p>
                    <v-select
                        class="mt-7"
                        label="انتخاب نحوه ارسال"
                        :items="['تیپاکس', 'پست']"
                        variant="outlined"
                        v-model="SelectedDeliverymethod"
                    />
                    </div>
                </div>
                </v-col>
            </v-row>
        </v-container>

        <v-btn color="#424242" class="rounded-lg align-self-end mt-8">مرحله بعد</v-btn>
    </div>

</template>
<style scoped>
.completionForm{
    border-radius: 21px;
    background-color: white;
    max-width: 544px;
    min-width: 350px;
}
.FromTitle{
    border-right: 4px solid #424242;
    padding-right: 11px;
    font-size: 16px;
    font-weight: 400;
}

.selectedAddress {
    background-color: #F4F4F4;
    border-radius: 10px;
}

:deep(.v-field) {
  border-radius: 12px !important;
}
:deep(.addressInput .v-field) {
  min-height: 120px !important;
}
:deep(.v-container .v-field__input),
:deep(.v-container .v-label) {
  font-size: 13px;
  font-weight: 400;
}
.v-btn{
    margin-bottom: 150px;
}
:deep(.v-select__menu-icon){
    color: #EC407A !important;
    opacity: 1 !important;
}

.leaflet-map {
  width: 100%;
  min-width: 300px;
  height: 400px;
  border-radius: 12px;
}
</style>