<script setup>

const selectedBank = ref('')

const cartItems = ref([
  { id: 1, name: 'تی شرت مردانه طرح ساده', quantity: 6, price: 12250,color: 'blue',model:'44M' },
  { id: 2, name: 'تی شرت مردانه طرح ساده', quantity: 6, price: 250,color: 'pink',model:'125GB' },
  { id: 3, name: 'تی شرت مردانه طرح ساده', quantity: 6, price: 250,color: 'black',model:'44M' },
])

let totalPrice = ref(0)

function increment(item) {
  if (item.quantity < 100) item.quantity++
}

function decrement(item) {
  if (item.quantity > 1) item.quantity--
}


function onQuantityChange(item) {
  if (item.quantity < 1) item.quantity = 1
  if (item.quantity > 100) item.quantity = 100
}

watch(cartItems, () => {
  totalPrice.value = cartItems.value.reduce((sum, item) => {
    return sum + item.price * item.quantity
  }, 0)
}, { deep: true, immediate: true })
</script>

<template>
    <div class="d-flex align-center justify-center flex-column">
        <ProcessOrderProgressBar :step-active="3"/>
        <v-container>
            <v-row>
            <v-col cols="12">
                <v-list two-line >
                <v-list-item
                    v-for="(item, index) in cartItems"
                    :key="item.id"
                    :class="{'bg-grey-light': index % 2 === 0}"
                    class="d-flex"
                >
                    <v-list-item-content class="d-flex align-center">
                    <div style="width: 100px;height: 100px;">
                        <img class="productImage" src="/assets/images/products/01.png"></img>
                    </div>
                    <div class="d-flex flex-column">
                        <v-list-item-title>{{ item.name }}</v-list-item-title>
                        <v-list-item-subtitle>
                            <div class="d-flex ga-3 mt-6 align-center">
                                <p class="bg-C4C4C4 text-white pa-2 rounded text-caption">{{ item.model }}</p>
                                <p class="colorCircle rounded-pill" :style="{ backgroundColor: item.color }"></p>
                            </div>
                        </v-list-item-subtitle>
                    </div>
                    
                    </v-list-item-content>

                    <v-list-item-action class="d-flex flex-column ga-4">
                        <div class="d-flex align-end ga-2">
                            <v-icon small class="mdi mdi-chevron-up bg-C4C4C4 rounded-pill" @click="increment(item)"></v-icon>
                            <v-text-field
                            v-model.number="item.quantity"
                            type="number"
                            min="1"
                            max="100"
                            dense
                            hide-details
                            variant="underlined"
                            style="max-width: 70px"
                            @change="onQuantityChange(item)"
                            />                              
                            <v-icon small class="mdi mdi-chevron-down bg-C4C4C4 rounded-pill" @click="decrement(item)"></v-icon>
                        </div>
                        
                        <div class="text-center d-flex align-center ga-1">
                            <p class="totalPrice">{{ (item.price * item.quantity).toLocaleString() }}</p>
                            <p class="totalPriceToman">تومان</p>
                        </div>
                    </v-list-item-action>
                </v-list-item>
                </v-list>
            </v-col>
            </v-row>
        </v-container>
        <div class="d-flex align-start ga-2">
            <v-text-field 
                class="couponInput"
                label="کدتخفیف"
                placeholder="وارد کنید"
                variant="outlined"
                density="compact"
                rounded="lg"
                >
            </v-text-field>
            <v-btn class="couponBtn">بررسی</v-btn>
        </div>
        <div class="d-flex flex-column flex-sm-row ga-4 mb-8">
            <div class="paymentForm d-flex flex-column justify-space-evenly ga-3">
                <div class="d-flex justify-space-between">
                    <p class="paymnetFormTitles">تخفیف:</p>
                    <div class="d-flex text-center ga-1 paymnetFormValues align-center">
                        4,800
                        <p class="paymnetFormSubtitles">تومان</p>
                    </div>
                </div>
                <div class="d-flex justify-space-between">
                    <p class="paymnetFormTitles">هزینه ارسال:</p>
                    <div class="d-flex text-center ga-1 paymnetFormValues align-center">
                        4,800
                        <p class="paymnetFormSubtitles">عدد</p>
                    </div>
                </div>
                <div class="d-flex justify-space-between">
                    <p class="paymnetFormTitles">مالیات:</p>
                    <div class="d-flex text-center ga-1 paymnetFormValues align-center">
                        4,800
                        <p class="paymnetFormSubtitles">گرم</p>
                    </div>
                </div>
                <v-divider class="dashed-divider my-4" />
                <div class="d-flex justify-space-between align-center">
                    <p class="paymnetFormTitles">قابل پرداخت:</p>
                    <div class="d-flex text-center ga-1 text-h6 align-center">
                        {{ totalPrice }}
                        <p class="paymnetFormSubtitles">تومان</p>
                    </div>
                </div>
            </div>
            <div class="paymentForm d-flex flex-column justify-space-between">
                <div class="d-flex ga-4 justify-center">
                    <div
                    class="bank-image-wrapper"
                    :class="{ selected: selectedBank === 'samanBank' }"
                    @click="selectedBank = 'img1'"
                    >
                    <img src="/assets/images/samanBank.png" alt="samanBank" class="bankImg" />
                    <span class="text-subtitle-2">درگاه بانک سامان</span>
                    <span class="mdi mdi-check-circle tick-icon" v-if="selectedBank === 'samanBank'"></span>
                    </div>

                    <div
                    class="bank-image-wrapper"
                    :class="{ selected: selectedBank === 'sadadBank' }"
                    @click="selectedBank = 'sadadBank'"
                    >
                    <img src="/assets/images/sadadBank.png" alt="sadadBank" class="bankImg" />
                    <span class="text-subtitle-2">درگاه بانک ملی</span>
                    <span class="mdi mdi-check-circle tick-icon" v-if="selectedBank === 'sadadBank'"></span>
                    </div>
                </div>
                <v-btn color="#424242" rounded="lg" class="text-body-2">پرداخت (۲۸۰ تومان)</v-btn>
            </div>
        </div>
    </div>
