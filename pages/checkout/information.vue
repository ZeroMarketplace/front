<script setup>

const formIsValid = ref(false)
const formRef = ref(null)

const rules = {
  required: v => !!v || 'این فیلد الزامی است',
  email: v =>
    !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || 'ایمیل نامعتبر است',
  homePhone: v =>
    !v || (/^\d{11}$/.test(v)) || 'تلفن ثابت باید ۱۱ رقم باشد',
  cellPhone: v =>
    !v || (/^09\d{9}$/.test(v)) || 'شماره همراه نامعتبر است',
  postalCode: v =>
    !v || /^\d{10}$/.test(v) || 'کد پستی باید ۱۰ رقم باشد',
  address: v =>
    (v && v.length >= 25) || 'آدرس باید حداقل ۲۵ کاراکتر باشد',
  selectRequired: v => !!v || 'لطفاً یک گزینه را انتخاب کنید',
}

const informationForm = ref({
  'firstName':'',
  'lastName':'',
  'email':'',
  'telephone':'',
  'cellphone':'',
  'postCode':'',
  'address':'',
  'selectedCoords':{'lat':null,'lng':null},
  'deliveryMethod':'',
})
const newAddress = ref('')

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
    informationForm.value.selectedCoords = {
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

function log(){
  console.log(informationForm.value)
}

</script>
<template>
    <div class="d-flex flex-column ga-2 align-center">
        <ProcessOrderProgressBar :step-active="2"/>
        <v-container fluid class="px-0">
            <v-row class="ga-4 justify-center" align="center" wrap>
               
                <v-col cols="12" md="6" lg="5" order="1" order-md="1" class="d-flex justify-center">
                <div class="px-8 py-7 completionForm">
                    <p class="FromTitle">فرم تکمیل اطلاعات</p>
                    <v-radio-group class="mt-7" v-model="informationForm.address">
                      <v-radio label="مشهد - خیابان بهار - بهار ۶ - پلاک ۱۰ - طبقه اول" 
                        value="مشهد - خیابان بهار - بهار ۶ - پلاک ۱۰ - طبقه اول" 
                        :class="['pa-3', { selectedAddress: informationForm.address === 'مشهد - خیابان بهار - بهار ۶ - پلاک ۱۰ - طبقه اول' }]"
                        />
                      <v-radio 
                        label="تهران - ابتدا عباس آباد - خیابان نادری - پلاک ۶۰ - طبقه دوم" 
                        value="تهران - ابتدا عباس آباد - خیابان نادری - پلاک ۶۰ - طبقه دوم" 
                        :class="['pa-3', { selectedAddress: informationForm.address === 'تهران - ابتدا عباس آباد - خیابان نادری - پلاک ۶۰ - طبقه دوم' }]"/>
                    </v-radio-group>
                    <v-text-field 
                      v-model="newAddress" 
                      label="آدرس جدید" 
                      placeholder="وارد کنید" 
                      variant="outlined" 
                      class="mb-5" 
                      autocomplete="off"
                      :rules="[rules.address]"
                      validate-on="blur"
                      />
                    <v-divider color="#000000d6" :thickness="1" class="mb-5"></v-divider>
                    <v-form ref="formRef" v-model="formIsValid">
                      <v-row class="gap-y-5">
                        <v-col cols="12" md="6">
                            <v-text-field 
                              v-model="informationForm.firstName" 
                              label="نام" 
                              placeholder="وارد کنید" 
                              variant="outlined" 
                              :rules="[rules.required]"
                              validate-on="blur"
                               />
                        </v-col>
                        <v-col cols="12" md="6">
                            <v-text-field 
                              v-model="informationForm.lastName" 
                              label="نام خانوادگی" 
                              placeholder="وارد کنید" 
                              variant="outlined" 
                              :rules="[rules.required]"
                              validate-on="blur"
                             />
                        </v-col>
                        <v-col cols="12" md="6">
                            <v-text-field 
                              v-model="informationForm.email"
                              label="ایمیل" 
                              placeholder="وارد کنید" 
                              variant="outlined" 
                              :rules="[rules.email]" 
                              validate-on="blur"
                              />
                        </v-col>
                        <v-col cols="12" md="6">
                            <v-text-field
                              v-model="informationForm.telephone"
                              type="Number" 
                              label="تلفن ثابت" 
                              placeholder="وارد کنید" 
                              variant="outlined" 
                              :rules="[rules.homePhone]"
                              validate-on="blur"
                               />
                        </v-col>
                        <v-col cols="12" md="6">
                            <v-text-field 
                              v-model="informationForm.cellphone" 
                              type="Number" 
                              label="شماره تماس" 
                              placeholder="وارد کنید" 
                              variant="outlined"                               
                              :rules="[rules.cellPhone]"
                              validate-on="blur"
                               />
                        </v-col>
                        <v-col cols="12" md="6">
                            <v-text-field 
                              v-model="informationForm.postCode" 
                              type="Number" 
                              label="کد پستی" 
                              placeholder="وارد کنید" 
                              variant="outlined" 
                              :rules="[rules.postalCode]" 
                              validate-on="blur"
                            />
                        </v-col>
                        <v-col cols="12">
                            <v-textarea
                              v-model="informationForm.address"
                              label="آدرس"
                              placeholder="وارد کنید" 
                              variant="outlined" 
                              no-resize
                              :rules="[rules.address]"
                              validate-on="blur"
                              />
                        </v-col>
                      </v-row>
                    </v-form>
                </div>
                </v-col>

                
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
                        v-model="informationForm.deliveryMethod"
                        :rules="[rules.selectRequired]"
                    />
                    </div>
                </div>
                </v-col>
            </v-row>
        </v-container>

        <v-btn color="#424242" class="btnMinSize rounded-lg align-self-end px-8 ml-12" @click="log">مرحله بعد</v-btn>
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
    color: #424242;
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
:deep(.v-selection-control--dirty .v-selection-control__input > .v-icon){
  color: #424242;
}

/* Chrome, Safari, Edge, Opera */
:deep(input::-webkit-outer-spin-button),
:deep(input::-webkit-inner-spin-button) {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
:deep(input[type=number]) {
  -moz-appearance: textfield;
}

:deep(.leaflet-map .leaflet-control-attribution){
  display: none !important;
}
.btnMinSize{
  min-height: 45px !important;
  min-width: 140px !important;
}
</style>