</template>

<style scoped>
.bg-grey-light {
  background-color: #F4F4F4;
}
.bg-C4C4C4{
    background-color: #C4C4C4;
}


.productImage{
    height: inherit;
    width: max-content;
}

:deep(.v-list ){
    border-radius: 25px;
    padding: 30px;
}

:deep(.v-list-item){
    border-radius: 15px !important;
    padding: 21px 38px !important;
}
:deep(.v-list-item__content){
    display: flex !important;
    justify-content: space-between;
    width: 100% ;
}
@media only screen and (max-width: 650px){
    :deep(.v-list-item__content){
    display: flex !important;
    flex-direction: column;
    justify-content: space-between;
    width: 100% ;
}
}


:deep(input[type='number'])::-webkit-outer-spin-button,
:deep(input[type='number'])::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
  text-align: center;
}
:deep(input[type='number']) {
  -moz-appearance: textfield;
  text-align: center;
}

:deep(input:focus) {
  background-color: transparent !important;
  box-shadow: none !important;
  outline: none !important;
}

.mdi {
  user-select: none;
  color: #424242;
}

.mdi:hover {
  color: #EC407A;
}
.totalPrice{
    color: #424242 !important;
    font-size: 15px !important;
    font-weight: 400 !important;
}
.totalPriceToman{
    font-size: 10px !important;
    font-weight: 400 !important;
    color: #00000070 !important;
}
.colorCircle{
    width: 21px !important;
    height: 21px !important;
}
.couponInput{
    max-width: 291px !important;
    min-width: 180px !important;
}
.couponBtn{
    color: #424242 !important;
    background-color: initial !important;
    box-shadow: none;
    border: 1px solid #424242;
    border-radius: 10px;
    padding: 8px;
    align-content: center;
    font-size: 14px !important;
    font-weight: 400 !important;
}
:deep(.couponInput .v-field__input) {
  font-size: 14px !important;
  font-weight: 400;
}
.paymentForm{
 min-width: 350px;
 background-color: rgba(255, 255, 255, 0.708);
 height: 218px;
 border-radius: 20px;
 padding: 28px 32px;
}

@media only screen and (max-width: 750px){
    .paymentForm{
        min-width: 280px;  
}
}
.dashed-divider {
  border-top: 1px dashed #ccc !important;
  opacity: 1 !important;
  margin: 4px;
}
.paymnetFormTitles{
    font-size: 13px !important;
    font-weight: 400 !important;
    color: #00000099;
}
.paymnetFormSubtitles{
    font-size: 10px !important;
    font-weight: 400 !important;
    color: #00000099;
}
.paymnetFormValues{
    font-size: 13px !important;
    font-weight: 400 !important;
    color: black;
}

.bank-image-wrapper {
  position: relative;
  border: 1px solid transparent;
  border-radius: 8px;
  padding: 16px;
  cursor: pointer;
  transition: border 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.bank-image-wrapper.selected {
  border: 1px solid #424242;
}

.bankImg {
  width: 74px;
  height: 52px;
}

.tick-icon {
  position: absolute;
  top: -8px;
  right: -8px;
  background-color: #424242;
  width: 20px;
  height: 20px;
  color: white;
  font-size: 20px;
  border-radius: 50%;
}
.tick-icon:before{
    top: -5px !important;
    position: relative;
  }
</style>